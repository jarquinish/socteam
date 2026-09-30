import { useState } from 'react';
import { useStore } from '../data/store';
import { createBlocker, updateBlocker } from '../domain/operations';
import { fmtDue } from '../domain/dates';
import { areaName, blockerCommitment, byId, currentSession } from '../domain/selectors';
import type { BlockerKind, DependencyRef, ID } from '../domain/types';
import { DependencyPicker, DueFields, PersonSelect } from './fields';
import { Icon } from './Icon';
import { Modal } from './Modal';
import { useToast } from './Toast';

/**
 * Formulario de bloqueo / decisión. Regla fundamental: un bloqueo sólo está
 * gestionado si tiene acción, responsable, fecha y hora.
 */
export function BlockerForm({ projectId, kind: initialKind = 'bloqueo', blockerId, onClose, onReschedule }: {
  projectId?: ID; kind?: BlockerKind; blockerId?: ID; onClose: () => void; onReschedule?: (commitmentId: ID) => void;
}) {
  const { data, run } = useStore();
  const toast = useToast();
  const existing = byId(data.blockers, blockerId);
  const commitment = existing ? blockerCommitment(data, existing) : undefined;
  const project = byId(data.projects, existing?.projectId ?? projectId);
  const session = currentSession(data);

  const [kind, setKind] = useState<BlockerKind>(existing?.kind ?? initialKind);
  const [description, setDescription] = useState(existing?.description ?? '');
  const [need, setNeed] = useState(existing?.need ?? '');
  const [dependsOn, setDependsOn] = useState<DependencyRef | undefined>(existing?.dependsOn);
  const [owner, setOwner] = useState<ID | undefined>(existing?.ownerId ?? commitment?.ownerId);
  const [action, setAction] = useState(commitment?.action ?? '');
  const [dueDate, setDueDate] = useState(commitment?.dueDate ?? '');
  const [dueTime, setDueTime] = useState(commitment?.dueTime ?? '');
  const [tried, setTried] = useState(false);

  if (!project) return null;

  const dateLocked = !!commitment?.dueDate;
  const timeLocked = !!commitment?.dueTime;
  const missing = [
    !action.trim() && 'acción',
    !owner && 'responsable',
    !dueDate && 'fecha',
    !dueTime && 'hora',
  ].filter(Boolean) as string[];
  const actionable = missing.length === 0;
  const isDecision = kind === 'decision';

  const save = (requireCommitment: boolean) => {
    setTried(true);
    if (!description.trim()) return;
    if (requireCommitment && !actionable) return;
    const input = {
      kind, description, need, dependsOn, ownerId: owner, action,
      dueDate: dueDate || undefined, dueTime: dueTime || undefined, sessionId: session?.id,
    };
    const ok = existing
      ? run(updateBlocker, existing.id, input)
      : run(createBlocker, { projectId: project.id, ...input });
    if (ok) {
      toast(actionable ? 'Compromiso creado' : isDecision ? 'Decisión registrada sin compromiso' : 'Bloqueo registrado sin compromiso', actionable ? 'ok' : 'error');
      onClose();
    }
  };

  return (
    <Modal
      title={existing ? (isDecision ? 'Editar decisión pendiente' : 'Editar bloqueo') : isDecision ? 'Requiere decisión' : 'Proyecto bloqueado'}
      subtitle={<><b>{project.name}</b> · {areaName(data, project.areaId)}</>}
      size="wide"
      onClose={onClose}
      footer={
        <>
          <button className="btn" onClick={onClose}>Cancelar</button>
          {!actionable && (
            <button className="btn" onClick={() => save(false)}>Guardar sin compromiso</button>
          )}
          <button className="btn btn-primary" onClick={() => save(true)}>
            <Icon name="check" size={16} />
            {existing && commitment ? 'Guardar cambios' : 'Crear compromiso'}
          </button>
        </>
      }
    >
      <div className="seg">
        <button type="button" className={!isDecision ? 'on' : ''} onClick={() => setKind('bloqueo')}>Bloqueo</button>
        <button type="button" className={isDecision ? 'on' : ''} onClick={() => setKind('decision')}>Requiere decisión</button>
      </div>

      <label className="field">
        <span className="field-q">{isDecision ? '¿Qué decisión se necesita?' : '¿Qué está bloqueando este proyecto?'}</span>
        <textarea
          className={`textarea ${tried && !description.trim() ? 'invalid' : ''}`}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder={isDecision ? 'Ej. Definir si la guía se publica con registro o libre' : 'Ej. Las condiciones comerciales no están validadas'}
          rows={2}
        />
        {tried && !description.trim() && <span className="field-error">Este campo es obligatorio</span>}
      </label>

      <label className="field">
        <span className="field-q">¿Qué necesitamos para avanzar?</span>
        <textarea className="textarea" value={need} onChange={(e) => setNeed(e.target.value)} placeholder="Ej. Validación de tasas y vigencia por parte de Comercial" rows={2} />
      </label>

      <div className="field">
        <span className="field-q">{isDecision ? '¿Quién debe decidir?' : '¿De quién depende?'}</span>
        <DependencyPicker data={data} value={dependsOn} onChange={setDependsOn} />
      </div>

      <label className="field">
        <span className="field-q">¿Quién gestionará el desbloqueo?</span>
        <PersonSelect data={data} value={owner} onChange={setOwner} invalid={tried && !owner} includeId={existing?.ownerId} />
      </label>

      <label className="field">
        <span className="field-q">¿Cuál es el compromiso?</span>
        <input
          className={`input ${tried && !action.trim() ? 'invalid' : ''}`}
          value={action}
          onChange={(e) => setAction(e.target.value)}
          placeholder="Acción concreta. Ej. Validar condiciones comerciales con Comercial"
        />
      </label>

      {dateLocked && timeLocked && commitment ? (
        <div className="m-commit">
          <Icon name="calendar" size={16} />
          <span><b>{fmtDue(commitment.dueDate, commitment.dueTime)}</b></span>
          {commitment.reschedules.length > 0 && <span className="small muted">Reprogramado {commitment.reschedules.length} {commitment.reschedules.length === 1 ? 'vez' : 'veces'}</span>}
          <span className="spacer" />
          {onReschedule && (
            <button type="button" className="btn btn-sm" onClick={() => onReschedule(commitment.id)}>
              <Icon name="reschedule" size={15} /> Reprogramar
            </button>
          )}
        </div>
      ) : (
        <DueFields
          date={dueDate} time={dueTime} onDate={setDueDate} onTime={setDueTime}
          invalidDate={tried && !dueDate} invalidTime={tried && !dueTime}
        />
      )}

      {!actionable && (
        <div className={`warn ${tried ? 'danger' : ''}`}>
          <Icon name="alert" size={16} />
          <span>
            Este bloqueo todavía no tiene un compromiso accionable. Falta: <b>{missing.join(', ')}</b>.
          </span>
        </div>
      )}
    </Modal>
  );
}
