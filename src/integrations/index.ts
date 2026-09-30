/**
 * Punto único de integración con sistemas externos.
 *
 * Cada operación de dominio registra eventos (`commitment.created`,
 * `blocker.resolved`, `session.closed`, ...). El store publica aquí los eventos
 * nuevos después de guardar. Para conectar Teams, Microsoft Graph, Power Automate,
 * Trello, un CRM o calendarios basta con registrar una `Integration`; la app no
 * necesita cambiar.
 *
 * Ejemplo (ver `teamsWebhook.ts`):
 *   registerIntegration(teamsWebhook('https://...webhook.office.com/...'));
 */
import type { AppData, DomainEvent } from '../domain/types';

export interface Integration {
  name: string;
  /** Qué eventos le interesan (prefijos). Vacío = todos. */
  events?: string[];
  handle(events: DomainEvent[], data: AppData): void | Promise<void>;
}

const registry: Integration[] = [];

export function registerIntegration(i: Integration): () => void {
  registry.push(i);
  return () => {
    const idx = registry.indexOf(i);
    if (idx >= 0) registry.splice(idx, 1);
  };
}

export function publish(events: DomainEvent[], data: AppData): void {
  if (!events.length) return;
  for (const i of registry) {
    const relevant = i.events?.length ? events.filter((e) => i.events!.some((p) => e.type.startsWith(p))) : events;
    if (!relevant.length) continue;
    try {
      void Promise.resolve(i.handle(relevant, data)).catch((err) => console.error(`[${i.name}]`, err));
    } catch (err) {
      console.error(`[${i.name}]`, err);
    }
  }
}
