import { computeScore, effectivePriority } from '../domain/scoring';
import { COMMITMENT_STATUS_LABEL, PROJECT_STATUS_LABEL } from '../domain/selectors';
import type { Area, CommitmentDisplayStatus, Level, Priority, Project, ProjectStatus } from '../domain/types';
import { Icon } from './Icon';

export function PriorityBadge({ priority, large }: { priority: Priority; large?: boolean }) {
  return <span className={`badge prio-${priority} ${large ? 'badge-lg' : ''}`}>{priority}</span>;
}

export function ProjectPriority({ project, large }: { project: Project; large?: boolean }) {
  const p = effectivePriority(project);
  return (
    <span className="row" style={{ gap: 6 }}>
      <PriorityBadge priority={p} large={large} />
      {project.override && (
        <span
          className="manual-flag"
          title={`Ajuste manual de Dirección. Calculada: ${project.override.autoPriority}${project.override.reason ? ` · ${project.override.reason}` : ''}`}
        >
          <Icon name="flag" size={12} /> Manual
        </span>
      )}
    </span>
  );
}

export function ProjectStatusBadge({ status, large }: { status: ProjectStatus; large?: boolean }) {
  return (
    <span className={`badge st-${status} ${large ? 'badge-lg' : ''}`}>
      <span className="dot" />
      {PROJECT_STATUS_LABEL[status]}
    </span>
  );
}

export function CommitmentBadge({ status }: { status: CommitmentDisplayStatus }) {
  return (
    <span className={`badge st-${status}`}>
      <span className="dot" />
      {COMMITMENT_STATUS_LABEL[status]}
    </span>
  );
}

export function AreaTag({ area }: { area?: Area }) {
  if (!area) return <span className="faint">—</span>;
  return (
    <span className="area-tag">
      <i style={{ background: area.color }} />
      {area.name}
    </span>
  );
}

export function Score({ project }: { project: Project }) {
  const s = computeScore(project);
  return <span className={`score ${s >= 8 ? 'hi' : ''}`} title="Impacto + Urgencia + Dependencia">{s}</span>;
}

export function LevelBars({ value, label }: { value: Level; label: string }) {
  return (
    <span className="lvl" title={`${label}: ${value}`} aria-label={`${label} ${value}`}>
      {[1, 2, 3].map((i) => <i key={i} className={i <= value ? 'on' : ''} />)}
    </span>
  );
}
