/**
 * Store de la aplicación: mantiene `AppData`, ejecuta operaciones de dominio
 * sobre una copia, persiste con el `StorageAdapter` y publica eventos a las
 * integraciones registradas.
 */
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { DomainError, type Ctx } from '../domain/operations';
import type { AppData } from '../domain/types';
import { publish } from '../integrations';
import { createSeed, emptyData } from './seed';
import { LocalStorageAdapter, migrate, type StorageAdapter } from './storage';
import { useToast } from '../components/Toast';

type Op<A extends unknown[], R> = (d: AppData, ctx: Ctx, ...args: A) => R;

interface StoreValue {
  data: AppData;
  /** Ejecuta una operación de dominio. Devuelve `undefined` si falla la validación. */
  run<A extends unknown[], R>(op: Op<A, R>, ...args: A): R | undefined;
  resetDemo(): void;
  clearAll(): void;
  importData(json: string): boolean;
}

const StoreContext = createContext<StoreValue | null>(null);

const newId = () =>
  typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;

export function StoreProvider({ children, adapter }: { children: ReactNode; adapter?: StorageAdapter }) {
  const storage = useMemo(() => adapter ?? new LocalStorageAdapter(), [adapter]);
  const toast = useToast();
  const [data, setData] = useState<AppData>(() => {
    const loaded = storage.load();
    if (loaded) return loaded;
    const seed = createSeed(new Date());
    storage.save(seed);
    return seed;
  });
  const ref = useRef(data);

  const replace = useCallback((next: AppData, persist = true) => {
    ref.current = next;
    setData(next);
    if (persist) storage.save(next);
  }, [storage]);

  useEffect(() => storage.subscribe?.((d) => replace(d, false)), [storage, replace]);

  const run = useCallback(<A extends unknown[], R>(op: Op<A, R>, ...args: A): R | undefined => {
    const draft = structuredClone(ref.current);
    const before = draft.events.length;
    try {
      const result = op(draft, { now: new Date(), newId }, ...args);
      replace(draft);
      publish(draft.events.slice(before), draft);
      return result;
    } catch (e) {
      if (e instanceof DomainError) {
        toast(e.message, 'error');
        return undefined;
      }
      throw e;
    }
  }, [replace, toast]);

  const value = useMemo<StoreValue>(() => ({
    data,
    run,
    resetDemo: () => replace(createSeed(new Date())),
    clearAll: () => replace(emptyData()),
    importData: (json: string) => {
      try {
        const d = migrate(JSON.parse(json));
        if (!d) return false;
        replace(d);
        return true;
      } catch {
        return false;
      }
    },
  }), [data, run, replace]);

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
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
