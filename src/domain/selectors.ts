import { combineDateTime } from './dates';
import { effectivePriority, PRIORITY_RANK, computeScore } from './scoring';
import type {
  AppData, Area, Blocker, Commitment, CommitmentDisplayStatus, DependencyRef, DependencyType,
  ID, Person, Priority, Project, ProjectStatus, Session,
} from './types';

/* ------------------------------------------------------------------ */
/* Etiquetas                                                           */
/* ------------------------------------------------------------------ */

export const PROJECT_STATUS_LABEL: Record<ProjectStatus, string> = {
  avanza: 'Avanza',
  bloqueado: 'Bloqueado',
  decision: 'Requiere decisión',
  resuelto: 'Resuelto',
};

export const COMMITMENT_STATUS_LABEL: Record<CommitmentDisplayStatus, string> = {
  pendiente: 'Pendiente',
  en_gestion: 'En gestión',
  reprogramado: 'Reprogramado',
  escalado: 'Escalado',
  cumplido: 'Cumplido',
  vencido: 'Vencido',
};

export const DEPENDENCY_TYPE_LABEL: Record<DependencyType, string> = {
  persona: 'Persona',
  area: 'Área interna',
  direccion: 'Otra Dirección',
  proveedor: 'Proveedor',
  tercero: 'Tercero',
};

export const BLOCKER_COLUMN_LABEL = {
  por_destrabar: 'Por destrabar',
  en_gestion: 'En gestión',
  resuelto: 'Resuelto',
} as const;

/* ------------------------------------------------------------------ */
/* Búsquedas                                                           */
/* ------------------------------------------------------------------ */

export function byId<T extends { id: ID }>(list: T[], id?: ID): T | undefined {
  return id ? list.find((x) => x.id === id) : undefined;
}

export const personName = (d: AppData, id?: ID) => byId(d.people, id)?.name ?? '';
export const areaName = (d: AppData, id?: ID) => byId(d.areas, id)?.name ?? '';

export function activeAreas(d: AppData): Area[] {
  return d.areas.filter((a) => !a.archived).sort((a, b) => a.order - b.order);
}

export function activePeople(d: AppData): Person[] {
  return d.people.filter((p) => !p.archived).sort((a, b) => a.name.localeCompare(b.name, 'es'));
}

export function projectArea(d: AppData, projectId?: ID): Area | undefined {
  const p = byId(d.projects, projectId);
  return p ? byId(d.areas, p.areaId) : undefined;
}

export function dependencyLabel(dep?: DependencyRef): string {
  return dep?.label ?? '';
}

/* ------------------------------------------------------------------ */
/* Proyectos                                                           */
/* ------------------------------------------------------------------ */

/** Proyectos en cartera: no archivados y no resueltos. */
export function activeProjects(d: AppData): Project[] {
  return d.projects.filter((p) => !p.archived && p.status !== 'resuelto');
}

export function sortProjects(list: Project[]): Project[] {
  return [...list].sort((a, b) => {
    const pr = PRIORITY_RANK[effectivePriority(a)] - PRIORITY_RANK[effectivePriority(b)];
    if (pr !== 0) return pr;
    const sc = computeScore(b) - computeScore(a);
    if (sc !== 0) return sc;
    return a.name.localeCompare(b.name, 'es');
  });
}

export function isProjectStuck(p: Project): boolean {
  return p.status === 'bloqueado' || p.status === 'decision';
}

export function openBlockersOf(d: AppData, projectId: ID): Blocker[] {
  return d.blockers.filter((b) => b.projectId === projectId && b.column !== 'resuelto');
}

/* ------------------------------------------------------------------ */
/* Compromisos                                                         */
/* ------------------------------------------------------------------ */

export function isOpen(c: Commitment): boolean {
  return c.status !== 'cumplido';
}

export function isOverdue(c: Commitment, now: Date): boolean {
  if (!isOpen(c) || !c.dueDate) return false;
  return combineDateTime(c.dueDate, c.dueTime).getTime() < now.getTime();
}

/** Estado visible: VENCIDO se deriva cuando pasa la fecha/hora y no está cumplido. */
export function displayStatus(c: Commitment, now: Date): CommitmentDisplayStatus {
  if (c.status === 'cumplido') return 'cumplido';
  if (isOverdue(c, now)) return 'vencido';
  return c.status;
}

export function isActionable(c?: Commitment): boolean {
  return !!c && !!c.action.trim() && !!c.ownerId && !!c.dueDate && !!c.dueTime;
}

export function commitmentDueTime(c: Commitment): number {
  return c.dueDate ? combineDateTime(c.dueDate, c.dueTime).getTime() : Number.MAX_SAFE_INTEGER;
}

export function sortByDue(list: Commitment[]): Commitment[] {
  return [...list].sort((a, b) => commitmentDueTime(a) - commitmentDueTime(b));
}

/** Compromiso del bloqueo (si existe). */
export function blockerCommitment(d: AppData, b: Blocker): Commitment | undefined {
  return byId(d.commitments, b.commitmentId);
}

/** Un bloqueo está gestionado sólo si tiene acción, responsable, fecha y hora. */
export function isBlockerActionable(d: AppData, b: Blocker): boolean {
  return isActionable(blockerCommitment(d, b));
}

/* ------------------------------------------------------------------ */
/* Sesiones                                                            */
/* ------------------------------------------------------------------ */

export function currentSession(d: AppData): Session | undefined {
  return d.sessions.find((s) => s.status === 'en_curso');
}

export function closedSessions(d: AppData): Session[] {
  return d.sessions
    .filter((s) => s.status === 'cerrada')
    .sort((a, b) => (b.closedAt ?? '').localeCompare(a.closedAt ?? ''));
}

export function lastClosedSession(d: AppData): Session | undefined {
  return closedSessions(d)[0];
}

/* ------------------------------------------------------------------ */
/* Indicadores del Dashboard                                           */
/* ------------------------------------------------------------------ */

export interface DashboardStats {
  projects: number;
  p1: number;
  p2: number;
  p3: number;
  blocked: number;
  decision: number;
  pending: number;
  overdue: number;
}

export function dashboardStats(d: AppData, now: Date): DashboardStats {
  const projects = activeProjects(d);
  const count = (pr: Priority) => projects.filter((p) => effectivePriority(p) === pr).length;
  const open = d.commitments.filter(isOpen);
  return {
    projects: projects.length,
    p1: count('P1'),
    p2: count('P2'),
    p3: count('P3'),
    blocked: projects.filter((p) => p.status === 'bloqueado').length,
    decision: projects.filter((p) => p.status === 'decision').length,
    pending: open.length,
    overdue: open.filter((c) => isOverdue(c, now)).length,
  };
}

/* ------------------------------------------------------------------ */
/* Modo Junta: orden de revisión                                       */
/* ------------------------------------------------------------------ */

export interface QueueSection {
  key: string;
  title: string;
  optional?: boolean;
  projects: Project[];
}

/**
 * 1. P1 bloqueados · 2. P1 activos · 3. P2 bloqueados · 4. P2 activos
 * 5. P3 (los atorados requieren atención; el resto sólo si hay tiempo).
 * "Bloqueado" incluye proyectos que requieren decisión.
 * Los proyectos resueltos durante la sesión se mantienen en su lugar para ver el resultado.
 */
export function meetingQueue(d: AppData, session?: Session): QueueSection[] {
  const resolvedHere = new Set(
    d.blockers.filter((b) => session && b.resolvedSessionId === session.id).map((b) => b.projectId),
  );
  const reviewed = new Set(session?.reviewedProjectIds ?? []);
  const pool = sortProjects(
    d.projects.filter(
      (p) => !p.archived && (p.status !== 'resuelto' || resolvedHere.has(p.id) || reviewed.has(p.id)),
    ),
  );
  // Con sesión en curso el orden se congela según el estado al iniciar, para que la
  // cola no se reacomode mientras se trabaja cada tarjeta.
  const stuckAtStart = new Set(
    (session?.openBlockerIdsAtStart ?? []).map((id) => byId(d.blockers, id)?.projectId),
  );
  const wasStuck = (p: Project) => (session ? stuckAtStart.has(p.id) : isProjectStuck(p));
  const pick = (pr: Priority, stuck: boolean) =>
    pool.filter((p) => effectivePriority(p) === pr && wasStuck(p) === stuck);

  return [
    { key: 'p1b', title: 'P1 bloqueados', projects: pick('P1', true) },
    { key: 'p1a', title: 'P1 activos', projects: pick('P1', false) },
    { key: 'p2b', title: 'P2 bloqueados', projects: pick('P2', true) },
    { key: 'p2a', title: 'P2 activos', projects: pick('P2', false) },
    { key: 'p3b', title: 'P3 que requieren atención', projects: pick('P3', true) },
    { key: 'p3a', title: 'P3 · sólo si hay tiempo', optional: true, projects: pick('P3', false) },
  ].filter((s) => s.projects.length > 0);
}

/* ------------------------------------------------------------------ */
/* Dependencias: QUIÉN NECESITA → QUÉ → DE QUIÉN → CUÁNDO              */
/* ------------------------------------------------------------------ */

export interface DependencyRow {
  key: string;
  fromAreaId?: ID;
  fromArea: string;
  projectId?: ID;
  project: string;
  need: string;
  to: string;
  toType: DependencyType;
  dueDate?: string;
  dueTime?: string;
  commitment?: Commitment;
  blocker?: Blocker;
  ownerId?: ID;
}

export function dependencyRows(d: AppData): DependencyRow[] {
  const rows: DependencyRow[] = [];
  const seenCommitments = new Set<ID>();

  for (const b of d.blockers) {
    if (b.column === 'resuelto' || !b.dependsOn) continue;
    const p = byId(d.projects, b.projectId);
    if (!p || p.archived) continue;
    const c = blockerCommitment(d, b);
    if (c) seenCommitments.add(c.id);
    rows.push({
      key: `b-${b.id}`,
      fromAreaId: p.areaId,
      fromArea: areaName(d, p.areaId),
      projectId: p.id,
      project: p.name,
      need: b.need || b.description,
      to: b.dependsOn.label,
      toType: b.dependsOn.type,
      dueDate: c?.dueDate,
      dueTime: c?.dueTime,
      commitment: c,
      blocker: b,
      ownerId: b.ownerId ?? c?.ownerId,
    });
  }

  for (const c of d.commitments) {
    if (!isOpen(c) || !c.dependsOn || seenCommitments.has(c.id)) continue;
    const p = byId(d.projects, c.projectId);
    if (p?.archived) continue;
    rows.push({
      key: `c-${c.id}`,
      fromAreaId: p?.areaId,
      fromArea: p ? areaName(d, p.areaId) : '—',
      projectId: p?.id,
      project: p?.name ?? '—',
      need: c.action,
      to: c.dependsOn.label,
      toType: c.dependsOn.type,
      dueDate: c.dueDate,
      dueTime: c.dueTime,
      commitment: c,
      ownerId: c.ownerId,
    });
  }

  return rows.sort((a, b) => {
    const ta = a.commitment ? commitmentDueTime(a.commitment) : Number.MAX_SAFE_INTEGER;
    const tb = b.commitment ? commitmentDueTime(b.commitment) : Number.MAX_SAFE_INTEGER;
    return ta - tb;
  });
}

/** Cuellos de botella: a quién se le está esperando más. */
export function bottlenecks(rows: DependencyRow[]): { to: string; count: number; from: string[] }[] {
  const map = new Map<string, { to: string; count: number; from: Set<string> }>();
  for (const r of rows) {
    const k = r.to.trim().toLowerCase();
    const e = map.get(k) ?? { to: r.to, count: 0, from: new Set<string>() };
    e.count += 1;
    e.from.add(r.fromArea);
    map.set(k, e);
  }
  return [...map.values()]
    .map((e) => ({ to: e.to, count: e.count, from: [...e.from] }))
    .sort((a, b) => b.count - a.count || a.to.localeCompare(b.to, 'es'));
}
