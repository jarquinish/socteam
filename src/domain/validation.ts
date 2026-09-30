import {
  blockerCommitment, byId, currentSession, isOpen, isActionable, openBlockersOf,
} from './selectors';
import type { AppData, ID, Session } from './types';

export type IssueKind =
  | 'bloqueo_sin_responsable'
  | 'bloqueo_sin_compromiso'
  | 'compromiso_sin_fecha'
  | 'compromiso_sin_hora'
  | 'compromiso_sin_responsable'
  | 'tema_sin_definicion'
  | 'revision_pendiente';

export interface Issue {
  kind: IssueKind;
  title: string;
  detail: string;
  projectId?: ID;
  blockerId?: ID;
  commitmentId?: ID;
}

export const ISSUE_GROUP_LABEL: Record<IssueKind, string> = {
  bloqueo_sin_responsable: 'Bloqueos sin responsable',
  bloqueo_sin_compromiso: 'Bloqueos sin compromiso accionable',
  compromiso_sin_fecha: 'Compromisos sin fecha',
  compromiso_sin_hora: 'Compromisos sin hora',
  compromiso_sin_responsable: 'Compromisos sin responsable',
  tema_sin_definicion: 'Temas abiertos sin definición',
  revision_pendiente: 'Compromisos anteriores sin revisar',
};

/**
 * Revisión previa al cierre de la Weekly. No impide cerrar:
 * señala lo incompleto para que Dirección decida.
 */
export function closingIssues(d: AppData, session: Session | undefined = currentSession(d)): Issue[] {
  const issues: Issue[] = [];
  const projectName = (id?: ID) => byId(d.projects, id)?.name ?? 'Sin proyecto';

  for (const b of d.blockers) {
    if (b.column === 'resuelto') continue;
    const p = byId(d.projects, b.projectId);
    if (!p || p.archived) continue;
    const c = blockerCommitment(d, b);
    if (!b.ownerId && !c?.ownerId) {
      issues.push({
        kind: 'bloqueo_sin_responsable',
        title: p.name,
        detail: b.description || 'Bloqueo sin descripción',
        projectId: p.id,
        blockerId: b.id,
      });
    }
    if (!isActionable(c)) {
      issues.push({
        kind: 'bloqueo_sin_compromiso',
        title: p.name,
        detail: 'Este bloqueo todavía no tiene un compromiso accionable.',
        projectId: p.id,
        blockerId: b.id,
      });
    }
  }

  for (const c of d.commitments) {
    if (!isOpen(c)) continue;
    const p = byId(d.projects, c.projectId);
    if (p?.archived) continue;
    if (!c.dueDate) {
      issues.push({ kind: 'compromiso_sin_fecha', title: c.action, detail: projectName(c.projectId), commitmentId: c.id, projectId: c.projectId });
    }
    if (!c.dueTime) {
      issues.push({ kind: 'compromiso_sin_hora', title: c.action, detail: projectName(c.projectId), commitmentId: c.id, projectId: c.projectId });
    }
    if (!c.ownerId) {
      issues.push({ kind: 'compromiso_sin_responsable', title: c.action, detail: projectName(c.projectId), commitmentId: c.id, projectId: c.projectId });
    }
  }

  for (const p of d.projects) {
    if (p.archived) continue;
    if ((p.status === 'decision' || p.status === 'bloqueado') && openBlockersOf(d, p.id).length === 0) {
      issues.push({
        kind: 'tema_sin_definicion',
        title: p.name,
        detail: p.status === 'decision'
          ? 'Requiere decisión, pero no se definió qué se decide ni quién.'
          : 'Marcado como bloqueado sin registrar el bloqueo.',
        projectId: p.id,
      });
    }
  }

  if (session) {
    const reviewed = new Set(session.reviews.map((r) => r.commitmentId));
    for (const id of session.carriedCommitmentIds) {
      const c = byId(d.commitments, id);
      if (!c || reviewed.has(id) || !isOpen(c)) continue;
      issues.push({
        kind: 'revision_pendiente',
        title: c.action,
        detail: projectName(c.projectId),
        commitmentId: c.id,
        projectId: c.projectId,
      });
    }
  }

  return issues;
}

export function groupIssues(issues: Issue[]): { kind: IssueKind; label: string; items: Issue[] }[] {
  const order = Object.keys(ISSUE_GROUP_LABEL) as IssueKind[];
  return order
    .map((kind) => ({ kind, label: ISSUE_GROUP_LABEL[kind], items: issues.filter((i) => i.kind === kind) }))
    .filter((g) => g.items.length > 0);
}
