/**
 * Operaciones de dominio. Cada función recibe un borrador mutable de `AppData`
 * (el store se encarga de clonar, persistir y notificar) y un contexto con el
 * reloj y el generador de ids, lo que las hace deterministas y testeables.
 */
import { autoPriority } from './scoring';
import {
  byId, currentSession, isOpen, lastClosedSession, openBlockersOf,
} from './selectors';
import { buildSnapshot } from './summary';
import { combineDateTime, fmtDue, toISODate, weekStart } from './dates';
import type {
  AppData, Blocker, BlockerColumn, BlockerKind, Commitment, CommitmentStatus, DependencyRef,
  ID, Level, Priority, Project, ReviewResult, Session, SessionPhase,
} from './types';

export interface Ctx {
  now: Date;
  newId: () => ID;
}

export class DomainError extends Error {}

const MAX_EVENTS = 5000;

const stamp = (ctx: Ctx) => ctx.now.toISOString();

function emit(d: AppData, ctx: Ctx, type: string, entityId?: ID, data?: Record<string, unknown>) {
  d.events.push({ id: ctx.newId(), at: stamp(ctx), type, entityId, data });
  if (d.events.length > MAX_EVENTS) d.events.splice(0, d.events.length - MAX_EVENTS);
}

function mustGet<T extends { id: ID }>(list: T[], id: ID, what: string): T {
  const x = byId(list, id);
  if (!x) throw new DomainError(`${what} no encontrado`);
  return x;
}

const clean = (s?: string) => (s ?? '').trim();

/* ================================================================== */
/* Áreas y personas                                                    */
/* ================================================================== */

export interface AreaInput {
  id?: ID;
  name: string;
  color: string;
  managerId?: ID;
}

export function saveArea(d: AppData, ctx: Ctx, input: AreaInput): ID {
  const name = clean(input.name);
  if (!name) throw new DomainError('El área necesita un nombre');
  if (input.id) {
    const a = mustGet(d.areas, input.id, 'Área');
    Object.assign(a, { name, color: input.color, managerId: input.managerId || undefined });
    emit(d, ctx, 'area.updated', a.id);
    return a.id;
  }
  const id = ctx.newId();
  const order = Math.max(0, ...d.areas.map((a) => a.order)) + 1;
  d.areas.push({ id, name, color: input.color, managerId: input.managerId || undefined, order });
  emit(d, ctx, 'area.created', id);
  return id;
}

/** Elimina el área si no tiene proyectos; si los tiene, la archiva para conservar el historial. */
export function removeArea(d: AppData, ctx: Ctx, id: ID): 'deleted' | 'archived' {
  const a = mustGet(d.areas, id, 'Área');
  if (d.projects.some((p) => p.areaId === id)) {
    a.archived = true;
    emit(d, ctx, 'area.archived', id);
    return 'archived';
  }
  d.areas = d.areas.filter((x) => x.id !== id);
  d.people.forEach((p) => { if (p.areaId === id) p.areaId = undefined; });
  emit(d, ctx, 'area.deleted', id);
  return 'deleted';
}

export function restoreArea(d: AppData, ctx: Ctx, id: ID) {
  mustGet(d.areas, id, 'Área').archived = false;
  emit(d, ctx, 'area.restored', id);
}

export function moveArea(d: AppData, ctx: Ctx, id: ID, dir: -1 | 1) {
  const list = [...d.areas].sort((a, b) => a.order - b.order);
  const i = list.findIndex((a) => a.id === id);
  const j = i + dir;
  if (i < 0 || j < 0 || j >= list.length) return;
  const tmp = list[i].order;
  list[i].order = list[j].order;
  list[j].order = tmp;
  emit(d, ctx, 'area.reordered', id);
}

export interface PersonInput {
  id?: ID;
  name: string;
  areaId?: ID;
  role?: string;
}

export function savePerson(d: AppData, ctx: Ctx, input: PersonInput): ID {
  const name = clean(input.name);
  if (!name) throw new DomainError('La persona necesita un nombre');
  if (input.id) {
    const p = mustGet(d.people, input.id, 'Persona');
    Object.assign(p, { name, areaId: input.areaId || undefined, role: clean(input.role) || undefined });
    emit(d, ctx, 'person.updated', p.id);
    return p.id;
  }
  const id = ctx.newId();
  d.people.push({ id, name, areaId: input.areaId || undefined, role: clean(input.role) || undefined });
  emit(d, ctx, 'person.created', id);
  return id;
}

/** Elimina a la persona si no tiene asignaciones; si las tiene, la archiva. */
export function removePerson(d: AppData, ctx: Ctx, id: ID): 'deleted' | 'archived' {
  const p = mustGet(d.people, id, 'Persona');
  const used =
    d.projects.some((x) => x.ownerId === id) ||
    d.blockers.some((x) => x.ownerId === id) ||
    d.commitments.some((x) => x.ownerId === id);
  d.areas.forEach((a) => { if (a.managerId === id) a.managerId = undefined; });
  if (used) {
    p.archived = true;
    emit(d, ctx, 'person.archived', id);
    return 'archived';
  }
  d.people = d.people.filter((x) => x.id !== id);
  emit(d, ctx, 'person.deleted', id);
  return 'deleted';
}

/* ================================================================== */
/* Proyectos                                                           */
/* ================================================================== */

export interface ProjectInput {
  id?: ID;
  name: string;
  areaId: ID;
  ownerId?: ID;
  impact: Level;
  urgency: Level;
  dependency: Level;
  targetDate?: string;
  /** null = prioridad automática. */
  manualPriority: Priority | null;
  overrideReason?: string;
}

export function saveProject(d: AppData, ctx: Ctx, input: ProjectInput): ID {
  const name = clean(input.name);
  if (!name) throw new DomainError('El proyecto necesita un nombre');
  if (!input.areaId) throw new DomainError('Selecciona el área del proyecto');

  let p: Project;
  if (input.id) {
    p = mustGet(d.projects, input.id, 'Proyecto');
    Object.assign(p, {
      name,
      areaId: input.areaId,
      ownerId: input.ownerId || undefined,
      impact: input.impact,
      urgency: input.urgency,
      dependency: input.dependency,
      targetDate: input.targetDate || undefined,
      updatedAt: stamp(ctx),
    });
    emit(d, ctx, 'project.updated', p.id);
  } else {
    p = {
      id: ctx.newId(),
      name,
      areaId: input.areaId,
      ownerId: input.ownerId || undefined,
      impact: input.impact,
      urgency: input.urgency,
      dependency: input.dependency,
      targetDate: input.targetDate || undefined,
      overrideLog: [],
      status: 'avanza',
      archived: false,
      createdAt: stamp(ctx),
      updatedAt: stamp(ctx),
    };
    d.projects.push(p);
    emit(d, ctx, 'project.created', p.id);
  }

  applyPriority(d, ctx, p, input.manualPriority, input.overrideReason);
  return p.id;
}

/** Registra (o retira) el ajuste manual de prioridad de Dirección. */
function applyPriority(d: AppData, ctx: Ctx, p: Project, manual: Priority | null, reason?: string) {
  const auto = autoPriority(p);
  if (!manual || manual === auto) {
    if (p.override) {
      emit(d, ctx, 'project.priority_override_removed', p.id, { from: p.override.priority, auto });
      p.override = undefined;
    }
    return;
  }
  if (p.override?.priority === manual) {
    p.override.autoPriority = auto;
    if (reason !== undefined && clean(reason)) p.override.reason = clean(reason);
    return;
  }
  const o = { priority: manual, autoPriority: auto, reason: clean(reason) || undefined, at: stamp(ctx) };
  p.override = o;
  p.overrideLog.push(o);
  emit(d, ctx, 'project.priority_override', p.id, { priority: manual, auto });
}

export function setProjectArchived(d: AppData, ctx: Ctx, id: ID, archived: boolean) {
  const p = mustGet(d.projects, id, 'Proyecto');
  p.archived = archived;
  p.updatedAt = stamp(ctx);
  emit(d, ctx, archived ? 'project.archived' : 'project.unarchived', id);
}

/**
 * AVANZA o RESUELTO. Un proyecto que avanza o se resuelve no puede conservar
 * bloqueos abiertos: se marcan como resueltos (y sus compromisos como cumplidos).
 */
export function setProjectStatus(
  d: AppData, ctx: Ctx, id: ID, status: 'avanza' | 'resuelto', sessionId?: ID,
): number {
  const p = mustGet(d.projects, id, 'Proyecto');
  const open = openBlockersOf(d, id);
  for (const b of open) resolveBlocker(d, ctx, b.id, sessionId, false);
  p.status = status;
  p.updatedAt = stamp(ctx);
  emit(d, ctx, 'project.status', id, { status, resolvedBlockers: open.length });
  return open.length;
}

/** Deriva el estado del proyecto a partir de sus bloqueos abiertos. */
function recomputeProjectStatus(d: AppData, ctx: Ctx, projectId: ID) {
  const p = byId(d.projects, projectId);
  if (!p) return;
  const open = openBlockersOf(d, projectId);
  let next = p.status;
  if (open.some((b) => b.kind === 'bloqueo')) next = 'bloqueado';
  else if (open.some((b) => b.kind === 'decision')) next = 'decision';
  else if (p.status === 'bloqueado' || p.status === 'decision') next = 'avanza';
  if (next !== p.status) {
    p.status = next;
    p.updatedAt = stamp(ctx);
    emit(d, ctx, 'project.status', p.id, { status: next });
  }
}

/* ================================================================== */
/* Bloqueos                                                            */
/* ================================================================== */

export interface BlockerInput {
  projectId: ID;
  kind: BlockerKind;
  description: string;
  need: string;
  dependsOn?: DependencyRef;
  ownerId?: ID;
  /** Compromiso: acción concreta + fecha + hora. */
  action?: string;
  dueDate?: string;
  dueTime?: string;
  sessionId?: ID;
}

function blockerLog(b: Blocker, ctx: Ctx, text: string) {
  b.history.push({ at: stamp(ctx), text });
}

export function createBlocker(d: AppData, ctx: Ctx, input: BlockerInput): ID {
  mustGet(d.projects, input.projectId, 'Proyecto');
  const description = clean(input.description);
  if (!description) {
    throw new DomainError(
      input.kind === 'decision' ? 'Describe qué decisión se necesita' : 'Describe qué está bloqueando el proyecto',
    );
  }
  const b: Blocker = {
    id: ctx.newId(),
    projectId: input.projectId,
    kind: input.kind,
    description,
    need: clean(input.need),
    dependsOn: input.dependsOn,
    ownerId: input.ownerId || undefined,
    column: 'por_destrabar',
    createdAt: stamp(ctx),
    createdSessionId: input.sessionId,
    history: [],
  };
  blockerLog(b, ctx, input.kind === 'decision' ? 'Decisión pendiente registrada' : 'Bloqueo registrado');
  d.blockers.push(b);
  emit(d, ctx, 'blocker.created', b.id, { projectId: b.projectId, kind: b.kind, dependsOn: b.dependsOn?.label });

  if (clean(input.action)) {
    b.commitmentId = createCommitment(d, ctx, {
      action: input.action!,
      projectId: b.projectId,
      blockerId: b.id,
      ownerId: b.ownerId,
      dependsOn: b.dependsOn,
      dueDate: input.dueDate,
      dueTime: input.dueTime,
      sessionId: input.sessionId,
    });
    blockerLog(b, ctx, `Compromiso creado: ${clean(input.action)} (${fmtDue(input.dueDate, input.dueTime)})`);
  }
  recomputeProjectStatus(d, ctx, b.projectId);
  return b.id;
}

/**
 * Edita el bloqueo y su compromiso. Si el compromiso ya tenía fecha/hora,
 * cambiarlas es una reprogramación y se hace con `rescheduleCommitment`.
 */
export function updateBlocker(d: AppData, ctx: Ctx, id: ID, input: Omit<BlockerInput, 'projectId'>): true {
  const b = mustGet(d.blockers, id, 'Bloqueo');
  const description = clean(input.description);
  if (!description) throw new DomainError('Describe qué está bloqueando el proyecto');
  Object.assign(b, {
    kind: input.kind,
    description,
    need: clean(input.need),
    dependsOn: input.dependsOn,
    ownerId: input.ownerId || undefined,
  });
  blockerLog(b, ctx, 'Bloqueo actualizado');
  emit(d, ctx, 'blocker.updated', b.id);

  const c = byId(d.commitments, b.commitmentId);
  if (c) {
    updateCommitment(d, ctx, c.id, {
      action: clean(input.action) || c.action,
      projectId: b.projectId,
      ownerId: b.ownerId,
      dependsOn: b.dependsOn,
      dueDate: input.dueDate,
      dueTime: input.dueTime,
    });
  } else if (clean(input.action)) {
    b.commitmentId = createCommitment(d, ctx, {
      action: input.action!,
      projectId: b.projectId,
      blockerId: b.id,
      ownerId: b.ownerId,
      dependsOn: b.dependsOn,
      dueDate: input.dueDate,
      dueTime: input.dueTime,
      sessionId: input.sessionId,
    });
    blockerLog(b, ctx, `Compromiso creado: ${clean(input.action)} (${fmtDue(input.dueDate, input.dueTime)})`);
  }
  recomputeProjectStatus(d, ctx, b.projectId);
  return true;
}

export function moveBlocker(d: AppData, ctx: Ctx, id: ID, column: BlockerColumn, sessionId?: ID) {
  const b = mustGet(d.blockers, id, 'Bloqueo');
  if (b.column === column) return;
  if (column === 'resuelto') {
    resolveBlocker(d, ctx, id, sessionId);
    return;
  }
  const wasResolved = b.column === 'resuelto';
  b.column = column;
  const c = byId(d.commitments, b.commitmentId);
  if (wasResolved) {
    b.resolvedAt = undefined;
    b.resolvedSessionId = undefined;
    blockerLog(b, ctx, 'Bloqueo reabierto');
    if (c && c.status === 'cumplido') {
      c.status = 'pendiente';
      c.completedAt = undefined;
      c.completedSessionId = undefined;
    }
  }
  if (c && isOpen(c)) {
    if (column === 'en_gestion' && c.status === 'pendiente') c.status = 'en_gestion';
    if (column === 'por_destrabar' && c.status === 'en_gestion') c.status = 'pendiente';
  }
  blockerLog(b, ctx, `Movido a ${column === 'en_gestion' ? 'En gestión' : 'Por destrabar'}`);
  emit(d, ctx, 'blocker.moved', id, { column });
  recomputeProjectStatus(d, ctx, b.projectId);
}

export function resolveBlocker(d: AppData, ctx: Ctx, id: ID, sessionId?: ID, recompute = true) {
  const b = mustGet(d.blockers, id, 'Bloqueo');
  if (b.column === 'resuelto') return;
  b.column = 'resuelto';
  b.resolvedAt = stamp(ctx);
  b.resolvedSessionId = sessionId;
  blockerLog(b, ctx, 'Bloqueo resuelto');
  const c = byId(d.commitments, b.commitmentId);
  if (c && isOpen(c)) markCompleted(c, ctx, sessionId, 'Cumplido al resolverse el bloqueo');
  emit(d, ctx, 'blocker.resolved', id, { projectId: b.projectId, sessionId });
  if (recompute) recomputeProjectStatus(d, ctx, b.projectId);
}

/* ================================================================== */
/* Compromisos                                                         */
/* ================================================================== */

export interface CommitmentInput {
  action: string;
  projectId?: ID;
  blockerId?: ID;
  ownerId?: ID;
  dependsOn?: DependencyRef;
  dueDate?: string;
  dueTime?: string;
  sessionId?: ID;
}

export function createCommitment(d: AppData, ctx: Ctx, input: CommitmentInput): ID {
  const action = clean(input.action);
  if (!action) throw new DomainError('El compromiso necesita una acción concreta');
  const c: Commitment = {
    id: ctx.newId(),
    action,
    projectId: input.projectId || undefined,
    blockerId: input.blockerId,
    ownerId: input.ownerId || undefined,
    dependsOn: input.dependsOn,
    dueDate: input.dueDate || undefined,
    dueTime: input.dueTime || undefined,
    originalDueDate: input.dueDate || undefined,
    originalDueTime: input.dueTime || undefined,
    status: 'pendiente',
    reschedules: [],
    escalations: [],
    comments: [],
    createdAt: stamp(ctx),
    createdSessionId: input.sessionId,
    missedCount: 0,
  };
  d.commitments.push(c);
  emit(d, ctx, 'commitment.created', c.id, {
    projectId: c.projectId, ownerId: c.ownerId, dueDate: c.dueDate, dueTime: c.dueTime,
  });
  return c.id;
}

/**
 * Edita el compromiso. La fecha y la hora sólo se asignan si estaban vacías;
 * una vez definidas, cambiarlas es una reprogramación con motivo.
 */
export function updateCommitment(d: AppData, ctx: Ctx, id: ID, input: Omit<CommitmentInput, 'sessionId' | 'blockerId'>): true {
  const c = mustGet(d.commitments, id, 'Compromiso');
  const action = clean(input.action);
  if (!action) throw new DomainError('El compromiso necesita una acción concreta');
  c.action = action;
  c.projectId = input.projectId || undefined;
  c.ownerId = input.ownerId || undefined;
  c.dependsOn = input.dependsOn;
  if (!c.dueDate && input.dueDate) {
    c.dueDate = input.dueDate;
    c.originalDueDate = input.dueDate;
  }
  if (!c.dueTime && input.dueTime) {
    c.dueTime = input.dueTime;
    c.originalDueTime = input.dueTime;
  }
  const b = byId(d.blockers, c.blockerId);
  if (b) {
    b.ownerId = c.ownerId;
    b.dependsOn = c.dependsOn;
  }
  emit(d, ctx, 'commitment.updated', id);
  return true;
}

function markCompleted(c: Commitment, ctx: Ctx, sessionId: ID | undefined, note?: string) {
  c.status = 'cumplido';
  c.completedAt = stamp(ctx);
  c.completedSessionId = sessionId;
  if (note) c.comments.push({ at: stamp(ctx), text: note });
}

/** Marca como cumplido. Si es el compromiso de un bloqueo, el bloqueo queda resuelto. */
export function completeCommitment(d: AppData, ctx: Ctx, id: ID, sessionId?: ID) {
  const c = mustGet(d.commitments, id, 'Compromiso');
  if (!isOpen(c)) return;
  markCompleted(c, ctx, sessionId);
  emit(d, ctx, 'commitment.completed', id, { sessionId, late: isLate(c, ctx.now) });
  const b = byId(d.blockers, c.blockerId);
  if (b && b.column !== 'resuelto' && b.commitmentId === c.id) resolveBlocker(d, ctx, b.id, sessionId);
}

function isLate(c: Commitment, now: Date) {
  return !!c.dueDate && combineDateTime(c.dueDate, c.dueTime).getTime() < now.getTime();
}

/** Deshace "cumplido" (si se marcó por error). */
export function reopenCommitment(d: AppData, ctx: Ctx, id: ID) {
  const c = mustGet(d.commitments, id, 'Compromiso');
  if (isOpen(c)) return;
  c.status = c.reschedules.length ? 'reprogramado' : 'pendiente';
  c.completedAt = undefined;
  c.completedSessionId = undefined;
  c.comments.push({ at: stamp(ctx), text: 'Reabierto' });
  emit(d, ctx, 'commitment.reopened', id);
  const b = byId(d.blockers, c.blockerId);
  if (b && b.column === 'resuelto' && b.commitmentId === c.id) moveBlocker(d, ctx, b.id, 'en_gestion');
}

export function setCommitmentStatus(d: AppData, ctx: Ctx, id: ID, status: Extract<CommitmentStatus, 'pendiente' | 'en_gestion'>) {
  const c = mustGet(d.commitments, id, 'Compromiso');
  if (!isOpen(c)) return;
  c.status = status;
  emit(d, ctx, 'commitment.status', id, { status });
  const b = byId(d.blockers, c.blockerId);
  if (b && b.commitmentId === c.id && b.column !== 'resuelto') {
    const col: BlockerColumn = status === 'en_gestion' ? 'en_gestion' : 'por_destrabar';
    if (b.column !== col) {
      b.column = col;
      blockerLog(b, ctx, `Movido a ${col === 'en_gestion' ? 'En gestión' : 'Por destrabar'}`);
    }
  }
}

export interface RescheduleInput {
  date: string;
  time: string;
  reason: string;
  sessionId?: ID;
}

/** Reprogramar exige nueva fecha, nueva hora y motivo. La fecha original se conserva. */
export function rescheduleCommitment(d: AppData, ctx: Ctx, id: ID, input: RescheduleInput): true {
  const c = mustGet(d.commitments, id, 'Compromiso');
  if (!input.date) throw new DomainError('Indica la nueva fecha');
  if (!input.time) throw new DomainError('Indica la nueva hora');
  if (!clean(input.reason)) throw new DomainError('Indica el motivo de la reprogramación');
  c.reschedules.push({
    at: stamp(ctx),
    fromDate: c.dueDate,
    fromTime: c.dueTime,
    toDate: input.date,
    toTime: input.time,
    reason: clean(input.reason),
    sessionId: input.sessionId,
  });
  c.originalDueDate ??= c.dueDate ?? input.date;
  c.originalDueTime ??= c.dueTime ?? input.time;
  c.dueDate = input.date;
  c.dueTime = input.time;
  if (isOpen(c)) c.status = 'reprogramado';
  emit(d, ctx, 'commitment.rescheduled', id, { to: `${input.date} ${input.time}`, count: c.reschedules.length });
  const b = byId(d.blockers, c.blockerId);
  if (b) blockerLog(b, ctx, `Reprogramado a ${fmtDue(input.date, input.time)} — ${clean(input.reason)}`);
  return true;
}

export function escalateCommitment(d: AppData, ctx: Ctx, id: ID, input: { to: string; note?: string }): true {
  const c = mustGet(d.commitments, id, 'Compromiso');
  const to = clean(input.to) || 'Dirección';
  c.escalations.push({ at: stamp(ctx), to, note: clean(input.note) || undefined });
  if (isOpen(c)) c.status = 'escalado';
  c.comments.push({ at: stamp(ctx), text: `Escalado a ${to}${clean(input.note) ? `: ${clean(input.note)}` : ''}` });
  emit(d, ctx, 'commitment.escalated', id, { to });
  const b = byId(d.blockers, c.blockerId);
  if (b) blockerLog(b, ctx, `Escalado a ${to}`);
  return true;
}

export function commentCommitment(d: AppData, ctx: Ctx, id: ID, text: string): true {
  const c = mustGet(d.commitments, id, 'Compromiso');
  if (!clean(text)) throw new DomainError('Escribe el comentario');
  c.comments.push({ at: stamp(ctx), text: clean(text) });
  emit(d, ctx, 'commitment.commented', id);
  return true;
}

export function deleteCommitment(d: AppData, ctx: Ctx, id: ID) {
  const c = mustGet(d.commitments, id, 'Compromiso');
  d.commitments = d.commitments.filter((x) => x.id !== id);
  const b = byId(d.blockers, c.blockerId);
  if (b && b.commitmentId === id) {
    b.commitmentId = undefined;
    blockerLog(b, ctx, 'Compromiso eliminado');
  }
  emit(d, ctx, 'commitment.deleted', id);
}

/* ================================================================== */
/* Sesiones (Weekly)                                                   */
/* ================================================================== */

/** Inicia la Weekly (o devuelve la que está en curso). */
export function startSession(d: AppData, ctx: Ctx): ID {
  const existing = currentSession(d);
  if (existing) return existing.id;

  const prev = lastClosedSession(d);
  const since = prev?.closedAt ?? '';
  const carried = d.commitments.filter(isOpen).map((c) => c.id);
  const completedSinceLast = prev
    ? d.commitments
        .filter((c) => c.status === 'cumplido' && (c.completedAt ?? '') > since && c.completedSessionId !== prev.id)
        .map((c) => c.id)
    : [];

  const s: Session = {
    id: ctx.newId(),
    weekStart: toISODate(weekStart(ctx.now)),
    date: toISODate(ctx.now),
    startedAt: stamp(ctx),
    status: 'en_curso',
    phase: carried.length + completedSinceLast.length > 0 ? 'revision' : 'proyectos',
    previousSessionId: prev?.id,
    carriedCommitmentIds: carried,
    completedSinceLastIds: completedSinceLast,
    openBlockerIdsAtStart: d.blockers.filter((b) => b.column !== 'resuelto').map((b) => b.id),
    reviews: [],
    reviewedProjectIds: [],
  };
  d.sessions.push(s);
  emit(d, ctx, 'session.started', s.id);
  return s.id;
}

export function setSessionPhase(d: AppData, ctx: Ctx, sessionId: ID, phase: SessionPhase) {
  mustGet(d.sessions, sessionId, 'Sesión').phase = phase;
  emit(d, ctx, 'session.phase', sessionId, { phase });
}

export type ReviewExtra =
  | { kind: 'reprogramar'; date: string; time: string; reason: string }
  | { kind: 'escalar'; to: string; note?: string };

/** ¿Se cumplió? Sí / No / Reprogramar / Escalar. */
export function reviewCommitment(
  d: AppData, ctx: Ctx, sessionId: ID, commitmentId: ID, result: ReviewResult, extra?: ReviewExtra,
): true {
  const s = mustGet(d.sessions, sessionId, 'Sesión');
  const c = mustGet(d.commitments, commitmentId, 'Compromiso');
  switch (result) {
    case 'si':
      completeCommitment(d, ctx, c.id, sessionId);
      break;
    case 'no':
      c.missedCount += 1;
      c.comments.push({ at: stamp(ctx), text: 'Revisión Weekly: no se cumplió' });
      emit(d, ctx, 'commitment.missed', c.id, { sessionId });
      break;
    case 'reprogramar':
      if (extra?.kind !== 'reprogramar') throw new DomainError('Faltan fecha, hora y motivo');
      rescheduleCommitment(d, ctx, c.id, { ...extra, sessionId });
      break;
    case 'escalar':
      escalateCommitment(d, ctx, c.id, extra?.kind === 'escalar' ? extra : { to: 'Dirección' });
      break;
  }
  s.reviews = s.reviews.filter((r) => r.commitmentId !== commitmentId);
  s.reviews.push({ commitmentId, result, at: stamp(ctx) });
  return true;
}

export function markProjectReviewed(d: AppData, _ctx: Ctx, sessionId: ID, projectId: ID) {
  const s = mustGet(d.sessions, sessionId, 'Sesión');
  if (!s.reviewedProjectIds.includes(projectId)) s.reviewedProjectIds.push(projectId);
}

export function closeSession(d: AppData, ctx: Ctx, sessionId: ID) {
  const s = mustGet(d.sessions, sessionId, 'Sesión');
  if (s.status === 'cerrada') return;
  s.snapshot = buildSnapshot(d, s, ctx.now);
  s.status = 'cerrada';
  s.closedAt = stamp(ctx);
  emit(d, ctx, 'session.closed', s.id, {
    commitments: s.snapshot.commitments.created,
    blockers: s.snapshot.blockers.detected,
    warnings: s.snapshot.warnings.length,
  });
}

/** Descarta una Weekly iniciada por error. Los cambios hechos a proyectos se conservan. */
export function discardSession(d: AppData, ctx: Ctx, sessionId: ID) {
  const s = mustGet(d.sessions, sessionId, 'Sesión');
  if (s.status !== 'en_curso') throw new DomainError('Sólo se puede descartar una Weekly en curso');
  d.sessions = d.sessions.filter((x) => x.id !== sessionId);
  emit(d, ctx, 'session.discarded', sessionId);
}

/* ================================================================== */
/* Configuración                                                       */
/* ================================================================== */

export function saveSettings(d: AppData, ctx: Ctx, input: Partial<AppData['settings']>): true {
  const name = input.directionName !== undefined ? clean(input.directionName) : d.settings.directionName;
  if (!name) throw new DomainError('Escribe el nombre de la Dirección');
  const max = input.maxProjectsPerArea ?? d.settings.maxProjectsPerArea;
  d.settings = { directionName: name, maxProjectsPerArea: Math.max(1, Math.min(20, Math.round(max))) };
  emit(d, ctx, 'settings.updated');
  return true;
}
