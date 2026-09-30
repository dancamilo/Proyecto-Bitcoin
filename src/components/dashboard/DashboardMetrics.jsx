import { Coins, Receipt, Scale, TrendingUp } from "lucide-react";
import Reveal from "@/components/ui-kit/Reveal";
import MetricCard from "@/components/dashboard/MetricCard";
import { formatBTC, formatPct, formatSats, formatSignedUSD, formatUSD } from "@/utils/format";

const COL = "col-span-2 min-[400px]:col-span-1 lg:col-span-3";

export default function DashboardMetrics({ portfolio: p, market, plan }) {
  const vsAvg = p.avgPrice > 0 ? (market.price / p.avgPrice - 1) * 100 : 0;
  const items = [
    { icon: TrendingUp, label: "Ganancia", value: formatSignedUSD(p.unrealizedPnl), tone: p.unrealizedPnl >= 0 ? "gain" : "loss", footnote: `No realizada · Realizada ${formatSignedUSD(p.realizedPnl)}` },
    { icon: Scale, label: "Precio promedio", value: formatUSD(p.avgPrice), footnote: p.hasHoldings ? `Precio actual ${formatPct(vsAvg)} respecto al promedio` : "Aún sin compras" },
    { icon: Coins, label: "BTC acumulado", value: formatBTC(p.btcHeld), unit: "BTC", footnote: `${formatSats(p.btcHeld)} sats` },
    { icon: Receipt, label: "Comisión pagada", value: formatUSD(p.feesPaid), footnote: `Plan ${plan.name} · ${plan.rate.toFixed(2)}%` },
  ];
  return items.map((item, i) => (
    <Reveal key={item.label} delay={0.12 + i * 0.05} className={COL}>
      <MetricCard {...item} />
    </Reveal>
  ));
}