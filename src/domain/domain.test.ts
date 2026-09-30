import { describe, expect, it } from 'vitest';
import { createSeed, emptyData } from '../data/seed';
import * as ops from './operations';
import { computeScore, effectivePriority, priorityFromScore } from './scoring';
import {
  dashboardStats, displayStatus, isBlockerActionable, meetingQueue, openBlockersOf, dependencyRows, bottlenecks,
} from './selectors';
import { buildCommitmentsText, buildSummaryText, textToHtml } from './summary';
import { closingIssues } from './validation';
import type { AppData } from './types';

// Miércoles 30 de septiembre de 2026, 10:00 hora local.
const NOW = new Date(2026, 8, 30, 10, 0);

function ctx(now = NOW): ops.Ctx {
  let n = 0;
  return { now, newId: () => `t-${++n}` };
}

function withProject(): { d: AppData; projectId: string; personId: string } {
  const d = emptyData();
  const c = ctx();
  const personId = ops.savePerson(d, c, { name: 'Diana', areaId: d.areas[0].id });
  const projectId = ops.saveProject(d, c, {
    name: 'Campaña Convención', areaId: d.areas[0].id, ownerId: personId,
    impact: 3, urgency: 3, dependency: 3, manualPriority: null,
  });
  return { d, projectId, personId };
}

describe('ponderación', () => {
  it('score = impacto + urgencia + dependencia y clasifica P1/P2/P3', () => {
    expect(computeScore({ impact: 3, urgency: 3, dependency: 3 })).toBe(9);
    expect(priorityFromScore(9)).toBe('P1');
    expect(priorityFromScore(8)).toBe('P1');
    expect(priorityFromScore(7)).toBe('P2');
    expect(priorityFromScore(6)).toBe('P2');
    expect(priorityFromScore(5)).toBe('P3');
    expect(priorityFromScore(3)).toBe('P3');
  });

  it('registra el ajuste manual de prioridad y lo retira al volver a automático', () => {
    const { d, projectId } = withProject();
    const input = {
      id: projectId, name: 'Campaña Convención', areaId: d.areas[0].id,
      impact: 1 as const, urgency: 1 as const, dependency: 1 as const,
    };
    ops.saveProject(d, ctx(), { ...input, manualPriority: 'P1', overrideReason: 'Pedido de Dirección General' });
    const p = d.projects[0];
    expect(effectivePriority(p)).toBe('P1');
    expect(p.override?.autoPriority).toBe('P3');
    expect(p.overrideLog).toHaveLength(1);
    ops.saveProject(d, ctx(), { ...input, manualPriority: null });
    expect(p.override).toBeUndefined();
    expect(effectivePriority(p)).toBe('P3');
    expect(p.overrideLog).toHaveLength(1);
  });
});

describe('bloqueos y compromisos', () => {
  it('crear un bloqueo marca el proyecto y crea el compromiso accionable', () => {
    const { d, projectId, personId } = withProject();
    const id = ops.createBlocker(d, ctx(), {
      projectId, kind: 'bloqueo', description: 'Falta validación', need: 'Validación Comercial',
      dependsOn: { type: 'direccion', label: 'Comercial' }, ownerId: personId,
      action: 'Validar condiciones', dueDate: '2026-10-02', dueTime: '13:00',
    });
    const b = d.blockers.find((x) => x.id === id)!;
    expect(d.projects[0].status).toBe('bloqueado');
    expect(b.commitmentId).toBeDefined();
    expect(isBlockerActionable(d, b)).toBe(true);
  });

  it('un bloqueo sin fecha/hora no es accionable y aparece al cerrar', () => {
    const { d, projectId, personId } = withProject();
    const c = ctx();
    const sid = ops.startSession(d, c);
    ops.createBlocker(d, c, {
      projectId, kind: 'bloqueo', description: 'Falta validación', need: '', ownerId: personId,
      action: 'Validar', sessionId: sid,
    });
    const kinds = closingIssues(d).map((i) => i.kind);
    expect(kinds).toContain('bloqueo_sin_compromiso');
    expect(kinds).toContain('compromiso_sin_fecha');
    expect(kinds).toContain('compromiso_sin_hora');
  });

  it('cumplir el compromiso resuelve el bloqueo y el proyecto vuelve a avanzar', () => {
    const { d, projectId, personId } = withProject();
    ops.createBlocker(d, ctx(), {
      projectId, kind: 'bloqueo', description: 'X', need: 'Y', ownerId: personId,
      action: 'Z', dueDate: '2026-10-02', dueTime: '13:00',
    });
    ops.completeCommitment(d, ctx(), d.commitments[0].id);
    expect(d.blockers[0].column).toBe('resuelto');
    expect(d.projects[0].status).toBe('avanza');
  });

  it('reprogramar exige fecha, hora y motivo, conserva la original y cuenta', () => {
    const { d, projectId, personId } = withProject();
    const cid = ops.createCommitment(d, ctx(), {
      action: 'Entregar KV', projectId, ownerId: personId, dueDate: '2026-09-25', dueTime: '12:00',
    });
    expect(() => ops.rescheduleCommitment(d, ctx(), cid, { date: '2026-10-01', time: '11:00', reason: '' })).toThrow();
    ops.rescheduleCommitment(d, ctx(), cid, { date: '2026-10-01', time: '11:00', reason: 'Cambio de copy' });
    ops.rescheduleCommitment(d, ctx(), cid, { date: '2026-10-02', time: '11:00', reason: 'Otra vez' });
    const c = d.commitments[0];
    expect(c.originalDueDate).toBe('2026-09-25');
    expect(c.dueDate).toBe('2026-10-02');
    expect(c.reschedules).toHaveLength(2);
    expect(c.status).toBe('reprogramado');
  });

  it('vencido se deriva de fecha + hora', () => {
    const { d, projectId } = withProject();
    const cid = ops.createCommitment(d, ctx(), { action: 'A', projectId, dueDate: '2026-09-30', dueTime: '09:59' });
    const c = d.commitments.find((x) => x.id === cid)!;
    expect(displayStatus(c, NOW)).toBe('vencido');
    expect(displayStatus(c, new Date(2026, 8, 30, 9, 0))).toBe('pendiente');
  });

  it('mover a Resuelto en el Kanban y regresar reabre el bloqueo', () => {
    const { d, projectId, personId } = withProject();
    const bid = ops.createBlocker(d, ctx(), {
      projectId, kind: 'bloqueo', description: 'X', need: 'Y', ownerId: personId,
      action: 'Z', dueDate: '2026-10-02', dueTime: '13:00',
    });
    ops.moveBlocker(d, ctx(), bid, 'resuelto');
    expect(d.commitments[0].status).toBe('cumplido');
    expect(d.projects[0].status).toBe('avanza');
    ops.moveBlocker(d, ctx(), bid, 'en_gestion');
    expect(d.commitments[0].status).toBe('en_gestion');
    expect(d.projects[0].status).toBe('bloqueado');
  });
});

describe('Weekly', () => {
  it('los datos de prueba cumplen lo pedido', () => {
    const d = createSeed(NOW);
    const count = (name: string) => d.projects.filter((p) => d.areas.find((a) => a.id === p.areaId)?.name === name).length;
    expect([count('Contenido'), count('Diseño'), count('Marketing Digital'), count('SOC Store')]).toEqual([4, 5, 4, 4]);
    const st = dashboardStats(d, NOW);
    expect(st.blocked).toBeGreaterThanOrEqual(4);
    expect(st.overdue).toBeGreaterThanOrEqual(1);
    expect(d.commitments.some((c) => c.reschedules.length > 0 && c.status !== 'cumplido')).toBe(true);
    const prios = new Set(d.projects.map(effectivePriority));
    expect(prios).toEqual(new Set(['P1', 'P2', 'P3']));
    expect(d.sessions.every((s) => s.snapshot?.summaryText.startsWith('WEEKLY ALIGNMENT & UNBLOCK'))).toBe(true);
  });

  it('una nueva Weekly arranca revisando los compromisos de la sesión anterior', () => {
    const d = createSeed(NOW);
    const c = ctx();
    const sid = ops.startSession(d, c);
    const s = d.sessions.find((x) => x.id === sid)!;
    expect(s.phase).toBe('revision');
    expect(s.carriedCommitmentIds.length).toBeGreaterThan(0);
    expect(s.completedSinceLastIds.length).toBeGreaterThan(0);
    const first = s.carriedCommitmentIds[0];
    ops.reviewCommitment(d, c, sid, first, 'si');
    expect(d.commitments.find((x) => x.id === first)!.status).toBe('cumplido');
    expect(s.reviews).toHaveLength(1);
  });

  it('orden del Modo Junta: P1 bloqueados primero', () => {
    const d = createSeed(NOW);
    const q = meetingQueue(d);
    expect(q[0].key).toBe('p1b');
    expect(q[0].projects.every((p) => effectivePriority(p) === 'P1' && p.status !== 'avanza')).toBe(true);
    expect(q[q.length - 1].optional).toBe(true);
  });

  it('cerrar la Weekly genera el resumen ejecutivo y los compromisos para Teams', () => {
    const d = createSeed(NOW);
    const c = ctx();
    const sid = ops.startSession(d, c);
    const p = d.projects.find((x) => x.name === 'Landing Hipotecaria')!;
    ops.setProjectStatus(d, c, p.id, 'avanza', sid);
    const s = d.sessions.find((x) => x.id === sid)!;
    const text = buildSummaryText(d, s, NOW);
    expect(text).toContain('Semana: 28 septiembre – 2 octubre');
    expect(text).toContain('1 resuelto durante sesión');
    expect(text).toContain('PENDIENTES Y COMPROMISOS');
    expect(text).toContain('Campaña Convención');
    expect(buildCommitmentsText(d, s, NOW)).toContain('Diana Morales');
    expect(textToHtml(text)).toContain('<b>PROYECTOS</b>');
    ops.closeSession(d, c, sid);
    expect(s.status).toBe('cerrada');
    expect(s.snapshot?.blockers.resolved).toBe(1);
    expect(openBlockersOf(d, p.id)).toHaveLength(0);
  });

  it('las dependencias muestran quién necesita qué de quién', () => {
    const d = createSeed(NOW);
    const rows = dependencyRows(d);
    expect(rows.some((r) => r.fromArea === 'Marketing Digital' && r.to === 'Diseño')).toBe(true);
    expect(rows.some((r) => r.fromArea === 'SOC Store' && r.to === 'Dirección de Finanzas')).toBe(true);
    expect(bottlenecks(rows)[0].count).toBeGreaterThanOrEqual(2);
  });
});
