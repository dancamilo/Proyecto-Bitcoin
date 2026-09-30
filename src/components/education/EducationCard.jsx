import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Activity, Bitcoin, CircleCheck, Coins, Plus, Receipt, Repeat, Scale, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { EASE } from "@/charts/theme";

const ICONS = { bitcoin: Bitcoin, coins: Coins, scale: Scale, repeat: Repeat, trending: TrendingUp, check: CircleCheck, receipt: Receipt, activity: Activity };

export default function EducationCard({ topic, index, featured = false }) {
  const [open, setOpen] = useState(false);
  const Icon = ICONS[topic.icon];
  const panelId = `edu-${topic.id}`;
  return (
    <motion.article layout transition={{ layout: { duration: 0.35, ease: EASE } }}
      className={cn("surface surface-interactive relative isolate overflow-hidden rounded-[1.75rem]", featured && "sm:col-span-2")}>
      {featured && <div aria-hidden className="pointer-events-none absolute -right-20 -top-20 -z-10 h-56 w-56 rounded-full border border-btc/20 [box-shadow:0_0_0_28px_hsl(var(--btc)/0.03),0_0_0_56px_hsl(var(--btc)/0.02)]" />}
      <h3>
        <button type="button" onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-controls={panelId}
          className="flex w-full items-start gap-4 rounded-[1.75rem] p-5 text-left sm:p-6">
          <span className={cn("grid h-11 w-11 shrink-0 place-items-center rounded-2xl ring-1 ring-inset", featured ? "bg-btc/15 text-btc ring-btc/25" : "bg-white/[0.04] text-foreground/80 ring-white/[0.06]")}>
            <Icon className="h-5 w-5" aria-hidden />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block font-mono text-[11px] text-muted-foreground">{String(index + 1).padStart(2, "0")}</span>
            <span className={cn("mt-1 block font-semibold tracking-tight", featured ? "text-xl sm:text-2xl" : "text-lg")}>{topic.title}</span>
            <span className="mt-1.5 block text-sm leading-relaxed text-muted-foreground">{topic.short}</span>
          </span>
          <motion.span animate={{ rotate: open ? 45 : 0 }} transition={{ duration: 0.25, ease: EASE }}
            className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white/[0.05] text-muted-foreground">
            <Plus className="h-4 w-4" aria-hidden />
          </motion.span>
        </button>
      </h3>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div id={panelId} initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3, ease: EASE }} className="overflow-hidden">
            <div className="px-5 pb-6 sm:pl-[5.25rem] sm:pr-6">
              <p className="text-[15px] leading-relaxed text-foreground/85">{topic.body}</p>
              {topic.example && <p className="mt-4 inline-block rounded-xl bg-btc/[0.08] px-3 py-2 font-mono text-xs text-btc ring-1 ring-inset ring-btc/15">{topic.example}</p>}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.article>
  );
}