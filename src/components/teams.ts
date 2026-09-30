/** Pide al servidor publicar el resumen de una Weekly en el canal de Teams configurado. */
export async function publishSummaryToTeams(sessionId: string): Promise<{ ok: boolean; error?: string }> {
  try {
    const r = await fetch('/api/teams/summary', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId }),
    });
    if (r.ok) return { ok: true };
    const body = (await r.json().catch(() => ({}))) as { error?: string };
    return { ok: false, error: body.error ?? `Error ${r.status}` };
  } catch {
    return { ok: false, error: 'Sin conexión con el servidor' };
  }
}
