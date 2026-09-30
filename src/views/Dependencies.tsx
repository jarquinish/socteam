import { useState } from 'react';
import { useActions } from '../components/actions';
import { AreaTag, CommitmentBadge } from '../components/badges';
import { Icon } from '../components/Icon';
import { useNow, useStore } from '../data/store';
import { fmtDue } from '../domain/dates';
import {
  activeAreas, bottlenecks, byId, dependencyRows, DEPENDENCY_TYPE_LABEL, displayStatus, personName,
} from '../domain/selectors';

type Scope = 'todas' | 'internas' | 'externas';

export function Dependencies() {
  const { data } = useStore();
  const actions = useActions();
  const now = useNow();
  const [scope, setScope] = useState<Scope>('todas');
  const [area, setArea] = useState('');

  const all = dependencyRows(data);
  const rows = all.filter((r) => {
    if (scope === 'internas' && r.toType !== 'area' && r.toType !== 'persona') return false;
    if (scope === 'externas' && (r.toType === 'area' || r.toType === 'persona')) return false;
    if (area && r.fromAreaId !== area) return false;
    return true;
  });
  const top = bottlenecks(rows).slice(0, 6);
  const maxCount = Math.max(1, ...top.map((t) => t.count));

  // Relaciones área → área / área → externo
  const pairs = new Map<string, { from: string; to: string; count: number }>();
  for (const r of rows) {
    const k = `${r.fromArea}→${r.to}`;
    const e = pairs.get(k) ?? { from: r.fromArea, to: r.to, count: 0 };
    e.count += 1;
    pairs.set(k, e);
  }
  const pairList = [...pairs.values()].sort((a, b) => b.count - a.count);

  return (
    <div className="page">
      <header className="page-header">
        <div className="titles">
          <div className="eyebrow">¿Qué necesitamos para avanzar?</div>
          <h1>Dependencias</h1>
          <p>Quién necesita qué, de quién y para cuándo. Detecta dónde se acumulan los cuellos de botella.</p>
        </div>
        <div className="seg">
          {(['todas', 'internas', 'externas'] as Scope[]).map((s) => (
            <button key={s} className={scope === s ? 'on' : ''} onClick={() => setScope(s)}>
              {s === 'todas' ? 'Todas' : s === 'internas' ? 'Entre áreas' : 'Externas'}
            </button>
          ))}
        </div>
        <select className="select" value={area} onChange={(e) => setArea(e.target.value)}>
          <option value="">Todas las áreas</option>
          {activeAreas(data).map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
        </select>
      </header>

      <div className="grid-2" style={{ gridTemplateColumns: '1fr 1fr' }}>
        <section className="card card-pad">
          <div className="section-title"><h2>¿A quién estamos esperando?</h2></div>
          {top.length === 0 && <div className="muted">Sin dependencias abiertas.</div>}
          {top.map((t) => (
            <div className="bottleneck" key={t.to}>
              <div style={{ width: 190, flex: 'none' }}>
                <div className="strong">{t.to}</div>
                <div className="small muted">lo necesitan: {t.from.join(', ')}</div>
              </div>
              <div className="track"><div className="bar" style={{ width: `${(t.count / maxCount) * 100}%`, background: t.count >= 2 ? 'var(--coral)' : 'var(--soc)' }} /></div>
              <b style={{ width: 22, textAlign: 'right' }}>{t.count}</b>
            </div>
          ))}
        </section>
        <section className="card card-pad">
          <div className="section-title"><h2>Relaciones</h2></div>
          <div className="pairs">
            {pairList.length === 0 && <div className="muted">Sin relaciones abiertas.</div>}
            {pairList.map((p) => (
              <span className="pair" key={`${p.from}-${p.to}`}>
                {p.from} <Icon name="arrowRight" size={14} className="faint" /> {p.to}
                <span className="n">{p.count}</span>
              </span>
            ))}
          </div>
        </section>
      </div>

      <section className="card">
        <div className="flow">
          <div className="flow-head"><span><Icon name="user" size={13} /> Quién necesita</span></div>
          <div className="flow-head"><span><Icon name="target" size={13} /> Qué necesita</span></div>
          <div className="flow-head"><span><Icon name="flow" size={13} /> De quién</span></div>
          <div className="flow-head"><span><Icon name="clock" size={13} /> Cuándo</span></div>
          {rows.map((r) => {
            const open = () => (r.blocker ? actions.blockerDetail(r.blocker.id) : r.commitment && actions.commitmentDetail(r.commitment.id));
            const st = r.commitment ? displayStatus(r.commitment, now) : undefined;
            return (
              <div className="flow-row" key={r.key} onClick={open} style={{ cursor: 'pointer' }}>
                <div className="flow-cell arrow-cell">
                  <AreaTag area={byId(data.areas, r.fromAreaId)} />
                  <span className="small muted">{r.project}</span>
                </div>
                <div className="flow-cell arrow-cell">
                  <span className="strong">{r.need}</span>
                  {r.ownerId && <span className="small muted">Gestiona: {personName(data, r.ownerId)}</span>}
                </div>
                <div className="flow-cell arrow-cell">
                  <span className="strong">{r.to}</span>
                  <span className="small muted">{DEPENDENCY_TYPE_LABEL[r.toType]}</span>
                </div>
                <div className="flow-cell">
                  <span className="strong nowrap">{r.dueDate || r.dueTime ? fmtDue(r.dueDate, r.dueTime) : <span style={{ color: 'var(--coral-ink)' }}>Sin fecha</span>}</span>
                  {st && <span><CommitmentBadge status={st} /></span>}
                </div>
              </div>
            );
          })}
        </div>
        {rows.length === 0 && <div className="empty">No hay dependencias abiertas con este filtro.</div>}
      </section>
    </div>
  );
}
