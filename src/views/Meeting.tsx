/**
 * MODO JUNTA
 * 1. Compromisos de la sesión anterior (¿se cumplió?)
 * 2. Proyectos en orden: P1 bloqueados → P1 activos → P2 bloqueados → P2 activos → P3
 * 3. Cierre: validación de lo incompleto → resumen para Teams
 */
import { useEffect, useMemo, useState } from 'react';
import { useActions } from '../components/actions';
import { AreaTag, CommitmentBadge, ProjectPriority, ProjectStatusBadge } from '../components/badges';
import { copyRich } from '../components/clipboard';
import { EscalateForm, RescheduleForm } from '../components/CommitmentForms';
import { Icon } from '../components/Icon';
import { Modal } from '../components/Modal';
import { useToast } from '../components/Toast';
import { useNow, useStore } from '../data/store';
import {
  closeSession, discardSession, markProjectReviewed, reviewCommitment, setProjectStatus, setSessionPhase, startSession,
} from '../domain/operations';
import { combineDateTime, fmtDue, fmtLongDay, fmtWeekRange, fmtDay } from '../domain/dates';
import { computeScore } from '../domain/scoring';
import {
  blockerCommitment, byId, currentSession, displayStatus, isActionable, isBlockerActionable, isOpen, isOverdue,
  meetingQueue, openBlockersOf, personName, sortByDue,
} from '../domain/selectors';
import { sessionStats } from '../domain/summary';
import { closingIssues, groupIssues, type Issue } from '../domain/validation';
import type { Commitment, ID, Project, ReviewResult, Session } from '../domain/types';
import { navigate } from '../router';

export function Meeting() {
  const { data, run } = useStore();
  const toast = useToast();
  const session = currentSession(data);
  const [closedId, setClosedId] = useState<ID | null>(null);
  const [showClose, setShowClose] = useState(false);
  const [showList, setShowList] = useState(false);
  const [showExit, setShowExit] = useState(false);

  if (closedId) {
    const closed = byId(data.sessions, closedId);
    if (closed) return <SummaryScreen session={closed} />;
  }

  if (!session) {
    return (
      <div className="meeting" style={{ display: 'grid', placeItems: 'center', padding: 24 }}>
        <div className="card card-pad stack" style={{ maxWidth: 520, textAlign: 'center', padding: 36 }}>
          <div className="brand-mark" style={{ margin: '0 auto', width: 48, height: 48, fontSize: 16 }}>W&U</div>
          <h1>Weekly Alignment &amp; Unblock</h1>
          <p className="muted">No hay una Weekly en curso. Al iniciar, primero se revisan los compromisos de la sesión anterior.</p>
          <div className="row" style={{ justifyContent: 'center' }}>
            <button className="btn" onClick={() => navigate('/')}>Volver</button>
            <button className="btn btn-primary btn-lg" onClick={() => run(startSession)}><Icon name="play" size={16} /> Iniciar Weekly</button>
          </div>
        </div>
      </div>
    );
  }

  const phase = session.phase;
  const goPhase = (p: Session['phase']) => run(setSessionPhase, session.id, p);

  return (
    <div className="meeting">
      <TopBar
        session={session}
        onPhase={goPhase}
        onList={() => setShowList(true)}
        onExit={() => setShowExit(true)}
        onClose={() => setShowClose(true)}
      />
      {phase === 'revision' ? (
        <ReviewStep session={session} onContinue={() => goPhase('proyectos')} />
      ) : (
        <BoardStep session={session} onClose={() => setShowClose(true)} />
      )}

      {showList && <SessionCommitments session={session} onClose={() => setShowList(false)} />}
      {showClose && (
        <CloseModal
          session={session}
          onCancel={() => setShowClose(false)}
          onReview={() => { setShowClose(false); goPhase('revision'); }}
          onConfirm={() => {
            const id = session.id;
            run(closeSession, id);
            setShowClose(false);
            setClosedId(id);
            toast('Weekly cerrada. Resumen listo.');
          }}
        />
      )}
      {showExit && (
        <Modal
          title="Salir de Modo Junta"
          onClose={() => setShowExit(false)}
          footer={
            <>
              <button
                className="btn btn-danger"
                style={{ marginRight: 'auto' }}
                onClick={() => { run(discardSession, session.id); toast('Weekly descartada'); navigate('/'); }}
              >
                Descartar Weekly
              </button>
              <button className="btn" onClick={() => setShowExit(false)}>Seguir en la junta</button>
              <button className="btn btn-primary" onClick={() => navigate('/')}>Salir</button>
            </>
          }
        >
          <p className="muted">
            La Weekly queda en curso y puedes continuarla después desde el Dashboard.
            Descartarla elimina la sesión (los cambios a proyectos y compromisos se conservan).
          </p>
        </Modal>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */

function TopBar({ session, onPhase, onList, onExit, onClose }: {
  session: Session; onPhase: (p: Session['phase']) => void; onList: () => void; onExit: () => void; onClose: () => void;
}) {
  const { data } = useStore();
  const now = useNow(1000);
  const elapsed = Math.max(0, Math.floor((now.getTime() - new Date(session.startedAt).getTime()) / 1000));
  const h = Math.floor(elapsed / 3600);
  const m = Math.floor((elapsed % 3600) / 60);
  const timer = h ? `${h}:${String(m).padStart(2, '0')} h` : `${m} min`;
  const st = sessionStats(data, session, now);
  const created = st.commitments.created;
  const steps: { key: Session['phase']; label: string }[] = [
    { key: 'revision', label: 'Compromisos anteriores' },
    { key: 'proyectos', label: 'Proyectos' },
  ];

  return (
    <header className="m-top">
      <div>
        <div className="title">WEEKLY ALIGNMENT &amp; UNBLOCK</div>
        <div className="sub">Semana {fmtWeekRange(session.weekStart)} · {timer}</div>
      </div>
      <nav className="m-steps">
        {steps.map((s, i) => (
          <button key={s.key} className={`m-step ${session.phase === s.key ? 'on' : ''}`} onClick={() => onPhase(s.key)}>
            <span className="n">{i + 1}</span>{s.label}
          </button>
        ))}
        <button className="m-step" onClick={onClose}><span className="n">3</span>Cierre</button>
      </nav>
      <span className="spacer" />
      <span className={`pill ${st.blockers.followUp ? 'alert' : ''}`}><Icon name="lock" size={13} /> {st.blockers.followUp} bloqueos abiertos</span>
      <button className="btn btn-sm" onClick={onList}><Icon name="checks" size={15} /> Compromisos · {created} nuevos</button>
      <button className="btn btn-sm" onClick={onExit}><Icon name="logout" size={15} /> Salir</button>
      <button className="btn btn-sm btn-primary" onClick={onClose}><Icon name="stop" size={13} /> Cerrar Weekly</button>
    </header>
  );
}

/* ------------------------------------------------------------------ */
/* 1. Compromisos de la sesión anterior                                */
/* ------------------------------------------------------------------ */

const RESULT_LABEL: Record<ReviewResult, string> = {
  si: 'Cumplido', no: 'No se cumplió', reprogramar: 'Reprogramado', escalar: 'Escalado',
};

function ReviewStep({ session, onContinue }: { session: Session; onContinue: () => void }) {
  const { data, run } = useStore();
  const toast = useToast();
  const now = useNow();
  const [modal, setModal] = useState<{ type: 'reprogramar' | 'escalar'; id: ID } | null>(null);

  const start = new Date(session.startedAt).getTime();
  const carried = session.carriedCommitmentIds.map((id) => byId(data.commitments, id)).filter((c): c is Commitment => !!c);
  // Agrupación estable: se calcula con el estado que tenían al iniciar la sesión.
  const overdueAtStart = (c: Commitment) => {
    const before = c.reschedules.filter((r) => new Date(r.at).getTime() < start);
    const date = c.reschedules.length > before.length ? c.reschedules[before.length].fromDate : c.dueDate;
    const time = c.reschedules.length > before.length ? c.reschedules[before.length].fromTime : c.dueTime;
    return !!date && combineDateTime(date, time).getTime() < start;
  };
  const rescheduledBefore = (c: Commitment) => c.reschedules.some((r) => new Date(r.at).getTime() < start);

  const completed = sortByDue(session.completedSinceLastIds.map((id) => byId(data.commitments, id)).filter((c): c is Commitment => !!c));
  const vencidos = sortByDue(carried.filter((c) => overdueAtStart(c)));
  const reprogramados = sortByDue(carried.filter((c) => !overdueAtStart(c) && rescheduledBefore(c)));
  const pendientes = sortByDue(carried.filter((c) => !overdueAtStart(c) && !rescheduledBefore(c)));

  const reviews = new Map(session.reviews.map((r) => [r.commitmentId, r.result]));
  // Los que se cumplieron por otra vía durante la sesión ya no requieren respuesta.
  const toReview = carried.filter((c) => reviews.has(c.id) || c.status !== 'cumplido');
  const answered = toReview.filter((c) => reviews.has(c.id)).length;
  const allDone = answered >= toReview.length;

  const answer = (c: Commitment, result: ReviewResult) => {
    if (result === 'reprogramar' || result === 'escalar') {
      setModal({ type: result, id: c.id });
      return;
    }
    if (run(reviewCommitment, session.id, c.id, result)) {
      toast(result === 'si' ? 'Cumplido' : 'Registrado como no cumplido');
    }
  };

  const item = (c: Commitment) => {
    const r = reviews.get(c.id);
    const p = byId(data.projects, c.projectId);
    const st = displayStatus(c, now);
    return (
      <div key={c.id} className={`card review-item ${r ? 'answered' : ''}`}>
        <div className="grow">
          <div className="t">{c.action}</div>
          <div className="s">
            {p?.name ?? 'Sin proyecto'} · <b>{personName(data, c.ownerId) || 'Sin responsable'}</b> · {fmtDue(c.dueDate, c.dueTime)}
            {c.dependsOn && <> · depende de {c.dependsOn.label}</>}
            {c.reschedules.length > 0 && <> · reprogramado {c.reschedules.length} {c.reschedules.length === 1 ? 'vez' : 'veces'}</>}
          </div>
        </div>
        {r ? (
          <div className="row">
            <span className={`badge st-${r === 'si' ? 'cumplido' : r === 'no' ? 'vencido' : r === 'reprogramar' ? 'reprogramado' : 'escalado'}`}>{RESULT_LABEL[r]}</span>
            {r !== 'si' && <CommitmentBadge status={st} />}
          </div>
        ) : null}
        <div className="review-q">
          <span className="q">¿Se cumplió?</span>
          <button className={`btn btn-sm ${r === 'si' ? 'btn-primary' : ''}`} onClick={() => answer(c, 'si')} disabled={c.status === 'cumplido'}>Sí</button>
          <button className={`btn btn-sm ${r === 'no' ? 'btn-primary' : ''}`} onClick={() => answer(c, 'no')} disabled={c.status === 'cumplido'}>No</button>
          <button className={`btn btn-sm ${r === 'reprogramar' ? 'btn-primary' : ''}`} onClick={() => answer(c, 'reprogramar')} disabled={c.status === 'cumplido'}>Reprogramar</button>
          <button className={`btn btn-sm ${r === 'escalar' ? 'btn-primary' : ''}`} onClick={() => answer(c, 'escalar')} disabled={c.status === 'cumplido'}>Escalar</button>
        </div>
      </div>
    );
  };

  const groups: { key: string; title: string; color: string; items: Commitment[] }[] = [
    { key: 'v', title: 'Vencidos / incumplidos', color: 'var(--coral)', items: vencidos },
    { key: 'r', title: 'Reprogramados', color: '#F5A524', items: reprogramados },
    { key: 'p', title: 'Pendientes por confirmar', color: 'var(--sky)', items: pendientes },
  ];

  return (
    <div className="m-stage">
      <div className="row-wrap" style={{ alignItems: 'flex-end' }}>
        <div className="grow">
          <div className="upper" style={{ color: 'var(--soc)' }}>Paso 1 de 2</div>
          <h1 style={{ marginTop: 6 }}>Compromisos de la sesión anterior</h1>
          <p className="muted" style={{ marginTop: 4 }}>
            {toReview.length ? `${answered} de ${toReview.length} revisados.` : 'No hay compromisos pendientes de la sesión anterior.'}
          </p>
        </div>
        <button className={`btn btn-lg ${allDone ? 'btn-primary' : ''}`} onClick={onContinue}>
          {allDone ? 'Continuar a proyectos' : 'Continuar sin terminar'} <Icon name="arrowRight" size={16} />
        </button>
      </div>

      <div className="review-group">
        <div className="review-group-title">
          <span className="bar" style={{ width: 10, height: 10, borderRadius: 3, background: 'var(--lime)' }} />
          <h2>Cumplidos</h2>
          <span className="muted strong">{completed.length}</span>
        </div>
        {completed.length === 0 && <div className="muted small">Ningún compromiso se cumplió entre sesiones.</div>}
        {completed.map((c) => (
          <div className="card review-item answered" key={c.id}>
            <Icon name="check" className="muted" />
            <div className="grow">
              <div className="t">{c.action}</div>
              <div className="s">{byId(data.projects, c.projectId)?.name} · {personName(data, c.ownerId)} · cumplido {c.completedAt ? fmtDay(c.completedAt.slice(0, 10)) : ''}</div>
            </div>
            <CommitmentBadge status="cumplido" />
          </div>
        ))}
      </div>

      {groups.map((g) => g.items.length > 0 && (
        <div className="review-group" key={g.key}>
          <div className="review-group-title">
            <span style={{ width: 10, height: 10, borderRadius: 3, background: g.color }} />
            <h2>{g.title}</h2>
            <span className="muted strong">{g.items.length}</span>
          </div>
          {g.items.map(item)}
        </div>
      ))}

      {toReview.length > 0 && (
        <div className="row" style={{ justifyContent: 'flex-end' }}>
          <button className={`btn btn-lg ${allDone ? 'btn-primary' : ''}`} onClick={onContinue}>
            Continuar a proyectos <Icon name="arrowRight" size={16} />
          </button>
        </div>
      )}

      {modal?.type === 'reprogramar' && (
        <RescheduleForm
          commitmentId={modal.id}
          onClose={() => setModal(null)}
          onSubmit={(x) => run(reviewCommitment, session.id, modal.id, 'reprogramar', { kind: 'reprogramar', ...x })}
        />
      )}
      {modal?.type === 'escalar' && (
        <EscalateForm
          commitmentId={modal.id}
          onClose={() => setModal(null)}
          onSubmit={(x) => run(reviewCommitment, session.id, modal.id, 'escalar', { kind: 'escalar', ...x })}
        />
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 2. Proyectos                                                        */
/* ------------------------------------------------------------------ */

function BoardStep({ session, onClose }: { session: Session; onClose: () => void }) {
  const { data, run } = useStore();
  const [showP3, setShowP3] = useState(false);
  const sections = meetingQueue(data, session);
  const visibleSections = sections.filter((s) => !s.optional || showP3);
  const order = useMemo(() => visibleSections.flatMap((s) => s.projects.map((p) => p.id)), [visibleSections]);
  const reviewed = new Set(session.reviewedProjectIds);
  const [currentId, setCurrentId] = useState<ID | undefined>(() => order.find((id) => !reviewed.has(id)) ?? order[0]);
  const current = byId(data.projects, currentId) ?? byId(data.projects, order[0]);
  const idx = current ? order.indexOf(current.id) : -1;

  useEffect(() => {
    if (current && !session.reviewedProjectIds.includes(current.id)) run(markProjectReviewed, session.id, current.id);
  }, [current?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const go = (delta: number) => {
    const next = order[idx + delta];
    if (next) {
      setCurrentId(next);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (document.querySelector('.modal-backdrop')) return;
      const t = e.target as HTMLElement;
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(t.tagName)) return;
      if (e.key === 'ArrowRight') go(1);
      if (e.key === 'ArrowLeft') go(-1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  const optional = sections.find((s) => s.optional);

  return (
    <div className="m-body">
      <aside className="m-queue">
        {visibleSections.map((s) => (
          <div key={s.key}>
            <h4>{s.title} <span className="faint">{s.projects.length}</span></h4>
            {s.projects.map((p) => (
              <button
                key={p.id}
                className={`m-queue-item ${current?.id === p.id ? 'on' : ''} ${reviewed.has(p.id) ? 'seen' : ''}`}
                onClick={() => setCurrentId(p.id)}
              >
                <span className="st" style={{ background: statusColor(p) }} />
                <span className="name">{p.name}</span>
                {reviewed.has(p.id) && <Icon name="check" size={14} className="ok" />}
              </button>
            ))}
          </div>
        ))}
        {optional && (
          <button className="btn btn-ghost btn-sm btn-block" style={{ marginTop: 10 }} onClick={() => setShowP3((v) => !v)}>
            {showP3 ? 'Ocultar P3' : `Mostrar P3 (${optional.projects.length}) · sólo si hay tiempo`}
          </button>
        )}
      </aside>

      <div className="m-stage">
        {current ? (
          <>
            <div className="m-nav">
              <span className="upper" style={{ color: 'var(--soc)' }}>
                {visibleSections.find((s) => s.projects.some((p) => p.id === current.id))?.title}
              </span>
              <span className="spacer" />
              <span className="muted small">{idx + 1} de {order.length}</span>
              <button className="btn btn-sm" onClick={() => go(-1)} disabled={idx <= 0}><Icon name="chevronLeft" size={15} /> Anterior</button>
              {idx < order.length - 1 ? (
                <button className="btn btn-sm btn-primary" onClick={() => go(1)}>Siguiente <Icon name="chevronRight" size={15} /></button>
              ) : (
                <button className="btn btn-sm btn-primary" onClick={onClose}>Ir al cierre <Icon name="arrowRight" size={15} /></button>
              )}
            </div>
            <ProjectCard project={current} session={session} onAdvance={() => go(1)} />
            <div className="row small muted" style={{ justifyContent: 'center' }}>
              <span className="m-kbd">←</span><span className="m-kbd">→</span> para navegar entre proyectos
            </div>
          </>
        ) : (
          <div className="card empty"><h3>Sin proyectos</h3>Agrega proyectos para revisarlos en la Weekly.</div>
        )}
      </div>
    </div>
  );
}

function statusColor(p: Project) {
  return p.status === 'bloqueado' ? 'var(--coral)' : p.status === 'decision' ? 'var(--pink)' : p.status === 'resuelto' ? 'var(--soc)' : 'var(--lime)';
}

function ProjectCard({ project: p, session, onAdvance }: { project: Project; session: Session; onAdvance: () => void }) {
  const { data, run } = useStore();
  const actions = useActions();
  const toast = useToast();
  const now = useNow();
  const blockers = openBlockersOf(data, p.id);
  const loose = sortByDue(data.commitments.filter((c) => c.projectId === p.id && isOpen(c) && !blockers.some((b) => b.commitmentId === c.id)));
  const resolvedHere = data.blockers.filter((b) => b.projectId === p.id && b.resolvedSessionId === session.id);
  const tone = p.status === 'bloqueado' ? 'is-blocked' : p.status === 'decision' ? 'is-decision' : p.status === 'resuelto' ? 'is-resolved' : 'is-ok';

  const setStatus = (status: 'avanza' | 'resuelto') => {
    const n = run(setProjectStatus, p.id, status, session.id) ?? 0;
    if (status === 'avanza') {
      toast(n ? `${n === 1 ? 'Bloqueo resuelto' : `${n} bloqueos resueltos`} · el proyecto avanza` : 'Avanza');
      if (!n) onAdvance();
    } else {
      toast(n ? `Resuelto · ${n === 1 ? '1 bloqueo cerrado' : `${n} bloqueos cerrados`}` : 'Proyecto resuelto');
    }
  };

  return (
    <article className="m-card">
      <div className={`m-card-head ${tone}`}>
        <div className="row" style={{ alignItems: 'flex-start' }}>
          <h1 className="grow">{p.name}</h1>
          <button className="btn btn-ghost btn-sm" onClick={() => actions.editProject(p.id)}><Icon name="edit" size={15} /> Editar</button>
        </div>
        <div className="m-facts">
          <div className="m-fact"><div className="k">Área</div><div className="v"><AreaTag area={byId(data.areas, p.areaId)} /></div></div>
          <div className="m-fact"><div className="k">Responsable</div><div className="v">{personName(data, p.ownerId) || '—'}</div></div>
          <div className="m-fact"><div className="k">Prioridad</div><div className="v"><ProjectPriority project={p} large /></div></div>
          <div className="m-fact">
            <div className="k">Score</div>
            <div className="v">{computeScore(p)} <span className="small muted" style={{ fontWeight: 500 }}>I{p.impact} · U{p.urgency} · D{p.dependency}</span></div>
          </div>
          <div className="m-fact"><div className="k">Estado</div><div className="v"><ProjectStatusBadge status={p.status} large /></div></div>
        </div>
      </div>

      <div className="m-card-body">
        {blockers.map((b) => {
          const c = blockerCommitment(data, b);
          const ok = isBlockerActionable(data, b);
          return (
            <div key={b.id} className={`m-issue ${b.kind}`}>
              <div className="row">
                <span className={`badge ${b.kind === 'decision' ? 'st-decision' : 'st-bloqueado'}`}>{b.kind === 'decision' ? 'Requiere decisión' : 'Bloqueo'}</span>
                <span className="spacer" />
                <button className="btn btn-ghost btn-xs" onClick={() => actions.editBlocker(b.id)}><Icon name="edit" size={13} /> Editar</button>
              </div>
              <div className="m-issue-grid">
                <div><div className="k">{b.kind === 'decision' ? 'Qué se decide' : 'Qué bloquea'}</div><div className="v">{b.description}</div></div>
                <div><div className="k">Qué necesitamos</div><div className="v">{b.need || <span className="faint">—</span>}</div></div>
                <div><div className="k">{b.kind === 'decision' ? 'Quién decide' : 'Depende de'}</div><div className="v">{b.dependsOn?.label ?? <span className="faint">—</span>}</div></div>
                <div><div className="k">Gestiona el desbloqueo</div><div className="v">{personName(data, b.ownerId) || <span style={{ color: 'var(--coral-ink)' }}>Sin responsable</span>}</div></div>
              </div>
              {c && (
                <div className="m-commit">
                  <Icon name="target" size={16} />
                  <span className="grow"><b>{c.action}</b></span>
                  <span className="nowrap"><b>{fmtDue(c.dueDate, c.dueTime)}</b></span>
                  <CommitmentBadge status={displayStatus(c, now)} />
                  {c.reschedules.length > 0 && <span className="small muted">Reprogramado {c.reschedules.length}×</span>}
                  {isOpen(c) && isActionable(c) && (
                    <button className="btn btn-xs" onClick={() => actions.reschedule(c.id)}><Icon name="reschedule" size={13} /> Reprogramar</button>
                  )}
                </div>
              )}
              {!ok && (
                <div className="warn danger">
                  <Icon name="alert" size={16} />
                  <span className="grow">Este bloqueo todavía no tiene un compromiso accionable.</span>
                  <button className="btn btn-sm btn-primary" onClick={() => actions.editBlocker(b.id)}>Definir compromiso</button>
                </div>
              )}
            </div>
          );
        })}

        {resolvedHere.length > 0 && (
          <div className="warn info">
            <Icon name="unlock" size={16} />
            <span>Resuelto en esta sesión: {resolvedHere.map((b) => b.description).join(' · ')}</span>
          </div>
        )}

        {loose.length > 0 && (
          <div className="stack" style={{ gap: 8 }}>
            <div className="upper muted">Compromisos del proyecto</div>
            {loose.map((c) => (
              <button key={c.id} className="m-commit link-btn" style={{ background: 'var(--line-2)' }} onClick={() => actions.commitmentDetail(c.id)}>
                <Icon name="checks" size={16} />
                <span className="grow"><b>{c.action}</b> <span className="muted">· {personName(data, c.ownerId) || 'Sin responsable'}</span></span>
                <span className="nowrap"><b>{fmtDue(c.dueDate, c.dueTime)}</b></span>
                <CommitmentBadge status={displayStatus(c, now)} />
              </button>
            ))}
          </div>
        )}

        {blockers.length === 0 && loose.length === 0 && resolvedHere.length === 0 && (
          <div className="muted">Sin bloqueos ni compromisos abiertos. ¿Avanza?</div>
        )}

        <div className="m-actions">
          <button className={`m-action a-avanza ${p.status === 'avanza' ? 'on' : ''}`} onClick={() => setStatus('avanza')}>
            <Icon name="arrowRight" /> Avanza
          </button>
          <button className={`m-action a-bloqueado ${p.status === 'bloqueado' ? 'on' : ''}`} onClick={() => actions.block(p.id, 'bloqueo')}>
            <Icon name="lock" /> Bloqueado
          </button>
          <button className={`m-action a-decision ${p.status === 'decision' ? 'on' : ''}`} onClick={() => actions.block(p.id, 'decision')}>
            <Icon name="decision" /> Requiere decisión
          </button>
          <button className={`m-action a-resuelto ${p.status === 'resuelto' ? 'on' : ''}`} onClick={() => setStatus('resuelto')}>
            <Icon name="check" /> Resuelto
          </button>
        </div>
        <div className="row" style={{ justifyContent: 'center' }}>
          <button className="btn btn-ghost btn-sm" onClick={() => actions.newCommitment(p.id)}><Icon name="plus" size={15} /> Agregar compromiso a este proyecto</button>
        </div>
      </div>
    </article>
  );
}

/* ------------------------------------------------------------------ */

function SessionCommitments({ session, onClose }: { session: Session; onClose: () => void }) {
  const { data } = useStore();
  const actions = useActions();
  const now = useNow();
  const open = sortByDue(data.commitments.filter((c) => isOpen(c) && !byId(data.projects, c.projectId)?.archived));
  const created = open.filter((c) => c.createdSessionId === session.id);
  const previous = open.filter((c) => c.createdSessionId !== session.id);
  const row = (c: Commitment) => (
    <button key={c.id} className="list-item as-btn" onClick={() => actions.commitmentDetail(c.id)} style={{ padding: '10px 4px' }}>
      <div className="grow">
        <div className="t">{c.action}</div>
        <div className="s">{byId(data.projects, c.projectId)?.name ?? 'Sin proyecto'} · {personName(data, c.ownerId) || 'Sin responsable'}</div>
      </div>
      <span className="small strong nowrap">{fmtDue(c.dueDate, c.dueTime)}</span>
      <CommitmentBadge status={displayStatus(c, now)} />
    </button>
  );
  return (
    <Modal
      title="Compromisos"
      subtitle="Todo lo abierto antes de terminar la sesión."
      size="wide"
      onClose={onClose}
      footer={<button className="btn btn-primary" onClick={() => actions.newCommitment()}><Icon name="plus" size={15} /> Nuevo compromiso</button>}
    >
      <div>
        <div className="upper muted">Nuevos en esta sesión · {created.length}</div>
        {created.length === 0 && <div className="small muted" style={{ padding: '8px 0' }}>Aún no se han creado compromisos.</div>}
        <div className="list">{created.map(row)}</div>
      </div>
      <div>
        <div className="upper muted">Abiertos de sesiones anteriores · {previous.length}</div>
        <div className="list">{previous.map(row)}</div>
      </div>
    </Modal>
  );
}

/* ------------------------------------------------------------------ */
/* 3. Cierre                                                           */
/* ------------------------------------------------------------------ */

function CloseModal({ session, onCancel, onConfirm, onReview }: {
  session: Session; onCancel: () => void; onConfirm: () => void; onReview: () => void;
}) {
  const { data } = useStore();
  const actions = useActions();
  const now = useNow();
  const issues = closingIssues(data, session);
  const groups = groupIssues(issues);
  const st = sessionStats(data, session, now);

  const fix = (i: Issue) => {
    if (i.kind === 'revision_pendiente') return onReview();
    if (i.blockerId) return actions.editBlocker(i.blockerId);
    if (i.commitmentId) return actions.editCommitment(i.commitmentId);
    if (i.projectId) return actions.block(i.projectId, byId(data.projects, i.projectId)?.status === 'decision' ? 'decision' : 'bloqueo');
  };

  return (
    <Modal
      title="Cerrar Weekly"
      subtitle={`${fmtLongDay(session.date)} · Semana ${fmtWeekRange(session.weekStart)}`}
      size="wide"
      onClose={onCancel}
      footer={
        <>
          <button className="btn" onClick={onCancel}>Volver a la junta</button>
          <button className="btn btn-primary" onClick={onConfirm}>
            <Icon name="stop" size={13} /> {issues.length ? 'Cerrar de todos modos' : 'Cerrar Weekly y generar resumen'}
          </button>
        </>
      }
    >
      <div className="kpis" style={{ gridTemplateColumns: 'repeat(4, minmax(0,1fr))' }}>
        <div className="kpi" style={{ cursor: 'default' }}><span className="kpi-value">{st.projects.reviewed}</span><span className="kpi-label">Revisados</span></div>
        <div className="kpi" style={{ cursor: 'default', ['--kpi' as string]: 'var(--coral)' }}><span className="kpi-value">{st.blockers.detected}</span><span className="kpi-label">Bloqueos</span><span className="kpi-hint">{st.blockers.resolved} resueltos</span></div>
        <div className="kpi" style={{ cursor: 'default', ['--kpi' as string]: 'var(--sky)' }}><span className="kpi-value">{st.commitments.created}</span><span className="kpi-label">Nuevos</span><span className="kpi-hint">compromisos</span></div>
        <div className={`kpi ${st.commitments.overdue ? 'alert' : 'zero'}`} style={{ cursor: 'default', ['--kpi' as string]: 'var(--coral)' }}><span className="kpi-value">{st.commitments.overdue}</span><span className="kpi-label">Vencidos</span></div>
      </div>

      {issues.length === 0 ? (
        <div className="warn info"><Icon name="check" size={16} /> Todo bloqueo y compromiso tiene acción, responsable, fecha y hora.</div>
      ) : (
        <>
          <div className="warn">
            <Icon name="alert" size={16} />
            <span>Hay {issues.length} {issues.length === 1 ? 'punto incompleto' : 'puntos incompletos'}. Puedes completarlos ahora o cerrar de todos modos: quedarán señalados en el resumen.</span>
          </div>
          {groups.map((g) => (
            <div className="issue-group" key={g.kind}>
              <h4><Icon name="alert" size={14} /> {g.label} · {g.items.length}</h4>
              <ul>
                {g.items.slice(0, 8).map((i, n) => (
                  <li key={n}>
                    <span className="strong">{i.title}</span> <span className="muted">— {i.detail}</span>{' '}
                    <button className="btn btn-xs" onClick={() => fix(i)}>Completar</button>
                  </li>
                ))}
                {g.items.length > 8 && <li className="muted">y {g.items.length - 8} más</li>}
              </ul>
            </div>
          ))}
        </>
      )}
    </Modal>
  );
}

function SummaryScreen({ session }: { session: Session }) {
  const toast = useToast();
  const { data } = useStore();
  const k = session.snapshot!;
  const now = useNow();
  const pendingOverdue = data.commitments.filter((c) => isOverdue(c, now)).length;
  const copy = async (text: string, what: string) => {
    const ok = await copyRich(text);
    toast(ok ? `${what} copiado. Pégalo en Teams.` : 'No se pudo copiar. Selecciona el texto manualmente.', ok ? 'ok' : 'error');
  };
  return (
    <div className="meeting">
      <header className="m-top">
        <div>
          <div className="title">WEEKLY CERRADA</div>
          <div className="sub">{fmtLongDay(session.date)} · Semana {fmtWeekRange(session.weekStart)}</div>
        </div>
        <span className="spacer" />
        <button className="btn btn-sm" onClick={() => navigate('/mis-compromisos')}><Icon name="user" size={15} /> Mis compromisos</button>
        <button className="btn btn-sm btn-primary" onClick={() => navigate('/')}><Icon name="home" size={15} /> Ir al Dashboard</button>
      </header>
      <div className="m-stage">
        <div className="row-wrap" style={{ alignItems: 'flex-end' }}>
          <div className="grow">
            <div className="upper" style={{ color: 'var(--soc)' }}>Resumen de acuerdos</div>
            <h1 style={{ marginTop: 6 }}>{k.commitments.created} compromisos nuevos · {k.blockers.followUp} bloqueos en seguimiento</h1>
            {k.warnings.length > 0 && <p className="muted" style={{ marginTop: 4 }}>{k.warnings.length} puntos quedaron por definir (incluidos en el resumen).</p>}
            {pendingOverdue > 0 && <p className="muted">{pendingOverdue} compromisos vencidos siguen abiertos.</p>}
          </div>
          <button className="btn btn-lg" onClick={() => copy(k.commitmentsText, 'Compromisos')}><Icon name="copy" size={16} /> Copiar compromisos</button>
          <button className="btn btn-lg btn-primary" onClick={() => copy(k.summaryText, 'Resumen')}><Icon name="copy" size={16} /> Copiar resumen para Teams</button>
        </div>
        <pre className="summary-pre" style={{ maxHeight: 'none' }}>{k.summaryText}</pre>
      </div>
    </div>
  );
}
