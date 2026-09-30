/**
 * Backends de persistencia.
 * - LocalBackend: navegador (localStorage). Funciona sin servidor.
 * - ServerBackend: API de `server/` con versión optimista y avisos en tiempo real (SSE).
 * La app elige automáticamente: si responde `/api/health`, usa el servidor.
 */
import type { AppData } from '../domain/types';
import { LocalStorageAdapter, migrate } from './storage';
import type { Backend, PushResult } from './sync';

const VERSION_KEY = 'weekly-alignment-unblock:v1:version';

export class LocalBackend implements Backend {
  kind = 'local' as const;
  private storage = new LocalStorageAdapter();

  private readVersion() {
    try { return Number(localStorage.getItem(VERSION_KEY) ?? '0') || 0; } catch { return 0; }
  }

  async load() {
    return { data: this.storage.load(), version: this.readVersion() };
  }

  async push(data: AppData, baseVersion: number): Promise<PushResult> {
    const current = this.readVersion();
    if (current > baseVersion) {
      const latest = this.storage.load();
      if (latest) return { ok: false, conflict: { data: latest, version: current } };
    }
    const version = Math.max(current, baseVersion) + 1;
    this.storage.save(data);
    try { localStorage.setItem(VERSION_KEY, String(version)); } catch { /* sin storage */ }
    return { ok: true, version };
  }

  subscribe(onRemote: (version: number) => void) {
    const handler = (e: StorageEvent) => {
      if (e.key === VERSION_KEY && e.newValue) onRemote(Number(e.newValue));
    };
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }
}

export class ServerBackend implements Backend {
  kind = 'server' as const;
  constructor(private base = '') {}

  async load() {
    const r = await fetch(`${this.base}/api/data`, { credentials: 'same-origin', cache: 'no-store' });
    if (!r.ok) throw new Error(`GET /api/data ${r.status}`);
    const body = (await r.json()) as { data: unknown; version: number };
    return { data: body.data ? migrate(body.data) : null, version: body.version };
  }

  async push(data: AppData, baseVersion: number): Promise<PushResult> {
    const r = await fetch(`${this.base}/api/data`, {
      method: 'PUT',
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ baseVersion, data }),
    });
    if (r.status === 409) {
      const body = (await r.json()) as { data: AppData; version: number };
      return { ok: false, conflict: { data: migrate(body.data)!, version: body.version } };
    }
    if (!r.ok) throw new Error(`PUT /api/data ${r.status}`);
    const body = (await r.json()) as { version: number };
    return { ok: true, version: body.version };
  }

  subscribe(onRemote: (version: number) => void, onConnection?: (online: boolean) => void) {
    if (typeof EventSource === 'undefined') return () => {};
    const es = new EventSource(`${this.base}/api/stream`);
    es.addEventListener('version', (e) => onRemote(Number((e as MessageEvent).data)));
    es.onopen = () => onConnection?.(true);
    es.onerror = () => onConnection?.(false);
    return () => es.close();
  }
}

export interface ServerInfo {
  ok: boolean;
  teams: boolean;
  reminders: boolean;
  calendar: boolean;
  auth: 'none' | 'easyauth';
}

/** Detecta si hay servidor disponible. `VITE_STORAGE=local` fuerza el modo local. */
export async function detectServer(timeoutMs = 1500): Promise<ServerInfo | null> {
  if (import.meta.env?.VITE_STORAGE === 'local') return null;
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const r = await fetch('/api/health', { signal: ctrl.signal, cache: 'no-store' });
    if (!r.ok) return null;
    const info = (await r.json()) as ServerInfo;
    return info.ok ? info : null;
  } catch {
    return null;
  } finally {
    clearTimeout(t);
  }
}

export interface Me {
  email?: string;
  name?: string;
  personId?: string;
  /** true cuando la identidad viene del inicio de sesión corporativo. */
  authenticated: boolean;
}

export async function fetchMe(): Promise<Me | null> {
  try {
    const r = await fetch('/api/me', { credentials: 'same-origin', cache: 'no-store' });
    return r.ok ? ((await r.json()) as Me) : null;
  } catch {
    return null;
  }
}
