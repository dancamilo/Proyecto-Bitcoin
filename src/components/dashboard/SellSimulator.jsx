import { ArrowUpFromLine } from "lucide-react";
import Surface from "@/components/ui-kit/Surface";
import Eyebrow from "@/components/ui-kit/Eyebrow";
import LineItem from "@/components/ui-kit/LineItem";
import CopyButton from "@/components/ui-kit/CopyButton";
import Disclaimer from "@/components/ui-kit/Disclaimer";
import AnimatedNumber from "@/components/ui-kit/AnimatedNumber";
import { EmptyState } from "@/components/states/presets";
import { cn } from "@/lib/utils";
import { calculateSell } from "@/services/calculations";
import { useFeeSettings } from "@/hooks/useFeeSettings";
import { formatBTC, formatUSD } from "@/utils/format";

export default function SellSimulator({ portfolio, className }) {
  const { activePlan } = useFeeSettings();
  const s = portfolio?.hasHoldings
    ? calculateSell({ btcInput: portfolio.btcHeld, pricePerBtcUsd: portfolio.market?.price, plan: activePlan })
    : null;

  return (
    <Surface aria-labelledby="sell-title" className={cn("flex flex-col", className)}>
      <Eyebrow icon={ArrowUpFromLine}>Si vendes hoy</Eyebrow>
      <h2 id="sell-title" className="mt-3 text-xl font-semibold tracking-tight">Estimación de venta</h2>

      {!s ? (
        <div className="flex flex-1 flex-col justify-center">
          <EmptyState title="Aún no tienes BTC" description="Registra una compra para ver aquí una estimación de venta." />
        </div>
      ) : (
        <>
          <p className="mt-1 text-sm text-muted-foreground">
            Tenencia de <span className="tabular-nums text-foreground/85">{formatBTC(s.btc)} BTC</span> a {formatUSD(s.price)}
          </p>

          <div className="surface-inset mt-6 rounded-2xl px-4 py-2">
            <dl>
              <LineItem label="Valor bruto" value={formatUSD(s.gross)} />
              <LineItem label="Comisión estimada" hint={`${activePlan.rate.toFixed(2)}%`} value={`−${formatUSD(s.fee)}`} tone="loss" />
            </dl>
            <div className="my-1 border-t border-dashed border-white/10" />
            <div className="flex items-end justify-between gap-3 py-3">
              <div>
                <p className="text-sm text-muted-foreground">Recibirías aproximadamente</p>
                <p className="text-figure-lg mt-1.5 font-semibold">
                  <AnimatedNumber value={s.net} format={formatUSD} />
                </p>
              </div>
              <CopyButton value={formatUSD(s.net)} label="Copiar monto estimado" />
            </div>
          </div>
        </>
      )}

      <Disclaimer className="mt-auto pt-5">Estimación informativa basada en el precio actual y la comisión configurada. No constituye una recomendación.</Disclaimer>
    </Surface>
  );
}
