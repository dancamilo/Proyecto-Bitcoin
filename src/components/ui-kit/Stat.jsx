import { cn } from "@/lib/utils";

const TONES = { gain: "text-gain", loss: "text-loss", btc: "text-btc" };

export default function Stat({ label, value, unit, tone, className }) {
  return (
    <div className={cn("min-w-0", className)}>
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className={cn("mt-1 truncate text-[15px] font-medium tabular-nums sm:text-base", TONES[tone])}>
        {value}
        {unit && <span className="ml-1 text-xs font-normal text-muted-foreground">{unit}</span>}
      </dd>
    </div>
  );
}