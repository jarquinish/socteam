/**
 * Modelo de datos de Weekly Alignment & Unblock.
 *
 * Todo el estado vive en un único objeto `AppData` serializable a JSON.
 * Las fechas se guardan como ISO (`2026-09-30T10:00:00.000Z`) para timestamps
 * y como texto local (`2026-10-02` / `13:00`) para fechas y horas compromiso,
 * que es como se capturan y se leen en la junta.
 */

export type ID = string;

/** Puntuación de un criterio de ponderación. */
export type Level = 1 | 2 | 3;

export type Priority = 'P1' | 'P2' | 'P3';

/** Estado de un proyecto dentro de la Weekly. */
export type ProjectStatus = 'avanza' | 'bloqueado' | 'decision' | 'resuelto';

/** De quién depende un bloqueo o compromiso. */
export type DependencyType = 'persona' | 'area' | 'direccion' | 'proveedor' | 'tercero';

export interface DependencyRef {
  type: DependencyType;
  /** Id de persona o área interna cuando aplica. */
  refId?: ID;
  /** Texto visible: "Diseño", "Dirección Comercial", "Proveedor de impresión"... */
  label: string;
}

export interface Area {
  id: ID;
  name: string;
  /** Color de acento del área (hex). */
  color: string;
  /** Responsable (gerente) del área. */
  managerId?: ID;
  archived?: boolean;
  order: number;
}

export interface Person {
  id: ID;
  name: string;
  areaId?: ID;
  role?: string;
  archived?: boolean;
}

export interface PriorityOverride {
  priority: Priority;
  /** Prioridad calculada al momento del ajuste. */
  autoPriority: Priority;
  reason?: string;
  at: string;
}

export interface Project {
  id: ID;
  name: string;
  areaId: ID;
  ownerId?: ID;
  impact: Level;
  urgency: Level;
  dependency: Level;
  /** Ajuste manual de Dirección vigente (si existe). */
  override?: PriorityOverride;
  /** Bitácora de ajustes manuales (incluye los que ya se retiraron). */
  overrideLog: PriorityOverride[];
  status: ProjectStatus;
  targetDate?: string;
  archived: boolean;
  createdAt: string;
  updatedAt: string;
}

export type BlockerColumn = 'por_destrabar' | 'en_gestion' | 'resuelto';

/** Un "bloqueo" puede ser un impedimento o una decisión pendiente. */
export type BlockerKind = 'bloqueo' | 'decision';

export interface LogItem {
  at: string;
  text: string;
}

export interface Blocker {
  id: ID;
  projectId: ID;
  kind: BlockerKind;
  /** ¿Qué está bloqueando este proyecto? */
  description: string;
  /** ¿Qué necesitamos para avanzar? */
  need: string;
  /** ¿De quién depende? */
  dependsOn?: DependencyRef;
  /** ¿Quién gestionará el desbloqueo? */
  ownerId?: ID;
  column: BlockerColumn;
  /** Compromiso accionable asociado. */
  commitmentId?: ID;
  createdAt: string;
  createdSessionId?: ID;
  resolvedAt?: string;
  resolvedSessionId?: ID;
  history: LogItem[];
}

/** Estado guardado. "vencido" nunca se guarda: se deriva de fecha + hora. */
export type CommitmentStatus = 'pendiente' | 'en_gestion' | 'reprogramado' | 'escalado' | 'cumplido';
export type CommitmentDisplayStatus = CommitmentStatus | 'vencido';

export interface Reschedule {
  at: string;
  fromDate?: string;
  fromTime?: string;
  toDate: string;
  toTime: string;
  reason: string;
  sessionId?: ID;
}

export interface Escalation {
  at: string;
  to: string;
  note?: string;
}

export interface Commitment {
  id: ID;
  /** Acción concreta. */
  action: string;
  projectId?: ID;
  blockerId?: ID;
  ownerId?: ID;
  dependsOn?: DependencyRef;
  dueDate?: string;
  dueTime?: string;
  /** Fecha/hora original, se conserva aunque se reprograme. */
  originalDueDate?: string;
  originalDueTime?: string;
  status: CommitmentStatus;
  reschedules: Reschedule[];
  escalations: Escalation[];
  comments: LogItem[];
  createdAt: string;
  createdSessionId?: ID;
  completedAt?: string;
  completedSessionId?: ID;
  /** Veces que en una revisión de Weekly se respondió "No se cumplió". */
  missedCount: number;
}

export type ReviewResult = 'si' | 'no' | 'reprogramar' | 'escalar';

export interface SessionReview {
  commitmentId: ID;
  result: ReviewResult;
  at: string;
}

/** Fotografía de la sesión al cerrarla: base del historial y de métricas futuras. */
export interface SessionSnapshot {
  projects: { active: number; p1: number; p2: number; p3: number; reviewed: number };
  blockers: { detected: number; newInSession: number; resolved: number; followUp: number };
  commitments: {
    created: number;
    previousPending: number;
    overdue: number;
    completed: number;
    rescheduled: number;
    escalated: number;
  };
  warnings: string[];
  summaryText: string;
  commitmentsText: string;
}

export type SessionPhase = 'revision' | 'proyectos';

export interface Session {
  id: ID;
  /** Lunes de la semana (YYYY-MM-DD). */
  weekStart: string;
  /** Fecha de la sesión (YYYY-MM-DD). */
  date: string;
  startedAt: string;
  closedAt?: string;
  status: 'en_curso' | 'cerrada';
  phase: SessionPhase;
  previousSessionId?: ID;
  /** Compromisos abiertos de sesiones anteriores al iniciar (a revisar). */
  carriedCommitmentIds: ID[];
  /** Compromisos cumplidos desde la sesión anterior (se muestran como CUMPLIDOS). */
  completedSinceLastIds: ID[];
  /** Bloqueos abiertos al iniciar la sesión. */
  openBlockerIdsAtStart: ID[];
  reviews: SessionReview[];
  reviewedProjectIds: ID[];
  snapshot?: SessionSnapshot;
}

export interface Settings {
  directionName: string;
  /** Máximo recomendado de proyectos principales por área. */
  maxProjectsPerArea: number;
}

/** Evento de dominio: bitácora para métricas futuras e integraciones (Teams, Power Automate...). */
export interface DomainEvent {
  id: ID;
  at: string;
  type: string;
  entityId?: ID;
  data?: Record<string, unknown>;
}

export interface AppData {
  version: 1;
  settings: Settings;
  areas: Area[];
  people: Person[];
  projects: Project[];
  blockers: Blocker[];
  commitments: Commitment[];
  sessions: Session[];
  events: DomainEvent[];
}
