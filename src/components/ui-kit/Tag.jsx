import { cn } from "@/lib/utils";

const TONES = {
  neutral: "bg-white/[0.05] text-muted-foreground ring-white/[0.08]",
  btc: "bg-btc/10 text-btc ring-btc/20",
  gain: "bg-gain/10 text-gain ring-gain/20",
  loss: "bg-loss/10 text-loss ring-loss/20",
  info: "bg-info/10 text-info ring-info/20",
  warn: "bg-warn/10 text-warn ring-warn/20",
};

export default function Tag({ children, tone = "neutral", icon: Icon, className }) {
  return (
    <span className={cn("inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 font-mono text-[10.5px] uppercase tracking-[0.12em] ring-1 ring-inset", TONES[tone], className)}>
      {Icon && <Icon className="h-3 w-3" aria-hidden />}
      {children}
    </span>
  );
}