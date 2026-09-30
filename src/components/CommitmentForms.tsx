import { useState } from 'react';
import { useNow, useStore } from '../data/store';
import {
  commentCommitment, createCommitment, escalateCommitment, rescheduleCommitment, updateCommitment,
} from '../domain/operations';
import { fmtDay, fmtDue, fmtStamp } from '../domain/dates';
import {
  activeProjects, areaName, byId, currentSession, displayStatus, personName, sortProjects,
} from '../domain/selectors';
import type { DependencyRef, ID } from '../domain/types';
import { CommitmentBadge } from './badges';
import { DependencyPicker, DueFields, Field, PersonSelect } from './fields';
import { Icon } from './Icon';
import { Modal } from './Modal';
import { useToast } from './Toast';

/* ------------------------------------------------------------------ */

export function CommitmentForm({ commitmentId, projectId, onClose, onReschedule }: {
  commitmentId?: ID; projectId?: ID; onClose: () => void; onReschedule?: (id: ID) => void;
}) {
  const { data, run } = useStore();
  const toast = useToast();
  const existing = byId(data.commitments, commitmentId);
  const session = currentSession(data);
  const projects = sortProjects(activeProjects(data));
  const current = byId(data.projects, existing?.projectId ?? projectId);
  if (current && !projects.includes(current)) projects.unshift(current);

  const [action, setAction] = useState(existing?.action ?? '');
  const [project, setProject] = useState<ID | undefined>(existing?.projectId ?? projectId);
  const [owner, setOwner] = useState<ID | undefined>(existing?.ownerId);
  const [dependsOn, setDependsOn] = useState<DependencyRef | undefined>(existing?.dependsOn);
  const [dueDate, setDueDate] = useState(existing?.dueDate ?? '');
  const [dueTime, setDueTime] = useState(existing?.dueTime ?? '');
  const [tried, setTried] = useState(false);

  const locked = !!existing?.dueDate && !!existing?.dueTime;
  const missing = [!owner && 'responsable', !dueDate && 'fecha', !dueTime && 'hora'].filter(Boolean) as string[];

  const save = () => {
    setTried(true);
    if (!action.trim()) return;
    const input = { action, projectId: project, ownerId: owner, dependsOn, dueDate: dueDate || undefined, dueTime: dueTime || undefined };
    const ok = existing
      ? run(updateCommitment, existing.id, input)
      : run(createCommitment, { ...input, sessionId: session?.id });
    if (ok) {
      toast(existing ? 'Compromiso actualizado' : 'Compromiso creado');
      onClose();
    }
  };

  return (
    <Modal
      title={existing ? 'Editar compromiso' : 'Nuevo compromiso'}
      subtitle="Acción concreta, responsable, fecha y hora."
      size="wide"
      onClose={onClose}
      footer={
        <>
          <button className="btn" onClick={onClose}>Cancelar</button>
          <button className="btn btn-primary" onClick={save}>
            <Icon name="check" size={16} /> {existing ? 'Guardar cambios' : 'Crear compromiso'}
          </button>
        </>
      }
    >
      <Field label="Compromiso" error={tried && !action.trim() ? 'Describe la acción concreta' : undefined}>
        <input className={`input ${tried && !action.trim() ? 'invalid' : ''}`} value={action} onChange={(e) => setAction(e.target.value)} placeholder="Ej. Entregar KV final adaptado a la landing" />
      </Field>
      <div className="form-grid">
        <Field label="Proyecto">
          <select className="select" value={project ?? ''} onChange={(e) => setProject(e.target.value || undefined)}>
            <option value="">Sin proyecto</option>
            {projects.map((p) => <option key={p.id} value={p.id}>{p.name} · {areaName(data, p.areaId)}</option>)}
          </select>
        </Field>
        <Field label="Responsable">
          <PersonSelect data={data} value={owner} onChange={setOwner} includeId={existing?.ownerId} />
        </Field>
      </div>
      <div className="field">
        <span className="field-label">Dependencia</span>
        <DependencyPicker data={data} value={dependsOn} onChange={setDependsOn} optional />
      </div>
      {locked && existing ? (
        <div className="m-commit">
          <Icon name="calendar" size={16} />
          <b>{fmtDue(existing.dueDate, existing.dueTime)}</b>
          {existing.originalDueDate && existing.reschedules.length > 0 && (
            <span className="small muted">Original: {fmtDue(existing.originalDueDate, existing.originalDueTime)}</span>
          )}
          <span className="spacer" />
          {onReschedule && (
            <button type="button" className="btn btn-sm" onClick={() => onReschedule(existing.id)}>
              <Icon name="reschedule" size={15} /> Reprogramar
            </button>
          )}
        </div>
      ) : (
        <DueFields date={dueDate} time={dueTime} onDate={setDueDate} onTime={setDueTime} />
      )}
      {missing.length > 0 && (
        <div className="warn">
          <Icon name="alert" size={16} />
          <span>Sin {missing.join(', ')} el compromiso no es accionable.</span>
        </div>
      )}
    </Modal>
  );
}

/* ------------------------------------------------------------------ */

export function RescheduleForm({ commitmentId, onClose, onSubmit }: {
  commitmentId: ID; onClose: () => void;
  /** Reemplaza la acción por defecto (p. ej. registrar la respuesta en la revisión de la Weekly). */
  onSubmit?: (input: { date: string; time: string; reason: string }) => unknown;
}) {
  const { data, run } = useStore();
  const toast = useToast();
  const c = byId(data.commitments, commitmentId);
  const session = currentSession(data);
  const [date, setDate] = useState('');
  const [time, setTime] = useState(c?.dueTime ?? '');
  const [reason, setReason] = useState('');
  const [tried, setTried] = useState(false);
  if (!c) return null;
  const complete = !!date && !!time && !!reason.trim();

  const save = () => {
    setTried(true);
    if (!complete) return;
    const ok = onSubmit
      ? onSubmit({ date, time, reason })
      : run(rescheduleCommitment, c.id, { date, time, reason, sessionId: session?.id });
    if (ok) {
      toast(`Reprogramado a ${fmtDue(date, time)}`);
      onClose();
    }
  };

  return (
    <Modal
      title="Reprogramar compromiso"
      subtitle={c.action}
      onClose={onClose}
      footer={
        <>
          <button className="btn" onClick={onClose}>Cancelar</button>
          <button className="btn btn-primary" onClick={save}>Reprogramar</button>
        </>
      }
    >
      <div className="row-wrap small">
        <span className="muted">Actual:</span> <b>{fmtDue(c.dueDate, c.dueTime)}</b>
        {c.originalDueDate && (
          <>
            <span className="muted" style={{ marginLeft: 12 }}>Original:</span> <b>{fmtDue(c.originalDueDate, c.originalDueTime)}</b>
          </>
        )}
        {c.reschedules.length > 0 && (
          <span className="badge st-reprogramado" style={{ marginLeft: 12 }}>
            Reprogramado {c.reschedules.length} {c.reschedules.length === 1 ? 'vez' : 'veces'}
          </span>
        )}
      </div>
      <DueFields
        date={date} time={time} onDate={setDate} onTime={setTime}
        dateLabel="Nueva fecha" timeLabel="Nueva hora"
        invalidDate={tried && !date} invalidTime={tried && !time}
      />
      <Field label="Motivo" error={tried && !reason.trim() ? 'El motivo es obligatorio' : undefined}>
        <input className={`input ${tried && !reason.trim() ? 'invalid' : ''}`} value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Motivo breve. Ej. Proveedor movió la entrega" />
      </Field>
    </Modal>
  );
}

/* ------------------------------------------------------------------ */

const ESCALATION_TARGETS = ['Dirección de Posicionamiento', 'Dirección General', 'Dirección Comercial', 'Dirección de Tecnología', 'Dirección de Finanzas'];

export function EscalateForm({ commitmentId, onClose, onSubmit }: {
  commitmentId: ID; onClose: () => void; onSubmit?: (input: { to: string; note?: string }) => unknown;
}) {
  const { data, run } = useStore();
  const toast = useToast();
  const c = byId(data.commitments, commitmentId);
  const [to, setTo] = useState('Dirección de Posicionamiento');
  const [note, setNote] = useState('');
  if (!c) return null;
  const save = () => {
    const ok = onSubmit ? onSubmit({ to, note }) : run(escalateCommitment, c.id, { to, note });
    if (ok) {
      toast(`Escalado a ${to || 'Dirección'}`);
      onClose();
    }
  };
  return (
    <Modal
      title="Escalar compromiso"
      subtitle={c.action}
      onClose={onClose}
      footer={
        <>
          <button className="btn" onClick={onClose}>Cancelar</button>
          <button className="btn btn-primary" onClick={save}><Icon name="escalate" size={16} /> Escalar</button>
        </>
      }
    >
      <Field label="¿A quién se escala?">
        <input className="input" list="escalation-targets" value={to} onChange={(e) => setTo(e.target.value)} />
        <datalist id="escalation-targets">{ESCALATION_TARGETS.map((t) => <option key={t} value={t} />)}</datalist>
      </Field>
      <Field label="¿Qué se necesita de esa instancia?">
        <textarea className="textarea" value={note} onChange={(e) => setNote(e.target.value)} placeholder="Ej. Decisión sobre proveedor alterno" rows={2} />
      </Field>
    </Modal>
  );
}

/* ------------------------------------------------------------------ */

export function CommentForm({ commitmentId, onClose }: { commitmentId: ID; onClose: () => void }) {
  const { data, run } = useStore();
  const toast = useToast();
  const c = byId(data.commitments, commitmentId);
  const [text, setText] = useState('');
  if (!c) return null;
  const save = () => {
    if (run(commentCommitment, c.id, text)) {
      toast('Comentario agregado');
      onClose();
    }
  };
  return (
    <Modal
      title="Comentario"
      subtitle={c.action}
      onClose={onClose}
      footer={
        <>
          <button className="btn" onClick={onClose}>Cancelar</button>
          <button className="btn btn-primary" onClick={save} disabled={!text.trim()}>Agregar</button>
        </>
      }
    >
      <textarea className="textarea" rows={3} value={text} onChange={(e) => setText(e.target.value)} placeholder="Avance, contexto o acuerdo" />
      {c.comments.length > 0 && (
        <div className="log">
          {[...c.comments].reverse().map((x, i) => (
            <div className="log-item" key={i}><time>{fmtStamp(x.at)}</time><span>{x.text}</span></div>
          ))}
        </div>
      )}
    </Modal>
  );
}

/* ------------------------------------------------------------------ */

/** Detalle de compromiso con historial básico. */
export function CommitmentDetail({ commitmentId, onClose, actions }: {
  commitmentId: ID; onClose: () => void;
  actions: { edit: (id: ID) => void; reschedule: (id: ID) => void; escalate: (id: ID) => void; comment: (id: ID) => void; complete: (id: ID) => void; reopen: (id: ID) => void; remove: (id: ID) => void };
}) {
  const { data } = useStore();
  const now = useNow();
  const c = byId(data.commitments, commitmentId);
  if (!c) return null;
  const project = byId(data.projects, c.projectId);
  const status = displayStatus(c, now);
  const done = c.status === 'cumplido';

  const log = [
    { at: c.createdAt, text: `Creado · ${fmtDue(c.originalDueDate, c.originalDueTime)}` },
    ...c.reschedules.map((r) => ({ at: r.at, text: `Reprogramado de ${fmtDue(r.fromDate, r.fromTime)} a ${fmtDue(r.toDate, r.toTime)} — ${r.reason}` })),
    ...c.comments.map((x) => ({ at: x.at, text: x.text })),
    ...(c.completedAt ? [{ at: c.completedAt, text: 'Cumplido' }] : []),
  ].sort((a, b) => a.at.localeCompare(b.at));

  return (
    <Modal
      title={c.action}
      subtitle={project ? `${project.name} · ${areaName(data, project.areaId)}` : 'Sin proyecto'}
      size="wide"
      onClose={onClose}
      footer={
        <>
          <button className="btn btn-ghost btn-danger" style={{ marginRight: 'auto' }} onClick={() => actions.remove(c.id)}>
            <Icon name="trash" size={15} /> Eliminar
          </button>
          <button className="btn" onClick={() => actions.edit(c.id)}><Icon name="edit" size={15} /> Editar</button>
          {!done && <button className="btn" onClick={() => actions.reschedule(c.id)}><Icon name="reschedule" size={15} /> Reprogramar</button>}
          {!done && <button className="btn" onClick={() => actions.escalate(c.id)}><Icon name="escalate" size={15} /> Escalar</button>}
          <button className="btn" onClick={() => actions.comment(c.id)}><Icon name="message" size={15} /> Comentario</button>
          {done
            ? <button className="btn" onClick={() => actions.reopen(c.id)}><Icon name="restore" size={15} /> Reabrir</button>
            : <button className="btn btn-primary" onClick={() => actions.complete(c.id)}><Icon name="check" size={15} /> Cumplido</button>}
        </>
      }
    >
      <div className="m-issue-grid">
        <div><div className="k">Responsable</div><div className="v">{personName(data, c.ownerId) || <span className="faint">Sin responsable</span>}</div></div>
        <div><div className="k">Dependencia</div><div className="v">{c.dependsOn?.label ?? <span className="faint">—</span>}</div></div>
        <div><div className="k">Fecha y hora</div><div className="v">{fmtDue(c.dueDate, c.dueTime)}</div></div>
        <div><div className="k">Estado</div><div className="v"><CommitmentBadge status={status} /></div></div>
        {c.reschedules.length > 0 && (
          <div><div className="k">Fecha original</div><div className="v">{c.originalDueDate ? fmtDay(c.originalDueDate) : '—'} {c.originalDueTime}</div></div>
        )}
        {c.reschedules.length > 0 && (
          <div><div className="k">Reprogramaciones</div><div className="v">{c.reschedules.length}</div></div>
        )}
      </div>
      <div>
        <div className="upper muted" style={{ marginBottom: 8 }}>Historial</div>
        <div className="log">
          {log.map((x, i) => <div className="log-item" key={i}><time>{fmtStamp(x.at)}</time><span>{x.text}</span></div>)}
        </div>
      </div>
    </Modal>
  );
}
