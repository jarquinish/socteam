/**
 * EJEMPLO (no registrado por defecto): publica el resumen de la Weekly en un
 * canal de Microsoft Teams al cerrar la sesión, usando un flujo de Power Automate
 * o un webhook entrante ("Workflows" en Teams).
 *
 * Para activarlo, en `src/main.tsx`:
 *   import { registerIntegration } from './integrations';
 *   import { teamsWebhook } from './integrations/teamsWebhook';
 *   registerIntegration(teamsWebhook(import.meta.env.VITE_TEAMS_WEBHOOK_URL));
 *
 * El mismo patrón sirve para Microsoft Graph (crear tareas en Planner / To Do,
 * eventos de calendario por cada compromiso), Trello o un CRM.
 */
import type { Integration } from './index';

export function teamsWebhook(url: string): Integration {
  return {
    name: 'teams-webhook',
    events: ['session.closed'],
    async handle(events, data) {
      for (const e of events) {
        const session = data.sessions.find((s) => s.id === e.entityId);
        if (!session?.snapshot) continue;
        await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: session.snapshot.summaryText }),
        });
      }
    },
  };
}
