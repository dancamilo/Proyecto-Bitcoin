import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatPct } from "@/utils/format";

const SIZES = {
  xs: "text-xs gap-0.5 [&_svg]:h-3 [&_svg]:w-3",
  sm: "text-sm gap-1 [&_svg]:h-3.5 [&_svg]:w-3.5",
  md: "text-base gap-1 [&_svg]:h-4 [&_svg]:w-4",
};

export default function Delta({ value, format = formatPct, size = "sm", pill = true, className }) {
  const up = value >= 0;
  const Icon = up ? ArrowUpRight : ArrowDownRight;
  return (
    <span
      className={cn(
        "inline-flex items-center whitespace-nowrap font-medium tabular-nums",
        up ? "text-gain" : "text-loss",
        pill && "rounded-full px-2 py-0.5",
        pill && (up ? "bg-gain/10" : "bg-loss/10"),
        SIZES[size],
        className
      )}
    >
      <Icon aria-hidden />
      <span className="sr-only">{up ? "Subida de" : "Bajada de"}</span>
      {format(value)}
    </span>
  );
}