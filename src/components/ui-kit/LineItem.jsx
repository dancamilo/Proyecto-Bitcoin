import { cn } from "@/lib/utils";

const TONES = { gain: "text-gain", loss: "text-loss", muted: "text-muted-foreground" };

export default function LineItem({ label, hint, value, tone, className }) {
  return (
    <div className={cn("flex items-baseline justify-between gap-4 py-2.5", className)}>
      <dt className="text-sm text-muted-foreground">
        {label}
        {hint && <span className="ml-1.5 font-mono text-[11px] text-muted-foreground/70">{hint}</span>}
      </dt>
      <dd className={cn("text-sm font-medium tabular-nums", TONES[tone])}>{value}</dd>
    </div>
  );
}