import Surface from "@/components/ui-kit/Surface";
import Eyebrow from "@/components/ui-kit/Eyebrow";
import { cn } from "@/lib/utils";

const TONES = { gain: "text-gain", loss: "text-loss", btc: "text-btc" };

export default function MetricCard({ icon: Icon, label, value, unit, footnote, tone, className }) {
  return (
    <Surface as="article" interactive className={cn("flex h-full flex-col justify-between gap-6 p-5", className)}>
      <div className="flex items-center justify-between gap-2">
        <Eyebrow as="h3">{label}</Eyebrow>
        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-white/[0.04] text-muted-foreground ring-1 ring-inset ring-white/[0.05]">
          <Icon className="h-4 w-4" aria-hidden />
        </span>
      </div>
      <div className="min-w-0">
        <p className={cn("text-figure-md truncate font-semibold", TONES[tone])}>
          {value}
          {unit && <span className="ml-1.5 text-sm font-medium tracking-normal text-muted-foreground">{unit}</span>}
        </p>
        {footnote && <p className="mt-1.5 text-xs text-muted-foreground">{footnote}</p>}
      </div>
    </Surface>
  );
}