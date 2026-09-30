/** Router mínimo basado en hash: `#/proyectos?prioridad=P1`. Sin dependencias. */
import { useEffect, useState } from 'react';

export interface Route {
  path: string;
  params: URLSearchParams;
}

function parse(): Route {
  const raw = window.location.hash.replace(/^#/, '') || '/';
  const [path, query] = raw.split('?');
  return { path: path || '/', params: new URLSearchParams(query ?? '') };
}

export function useRoute(): Route {
  const [route, setRoute] = useState(parse);
  useEffect(() => {
    const onChange = () => setRoute(parse());
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, []);
  return route;
}

export function href(path: string, params?: Record<string, string | undefined>): string {
  const q = new URLSearchParams();
  for (const [k, v] of Object.entries(params ?? {})) if (v) q.set(k, v);
  const qs = q.toString();
  return `#${path}${qs ? `?${qs}` : ''}`;
}

export function navigate(path: string, params?: Record<string, string | undefined>) {
  window.location.hash = href(path, params);
}

/** Actualiza parámetros sin crear entradas nuevas en el historial. */
export function setParams(path: string, params: Record<string, string | undefined>) {
  history.replaceState(null, '', href(path, params));
  window.dispatchEvent(new HashChangeEvent('hashchange'));
}
