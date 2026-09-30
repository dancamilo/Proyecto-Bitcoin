import { RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import useOnlineStatus from "@/hooks/useOnlineStatus";
import { useMarketPrice } from "@/hooks/useMarketData";
import { formatTime } from "@/utils/format";

// Estado de sincronización: al día · actualizando · sin conexión.
export default function SyncStatus() {
  const online = useOnlineStatus();
  const market = useMarketPrice();
  const updating = market.isFetching;

  const label = !online
    ? "Sin conexión"
    : updating
    ? "Actualizando…"
    : market.dataUpdatedAt
    ? `Actualizado ${formatTime(new Date(market.dataUpdatedAt).toISOString())}`
    : "Sin datos";

  return (
    <button
      type="button"
      onClick={() => market.refetch()}
      disabled={updating || !online}
      aria-label={`${label}. Actualizar datos`}
      className="inline-flex h-10 items-center gap-2 rounded-full border border-white/[0.06] bg-surface-1/70 px-3.5 text-xs text-muted-foreground transition-colors hover:border-white/[0.14] hover:text-foreground disabled:cursor-default"
    >
      <span className="relative grid h-2 w-2 place-items-center">
        {online && !updating && <span className="ping-soft absolute h-2 w-2 rounded-full bg-gain/60" />}
        <span className={cn("relative h-2 w-2 rounded-full", !online ? "bg-warn" : updating ? "bg-info" : market.isError ? "bg-loss" : "bg-gain")} />
      </span>
      <span className="hidden tabular-nums sm:inline lg:hidden xl:inline" aria-live="polite">{label}</span>
      <RefreshCw className={cn("h-3.5 w-3.5", updating && "animate-spin")} aria-hidden />
    </button>
  );
}
