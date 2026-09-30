/**
 * Datos de prueba realistas para la Dirección de Posicionamiento.
 * Las fechas se calculan relativas a la semana actual para que la demo siempre
 * tenga compromisos próximos, uno vencido y uno reprogramado.
 */
import { addDays, toISODate, weekStart } from '../domain/dates';
import { buildSnapshot } from '../domain/summary';
import type {
  AppData, Area, Blocker, BlockerColumn, BlockerKind, Commitment, CommitmentStatus, DependencyRef,
  Level, Person, Priority, Project, ProjectStatus, Session,
} from '../domain/types';

export const DEFAULT_AREAS: { name: string; color: string }[] = [
  { name: 'Contenido', color: '#F4614A' },
  { name: 'Diseño', color: '#E84E8A' },
  { name: 'Marketing Digital', color: '#3BBFDA' },
  { name: 'SOC Store', color: '#5DC65E' },
];

export function emptyData(): AppData {
  return {
    version: 1,
    settings: { directionName: 'Dirección de Posicionamiento', maxProjectsPerArea: 5 },
    areas: DEFAULT_AREAS.map((a, i) => ({ id: `area-${i + 1}`, ...a, order: i + 1 })),
    people: [],
    projects: [],
    blockers: [],
    commitments: [],
    sessions: [],
    events: [],
  };
}

export function createSeed(now: Date): AppData {
  const d = emptyData();
  let seq = 0;
  const id = (p: string) => `${p}-${(++seq).toString(36)}`;

  const monday = weekStart(now);
  /** Fecha local relativa al lunes de esta semana. */
  const day = (offset: number) => toISODate(addDays(monday, offset));
  /** Timestamp ISO relativo al lunes de esta semana. */
  const at = (offset: number, time: string) => {
    const [h, m] = time.split(':').map(Number);
    const x = addDays(monday, offset);
    x.setHours(h, m, 0, 0);
    return x.toISOString();
  };

  /* ---------------- Áreas y personas ---------------- */
  const [contenido, diseno, marketing, store] = d.areas as [Area, Area, Area, Area];

  const person = (name: string, area: Area, role: string, manager = false): Person => {
    const p: Person = { id: id('per'), name, areaId: area.id, role };
    d.people.push(p);
    if (manager) area.managerId = p.id;
    return p;
  };
  const diana = person('Diana Morales', contenido, 'Gerente de Contenido', true);
  const andres = person('Andrés Beltrán', contenido, 'Editor de contenido');
  const carolina = person('Carolina Ruiz', diseno, 'Gerente de Diseño', true);
  const mateo = person('Mateo Salinas', diseno, 'Diseñador senior');
  const ricardo = person('Ricardo Vega', marketing, 'Gerente de Marketing Digital', true);
  const fernanda = person('Fernanda Ibarra', marketing, 'Especialista en performance');
  const luis = person('Luis Hernández', store, 'Gerente de SOC Store', true);
  const paola = person('Paola Castro', store, 'Coordinadora de e-commerce');

  /* ---------------- Sesiones anteriores ---------------- */
  const s2: Session = {
    id: id('ses'), weekStart: day(-14), date: day(-12), startedAt: at(-12, '10:00'), closedAt: at(-12, '11:05'),
    status: 'cerrada', phase: 'proyectos', carriedCommitmentIds: [], completedSinceLastIds: [],
    openBlockerIdsAtStart: [], reviews: [], reviewedProjectIds: [],
  };
  const s1: Session = {
    id: id('ses'), weekStart: day(-7), date: day(-5), startedAt: at(-5, '10:00'), closedAt: at(-5, '11:15'),
    status: 'cerrada', phase: 'proyectos', previousSessionId: s2.id, carriedCommitmentIds: [],
    completedSinceLastIds: [], openBlockerIdsAtStart: [], reviews: [], reviewedProjectIds: [],
  };
  d.sessions.push(s2, s1);

  /* ---------------- Proyectos ---------------- */
  const project = (
    name: string, area: Area, owner: Person, [impact, urgency, dependency]: [Level, Level, Level],
    status: ProjectStatus, targetOffset: number, override?: { priority: Priority; auto: Priority; reason: string },
  ): Project => {
    const p: Project = {
      id: id('prj'), name, areaId: area.id, ownerId: owner.id, impact, urgency, dependency,
      status, targetDate: day(targetOffset), archived: false,
      overrideLog: [], createdAt: at(-19, '09:00'), updatedAt: at(-1, '09:00'),
    };
    if (override) {
      p.override = { priority: override.priority, autoPriority: override.auto, reason: override.reason, at: at(-5, '10:40') };
      p.overrideLog.push(p.override);
    }
    d.projects.push(p);
    return p;
  };

  // Contenido
  const convencion = project('Campaña Convención', contenido, diana, [3, 3, 3], 'bloqueado', 16);
  const socTv = project('Guiones SOC TV · temporada otoño', contenido, andres, [2, 2, 2], 'avanza', 23);
  project('Newsletter mensual para la Red de Asesores', contenido, andres, [2, 2, 1], 'avanza', 9);
  const ebook = project('Guía "Tu primer crédito hipotecario"', contenido, diana, [3, 2, 2], 'decision', 30);

  // Diseño
  const senaletica = project('Señalética de marca para oficinas SOC', diseno, carolina, [3, 2, 3], 'bloqueado', 25);
  const kvHipotecario = project('KV Campaña Crédito Hipotecario Q4', diseno, carolina, [3, 3, 2], 'avanza', 4);
  project('Plantillas de redes para oficinas', diseno, mateo, [2, 1, 1], 'avanza', 32);
  const kitComercial = project('Kit de presentación comercial', diseno, mateo, [2, 2, 2], 'bloqueado', 11);
  const materialConv = project('Material para Convención (stands y pantallas)', diseno, carolina, [3, 3, 2], 'avanza', 14);

  // Marketing Digital
  const landing = project('Landing Hipotecaria', marketing, ricardo, [3, 3, 2], 'bloqueado', 7);
  project('Campañas de performance Meta y Google Q4', marketing, fernanda, [3, 2, 1], 'avanza', 18);
  const leads = project('Integración SOC Leads+ con CRM', marketing, fernanda, [3, 2, 3], 'bloqueado', 21);
  project('Reporte mensual de KPIs digitales', marketing, ricardo, [1, 2, 1], 'avanza', 5);

  // SOC Store
  const store2 = project('SOC Store 2.0 · pagos con tarjeta corporativa', store, luis, [3, 2, 2], 'bloqueado', 28);
  const kits = project('Kits de bienvenida para nuevos asesores', store, paola, [2, 2, 2], 'avanza', 12);
  project('Inventario y reabasto de promocionales', store, paola, [1, 1, 2], 'avanza', 20,
    { priority: 'P2', auto: 'P3', reason: 'Temporada de altas de nuevos asesores' });
  const pedidoConv = project('Pedido especial de artículos para Convención', store, luis, [2, 3, 2], 'avanza', 13);

  /* ---------------- Dependencias ---------------- */
  const areaDep = (a: Area): DependencyRef => ({ type: 'area', refId: a.id, label: a.name });
  const direccion = (label: string): DependencyRef => ({ type: 'direccion', label });
  const proveedor = (label: string): DependencyRef => ({ type: 'proveedor', label });

  /* ---------------- Compromisos ---------------- */
  const commitment = (o: {
    action: string; project: Project; owner?: Person; dependsOn?: DependencyRef;
    due?: [number, string]; status?: CommitmentStatus; session?: Session; createdAt: string;
  }): Commitment => {
    const c: Commitment = {
      id: id('cmp'), action: o.action, projectId: o.project.id, ownerId: o.owner?.id, dependsOn: o.dependsOn,
      dueDate: o.due ? day(o.due[0]) : undefined, dueTime: o.due?.[1],
      originalDueDate: o.due ? day(o.due[0]) : undefined, originalDueTime: o.due?.[1],
      status: o.status ?? 'pendiente', reschedules: [], escalations: [], comments: [],
      createdAt: o.createdAt, createdSessionId: o.session?.id, missedCount: 0,
    };
    d.commitments.push(c);
    return c;
  };

  const blocker = (o: {
    project: Project; kind?: BlockerKind; description: string; need: string; dependsOn?: DependencyRef;
    owner?: Person; column: BlockerColumn; commitment?: Commitment; session?: Session; createdAt: string;
  }): Blocker => {
    const b: Blocker = {
      id: id('blq'), projectId: o.project.id, kind: o.kind ?? 'bloqueo', description: o.description, need: o.need,
      dependsOn: o.dependsOn, ownerId: o.owner?.id, column: o.column, commitmentId: o.commitment?.id,
      createdAt: o.createdAt, createdSessionId: o.session?.id,
      history: [{ at: o.createdAt, text: o.kind === 'decision' ? 'Decisión pendiente registrada' : 'Bloqueo registrado' }],
    };
    if (o.commitment) {
      o.commitment.blockerId = b.id;
      b.history.push({ at: o.createdAt, text: `Compromiso creado: ${o.commitment.action}` });
    }
    if (o.column === 'en_gestion') b.history.push({ at: o.createdAt, text: 'Movido a En gestión' });
    d.blockers.push(b);
    return b;
  };

  // --- Weekly de hace dos semanas ---
  const cGuion = commitment({
    action: 'Aprobar guion del episodio piloto con Dirección', project: socTv, owner: diana,
    due: [-10, '12:00'], session: s2, createdAt: at(-12, '10:35'), status: 'cumplido',
  });
  const bGuion = blocker({
    project: socTv, description: 'El guion del episodio piloto no tiene aprobación', need: 'Visto bueno de Dirección al guion',
    dependsOn: direccion('Dirección de Posicionamiento'), owner: diana, column: 'resuelto', commitment: cGuion,
    session: s2, createdAt: at(-12, '10:30'),
  });
  cGuion.reschedules.push({
    at: at(-5, '10:20'), fromDate: day(-10), fromTime: '12:00', toDate: day(-3), toTime: '12:00',
    reason: 'Dirección pidió incluir testimonios de asesores', sessionId: s1.id,
  });
  cGuion.dueDate = day(-3);
  cGuion.completedAt = at(-3, '11:40');
  bGuion.column = 'resuelto';
  bGuion.resolvedAt = at(-3, '11:40');
  bGuion.history.push(
    { at: at(-5, '10:20'), text: 'Reprogramado — Dirección pidió incluir testimonios de asesores' },
    { at: at(-3, '11:40'), text: 'Bloqueo resuelto' },
  );

  // --- Weekly de la semana pasada ---
  const cBriefMeta = commitment({
    action: 'Enviar brief del KV Q4 a la agencia de medios', project: kvHipotecario, owner: fernanda,
    dependsOn: areaDep(marketing), due: [-4, '17:00'], session: s1, createdAt: at(-5, '10:48'), status: 'cumplido',
  });
  cBriefMeta.completedAt = at(-4, '16:10');

  const cConv = commitment({
    action: 'Validar condiciones comerciales de la promoción', project: convencion, owner: diana,
    dependsOn: direccion('Dirección Comercial'), due: [4, '13:00'], session: s1, createdAt: at(-5, '10:15'),
    status: 'en_gestion',
  });
  blocker({
    project: convencion, description: 'Las condiciones comerciales de la promoción no están validadas',
    need: 'Validación de tasas, vigencia y mecánica por parte de Comercial',
    dependsOn: direccion('Dirección Comercial'), owner: diana, column: 'en_gestion', commitment: cConv,
    session: s1, createdAt: at(-5, '10:12'),
  });

  // Vencido
  const cSenal = commitment({
    action: 'Conseguir cotización y muestras de material; si no llegan, activar proveedor alterno',
    project: senaletica, owner: carolina, dependsOn: proveedor('Impresiones Delta (proveedor)'),
    due: [-3, '17:00'], session: s1, createdAt: at(-5, '10:25'), status: 'en_gestion',
  });
  blocker({
    project: senaletica, description: 'El proveedor de impresión no ha entregado cotización ni pruebas de material',
    need: 'Cotización formal y muestras de material', dependsOn: proveedor('Impresiones Delta (proveedor)'),
    owner: carolina, column: 'en_gestion', commitment: cSenal, session: s1, createdAt: at(-5, '10:22'),
  });

  // Reprogramado
  const cKv = commitment({
    action: 'Entregar KV final adaptado a la landing', project: landing, owner: carolina,
    dependsOn: areaDep(diseno), due: [-3, '12:00'], session: s1, createdAt: at(-5, '10:35'),
  });
  const bLanding = blocker({
    project: landing, description: 'No está listo el KV final para montar la landing', need: 'KV final',
    dependsOn: areaDep(diseno), owner: carolina, column: 'en_gestion', commitment: cKv,
    session: s1, createdAt: at(-5, '10:32'),
  });
  cKv.reschedules.push({
    at: at(-3, '09:30'), fromDate: day(-3), fromTime: '12:00', toDate: day(3), toTime: '11:00',
    reason: 'Cambio de copy aprobado por Dirección el viernes',
  });
  cKv.dueDate = day(3);
  cKv.dueTime = '11:00';
  cKv.status = 'reprogramado';
  bLanding.history.push({ at: at(-3, '09:30'), text: 'Reprogramado — Cambio de copy aprobado por Dirección el viernes' });

  const cKit = commitment({
    action: 'Entregar textos finales de productos y tasas para el kit', project: kitComercial, owner: andres,
    dependsOn: areaDep(contenido), due: [3, '16:00'], session: s1, createdAt: at(-5, '10:45'),
  });
  blocker({
    project: kitComercial, description: 'Falta contenido actualizado de productos y tasas',
    need: 'Textos finales aprobados por Contenido', dependsOn: areaDep(contenido), owner: andres,
    column: 'por_destrabar', commitment: cKit, session: s1, createdAt: at(-5, '10:42'),
  });

  const cStore = commitment({
    action: 'Obtener aprobación de Finanzas del esquema de cobro con tarjeta corporativa', project: store2,
    owner: luis, dependsOn: direccion('Dirección de Finanzas'), due: [4, '17:00'], session: s1,
    createdAt: at(-5, '10:55'), status: 'en_gestion',
  });
  blocker({
    project: store2, description: 'Finanzas no ha aprobado el esquema de pagos con tarjeta corporativa',
    need: 'Aprobación del esquema de cobro y conciliación', dependsOn: direccion('Dirección de Finanzas'),
    owner: luis, column: 'en_gestion', commitment: cStore, session: s1, createdAt: at(-5, '10:52'),
  });

  commitment({
    action: 'Enviar dummies de stand y pantallas a Dirección para aprobación', project: materialConv,
    owner: mateo, dependsOn: direccion('Dirección de Posicionamiento'), due: [3, '12:00'], session: s1,
    createdAt: at(-5, '10:38'),
  });
  commitment({
    action: 'Confirmar fecha de entrega de artículos promocionales', project: pedidoConv, owner: paola,
    dependsOn: proveedor('Promocionales del Bajío (proveedor)'), due: [3, '13:00'], session: s1,
    createdAt: at(-5, '11:00'),
  });
  commitment({
    action: 'Programar sesión de fotografía de producto para los kits', project: kits, owner: paola,
    dependsOn: areaDep(diseno), due: [4, '12:00'], session: s1, createdAt: at(-5, '11:05'),
  });

  // --- Registrados esta semana, antes de la Weekly (sin compromiso accionable todavía) ---
  blocker({
    project: leads, description: 'Tecnología no ha liberado el acceso a la API del CRM',
    need: 'Credenciales de API y ambiente de pruebas', dependsOn: direccion('Dirección de Tecnología'),
    column: 'por_destrabar', createdAt: at(1, '09:15'),
  });
  blocker({
    project: ebook, kind: 'decision',
    description: 'Definir si la guía se publica con registro (lead magnet) o de descarga libre',
    need: 'Decisión de Dirección con estimación de leads de ambas opciones',
    dependsOn: direccion('Dirección de Posicionamiento'), owner: diana, column: 'por_destrabar',
    createdAt: at(1, '12:30'),
  });

  /* ---------------- Snapshots del historial ---------------- */
  s2.reviewedProjectIds = d.projects.slice(0, 12).map((p) => p.id);
  s1.reviewedProjectIds = d.projects.slice(0, 15).map((p) => p.id);
  s1.carriedCommitmentIds = [cGuion.id];
  s1.reviews = [{ commitmentId: cGuion.id, result: 'reprogramar', at: at(-5, '10:20') }];
  s1.openBlockerIdsAtStart = [bGuion.id];
  s2.snapshot = snapshotAsOf(d, s2);
  s1.snapshot = snapshotAsOf(d, s1);

  return d;
}

/**
 * Reconstruye cómo se veían los datos al cierre de una sesión pasada
 * (quita lo creado después y deshace cambios posteriores) para generar su resumen.
 */
function snapshotAsOf(d: AppData, s: Session) {
  const when = s.closedAt!;
  const past: AppData = structuredClone(d);
  past.blockers = past.blockers.filter((b) => b.createdAt <= when);
  past.commitments = past.commitments.filter((c) => c.createdAt <= when);
  for (const c of past.commitments) {
    const later = c.reschedules.filter((r) => r.at > when);
    if (later.length) {
      c.dueDate = later[0].fromDate;
      c.dueTime = later[0].fromTime;
      c.reschedules = c.reschedules.filter((r) => r.at <= when);
      c.status = c.reschedules.length ? 'reprogramado' : 'pendiente';
    }
    if (c.completedAt && c.completedAt > when) {
      c.status = c.reschedules.length ? 'reprogramado' : 'pendiente';
      c.completedAt = undefined;
    }
  }
  for (const b of past.blockers) {
    if (b.resolvedAt && b.resolvedAt > when) {
      b.column = 'en_gestion';
      b.resolvedAt = undefined;
    }
  }
  const openProjects = new Set(past.blockers.filter((b) => b.column !== 'resuelto').map((b) => b.projectId));
  for (const p of past.projects) p.status = openProjects.has(p.id) ? 'bloqueado' : 'avanza';
  const ps = past.sessions.find((x) => x.id === s.id)!;
  ps.status = 'en_curso';
  return buildSnapshot(past, ps, new Date(when));
}
