import { AnimatePresence, motion } from "framer-motion";
import { Calculator, PenLine } from "lucide-react";
import LineItem from "@/components/ui-kit/LineItem";
import AnimatedNumber from "@/components/ui-kit/AnimatedNumber";
import StateBlock from "@/components/states/StateBlock";
import { LoadingState } from "@/components/states/presets";
import { formatBTC, formatSats, formatUSD } from "@/utils/format";

// Panel de resultado con estados: idle · calculating · error · loading · result.
export default function BuyResult({ status, result }) {
  return (
    <div className="surface-inset relative min-h-[212px] rounded-2xl px-4" aria-live="polite">
      <AnimatePresence mode="wait" initial={false}>
        <motion.div key={status} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.2 }}>
          {status === "idle" && <StateBlock compact icon={PenLine} title="Introduce un monto" description="Verás cuánto BTC obtendrías aproximadamente." />}
          {status === "loading" && <LoadingState compact />}
          {status === "error" && <StateBlock compact icon={Calculator} tone="neutral" title="Sin estimación" description="Corrige el monto para calcular." />}
          {status === "calculating" && (
            <div className="space-y-4 py-5" role="status" aria-label="Calculando estimación">
              <div className="skeleton h-3 w-24" />
              <div className="skeleton h-9 w-3/4" />
              <div className="skeleton h-3 w-20" />
              <div className="space-y-3 pt-2"><div className="skeleton h-3 w-full" /><div className="skeleton h-3 w-full" /></div>
            </div>
          )}
          {status === "result" && result && (
            <div className="py-4">
              <p className="text-sm text-muted-foreground">BTC estimado</p>
              <p className="mt-1.5 flex flex-wrap items-baseline gap-x-2 text-[clamp(1.6rem,1.2rem+1.6vw,2.25rem)] font-semibold leading-none tracking-tight">
                <AnimatedNumber value={result.btc} format={(v) => formatBTC(v)} />
                <span className="text-base font-medium text-muted-foreground">BTC</span>
              </p>
              <p className="mt-1.5 font-mono text-xs text-btc">≈ {formatSats(result.btc)} sats</p>
              <dl className="mt-3 divide-y divide-white/[0.05] border-t border-white/[0.05]">
                <LineItem label="Comisión" value={formatUSD(result.fee)} />
                <LineItem label="Precio BTC" value={formatUSD(result.price)} />
              </dl>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}