import { useId, useMemo } from "react";
import { motion } from "framer-motion";
import { toPoints, smoothPath } from "@/utils/chart";
import { CHART, EASE } from "@/charts/theme";

export default function Sparkline({ data, positive = true, color, className, strokeWidth = 1.6, fill = true }) {
  const gid = useId().replace(/:/g, "");
  const W = 200;
  const H = 60;
  const d = useMemo(() => smoothPath(toPoints(data, W, H, 4)), [data]);
  const stroke = color ?? (positive ? CHART.gain : CHART.loss);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className={className} aria-hidden>
      <defs>
        <linearGradient id={gid} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={stroke} stopOpacity="0.22" />
          <stop offset="100%" stopColor={stroke} stopOpacity="0" />
        </linearGradient>
      </defs>
      {fill && <path d={`${d} L${W},${H} L0,${H} Z`} fill={`url(#${gid})`} />}
      <motion.path
        d={d}
        fill="none"
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.1, ease: EASE }}
      />
    </svg>
  );
}