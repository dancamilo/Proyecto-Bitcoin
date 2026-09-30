import { useState } from "react";
import { useLocation } from "react-router-dom";
import { MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import BottomNavItem, { ActiveBar, bottomItemClass } from "@/components/navigation/BottomNavItem";
import MoreSheet from "@/components/navigation/MoreSheet";
import { MOBILE_MORE, MOBILE_PRIMARY } from "@/components/navigation/navItems";

export default function BottomNav() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const moreActive = MOBILE_MORE.some((i) => pathname.startsWith(i.to));

  return (
    <>
      <nav
        aria-label="Navegación móvil"
        className="fixed inset-x-0 bottom-0 z-40 border-t border-white/[0.06] bg-background/85 backdrop-blur-xl lg:hidden"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <ul className="mx-auto grid max-w-lg grid-cols-5">
          {MOBILE_PRIMARY.map((item) => (
            <li key={item.to}><BottomNavItem item={item} /></li>
          ))}
          <li>
            <button type="button" onClick={() => setOpen(true)} aria-haspopup="dialog" aria-expanded={open} className={bottomItemClass(moreActive)}>
              {moreActive && <ActiveBar />}
              <MoreHorizontal className={cn("h-5 w-5", moreActive && "text-btc")} aria-hidden />
              <span>Más</span>
            </button>
          </li>
        </ul>
      </nav>
      <MoreSheet open={open} onOpenChange={setOpen} />
    </>
  );
}