import { textToHtml } from '../domain/summary';

/**
 * Copia texto al portapapeles con versión HTML (Teams conserva negritas al pegar)
 * y texto plano como respaldo. Funciona también sin HTTPS mediante execCommand.
 */
export async function copyRich(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && 'ClipboardItem' in window && window.isSecureContext) {
      const item = new ClipboardItem({
        'text/plain': new Blob([text], { type: 'text/plain' }),
        'text/html': new Blob([textToHtml(text)], { type: 'text/html' }),
      });
      await navigator.clipboard.write([item]);
      return true;
    }
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    /* continúa con el respaldo */
  }
  const ta = document.createElement('textarea');
  ta.value = text;
  ta.style.position = 'fixed';
  ta.style.opacity = '0';
  document.body.appendChild(ta);
  ta.select();
  let ok = false;
  try {
    ok = document.execCommand('copy');
  } catch {
    ok = false;
  }
  ta.remove();
  return ok;
}
