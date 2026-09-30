import { Trash2 } from "lucide-react";
import TypeBadge from "@/components/transactions/TypeBadge";
import ResultCell from "@/components/transactions/ResultCell";
import { formatBTC, formatDate, formatTime, formatUSD } from "@/utils/format";

export default function TransactionRow({ tx, onDelete }) {
  return (
    <tr className="group border-t border-white/[0.05] transition-colors hover:bg-white/[0.025]">
      <td className="py-4 pl-5 pr-3">
        <span className="block text-sm font-medium">{formatDate(tx.date)}</span>
        <span className="block text-xs text-muted-foreground tabular-nums">{formatTime(tx.date)}</span>
      </td>
      <td className="px-3 py-4"><TypeBadge type={tx.type} /></td>
      <td className="px-3 py-4 text-right text-sm tabular-nums">{formatBTC(tx.btc)}</td>
      <td className="px-3 py-4 text-right text-sm font-medium tabular-nums">{formatUSD(tx.usd)}</td>
      <td className="px-3 py-4 text-right text-sm tabular-nums text-muted-foreground">{formatUSD(tx.price)}</td>
      <td className="px-3 py-4 text-right text-sm tabular-nums text-muted-foreground">{formatUSD(tx.fee)}</td>
      <td className="py-4 pl-3 pr-3 text-right"><ResultCell tx={tx} /></td>
      <td className="py-4 pl-3 pr-5 text-right">
        <button type="button" onClick={() => onDelete?.(tx.id)} aria-label="Eliminar operación"
          className="rounded-lg p-1.5 text-muted-foreground/60 opacity-0 transition-colors hover:bg-loss/10 hover:text-loss group-hover:opacity-100">
          <Trash2 className="h-4 w-4" />
        </button>
      </td>
    </tr>
  );
}
