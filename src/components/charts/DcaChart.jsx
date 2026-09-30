import { useReducedMotion } from "framer-motion";
import { Area, CartesianGrid, ComposedChart, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import ChartTooltip from "@/components/charts/ChartTooltip";
import { CHART } from "@/charts/theme";
import { formatAxisDate, formatUSDCompact } from "@/utils/format";

// Evolución DCA: valor hipotético (área) vs total invertido (escalonado).
export default function DcaChart({ data, months }) {
  const reduce = useReducedMotion();
  const tick = { fill: CHART.muted, fontSize: 11 };
  const range = months >= 12 ? "1Y" : "30D";
  return (
    <ResponsiveContainer width="100%" height="100%">
      <ComposedChart data={data} margin={{ top: 12, right: 0, bottom: 0, left: 0 }}>
        <defs>
          <linearGradient id="dca-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={CHART.btc} stopOpacity={0.26} />
            <stop offset="100%" stopColor={CHART.btc} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} stroke={CHART.grid} />
        <XAxis dataKey="date" tickFormatter={(v) => formatAxisDate(v, range)} axisLine={false} tickLine={false} tick={tick} minTickGap={44} tickMargin={10} />
        <YAxis orientation="right" tickFormatter={formatUSDCompact} axisLine={false} tickLine={false} tick={tick} width={56} tickCount={5} />
        <Tooltip content={<ChartTooltip />} cursor={{ stroke: CHART.cursor, strokeDasharray: "3 3" }} />
        <Area type="monotone" dataKey="value" name="Valor hipotético" stroke={CHART.btc} strokeWidth={2} fill="url(#dca-fill)" dot={false}
          activeDot={{ r: 5, fill: CHART.btc, stroke: CHART.bg, strokeWidth: 3 }} isAnimationActive={!reduce} animationDuration={900} />
        <Line type="stepAfter" dataKey="invested" name="Total invertido" stroke={CHART.muted} strokeWidth={1.5} strokeDasharray="4 4" dot={false}
          activeDot={{ r: 4, fill: CHART.muted, stroke: CHART.bg, strokeWidth: 2 }} isAnimationActive={!reduce} animationDuration={900} />
      </ComposedChart>
    </ResponsiveContainer>
  );
}