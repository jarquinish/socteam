import type { Level, Priority, Project } from './types';

/** SCORE = IMPACTO + URGENCIA + DEPENDENCIA (3 a 9). */
export function computeScore(p: Pick<Project, 'impact' | 'urgency' | 'dependency'>): number {
  return p.impact + p.urgency + p.dependency;
}

/** 8–9 = P1 · 6–7 = P2 · 3–5 = P3 */
export function priorityFromScore(score: number): Priority {
  if (score >= 8) return 'P1';
  if (score >= 6) return 'P2';
  return 'P3';
}

export function autoPriority(p: Pick<Project, 'impact' | 'urgency' | 'dependency'>): Priority {
  return priorityFromScore(computeScore(p));
}

/** Prioridad vigente: el ajuste manual de Dirección gana sobre el cálculo. */
export function effectivePriority(p: Project): Priority {
  return p.override?.priority ?? autoPriority(p);
}

export const PRIORITY_RANK: Record<Priority, number> = { P1: 0, P2: 1, P3: 2 };

export interface CriterionInfo {
  key: 'impact' | 'urgency' | 'dependency';
  label: string;
  levels: Record<Level, string>;
}

export const CRITERIA: CriterionInfo[] = [
  {
    key: 'impact',
    label: 'Impacto',
    levels: {
      1: 'Bajo o principalmente operativo',
      2: 'Relevante para el área o varias áreas',
      3: 'Estratégico, comercial, reputacional u objetivo clave',
    },
  },
  {
    key: 'urgency',
    label: 'Urgencia',
    levels: {
      1: 'Puede esperar',
      2: 'Debe avanzar esta semana',
      3: 'Deadline cercano, compromiso externo o impacto inmediato',
    },
  },
  {
    key: 'dependency',
    label: 'Dependencia',
    levels: {
      1: 'El área puede resolverlo prácticamente sola',
      2: 'Requiere coordinación con otra área',
      3: 'Depende de varias áreas, otra Dirección, proveedor o decisión externa',
    },
  },
];
