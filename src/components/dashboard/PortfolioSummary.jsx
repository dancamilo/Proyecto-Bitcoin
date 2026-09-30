import { Wallet } from "lucide-react";
import Surface from "@/components/ui-kit/Surface";
import Eyebrow from "@/components/ui-kit/Eyebrow";
import Tag from "@/components/ui-kit/Tag";
import Delta from "@/components/ui-kit/Delta";
import Stat from "@/components/ui-kit/Stat";
import AnimatedNumber from "@/components/ui-kit/AnimatedNumber";
import { cn } from "@/lib/utils";
import { formatBTC, formatSignedUSD, formatUSD } from "@/utils/format";

export default function PortfolioSummary({ portfolio: p, className }) {
  const up = p.pnlAbs >= 0;
  return (
    <Surface glow aria-labelledby="portfolio-title" className={cn("flex min-h-[300px] flex-col justify-between", className)}>
      <div className="flex items-center justify-between gap-3">
        <Eyebrow icon={Wallet} as="h2"><span id="portfolio-title">Tu inversión</span></Eyebrow>
        <Tag>USD</Tag>
      </div>
      <div className="mt-8">
        <p className="sr-only">Valor actual del portfolio</p>
        <p className="text-figure-xl font-semibold">
          <AnimatedNumber value={p.currentValue} format={formatUSD} />
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2">
          <Delta value={p.pnlPct} size="md" />
          <span className={cn("text-base font-medium tabular-nums", up ? "text-gain" : "text-loss")}>{formatSignedUSD(p.pnlAbs)}</span>
          <span className="text-sm text-muted-foreground">ganancia no realizada</span>
        </div>
      </div>
      <dl className="mt-8 grid grid-cols-2 gap-4 border-t border-white/[0.06] pt-5 sm:grid-cols-3">
        <Stat label="Total invertido" value={formatUSD(p.totalInvested)} />
        <Stat label="Resultado" value={formatSignedUSD(p.pnlAbs)} tone={up ? "gain" : "loss"} />
        <Stat label="Tenencia" value={formatBTC(p.btcHeld)} unit="BTC" className="col-span-2 sm:col-span-1" />
      </dl>
    </Surface>
  );
}