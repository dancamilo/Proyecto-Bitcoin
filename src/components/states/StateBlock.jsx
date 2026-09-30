import { cn } from "@/lib/utils";

const TONES = {
  neutral: "text-muted-foreground bg-white/[0.05] ring-white/[0.06]",
  error: "text-loss bg-loss/10 ring-loss/20",
  warn: "text-warn bg-warn/10 ring-warn/20",
  info: "text-info bg-info/10 ring-info/20",
  gain: "text-gain bg-gain/10 ring-gain/20",
  btc: "text-btc bg-btc/10 ring-btc/20",
};

export default function StateBlock({ icon: Icon, iconClassName, title, description, action, tone = "neutral", compact = false, role = "status", className }) {
  return (
    <div
      role={role}
      aria-live={role === "alert" ? "assertive" : "polite"}
      className={cn("flex flex-col items-center justify-center text-center", compact ? "gap-3 py-6" : "gap-4 py-12", className)}
    >
      <span className={cn("grid h-11 w-11 place-items-center rounded-2xl ring-1 ring-inset", TONES[tone])}>
        <Icon className={cn("h-5 w-5", iconClassName)} aria-hidden />
      </span>
      <div className="space-y-1">
        <p className="text-sm font-medium text-foreground">{title}</p>
        {description && <p className="mx-auto max-w-xs text-[13px] leading-relaxed text-muted-foreground">{description}</p>}
      </div>
      {action}
    </div>
  );
}