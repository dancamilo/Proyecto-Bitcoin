import { AnimatePresence, motion } from "framer-motion";
import Delta from "@/components/ui-kit/Delta";
import LineItem from "@/components/ui-kit/LineItem";
import AnimatedNumber from "@/components/ui-kit/AnimatedNumber";
import ChartContainer from "@/components/charts/ChartContainer";
import PriceChart from "@/components/charts/PriceChart";
import { CalculatingState } from "@/components/states/presets";
import StateBlock from "@/components/states/StateBlock";
import { Calculator } from "lucide-react";
import { formatBTC, formatUSD } from "@/utils/format";

export default function ScenarioResult({ status, scenario: s }) {
  return (
    <div className="surface-inset rounded-[1.5rem] p-5 sm:p-6" aria-live="polite">
      <AnimatePresence mode="wait" initial={false}>
        <motion.div key={status} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
          {status === "calculating" && <CalculatingState />}
          {(status === "error" || status === "invalid") && (
            <StateBlock icon={Calculator} title="Sin escenario" description={status === "invalid" ? "Introduce un monto válido para ver el resultado hipotético." : "No se pudo obtener el precio histórico para ese periodo."} />
          )}
          {status === "result" && (
            <>
              <p className="text-sm text-muted-foreground">
                Si hubieras invertido <span className="font-medium text-foreground tabular-nums">{formatUSD(s.usd)}</span> {s.period.phrase}
              </p>
              <p className="mt-4 text-xs text-muted-foreground">Resultado hipotético</p>
              <div className="mt-1 flex flex-wrap items-end gap-x-4 gap-y-2">
                <p className="text-figure-lg font-semibold"><AnimatedNumber value={s.value} format={formatUSD} /></p>
                <Delta value={s.changePct} size="md" className="mb-1" />
              </div>
              <dl className="mt-5 grid gap-x-8 border-t border-white/[0.05] sm:grid-cols-3">
                <LineItem label="Precio entonces" value={formatUSD(s.startPrice)} className="sm:block sm:space-y-1" />
                <LineItem label="Precio actual" value={formatUSD(s.endPrice)} className="sm:block sm:space-y-1" />
                <LineItem label="BTC obtenido" value={formatBTC(s.btc)} className="sm:block sm:space-y-1" />
              </dl>
              <ChartContainer className="mt-4 h-[180px] sm:h-[220px]">
                <PriceChart data={s.series} range={s.period.key} showYAxis={false} reference={{ value: s.startPrice, label: "Precio de entrada" }} />
              </ChartContainer>
            </>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}