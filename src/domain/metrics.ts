/**
 * Métricas de ejecución calculadas a partir de los datos que ya se guardan.
 * Sin analítica compleja: tasas, promedios y conteos que ayudan a decidir
 * dónde intervenir.
 */
import { combineDateTime } from './dates';
import { areaName, byId, isOpen, isOverdue, personName } from './selectors';
import type { AppData, Blocker, Commitment, ID, Session } from './types';

export interface Performance {
  /** Cumplidos a tiempo. */
  onTime: number;
  /** Cumplidos después de la fecha/hora compromiso. */
  late: number;
  /** Abiertos y ya vencidos. */
  overdue: number;
  /** Abiertos en plazo. */
  open: number;
  reschedules: number;
  total: number;
  /** onTime / (onTime + late + overdue). null si no hay base. */
  rate: number | null;
}

const empty = (): Performance => ({ onTime: 0, late: 0, overdue: 0, open: 0, reschedules: 0, total: 0, rate: null });

export function completedOnTime(c: Commitment): boolean | undefined {
  if (c.status !== 'cumplido' || !c.completedAt) return undefined;
  if (!c.dueDate) return true;
  return new Date(c.completedAt).getTime() <= combineDateTime(c.dueDate, c.dueTime).getTime();
}

function add(p: Performance, c: Commitment, now: Date) {
  p.total += 1;
  p.reschedules += c.reschedules.length;
  const ok = completedOnTime(c);
  if (ok === true) p.onTime += 1;
  else if (ok === false) p.late += 1;
  else if (isOverdue(c, now)) p.overdue += 1;
  else if (isOpen(c)) p.open += 1;
}

function finish(p: Performance): Performance {
  const base = p.onTime + p.late + p.overdue;
  p.rate = base ? p.onTime / base : null;
  return p;
}

export interface Period {
  /** ISO desde (inclusive). Vacío = todo el historial. */
  since?: string;
}

export function periodSince(weeks: number | null, now: Date): Period {
  if (!weeks) return {};
  return { since: new Date(now.getTime() - weeks * 7 * 86400000).toISOString() };
}

const inPeriod = (at: string, p: Period) => !p.since || at >= p.since;

export interface Row { key: ID; label: string; perf: Performance }

export interface Metrics {
  overall: Performance;
  byArea: Row[];
  byPerson: Row[];
  blockers: {
    resolved: number;
    open: number;
    avgResolutionDays: number | null;
    avgOpenAgeDays: number | null;
    byArea: { key: ID; label: string; resolved: number; avgDays: number | null; open: number }[];
  };
  dependencies: {
    waitedOn: { label: string; count: number; open: number }[];
    waiting: { key: ID; label: string; count: number }[];
    pairs: { from: string; to: string; count: number }[];
  };
  recurring: {
    projects: { id: ID; name: string; area: string; count: number }[];
    targets: { label: string; projects: number; count: number }[];
  };
  trend: {
    sessionId: ID;
    date: string;
    created: number;
    completed: number;
    overdue: number;
    rescheduled: number;
    detected: number;
    resolved: number;
  }[];
}

const days = (ms: number) => ms / 86400000;
const avg = (xs: number[]) => (xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : null);

function projectAreaId(d: AppData, projectId?: ID) {
  return byId(d.projects, projectId)?.areaId;
}

export function computeMetrics(d: AppData, now: Date, period: Period = {}): Metrics {
  const commitments = d.commitments.filter((c) => inPeriod(c.createdAt, period));
  const blockers = d.blockers.filter((b) => inPeriod(b.createdAt, period));

  // Cumplimiento
  const overall = empty();
  const areaMap = new Map<ID, Performance>();
  const personMap = new Map<ID, Performance>();
  for (const c of commitments) {
    add(overall, c, now);
    const a = projectAreaId(d, c.projectId) ?? 'sin-area';
    if (!areaMap.has(a)) areaMap.set(a, empty());
    add(areaMap.get(a)!, c, now);
    const o = c.ownerId ?? 'sin-responsable';
    if (!personMap.has(o)) personMap.set(o, empty());
    add(personMap.get(o)!, c, now);
  }
  const rows = (m: Map<ID, Performance>, label: (k: ID) => string) =>
    [...m.entries()]
      .map(([key, perf]) => ({ key, label: label(key), perf: finish(perf) }))
      .sort((a, b) => b.perf.total - a.perf.total || a.label.localeCompare(b.label, 'es'));

  // Bloqueos
  const resolved = blockers.filter((b) => b.column === 'resuelto' && b.resolvedAt);
  const open = blockers.filter((b) => b.column !== 'resuelto');
  const resolutionDays = (b: Blocker) => days(new Date(b.resolvedAt!).getTime() - new Date(b.createdAt).getTime());
  const blockerAreas = new Map<ID, { resolved: number[]; open: number }>();
  for (const b of blockers) {
    const a = projectAreaId(d, b.projectId) ?? 'sin-area';
    const e = blockerAreas.get(a) ?? { resolved: [], open: 0 };
    if (b.column === 'resuelto' && b.resolvedAt) e.resolved.push(resolutionDays(b));
    else e.open += 1;
    blockerAreas.set(a, e);
  }

  // Dependencias (bloqueos + compromisos, abiertos o no, del periodo)
  const targets = new Map<string, { label: string; count: number; open: number; projects: Set<ID> }>();
  const sources = new Map<ID, number>();
  const pairs = new Map<string, { from: string; to: string; count: number }>();
  const seen = new Set<ID>();
  const track = (label: string, projectId: ID | undefined, isStillOpen: boolean) => {
    const k = label.trim().toLowerCase();
    const t = targets.get(k) ?? { label, count: 0, open: 0, projects: new Set<ID>() };
    t.count += 1;
    if (isStillOpen) t.open += 1;
    if (projectId) t.projects.add(projectId);
    targets.set(k, t);
    const a = projectAreaId(d, projectId);
    if (a) {
      sources.set(a, (sources.get(a) ?? 0) + 1);
      const from = areaName(d, a);
      const pk = `${from}→${k}`;
      const pe = pairs.get(pk) ?? { from, to: label, count: 0 };
      pe.count += 1;
      pairs.set(pk, pe);
    }
  };
  for (const b of blockers) {
    if (!b.dependsOn) continue;
    if (b.commitmentId) seen.add(b.commitmentId);
    track(b.dependsOn.label, b.projectId, b.column !== 'resuelto');
  }
  for (const c of commitments) {
    if (!c.dependsOn || seen.has(c.id)) continue;
    track(c.dependsOn.label, c.projectId, isOpen(c));
  }

  // Bloqueos recurrentes
  const perProject = new Map<ID, number>();
  for (const b of blockers) perProject.set(b.projectId, (perProject.get(b.projectId) ?? 0) + 1);

  // Tendencia por sesión (fotografías del cierre)
  const trend = d.sessions
    .filter((s): s is Session & { snapshot: NonNullable<Session['snapshot']> } => s.status === 'cerrada' && !!s.snapshot)
    .filter((s) => inPeriod(s.closedAt ?? s.startedAt, period))
    .sort((a, b) => a.date.localeCompare(b.date))
    .map((s) => ({
      sessionId: s.id,
      date: s.date,
      created: s.snapshot.commitments.created,
      completed: s.snapshot.commitments.completed,
      overdue: s.snapshot.commitments.overdue,
      rescheduled: s.snapshot.commitments.rescheduled,
      detected: s.snapshot.blockers.detected,
      resolved: s.snapshot.blockers.resolved,
    }));

  return {
    overall: finish(overall),
    byArea: rows(areaMap, (k) => areaName(d, k) || 'Sin área'),
    byPerson: rows(personMap, (k) => personName(d, k) || 'Sin responsable'),
    blockers: {
      resolved: resolved.length,
      open: open.length,
      avgResolutionDays: avg(resolved.map(resolutionDays)),
      avgOpenAgeDays: avg(open.map((b) => days(now.getTime() - new Date(b.createdAt).getTime()))),
      byArea: [...blockerAreas.entries()]
        .map(([key, e]) => ({ key, label: areaName(d, key) || 'Sin área', resolved: e.resolved.length, avgDays: avg(e.resolved), open: e.open }))
        .sort((a, b) => b.resolved + b.open - (a.resolved + a.open)),
    },
    dependencies: {
      waitedOn: [...targets.values()]
        .map((t) => ({ label: t.label, count: t.count, open: t.open }))
        .sort((a, b) => b.count - a.count || b.open - a.open),
      waiting: [...sources.entries()]
        .map(([key, count]) => ({ key, label: areaName(d, key), count }))
        .sort((a, b) => b.count - a.count),
      pairs: [...pairs.values()].sort((a, b) => b.count - a.count),
    },
    recurring: {
      projects: [...perProject.entries()]
        .filter(([, n]) => n >= 2)
        .map(([id, count]) => {
          const p = byId(d.projects, id);
          return { id, name: p?.name ?? '—', area: areaName(d, p?.areaId), count };
        })
        .sort((a, b) => b.count - a.count),
      targets: [...targets.values()]
        .filter((t) => t.projects.size >= 2)
        .map((t) => ({ label: t.label, projects: t.projects.size, count: t.count }))
        .sort((a, b) => b.projects - a.projects || b.count - a.count),
    },
    trend,
  };
}

export const pct = (r: number | null) => (r === null ? '—' : `${Math.round(r * 100)}%`);
export const fmtDays = (n: number | null) => (n === null ? '—' : n < 1 ? '< 1 día' : `${n.toFixed(1)} días`);
