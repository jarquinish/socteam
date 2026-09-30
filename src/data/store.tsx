/**
 * Store de la aplicación.
 * - Arranca detectando el backend (servidor compartido o navegador).
 * - Ejecuta operaciones de dominio a través del SyncEngine (UI optimista + reintentos).
 * - Conoce la identidad del usuario ("¿quién soy?") y la registra en cada cambio.
 */
import {
  createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, useSyncExternalStore,
  type ReactNode,
} from 'react';
import { DomainError, type Ctx } from '../domain/operations';
import type { AppData, ID, Person } from '../domain/types';
import { publish } from '../integrations';
import { useToast } from '../components/Toast';
import { detectServer, fetchMe, LocalBackend, ServerBackend, type Me, type ServerInfo } from './backends';
import { createSeed, emptyData } from './seed';
import { migrate } from './storage';
import { replaceContents, SyncEngine, type Backend, type SyncState } from './sync';

type Op<A extends unknown[], R> = (d: AppData, ctx: Ctx, ...args: A) => R;

export interface Identity {
  person?: Person;
  /** true si viene del inicio de sesión corporativo (no se puede cambiar). */
  locked: boolean;
  email?: string;
  setPersonId(id: ID | undefined): void;
}

interface StoreValue {
  data: AppData;
  /** Ejecuta una operación de dominio. Devuelve `undefined` si falla la validación. */
  run<A extends unknown[], R>(op: Op<A, R>, ...args: A): R | undefined;
  resetDemo(): void;
  clearAll(): void;
  importData(json: string): boolean;
  sync: SyncState & { kind: Backend['kind'] };
  server: ServerInfo | null;
  me: Identity;
}

const StoreContext = createContext<StoreValue | null>(null);

const uuid = () =>
  typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;

const ME_KEY = 'weekly-alignment-unblock:me';
const readLocalMe = () => { try { return localStorage.getItem(ME_KEY) ?? undefined; } catch { return undefined; } };

interface Boot { engine: SyncEngine; server: ServerInfo | null; me: Me | null }

export function StoreProvider({ children, backend }: { children: ReactNode; backend?: Backend }) {
  const toast = useToast();
  const [boot, setBoot] = useState<Boot | null>(null);
  const [error, setError] = useState<string | null>(null);
  const toastRef = useRef(toast);
  toastRef.current = toast;

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const server = backend ? null : await detectServer();
      const b: Backend = backend ?? (server ? new ServerBackend() : new LocalBackend());
      let loaded: { data: AppData | null; version: number };
      try {
        loaded = await b.load();
      } catch {
        if (!cancelled) setError('No se pudo conectar con el servidor. Reintenta en unos segundos.');
        return;
      }
      const engine = new SyncEngine(b, { data: loaded.data ?? emptyData(), version: loaded.version }, {
        onRejected: (m) => toastRef.current(`Un cambio no se aplicó: ${m}`, 'error'),
      });
      if (!loaded.data) {
        const seed = createSeed(new Date());
        engine.run((d) => replaceContents(d, seed));
      }
      const me = server ? await fetchMe() : null;
      if (!cancelled) setBoot({ engine, server, me });
    })();
    return () => { cancelled = true; };
  }, [backend]);

  if (error) return <BootScreen message={error} />;
  if (!boot) return <BootScreen message="Cargando…" />;
  return <ReadyStore boot={boot}>{children}</ReadyStore>;
}

function ReadyStore({ boot, children }: { boot: Boot; children: ReactNode }) {
  const { engine, server } = boot;
  const toast = useToast();
  const state = useSyncExternalStore(engine.subscribe, engine.getState);
  const [localMe, setLocalMe] = useState<ID | undefined>(readLocalMe);

  // Cambios de otros clientes / pestañas.
  useEffect(() => engine.connect(), [engine]);

  // Avisa si se intenta cerrar con cambios sin guardar.
  useEffect(() => {
    const h = (e: BeforeUnloadEvent) => { if (engine.getState().pending) e.preventDefault(); };
    window.addEventListener('beforeunload', h);
    return () => window.removeEventListener('beforeunload', h);
  }, [engine]);

  const ssoPerson = boot.me?.personId;
  const personId = ssoPerson ?? localMe;
  const person = state.data.people.find((p) => p.id === personId);

  const setPersonId = useCallback((id: ID | undefined) => {
    setLocalMe(id);
    try {
      if (id) localStorage.setItem(ME_KEY, id);
      else localStorage.removeItem(ME_KEY);
    } catch { /* sin storage */ }
  }, []);

  const actorRef = useRef(person?.id);
  actorRef.current = person?.id;

  const run = useCallback(<A extends unknown[], R>(op: Op<A, R>, ...args: A): R | undefined => {
    // Contexto fijo: si hay que reaplicar la operación por un conflicto,
    // produce exactamente los mismos ids y marcas de tiempo.
    const now = new Date();
    const actorId = actorRef.current;
    const ids: string[] = [];
    let first = true;
    const apply = (d: AppData) => {
      let i = 0;
      const newId = () => {
        if (!ids[i]) ids[i] = uuid();
        return ids[i++];
      };
      const before = d.events.length;
      const r = op(d, { now, newId, actorId }, ...args);
      if (first) {
        first = false;
        publish(d.events.slice(before), d);
      }
      return r;
    };
    try {
      return engine.run(apply);
    } catch (e) {
      if (e instanceof DomainError) {
        toast(e.message, 'error');
        return undefined;
      }
      throw e;
    }
  }, [engine, toast]);

  const value = useMemo<StoreValue>(() => ({
    data: state.data,
    run,
    resetDemo: () => {
      const seed = createSeed(new Date());
      engine.run((d) => replaceContents(d, seed));
    },
    clearAll: () => {
      const blank = emptyData();
      engine.run((d) => replaceContents(d, blank));
    },
    importData: (json: string) => {
      try {
        const d = migrate(JSON.parse(json));
        if (!d) return false;
        engine.run((draft) => replaceContents(draft, d));
        return true;
      } catch {
        return false;
      }
    },
    sync: { ...state, kind: engine.kind },
    server,
    me: { person, locked: !!ssoPerson, email: boot.me?.email, setPersonId },
  }), [state, run, engine, server, person, ssoPerson, boot.me?.email, setPersonId]);

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

function BootScreen({ message }: { message: string }) {
  return (
    <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', color: 'var(--muted)' }}>
      <div style={{ textAlign: 'center' }}>
        <div className="brand-mark" style={{ margin: '0 auto 12px', width: 44, height: 44 }}>W&U</div>
        {message}
      </div>
    </div>
  );
}

export function useStore(): StoreValue {
  const v = useContext(StoreContext);
  if (!v) throw new Error('useStore fuera de StoreProvider');
  return v;
}

/** Reloj que se actualiza cada 30 s para que "VENCIDO" aparezca sin recargar. */
export function useNow(intervalMs = 30000): Date {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), intervalMs);
    return () => clearInterval(t);
  }, [intervalMs]);
  return now;
}
