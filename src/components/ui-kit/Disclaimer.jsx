import { Info } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Disclaimer({ children, icon: Icon = Info, className }) {
  return (
    <p className={cn("flex items-start gap-2 text-xs leading-relaxed text-muted-foreground", className)}>
      <Icon className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden />
      <span>{children}</span>
    </p>
  );
}