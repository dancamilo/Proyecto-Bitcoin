import { motion } from "framer-motion";
import { formatUSDCompact } from "@/utils/format";
import { EASE } from "@/charts/theme";

// Posición del precio actual dentro del rango mínimo–máximo.
export default function RangeBar({ low, high, current, format = formatUSDCompact }) {
  const pos = Math.min(100, Math.max(0, ((current - low) / (high - low || 1)) * 100));
  return (
    <div>
      <div
        className="relative h-1.5 rounded-full bg-white/[0.06]"
        role="img"
        aria-label={`Precio actual en el ${pos.toFixed(0)}% del rango entre ${format(low)} y ${format(high)}`}
      >
        <motion.div
          className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-white/10 to-white/40"
          initial={{ width: 0 }}
          animate={{ width: `${pos}%` }}
          transition={{ duration: 0.9, ease: EASE }}
        />
        <motion.span
          className="absolute top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-background bg-foreground"
          initial={{ left: "0%" }}
          animate={{ left: `${pos}%` }}
          transition={{ duration: 0.9, ease: EASE }}
        />
      </div>
      <div className="mt-2.5 flex justify-between gap-2 text-xs tabular-nums">
        <span className="text-muted-foreground">Mín <span className="text-foreground/85">{format(low)}</span></span>
        <span className="text-muted-foreground">Máx <span className="text-foreground/85">{format(high)}</span></span>
      </div>
    </div>
  );
}