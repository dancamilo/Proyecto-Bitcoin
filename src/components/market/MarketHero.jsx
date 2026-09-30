import Reveal from "@/components/ui-kit/Reveal";
import Delta from "@/components/ui-kit/Delta";
import Eyebrow from "@/components/ui-kit/Eyebrow";
import AnimatedNumber from "@/components/ui-kit/AnimatedNumber";
import BitcoinPulse from "@/components/ui-kit/BitcoinPulse";
import { formatTime, formatUSD, formatUSDCompact } from "@/utils/format";

export default function MarketHero({ market: m }) {
  return (
    <Reveal className="mb-8 lg:mb-10">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <Eyebrow>Bitcoin · BTC/USD</Eyebrow>
          <p className="text-figure-xl mt-4 font-semibold"><AnimatedNumber value={m.price} format={formatUSD} /></p>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <Delta value={m.change24hPct} size="md" />
            <span className="text-sm text-muted-foreground">últimas 24h · actualizado {formatTime(m.updatedAt)}</span>
          </div>
        </div>
        <dl className="grid grid-cols-2 gap-6 text-sm sm:flex sm:gap-10">
          <div><dt className="text-xs text-muted-foreground">Máximo 24h</dt><dd className="mt-1 text-lg font-medium tabular-nums">{formatUSDCompact(m.high24h)}</dd></div>
          <div><dt className="text-xs text-muted-foreground">Mínimo 24h</dt><dd className="mt-1 text-lg font-medium tabular-nums">{formatUSDCompact(m.low24h)}</dd></div>
        </dl>
      </div>
      <BitcoinPulse data={m.sparkline} height={56} className="mr-1.5 mt-8" />
    </Reveal>
  );
}