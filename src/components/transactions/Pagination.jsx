import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Pagination({ page, pages, total, pageSize, onPage }) {
  const from = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, total);
  const btn = "grid h-10 w-10 place-items-center rounded-full text-sm transition-colors disabled:pointer-events-none disabled:opacity-30";
  return (
    <nav aria-label="Paginación" className="flex items-center justify-between gap-3">
      <p className="text-xs text-muted-foreground tabular-nums">Mostrando {from}–{to} de {total}</p>
      <div className="flex items-center gap-1">
        <button type="button" className={cn(btn, "text-muted-foreground hover:bg-white/[0.06] hover:text-foreground")} onClick={() => onPage(page - 1)} disabled={page === 1} aria-label="Página anterior">
          <ChevronLeft className="h-4 w-4" aria-hidden />
        </button>
        {Array.from({ length: pages }, (_, i) => i + 1).map((n) => (
          <button key={n} type="button" onClick={() => onPage(n)} aria-current={n === page ? "page" : undefined}
            className={cn(btn, "tabular-nums", n === page ? "bg-surface-3 text-foreground ring-1 ring-white/10" : "text-muted-foreground hover:bg-white/[0.06] hover:text-foreground")}>
            {n}
          </button>
        ))}
        <button type="button" className={cn(btn, "text-muted-foreground hover:bg-white/[0.06] hover:text-foreground")} onClick={() => onPage(page + 1)} disabled={page === pages} aria-label="Página siguiente">
          <ChevronRight className="h-4 w-4" aria-hidden />
        </button>
      </div>
    </nav>
  );
}