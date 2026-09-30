import Surface from "@/components/ui-kit/Surface";
import Delta from "@/components/ui-kit/Delta";
import Sparkline from "@/components/ui-kit/Sparkline";
import RangeBar from "@/components/ui-kit/RangeBar";
import AnimatedNumber from "@/components/ui-kit/AnimatedNumber";
import { cn } from "@/lib/utils";
import { formatSignedUSD, formatUSD } from "@/utils/format";

export default function BitcoinPriceCard({ market: m, className }) {
  const up = m.change24hPct >= 0;
  return (
    <Surface aria-labelledby="btc-title" className={cn("flex flex-col", className)}>
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-full bg-btc/15 text-lg font-semibold text-btc ring-1 ring-inset ring-btc/25" aria-hidden>₿</span>
          <div>
            <h2 id="btc-title" className="text-[15px] font-semibold leading-tight">Bitcoin</h2>
            <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground">BTC · USD</p>
          </div>
        </div>
        <Delta value={m.change24hPct} />
      </div>
      <p className="text-figure-lg mt-7 font-semibold">
        <AnimatedNumber value={m.price} format={formatUSD} />
      </p>
      <p className="mt-2 text-sm text-muted-foreground">
        <span className={cn("tabular-nums", up ? "text-gain" : "text-loss")}>{formatSignedUSD(m.change24hAbs)}</span> en 24h
      </p>
      <Sparkline data={m.sparkline} positive={up} className="my-5 h-20 w-full flex-1" />
      <RangeBar low={m.low24h} high={m.high24h} current={m.price} />
    </Surface>
  );
}