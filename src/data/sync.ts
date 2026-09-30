/**
 * Motor de sincronización, independiente de React.
 *
 * - `confirmed`: última versión aceptada por el backend.
 * - `pending`: operaciones locales aún no confirmadas.
 * - La vista = confirmed + pending aplicadas en orden (UI optimista).
 *
 * Como cada cambio es una operación de dominio determinista, un conflicto de
 * versión (otra persona guardó antes) se resuelve tomando la versión más
 * reciente y reaplicando la operación encima: no se pierden cambios de nadie.
 */
import { DomainError } from '../domain/operations';
import type { AppData } from '../domain/types';

export type PushResult =
  | { ok: true; version: number }
  | { ok: false; conflict: { data: AppData; version: number } };

export interface Backend {
  kind: 'local' | 'server';
  load(): Promise<{ data: AppData | null; version: number }>;
  push(data: AppData, baseVersion: number): Promise<PushResult>;
  /** Avisa cuando otro cliente guardó una versión nueva. */
  subscribe?(onRemote: (version: number) => void, onConnection?: (online: boolean) => void): () => void;
}

export type SyncStatus = 'synced' | 'saving' | 'offline';

export interface SyncState {
  data: AppData;
  version: number;
  status: SyncStatus;
  pending: number;
}

interface PendingOp {
  apply: (d: AppData) => unknown;
}

export class SyncEngine {
  private confirmed: { data: AppData; version: number };
  private pending: PendingOp[] = [];
  private view: AppData;
  private status: SyncStatus = 'synced';
  private flushing = false;
  private retryTimer: ReturnType<typeof setTimeout> | null = null;
  private listeners = new Set<() => void>();
  private snapshot: SyncState;

  constructor(
    private backend: Backend,
    initial: { data: AppData; version: number },
    private hooks: { onRejected?: (message: string) => void; retryMs?: number } = {},
  ) {
    this.confirmed = initial;
    this.view = initial.data;
    this.snapshot = this.makeSnapshot();
  }

  get kind() {
    return this.backend.kind;
  }

  /** Escucha cambios de otros clientes. Devuelve la función para desconectar. */
  connect(): () => void {
    return this.backend.subscribe?.(() => void this.refresh(), (online) => this.setOnline(online)) ?? (() => {});
  }

  getState = (): SyncState => this.snapshot;

  subscribe = (fn: () => void) => {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  };

  /**
   * Aplica la operación a la vista actual (lanza DomainError si no es válida),
   * la encola y dispara el guardado. Devuelve el resultado de la operación.
   */
  run<R>(apply: (d: AppData) => R): R {
    const draft = structuredClone(this.view);
    const result = apply(draft);
    this.pending.push({ apply });
    this.view = draft;
    this.setStatus('saving');
    void this.flush();
    return result;
  }

  /** Otro cliente guardó: trae lo último y rearma la vista sobre ello. */
  async refresh(): Promise<void> {
    try {
      const latest = await this.backend.load();
      if (latest.data && latest.version > this.confirmed.version) {
        this.confirmed = { data: latest.data, version: latest.version };
        this.rebuildView();
      }
    } catch {
      this.setStatus('offline');
    }
  }

  setOnline(online: boolean) {
    if (!online) this.setStatus('offline');
    else if (this.pending.length) void this.flush();
    else {
      this.setStatus('synced');
      void this.refresh();
    }
  }

  async flush(): Promise<void> {
    if (this.flushing) return;
    this.flushing = true;
    try {
      while (this.pending.length) {
        const op = this.pending[0];
        const draft = structuredClone(this.confirmed.data);
        try {
          op.apply(draft);
        } catch (e) {
          // La operación ya no aplica sobre la versión vigente (p. ej. otro la eliminó).
          this.pending.shift();
          this.hooks.onRejected?.(e instanceof DomainError ? e.message : 'Un cambio no pudo aplicarse');
          this.rebuildView();
          continue;
        }
        let res: PushResult;
        try {
          res = await this.backend.push(draft, this.confirmed.version);
        } catch {
          this.setStatus('offline');
          this.scheduleRetry();
          return;
        }
        if (res.ok) {
          this.confirmed = { data: draft, version: res.version };
          this.pending.shift();
        } else {
          this.confirmed = res.conflict;
        }
        this.rebuildView();
      }
      this.setStatus('synced');
    } finally {
      this.flushing = false;
    }
  }

  private scheduleRetry() {
    if (this.retryTimer) return;
    this.retryTimer = setTimeout(() => {
      this.retryTimer = null;
      void this.flush();
    }, this.hooks.retryMs ?? 5000);
  }

  private rebuildView() {
    let d = this.confirmed.data;
    if (this.pending.length) {
      d = structuredClone(d);
      const keep: PendingOp[] = [];
      for (const op of this.pending) {
        try {
          op.apply(d);
          keep.push(op);
        } catch (e) {
          this.hooks.onRejected?.(e instanceof DomainError ? e.message : 'Un cambio no pudo aplicarse');
        }
      }
      this.pending = keep;
    }
    this.view = d;
    this.emit();
  }

  private setStatus(s: SyncStatus) {
    this.status = s;
    this.emit();
  }

  private makeSnapshot(): SyncState {
    return { data: this.view, version: this.confirmed.version, status: this.status, pending: this.pending.length };
  }

  private emit() {
    this.snapshot = this.makeSnapshot();
    for (const fn of this.listeners) fn();
  }
}

/** Reemplaza el contenido del borrador por otro AppData (restablecer, importar). */
export function replaceContents(target: AppData, source: AppData) {
  const copy = structuredClone(source);
  for (const k of Object.keys(target) as (keyof AppData)[]) delete target[k];
  Object.assign(target, copy);
}
