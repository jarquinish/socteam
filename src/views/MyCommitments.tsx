import { useEffect } from 'react';
import { useActions } from '../components/actions';
import { CommitmentBadge } from '../components/badges';
import { PersonSelect } from '../components/fields';
import { Icon } from '../components/Icon';
import { useToast } from '../components/Toast';
import { useNow, useStore } from '../data/store';
import { setCommitmentStatus } from '../domain/operations';
import { fmtDay, relativeDay } from '../domain/dates';
import {
  byId, displayStatus, isOpen, personName, sortByDue,
} from '../domain/selectors';
import type { Commitment } from '../domain/types';
import { setParams } from '../router';

const ME_KEY = 'weekly-alignment-unblock:me';

function readMe(): string {
  try { return localStorage.getItem(ME_KEY) ?? ''; } catch { return ''; }
}

/** Checklist operativo posterior a la junta: sólo lo que requiere mi gestión. */
export function MyCommitments({ params }: { params: URLSearchParams }) {
  const { data, run } = useStore();
  const actions = useActions();
  const toast = useToast();
  const now = useNow();
  const me = params.get('persona') ?? readMe();

  useEffect(() => {
    if (!me) return;
    try { localStorage.setItem(ME_KEY, me); } catch { /* sin storage */ }
  }, [me]);

  const person = byId(data.people, me);
  const managedArea = data.areas.find((a) => a.managerId === me && !a.archived);

  const mine = sortByDue(data.commitments.filter((c) => c.ownerId === me && isOpen(c) && !byId(data.projects, c.projectId)?.archived));
  const weekAgo = new Date(now.getTime() - 7 * 86400000).toISOString();
  const doneRecently = data.commitments
    .filter((c) => c.ownerId === me && c.status === 'cumplido' && (c.completedAt ?? '') >= weekAgo)
    .sort((a, b) => (b.completedAt ?? '').localeCompare(a.completedAt ?? ''));
  const needFromMyArea = managedArea
    ? sortByDue(data.commitments.filter((c) => isOpen(c) && c.ownerId !== me && c.dependsOn?.type === 'area' && c.dependsOn.refId === managedArea.id))
    : [];

  return (
    <div className="page" style={{ maxWidth: 920 }}>
      <header className="page-header">
        <div className="titles">
          <div className="eyebrow">Después de la Weekly</div>
          <h1>Mis compromisos</h1>
          <p>Sólo lo que requiere tu gestión.</p>
        </div>
        <div style={{ width: 260 }}>
          <PersonSelect data={data} value={me || undefined} onChange={(v) => setParams('/mis-compromisos', { persona: v })} placeholder="¿Quién eres?" />
        </div>
      </header>

      {!person ? (
        <div className="card empty">
          <h3>Selecciona tu nombre</h3>
          Verás tus pendientes, lo que otras áreas necesitan de ti y lo que ya cumpliste.
        </div>
      ) : (
        <>
          <section className="card">
            <div className="card-header">
              <div className="grow">
                <div className="upper muted">Mis pendientes · {person.name}</div>
                <h2 style={{ marginTop: 4 }}>{mine.length} por gestionar</h2>
              </div>
              {mine.some((c) => displayStatus(c, now) === 'vencido') && (
                <span className="badge st-vencido">{mine.filter((c) => displayStatus(c, now) === 'vencido').length} vencido(s)</span>
              )}
            </div>
            {mine.length === 0 && <div className="empty">No tienes compromisos abiertos.</div>}
            {mine.map((c) => (
              <Todo
                key={c.id}
                c={c}
                now={now}
                onCheck={() => actions.complete(c.id)}
                onToggleProgress={() => {
                  const next = c.status === 'en_gestion' ? 'pendiente' : 'en_gestion';
                  run(setCommitmentStatus, c.id, next);
                  toast(next === 'en_gestion' ? 'Marcado en gestión' : 'Marcado pendiente');
                }}
                onReschedule={() => actions.reschedule(c.id)}
                onComment={() => actions.comment(c.id)}
                onEscalate={() => actions.escalate(c.id)}
              />
            ))}
          </section>

          {managedArea && needFromMyArea.length > 0 && (
            <section className="card">
              <div className="card-header">
                <div className="grow">
                  <div className="upper muted">Responsable de {managedArea.name}</div>
                  <h2 style={{ marginTop: 4 }}>Lo que otras áreas necesitan de {managedArea.name}</h2>
                </div>
              </div>
              {needFromMyArea.map((c) => (
                <button key={c.id} className="list-item as-btn" onClick={() => actions.commitmentDetail(c.id)}>
                  <div className="grow">
                    <div className="t">{c.action}</div>
                    <div className="s">{byId(data.projects, c.projectId)?.name} · gestiona {personName(data, c.ownerId) || 'sin responsable'}</div>
                  </div>
                  <span className="small strong nowrap">{c.dueDate ? `${fmtDay(c.dueDate)} — ${c.dueTime ?? 'sin hora'}` : 'Sin fecha'}</span>
                  <CommitmentBadge status={displayStatus(c, now)} />
                </button>
              ))}
            </section>
          )}

          {doneRecently.length > 0 && (
            <section className="card">
              <div className="card-header"><h3>Cumplidos en los últimos 7 días</h3></div>
              {doneRecently.map((c) => (
                <Todo key={c.id} c={c} now={now} onCheck={() => actions.reopen(c.id)} />
              ))}
            </section>
          )}
        </>
      )}
    </div>
  );
}

function Todo({ c, now, onCheck, onToggleProgress, onReschedule, onComment, onEscalate }: {
  c: Commitment; now: Date; onCheck: () => void;
  onToggleProgress?: () => void; onReschedule?: () => void; onComment?: () => void; onEscalate?: () => void;
}) {
  const { data } = useStore();
  const done = c.status === 'cumplido';
  const project = byId(data.projects, c.projectId);
  const blocker = byId(data.blockers, c.blockerId);
  const st = displayStatus(c, now);
  return (
    <div className={`todo ${done ? 'done' : ''}`}>
      <button className={`todo-check ${done ? 'on' : ''}`} onClick={onCheck} title={done ? 'Reabrir' : 'Marcar como cumplido'} aria-label={done ? 'Reabrir' : 'Marcar como cumplido'}>
        {done && <Icon name="check" size={14} strokeWidth={3} />}
      </button>
      <div className="grow">
        <div className="row-wrap">
          <span className="todo-title strong" style={{ fontSize: 15 }}>{project?.name ?? 'Sin proyecto'}</span>
          <CommitmentBadge status={st} />
          {c.reschedules.length > 0 && <span className="small muted">Reprogramado {c.reschedules.length} {c.reschedules.length === 1 ? 'vez' : 'veces'}</span>}
        </div>
        <dl>
          {blocker?.need && (<><dt>Necesito</dt><dd>{blocker.need}</dd></>)}
          <dt>Acción</dt><dd>{c.action}</dd>
          {c.dependsOn && (<><dt>Dependencia</dt><dd>{c.dependsOn.label}</dd></>)}
          <dt>Compromiso</dt>
          <dd>
            {c.dueDate ? `${fmtDay(c.dueDate)} — ${c.dueTime ?? 'sin hora'}` : 'Sin fecha'}
            {c.dueDate && !done && <span className="muted"> · {relativeDay(c.dueDate, now)}</span>}
          </dd>
        </dl>
        {!done && (
          <div className="row-wrap" style={{ marginTop: 10, gap: 6 }}>
            {onToggleProgress && (
              <button className={`btn btn-xs ${c.status === 'en_gestion' ? 'btn-primary' : ''}`} onClick={onToggleProgress}>
                <Icon name="clock" size={13} /> En gestión
              </button>
            )}
            {onReschedule && <button className="btn btn-xs" onClick={onReschedule}><Icon name="reschedule" size={13} /> Reprogramar</button>}
            {onEscalate && <button className="btn btn-xs" onClick={onEscalate}><Icon name="escalate" size={13} /> Escalar</button>}
            {onComment && <button className="btn btn-xs btn-ghost" onClick={onComment}><Icon name="message" size={13} /> Comentario</button>}
          </div>
        )}
      </div>
    </div>
  );
}
