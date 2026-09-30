import { useId, useMemo } from "react";
import { cn } from "@/lib/utils";
import { toPoints, smoothPath } from "@/utils/chart";
import { CHART } from "@/charts/theme";

// Elemento de identidad: línea de mercado con un pulso luminoso que la recorre.
const W = 1000;

export default function BitcoinPulse({ data, height = 80, className }) {
  const gid = useId().replace(/:/g, "");
  const { d, endY } = useMemo(() => {
    const pts = toPoints(data, W, height, 10);
    return { d: smoothPath(pts), endY: pts[pts.length - 1][1] };
  }, [data, height]);

  return (
    <div className={cn("relative", className)} style={{ height }} aria-hidden>
      <svg viewBox={`0 0 ${W} ${height}`} preserveAspectRatio="none" className="absolute inset-0 h-full w-full overflow-visible">
        <defs>
          <linearGradient id={`${gid}l`} x1="0" x2="1" y1="0" y2="0">
            <stop offset="0" stopColor={CHART.btc} stopOpacity="0" />
            <stop offset="0.55" stopColor={CHART.btc} stopOpacity="0.3" />
            <stop offset="1" stopColor={CHART.btc} stopOpacity="0.9" />
          </linearGradient>
          <linearGradient id={`${gid}f`} x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor={CHART.btc} stopOpacity="0.09" />
            <stop offset="1" stopColor={CHART.btc} stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={`${d} L${W},${height} L0,${height} Z`} fill={`url(#${gid}f)`} />
        <path d={d} fill="none" stroke={`url(#${gid}l)`} strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
        <path d={d} pathLength="1000" fill="none" stroke={CHART.btc} strokeWidth="2.2" strokeLinecap="round" strokeDasharray="70 930" className="pulse-travel" />
      </svg>
      <span className="absolute right-0 grid h-3 w-3 -translate-y-1/2 place-items-center" style={{ top: endY }}>
        <span className="ping-soft absolute h-3 w-3 rounded-full bg-btc/50" />
        <span className="relative h-2.5 w-2.5 rounded-full bg-btc shadow-[0_0_18px_4px_hsl(var(--btc)/0.5)]" />
      </span>
    </div>
  );
}