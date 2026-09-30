import { useState, type DragEvent } from 'react';
import { useActions } from '../components/actions';
import { AreaTag, PriorityBadge } from '../components/badges';
import { Icon } from '../components/Icon';
import { useToast } from '../components/Toast';
import { useNow, useStore } from '../data/store';
import { moveBlocker } from '../domain/operations';
import { fmtDayShort } from '../domain/dates';
import { effectivePriority, PRIORITY_RANK } from '../domain/scoring';
import {
  activeAreas, blockerCommitment, BLOCKER_COLUMN_LABEL, byId, commitmentDueTime, currentSession,
  isBlockerActionable, isOverdue, personName,
} from '../domain/selectors';
import type { Blocker, BlockerColumn } from '../domain/types';
import { setParams } from '../router';

const COLUMNS: { key: BlockerColumn; color: string }[] = [
  { key: 'por_destrabar', color: 'var(--coral)' },
  { key: 'en_gestion', color: 'var(--sky)' },
  { key: 'resuelto', color: 'var(--lime)' },
];

const RECENT_DAYS = 21;

export function Blockers({ params }: { params: URLSearchParams }) {
  const { data, run } = useStore();
  const actions = useActions();
  const toast = useToast();
  const now = useNow();
  const session = currentSession(data);
  const area = params.get('area') ?? '';
  const [dragId, setDragId] = useState<string | null>(null);
  const [over, setOver] = useState<BlockerColumn | null>(null);
  const [showAllResolved, setShowAllResolved] = useState(false);

  const since = now.getTime() - RECENT_DAYS * 86400000;
  const visible = data.blockers.filter((b) => {
    const p = byId(data.projects, b.projectId);
    if (!p || p.archived) return false;
    if (area && p.areaId !== area) return false;
    return true;
  });

  const sortKey = (b: Blocker) => {
    const p = byId(data.projects, b.projectId)!;
    const c = blockerCommitment(data, b);
    return [PRIORITY_RANK[effectivePriority(p)], c ? commitmentDueTime(c) : 0] as const;
  };
  const colItems = (col: BlockerColumn) => {
    let list = visible.filter((b) => b.column === col);
    if (col === 'resuelto') {
      list = list.sort((a, b) => (b.resolvedAt ?? '').localeCompare(a.resolvedAt ?? ''));
      if (!showAllResolved) list = list.filter((b) => new Date(b.resolvedAt ?? b.createdAt).getTime() >= since);
      return list;
    }
    return list.sort((a, b) => {
      const [pa, ta] = sortKey(a);
      const [pb, tb] = sortKey(b);
      return pa - pb || ta - tb;
    });
  };

  const move = (id: string, col: BlockerColumn) => {
    const b = byId(data.blockers, id);
    if (!b || b.column === col) return;
    run(moveBlocker, id, col, session?.id);
    toast(col === 'resuelto' ? 'Bloqueo resuelto' : `Movido a ${BLOCKER_COLUMN_LABEL[col]}`);
  };

  const onDrop = (e: DragEvent, col: BlockerColumn) => {
    e.preventDefault();
    const id = e.dataTransfer.getData('text/plain') || dragId;
    setOver(null);
    setDragId(null);
    if (id) move(id, col);
  };

  const openCount = visible.filter((b) => b.column !== 'resuelto').length;
  const overdueCount = visible.filter((b) => {
    const c = blockerCommitment(data, b);
    return b.column !== 'resuelto' && c && isOverdue(c, now);
  }).length;

  return (
    <div className="page">
      <header className="page-header">
        <div className="titles">
          <div className="eyebrow">¿Qué está atorado?</div>
          <h1>Centro de bloqueos</h1>
          <p>{openCount} {openCount === 1 ? 'abierto' : 'abiertos'}{overdueCount ? ` · ${overdueCount} ${overdueCount === 1 ? 'vencido' : 'vencidos'}` : ''}. Arrastra las tarjetas para cambiar su estado.</p>
        </div>
        <select className="select" value={area} onChange={(e) => setParams('/bloqueos', { area: e.target.value || undefined })}>
          <option value="">Todas las áreas</option>
          {activeAreas(data).map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
        </select>
      </header>

      <div className="kanban">
        {COLUMNS.map((col, ci) => {
          const items = colItems(col.key);
          return (
            <section
              key={col.key}
              className={`kan-col ${over === col.key ? 'drop' : ''}`}
              onDragOver={(e) => { e.preventDefault(); e.dataTransfer.dropEffect = 'move'; if (over !== col.key) setOver(col.key); }}
              onDragLeave={(e) => { if (!e.currentTarget.contains(e.relatedTarget as Node)) setOver(null); }}
              onDrop={(e) => onDrop(e, col.key)}
            >
              <div className="kan-col-header">
                <span className="bar" style={{ background: col.color }} />
                <h3>{BLOCKER_COLUMN_LABEL[col.key]}</h3>
                <span className="n">{items.length}</span>
              </div>
              <div className="kan-list">
                {items.map((b) => (
                  <BlockerCard
                    key={b.id}
                    blocker={b}
                    now={now}
                    dragging={dragId === b.id}
                    onDragStart={(e) => { e.dataTransfer.setData('text/plain', b.id); e.dataTransfer.effectAllowed = 'move'; setDragId(b.id); }}
                    onDragEnd={() => { setDragId(null); setOver(null); }}
                    onPrev={ci > 0 ? () => move(b.id, COLUMNS[ci - 1].key) : undefined}
                    onNext={ci < COLUMNS.length - 1 ? () => move(b.id, COLUMNS[ci + 1].key) : undefined}
                    onOpen={() => actions.blockerDetail(b.id)}
                    onDefine={() => actions.editBlocker(b.id)}
                  />
                ))}
                {items.length === 0 && <div className="empty small">Sin tarjetas</div>}
              </div>
              {col.key === 'resuelto' && (
                <button className="btn btn-ghost btn-sm btn-block" style={{ marginTop: 8 }} onClick={() => setShowAllResolved((v) => !v)}>
                  {showAllResolved ? `Mostrar sólo últimos ${RECENT_DAYS} días` : 'Mostrar todos los resueltos'}
                </button>
              )}
            </section>
          );
        })}
      </div>
    </div>
  );
}

function BlockerCard({ blocker: b, now, dragging, onDragStart, onDragEnd, onPrev, onNext, onOpen, onDefine }: {
  blocker: Blocker; now: Date; dragging: boolean;
  onDragStart: (e: DragEvent) => void; onDragEnd: () => void;
  onPrev?: () => void; onNext?: () => void; onOpen: () => void; onDefine: () => void;
}) {
  const { data } = useStore();
  const p = byId(data.projects, b.projectId)!;
  const c = blockerCommitment(data, b);
  const resolved = b.column === 'resuelto';
  const overdue = !resolved && !!c && isOverdue(c, now);
  const actionable = isBlockerActionable(data, b);
  const owner = personName(data, b.ownerId ?? c?.ownerId);

  return (
    <article
      className={`kan-card ${dragging ? 'dragging' : ''} ${overdue ? 'overdue' : ''}`}
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onClick={onOpen}
      onKeyDown={(e) => { if (e.key === 'Enter') onOpen(); }}
      tabIndex={0}
    >
      <div className="row" style={{ alignItems: 'flex-start' }}>
        <div className="grow">
          <div className="title">{p.name}</div>
          <div className="small" style={{ marginTop: 2 }}><AreaTag area={byId(data.areas, p.areaId)} /></div>
        </div>
        <PriorityBadge priority={effectivePriority(p)} />
      </div>
      <div className="desc">
        {b.kind === 'decision' && <span className="badge st-decision" style={{ marginRight: 6 }}>Decisión</span>}
        {b.description}
      </div>
      <dl className="kan-meta">
        <dt>Gestiona</dt><dd>{owner || <span style={{ color: 'var(--coral-ink)' }}>Sin responsable</span>}</dd>
        <dt>Depende de</dt><dd>{b.dependsOn?.label ?? '—'}</dd>
        <dt>Fecha</dt><dd>{c?.dueDate ? fmtDayShort(c.dueDate) : '—'}</dd>
        <dt>Hora</dt><dd>{c?.dueTime ?? '—'}</dd>
      </dl>
      <div className="kan-foot" onClick={(e) => e.stopPropagation()}>
        {overdue && <span className="badge st-vencido">Vencido</span>}
        {c && c.reschedules.length > 0 && (
          <span className="badge st-reprogramado">Reprogramado {c.reschedules.length} {c.reschedules.length === 1 ? 'vez' : 'veces'}</span>
        )}
        {!resolved && !actionable && (
          <button className="btn btn-xs" onClick={onDefine} title="Este bloqueo todavía no tiene un compromiso accionable.">
            <Icon name="alert" size={13} /> Definir compromiso
          </button>
        )}
        <span className="spacer" />
        {onPrev && <button className="btn btn-ghost btn-xs btn-icon" onClick={onPrev} title="Mover a la columna anterior"><Icon name="chevronLeft" size={14} /></button>}
        {onNext && <button className="btn btn-ghost btn-xs btn-icon" onClick={onNext} title="Mover a la siguiente columna"><Icon name="chevronRight" size={14} /></button>}
      </div>
    </article>
  );
}
