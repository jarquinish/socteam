/** Utilidades de fecha en hora local, formato es-MX. Sin dependencias. */

const MONTHS = [
  'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
  'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre',
];
const MONTHS_SHORT = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
const WEEKDAYS = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];

const pad = (n: number) => String(n).padStart(2, '0');

/** Date → 'YYYY-MM-DD' en hora local. */
export function toISODate(d: Date): string {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

/** Date → 'HH:mm' en hora local. */
export function toISOTime(d: Date): string {
  return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

/** 'YYYY-MM-DD' → Date a medianoche local. */
export function parseISODate(s: string): Date {
  const [y, m, d] = s.split('-').map(Number);
  return new Date(y, m - 1, d);
}

/** Combina fecha + hora local en un Date. Sin hora se toma el final del día. */
export function combineDateTime(date: string, time?: string): Date {
  const d = parseISODate(date);
  if (time) {
    const [h, min] = time.split(':').map(Number);
    d.setHours(h, min, 0, 0);
  } else {
    d.setHours(23, 59, 59, 999);
  }
  return d;
}

export function addDays(d: Date, days: number): Date {
  const r = new Date(d);
  r.setDate(r.getDate() + days);
  return r;
}

/** Lunes de la semana de `d`. */
export function weekStart(d: Date): Date {
  const r = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const day = r.getDay(); // 0 = domingo
  const diff = day === 0 ? -6 : 1 - day;
  return addDays(r, diff);
}

/** "2 octubre" */
export function fmtDay(date: string): string {
  const d = parseISODate(date);
  return `${d.getDate()} ${MONTHS[d.getMonth()]}`;
}

/** "2 oct" */
export function fmtDayShort(date: string): string {
  const d = parseISODate(date);
  return `${d.getDate()} ${MONTHS_SHORT[d.getMonth()]}`;
}

/** "miércoles 30 septiembre" */
export function fmtLongDay(date: string): string {
  const d = parseISODate(date);
  return `${WEEKDAYS[d.getDay()]} ${d.getDate()} ${MONTHS[d.getMonth()]}`;
}

/** "mié 30 sep" */
export function fmtWeekdayShort(date: string): string {
  const d = parseISODate(date);
  return `${WEEKDAYS[d.getDay()].slice(0, 3)} ${d.getDate()} ${MONTHS_SHORT[d.getMonth()]}`;
}

/** "28 septiembre – 2 octubre" (lunes a viernes). */
export function fmtWeekRange(weekStartDate: string): string {
  const start = parseISODate(weekStartDate);
  const end = addDays(start, 4);
  return `${start.getDate()} ${MONTHS[start.getMonth()]} – ${end.getDate()} ${MONTHS[end.getMonth()]}`;
}

/** ISO timestamp → "30 sep, 10:42" */
export function fmtStamp(iso: string): string {
  const d = new Date(iso);
  return `${d.getDate()} ${MONTHS_SHORT[d.getMonth()]}, ${toISOTime(d)}`;
}

/** "2 oct · 13:00" o lo que exista. */
export function fmtDue(date?: string, time?: string): string {
  if (!date && !time) return 'Sin fecha';
  if (!date) return `Sin fecha · ${time}`;
  return time ? `${fmtDayShort(date)} · ${time}` : `${fmtDayShort(date)} · sin hora`;
}

/** Texto relativo breve: "hoy", "mañana", "en 3 días", "hace 2 días". */
export function relativeDay(date: string, now: Date): string {
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const diff = Math.round((parseISODate(date).getTime() - today.getTime()) / 86400000);
  if (diff === 0) return 'hoy';
  if (diff === 1) return 'mañana';
  if (diff === -1) return 'ayer';
  if (diff > 1) return `en ${diff} días`;
  return `hace ${-diff} días`;
}
