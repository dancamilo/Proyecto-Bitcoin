import { Link } from "react-router-dom";
import PulseMark from "@/components/ui-kit/PulseMark";

export default function Brand() {
  return (
    <Link to="/" className="group flex items-center gap-2.5 rounded-xl" aria-label="Bitcoin Portfolio Analyzer, ir al inicio">
      <PulseMark className="h-9 w-9 transition-transform duration-300 group-hover:scale-105" />
      <span className="leading-none">
        <span className="block text-[15px] font-semibold tracking-tight">Portfolio Analyzer</span>
        <span className="mt-1 block font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">Bitcoin · Personal</span>
      </span>
    </Link>
  );
}