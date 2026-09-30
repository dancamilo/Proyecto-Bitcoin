import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export default function PlanOption({ plan, selected, onSelect }) {
  return (
    <button type="button" role="radio" aria-checked={selected} onClick={() => onSelect(plan.id)}
      className={cn("relative flex h-full flex-col items-start rounded-2xl p-4 text-left ring-1 ring-inset transition-all duration-200",
        selected ? "bg-btc/[0.07] ring-btc/40" : "bg-white/[0.02] ring-white/[0.07] hover:bg-white/[0.04] hover:ring-white/[0.14]")}>
      <span className={cn("absolute right-4 top-4 grid h-5 w-5 place-items-center rounded-full ring-1 ring-inset transition-colors", selected ? "bg-btc text-black ring-btc" : "ring-white/20")}>
        {selected && <Check className="h-3 w-3" strokeWidth={3} aria-hidden />}
      </span>
      <span className="text-[15px] font-semibold">{plan.name}</span>
      <span className="mt-1 pr-6 text-xs leading-relaxed text-muted-foreground">{plan.description}</span>
      {plan.id !== "custom" && (
        <span className="mt-3 font-mono text-xs text-foreground/80">{plan.rate.toFixed(2)}% · mín. ${plan.min.toFixed(2)}</span>
      )}
    </button>
  );
}