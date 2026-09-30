/**
 * Acciones globales de la app. Cualquier vista puede abrir formularios
 * (proyecto, bloqueo, compromiso, reprogramar...) sin gestionar modales propios.
 * Los modales se apilan: p. ej. Detalle → Reprogramar → vuelve al detalle.
 */
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { useStore } from '../data/store';
import {
  completeCommitment, deleteCommitment, reopenCommitment, resolveBlocker, moveBlocker,
} from '../domain/operations';
import { fmtDue } from '../domain/dates';
import {
  areaName, blockerCommitment, BLOCKER_COLUMN_LABEL, byId, currentSession, isBlockerActionable, personName,
} from '../domain/selectors';
import type { BlockerKind, ID } from '../domain/types';
import { BlockerForm } from './BlockerForm';
import { CommentForm, CommitmentDetail, CommitmentForm, EscalateForm, RescheduleForm } from './CommitmentForms';
import { Icon } from './Icon';
import { ConfirmModal, Modal } from './Modal';
import { LogList } from './LogList';
import { ProjectForm } from './ProjectForm';
import { useToast } from './Toast';

type ModalSpec =
  | { type: 'project'; projectId?: ID; areaId?: ID }
  | { type: 'blocker'; projectId?: ID; kind?: BlockerKind; blockerId?: ID }
  | { type: 'blockerDetail'; blockerId: ID }
  | { type: 'commitment'; commitmentId?: ID; projectId?: ID }
  | { type: 'commitmentDetail'; commitmentId: ID }
  | { type: 'reschedule'; commitmentId: ID }
  | { type: 'escalate'; commitmentId: ID }
  | { type: 'comment'; commitmentId: ID }
  | { type: 'confirm'; title: string; message: ReactNode; confirmLabel?: string; danger?: boolean; onConfirm: () => void };

export interface Actions {
  newProject(areaId?: ID): void;
  editProject(projectId: ID): void;
  block(projectId: ID, kind?: BlockerKind): void;
  editBlocker(blockerId: ID): void;
  blockerDetail(blockerId: ID): void;
  newCommitment(projectId?: ID): void;
  editCommitment(commitmentId: ID): void;
  commitmentDetail(commitmentId: ID): void;
  reschedule(commitmentId: ID): void;
  escalate(commitmentId: ID): void;
  comment(commitmentId: ID): void;
  complete(commitmentId: ID): void;
  reopen(commitmentId: ID): void;
  confirm(o: { title: string; message: ReactNode; confirmLabel?: string; danger?: boolean; onConfirm: () => void }): void;
}

const ActionsContext = createContext<Actions | null>(null);

export function ActionsProvider({ children }: { children: ReactNode }) {
  const { data, run } = useStore();
  const toast = useToast();
  const [stack, setStack] = useState<ModalSpec[]>([]);
  const push = useCallback((m: ModalSpec) => setStack((s) => [...s, m]), []);
  const pop = useCallback(() => setStack((s) => s.slice(0, -1)), []);

  // Al cambiar de pantalla se cierran los modales abiertos.
  useEffect(() => {
    const clear = () => setStack([]);
    window.addEventListener('hashchange', clear);
    return () => window.removeEventListener('hashchange', clear);
  }, []);

  const sessionId = currentSession(data)?.id;

  const actions = useMemo<Actions>(() => ({
    newProject: (areaId) => push({ type: 'project', areaId }),
    editProject: (projectId) => push({ type: 'project', projectId }),
    block: (projectId, kind = 'bloqueo') => push({ type: 'blocker', projectId, kind }),
    editBlocker: (blockerId) => push({ type: 'blocker', blockerId }),
    blockerDetail: (blockerId) => push({ type: 'blockerDetail', blockerId }),
    newCommitment: (projectId) => push({ type: 'commitment', projectId }),
    editCommitment: (commitmentId) => push({ type: 'commitment', commitmentId }),
    commitmentDetail: (commitmentId) => push({ type: 'commitmentDetail', commitmentId }),
    reschedule: (commitmentId) => push({ type: 'reschedule', commitmentId }),
    escalate: (commitmentId) => push({ type: 'escalate', commitmentId }),
    comment: (commitmentId) => push({ type: 'comment', commitmentId }),
    complete: (commitmentId) => {
      const c = byId(data.commitments, commitmentId);
      run(completeCommitment, commitmentId, sessionId);
      toast(c?.blockerId ? 'Cumplido · bloqueo resuelto' : 'Compromiso cumplido');
    },
    reopen: (commitmentId) => {
      run(reopenCommitment, commitmentId);
      toast('Compromiso reabierto');
    },
    confirm: (o) => push({ type: 'confirm', ...o }),
  }), [push, run, toast, data.commitments, sessionId]);

  const render = (m: ModalSpec, i: number) => {
    const close = pop;
    switch (m.type) {
      case 'project':
        return <ProjectForm key={i} projectId={m.projectId} areaId={m.areaId} onClose={close} />;
      case 'blocker':
        return <BlockerForm key={i} projectId={m.projectId} kind={m.kind} blockerId={m.blockerId} onClose={close} onReschedule={actions.reschedule} />;
      case 'blockerDetail':
        return <BlockerDetail key={i} blockerId={m.blockerId} onClose={close} actions={actions} />;
      case 'commitment':
        return <CommitmentForm key={i} commitmentId={m.commitmentId} projectId={m.projectId} onClose={close} onReschedule={actions.reschedule} />;
      case 'commitmentDetail':
        return (
          <CommitmentDetail
            key={i}
            commitmentId={m.commitmentId}
            onClose={close}
            actions={{
              ...actions,
              edit: actions.editCommitment,
              complete: (id) => { actions.complete(id); close(); },
              remove: (id) => actions.confirm({
                title: 'Eliminar compromiso',
                message: 'Se eliminará el compromiso y su historial. Úsalo sólo si se capturó por error.',
                confirmLabel: 'Eliminar',
                danger: true,
                onConfirm: () => { run(deleteCommitment, id); toast('Compromiso eliminado'); setStack((s) => s.slice(0, -2)); },
              }),
            }}
          />
        );
      case 'reschedule':
        return <RescheduleForm key={i} commitmentId={m.commitmentId} onClose={close} />;
      case 'escalate':
        return <EscalateForm key={i} commitmentId={m.commitmentId} onClose={close} />;
      case 'comment':
        return <CommentForm key={i} commitmentId={m.commitmentId} onClose={close} />;
      case 'confirm':
        return (
          <ConfirmModal
            key={i} title={m.title} message={m.message} confirmLabel={m.confirmLabel} danger={m.danger}
            onConfirm={m.onConfirm} onClose={close}
          />
        );
    }
  };

  // Sólo se muestra el modal superior; los de abajo reaparecen al cerrarlo.
  const top = stack[stack.length - 1];

  return (
    <ActionsContext.Provider value={actions}>
      {children}
      {top && render(top, stack.length)}
    </ActionsContext.Provider>
  );
}

function BlockerDetail({ blockerId, onClose, actions: a }: { blockerId: ID; onClose: () => void; actions: Actions }) {
  const { data, run } = useStore();
  const toast = useToast();
  const sessionId = currentSession(data)?.id;
  const b = byId(data.blockers, blockerId);
  if (!b) return null;
  const project = byId(data.projects, b.projectId);
  const c = blockerCommitment(data, b);
  const resolved = b.column === 'resuelto';
  return (
    <Modal
      title={project?.name ?? 'Bloqueo'}
      subtitle={`${areaName(data, project?.areaId)} · ${BLOCKER_COLUMN_LABEL[b.column]}`}
      size="wide"
      onClose={onClose}
      footer={
        <>
          <button className="btn" onClick={() => a.editBlocker(b.id)}><Icon name="edit" size={15} /> Editar</button>
          {c && !resolved && <button className="btn" onClick={() => a.reschedule(c.id)}><Icon name="reschedule" size={15} /> Reprogramar</button>}
          {c && !resolved && <button className="btn" onClick={() => a.escalate(c.id)}><Icon name="escalate" size={15} /> Escalar</button>}
          {resolved
            ? <button className="btn" onClick={() => { run(moveBlocker, b.id, 'en_gestion', sessionId); toast('Bloqueo reabierto'); }}><Icon name="restore" size={15} /> Reabrir</button>
            : <button className="btn btn-primary" onClick={() => { run(resolveBlocker, b.id, sessionId); toast('Bloqueo resuelto'); onClose(); }}><Icon name="unlock" size={15} /> Resuelto</button>}
        </>
      }
    >
      <div className={`m-issue ${b.kind}`}>
        <div className="m-issue-grid">
          <div><div className="k">{b.kind === 'decision' ? 'Decisión' : 'Bloqueo'}</div><div className="v">{b.description}</div></div>
          <div><div className="k">Qué necesitamos</div><div className="v">{b.need || <span className="faint">—</span>}</div></div>
          <div><div className="k">Depende de</div><div className="v">{b.dependsOn?.label ?? <span className="faint">—</span>}</div></div>
          <div><div className="k">Gestiona</div><div className="v">{personName(data, b.ownerId) || <span className="faint">Sin responsable</span>}</div></div>
        </div>
        {c ? (
          <div className="m-commit">
            <Icon name="target" size={16} />
            <span className="grow"><b>{c.action}</b></span>
            <span className="nowrap"><b>{fmtDue(c.dueDate, c.dueTime)}</b></span>
            {c.reschedules.length > 0 && <span className="badge st-reprogramado">Reprogramado {c.reschedules.length} {c.reschedules.length === 1 ? 'vez' : 'veces'}</span>}
          </div>
        ) : null}
        {!isBlockerActionable(data, b) && !resolved && (
          <div className="warn"><Icon name="alert" size={16} /> Este bloqueo todavía no tiene un compromiso accionable.</div>
        )}
      </div>
      <div>
        <div className="upper muted" style={{ marginBottom: 8 }}>Historial</div>
        <LogList items={b.history} entityId={b.id} />
      </div>
    </Modal>
  );
}

export function useActions(): Actions {
  const a = useContext(ActionsContext);
  if (!a) throw new Error('useActions fuera de ActionsProvider');
  return a;
}
