import { ArrowLeftRight, GraduationCap, History, LayoutGrid, LineChart, Repeat, Settings } from "lucide-react";

export const NAV_ITEMS = [
  { to: "/", label: "Dashboard", short: "Inicio", icon: LayoutGrid },
  { to: "/mercado", label: "Mercado", short: "Mercado", icon: LineChart },
  { to: "/operaciones", label: "Operaciones", short: "Historial", icon: ArrowLeftRight },
  { to: "/analisis", label: "Análisis", short: "Análisis", icon: History },
  { to: "/dca", label: "DCA", short: "DCA", icon: Repeat },
  { to: "/educacion", label: "Educación", short: "Aprender", icon: GraduationCap },
  { to: "/ajustes", label: "Ajustes", short: "Ajustes", icon: Settings },
];

export const DESKTOP_ITEMS = NAV_ITEMS.slice(0, 6);
export const MOBILE_PRIMARY = NAV_ITEMS.slice(0, 4);
export const MOBILE_MORE = NAV_ITEMS.slice(4);