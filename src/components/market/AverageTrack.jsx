import { motion } from "framer-motion";
import { EASE } from "@/charts/theme";
import { formatUSDCompact } from "@/utils/format";

// Visualiza la distancia entre el precio actual y el promedio seleccionado.
export default function AverageTrack({ price, average, label }) {
  const lo = Math.min(price, average) * 0.97;
  const hi = Math.max(price, average) * 1.03;
  const pos = (v) => ((v - lo) / (hi - lo)) * 100;
  const a = pos(average);
  const p = pos(price);
  const markers = [
    { x: a, title: `Promedio ${label}`, value: average, dot: "border-2 border-foreground/60 bg-background", text: "text-muted-foreground" },
    { x: p, title: "Actual", value: price, dot: "bg-btc shadow-[0_0_14px_3px_hsl(var(--btc)/0.45)]", text: "text-btc" },
  ];
  return (
    <div className="relative pb-12 pt-2" role="img" aria-label={`Precio actual ${formatUSDCompact(price)} frente a promedio de ${label} ${formatUSDCompact(average)}`}>
      <div className="relative h-1.5 rounded-full bg-white/[0.06]">
        <motion.div
          className="absolute inset-y-0 rounded-full bg-btc/40"
          initial={false}
          animate={{ left: `${Math.min(a, p)}%`, width: `${Math.abs(p - a)}%` }}
          transition={{ duration: 0.7, ease: EASE }}
        />
        {markers.map((m) => (
          <motion.div key={m.title.slice(0, 3)} className="absolute top-1/2" initial={false} animate={{ left: `${m.x}%` }} transition={{ duration: 0.7, ease: EASE }}>
            <span className={`absolute left-0 top-0 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full ${m.dot}`} />
            <span className={`absolute left-0 top-4 -translate-x-1/2 whitespace-nowrap text-center text-[11px] ${m.text}`}>
              <span className="block font-mono uppercase tracking-[0.1em]">{m.title}</span>
              <span className="block tabular-nums text-foreground/85">{formatUSDCompact(m.value)}</span>
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}