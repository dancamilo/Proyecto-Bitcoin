import { useId } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export default function Segmented({ options, value, onChange, label, size = "md", fill = false, className }) {
  const id = useId();
  return (
    <div
      role="radiogroup"
      aria-label={label}
      className={cn(
        "rounded-full border border-white/[0.06] bg-surface-1 p-1",
        fill ? "grid w-full auto-cols-fr grid-flow-col" : "no-scrollbar inline-flex max-w-full overflow-x-auto",
        className
      )}
    >
      {options.map((o) => {
        const val = o.value ?? o;
        const text = o.label ?? o;
        const active = val === value;
        return (
          <button
            key={val}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(val)}
            className={cn(
              "relative shrink-0 whitespace-nowrap rounded-full font-medium transition-colors duration-200",
              size === "sm" ? "h-8 text-xs" : "h-10 text-sm sm:h-9",
              fill ? "min-w-0 px-1.5 text-[13px] sm:px-2.5 sm:text-sm" : "px-3.5",
              active ? "text-foreground" : "text-muted-foreground hover:text-foreground"
            )}
          >
            {active && (
              <motion.span
                layoutId={`seg-${id}`}
                className="absolute inset-0 rounded-full bg-surface-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.07)] ring-1 ring-white/10"
                transition={{ type: "spring", stiffness: 520, damping: 40 }}
              />
            )}
            <span className="relative">{text}</span>
          </button>
        );
      })}
    </div>
  );
}