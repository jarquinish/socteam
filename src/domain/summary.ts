/**
 * Resumen ejecutivo de la Weekly, orientado a ejecución (no es una minuta).
 * Se genera como texto plano apto para pegar en Microsoft Teams; `textToHtml`
 * produce la versión con formato para el portapapeles enriquecido.
 */
import { fmtDay, fmtLongDay, fmtWeekRange } from './dates';
import { effectivePriority } from './scoring';
import {
  activeProjects, byId, COMMITMENT_STATUS_LABEL, displayStatus, isOpen, isOverdue, personName, sortByDue,
} from './selectors';
import { closingIssues, groupIssues, ISSUE_GROUP_LABEL } from './validation';
import type { AppData, Commitment, Session, SessionSnapshot } from './types';

const plural = (n: number, one: string, many: string) => `${n} ${n === 1 ? one : many}`;

export function sessionStats(d: AppData, s: Session, now: Date) {
  const projects = activeProjects(d);
  const count = (p: 'P1' | 'P2' | 'P3') => projects.filter((x) => effectivePriority(x) === p).length;

  const detectedIds = new Set([
    ...s.openBlockerIdsAtStart,
    ...d.blockers.filter((b) => b.createdSessionId === s.id).map((b) => b.id),
  ]);
  const detected = d.blockers.filter((b) => detectedIds.has(b.id));
  const inWindow = (at: string) => at >= s.startedAt;

  const carriedOpen = s.carriedCommitmentIds
    .map((id) => byId(d.commitments, id))
    .filter((c): c is Commitment => !!c && isOpen(c));

  return {
    projects: { active: projects.length, p1: count('P1'), p2: count('P2'), p3: count('P3'), reviewed: s.reviewedProjectIds.length },
    blockers: {
      detected: detected.length,
      newInSession: detected.filter((b) => b.createdSessionId === s.id).length,
      resolved: detected.filter((b) => b.resolvedSessionId === s.id).length,
      followUp: detected.filter((b) => b.column !== 'resuelto').length,
    },
    commitments: {
      created: d.commitments.filter((c) => c.createdSessionId === s.id).length,
      previousPending: carriedOpen.length,
      overdue: d.commitments.filter((c) => isOverdue(c, now)).length,
      completed: d.commitments.filter((c) => c.completedSessionId === s.id).length,
      rescheduled: d.commitments.filter((c) => c.reschedules.some((r) => inWindow(r.at))).length,
      escalated: d.commitments.filter((c) => c.escalations.some((e) => inWindow(e.at))).length,
    },
  };
}

function commitmentBlock(d: AppData, c: Commitment, now: Date, n: number): string[] {
  const project = byId(d.projects, c.projectId);
  const status = COMMITMENT_STATUS_LABEL[displayStatus(c, now)];
  const lines = [
    `${n}. ${project?.name ?? 'Sin proyecto'}`,
    `Acción: ${ensurePeriod(c.action)}`,
    `Responsable: ${personName(d, c.ownerId) || 'SIN RESPONSABLE'}`,
  ];
  if (c.dependsOn) lines.push(`Dependencia: ${c.dependsOn.label}`);
  lines.push(`Fecha: ${c.dueDate ? fmtDay(c.dueDate) : 'SIN FECHA'}`);
  lines.push(`Hora: ${c.dueTime ?? 'SIN HORA'}`);
  let st = `Estado: ${status}`;
  if (c.reschedules.length) {
    const times = plural(c.reschedules.length, 'vez', 'veces');
    const original = c.originalDueDate ? `; original ${fmtDay(c.originalDueDate)}` : '';
    st += displayStatus(c, now) === 'reprogramado' ? ` (${times}${original})` : ` (reprogramado ${times}${original})`;
  }
  lines.push(st);
  return lines;
}

const ensurePeriod = (s: string) => (/[.!?]$/.test(s.trim()) ? s.trim() : `${s.trim()}.`);

export function buildSummaryText(d: AppData, s: Session, now: Date): string {
  const st = sessionStats(d, s, now);
  const open = sortByDue(d.commitments.filter((c) => isOpen(c) && !byId(d.projects, c.projectId)?.archived));
  const issues = closingIssues(d, s);

  const out: string[] = [
    'WEEKLY ALIGNMENT & UNBLOCK',
    d.settings.directionName,
    `Semana: ${fmtWeekRange(s.weekStart)}`,
    `Sesión: ${fmtLongDay(s.date)}`,
    '',
    'PROYECTOS',
    plural(st.projects.active, 'activo', 'activos'),
    `${st.projects.p1} P1`,
    `${st.projects.p2} P2`,
    `${st.projects.p3} P3`,
    '',
    'BLOQUEOS',
    plural(st.blockers.detected, 'detectado', 'detectados'),
    `${plural(st.blockers.resolved, 'resuelto', 'resueltos')} durante sesión`,
    `${st.blockers.followUp} ${st.blockers.followUp === 1 ? 'requiere' : 'requieren'} seguimiento`,
    '',
    'COMPROMISOS',
    plural(st.commitments.created, 'nuevo', 'nuevos'),
    plural(st.commitments.previousPending, 'pendiente anterior', 'pendientes anteriores'),
    plural(st.commitments.overdue, 'vencido', 'vencidos'),
  ];
  if (st.commitments.completed) out.push(plural(st.commitments.completed, 'cumplido en sesión', 'cumplidos en sesión'));
  if (st.commitments.rescheduled) out.push(plural(st.commitments.rescheduled, 'reprogramado', 'reprogramados'));
  if (st.commitments.escalated) out.push(plural(st.commitments.escalated, 'escalado', 'escalados'));

  out.push('', 'PENDIENTES Y COMPROMISOS');
  if (open.length === 0) out.push('', 'Sin compromisos abiertos.');
  open.forEach((c, i) => out.push('', ...commitmentBlock(d, c, now, i + 1)));

  if (issues.length) {
    out.push('', 'POR DEFINIR');
    for (const g of groupIssues(issues)) {
      const detail = g.kind === 'revision_pendiente'
        ? String(g.items.length)
        : [...new Set(g.items.map((i) => i.title))].join('; ');
      out.push(`• ${g.label}: ${detail}`);
    }
  }
  return out.join('\n');
}

/** Sólo tareas, responsables y deadlines. */
export function buildCommitmentsText(d: AppData, s: Session, now: Date): string {
  const open = sortByDue(d.commitments.filter((c) => isOpen(c) && !byId(d.projects, c.projectId)?.archived));
  const out = [`COMPROMISOS · Weekly ${fmtWeekRange(s.weekStart)}`, ''];
  if (open.length === 0) out.push('Sin compromisos abiertos.');
  for (const c of open) {
    const when = `${c.dueDate ? fmtDay(c.dueDate) : 'SIN FECHA'}, ${c.dueTime ?? 'SIN HORA'}`;
    const flag = isOverdue(c, now) ? ' [VENCIDO]' : '';
    const project = byId(d.projects, c.projectId)?.name;
    out.push(`• ${c.action.trim()} — ${personName(d, c.ownerId) || 'SIN RESPONSABLE'} — ${when}${flag}${project ? ` (${project})` : ''}`);
  }
  return out.join('\n');
}

export function buildSnapshot(d: AppData, s: Session, now: Date): SessionSnapshot {
  const st = sessionStats(d, s, now);
  return {
    ...st,
    warnings: closingIssues(d, s).map((i) => `${ISSUE_GROUP_LABEL[i.kind]}: ${i.title}`),
    summaryText: buildSummaryText(d, s, now),
    commitmentsText: buildCommitmentsText(d, s, now),
  };
}

const escapeHtml = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/**
 * Convierte el texto del resumen a HTML sencillo para que al pegar en Teams
 * se conserven títulos en negritas y etiquetas destacadas.
 */
export function textToHtml(text: string): string {
  const html = text
    .split('\n')
    .map((line, i) => {
      const t = escapeHtml(line);
      if (!t.trim()) return '';
      if (i === 0) return `<b style="font-size:16px">${t}</b>`;
      if (/^[A-ZÁÉÍÓÚÑ &·]+$/.test(line.trim()) || /^COMPROMISOS ·/.test(line)) return `<b>${t}</b>`;
      if (/^\d+\. /.test(line)) return `<b>${t}</b>`;
      const m = t.match(/^([A-Za-zÁÉÍÓÚáéíóúñÑ]+): (.*)$/);
      if (m) return `<b>${m[1]}:</b> ${m[2]}`;
      return t;
    })
    .join('<br>');
  return `<div style="font-family:Segoe UI,sans-serif">${html}</div>`;
}
