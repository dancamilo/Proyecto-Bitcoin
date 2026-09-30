import Reveal from "@/components/ui-kit/Reveal";
import { formatUSD } from "@/utils/format";

export default function TransactionSummary({ transactions }) {
  const buys = transactions.filter((t) => t.type === "buy");
  const sells = transactions.filter((t) => t.type === "sell");
  const sum = (arr, k) => arr.reduce((acc, t) => acc + t[k], 0);
  const items = [
    { label: "Compras", value: formatUSD(sum(buys, "usd")), sub: `${buys.length} operaciones` },
    { label: "Ventas", value: formatUSD(sum(sells, "usd")), sub: `${sells.length} operaciones` },
    { label: "Comisiones", value: formatUSD(sum(transactions, "fee")), sub: "Total pagado" },
  ];
  return (
    <Reveal className="mb-4 grid grid-cols-3 divide-x divide-white/[0.06] rounded-[1.5rem] border border-white/[0.06] bg-surface-1/60">
      {items.map((i) => (
        <div key={i.label} className="min-w-0 px-3 py-4 sm:px-6 sm:py-5">
          <p className="font-mono text-[10.5px] uppercase tracking-[0.12em] text-muted-foreground">{i.label}</p>
          <p className="mt-1.5 truncate text-lg font-semibold tabular-nums sm:text-2xl">{i.value}</p>
          <p className="mt-0.5 hidden text-xs text-muted-foreground sm:block">{i.sub}</p>
        </div>
      ))}
    </Reveal>
  );
}