import { Link } from "react-router-dom";
import { ArrowRight, Clock } from "lucide-react";
import Surface from "@/components/ui-kit/Surface";
import Eyebrow from "@/components/ui-kit/Eyebrow";
import LineItem from "@/components/ui-kit/LineItem";
import TypeBadge from "@/components/transactions/TypeBadge";
import { EmptyState } from "@/components/states/presets";
import { cn } from "@/lib/utils";
import { formatBTC, formatDate, formatTime, formatUSD } from "@/utils/format";

export default function LastTransactionCard({ tx, className }) {
  return (
    <Surface aria-labelledby="last-tx-title" className={cn("flex flex-col", className)}>
      <Eyebrow icon={Clock} as="h2"><span id="last-tx-title">Última operación</span></Eyebrow>
      {!tx ? (
        <EmptyState compact />
      ) : (
        <>
          <div className="mt-6 flex items-center justify-between gap-3">
            <TypeBadge type={tx.type} />
            <span className="text-xs text-muted-foreground tabular-nums">{formatDate(tx.date)} · {formatTime(tx.date)}</span>
          </div>
          <p className="text-figure-lg mt-5 font-semibold">{formatUSD(tx.usd)}</p>
          <p className="mt-1.5 text-sm tabular-nums text-muted-foreground">{formatBTC(tx.btc)} BTC</p>
          <dl className="mt-5 divide-y divide-white/[0.05] border-t border-white/[0.05]">
            <LineItem label="Precio" value={formatUSD(tx.price)} />
            <LineItem label="Comisión" value={formatUSD(tx.fee)} />
          </dl>
          <Link to="/operaciones" className="group mt-auto flex items-center justify-between rounded-2xl pt-5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
            Ver historial completo
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden />
          </Link>
        </>
      )}
    </Surface>
  );
}