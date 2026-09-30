import { useActions } from '../components/actions';
import { AreaTag, CommitmentBadge } from '../components/badges';
import { PersonSelect } from '../components/fields';
import { Icon } from '../components/Icon';
import { useNow, useStore } from '../data/store';
import { fmtDayShort } from '../domain/dates';
import {
  activeAreas, byId, COMMITMENT_STATUS_LABEL, displayStatus, isOpen, personName, projectArea, sortByDue,
} from '../domain/selectors';
import type { CommitmentDisplayStatus } from '../domain/types';
import { setParams } from '../router';

const FILTERS: { value: string; label: string }[] = [
  { value: '', label: 'Abiertos' },
  { value: 'pendiente', label: 'Pendiente' },
  { value: 'en_gestion', label: 'En gestión' },
  { value: 'reprogramado', label: 'Reprogramado' },
  { value: 'vencido', label: 'Vencido' },
  { value: 'escalado', label: 'Escalado' },
  { value: 'cumplido', label: 'Cumplido' },
  { value: 'todos', label: 'Todos' },
];

export function Commitments({ params }: { params: URLSearchParams }) {
  const { data } = useStore();
  const actions = useActions();
  const now = useNow();
  const estado = params.get('estado') ?? '';
  const area = params.get('area') ?? '';
  const persona = params.get('persona') ?? '';
  const q = params.get('q') ?? '';
  const set = (k: string, v?: string) => setParams('/compromisos', { estado, area, persona, q, [k]: v || undefined });

  const all = data.commitments.filter((c) => !byId(data.projects, c.projectId)?.archived);
  const counts = new Map<string, number>();
  for (const c of all) {
    const s = displayStatus(c, now);
    counts.set(s, (counts.get(s) ?? 0) + 1);
    if (isOpen(c)) counts.set('', (counts.get('') ?? 0) + 1);
  }
  counts.set('todos', all.length);

  const rows = sortByDue(
    all.filter((c) => {
      const st = displayStatus(c, now);
      if (estado === '' && !isOpen(c)) return false;
      if (estado && estado !== 'todos' && st !== estado) return false;
      if (area && projectArea(data, c.projectId)?.id !== area) return false;
      if (persona && c.ownerId !== persona) return false;
      if (q) {
        const hay = `${c.action} ${byId(data.projects, c.projectId)?.name ?? ''} ${personName(data, c.ownerId)}`.toLowerCase();
        if (!hay.includes(q.toLowerCase())) return false;
      }
      return true;
    }),
  );
  if (estado === 'cumplido') rows.reverse();

  return (
    <div className="page">
      <header className="page-header">
        <div className="titles">
          <div className="eyebrow">¿Quién lo va a resolver y cuándo?</div>
          <h1>Compromisos</h1>
          <p>Acción concreta, responsable, fecha y hora.</p>
        </div>
        <button className="btn btn-primary" onClick={() => actions.newCommitment()}>
          <Icon name="plus" size={16} /> Nuevo compromiso
        </button>
      </header>

      <div className="row-wrap" style={{ gap: 6 }}>
        {FILTERS.map((f) => (
          <button key={f.value || 'open'} className={`chip ${estado === f.value ? 'on' : ''}`} onClick={() => set('estado', f.value)}>
            {f.label}
            <span className="x">{counts.get(f.value) ?? 0}</span>
          </button>
        ))}
      </div>

      <div className="toolbar">
        <div className="search">
          <Icon name="search" size={16} />
          <input className="input" placeholder="Buscar compromiso, proyecto o persona" value={q} onChange={(e) => set('q', e.target.value)} />
        </div>
        <select className="select" value={area} onChange={(e) => set('area', e.target.value)}>
          <option value="">Todas las áreas</option>
          {activeAreas(data).map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
        </select>
        <div style={{ width: 230 }}>
          <PersonSelect data={data} value={persona || undefined} onChange={(v) => set('persona', v)} placeholder="Todos los responsables" />
        </div>
        <span className="spacer" />
        <span className="muted small">{rows.length} {rows.length === 1 ? 'compromiso' : 'compromisos'}</span>
      </div>

      <div className="card table-wrap">
        <table className="tbl responsive">
          <thead>
            <tr>
              <th>Compromiso</th>
              <th>Proyecto · Área</th>
              <th>Responsable</th>
              <th className="hide-lg">Dependencia</th>
              <th>Fecha · Hora</th>
              <th>Estado</th>
              <th style={{ textAlign: 'right' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((c) => {
              const st: CommitmentDisplayStatus = displayStatus(c, now);
              const open = isOpen(c);
              return (
                <tr key={c.id} className={st === 'vencido' ? 'is-overdue' : ''}>
                  <td data-label="Compromiso" style={{ minWidth: 190, maxWidth: 300 }}>
                    <button className="link-btn" onClick={() => actions.commitmentDetail(c.id)}>
                      <div className="cell-title">{c.action}</div>
                      {c.dependsOn && <div className="cell-sub show-lg">Depende de: {c.dependsOn.label}</div>}
                      {c.comments.length > 0 && (
                        <div className="cell-sub clamp">{c.comments[c.comments.length - 1].text}</div>
                      )}
                    </button>
                  </td>
                  <td data-label="Proyecto" style={{ maxWidth: 190 }}>
                    <div>{byId(data.projects, c.projectId)?.name ?? <span className="faint">Sin proyecto</span>}</div>
                    <div className="cell-sub"><AreaTag area={projectArea(data, c.projectId)} /></div>
                  </td>
                  <td data-label="Responsable" className="nowrap">{personName(data, c.ownerId) || <span style={{ color: 'var(--coral-ink)' }}>Sin responsable</span>}</td>
                  <td data-label="Dependencia" className="hide-lg" style={{ maxWidth: 150 }}>{c.dependsOn?.label ?? <span className="faint">—</span>}</td>
                  <td data-label="Fecha" className="nowrap">
                    <div className="strong">
                      {c.dueDate ? fmtDayShort(c.dueDate) : <span style={{ color: 'var(--coral-ink)' }}>Sin fecha</span>}
                      {' · '}
                      {c.dueTime ?? <span style={{ color: 'var(--coral-ink)' }}>Sin hora</span>}
                    </div>
                    {c.reschedules.length > 0 && c.originalDueDate && (
                      <div className="cell-sub" title={`Reprogramado ${c.reschedules.length} ${c.reschedules.length === 1 ? 'vez' : 'veces'}`}>
                        orig. {fmtDayShort(c.originalDueDate)} · ×{c.reschedules.length}
                      </div>
                    )}
                  </td>
                  <td data-label="Estado"><CommitmentBadge status={st} /></td>
                  <td>
                    <div className="actions">
                      {open ? (
                        <>
                          <button className="btn btn-xs" onClick={() => actions.complete(c.id)} title="Cumplido"><Icon name="check" size={14} /> <span className="hide-md">Cumplido</span></button>
                          <button className="btn btn-ghost btn-xs btn-icon" onClick={() => actions.reschedule(c.id)} title="Reprogramar"><Icon name="reschedule" size={15} /></button>
                          <button className="btn btn-ghost btn-xs btn-icon" onClick={() => actions.escalate(c.id)} title="Escalar"><Icon name="escalate" size={15} /></button>
                        </>
                      ) : (
                        <button className="btn btn-ghost btn-xs" onClick={() => actions.reopen(c.id)} title="Reabrir"><Icon name="restore" size={14} /> Reabrir</button>
                      )}
                      <button className="btn btn-ghost btn-xs btn-icon" onClick={() => actions.comment(c.id)} title="Comentario"><Icon name="message" size={15} /></button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {rows.length === 0 && (
          <div className="empty">
            <h3>Sin compromisos</h3>
            {estado ? `No hay compromisos en estado "${COMMITMENT_STATUS_LABEL[estado as CommitmentDisplayStatus] ?? 'todos'}".` : 'No hay compromisos abiertos.'}
          </div>
        )}
      </div>
    </div>
  );
}
