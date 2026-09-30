import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import { Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import Brand from "@/components/navigation/Brand";
import SyncStatus from "@/components/navigation/SyncStatus";
import { DESKTOP_ITEMS } from "@/components/navigation/navItems";

export default function TopNav() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/[0.05] bg-background/75 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-[1320px] items-center justify-between gap-4 px-4 sm:px-6 lg:h-[72px] lg:px-10">
        <Brand />
        <nav aria-label="Principal" className="hidden lg:block">
          <ul className="flex items-center gap-0.5 rounded-full border border-white/[0.06] bg-surface-1/70 p-1">
            {DESKTOP_ITEMS.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  end={item.to === "/"}
                  className={({ isActive }) =>
                    cn("relative flex h-9 items-center rounded-full px-3.5 text-sm font-medium transition-colors", isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground")
                  }
                >
                  {({ isActive }) => (
                    <>
                      {isActive && (
                        <motion.span layoutId="nav-pill" className="absolute inset-0 rounded-full bg-surface-3 ring-1 ring-white/10" transition={{ type: "spring", stiffness: 480, damping: 38 }} />
                      )}
                      <span className="relative">{item.label}</span>
                    </>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
        <div className="flex items-center gap-2">
          <SyncStatus />
          <NavLink
            to="/ajustes"
            aria-label="Ajustes"
            className={({ isActive }) =>
              cn("hidden h-10 w-10 place-items-center rounded-full border border-white/[0.06] transition-colors hover:text-foreground lg:grid", isActive ? "bg-surface-3 text-foreground" : "bg-surface-1/70 text-muted-foreground")
            }
          >
            <Settings className="h-4 w-4" aria-hidden />
          </NavLink>
        </div>
      </div>
    </header>
  );
}