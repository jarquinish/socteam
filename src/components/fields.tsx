import { useId, useMemo, useState, type ReactNode } from 'react';
import { addDays, toISODate } from '../domain/dates';
import { CRITERIA } from '../domain/scoring';
import { activeAreas, activePeople, DEPENDENCY_TYPE_LABEL } from '../domain/selectors';
import type { AppData, DependencyRef, DependencyType, ID, Level } from '../domain/types';

export function Field({ label, hint, error, children, className }: {
  label: ReactNode; hint?: ReactNode; error?: ReactNode; children: ReactNode; className?: string;
}) {
  return (
    <label className={`field ${className ?? ''}`}>
      <span className="field-label">{label}</span>
      {children}
      {error ? <span className="field-error">{error}</span> : hint ? <span className="field-hint">{hint}</span> : null}
    </label>
  );
}

/** Selector de persona agrupado por área. */
export function PersonSelect({ data, value, onChange, placeholder = 'Selecciona responsable', invalid, includeId }: {
  data: AppData; value?: ID; onChange: (id: ID | undefined) => void; placeholder?: string; invalid?: boolean;
  /** Incluye a esta persona aunque esté archivada (para edición). */
  includeId?: ID;
}) {
  const people = activePeople(data);
  const extra = includeId && !people.some((p) => p.id === includeId) ? data.people.find((p) => p.id === includeId) : undefined;
  const areas = activeAreas(data);
  const noArea = people.filter((p) => !areas.some((a) => a.id === p.areaId));
  return (
    <select className={`select ${invalid ? 'invalid' : ''}`} value={value ?? ''} onChange={(e) => onChange(e.target.value || undefined)}>
      <option value="">{placeholder}</option>
      {areas.map((a) => {
        const list = people.filter((p) => p.areaId === a.id);
        if (!list.length) return null;
        return (
          <optgroup key={a.id} label={a.name}>
            {list.map((p) => <option key={p.id} value={p.id}>{p.name}{a.managerId === p.id ? ' · responsable' : ''}</option>)}
          </optgroup>
        );
      })}
      {noArea.length > 0 && (
        <optgroup label="Otros">
          {noArea.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
        </optgroup>
      )}
      {extra && <option value={extra.id}>{extra.name} (archivada)</option>}
    </select>
  );
}

const DIRECCIONES = [
  'Dirección Comercial',
  'Dirección de Tecnología',
  'Dirección de Finanzas',
  'Dirección General',
  'Dirección Jurídica',
  'Dirección de Recursos Humanos',
  'Dirección de Operaciones',
  'Dirección de Posicionamiento',
];

const TYPES: DependencyType[] = ['area', 'persona', 'direccion', 'proveedor', 'tercero'];

/** ¿De quién depende? Tipo + a quién. */
export function DependencyPicker({ data, value, onChange, optional }: {
  data: AppData; value?: DependencyRef; onChange: (v: DependencyRef | undefined) => void; optional?: boolean;
}) {
  const listId = useId();
  const [type, setType] = useState<DependencyType | undefined>(value?.type ?? (optional ? undefined : 'area'));
  const areas = activeAreas(data);
  const people = activePeople(data);

  const suggestions = useMemo(() => {
    const used = new Set<string>();
    for (const x of [...data.blockers, ...data.commitments]) {
      if (x.dependsOn && x.dependsOn.type === type) used.add(x.dependsOn.label);
    }
    if (type === 'direccion') DIRECCIONES.forEach((s) => used.add(s));
    if (type === 'persona') people.forEach((p) => used.add(p.name));
    return [...used].sort((a, b) => a.localeCompare(b, 'es'));
  }, [data, type, people]);

  const pickType = (t: DependencyType | undefined) => {
    setType(t);
    if (!t) return onChange(undefined);
    if (t === value?.type) return;
    onChange(undefined);
  };

  const setText = (label: string) => {
    if (!type) return;
    if (!label.trim()) return onChange(undefined);
    const person = type === 'persona' ? people.find((p) => p.name.toLowerCase() === label.trim().toLowerCase()) : undefined;
    onChange({ type, label, refId: person?.id });
  };

  return (
    <div className="stack" style={{ gap: 8 }}>
      <div className="seg" role="radiogroup">
        {optional && (
          <button type="button" className={!type ? 'on' : ''} onClick={() => pickType(undefined)}>Ninguna</button>
        )}
        {TYPES.map((t) => (
          <button type="button" key={t} className={type === t ? 'on' : ''} onClick={() => pickType(t)}>
            {DEPENDENCY_TYPE_LABEL[t]}
          </button>
        ))}
      </div>
      {type === 'area' && (
        <select
          className="select"
          value={value?.type === 'area' ? value.refId ?? '' : ''}
          onChange={(e) => {
            const a = areas.find((x) => x.id === e.target.value);
            onChange(a ? { type: 'area', refId: a.id, label: a.name } : undefined);
          }}
        >
          <option value="">Selecciona el área</option>
          {areas.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
        </select>
      )}
      {type && type !== 'area' && (
        <>
          <input
            className="input"
            list={listId}
            value={value?.type === type ? value.label : ''}
            placeholder={
              type === 'persona' ? 'Nombre de la persona'
                : type === 'direccion' ? 'Ej. Dirección Comercial'
                  : type === 'proveedor' ? 'Ej. Impresiones Delta' : 'Ej. Agencia, aseguradora, banco'
            }
            onChange={(e) => setText(e.target.value)}
          />
          <datalist id={listId}>
            {suggestions.map((s) => <option key={s} value={s} />)}
          </datalist>
        </>
      )}
    </div>
  );
}

/** Fecha y hora compromiso con atajos para capturar rápido durante la junta. */
export function DueFields({ date, time, onDate, onTime, invalidDate, invalidTime, dateLabel = 'Fecha compromiso', timeLabel = 'Hora compromiso' }: {
  date?: string; time?: string; onDate: (v: string) => void; onTime: (v: string) => void;
  invalidDate?: boolean; invalidTime?: boolean; dateLabel?: string; timeLabel?: string;
}) {
  const now = new Date();
  const friday = addDays(now, (5 - now.getDay() + 7) % 7);
  const dates: [string, string][] = [
    ['Hoy', toISODate(now)],
    ['Mañana', toISODate(addDays(now, 1))],
    ['Viernes', toISODate(friday)],
    ['+1 semana', toISODate(addDays(now, 7))],
  ];
  const times = ['10:00', '13:00', '17:00'];
  return (
    <div className="form-grid">
      <div className="field">
        <span className="field-label">{dateLabel}</span>
        <input type="date" className={`input ${invalidDate ? 'invalid' : ''}`} value={date ?? ''} onChange={(e) => onDate(e.target.value)} />
        <div className="row-wrap" style={{ gap: 4 }}>
          {dates.map(([l, v]) => (
            <button type="button" key={l} className={`btn btn-xs ${date === v ? 'btn-primary' : 'btn-ghost'}`} onClick={() => onDate(v)}>{l}</button>
          ))}
        </div>
      </div>
      <div className="field">
        <span className="field-label">{timeLabel}</span>
        <input type="time" className={`input ${invalidTime ? 'invalid' : ''}`} value={time ?? ''} onChange={(e) => onTime(e.target.value)} />
        <div className="row-wrap" style={{ gap: 4 }}>
          {times.map((t) => (
            <button type="button" key={t} className={`btn btn-xs ${time === t ? 'btn-primary' : 'btn-ghost'}`} onClick={() => onTime(t)}>{t}</button>
          ))}
        </div>
      </div>
    </div>
  );
}

/** Selector 1–3 de un criterio de ponderación, con la descripción de cada nivel. */
export function LevelPicker({ criterion, value, onChange }: {
  criterion: (typeof CRITERIA)[number]; value: Level; onChange: (v: Level) => void;
}) {
  return (
    <div className="field">
      <span className="field-label">{criterion.label}</span>
      <div className="level-pick">
        {([1, 2, 3] as Level[]).map((l) => (
          <button type="button" key={l} className={value === l ? 'on' : ''} onClick={() => onChange(l)}>
            <b>{l}</b>
            <span>{criterion.levels[l]}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
