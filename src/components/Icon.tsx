/** Iconos de trazo, dibujados en línea (sin librería). */
const PATHS: Record<string, string> = {
  home: 'M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z',
  folder: 'M3 6.5A1.5 1.5 0 0 1 4.5 5h4.3l2 2.2h8.7A1.5 1.5 0 0 1 21 8.7v9.8a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 18.5z',
  lock: 'M6 11h12v9H6zM8.5 11V8a3.5 3.5 0 0 1 7 0v3',
  check: 'M4.5 12.5 9.5 17.5 19.5 6.5',
  checks: 'M4 12.5 7.5 16 14 8.5M11 15.5l1 1 8-9',
  list: 'M9 6h11M9 12h11M9 18h11M4.5 6h.01M4.5 12h.01M4.5 18h.01',
  flow: 'M5 6h6M5 6a2 2 0 1 1 0 .01M13 18h6m0 0a2 2 0 1 0 0 .01M11 6c3 0 3 12 6 12',
  user: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4.5 20.5c1.2-3.6 4-5.5 7.5-5.5s6.3 1.9 7.5 5.5',
  clock: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 7.5V12l3 2',
  history: 'M3.5 12a8.5 8.5 0 1 0 2.5-6M3.5 4v4h4M12 8v4.5l3 1.5',
  play: 'M7 4.5v15l12.5-7.5z',
  stop: 'M6.5 6.5h11v11h-11z',
  x: 'M6 6l12 12M18 6 6 18',
  plus: 'M12 5v14M5 12h14',
  search: 'M10.5 17a6.5 6.5 0 1 0 0-13 6.5 6.5 0 0 0 0 13zM20 20l-4.8-4.8',
  edit: 'M4 20h4L19 9l-4-4L4 16zM13.5 6.5l4 4',
  archive: 'M3.5 5h17v4h-17zM5 9v10h14V9M10 13h4',
  restore: 'M4 12a8 8 0 1 0 2.4-5.7M4 4v4h4',
  chevronLeft: 'M15 5l-7 7 7 7',
  chevronRight: 'M9 5l7 7-7 7',
  chevronDown: 'M5 9l7 7 7-7',
  copy: 'M8 8h11v12H8zM5 16V4h11',
  alert: 'M12 3.5 2.5 20h19zM12 10v4.5M12 17.5h.01',
  calendar: 'M4 6h16v14H4zM4 10h16M8.5 3.5v4M15.5 3.5v4',
  settings: 'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM19.4 13.5l1.6 1.2-2 3.4-1.9-.7a7.5 7.5 0 0 1-2.1 1.2L14.7 21h-4l-.4-2.4a7.5 7.5 0 0 1-2.1-1.2l-1.9.7-2-3.4 1.6-1.2a7.6 7.6 0 0 1 0-2.9L4.3 9.4l2-3.4 1.9.7a7.5 7.5 0 0 1 2.1-1.2L10.7 3h4l.4 2.5a7.5 7.5 0 0 1 2.1 1.2l1.9-.7 2 3.4-1.6 1.2a7.6 7.6 0 0 1 0 2.9z',
  arrowRight: 'M4 12h15M13 6l6 6-6 6',
  arrowUp: 'M12 19V5M6 11l6-6 6 6',
  arrowDown: 'M12 5v14M6 13l6 6 6-6',
  message: 'M4 5h16v11H9l-5 4z',
  escalate: 'M12 20V8M6.5 13.5 12 8l5.5 5.5M5 4h14',
  reschedule: 'M4 7h16v13H4zM4 11h16M8.5 3.5v4M15.5 3.5v4M9 15.5h6m-2-2 2 2-2 2',
  trash: 'M4.5 7h15M9.5 7V4.5h5V7M6.5 7l1 13h9l1-13',
  target: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 16.5a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9zM12 12h.01',
  flag: 'M5 21V4M5 4h11l-2 4 2 4H5',
  unlock: 'M6 11h12v9H6zM8.5 11V8a3.5 3.5 0 0 1 6.8-1.2',
  decision: 'M12 3.5 20.5 12 12 20.5 3.5 12zM12 9v3.5M12 15.5h.01',
  grip: 'M9 6h.01M15 6h.01M9 12h.01M15 12h.01M9 18h.01M15 18h.01',
  download: 'M12 4v11M7 10.5l5 5 5-5M5 20h14',
  upload: 'M12 16V5M7 9.5l5-5 5 5M5 20h14',
  logout: 'M15 4h4v16h-4M10 8l-4 4 4 4M6 12h10',
};

export type IconName = keyof typeof PATHS;

export function Icon({ name, size = 18, className, strokeWidth = 1.9 }: {
  name: IconName | string; size?: number; className?: string; strokeWidth?: number;
}) {
  const d = PATHS[name] ?? PATHS.alert;
  const filled = name === 'play' || name === 'stop';
  return (
    <svg
      width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" className={className}
      fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={filled ? 0 : strokeWidth}
      strokeLinecap="round" strokeLinejoin="round"
    >
      <path d={d} />
    </svg>
  );
}
