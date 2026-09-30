import { describe, expect, it } from 'vitest';
import { createSeed } from '../data/seed';
import { dueReminders, newlyClosed, remindersCard, summaryCard } from '../../server/teams';
import { buildIcs, personCalendar } from './ics';
import { computeMetrics, periodSince } from './metrics';
import * as ops from './operations';

const NOW = new Date(2026, 8, 30, 10, 0);
const ctx = (): ops.Ctx => { let n = 0; return { now: NOW, newId: () => `t-${++n}`, actorId: 'per-1' }; };

describe('métricas', () => {
  it('calcula cumplimiento, reprogramaciones, bloqueos y dependencias', () => {
    const d = createSeed(NOW);
    const m = computeMetrics(d, NOW);
    expect(m.overall.total).toBe(d.commitments.length);
    expect(m.overall.onTime).toBe(2);
    expect(m.overall.overdue).toBe(1);
    expect(m.overall.rate).toBeCloseTo(2 / 3);
    expect(m.overall.reschedules).toBe(2);
    expect(m.blockers.resolved).toBe(1);
    expect(m.blockers.avgResolutionDays).toBeGreaterThan(8);
    expect(m.dependencies.waitedOn[0].count).toBeGreaterThanOrEqual(2);
    expect(m.trend).toHaveLength(2);
    expect(m.byArea.find((r) => r.label === 'Diseño')).toBeDefined();
  });

  it('filtra por periodo', () => {
    const d = createSeed(NOW);
    const all = computeMetrics(d, NOW);
    const recent = computeMetrics(d, NOW, periodSince(1, NOW));
    expect(recent.overall.total).toBeLessThan(all.overall.total);
  });
});

describe('bitácora de autor', () => {
  it('registra quién hizo cada cambio', () => {
    const d = createSeed(NOW);
    const p = d.projects[0];
    ops.createBlocker(d, ctx(), { projectId: p.id, kind: 'bloqueo', description: 'X', need: 'Y', action: 'Z', dueDate: '2026-10-02', dueTime: '10:00' });
    const b = d.blockers[d.blockers.length - 1];
    expect(b.history[0].by).toBe('per-1');
    expect(d.events[d.events.length - 1].actorId).toBe('per-1');
  });
});

describe('calendario', () => {
  it('genera un iCalendar válido con los compromisos abiertos', () => {
    const d = createSeed(NOW);
    const carolina = d.people.find((p) => p.name === 'Carolina Ruiz')!;
    const ics = personCalendar(d, carolina.id, { now: NOW, appUrl: 'https://weekly.soc' });
    expect(ics.startsWith('BEGIN:VCALENDAR\r\n')).toBe(true);
    expect(ics.match(/BEGIN:VEVENT/g)).toHaveLength(2);
    expect(ics).toContain('SUMMARY:Compromiso · Entregar KV final adaptado a la landing');
    expect(ics.split('\r\n').every((l) => new TextEncoder().encode(l).length <= 75)).toBe(true);
    expect(buildIcs(d, [], { calendarName: 'x', now: NOW })).toContain('END:VCALENDAR');
  });
});

describe('Teams', () => {
  it('avisa una sola vez de vencidos recientes y próximos 24 h', () => {
    const d = createSeed(NOW);
    const state = { sent: {} as Record<string, string> };
    // 30 sep 18:00: vence en 24 h lo del 1 oct antes de las 18:00.
    const at = new Date(2026, 8, 30, 18, 0);
    const first = dueReminders(d, at, state);
    expect(first.soon.length).toBeGreaterThan(0);
    // El vencido es del 25 sep: más de 24 h, no se avisa para no inundar el canal.
    expect(first.overdue).toHaveLength(0);
    const again = dueReminders(d, at, state);
    expect(again.soon).toHaveLength(0);
    // Al vencer uno de los próximos, se avisa como vencido.
    const later = dueReminders(d, new Date(2026, 9, 1, 12, 5), state);
    expect(later.overdue.length).toBeGreaterThan(0);
    const card = remindersCard(d, first.soon, later.overdue);
    expect(JSON.stringify(card)).toContain('application/vnd.microsoft.card.adaptive');
  });

  it('detecta la Weekly recién cerrada y arma la tarjeta del resumen', () => {
    const before = createSeed(NOW);
    const after = structuredClone(before);
    const sid = ops.startSession(after, ctx());
    const mid = structuredClone(after);
    ops.closeSession(after, ctx(), sid);
    expect(newlyClosed(mid, after).map((s) => s.id)).toEqual([sid]);
    expect(newlyClosed(after, after)).toHaveLength(0);
    const text = after.sessions.find((s) => s.id === sid)!.snapshot!.summaryText;
    const body = (summaryCard(text).attachments[0].content as unknown as { body: { text: string; weight?: string }[] }).body;
    expect(body[0].text).toBe('WEEKLY ALIGNMENT & UNBLOCK');
    expect(body.some((b) => b.text === 'PENDIENTES Y COMPROMISOS' && b.weight === 'Bolder')).toBe(true);
  });
});
