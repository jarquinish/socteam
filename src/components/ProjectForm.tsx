import { useState } from 'react';
import { useStore } from '../data/store';
import { saveProject, setProjectArchived } from '../domain/operations';
import { autoPriority, computeScore, CRITERIA } from '../domain/scoring';
import { activeAreas, activeProjects, byId } from '../domain/selectors';
import type { ID, Level, Priority } from '../domain/types';
import { PriorityBadge } from './badges';
import { Field, LevelPicker, PersonSelect } from './fields';
import { Icon } from './Icon';
import { Modal } from './Modal';
import { useToast } from './Toast';

export function ProjectForm({ projectId, areaId, onClose }: { projectId?: ID; areaId?: ID; onClose: () => void }) {
  const { data, run } = useStore();
  const toast = useToast();
  const existing = byId(data.projects, projectId);
  const areas = activeAreas(data);

  const [name, setName] = useState(existing?.name ?? '');
  const [area, setArea] = useState<ID | undefined>(existing?.areaId ?? areaId ?? areas[0]?.id);
  const [owner, setOwner] = useState<ID | undefined>(existing?.ownerId);
  const [impact, setImpact] = useState<Level>(existing?.impact ?? 2);
  const [urgency, setUrgency] = useState<Level>(existing?.urgency ?? 2);
  const [dependency, setDependency] = useState<Level>(existing?.dependency ?? 1);
  const [target, setTarget] = useState(existing?.targetDate ?? '');
  const [manual, setManual] = useState<Priority | null>(existing?.override?.priority ?? null);
  const [reason, setReason] = useState(existing?.override?.reason ?? '');
  const [touched, setTouched] = useState(false);

  const levels = { impact, urgency, dependency };
  const score = computeScore(levels);
  const auto = autoPriority(levels);
  const effective = manual ?? auto;
  const inArea = activeProjects(data).filter((p) => p.areaId === area && p.id !== projectId).length;
  const overLimit = !existing && inArea >= data.settings.maxProjectsPerArea;
  const setters = { impact: setImpact, urgency: setUrgency, dependency: setDependency };

  const submit = () => {
    setTouched(true);
    if (!name.trim() || !area) return;
    const id = run(saveProject, {
      id: projectId, name, areaId: area, ownerId: owner, impact, urgency, dependency,
      targetDate: target || undefined, manualPriority: manual, overrideReason: reason,
    });
    if (id) {
      toast(existing ? 'Proyecto actualizado' : 'Proyecto creado');
      onClose();
    }
  };

  return (
    <Modal
      title={existing ? 'Editar proyecto' : 'Nuevo proyecto'}
      subtitle="Impacto + Urgencia + Dependencia definen la prioridad."
      size="wide"
      onClose={onClose}
      footer={
        <>
          {existing && (
            <button
              className="btn btn-ghost"
              style={{ marginRight: 'auto' }}
              onClick={() => {
                run(setProjectArchived, existing.id, !existing.archived);
                toast(existing.archived ? 'Proyecto restaurado' : 'Proyecto archivado');
                onClose();
              }}
            >
              <Icon name={existing.archived ? 'restore' : 'archive'} size={16} />
              {existing.archived ? 'Restaurar' : 'Archivar'}
            </button>
          )}
          <button className="btn" onClick={onClose}>Cancelar</button>
          <button className="btn btn-primary" onClick={submit}>{existing ? 'Guardar cambios' : 'Crear proyecto'}</button>
        </>
      }
    >
      <div className="form-grid">
        <Field label="Proyecto" className="span-2" error={touched && !name.trim() ? 'Escribe el nombre del proyecto' : undefined}>
          <input className={`input ${touched && !name.trim() ? 'invalid' : ''}`} value={name} onChange={(e) => setName(e.target.value)} placeholder="Ej. Campaña Convención" />
        </Field>
        <Field label="Área">
          <select className="select" value={area ?? ''} onChange={(e) => setArea(e.target.value || undefined)}>
            {areas.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
          </select>
        </Field>
        <Field label="Responsable">
          <PersonSelect data={data} value={owner} onChange={setOwner} includeId={existing?.ownerId} />
        </Field>
        <Field label="Fecha objetivo">
          <input type="date" className="input" value={target} onChange={(e) => setTarget(e.target.value)} />
        </Field>
      </div>

      {overLimit && (
        <div className="warn">
          <Icon name="alert" size={16} />
          <span>
            Esta área ya tiene {inArea} proyectos activos. Esta sesión está diseñada para enfocarse en los proyectos más relevantes.
          </span>
        </div>
      )}

      {CRITERIA.map((c) => (
        <LevelPicker key={c.key} criterion={c} value={levels[c.key]} onChange={setters[c.key]} />
      ))}

      <div className="score-preview">
        <div>
          <div className="upper muted">Score</div>
          <div className="big">{score}</div>
        </div>
        <div className="grow">
          <div className="row">
            <span className="muted">Prioridad calculada</span>
            <PriorityBadge priority={auto} />
            {manual && manual !== auto && (
              <>
                <Icon name="arrowRight" size={14} className="muted" />
                <PriorityBadge priority={effective} />
                <span className="manual-flag"><Icon name="flag" size={12} /> Ajuste manual</span>
              </>
            )}
          </div>
          <div className="small muted" style={{ marginTop: 4 }}>8–9 = P1 · 6–7 = P2 · 3–5 = P3</div>
        </div>
      </div>

      <div className="field">
        <span className="field-label">Ajuste de Dirección</span>
        <div className="row-wrap">
          <div className="seg">
            <button type="button" className={!manual ? 'on' : ''} onClick={() => setManual(null)}>Automática</button>
            {(['P1', 'P2', 'P3'] as Priority[]).map((p) => (
              <button type="button" key={p} className={manual === p ? 'on' : ''} onClick={() => setManual(p === auto ? null : p)}>{p}</button>
            ))}
          </div>
          {manual && manual !== auto && (
            <input className="input grow" value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Motivo del ajuste (opcional)" />
          )}
        </div>
        <span className="field-hint">Si Dirección cambia la prioridad, queda registrado como ajuste manual.</span>
      </div>
    </Modal>
  );
}
