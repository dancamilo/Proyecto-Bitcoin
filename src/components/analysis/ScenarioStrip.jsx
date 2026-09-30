import { motion } from "framer-motion";
import Reveal from "@/components/ui-kit/Reveal";
import Eyebrow from "@/components/ui-kit/Eyebrow";
import Delta from "@/components/ui-kit/Delta";
import { cn } from "@/lib/utils";
import { EASE } from "@/charts/theme";
import { useMarketPrice, useMarketHistory } from "@/hooks/useMarketData";
import { useFeeSettings } from "@/hooks/useFeeSettings";
import { computeHistoricalScenario } from "@/services/calculations";
import { getHistoricalPeriodDefs } from "@/services/dataService";
import { formatUSD } from "@/utils/format";

const KEYS = ["7D", "30D", "90D", "1Y"];

export default function ScenarioStrip({ amount }) {
  const usd = parseFloat(amount) > 0 ? parseFloat(amount) : 20;
  const market = useMarketPrice();
  const { activePlan } = useFeeSettings();
  const defs = getHistoricalPeriodDefs();

  // Comparten caché de React Query con Mercado/HistoricalSimulator: no
  // duplican peticiones de red si ya se pidieron esos mismos rangos.
  const h7 = useMarketHistory("7D");
  const h30 = useMarketHistory("30D");
  const h90 = useMarketHistory("90D");
  const h1y = useMarketHistory("1Y");
  const histories = { "7D": h7, "30D": h30, "90D": h90, "1Y": h1y };

  if (!market.data) return null;

  const rows = KEYS.map((key) => {
    const series = histories[key].data;
    const period = defs.find((d) => d.key === key);
    if (!series?.length) return null;
    const scenario = computeHistoricalScenario({ usd, series, currentPrice: market.data.price, plan: activePlan });
    return scenario ? { ...scenario, period } : null;
  }).filter(Boolean);

  if (!rows.length) return null;
  const maxAbs = Math.max(...rows.map((r) => Math.abs(r.changePct)), 1);

  return (
    <Reveal delay={0.1} className="mt-4">
      <section aria-labelledby="strip-title" className="rounded-[1.75rem] border border-white/[0.06] bg-surface-1/60 p-5 sm:p-6">
        <Eyebrow as="h2"><span id="strip-title">Comparativa de periodos · {formatUSD(usd)}</span></Eyebrow>
        <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {rows.map((r) => (
            <li key={r.period.key} className="rounded-2xl bg-white/[0.025] p-4 ring-1 ring-inset ring-white/[0.05]">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Hace {r.period.label}</span>
                <Delta value={r.changePct} size="xs" pill={false} />
              </div>
              <p className="mt-2 text-xl font-semibold tabular-nums">{formatUSD(r.value)}</p>
              <div className="mt-3 h-1 rounded-full bg-white/[0.05]">
                <motion.div className={cn("h-full rounded-full", r.changePct >= 0 ? "bg-gain/70" : "bg-loss/70")}
                  initial={{ width: 0 }} animate={{ width: `${(Math.abs(r.changePct) / maxAbs) * 100}%` }} transition={{ duration: 0.8, ease: EASE }} />
              </div>
            </li>
          ))}
        </ul>
      </section>
    </Reveal>
  );
}
