import { useState } from "react";
import { Activity } from "lucide-react";
import Surface from "@/components/ui-kit/Surface";
import Eyebrow from "@/components/ui-kit/Eyebrow";
import Segmented from "@/components/ui-kit/Segmented";
import Delta from "@/components/ui-kit/Delta";
import ChartContainer from "@/components/charts/ChartContainer";
import PriceChart from "@/components/charts/PriceChart";
import { cn } from "@/lib/utils";
import { CHART } from "@/charts/theme";
import { useMarketHistory } from "@/hooks/useMarketData";
import { formatUSD } from "@/utils/format";

const RANGES = ["7D", "30D", "90D", "1Y"];
const METRICS = [{ value: "portfolio", label: "Portfolio" }, { value: "price", label: "Precio BTC" }];

// "Portfolio" valora tu tenencia ACTUAL de BTC a los precios históricos de
// cada día — muestra cómo se habría movido el valor de lo que tienes hoy,
// no un histórico día a día de operaciones (esta app no guarda snapshots
// diarios de la cartera, solo las operaciones — ver README, sección
// "Limitaciones").
export default function PerformanceCard({ portfolio, className }) {
  const [range, setRange] = useState("30D");
  const [metric, setMetric] = useState("portfolio");
  const history = useMarketHistory(range);

  const raw = history.data ?? [];
  const data = raw.map((p) => ({ date: p.date, price: p.price, portfolio: p.price * (portfolio?.btcHeld ?? 0) }));
  const first = data[0]?.[metric] ?? 0;
  const last = data[data.length - 1]?.[metric] ?? 0;
  const change = first ? (last / first - 1) * 100 : 0;
  const isPortfolio = metric === "portfolio";
  const color = isPortfolio ? (change >= 0 ? CHART.gain : CHART.loss) : CHART.btc;
  const status = history.isLoading ? "loading" : history.isError ? "error" : data.length === 0 ? "empty" : "ready";

  return (
    <Surface aria-labelledby="perf-title" className={cn("flex flex-col", className)}>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <Eyebrow icon={Activity} as="h2"><span id="perf-title">Rendimiento</span></Eyebrow>
          <div className="mt-3 flex flex-wrap items-baseline gap-3">
            <p className="text-figure-md font-semibold">{formatUSD(last)}</p>
            <Delta value={change} size="xs" />
            <span className="text-xs text-muted-foreground">en {range}</span>
          </div>
        </div>
        <Segmented options={METRICS} value={metric} onChange={setMetric} label="Métrica del gráfico" size="sm" />
      </div>
      <ChartContainer status={status} onRetry={() => history.refetch()} className="mt-6 flex-1">
        <PriceChart
          data={data}
          dataKey={metric}
          name={isPortfolio ? "Portfolio" : "Precio BTC"}
          color={color}
          range={range}
          axisFormat={isPortfolio ? formatUSD : undefined}
          reference={isPortfolio ? { value: portfolio?.totalInvested ?? 0, label: "Invertido" } : undefined}
        />
      </ChartContainer>
      <Segmented options={RANGES} value={range} onChange={setRange} label="Rango temporal" size="sm" className="mt-5 self-start" />
    </Surface>
  );
}
