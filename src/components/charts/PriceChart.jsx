import { useId } from "react";
import { useReducedMotion } from "framer-motion";
import { Area, AreaChart, CartesianGrid, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import ChartTooltip from "@/components/charts/ChartTooltip";
import { CHART } from "@/charts/theme";
import { formatAxisDate, formatUSD, formatUSDCompact } from "@/utils/format";

// Gráfico de área genérico. Recibe `data` [{ date, [dataKey]: number }] — desacoplado de la fuente.
export default function PriceChart({
  data, dataKey = "price", name = "Precio BTC", color = CHART.btc, range = "30D",
  valueFormat = formatUSD, axisFormat = formatUSDCompact, reference, showYAxis = true,
}) {
  const gid = useId().replace(/:/g, "");
  const reduce = useReducedMotion();
  const tick = { fill: CHART.muted, fontSize: 11 };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 12, right: 0, bottom: 0, left: 0 }}>
        <defs>
          <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.26} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} stroke={CHART.grid} />
        <XAxis dataKey="date" tickFormatter={(v) => formatAxisDate(v, range)} axisLine={false} tickLine={false} tick={tick} minTickGap={44} tickMargin={10} />
        <YAxis hide={!showYAxis} orientation="right" domain={[(min) => min * 0.99, (max) => max * 1.01]} tickFormatter={axisFormat} axisLine={false} tickLine={false} tick={tick} width={62} tickCount={5} />
        <Tooltip content={<ChartTooltip valueFormat={valueFormat} withTime={range === "7D"} />} cursor={{ stroke: CHART.cursor, strokeDasharray: "3 3" }} />
        {reference && (
          <ReferenceLine
            y={reference.value}
            stroke={CHART.reference}
            strokeDasharray="4 4"
            ifOverflow="extendDomain"
            label={{ value: reference.label, position: "insideTopLeft", fill: CHART.muted, fontSize: 11 }}
          />
        )}
        <Area
          type="monotone" dataKey={dataKey} name={name} stroke={color} strokeWidth={2} fill={`url(#${gid})`} dot={false}
          activeDot={{ r: 5, fill: color, stroke: CHART.bg, strokeWidth: 3 }}
          isAnimationActive={!reduce} animationDuration={900} animationEasing="ease-out"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}