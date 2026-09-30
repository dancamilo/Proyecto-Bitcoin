import { useState } from "react";
import { Check, Info, Receipt } from "lucide-react";
import Surface from "@/components/ui-kit/Surface";
import Eyebrow from "@/components/ui-kit/Eyebrow";
import Field from "@/components/ui-kit/Field";
import ActionButton from "@/components/ui-kit/ActionButton";
import PlanOption from "@/components/settings/PlanOption";
import { useFeeSettings } from "@/hooks/useFeeSettings";
import { formatUSD } from "@/utils/format";

export default function FeeSettings() {
  const { plans, activePlan, update } = useFeeSettings();
  const [planId, setPlanId] = useState(activePlan.id);
  const [rate, setRate] = useState(String(activePlan.rate));
  const [min, setMin] = useState(String(activePlan.min));
  const [save, setSave] = useState("idle");
  const custom = planId === "custom";
  const r = parseFloat(rate);
  const rateError = Number.isNaN(r) || r < 0 || r > 5 ? "Introduce un porcentaje entre 0 y 5" : undefined;
  const exampleFee = Math.max((20 * (r || 0)) / 100, parseFloat(min) || 0);

  const select = (id) => {
    const p = plans.find((x) => x.id === id);
    setPlanId(id); setRate(String(p.rate)); setMin(String(p.min)); setSave("idle");
  };

  const onSave = () => {
    setSave("saving");
    update({ activePlanId: planId, customRate: parseFloat(rate) || 0, customMin: parseFloat(min) || 0, customMode: "deduct" });
    setSave("saved");
  };

  return (
    <Surface aria-labelledby="fees-title">
      <Eyebrow icon={Receipt}>Configuración</Eyebrow>
      <h2 id="fees-title" className="mt-3 text-xl font-semibold tracking-tight sm:text-2xl">Comisiones</h2>
      <div role="radiogroup" aria-label="Plan de comisiones" className="mt-6 grid gap-3 sm:grid-cols-3">
        {plans.map((p) => <PlanOption key={p.id} plan={p} selected={p.id === planId} onSelect={select} />)}
      </div>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <Field id="fee-rate" label="Comisión" suffix={<span className="text-muted-foreground">%</span>} inputMode="decimal" value={rate} disabled={!custom}
          onChange={(e) => { setRate(e.target.value.replace(/[^0-9.]/g, "")); setSave("idle"); }} error={custom ? rateError : undefined} />
        <Field id="fee-min" label="Mínimo por operación" prefix="$" inputMode="decimal" value={min} disabled={!custom}
          onChange={(e) => { setMin(e.target.value.replace(/[^0-9.]/g, "")); setSave("idle"); }} />
      </div>
      <div className="mt-6 flex gap-3 rounded-2xl bg-info/[0.06] p-4 ring-1 ring-inset ring-info/15">
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-info" aria-hidden />
        <div className="text-sm">
          <p className="text-foreground/90">La comisión utilizada en los cálculos depende de la configuración seleccionada — se aplica a toda compra o venta que registres.</p>
          <p className="mt-2 font-mono text-xs text-muted-foreground">Ejemplo: $20.00 × {(r || 0).toFixed(2)}% → {formatUSD(exampleFee)} (mín. {formatUSD(parseFloat(min) || 0)})</p>
        </div>
      </div>
      <div className="mt-6 flex items-center justify-end gap-3">
        {save === "saved" && <span className="flex items-center gap-1.5 text-sm text-gain" role="status"><Check className="h-4 w-4" aria-hidden />Guardado</span>}
        <ActionButton onClick={onSave} loading={save === "saving"} disabled={custom && !!rateError}>Guardar cambios</ActionButton>
      </div>
    </Surface>
  );
}
