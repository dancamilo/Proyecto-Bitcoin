import { useState } from "react";
import { FlaskConical, History } from "lucide-react";
import Surface from "@/components/ui-kit/Surface";
import Eyebrow from "@/components/ui-kit/Eyebrow";
import Field from "@/components/ui-kit/Field";
import Segmented from "@/components/ui-kit/Segmented";
import Tag from "@/components/ui-kit/Tag";
import Disclaimer from "@/components/ui-kit/Disclaimer";
import ScenarioResult from "@/components/analysis/ScenarioResult";
import { getHistoricalPeriodDefs } from "@/services/dataService";
import { useMarketPrice, useMarketHistory, useSeriesRange } from "@/hooks/useMarketData";
import { useFeeSettings } from "@/hooks/useFeeSettings";
import { computeHistoricalScenario } from "@/services/calculations";

const defaultCustomDate = () => new Date(Date.now() - 180 * 86400000).toISOString().slice(0, 10);
const todayISO = () => new Date().toISOString().slice(0, 10);

export default function HistoricalSimulator({ amount, onAmount }) {
  const periods = getHistoricalPeriodDefs();
  const [periodKey, setPeriodKey] = useState("30D");
  const [customDate, setCustomDate] = useState(defaultCustomDate);
  const period = periods.find((p) => p.key === periodKey);
  const value = parseFloat(amount);
  const invalid = amount.trim() === "" || Number.isNaN(value) || value <= 0;

  const market = useMarketPrice();
  const { activePlan } = useFeeSettings();
  // Para el rango fijo pedimos siempre una clave válida (aunque estemos en
  // modo "custom") para reutilizar la caché ya usada en Mercado/ScenarioStrip.
  const fixedHistory = useMarketHistory(periodKey === "custom" ? "1Y" : periodKey);
  const rangeHistory = useSeriesRange(periodKey === "custom" ? customDate : null);

  const series = periodKey === "custom" ? rangeHistory.data : fixedHistory.data;
  const isLoading = periodKey === "custom" ? rangeHistory.isLoading : fixedHistory.isLoading;
  const isError = periodKey === "custom" ? rangeHistory.isError : fixedHistory.isError;

  const scenario =
    !invalid && series?.length && market.data?.price
      ? { ...computeHistoricalScenario({ usd: value, series, currentPrice: market.data.price, plan: activePlan }), period }
      : null;

  const status = invalid ? "invalid" : isLoading || market.isLoading ? "calculating" : isError || market.isError || !scenario ? "error" : "result";

  return (
    <Surface aria-labelledby="hist-title">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Eyebrow icon={History}>Simulador histórico</Eyebrow>
        <Tag tone="info" icon={FlaskConical}>Escenario histórico hipotético</Tag>
      </div>
      <h2 id="hist-title" className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">¿Qué habría pasado?</h2>
      <div className="mt-6 grid gap-6 lg:grid-cols-5">
        <div className="min-w-0 space-y-5 lg:col-span-2">
          <Field id="hist-amount" label="Si hubieras invertido" prefix="$" inputMode="decimal" value={amount} placeholder="0.00"
            onChange={(e) => onAmount(e.target.value.replace(/[^0-9.]/g, ""))}
            error={invalid ? "Introduce un monto mayor que $0" : undefined} inputClassName="text-lg font-medium" />
          <div className="space-y-2">
            <p className="text-xs font-medium text-muted-foreground" id="hist-period">Hace</p>
            <Segmented options={periods.map((p) => ({ value: p.key, label: p.label }))} value={periodKey} onChange={setPeriodKey} label="Periodo" fill />
          </div>
          {periodKey === "custom" && (
            <Field id="hist-date" label="Fecha personalizada" type="date" value={customDate} max={todayISO()} onChange={(e) => setCustomDate(e.target.value)}
              hint="Limitado a ~1 año atrás por la fuente de datos gratuita." />
          )}
          <Disclaimer>Cálculo basado en precios históricos reales. No es una predicción ni garantiza resultados futuros.</Disclaimer>
        </div>
        <div className="min-w-0 lg:col-span-3"><ScenarioResult status={status} scenario={scenario} /></div>
      </div>
    </Surface>
  );
}
