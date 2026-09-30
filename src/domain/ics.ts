/**
 * Calendario iCalendar (RFC 5545) para compromisos. Outlook, Teams y Google
 * Calendar lo aceptan como archivo (.ics) o como calendario suscrito por URL.
 */
import { combineDateTime } from './dates';
import { byId, isOpen, personName } from './selectors';
import type { AppData, Commitment, ID } from './types';

const pad = (n: number) => String(n).padStart(2, '0');

/** Date → 20261002T190000Z */
function utc(d: Date): string {
  return `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}${pad(d.getUTCSeconds())}Z`;
}

function escape(s: string): string {
  return s.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\r?\n/g, '\\n');
}

/** Pliega líneas a 75 octetos como pide el estándar. */
function fold(line: string): string {
  const bytes = new TextEncoder().encode(line);
  if (bytes.length <= 75) return line;
  const out: string[] = [];
  let current = '';
  let size = 0;
  for (const ch of line) {
    const n = new TextEncoder().encode(ch).length;
    if (size + n > (out.length ? 74 : 75)) {
      out.push(current);
      current = '';
      size = 0;
    }
    current += ch;
    size += n;
  }
  out.push(current);
  return out.join('\r\n ');
}

export interface IcsOptions {
  calendarName: string;
  now: Date;
  /** Enlace a la app para incluir en la descripción. */
  appUrl?: string;
  durationMinutes?: number;
}

function commitmentEvent(d: AppData, c: Commitment, o: IcsOptions): string[] | null {
  if (!c.dueDate) return null;
  const start = combineDateTime(c.dueDate, c.dueTime ?? '09:00');
  const end = new Date(start.getTime() + (o.durationMinutes ?? 30) * 60000);
  const project = byId(d.projects, c.projectId);
  const lines = [
    `Compromiso: ${c.action}`,
    project ? `Proyecto: ${project.name}` : '',
    `Responsable: ${personName(d, c.ownerId) || 'Sin responsable'}`,
    c.dependsOn ? `Dependencia: ${c.dependsOn.label}` : '',
    c.reschedules.length ? `Reprogramado ${c.reschedules.length} ${c.reschedules.length === 1 ? 'vez' : 'veces'}` : '',
    o.appUrl ? `Weekly Alignment & Unblock: ${o.appUrl}` : '',
  ].filter(Boolean);
  return [
    'BEGIN:VEVENT',
    `UID:${c.id}@weekly-alignment-unblock`,
    `DTSTAMP:${utc(o.now)}`,
    `SEQUENCE:${c.reschedules.length}`,
    `DTSTART:${utc(start)}`,
    `DTEND:${utc(end)}`,
    `SUMMARY:${escape(`Compromiso · ${c.action}`)}`,
    `DESCRIPTION:${escape(lines.join('\n'))}`,
    'STATUS:CONFIRMED',
    'TRANSP:TRANSPARENT',
    'BEGIN:VALARM',
    'ACTION:DISPLAY',
    `DESCRIPTION:${escape(c.action)}`,
    'TRIGGER:-PT1H',
    'END:VALARM',
    'END:VEVENT',
  ];
}

export function buildIcs(d: AppData, commitments: Commitment[], o: IcsOptions): string {
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//SOC//Weekly Alignment & Unblock//ES',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    `X-WR-CALNAME:${escape(o.calendarName)}`,
    'X-PUBLISHED-TTL:PT1H',
    ...commitments.flatMap((c) => commitmentEvent(d, c, o) ?? []),
    'END:VCALENDAR',
  ];
  return lines.map(fold).join('\r\n') + '\r\n';
}

/** Calendario con los compromisos abiertos de una persona. */
export function personCalendar(d: AppData, personId: ID, o: Omit<IcsOptions, 'calendarName'>): string {
  const open = d.commitments.filter((c) => c.ownerId === personId && isOpen(c) && !byId(d.projects, c.projectId)?.archived);
  return buildIcs(d, open, { ...o, calendarName: `Compromisos · ${personName(d, personId)}` });
}
