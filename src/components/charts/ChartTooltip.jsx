import { formatDate, formatUSD } from "@/utils/format";

export default function ChartTooltip({ active, payload, label, valueFormat = formatUSD, withTime = false }) {
  if (!active || !payload?.length) return null;
  const opts = withTime
    ? { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }
    : { day: "numeric", month: "short", year: "numeric" };
  return (
    <div className="min-w-[160px] rounded-2xl border border-white/10 bg-[#131316]/95 px-3.5 py-3 shadow-2xl shadow-black/60 backdrop-blur-md">
      <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">{formatDate(label, opts)}</p>
      {payload.map((p) => (
        <div key={p.dataKey} className="mt-2 flex items-center gap-2">
          <span className="h-2 w-2 rounded-full" style={{ background: p.color }} />
          <span className="text-xs text-muted-foreground">{p.name}</span>
          <span className="ml-auto pl-4 text-sm font-semibold tabular-nums text-foreground">{valueFormat(p.value)}</span>
        </div>
      ))}
    </div>
  );
}