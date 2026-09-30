import { useState } from "react";
import { Sigma } from "lucide-react";
import Surface from "@/components/ui-kit/Surface";
import Eyebrow from "@/components/ui-kit/Eyebrow";
import Segmented from "@/components/ui-kit/Segmented";
import Tag from "@/components/ui-kit/Tag";
import ChartContainer from "@/components/charts/ChartContainer";
import PriceChart from "@/components/charts/PriceChart";
import AverageTrack from "@/components/market/AverageTrack";
import { getPriceAverageDefs } from "@/services/dataService";
import { useDailyHistory } from "@/hooks/useMarketData";
import { formatPct } from "@/utils/format";

export default function AverageComparison({ price }) {
  const averages = getPriceAverageDefs();
  const [days, setDays] = useState(30);
  const def = averages.find((a) => a.days === days) ?? averages[0];
  const history = useDailyHistory(days);
  const series = history.data ?? [];
  const avgValue = series.length ? series.reduce((sum, p) => sum + p.price, 0) / series.length : price;
  const diff = avgValue ? (price / avgValue - 1) * 100 : 0;
  const status = history.isLoading ? "loading" : history.isError ? "error" : series.length === 0 ? "empty" : "ready";

  return (
    <Surface aria-labelledby="avg-title">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="max-w-xl">
          <Eyebrow icon={Sigma}>Comparativa</Eyebrow>
          <h2 id="avg-title" className="mt-3 text-xl font-semibold tracking-tight sm:text-2xl">Precio actual vs. promedio</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            El precio actual está un <span className="font-medium text-foreground tabular-nums">{formatPct(Math.abs(diff)).slice(1)}</span>{" "}
            {diff >= 0 ? "por encima" : "por debajo"} del promedio de los últimos {def.label}.
          </p>
        </div>
        <div className="flex flex-col items-start gap-3 md:items-end">
          <Tag>Informativo</Tag>
          <Segmented options={averages.map((a) => ({ value: a.days, label: a.label }))} value={days} onChange={setDays} label="Periodo del promedio" size="sm" />
        </div>
      </div>
      <div className="mt-8 px-6 sm:px-10"><AverageTrack price={price} average={avgValue} label={def.label} /></div>
      <ChartContainer status={status} onRetry={() => history.refetch()} className="mt-2">
        <PriceChart data={series} dataKey="price" range={`${days}D`} reference={{ value: avgValue, label: `Promedio ${def.label}` }} />
      </ChartContainer>
    </Surface>
  );
}
