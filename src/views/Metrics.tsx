import { useState } from 'react';
import { Icon } from '../components/Icon';
import { useNow, useStore } from '../data/store';
import { fmtDayShort } from '../domain/dates';
import { computeMetrics, fmtDays, pct, periodSince, type Performance } from '../domain/metrics';

const PERIODS: { weeks: number | null; label: string }[] = [
  { weeks: 4, label: '4 semanas' },
  { weeks: 12, label: '12 semanas' },
  { weeks: null, label: 'Todo' },
];

export function Metrics() {
  const { data } = useStore();
  const now = useNow();
  const [weeks, setWeeks] = useState<number | null>(12);
  const m = computeMetrics(data, now, periodSince(weeks, now));
  const o = m.overall;

  return (
    <div className="page">
      <header className="page-header">
        <div className="titles">
          <div className="eyebrow">¿Estamos cumpliendo?</div>
          <h1>Métricas</h1>
          <p>Cumplimiento de compromisos, desbloqueo y dependencias. Calculado con lo registrado en cada Weekly.</p>
        </div>
        <div className="seg">
          {PERIODS.map((p) => (
            <button key={p.label} className={weeks === p.weeks ? 'on' : ''} onClick={() => setWeeks(p.weeks)}>{p.label}</button>
          ))}
        </div>
      </header>

      <section className="kpis">
        <Tile value={pct(o.rate)} label="Cumplidos a tiempo" hint={`${o.onTime} de ${o.onTime + o.late + o.overdue} con fecha vencida`} />
        <Tile value={String(o.late)} label="Cumplidos tarde" hint="después de la fecha compromiso" />
        <Tile value={String(o.overdue)} label="Vencidos abiertos" hint="aún sin cumplir" alert={o.overdue > 0} />
        <Tile value={o.total ? (o.reschedules / o.total).toFixed(1) : '—'} label="Reprog. por compromiso" hint={`${o.reschedules} reprogramaciones en total`} />
        <Tile value={fmtDays(m.blockers.avgResolutionDays)} label="Resolución de bloqueos" hint={`promedio · ${m.blockers.resolved} resueltos, ${m.blockers.open} abiertos`} />
      </section>

      {m.trend.length > 0 && (
        <section>
          <div className="section-title"><h2>Por Weekly</h2><span className="muted small">según el cierre de cada sesión</span></div>
          <div className="mini-grid">
            <MiniBars title="Compromisos nuevos" points={m.trend.map((t) => ({ x: t.date, y: t.created }))} />
            <MiniBars title="Cumplidos en sesión" points={m.trend.map((t) => ({ x: t.date, y: t.completed }))} />
            <MiniBars title="Vencidos al cierre" points={m.trend.map((t) => ({ x: t.date, y: t.overdue }))} tone="alert" />
            <MiniBars title="Bloqueos detectados" points={m.trend.map((t) => ({ x: t.date, y: t.detected }))} />
          </div>
        </section>
      )}

      <div className="grid-2 even">
        <PerfTable title="Cumplimiento por área" rows={m.byArea} />
        <PerfTable title="Cumplimiento por responsable" rows={m.byPerson} />
      </div>

      <div className="grid-2 even">
        <section className="card card-pad">
          <div className="section-title"><h2>¿A quién esperamos más?</h2></div>
          <Bars rows={m.dependencies.waitedOn.slice(0, 8).map((x) => ({ label: x.label, value: x.count, note: x.open ? `${x.open} ${x.open === 1 ? 'abierto' : 'abiertos'}` : 'sin abiertos' }))} empty="Sin dependencias registradas." />
        </section>
        <section className="card card-pad">
          <div className="section-title"><h2>Área con más dependencias</h2></div>
          <Bars rows={m.dependencies.waiting.map((x) => ({ label: x.label, value: x.count, note: 'bloqueos y compromisos que dependen de otros' }))} empty="Sin dependencias registradas." />
        </section>
      </div>

      <div className="grid-2 even">
        <section className="card card-pad">
          <div className="section-title"><h2>Bloqueos por área</h2></div>
          <table className="tbl">
            <thead><tr><th>Área</th><th className="num">Resueltos</th><th className="num">Abiertos</th><th className="num">Tiempo promedio</th></tr></thead>
            <tbody>
              {m.blockers.byArea.map((r) => (
                <tr key={r.key}><td className="cell-title">{r.label}</td><td className="num">{r.resolved}</td><td className="num">{r.open}</td><td className="num">{fmtDays(r.avgDays)}</td></tr>
              ))}
            </tbody>
          </table>
          {m.blockers.byArea.length === 0 && <div className="empty">Sin bloqueos en el periodo.</div>}
        </section>
        <section className="card card-pad stack">
          <div className="section-title" style={{ marginBottom: 0 }}><h2>Bloqueos recurrentes</h2></div>
          <div>
            <div className="upper muted" style={{ marginBottom: 6 }}>Proyectos bloqueados más de una vez</div>
            {m.recurring.projects.length === 0 && <div className="small muted">Ninguno en el periodo.</div>}
            {m.recurring.projects.map((p) => (
              <div className="bottleneck" key={p.id}><div className="grow"><div className="strong">{p.name}</div><div className="small muted">{p.area}</div></div><b>{p.count}×</b></div>
            ))}
          </div>
          <div>
            <div className="upper muted" style={{ marginBottom: 6 }}>Dependencias que frenan varios proyectos</div>
            {m.recurring.targets.length === 0 && <div className="small muted">Ninguna en el periodo.</div>}
            {m.recurring.targets.map((t) => (
              <div className="bottleneck" key={t.label}><div className="grow"><div className="strong">{t.label}</div><div className="small muted">{t.projects} proyectos</div></div><b>{t.count}×</b></div>
            ))}
          </div>
        </section>
      </div>

      <p className="small muted">
        <Icon name="alert" size={13} /> "A tiempo" = cumplido antes de la fecha y hora compromiso vigente. La base incluye los vencidos abiertos.
        Los compromisos se asignan al periodo por su fecha de creación.
      </p>
    </div>
  );
}

function Tile({ value, label, hint, alert }: { value: string; label: string; hint: string; alert?: boolean }) {
  return (
    <div className={`kpi static ${alert ? 'alert' : ''}`}>
      <span className="kpi-value">{value}</span>
      <span className="kpi-label">{label}</span>
      <span className="kpi-hint">{hint}</span>
    </div>
  );
}

function PerfTable({ title, rows }: { title: string; rows: { key: string; label: string; perf: Performance }[] }) {
  return (
    <section className="card card-pad">
      <div className="section-title"><h2>{title}</h2></div>
      <table className="tbl">
        <thead><tr><th>Nombre</th><th style={{ width: '40%' }}>A tiempo</th><th className="num">Tarde</th><th className="num">Vencidos</th><th className="num">Reprog.</th></tr></thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.key}>
              <td className="cell-title">{r.label}</td>
              <td>
                <div className="meter" title={`${r.perf.onTime} a tiempo de ${r.perf.onTime + r.perf.late + r.perf.overdue}`}>
                  <div className="track"><div className="fill" style={{ width: `${(r.perf.rate ?? 0) * 100}%` }} /></div>
                  <span className="strong">{pct(r.perf.rate)}</span>
                </div>
              </td>
              <td className="num">{r.perf.late}</td>
              <td className="num" style={{ color: r.perf.overdue ? 'var(--coral-ink)' : undefined, fontWeight: r.perf.overdue ? 700 : undefined }}>{r.perf.overdue}</td>
              <td className="num">{r.perf.reschedules}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {rows.length === 0 && <div className="empty">Sin compromisos en el periodo.</div>}
    </section>
  );
}

function Bars({ rows, empty }: { rows: { label: string; value: number; note: string }[]; empty: string }) {
  const max = Math.max(1, ...rows.map((r) => r.value));
  if (!rows.length) return <div className="muted">{empty}</div>;
  return (
    <div>
      {rows.map((r) => (
        <div className="bottleneck" key={r.label} title={`${r.label}: ${r.value}`}>
          <div style={{ width: 190, flex: 'none' }}>
            <div className="strong">{r.label}</div>
            <div className="small muted">{r.note}</div>
          </div>
          <div className="track"><div className="bar" style={{ width: `${(r.value / max) * 100}%` }} /></div>
          <b style={{ width: 22, textAlign: 'right' }}>{r.value}</b>
        </div>
      ))}
    </div>
  );
}

/** Barras pequeñas de una sola serie, con tooltip al pasar el cursor. */
function MiniBars({ title, points, tone }: { title: string; points: { x: string; y: number }[]; tone?: 'alert' }) {
  const [hover, setHover] = useState<number | null>(null);
  const W = 260, H = 84, pad = 4;
  const max = Math.max(1, ...points.map((p) => p.y));
  const slot = (W - pad * 2) / Math.max(points.length, 1);
  const bw = Math.min(28, slot - 2);
  const last = points[points.length - 1];
  const color = tone === 'alert' ? 'var(--coral)' : 'var(--soc)';
  const shown = hover ?? points.length - 1;
  return (
    <div className="card card-pad mini">
      <div className="row" style={{ alignItems: 'baseline' }}>
        <span className="upper muted grow">{title}</span>
        <span className="mini-value">{points[shown]?.y ?? last?.y}</span>
      </div>
      <div className="small muted">{points[shown] ? `Weekly ${fmtDayShort(points[shown].x)}` : ''}</div>
      <svg viewBox={`0 0 ${W} ${H + 16}`} width="100%" role="img" aria-label={`${title}: ${points.map((p) => `${fmtDayShort(p.x)} ${p.y}`).join(', ')}`} onMouseLeave={() => setHover(null)}>
        <line x1={0} x2={W} y1={H} y2={H} stroke="var(--line)" strokeWidth={1} />
        {points.map((p, i) => {
          const h = (p.y / max) * (H - 8);
          const x = pad + i * slot + (slot - bw) / 2;
          return (
            <g key={p.x} onMouseEnter={() => setHover(i)}>
              <rect x={pad + i * slot} y={0} width={slot} height={H + 16} fill="transparent" />
              <path
                d={h > 0 ? `M${x},${H} v${-(h - 4)} q0,-4 4,-4 h${bw - 8} q4,0 4,4 v${h - 4} z` : ''}
                fill={color}
                opacity={hover === null || hover === i ? 1 : 0.45}
              />
              {(i === 0 || i === points.length - 1 || hover === i) && (
                <text x={x + bw / 2} y={H + 13} textAnchor="middle" fontSize="10" fill="var(--muted)">{fmtDayShort(p.x)}</text>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
