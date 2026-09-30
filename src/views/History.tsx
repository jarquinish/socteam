import { useState } from 'react';
import { publishSummaryToTeams } from '../components/teams';
import { copyRich } from '../components/clipboard';
import { Icon } from '../components/Icon';
import { Modal } from '../components/Modal';
import { useToast } from '../components/Toast';
import { useStore } from '../data/store';
import { fmtLongDay, fmtWeekRange, toISOTime } from '../domain/dates';
import { byId, closedSessions, currentSession } from '../domain/selectors';
import type { Session } from '../domain/types';
import { navigate, useRoute } from '../router';

export function History() {
  const { data } = useStore();
  const route = useRoute();
  const sessions = closedSessions(data);
  const live = currentSession(data);
  const [open, setOpen] = useState<string | null>(route.params.get('sesion'));
  const selected = byId(data.sessions, open ?? undefined);

  return (
    <div className="page">
      <header className="page-header">
        <div className="titles">
          <div className="eyebrow">Continuidad</div>
          <h1>Historial de Weeklys</h1>
          <p>Cada sesión cerrada conserva su resumen y sus indicadores.</p>
        </div>
      </header>

      {live && (
        <div className="warn info">
          <Icon name="play" size={16} />
          <span className="grow">Hay una Weekly en curso desde el {fmtLongDay(live.date)} a las {toISOTime(new Date(live.startedAt))}.</span>
          <button className="btn btn-sm btn-primary" onClick={() => navigate('/weekly')}>Continuar</button>
        </div>
      )}

      <div className="card table-wrap">
        <table className="tbl responsive">
          <thead>
            <tr>
              <th>Fecha</th>
              <th className="hide-md">Semana</th>
              <th className="num">Revisados</th>
              <th className="num">Bloqueos</th>
              <th className="num">Resueltos</th>
              <th className="num">Nuevos comp.</th>
              <th className="num">Cumplidos</th>
              <th className="num">Vencidos</th>
              <th className="num">Reprog.</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {sessions.map((s) => {
              const k = s.snapshot;
              return (
                <tr key={s.id}>
                  <td data-label="Fecha" className="cell-title nowrap">{fmtLongDay(s.date)}</td>
                  <td data-label="Semana" className="muted hide-md">{fmtWeekRange(s.weekStart)}</td>
                  <td data-label="Revisados" className="num">{k?.projects.reviewed ?? '—'}</td>
                  <td data-label="Bloqueos" className="num">{k?.blockers.detected ?? '—'}</td>
                  <td data-label="Resueltos" className="num">{k?.blockers.resolved ?? '—'}</td>
                  <td data-label="Compromisos" className="num">{k?.commitments.created ?? '—'}</td>
                  <td data-label="Cumplidos" className="num">{k?.commitments.completed ?? '—'}</td>
                  <td data-label="Vencidos" className="num" style={{ color: k?.commitments.overdue ? 'var(--coral-ink)' : undefined, fontWeight: k?.commitments.overdue ? 700 : undefined }}>{k?.commitments.overdue ?? '—'}</td>
                  <td data-label="Reprog." className="num">{k?.commitments.rescheduled ?? '—'}</td>
                  <td><div className="actions"><button className="btn btn-sm" onClick={() => setOpen(s.id)}>Ver resumen</button></div></td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {sessions.length === 0 && <div className="empty"><h3>Sin sesiones cerradas</h3>Al cerrar la primera Weekly aparecerá aquí.</div>}
      </div>

      {selected?.snapshot && <SummaryModal session={selected} onClose={() => setOpen(null)} />}
    </div>
  );
}

export function SummaryModal({ session, onClose }: { session: Session; onClose: () => void }) {
  const toast = useToast();
  const { server } = useStore();
  const k = session.snapshot!;
  const copy = async (text: string, what: string) => {
    const ok = await copyRich(text);
    toast(ok ? `${what} copiado. Pégalo en Teams.` : 'No se pudo copiar', ok ? 'ok' : 'error');
  };
  return (
    <Modal
      title={`Weekly · ${fmtLongDay(session.date)}`}
      subtitle={`Semana ${fmtWeekRange(session.weekStart)}`}
      size="wide"
      onClose={onClose}
      footer={
        <>
          {server?.teams && <TeamsButton sessionId={session.id} />}
          <button className="btn" onClick={() => copy(k.commitmentsText, 'Compromisos')}><Icon name="copy" size={15} /> Copiar compromisos</button>
          <button className="btn btn-primary" onClick={() => copy(k.summaryText, 'Resumen')}><Icon name="copy" size={15} /> Copiar resumen para Teams</button>
        </>
      }
    >
      <pre className="summary-pre">{k.summaryText}</pre>
    </Modal>
  );
}

/** Publica el resumen en el canal de Teams configurado en el servidor. */
export function TeamsButton({ sessionId, large }: { sessionId: string; large?: boolean }) {
  const toast = useToast();
  const [busy, setBusy] = useState(false);
  return (
    <button
      className={`btn ${large ? 'btn-lg' : ''}`}
      disabled={busy}
      onClick={async () => {
        setBusy(true);
        const r = await publishSummaryToTeams(sessionId);
        setBusy(false);
        toast(r.ok ? 'Resumen publicado en el canal de Teams' : `No se publicó: ${r.error}`, r.ok ? 'ok' : 'error');
      }}
    >
      <Icon name="send" size={large ? 16 : 15} /> {busy ? 'Publicando…' : 'Publicar en Teams'}
    </button>
  );
}
