import Delta from "@/components/ui-kit/Delta";
import AnimatedNumber from "@/components/ui-kit/AnimatedNumber";
import { formatBTC, formatUSD } from "@/utils/format";

export default function DcaResults({ result: r }) {
  const stats = [
    { label: "Total invertido", value: formatUSD(r.invested), sub: `${r.purchases} compras` },
    { label: "BTC acumulado", value: formatBTC(r.btc), sub: "BTC" },
    { label: "Precio promedio", value: formatUSD(r.avgPrice), sub: "por BTC" },
  ];
  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm text-muted-foreground">Valor actual hipotético</p>
          <p className="text-figure-lg mt-1.5 font-semibold"><AnimatedNumber value={r.value} format={formatUSD} /></p>
        </div>
        <div className="text-right">
          <p className="text-xs text-muted-foreground">Rendimiento</p>
          <Delta value={r.changePct} size="md" className="mt-1" />
        </div>
      </div>
      <dl className="mt-6 grid grid-cols-1 gap-3 min-[420px]:grid-cols-3">
        {stats.map((s) => (
          <div key={s.label} className="min-w-0 rounded-2xl bg-white/[0.025] px-4 py-3 ring-1 ring-inset ring-white/[0.05]">
            <dt className="text-xs text-muted-foreground">{s.label}</dt>
            <dd className="mt-1 truncate text-base font-semibold tabular-nums">{s.value}</dd>
            <dd className="text-[11px] text-muted-foreground">{s.sub}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}