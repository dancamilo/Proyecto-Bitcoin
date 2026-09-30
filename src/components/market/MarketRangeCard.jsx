import Surface from "@/components/ui-kit/Surface";
import Delta from "@/components/ui-kit/Delta";
import Sparkline from "@/components/ui-kit/Sparkline";
import RangeBar from "@/components/ui-kit/RangeBar";
import { cn } from "@/lib/utils";
import { formatUSD } from "@/utils/format";

export default function MarketRangeCard({ range: r, current, className }) {
  const up = r.changePct >= 0;
  return (
    <Surface as="article" interactive aria-label={r.label} className={cn("flex h-full flex-col gap-4 p-5", className)}>
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="font-mono text-2xl font-medium tracking-tight">{r.key}</p>
          <p className="text-xs text-muted-foreground">{r.label}</p>
        </div>
        <Delta value={r.changePct} size="xs" />
      </div>
      <Sparkline data={r.spark} positive={up} className="h-14 w-full" />
      <div>
        <p className="text-xs text-muted-foreground">Precio al inicio</p>
        <p className="mt-0.5 text-base font-medium tabular-nums">{formatUSD(r.openPrice)}</p>
      </div>
      <div className="mt-auto"><RangeBar low={r.low} high={r.high} current={current} /></div>
    </Surface>
  );
}