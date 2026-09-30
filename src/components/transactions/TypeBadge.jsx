import { ArrowDownLeft, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

export default function TypeBadge({ type }) {
  const buy = type === "buy";
  const Icon = buy ? ArrowDownLeft : ArrowUpRight;
  return (
    <span className={cn(
      "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-mono text-[10.5px] font-medium uppercase tracking-[0.12em] ring-1 ring-inset",
      buy ? "bg-btc/10 text-btc ring-btc/20" : "bg-info/10 text-info ring-info/20"
    )}>
      <Icon className="h-3 w-3" aria-hidden />
      {buy ? "Compra" : "Venta"}
    </span>
  );
}