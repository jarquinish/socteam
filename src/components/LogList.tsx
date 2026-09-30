import { useStore } from '../data/store';
import { fmtStamp } from '../domain/dates';
import { personName } from '../domain/selectors';
import type { ID } from '../domain/types';

export interface LogEntry { at: string; text: string; by?: ID }

/**
 * Historial con autor. Si la entrada no trae `by`, se toma de la bitácora de
 * eventos (misma entidad y mismo instante).
 */
export function LogList({ items, entityId }: { items: LogEntry[]; entityId?: ID }) {
  const { data } = useStore();
  const actor = (x: LogEntry) =>
    x.by ?? (entityId ? data.events.find((e) => e.entityId === entityId && e.at === x.at && e.actorId)?.actorId : undefined);
  return (
    <div className="log">
      {items.map((x, i) => {
        const who = personName(data, actor(x));
        return (
          <div className="log-item" key={i}>
            <time>{fmtStamp(x.at)}</time>
            <span className="grow">{x.text}{who && <span className="muted"> · {who}</span>}</span>
          </div>
        );
      })}
    </div>
  );
}
