import { Play } from "lucide-react";
import Field from "@/components/ui-kit/Field";
import Segmented from "@/components/ui-kit/Segmented";
import ActionButton from "@/components/ui-kit/ActionButton";
import Disclaimer from "@/components/ui-kit/Disclaimer";
import { getDcaOptions } from "@/services/dataService";

export default function DcaControls({ params, setParams, error, calculating, onSimulate }) {
  const { frequencies, periods } = getDcaOptions();
  return (
    <form onSubmit={(e) => { e.preventDefault(); onSimulate(); }} noValidate className="space-y-5">
      <Field id="dca-amount" label="Monto periódico" prefix="$" inputMode="decimal" placeholder="0.00" value={params.amount}
        onChange={(e) => setParams({ ...params, amount: e.target.value.replace(/[^0-9.]/g, "") })} error={error} inputClassName="text-lg font-medium" />
      <div className="space-y-2">
        <p className="text-xs font-medium text-muted-foreground">Frecuencia</p>
        <Segmented options={frequencies} value={params.frequency} onChange={(frequency) => setParams({ ...params, frequency })} label="Frecuencia" fill />
      </div>
      <div className="space-y-2">
        <p className="text-xs font-medium text-muted-foreground">Periodo</p>
        <Segmented options={periods} value={params.months} onChange={(months) => setParams({ ...params, months })} label="Periodo" fill />
      </div>
      <ActionButton type="submit" size="lg" icon={Play} loading={calculating} className="w-full">
        {calculating ? "Calculando…" : "Simular"}
      </ActionButton>
      <Disclaimer>Simulación hipotética con precios históricos. No representa resultados futuros.</Disclaimer>
    </form>
  );
}