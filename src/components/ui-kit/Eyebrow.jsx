import { cn } from "@/lib/utils";

export default function Eyebrow({ children, icon: Icon, className, as: Tag = "p" }) {
  return (
    <Tag className={cn("flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground", className)}>
      {Icon && <Icon className="h-3.5 w-3.5" aria-hidden />}
      {children}
    </Tag>
  );
}