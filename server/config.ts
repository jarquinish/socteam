/** Configuración del servidor por variables de entorno (ver README → "Servidor"). */
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const env = process.env;
const bool = (v: string | undefined, def: boolean) => (v === undefined || v === '' ? def : /^(1|true|yes|si|sí)$/i.test(v));

const here = path.dirname(fileURLToPath(import.meta.url));

export const config = {
  port: Number(env.PORT ?? 8787),
  host: env.HOST ?? '0.0.0.0',
  /** Carpeta donde se guardan db.json, state.json y respaldos. */
  dataDir: path.resolve(env.DATA_DIR ?? path.join(process.cwd(), 'data')),
  /** Build del cliente (vite build). */
  staticDir: path.resolve(env.STATIC_DIR ?? path.join(here, '..', 'dist')),
  /** 'demo' carga datos de prueba la primera vez; 'empty' arranca vacío. */
  seed: (env.SEED ?? 'demo') as 'demo' | 'empty',
  /** URL pública de la app (para enlaces en Teams y calendario). */
  publicUrl: (env.PUBLIC_URL ?? '').replace(/\/$/, ''),

  /** 'easyauth' = Azure App Service Authentication (Microsoft Entra ID). */
  authMode: (env.AUTH_MODE ?? 'none') as 'none' | 'easyauth',
  /** Solo desarrollo: simula al usuario autenticado. */
  devUserEmail: env.DEV_USER_EMAIL,

  /** Webhook de Teams (Workflows / Power Automate "cuando se recibe una solicitud de webhook"). */
  teamsWebhookUrl: env.TEAMS_WEBHOOK_URL ?? '',
  /** Publicar el resumen automáticamente al cerrar la Weekly. */
  teamsAutoPublish: bool(env.TEAMS_AUTO_PUBLISH, true),
  /** Recordatorios de compromisos (24 h antes y al vencer). */
  reminders: bool(env.REMINDERS, true),
  reminderIntervalMs: Number(env.REMINDER_INTERVAL_MS ?? 60000),

  /** Si se define, los calendarios suscritos requieren ?token=... */
  calendarToken: env.CALENDAR_TOKEN ?? '',
};

export type Config = typeof config;
