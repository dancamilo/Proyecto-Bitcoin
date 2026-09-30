import { useState } from "react";
import { Repeat } from "lucide-react";
import PageHeader from "@/components/ui-kit/PageHeader";
import Reveal from "@/components/ui-kit/Reveal";
import Surface from "@/components/ui-kit/Surface";
import Eyebrow from "@/components/ui-kit/Eyebrow";
import Tag from "@/components/ui-kit/Tag";
import DcaControls from "@/components/dca/DcaControls";
import DcaResults from "@/components/dca/DcaResults";
import DcaChart from "@/components/charts/DcaChart";
import ChartContainer from "@/components/charts/ChartContainer";
import { CalculatingState } from "@/components/states/presets";
import { simulateDca } from "@/services/calculations";
import { useDailyHistory } from "@/hooks/useMarketData";
import { useFeeSettings } from "@/hooks/useFeeSettings";
import { getDcaOptions } from "@/services/dataService";

const INITIAL = { amount: "10", frequency: "weekly", months: 12 };

export default function Dca() {
  const [params, setParams] = useState(INITIAL);
  const { periods } = getDcaOptions();
  const days = periods.find((p) => p.value === params.months)?.days ?? 365;
  const history = useDailyHistory(days);
  const { activePlan } = useFeeSettings();

  const amount = parseFloat(params.amount);
  const error = params.amount !== "" && !(amount >= 1) ? "El monto mínimo es $1.00" : params.amount === "" ? "Introduce un monto" : undefined;

  const result = !error && history.data?.length
    ? simulateDca({ amount, frequency: params.frequency, dailySeries: history.data, plan: activePlan })
    : null;

  const status = history.isLoading ? "loading" : history.isError ? "error" : "ready";

  return (
    <>
      <PageHeader eyebrow="Estrategia" title="Simulador DCA" description="Visualiza cómo habría evolucionado una inversión periódica de monto fijo, con precios históricos reales." />
      <div className="grid gap-4 lg:grid-cols-12">
        <Reveal delay={0.05} className="min-w-0 lg:col-span-4">
          <Surface aria-labelledby="dca-params" className="h-full">
            <Eyebrow icon={Repeat}>Parámetros</Eyebrow>
            <h2 id="dca-params" className="mb-6 mt-3 text-xl font-semibold tracking-tight">Configura tu plan</h2>
            <DcaControls params={params} setParams={setParams} error={error} calculating={status === "loading"} onSimulate={() => history.refetch()} />
            {params.months === 24 && days < 730 && (
              <p className="mt-3 text-xs text-muted-foreground">La fuente de datos gratuita solo ofrece ~1 año de histórico: la simulación de 24 meses usa el año disponible.</p>
            )}
          </Surface>
        </Reveal>
        <Reveal delay={0.1} className="min-w-0 lg:col-span-8">
          <Surface aria-labelledby="dca-result" glow className="h-full">
            <div className="mb-5 flex items-center justify-between gap-3">
              <h2 id="dca-result" className="text-xl font-semibold tracking-tight">Resultado</h2>
              <Tag tone="info">Hipotético</Tag>
            </div>
            {status === "loading" ? (
              <CalculatingState />
            ) : result ? (
              <DcaResults result={result} />
            ) : (
              <p className="text-sm text-muted-foreground">Introduce un monto válido para simular.</p>
            )}
            <ChartContainer status={status} onRetry={() => history.refetch()} className="mt-6">
              {result && <DcaChart data={result.series} months={params.months} />}
            </ChartContainer>
          </Surface>
        </Reveal>
      </div>
    </>
  );
}
