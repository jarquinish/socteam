import { useRef, useState } from 'react';
import { useActions } from '../components/actions';
import { AreaTag } from '../components/badges';
import { Field, PersonSelect } from '../components/fields';
import { Icon } from '../components/Icon';
import { Modal } from '../components/Modal';
import { useToast } from '../components/Toast';
import { useStore } from '../data/store';
import {
  moveArea, removeArea, removePerson, restoreArea, saveArea, savePerson, saveSettings,
} from '../domain/operations';
import { activeAreas, activeProjects, areaName, byId } from '../domain/selectors';
import type { ID } from '../domain/types';

const PALETTE = ['#006D4E', '#F4614A', '#3BBFDA', '#5DC65E', '#E84E8A', '#7A5AF8', '#F5A524', '#64748B'];

export function Settings() {
  const { data, run, resetDemo, clearAll, importData } = useStore();
  const actions = useActions();
  const toast = useToast();
  const [areaModal, setAreaModal] = useState<{ id?: ID } | null>(null);
  const [personModal, setPersonModal] = useState<{ id?: ID } | null>(null);
  const [name, setName] = useState(data.settings.directionName);
  const [max, setMax] = useState(data.settings.maxProjectsPerArea);
  const [agenda, setAgenda] = useState(data.settings.agenda);
  const fileRef = useRef<HTMLInputElement>(null);

  const areas = [...data.areas].sort((a, b) => a.order - b.order);
  const archivedAreas = areas.filter((a) => a.archived);
  const people = [...data.people].filter((p) => !p.archived).sort((a, b) => a.name.localeCompare(b.name, 'es'));

  const exportJson = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `weekly-alignment-unblock-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  return (
    <div className="page" style={{ maxWidth: 1000 }}>
      <header className="page-header">
        <div className="titles">
          <div className="eyebrow">Configuración</div>
          <h1>Áreas, personas y datos</h1>
          <p>Agrega, edita o elimina áreas y responsables sin tocar código.</p>
        </div>
      </header>

      <section className="card">
        <div className="card-header">
          <h2>Áreas</h2>
          <button className="btn btn-sm btn-primary" onClick={() => setAreaModal({})}><Icon name="plus" size={15} /> Agregar área</button>
        </div>
        <table className="tbl responsive">
          <thead><tr><th>Área</th><th>Responsable</th><th className="num">Proyectos activos</th><th /></tr></thead>
          <tbody>
            {areas.filter((a) => !a.archived).map((a, i, list) => (
              <tr key={a.id}>
                <td data-label="Área"><AreaTag area={a} /></td>
                <td data-label="Responsable">{byId(data.people, a.managerId)?.name ?? <span className="faint">Sin responsable</span>}</td>
                <td data-label="Proyectos" className="num">{activeProjects(data).filter((p) => p.areaId === a.id).length}</td>
                <td>
                  <div className="actions">
                    <button className="btn btn-ghost btn-icon btn-sm" disabled={i === 0} onClick={() => run(moveArea, a.id, -1)} title="Subir"><Icon name="arrowUp" size={15} /></button>
                    <button className="btn btn-ghost btn-icon btn-sm" disabled={i === list.length - 1} onClick={() => run(moveArea, a.id, 1)} title="Bajar"><Icon name="arrowDown" size={15} /></button>
                    <button className="btn btn-ghost btn-icon btn-sm" onClick={() => setAreaModal({ id: a.id })} title="Editar"><Icon name="edit" size={15} /></button>
                    <button
                      className="btn btn-ghost btn-icon btn-sm btn-danger"
                      title="Eliminar"
                      onClick={() => actions.confirm({
                        title: `Eliminar "${a.name}"`,
                        message: data.projects.some((p) => p.areaId === a.id)
                          ? 'El área tiene proyectos, así que se archivará para conservar el historial. Podrás restaurarla después.'
                          : 'El área no tiene proyectos y se eliminará.',
                        confirmLabel: 'Eliminar',
                        danger: true,
                        onConfirm: () => {
                          const r = run(removeArea, a.id);
                          toast(r === 'archived' ? 'Área archivada' : 'Área eliminada');
                        },
                      })}
                    >
                      <Icon name="trash" size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {archivedAreas.length > 0 && (
          <div className="card-pad row-wrap" style={{ borderTop: '1px solid var(--line-2)' }}>
            <span className="muted small">Archivadas:</span>
            {archivedAreas.map((a) => (
              <button key={a.id} className="chip" onClick={() => { run(restoreArea, a.id); toast('Área restaurada'); }}>
                {a.name} <Icon name="restore" size={13} />
              </button>
            ))}
          </div>
        )}
      </section>

      <section className="card">
        <div className="card-header">
          <h2>Personas</h2>
          <button className="btn btn-sm btn-primary" onClick={() => setPersonModal({})}><Icon name="plus" size={15} /> Agregar persona</button>
        </div>
        <table className="tbl responsive">
          <thead><tr><th>Nombre</th><th>Área</th><th>Puesto</th><th>Correo</th><th /></tr></thead>
          <tbody>
            {people.map((p) => (
              <tr key={p.id}>
                <td data-label="Nombre" className="cell-title">{p.name}</td>
                <td data-label="Área">{areaName(data, p.areaId) || <span className="faint">—</span>}</td>
                <td data-label="Puesto" className="muted">{p.role ?? '—'}</td>
                <td data-label="Correo" className="muted small">{p.email ?? '—'}</td>
                <td>
                  <div className="actions">
                    <button className="btn btn-ghost btn-icon btn-sm" onClick={() => setPersonModal({ id: p.id })} title="Editar"><Icon name="edit" size={15} /></button>
                    <button
                      className="btn btn-ghost btn-icon btn-sm btn-danger"
                      title="Eliminar"
                      onClick={() => actions.confirm({
                        title: `Eliminar a ${p.name}`,
                        message: 'Si tiene proyectos o compromisos asignados se archivará para conservar el historial.',
                        confirmLabel: 'Eliminar',
                        danger: true,
                        onConfirm: () => {
                          const r = run(removePerson, p.id);
                          toast(r === 'archived' ? 'Persona archivada' : 'Persona eliminada');
                        },
                      })}
                    >
                      <Icon name="trash" size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {people.length === 0 && <div className="empty">Agrega a los responsables de cada área.</div>}
      </section>

      <section className="card card-pad stack">
        <h2>General</h2>
        <div className="form-grid">
          <Field label="Nombre de la Dirección">
            <input className="input" value={name} onChange={(e) => setName(e.target.value)} />
          </Field>
          <Field label="Máximo recomendado de proyectos por área" hint="No bloquea: sólo muestra una advertencia.">
            <input className="input" type="number" min={1} max={20} value={max} onChange={(e) => setMax(Number(e.target.value))} />
          </Field>
        </div>
        <div className="field">
          <span className="field-label">Agenda de la Weekly (minutos sugeridos por bloque)</span>
          <div className="row-wrap">
            {([['revision', 'Compromisos anteriores'], ['p1', 'P1'], ['p2', 'P2'], ['p3', 'P3']] as const).map(([k, label]) => (
              <label key={k} className="row" style={{ gap: 6 }}>
                <span className="small strong">{label}</span>
                <input className="input" style={{ width: 72 }} type="number" min={0} max={180} value={agenda[k]} onChange={(e) => setAgenda({ ...agenda, [k]: Number(e.target.value) })} />
              </label>
            ))}
            <span className="small muted">Total: {agenda.revision + agenda.p1 + agenda.p2 + agenda.p3} min · 0 = sin límite</span>
          </div>
        </div>
        <div>
          <button className="btn btn-primary" onClick={() => { if (run(saveSettings, { directionName: name, maxProjectsPerArea: max, agenda })) toast('Configuración guardada'); }}>
            Guardar
          </button>
        </div>
      </section>

      <Integrations />

      <section className="card card-pad stack">
        <h2>Datos</h2>
        <p className="muted">
          Esta versión guarda la información en este navegador. Exporta un respaldo para compartirlo o moverlo a otro equipo.
        </p>
        <div className="row-wrap">
          <button className="btn" onClick={exportJson}><Icon name="download" size={15} /> Exportar respaldo</button>
          <button className="btn" onClick={() => fileRef.current?.click()}><Icon name="upload" size={15} /> Importar respaldo</button>
          <input
            ref={fileRef} type="file" accept="application/json,.json" hidden
            onChange={async (e) => {
              const f = e.target.files?.[0];
              e.target.value = '';
              if (!f) return;
              const ok = importData(await f.text());
              toast(ok ? 'Respaldo importado' : 'El archivo no es un respaldo válido', ok ? 'ok' : 'error');
            }}
          />
          <span className="spacer" />
          <button
            className="btn btn-danger"
            onClick={() => actions.confirm({
              title: 'Restablecer datos de prueba',
              message: 'Se reemplazará toda la información actual por los datos de ejemplo.',
              confirmLabel: 'Restablecer', danger: true,
              onConfirm: () => { resetDemo(); toast('Datos de prueba restablecidos'); },
            })}
          >
            Restablecer datos de prueba
          </button>
          <button
            className="btn btn-danger"
            onClick={() => actions.confirm({
              title: 'Empezar desde cero',
              message: 'Se borrarán proyectos, bloqueos, compromisos, personas e historial. Se conservan las cuatro áreas iniciales.',
              confirmLabel: 'Borrar todo', danger: true,
              onConfirm: () => { clearAll(); toast('Datos borrados'); },
            })}
          >
            Empezar desde cero
          </button>
        </div>
      </section>

      {areaModal && <AreaModal id={areaModal.id} onClose={() => setAreaModal(null)} />}
      {personModal && <PersonModal id={personModal.id} onClose={() => setPersonModal(null)} />}
    </div>
  );
}

function AreaModal({ id, onClose }: { id?: ID; onClose: () => void }) {
  const { data, run } = useStore();
  const toast = useToast();
  const a = byId(data.areas, id);
  const [name, setName] = useState(a?.name ?? '');
  const [color, setColor] = useState(a?.color ?? PALETTE[0]);
  const [manager, setManager] = useState<ID | undefined>(a?.managerId);
  const save = () => {
    if (run(saveArea, { id, name, color, managerId: manager })) {
      toast(a ? 'Área actualizada' : 'Área creada');
      onClose();
    }
  };
  return (
    <Modal
      title={a ? 'Editar área' : 'Nueva área'}
      onClose={onClose}
      footer={<><button className="btn" onClick={onClose}>Cancelar</button><button className="btn btn-primary" onClick={save}>Guardar</button></>}
    >
      <Field label="Nombre"><input className="input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Ej. Relaciones Públicas" /></Field>
      <Field label="Responsable del área"><PersonSelect data={data} value={manager} onChange={setManager} /></Field>
      <div className="field">
        <span className="field-label">Color</span>
        <div className="row-wrap">
          {PALETTE.map((c) => (
            <button
              key={c} type="button" onClick={() => setColor(c)} aria-label={c}
              style={{ width: 30, height: 30, borderRadius: 8, background: c, border: color === c ? '3px solid var(--ink)' : '3px solid transparent', cursor: 'pointer' }}
            />
          ))}
        </div>
      </div>
    </Modal>
  );
}

function PersonModal({ id, onClose }: { id?: ID; onClose: () => void }) {
  const { data, run } = useStore();
  const toast = useToast();
  const p = byId(data.people, id);
  const [name, setName] = useState(p?.name ?? '');
  const [area, setArea] = useState<ID | undefined>(p?.areaId);
  const [role, setRole] = useState(p?.role ?? '');
  const [email, setEmail] = useState(p?.email ?? '');
  const save = () => {
    if (run(savePerson, { id, name, areaId: area, role, email })) {
      toast(p ? 'Persona actualizada' : 'Persona agregada');
      onClose();
    }
  };
  return (
    <Modal
      title={p ? 'Editar persona' : 'Nueva persona'}
      onClose={onClose}
      footer={<><button className="btn" onClick={onClose}>Cancelar</button><button className="btn btn-primary" onClick={save}>Guardar</button></>}
    >
      <Field label="Nombre"><input className="input" value={name} onChange={(e) => setName(e.target.value)} /></Field>
      <Field label="Área">
        <select className="select" value={area ?? ''} onChange={(e) => setArea(e.target.value || undefined)}>
          <option value="">Sin área / otra Dirección</option>
          {activeAreas(data).map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
        </select>
      </Field>
      <Field label="Puesto"><input className="input" value={role} onChange={(e) => setRole(e.target.value)} placeholder="Ej. Gerente de Contenido" /></Field>
      <Field label="Correo corporativo" hint="Con inicio de sesión Microsoft, la app reconoce a la persona por este correo.">
        <input className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="nombre@socasesores.com.mx" />
      </Field>
    </Modal>
  );
}

function Integrations() {
  const { server, sync, me } = useStore();
  const toast = useToast();
  const test = async () => {
    try {
      const r = await fetch('/api/teams/test', { method: 'POST' });
      const body = (await r.json().catch(() => ({}))) as { error?: string };
      toast(r.ok ? 'Mensaje de prueba enviado a Teams' : `Teams: ${body.error ?? r.status}`, r.ok ? 'ok' : 'error');
    } catch {
      toast('Sin conexión con el servidor', 'error');
    }
  };
  const rows = [
    {
      on: sync.kind === 'server',
      title: 'Datos compartidos',
      text: sync.kind === 'server'
        ? 'Conectado al servidor: todos ven la misma información en tiempo real.'
        : 'Modo local: los datos viven en este navegador. Para compartirlos, instala el servidor (README → Servidor).',
    },
    {
      on: !!me.locked,
      title: 'Inicio de sesión Microsoft',
      text: me.locked
        ? `Identificado como ${me.email}.`
        : server?.auth === 'easyauth'
          ? `Sesión activa (${me.email ?? 'sin correo'}), pero no coincide con ninguna persona: agrega su correo en Personas.`
          : 'Sin inicio de sesión corporativo: cada quien elige su nombre. Se activa con Azure App Service Authentication (AUTH_MODE=easyauth).',
    },
    {
      on: !!server?.teams,
      title: 'Teams',
      text: server?.teams
        ? `Webhook configurado. ${server.reminders ? 'Recordatorios activos: 24 h antes y al vencer.' : 'Recordatorios desactivados.'}`
        : 'Sin webhook. Configura TEAMS_WEBHOOK_URL en el servidor para publicar resúmenes y recordatorios.',
      action: server?.teams ? <button className="btn btn-sm" onClick={test}><Icon name="send" size={14} /> Enviar prueba</button> : null,
    },
    {
      on: true,
      title: 'Calendario (Outlook)',
      text: server?.calendar
        ? 'Cada compromiso se puede agregar al calendario y cada persona puede suscribirse a su calendario desde Mis compromisos.'
        : 'Cada compromiso y cada lista personal se pueden descargar como evento (.ics).',
    },
  ];
  return (
    <section className="card card-pad">
      <h2 style={{ marginBottom: 6 }}>Integraciones</h2>
      {rows.map((r) => (
        <div className="integration" key={r.title}>
          <span className={`dot ${r.on ? 'on' : ''}`} />
          <div className="grow"><div className="strong">{r.title}</div><div className="small muted">{r.text}</div></div>
          {r.action}
        </div>
      ))}
    </section>
  );
}
