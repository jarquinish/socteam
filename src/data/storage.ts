/**
 * Persistencia. La app sólo conoce la interfaz `StorageAdapter`; hoy se usa
 * localStorage, mañana puede ser una API propia, SharePoint Lists o Dataverse
 * implementando los mismos tres métodos.
 */
import type { AppData } from '../domain/types';

export interface StorageAdapter {
  load(): AppData | null;
  save(data: AppData): void;
  clear(): void;
  /** Notifica cambios hechos desde otra pestaña/ventana. Devuelve la función para dejar de escuchar. */
  subscribe?(onExternalChange: (data: AppData) => void): () => void;
}

const KEY = 'weekly-alignment-unblock:v1';

/** Valida la forma mínima y aplica migraciones de versión cuando existan. */
export function migrate(raw: unknown): AppData | null {
  if (!raw || typeof raw !== 'object') return null;
  const d = raw as Partial<AppData>;
  if (d.version !== 1) return null;
  const lists = ['areas', 'people', 'projects', 'blockers', 'commitments', 'sessions', 'events'] as const;
  if (!lists.every((k) => Array.isArray(d[k]))) return null;
  if (!d.settings) return null;
  return d as AppData;
}

export class LocalStorageAdapter implements StorageAdapter {
  constructor(private key = KEY) {}

  load(): AppData | null {
    try {
      const raw = localStorage.getItem(this.key);
      return raw ? migrate(JSON.parse(raw)) : null;
    } catch {
      return null;
    }
  }

  save(data: AppData): void {
    try {
      localStorage.setItem(this.key, JSON.stringify(data));
    } catch (e) {
      console.error('No se pudo guardar en localStorage', e);
    }
  }

  clear(): void {
    try {
      localStorage.removeItem(this.key);
    } catch {
      /* sin acceso a storage */
    }
  }

  subscribe(onExternalChange: (data: AppData) => void) {
    const handler = (e: StorageEvent) => {
      if (e.key !== this.key || !e.newValue) return;
      try {
        const d = migrate(JSON.parse(e.newValue));
        if (d) onExternalChange(d);
      } catch {
        /* ignora valores corruptos */
      }
    };
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }
}
