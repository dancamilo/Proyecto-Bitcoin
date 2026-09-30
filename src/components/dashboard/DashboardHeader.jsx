import { Plus } from "lucide-react";
import Reveal from "@/components/ui-kit/Reveal";
import Eyebrow from "@/components/ui-kit/Eyebrow";
import ActionButton from "@/components/ui-kit/ActionButton";
import BitcoinPulse from "@/components/ui-kit/BitcoinPulse";
import Delta from "@/components/ui-kit/Delta";
import { formatUSD } from "@/utils/format";

export default function DashboardHeader({ market, onRegister }) {
  const today = new Date().toLocaleDateString("es-ES", { weekday: "long", day: "numeric", month: "long" });
  return (
    <header className="mb-8 sm:mb-10">
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <Reveal className="max-w-3xl">
          <Eyebrow><span className="first-letter:uppercase">{today}</span><span aria-hidden>·</span>Resumen personal</Eyebrow>
          <h1 className="text-display mt-4 font-semibold">
            Tu inversión. <span className="text-foreground/45">Tus datos.</span>{" "}
            <span className="text-gradient-btc">Tu análisis.</span>
          </h1>
          <p className="mt-4 max-w-md text-base text-muted-foreground sm:text-lg">Comprende cómo se mueve tu inversión en Bitcoin.</p>
        </Reveal>
        <Reveal delay={0.1}>
          <ActionButton icon={Plus} size="lg" onClick={onRegister} className="w-full sm:w-auto">Registrar compra</ActionButton>
        </Reveal>
      </div>
      <Reveal delay={0.18} className="mt-8 sm:mt-10">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <Eyebrow>Pulso de mercado · 24h</Eyebrow>
          <p className="flex items-center gap-2 text-sm tabular-nums">
            <span className="font-mono text-xs text-muted-foreground">BTC</span>
            <span className="font-medium">{formatUSD(market.price)}</span>
            <Delta value={market.change24hPct} size="xs" />
          </p>
        </div>
        <BitcoinPulse data={market.sparkline} height={64} className="mr-1.5" />
      </Reveal>
    </header>
  );
}