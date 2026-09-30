import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export const bottomItemClass = (active) =>
  cn("relative flex h-16 w-full flex-col items-center justify-center gap-1 text-[11px] font-medium transition-colors", active ? "text-foreground" : "text-muted-foreground");

export function ActiveBar() {
  return <motion.span layoutId="bottom-bar" className="absolute top-0 h-0.5 w-8 rounded-full bg-btc" transition={{ type: "spring", stiffness: 500, damping: 40 }} />;
}

export default function BottomNavItem({ item }) {
  const Icon = item.icon;
  return (
    <NavLink to={item.to} end={item.to === "/"} className={({ isActive }) => bottomItemClass(isActive)}>
      {({ isActive }) => (
        <>
          {isActive && <ActiveBar />}
          <Icon className={cn("h-5 w-5", isActive && "text-btc")} aria-hidden />
          <span>{item.short}</span>
        </>
      )}
    </NavLink>
  );
}