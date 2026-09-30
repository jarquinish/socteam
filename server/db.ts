/**
 * Almacenamiento del servidor: un documento JSON versionado.
 * Escritura atómica (archivo temporal + rename) y un respaldo por día.
 * Suficiente para un equipo de decenas de personas; para más, reemplazar
 * esta clase por SQL/Dataverse manteniendo la misma interfaz.
 */
import fs from 'node:fs';
import path from 'node:path';
import { migrate } from '../src/data/storage';
import type { AppData } from '../src/domain/types';

export interface Doc {
  version: number;
  data: AppData | null;
  updatedAt: string;
}

export class JsonDb {
  private doc: Doc;
  private file: string;

  constructor(private dir: string) {
    fs.mkdirSync(path.join(dir, 'backups'), { recursive: true });
    this.file = path.join(dir, 'db.json');
    this.doc = this.read();
  }

  private read(): Doc {
    try {
      const raw = JSON.parse(fs.readFileSync(this.file, 'utf8')) as Doc;
      return { version: raw.version ?? 0, data: raw.data ? migrate(raw.data) : null, updatedAt: raw.updatedAt ?? '' };
    } catch {
      return { version: 0, data: null, updatedAt: '' };
    }
  }

  get(): Doc {
    return this.doc;
  }

  /** Guarda si baseVersion coincide. Devuelve null si hay conflicto. */
  put(data: AppData, baseVersion: number): Doc | null {
    if (baseVersion !== this.doc.version) return null;
    const next: Doc = { version: this.doc.version + 1, data, updatedAt: new Date().toISOString() };
    const tmp = `${this.file}.${process.pid}.tmp`;
    fs.writeFileSync(tmp, JSON.stringify(next));
    fs.renameSync(tmp, this.file);
    this.doc = next;
    this.backup();
    return next;
  }

  private backup() {
    const day = new Date().toISOString().slice(0, 10);
    const target = path.join(this.dir, 'backups', `db-${day}.json`);
    if (!fs.existsSync(target)) fs.copyFileSync(this.file, target);
  }
}

/** Estado auxiliar del servidor (recordatorios enviados, resúmenes publicados). */
export class StateFile<T extends object> {
  private file: string;
  value: T;
  constructor(dir: string, name: string, initial: T) {
    this.file = path.join(dir, name);
    try {
      this.value = { ...initial, ...(JSON.parse(fs.readFileSync(this.file, 'utf8')) as T) };
    } catch {
      this.value = initial;
    }
  }
  save() {
    const tmp = `${this.file}.tmp`;
    fs.writeFileSync(tmp, JSON.stringify(this.value));
    fs.renameSync(tmp, this.file);
  }
}
