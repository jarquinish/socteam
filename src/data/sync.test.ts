import { describe, expect, it } from 'vitest';
import * as ops from '../domain/operations';
import type { AppData } from '../domain/types';
import { emptyData } from './seed';
import { SyncEngine, type Backend, type PushResult } from './sync';

/** Servidor en memoria con control de versión optimista, como el real. */
class MemoryServer {
  version = 1;
  data: AppData = emptyData();
  offline = false;
  client(): Backend {
    return {
      kind: 'server',
      load: async () => ({ data: structuredClone(this.data), version: this.version }),
      push: async (data, base): Promise<PushResult> => {
        if (this.offline) throw new Error('offline');
        if (base !== this.version) return { ok: false, conflict: { data: structuredClone(this.data), version: this.version } };
        this.data = structuredClone(data);
        this.version += 1;
        return { ok: true, version: this.version };
      },
    };
  }
}

const init = async (s: MemoryServer) => {
  const l = await s.client().load();
  return { data: l.data!, version: l.version };
};

const tick = () => new Promise((r) => setTimeout(r, 0));

function op<A extends unknown[], R>(fn: (d: AppData, c: ops.Ctx, ...a: A) => R, ...args: A) {
  const now = new Date(2026, 8, 30, 10);
  const ids: string[] = [];
  return (d: AppData) => {
    let i = 0;
    return fn(d, { now, newId: () => (ids[i] ??= `id-${Math.random().toString(36).slice(2)}`, ids[i++]) }, ...args);
  };
}

describe('SyncEngine', () => {
  it('dos clientes editan a la vez y no se pierde ningún cambio', async () => {
    const server = new MemoryServer();
    const a = new SyncEngine(server.client(), await init(server));
    const b = new SyncEngine(server.client(), await init(server));

    a.run(op(ops.savePerson, { name: 'Diana' }));
    await tick();
    // b todavía cree que está en la versión 1: su push choca y se reaplica.
    b.run(op(ops.savePerson, { name: 'Carolina' }));
    await tick(); await tick();

    expect(server.data.people.map((p) => p.name).sort()).toEqual(['Carolina', 'Diana']);
    expect(b.getState().status).toBe('synced');
    expect(b.getState().data.people).toHaveLength(2);
  });

  it('la vista es optimista y los ids se conservan al reaplicar', async () => {
    const server = new MemoryServer();
    const a = new SyncEngine(server.client(), await init(server));
    server.data.people.push({ id: 'otro', name: 'Otro' });
    server.version += 1;
    const id = a.run(op(ops.savePerson, { name: 'Diana' }));
    expect(a.getState().data.people.some((p) => p.id === id)).toBe(true);
    await tick(); await tick();
    expect(server.data.people.find((p) => p.name === 'Diana')?.id).toBe(id);
  });

  it('sin conexión conserva los cambios pendientes y reintenta', async () => {
    const server = new MemoryServer();
    server.offline = true;
    const a = new SyncEngine(server.client(), await init(server), { retryMs: 5 });
    a.run(op(ops.savePerson, { name: 'Diana' }));
    await tick();
    expect(a.getState().status).toBe('offline');
    expect(a.getState().pending).toBe(1);
    server.offline = false;
    await new Promise((r) => setTimeout(r, 20));
    expect(a.getState().status).toBe('synced');
    expect(server.data.people).toHaveLength(1);
  });

  it('descarta un cambio que ya no aplica y avisa', async () => {
    const server = new MemoryServer();
    const pid = 'p1';
    server.data.people.push({ id: pid, name: 'Diana' });
    server.version += 1;
    const a = new SyncEngine(server.client(), await init(server));
    // Otro cliente elimina a la persona.
    server.data.people = [];
    server.version += 1;
    const rejected: string[] = [];
    const b = new SyncEngine(server.client(), { data: a.getState().data, version: a.getState().version }, { onRejected: (m) => rejected.push(m) });
    b.run(op(ops.savePerson, { id: pid, name: 'Diana M.' }));
    await tick(); await tick();
    expect(rejected[0]).toMatch(/no encontrad/i);
    expect(b.getState().data.people).toHaveLength(0);
  });
});
