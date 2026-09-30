import Reveal from "@/components/ui-kit/Reveal";
import Eyebrow from "@/components/ui-kit/Eyebrow";
import MarketHero from "@/components/market/MarketHero";
import MarketRangeCard from "@/components/market/MarketRangeCard";
import AverageComparison from "@/components/market/AverageComparison";
import { LoadingState, ErrorState } from "@/components/states/presets";
import { useMarketPrice, useMarketHistory } from "@/hooks/useMarketData";
import { getMarketRangeDefs } from "@/services/dataService";

function useRangeStats(def, currentPrice) {
  const history = useMarketHistory(def.key);
  const prices = (history.data ?? []).map((p) => p.price);
  const openPrice = prices[0] ?? currentPrice;
  const changePct = openPrice ? (currentPrice / openPrice - 1) * 100 : 0;
  return { ...def, changePct, openPrice, high: prices.length ? Math.max(...prices) : currentPrice, low: prices.length ? Math.min(...prices) : currentPrice, spark: prices };
}

export default function Market() {
  const marketQuery = useMarketPrice();
  const defs = getMarketRangeDefs(); // ["24H","7D","30D","90D","1Y"], orden fijo
  // Los hooks se llaman sin condición (regla de hooks): siempre son los mismos 5 rangos.
  const ranges = [
    useRangeStats(defs[0], marketQuery.data?.price),
    useRangeStats(defs[1], marketQuery.data?.price),
    useRangeStats(defs[2], marketQuery.data?.price),
    useRangeStats(defs[3], marketQuery.data?.price),
    useRangeStats(defs[4], marketQuery.data?.price),
  ];

  if (marketQuery.isLoading) {
    return <div className="flex min-h-[50vh] items-center justify-center"><LoadingState /></div>;
  }
  if (marketQuery.isError) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <ErrorState title="No se pudo cargar el mercado" description="Comprueba tu conexión e inténtalo de nuevo." onRetry={() => marketQuery.refetch()} />
      </div>
    );
  }

  const market = marketQuery.data;
  return (
    <>
      <MarketHero market={market} />
      <section aria-labelledby="ranges-title" className="mb-4">
        <Eyebrow as="h2" className="mb-4"><span id="ranges-title">Variación por periodo</span></Eyebrow>
        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-5">
          {ranges.map((r, i) => (
            <Reveal key={r.key} delay={0.05 + i * 0.05} className={i === 0 ? "col-span-2 md:col-span-1" : "col-span-2 min-[400px]:col-span-1"}>
              <MarketRangeCard range={r} current={market.price} />
            </Reveal>
          ))}
        </div>
      </section>
      <Reveal delay={0.3}><AverageComparison price={market.price} /></Reveal>
    </>
  );
}
