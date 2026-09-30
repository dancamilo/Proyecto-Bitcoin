import { useEffect, useState } from "react";
import { ArrowDownToLine, Plus } from "lucide-react";
import Surface from "@/components/ui-kit/Surface";
import Eyebrow from "@/components/ui-kit/Eyebrow";
import Field from "@/components/ui-kit/Field";
import ActionButton from "@/components/ui-kit/ActionButton";
import Disclaimer from "@/components/ui-kit/Disclaimer";
import BuyResult from "@/components/dashboard/BuyResult";
import { cn } from "@/lib/utils";
import { calculateBuy } from "@/services/calculations";
import { useFeeSettings } from "@/hooks/useFeeSettings";

const QUICK = [10, 20, 50, 100];

function validate(raw) {
  if (raw.trim() === "") return { state: "idle" };
  const value = parseFloat(raw);
  if (Number.isNaN(value) || value < 1) return { state: "error", error: "Introduce un monto de al menos $1.00" };
  if (value > 100000) return { state: "error", error: "El monto máximo para la estimación es $100,000" };
  return { state: "ok", value };
}

export default function BuySimulator({ market, onRegister, className }) {
  const [raw, setRaw] = useState("20.00");
  const [status, setStatus] = useState("idle");
  const [result, setResult] = useState(null);
  const { activePlan } = useFeeSettings();
  const check = validate(raw);

  useEffect(() => {
    if (!market?.price) return setStatus("loading");
    if (check.state !== "ok") return setStatus(check.state);
    setStatus("calculating");
    const t = setTimeout(() => {
      setResult(calculateBuy({ usdInput: check.value, pricePerBtcUsd: market.price, plan: activePlan }));
      setStatus("result");
    }, 300);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [raw, market?.price, activePlan.rate, activePlan.min, activePlan.mode]);

  return (
    <Surface aria-labelledby="buy-title" className={cn("flex flex-col", className)}>
      <Eyebrow icon={ArrowDownToLine}>Si compras hoy</Eyebrow>
      <h2 id="buy-title" className="mt-3 text-xl font-semibold tracking-tight">¿Cuánto BTC obtendrías?</h2>
      <div className="mt-6 grid gap-5 md:grid-cols-2">
        <div className="space-y-4">
          <Field
            id="buy-amount" label="Monto a invertir" prefix="$" suffix={<span className="font-mono text-xs text-muted-foreground">USD</span>}
            inputMode="decimal" autoComplete="off" value={raw} error={check.error} placeholder="0.00"
            onChange={(e) => setRaw(e.target.value.replace(/[^0-9.]/g, ""))}
            inputClassName="text-lg font-medium"
          />
          <div className="flex flex-wrap gap-2" aria-label="Montos rápidos">
            {QUICK.map((v) => (
              <button key={v} type="button" onClick={() => setRaw(v.toFixed(2))}
                className={cn("h-10 rounded-full px-4 text-sm font-medium tabular-nums ring-1 ring-inset transition-colors",
                  parseFloat(raw) === v ? "bg-btc/15 text-btc ring-btc/30" : "text-muted-foreground ring-white/[0.08] hover:bg-white/[0.05] hover:text-foreground")}>
                ${v}
              </button>
            ))}
          </div>
          <ActionButton variant="secondary" icon={Plus} onClick={onRegister} disabled={status !== "result"} className="w-full">Registrar compra</ActionButton>
        </div>
        <BuyResult status={status} result={result} />
      </div>
      <Disclaimer className="mt-5">Estimación aproximada. El precio y la comisión finales pueden variar al ejecutar la operación.</Disclaimer>
    </Surface>
  );
}
