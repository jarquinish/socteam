import type { ReactNode } from 'react';
import { useNow, useStore } from './data/store';
import { startSession } from './domain/operations';
import { currentSession, dashboardStats } from './domain/selectors';
import { Icon } from './components/Icon';
import { href, navigate, useRoute } from './router';
import { Dashboard } from './views/Dashboard';
import { Projects } from './views/Projects';
import { Blockers } from './views/Blockers';
import { Commitments } from './views/Commitments';
import { Dependencies } from './views/Dependencies';
import { MyCommitments } from './views/MyCommitments';
import { History } from './views/History';
import { Settings } from './views/Settings';
import { Meeting } from './views/Meeting';
import { Metrics } from './views/Metrics';
import { PersonSelect } from './components/fields';

interface NavItem { path: string; label: string; short: string; icon: string; count?: number }

export function App() {
  const route = useRoute();
  if (route.path === '/weekly') return <Meeting />;

  let view: ReactNode;
  switch (route.path) {
    case '/proyectos': view = <Projects params={route.params} />; break;
    case '/bloqueos': view = <Blockers params={route.params} />; break;
    case '/compromisos': view = <Commitments params={route.params} />; break;
    case '/dependencias': view = <Dependencies />; break;
    case '/mis-compromisos': view = <MyCommitments params={route.params} />; break;
    case '/historial': view = <History />; break;
    case '/metricas': view = <Metrics />; break;
    case '/configuracion': view = <Settings />; break;
    default: view = <Dashboard />;
  }
  return <Shell path={route.path}>{view}</Shell>;
}

/** Inicia (o retoma) la Weekly y entra a Modo Junta. */
export function useStartWeekly() {
  const { run } = useStore();
  return () => {
    if (run(startSession)) navigate('/weekly');
  };
}

function Shell({ path, children }: { path: string; children: ReactNode }) {
  const { data, sync, me } = useStore();
  const now = useNow();
  const stats = dashboardStats(data, now);
  const live = currentSession(data);
  const startWeekly = useStartWeekly();

  const items: NavItem[] = [
    { path: '/', label: 'Dashboard', short: 'Inicio', icon: 'home' },
    { path: '/proyectos', label: 'Proyectos', short: 'Proyectos', icon: 'folder' },
    { path: '/bloqueos', label: 'Centro de bloqueos', short: 'Bloqueos', icon: 'lock', count: stats.blocked + stats.decision },
    { path: '/compromisos', label: 'Compromisos', short: 'Compromisos', icon: 'checks', count: stats.overdue },
    { path: '/dependencias', label: 'Dependencias', short: 'Depend.', icon: 'flow' },
  ];
  const after: NavItem[] = [
    { path: '/mis-compromisos', label: 'Mis compromisos', short: 'Mis pend.', icon: 'user' },
    { path: '/metricas', label: 'Métricas', short: 'Métricas', icon: 'chart' },
    { path: '/historial', label: 'Historial', short: 'Historial', icon: 'history' },
    { path: '/configuracion', label: 'Configuración', short: 'Config.', icon: 'settings' },
  ];

  const link = (it: NavItem) => (
    <a key={it.path} href={href(it.path)} className={`nav-item ${path === it.path ? 'active' : ''}`} title={it.label}>
      <Icon name={it.icon} />
      <span className="label">{it.label}</span>
      {!!it.count && <span className="count">{it.count}</span>}
    </a>
  );

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">W&U</div>
          <div>
            <div className="brand-name">Weekly Alignment<br />&amp; Unblock</div>
            <div className="brand-sub">{data.settings.directionName}</div>
          </div>
        </div>
        {items.map(link)}
        <div className="nav-sep" />
        {after.map(link)}
        <div className="sidebar-cta">
          <div className="who">
            {me.person ? (
              <>
                <span className="muted">Estás como</span>
                <span className="name">{me.person.name}</span>
                {me.locked ? <span className="muted">{me.email}</span> : (
                  <button className="link-btn small strong" style={{ color: 'var(--soc)' }} onClick={() => me.setPersonId(undefined)}>Cambiar</button>
                )}
              </>
            ) : (
              <>
                <span className="muted">¿Quién eres?</span>
                <PersonSelect data={data} value={undefined} onChange={me.setPersonId} placeholder="Selecciona tu nombre" />
              </>
            )}
          </div>
          <SyncBadge sync={sync} />
          <button className="btn btn-primary btn-lg btn-block" onClick={startWeekly} title={live ? 'Continuar Weekly' : 'Iniciar Weekly'}>
            <Icon name="play" size={16} />
            <span className="label">{live ? 'Continuar Weekly' : 'Iniciar Weekly'}</span>
          </button>
        </div>
      </aside>
      <main className="main">{children}</main>
      <nav className="mobile-bar">
        {[...items.slice(0, 4), after[0]].map((it) => (
          <a key={it.path} href={href(it.path)} className={path === it.path ? 'active' : ''}>
            <Icon name={it.icon} size={20} />
            {it.short}
          </a>
        ))}
      </nav>
    </div>
  );
}

function SyncBadge({ sync }: { sync: ReturnType<typeof useStore>['sync'] }) {
  const label = sync.kind === 'local'
    ? 'Guardado en este navegador'
    : sync.status === 'offline'
      ? `Sin conexión${sync.pending ? ` · ${sync.pending} pendiente${sync.pending > 1 ? 's' : ''}` : ''}`
      : sync.status === 'saving' ? 'Guardando…' : 'Compartido · al día';
  const cls = sync.kind === 'local' ? 'local' : sync.status;
  return (
    <div className={`sync ${cls}`} title={label} role="status">
      <i /> <span>{label}</span>
    </div>
  );
}
