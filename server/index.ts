/**
 * Servidor de Weekly Alignment & Unblock.
 *  - API de datos compartidos con control de versión optimista.
 *  - Avisos en tiempo real (Server-Sent Events).
 *  - Identidad vía Azure App Service Authentication (Microsoft Entra ID).
 *  - Resumen y recordatorios en Teams (webhook de Workflows / Power Automate).
 *  - Calendario suscribible por persona (.ics para Outlook).
 *  - Sirve el build del cliente.
 */
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { createSeed, emptyData } from '../src/data/seed';
import { migrate } from '../src/data/storage';
import { personCalendar } from '../src/domain/ics';
import { config } from './config';
import { JsonDb, StateFile } from './db';
import { dueReminders, newlyClosed, postToTeams, remindersCard, summaryCard, type ReminderState } from './teams';

const db = new JsonDb(config.dataDir);
const state = new StateFile<ReminderState & { published: string[] }>(config.dataDir, 'state.json', { sent: {}, published: [] });

if (!db.get().data) {
  db.put(config.seed === 'demo' ? createSeed(new Date()) : emptyData(), db.get().version);
  log(`Base de datos inicializada (${config.seed}) en ${config.dataDir}`);
}

function log(...args: unknown[]) {
  console.log(new Date().toISOString(), ...args);
}

/* ------------------------------------------------------------------ */
/* Identidad                                                           */
/* ------------------------------------------------------------------ */

interface Identity { email?: string; name?: string }

/** Lee la identidad que inyecta App Service Authentication (Easy Auth). */
function identityOf(req: http.IncomingMessage): Identity | null {
  const email = (req.headers['x-ms-client-principal-name'] as string | undefined) ?? config.devUserEmail;
  if (!email) return null;
  let name: string | undefined;
  const principal = req.headers['x-ms-client-principal'] as string | undefined;
  if (principal) {
    try {
      const p = JSON.parse(Buffer.from(principal, 'base64').toString('utf8')) as { claims?: { typ: string; val: string }[] };
      name = p.claims?.find((c) => c.typ === 'name')?.val;
    } catch { /* encabezado inválido */ }
  }
  return { email: email.toLowerCase(), name };
}

/* ------------------------------------------------------------------ */
/* Tiempo real                                                         */
/* ------------------------------------------------------------------ */

const clients = new Set<http.ServerResponse>();
function broadcast(version: number) {
  for (const res of clients) res.write(`event: version\ndata: ${version}\n\n`);
}
setInterval(() => { for (const res of clients) res.write(': ping\n\n'); }, 25000).unref();

/* ------------------------------------------------------------------ */
/* Teams                                                               */
/* ------------------------------------------------------------------ */

async function publishSummary(sessionId: string): Promise<void> {
  const data = db.get().data;
  const s = data?.sessions.find((x) => x.id === sessionId);
  if (!s?.snapshot) throw new Error('Sesión sin resumen');
  await postToTeams(config.teamsWebhookUrl, summaryCard(s.snapshot.summaryText, config.publicUrl || undefined));
  if (!state.value.published.includes(sessionId)) state.value.published.push(sessionId);
  state.save();
  log('Resumen publicado en Teams', sessionId);
}

async function runReminders() {
  const data = db.get().data;
  if (!data || !config.teamsWebhookUrl || !config.reminders) return;
  const snapshot = JSON.stringify(state.value.sent);
  const { soon, overdue } = dueReminders(data, new Date(), state.value);
  if (soon.length + overdue.length) {
    try {
      await postToTeams(config.teamsWebhookUrl, remindersCard(data, soon, overdue, config.publicUrl || undefined));
      log(`Recordatorios enviados: ${soon.length} próximos, ${overdue.length} vencidos`);
    } catch (e) {
      // Si falla, se revierte para reintentar en la siguiente vuelta.
      state.value.sent = JSON.parse(snapshot);
      log('Error enviando recordatorios', (e as Error).message);
      return;
    }
  }
  if (JSON.stringify(state.value.sent) !== snapshot) state.save();
}
if (config.reminders && config.teamsWebhookUrl) {
  setInterval(() => void runReminders(), config.reminderIntervalMs).unref();
  setTimeout(() => void runReminders(), 3000).unref();
}

/* ------------------------------------------------------------------ */
/* HTTP                                                                */
/* ------------------------------------------------------------------ */

const MAX_BODY = 8 * 1024 * 1024;

function send(res: http.ServerResponse, status: number, body: unknown, headers: Record<string, string> = {}) {
  const json = JSON.stringify(body);
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', ...headers });
  res.end(json);
}

function readBody(req: http.IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    let size = 0;
    const chunks: Buffer[] = [];
    req.on('data', (c: Buffer) => {
      size += c.length;
      if (size > MAX_BODY) {
        reject(new Error('too large'));
        req.destroy();
      } else chunks.push(c);
    });
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    req.on('error', reject);
  });
}

const MIME: Record<string, string> = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.woff2': 'font/woff2', '.woff': 'font/woff', '.svg': 'image/svg+xml', '.png': 'image/png', '.ico': 'image/x-icon',
  '.json': 'application/json',
};

function serveStatic(req: http.IncomingMessage, res: http.ServerResponse) {
  const url = new URL(req.url ?? '/', 'http://x');
  const rel = decodeURIComponent(url.pathname).replace(/^\/+/, '');
  let file = path.resolve(config.staticDir, rel || 'index.html');
  if (!file.startsWith(config.staticDir)) return send(res, 403, { error: 'forbidden' });
  if (!fs.existsSync(file) || fs.statSync(file).isDirectory()) file = path.join(config.staticDir, 'index.html');
  if (!fs.existsSync(file)) {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    return res.end('Build del cliente no encontrado. Ejecuta: npm run build');
  }
  const ext = path.extname(file);
  const immutable = rel.startsWith('assets/');
  res.writeHead(200, {
    'Content-Type': MIME[ext] ?? 'application/octet-stream',
    'Cache-Control': immutable ? 'public, max-age=31536000, immutable' : 'no-cache',
  });
  fs.createReadStream(file).pipe(res);
}

async function handleApi(req: http.IncomingMessage, res: http.ServerResponse, url: URL) {
  const route = `${req.method} ${url.pathname}`;

  if (route === 'GET /api/health') {
    return send(res, 200, {
      ok: true,
      teams: !!config.teamsWebhookUrl,
      reminders: !!config.teamsWebhookUrl && config.reminders,
      calendar: true,
      auth: config.authMode,
    });
  }

  // Calendario suscrito: Outlook no envía la sesión del usuario, así que se protege con token.
  const cal = url.pathname.match(/^\/api\/calendar\/([^/]+)\.ics$/);
  if (req.method === 'GET' && cal) {
    if (config.calendarToken && url.searchParams.get('token') !== config.calendarToken) return send(res, 401, { error: 'token' });
    const data = db.get().data;
    const person = data?.people.find((p) => p.id === cal[1]);
    if (!data || !person) return send(res, 404, { error: 'persona no encontrada' });
    res.writeHead(200, { 'Content-Type': 'text/calendar; charset=utf-8', 'Cache-Control': 'no-cache' });
    return res.end(personCalendar(data, person.id, { now: new Date(), appUrl: config.publicUrl || undefined }));
  }

  const who = identityOf(req);
  if (config.authMode === 'easyauth' && !who) return send(res, 401, { error: 'Inicia sesión con tu cuenta corporativa' });

  if (route === 'GET /api/me') {
    const data = db.get().data;
    const person = who?.email ? data?.people.find((p) => p.email?.toLowerCase() === who.email && !p.archived) : undefined;
    return send(res, 200, { email: who?.email, name: who?.name ?? person?.name, personId: person?.id, authenticated: !!who });
  }

  const link = url.pathname.match(/^\/api\/calendar-link\/([^/]+)$/);
  if (req.method === 'GET' && link) {
    const origin = config.publicUrl || `${(req.headers['x-forwarded-proto'] as string) ?? 'http'}://${req.headers.host}`;
    const q = config.calendarToken ? `?token=${encodeURIComponent(config.calendarToken)}` : '';
    const https = `${origin}/api/calendar/${encodeURIComponent(link[1])}.ics${q}`;
    return send(res, 200, { url: https, webcal: https.replace(/^https?:/, 'webcal:') });
  }

  if (route === 'GET /api/data') {
    const doc = db.get();
    return send(res, 200, { version: doc.version, data: doc.data });
  }

  if (route === 'PUT /api/data') {
    let body: { baseVersion: number; data: unknown };
    try {
      body = JSON.parse(await readBody(req));
    } catch {
      return send(res, 400, { error: 'JSON inválido' });
    }
    const data = migrate(body.data);
    if (!data || typeof body.baseVersion !== 'number') return send(res, 400, { error: 'Documento inválido' });
    const before = db.get().data;
    const saved = db.put(data, body.baseVersion);
    if (!saved) {
      const doc = db.get();
      return send(res, 409, { version: doc.version, data: doc.data });
    }
    broadcast(saved.version);
    send(res, 200, { version: saved.version });
    if (config.teamsWebhookUrl && config.teamsAutoPublish) {
      for (const s of newlyClosed(before, data)) {
        if (state.value.published.includes(s.id)) continue;
        publishSummary(s.id).catch((e) => log('Error publicando resumen', (e as Error).message));
      }
    }
    return;
  }

  if (route === 'GET /api/stream') {
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
      'X-Accel-Buffering': 'no',
    });
    res.write(`event: version\ndata: ${db.get().version}\n\n`);
    clients.add(res);
    req.on('close', () => clients.delete(res));
    return;
  }

  if (route === 'POST /api/teams/summary') {
    if (!config.teamsWebhookUrl) return send(res, 400, { error: 'Teams no está configurado (TEAMS_WEBHOOK_URL)' });
    try {
      const { sessionId } = JSON.parse(await readBody(req)) as { sessionId: string };
      await publishSummary(sessionId);
      return send(res, 200, { ok: true });
    } catch (e) {
      return send(res, 502, { error: (e as Error).message });
    }
  }

  if (route === 'POST /api/teams/test') {
    if (!config.teamsWebhookUrl) return send(res, 400, { error: 'Teams no está configurado (TEAMS_WEBHOOK_URL)' });
    try {
      await postToTeams(config.teamsWebhookUrl, summaryCard('WEEKLY ALIGNMENT & UNBLOCK\nConexión con Teams configurada correctamente.', config.publicUrl || undefined));
      return send(res, 200, { ok: true });
    } catch (e) {
      return send(res, 502, { error: (e as Error).message });
    }
  }

  return send(res, 404, { error: 'No encontrado' });
}

export const server = http.createServer((req, res) => {
  const url = new URL(req.url ?? '/', 'http://localhost');
  if (url.pathname.startsWith('/api/')) {
    handleApi(req, res, url).catch((e) => {
      log('Error', e);
      if (!res.headersSent) send(res, 500, { error: 'Error interno' });
    });
    return;
  }
  serveStatic(req, res);
});

server.listen(config.port, config.host, () => {
  log(`Weekly Alignment & Unblock en http://localhost:${config.port}`);
  log(`Datos: ${config.dataDir} · Auth: ${config.authMode} · Teams: ${config.teamsWebhookUrl ? 'sí' : 'no'}`);
});

