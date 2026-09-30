import { NavLink } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { MOBILE_MORE } from "@/components/navigation/navItems";

const DESCRIPTIONS = { "/dca": "Simulador de inversión periódica", "/educacion": "Centro de aprendizaje", "/ajustes": "Comisiones y preferencias" };

export default function MoreSheet({ open, onOpenChange }) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="rounded-t-[2rem] border-white/10 bg-surface-1 px-4 pb-10 pt-6">
        <div className="mx-auto mb-5 h-1 w-10 rounded-full bg-white/15" aria-hidden />
        <SheetHeader className="mb-4 text-left">
          <SheetTitle className="text-lg tracking-tight">Más secciones</SheetTitle>
          <SheetDescription>Herramientas y configuración</SheetDescription>
        </SheetHeader>
        <ul className="space-y-2">
          {MOBILE_MORE.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  onClick={() => onOpenChange(false)}
                  className={({ isActive }) => cn("flex min-h-[60px] items-center gap-4 rounded-2xl px-4 transition-colors", isActive ? "bg-surface-3" : "bg-white/[0.03] hover:bg-white/[0.06]")}
                >
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-btc/10 text-btc"><Icon className="h-5 w-5" aria-hidden /></span>
                  <span className="flex-1">
                    <span className="block text-[15px] font-medium">{item.label}</span>
                    <span className="block text-xs text-muted-foreground">{DESCRIPTIONS[item.to]}</span>
                  </span>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" aria-hidden />
                </NavLink>
              </li>
            );
          })}
        </ul>
      </SheetContent>
    </Sheet>
  );
}