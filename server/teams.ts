/**
 * Publicación en Microsoft Teams mediante un webhook de Workflows
 * (plantilla "Publicar en un canal cuando se reciba una solicitud de webhook")
 * o un flujo de Power Automate. Se envía una Adaptive Card.
 */
import { combineDateTime, fmtDay } from '../src/domain/dates';
import { byId, isOpen, personName } from '../src/domain/selectors';
import type { AppData, Commitment, Session } from '../src/domain/types';

type Block = Record<string, unknown>;

export function card(body: Block[], actions: Block[] = []) {
  return {
    type: 'message',
    attachments: [
      {
        contentType: 'application/vnd.microsoft.card.adaptive',
        contentUrl: null,
        content: {
          $schema: 'http://adaptivecards.io/schemas/adaptive-card.json',
          type: 'AdaptiveCard',
          version: '1.4',
          msteams: { width: 'Full' },
          body,
          ...(actions.length ? { actions } : {}),
        },
      },
    ],
  };
}

const text = (t: string, extra: Block = {}): Block => ({ type: 'TextBlock', text: t, wrap: true, ...extra });

/** Convierte el resumen de texto de la Weekly en bloques de la tarjeta. */
export function summaryCard(summaryText: string, appUrl?: string) {
  const body: Block[] = [];
  const lines = summaryText.split('\n');
  let paragraph: string[] = [];
  const flush = () => {
    if (paragraph.length) body.push(text(paragraph.join('\n\n'), { spacing: 'Small' }));
    paragraph = [];
  };
  lines.forEach((line, i) => {
    const t = line.trim();
    if (i === 0) return body.push(text(t, { size: 'Large', weight: 'Bolder', color: 'Good' }));
    if (!t) return flush();
    if (/^[A-ZÁÉÍÓÚÑ &·]+$/.test(t) && t.length > 3) {
      flush();
      return body.push(text(t, { weight: 'Bolder', spacing: 'Medium', separator: true }));
    }
    if (/^\d+\. /.test(t)) {
      flush();
      return body.push(text(`**${t}**`, { spacing: 'Medium' }));
    }
    const m = t.match(/^([A-Za-zÁÉÍÓÚáéíóúñÑ]+): (.*)$/);
    paragraph.push(m ? `**${m[1]}:** ${m[2]}` : t);
  });
  flush();
  return card(body, appUrl ? [{ type: 'Action.OpenUrl', title: 'Abrir Weekly Alignment & Unblock', url: appUrl }] : []);
}

export function remindersCard(d: AppData, soon: Commitment[], overdue: Commitment[], appUrl?: string) {
  const line = (c: Commitment) => {
    const p = byId(d.projects, c.projectId);
    return `• **${c.action}** — ${personName(d, c.ownerId) || 'Sin responsable'} — ${c.dueDate ? fmtDay(c.dueDate) : ''} ${c.dueTime ?? ''}${p ? ` · ${p.name}` : ''}`;
  };
  const body: Block[] = [text('Weekly Alignment & Unblock · Recordatorios', { weight: 'Bolder', size: 'Medium', color: 'Good' })];
  if (overdue.length) {
    body.push(text(`VENCIDOS (${overdue.length})`, { weight: 'Bolder', color: 'Attention', spacing: 'Medium' }));
    body.push(text(overdue.map(line).join('\n\n')));
  }
  if (soon.length) {
    body.push(text(`VENCEN EN LAS PRÓXIMAS 24 H (${soon.length})`, { weight: 'Bolder', spacing: 'Medium' }));
    body.push(text(soon.map(line).join('\n\n')));
  }
  return card(body, appUrl ? [{ type: 'Action.OpenUrl', title: 'Ver compromisos', url: `${appUrl}/#/compromisos` }] : []);
}

export async function postToTeams(url: string, payload: unknown): Promise<void> {
  const r = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!r.ok) throw new Error(`Teams respondió ${r.status}: ${(await r.text()).slice(0, 200)}`);
}

/** Sesiones que pasaron a "cerrada" entre dos versiones del documento. */
export function newlyClosed(before: AppData | null, after: AppData): Session[] {
  const was = new Set((before?.sessions ?? []).filter((s) => s.status === 'cerrada').map((s) => s.id));
  return after.sessions.filter((s) => s.status === 'cerrada' && s.snapshot && !was.has(s.id));
}

export interface ReminderState {
  sent: Record<string, string>;
}

/**
 * Compromisos a recordar ahora. Cada aviso se envía una sola vez por
 * fecha/hora compromiso (si se reprograma, vuelve a avisar).
 */
export function dueReminders(d: AppData, now: Date, state: ReminderState) {
  const soon: Commitment[] = [];
  const overdue: Commitment[] = [];
  const DAY = 86400000;
  for (const c of d.commitments) {
    if (!isOpen(c) || !c.dueDate || !c.dueTime) continue;
    if (byId(d.projects, c.projectId)?.archived) continue;
    const due = combineDateTime(c.dueDate, c.dueTime).getTime();
    const stamp = `${c.dueDate}T${c.dueTime}`;
    const diff = due - now.getTime();
    if (diff > 0 && diff <= DAY && state.sent[`${c.id}|soon`] !== stamp) {
      soon.push(c);
      state.sent[`${c.id}|soon`] = stamp;
    } else if (diff <= 0 && state.sent[`${c.id}|overdue`] !== stamp) {
      // Sólo se avisan vencimientos recientes (no se inunda el canal al instalar).
      if (-diff <= DAY) overdue.push(c);
      state.sent[`${c.id}|overdue`] = stamp;
    }
  }
  return { soon, overdue };
}
