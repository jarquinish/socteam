import { useStartWeekly } from '../App';
import { useActions } from '../components/actions';
import { AreaTag, CommitmentBadge, ProjectPriority, ProjectStatusBadge } from '../components/badges';
import { Icon } from '../components/Icon';
import { useNow, useStore } from '../data/store';
import { fmtDue, fmtLongDay, fmtStamp, fmtWeekRange, relativeDay, toISODate, weekStart, toISOTime, addDays } from '../domain/dates';
import { effectivePriority } from '../domain/scoring';
import {
  activeAreas, activeProjects, byId, closedSessions, commitmentDueTime, currentSession, dashboardStats,
  displayStatus, isActionable, isBlockerActionable, isOpen, isOverdue, isProjectStuck, personName, sortByDue, sortProjects,
} from '../domain/selectors';
import { navigate } from '../router';

export function Dashboard() {
  const { data } = useStore();
  const now = useNow();
  const actions = useActions();
  const startWeekly = useStartWeekly();
  const stats = dashboardStats(data, now);
  const live = currentSession(data);
  const last = closedSessions(data)[0];
  const thisWeek = toISODate(weekStart(now));

  const sessionLine = live
    ? <>Sesión en curso desde las <b>{toISOTime(new Date(live.startedAt))}</b></>
    : last && last.weekStart === thisWeek
      ? <>Sesión cerrada: <b>{fmtLongDay(last.date)}</b></>
      : <>Sesión: <b>{fmtLongDay(toISODate(now))}</b></>;

  const stuckP1 = sortProjects(activeProjects(data).filter((p) => isProjectStuck(p) && effectivePriority(p) === 'P1'));
  const overdue = sortByDue(data.commitments.filter((c) => isOverdue(c, now)));
  const unmanaged = data.blockers.filter((b) => b.column !== 'resuelto' && !isBlockerActionable(data, b) && !byId(data.projects, b.projectId)?.archived);
  const horizon = addDays(now, 7).getTime();
  const upcoming = sortByDue(
    data.commitments.filter((c) => isOpen(c) && !isOverdue(c, now) && isActionable(c) && commitmentDueTime(c) <= horizon),
  ).slice(0, 8);

  const kpis = [
    { value: stats.projects, label: 'Proyectos', hint: 'activos', go: () => navigate('/proyectos'), color: 'var(--soc)' },
    { value: stats.p1, label: 'P1', hint: `${stats.p2} P2 · ${stats.p3} P3`, go: () => navigate('/proyectos', { prioridad: 'P1' }), color: 'var(--soc)' },
    { value: stats.blocked, label: 'Bloqueados', hint: stats.decision ? `+${stats.decision} requiere decisión` : 'proyectos', go: () => navigate('/proyectos', { estado: 'atorado' }), color: 'var(--coral)', alert: stats.blocked > 0 },
    { value: stats.pending, label: 'Compromisos', hint: 'pendientes', go: () => navigate('/compromisos'), color: 'var(--sky)' },
    { value: stats.overdue, label: 'Vencidos', hint: 'requieren atención', go: () => navigate('/compromisos', { estado: 'vencido' }), color: 'var(--coral)', alert: stats.overdue > 0 },
  ];

  return (
    <div className="page">
      <section className="hero">
        <div className="grow">
          <div className="row" style={{ gap: 10, marginBottom: 6 }}>
            <span className="upper" style={{ color: 'rgba(255,255,255,.75)' }}>{data.settings.directionName}</span>
            {live && <span className="live"><i /> En curso</span>}
          </div>
          <h1>Weekly Alignment &amp; Unblock</h1>
          <div className="meta">
            <span>Semana: <b>{fmtWeekRange(thisWeek)}</b></span>
            <span>{sessionLine}</span>
          </div>
        </div>
        <div className="row-wrap">
          {last && (
            <button className="btn btn-ghost" onClick={() => navigate('/historial')}>
              <Icon name="history" size={16} /> Última Weekly
            </button>
          )}
          <button className="btn btn-primary btn-lg" onClick={startWeekly}>
            <Icon name="play" size={16} /> {live ? 'Continuar Weekly' : 'Iniciar Weekly'}
          </button>
        </div>
      </section>

      <section className="kpis">
        {kpis.map((k) => (
          <button
            key={k.label}
            className={`kpi ${k.alert ? 'alert' : ''} ${k.value === 0 ? 'zero' : ''}`}
            style={{ ['--kpi' as string]: k.color }}
            onClick={k.go}
          >
            <span className="kpi-value">{k.value}</span>
            <span className="kpi-label">{k.label}</span>
            <span className="kpi-hint">{k.hint}</span>
          </button>
        ))}
      </section>

      <div className="grid-2">
        <section className="card">
          <div className="card-header">
            <Icon name="alert" className="muted" />
            <h2>Lo que necesita atención</h2>
          </div>
          <div className="list">
            {stuckP1.length + overdue.length + unmanaged.length === 0 && (
              <div className="empty"><h3>Todo bajo control</h3>No hay P1 atorados ni compromisos vencidos.</div>
            )}
            {overdue.map((c) => {
              const p = byId(data.projects, c.projectId);
              return (
                <button key={c.id} className="list-item as-btn" onClick={() => actions.commitmentDetail(c.id)}>
                  <CommitmentBadge status="vencido" />
                  <div className="grow">
                    <div className="t">{c.action}</div>
                    <div className="s">{p?.name ?? 'Sin proyecto'} · {personName(data, c.ownerId) || 'Sin responsable'} · venció {fmtDue(c.dueDate, c.dueTime)}</div>
                  </div>
                  <Icon name="chevronRight" className="faint" />
                </button>
              );
            })}
            {stuckP1.map((p) => (
              <button key={p.id} className="list-item as-btn" onClick={() => actions.editProject(p.id)}>
                <ProjectStatusBadge status={p.status} />
                <div className="grow">
                  <div className="t">{p.name}</div>
                  <div className="s"><AreaTag area={byId(data.areas, p.areaId)} /> · {personName(data, p.ownerId)}</div>
                </div>
                <ProjectPriority project={p} />
              </button>
            ))}
            {unmanaged.map((b) => {
              const p = byId(data.projects, b.projectId);
              return (
                <button key={b.id} className="list-item as-btn" onClick={() => actions.editBlocker(b.id)}>
                  <span className="badge st-reprogramado">Sin compromiso</span>
                  <div className="grow">
                    <div className="t">{p?.name}</div>
                    <div className="s">Este bloqueo todavía no tiene un compromiso accionable.</div>
                  </div>
                  <span className="btn btn-sm">Definir</span>
                </button>
              );
            })}
          </div>
        </section>

        <section className="card">
          <div className="card-header">
            <Icon name="clock" className="muted" />
            <h2>Próximos compromisos</h2>
            <a href="#/compromisos" className="small strong">Ver todos</a>
          </div>
          <div className="list">
            {upcoming.length === 0 && <div className="empty">Sin compromisos en los próximos 7 días.</div>}
            {upcoming.map((c) => (
              <button key={c.id} className="list-item as-btn" onClick={() => actions.commitmentDetail(c.id)}>
                <div style={{ width: 64, flex: 'none' }}>
                  <div className="strong">{c.dueTime}</div>
                  <div className="small muted">{relativeDay(c.dueDate!, now)}</div>
                </div>
                <div className="grow">
                  <div className="t">{c.action}</div>
                  <div className="s">{personName(data, c.ownerId)} · {byId(data.projects, c.projectId)?.name ?? 'Sin proyecto'}</div>
                </div>
                <CommitmentBadge status={displayStatus(c, now)} />
              </button>
            ))}
          </div>
        </section>
      </div>

      <section>
        <div className="section-title">
          <h2>Áreas</h2>
          <span className="spacer" />
          <a href="#/configuracion" className="small strong">Configurar áreas</a>
        </div>
        <div className="area-grid">
          {activeAreas(data).map((a) => {
            const list = activeProjects(data).filter((p) => p.areaId === a.id);
            const blocked = list.filter(isProjectStuck).length;
            const p1 = list.filter((p) => effectivePriority(p) === 'P1').length;
            const over = list.length > data.settings.maxProjectsPerArea;
            return (
              <button key={a.id} className="area-card" onClick={() => navigate('/proyectos', { area: a.id })}>
                <div className="row"><AreaTag area={a} /></div>
                <div className="small muted">{personName(data, a.managerId) || 'Sin responsable asignado'}</div>
                <div className="n">
                  <span><b>{list.length}</b> proyectos</span>
                  <span><b>{p1}</b> P1</span>
                  <span style={{ color: blocked ? 'var(--coral-ink)' : undefined }}><b style={{ color: 'inherit' }}>{blocked}</b> atorados</span>
                </div>
                {over && <div className="small" style={{ color: 'var(--amber-ink)', fontWeight: 600 }}>Más de {data.settings.maxProjectsPerArea} proyectos: enfoca los más relevantes</div>}
              </button>
            );
          })}
        </div>
      </section>

      {last?.snapshot && (
        <section className="card card-pad row-wrap" style={{ gap: 20 }}>
          <div className="grow">
            <div className="upper muted">Última Weekly · {fmtStamp(last.closedAt!)}</div>
            <div style={{ marginTop: 6 }}>
              <b>{last.snapshot.commitments.created}</b> compromisos nuevos · <b>{last.snapshot.blockers.detected}</b> bloqueos detectados · <b>{last.snapshot.blockers.resolved}</b> resueltos en sesión
            </div>
          </div>
          <button className="btn" onClick={() => navigate('/historial', { sesion: last.id })}>Ver resumen</button>
        </section>
      )}
    </div>
  );
}
