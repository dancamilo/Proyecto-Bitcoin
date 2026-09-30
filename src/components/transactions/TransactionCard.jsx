import { Trash2 } from "lucide-react";
import TypeBadge from "@/components/transactions/TypeBadge";
import ResultCell from "@/components/transactions/ResultCell";
import { formatBTC, formatDate, formatTime, formatUSD } from "@/utils/format";

// Versión móvil de una fila del historial.
export default function TransactionCard({ tx, onDelete }) {
  return (
    <li className="rounded-2xl bg-white/[0.025] p-4 ring-1 ring-inset ring-white/[0.05]">
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-2">
          <TypeBadge type={tx.type} />
          <p className="text-xs text-muted-foreground tabular-nums">{formatDate(tx.date)} · {formatTime(tx.date)}</p>
        </div>
        <div className="flex items-start gap-1">
          <div className="text-right">
            <p className="text-lg font-semibold tabular-nums">{formatUSD(tx.usd)}</p>
            <p className="text-xs text-muted-foreground tabular-nums">{formatBTC(tx.btc)} BTC</p>
          </div>
          <button type="button" onClick={() => onDelete?.(tx.id)} aria-label="Eliminar operación" className="-mr-1.5 -mt-1 rounded-lg p-1.5 text-muted-foreground/60 hover:bg-loss/10 hover:text-loss">
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
      <dl className="mt-4 grid grid-cols-3 gap-2 border-t border-white/[0.05] pt-3 text-xs">
        <div><dt className="text-muted-foreground">Precio</dt><dd className="mt-0.5 tabular-nums">{formatUSD(tx.price)}</dd></div>
        <div><dt className="text-muted-foreground">Comisión</dt><dd className="mt-0.5 tabular-nums">{formatUSD(tx.fee)}</dd></div>
        <div className="text-right"><dt className="sr-only">Resultado</dt><dd><ResultCell tx={tx} /></dd></div>
      </dl>
    </li>
  );
}
