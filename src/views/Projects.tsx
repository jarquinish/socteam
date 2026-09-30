import { useActions } from '../components/actions';
import { AreaTag, ProjectPriority, Score } from '../components/badges';
import { Icon } from '../components/Icon';
import { useToast } from '../components/Toast';
import { useStore } from '../data/store';
import { setProjectArchived, setProjectStatus } from '../domain/operations';
import { fmtDayShort } from '../domain/dates';
import { effectivePriority } from '../domain/scoring';
import {
  activeAreas, activeProjects, byId, currentSession, isProjectStuck, openBlockersOf, personName,
  PROJECT_STATUS_LABEL, sortProjects,
} from '../domain/selectors';
import type { Priority, Project, ProjectStatus } from '../domain/types';
import { setParams } from '../router';

const STATUS_FILTERS: { value: string; label: string }[] = [
  { value: '', label: 'Todos los estados' },
  { value: 'avanza', label: 'Avanza' },
  { value: 'atorado', label: 'Bloqueado o requiere decisión' },
  { value: 'bloqueado', label: 'Bloqueado' },
  { value: 'decision', label: 'Requiere decisión' },
  { value: 'resuelto', label: 'Resuelto' },
  { value: 'archivado', label: 'Archivados' },
];

export function Projects({ params }: { params: URLSearchParams }) {
  const { data, run } = useStore();
  const actions = useActions();
  const toast = useToast();
  const session = currentSession(data);

  const q = params.get('q') ?? '';
  const area = params.get('area') ?? '';
  const prioridad = params.get('prioridad') ?? '';
  const estado = params.get('estado') ?? '';
  const set = (k: string, v: string) => setParams('/proyectos', { q, area, prioridad, estado, [k]: v || undefined });

  const areas = activeAreas(data);
  const base = estado === 'archivado' ? data.projects.filter((p) => p.archived) : data.projects.filter((p) => !p.archived);
  const rows = sortProjects(
    base.filter((p) => {
      if (area && p.areaId !== area) return false;
      if (prioridad && effectivePriority(p) !== prioridad) return false;
      if (estado === 'atorado' && !isProjectStuck(p)) return false;
      if (estado && !['atorado', 'archivado'].includes(estado) && p.status !== estado) return false;
      if (q && !p.name.toLowerCase().includes(q.toLowerCase())) return false;
      return true;
    }),
  );

  const max = data.settings.maxProjectsPerArea;
  const overloaded = areas.filter((a) => activeProjects(data).filter((p) => p.areaId === a.id).length > max);
  const hasFilters = !!(q || area || prioridad || estado);

  const changeStatus = (p: Project, status: ProjectStatus) => {
    if (status === p.status) return;
    if (status === 'bloqueado' || status === 'decision') {
      actions.block(p.id, status === 'decision' ? 'decision' : 'bloqueo');
      return;
    }
    const open = openBlockersOf(data, p.id).length;
    const apply = () => {
      const n = run(setProjectStatus, p.id, status, session?.id);
      toast(n ? `${PROJECT_STATUS_LABEL[status]} · ${n} bloqueo${n > 1 ? 's' : ''} resuelto${n > 1 ? 's' : ''}` : `Estado: ${PROJECT_STATUS_LABEL[status]}`);
    };
    if (open) {
      actions.confirm({
        title: `Marcar como "${PROJECT_STATUS_LABEL[status]}"`,
        message: `El proyecto tiene ${open} ${open === 1 ? 'bloqueo abierto' : 'bloqueos abiertos'}. Se marcarán como resueltos y sus compromisos como cumplidos.`,
        confirmLabel: 'Confirmar',
        onConfirm: apply,
      });
    } else apply();
  };

  return (
    <div className="page">
      <header className="page-header">
        <div className="titles">
          <div className="eyebrow">¿Qué es importante?</div>
          <h1>Proyectos</h1>
          <p>Proyectos principales de cada área, ordenados por prioridad y score.</p>
        </div>
        <button className="btn btn-primary" onClick={() => actions.newProject(area || undefined)}>
          <Icon name="plus" size={16} /> Nuevo proyecto
        </button>
      </header>

      <div className="toolbar">
        <div className="search">
          <Icon name="search" size={16} />
          <input className="input" placeholder="Buscar proyecto" value={q} onChange={(e) => set('q', e.target.value)} />
        </div>
        <select className="select" value={area} onChange={(e) => set('area', e.target.value)}>
          <option value="">Todas las áreas</option>
          {areas.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
        </select>
        <div className="row" style={{ gap: 6 }}>
          {(['', 'P1', 'P2', 'P3'] as (Priority | '')[]).map((p) => (
            <button key={p || 'all'} className={`chip ${prioridad === p ? 'on' : ''}`} onClick={() => set('prioridad', p)}>
              {p || 'Todas'}
            </button>
          ))}
        </div>
        <select className="select" value={estado} onChange={(e) => set('estado', e.target.value)}>
          {STATUS_FILTERS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
        </select>
        {hasFilters && (
          <button className="btn btn-ghost btn-sm" onClick={() => setParams('/proyectos', {})}>
            <Icon name="x" size={14} /> Limpiar
          </button>
        )}
        <span className="spacer" />
        <span className="muted small">{rows.length} {rows.length === 1 ? 'proyecto' : 'proyectos'}</span>
      </div>

      {overloaded.map((a) => (
        <div className="warn" key={a.id}>
          <Icon name="alert" size={16} />
          <span>
            <b>{a.name}</b> tiene más de {max} proyectos activos. Esta sesión está diseñada para enfocarse en los proyectos más relevantes.
          </span>
        </div>
      ))}

      <div className="card table-wrap">
        <table className="tbl responsive">
          <thead>
            <tr>
              <th>Proyecto</th>
              <th>Área</th>
              <th>Responsable</th>
              <th className="num" title="Impacto">Imp.</th>
              <th className="num" title="Urgencia">Urg.</th>
              <th className="num" title="Dependencia">Dep.</th>
              <th className="num">Score</th>
              <th>Prioridad</th>
              <th>Estado</th>
              <th>Fecha objetivo</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {rows.map((p) => {
              const blockers = openBlockersOf(data, p.id);
              return (
                <tr key={p.id} className={p.archived ? 'is-archived' : ''}>
                  <td data-label="Proyecto">
                    <button className="link-btn" onClick={() => actions.editProject(p.id)}>
                      <div className="cell-title">{p.name}</div>
                      {blockers[0] && <div className="cell-sub" style={{ color: 'var(--coral-ink)' }}>{blockers[0].description}</div>}
                    </button>
                  </td>
                  <td data-label="Área"><AreaTag area={byId(data.areas, p.areaId)} /></td>
                  <td data-label="Responsable" className="nowrap">{personName(data, p.ownerId) || <span className="faint">—</span>}</td>
                  <td data-label="Impacto" className="num">{p.impact}</td>
                  <td data-label="Urgencia" className="num">{p.urgency}</td>
                  <td data-label="Dependencia" className="num">{p.dependency}</td>
                  <td data-label="Score" className="num"><Score project={p} /></td>
                  <td data-label="Prioridad"><ProjectPriority project={p} /></td>
                  <td data-label="Estado">
                    <select
                      className={`status-select st-${p.status}`}
                      value={p.status}
                      disabled={p.archived}
                      onChange={(e) => changeStatus(p, e.target.value as ProjectStatus)}
                      aria-label="Cambiar estado"
                    >
                      {(Object.keys(PROJECT_STATUS_LABEL) as ProjectStatus[]).map((s) => (
                        <option key={s} value={s}>{PROJECT_STATUS_LABEL[s]}</option>
                      ))}
                    </select>
                  </td>
                  <td data-label="Objetivo" className="nowrap">{p.targetDate ? fmtDayShort(p.targetDate) : <span className="faint">—</span>}</td>
                  <td>
                    <div className="actions">
                      {!p.archived && (
                        <button className="btn btn-ghost btn-icon btn-sm" title="Marcar como bloqueado" onClick={() => actions.block(p.id)}>
                          <Icon name="lock" size={16} />
                        </button>
                      )}
                      <button className="btn btn-ghost btn-icon btn-sm" title="Editar" onClick={() => actions.editProject(p.id)}>
                        <Icon name="edit" size={16} />
                      </button>
                      <button
                        className="btn btn-ghost btn-icon btn-sm"
                        title={p.archived ? 'Restaurar' : 'Archivar'}
                        onClick={() => { run(setProjectArchived, p.id, !p.archived); toast(p.archived ? 'Proyecto restaurado' : 'Proyecto archivado'); }}
                      >
                        <Icon name={p.archived ? 'restore' : 'archive'} size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {rows.length === 0 && (
          <div className="empty">
            <h3>Sin resultados</h3>
            {hasFilters ? 'Ningún proyecto coincide con los filtros.' : 'Aún no hay proyectos. Crea el primero.'}
          </div>
        )}
      </div>
    </div>
  );
}
