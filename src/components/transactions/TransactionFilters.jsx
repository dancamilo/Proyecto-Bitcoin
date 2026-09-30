import { Search, X } from "lucide-react";
import Segmented from "@/components/ui-kit/Segmented";

const TYPES = [{ value: "all", label: "Todas" }, { value: "buy", label: "Compras" }, { value: "sell", label: "Ventas" }];

export default function TransactionFilters({ type, onType, query, onQuery }) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <Segmented options={TYPES} value={type} onChange={onType} label="Filtrar por tipo" />
      <div className="field h-11 sm:w-72">
        <Search className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
        <label htmlFor="tx-search" className="sr-only">Buscar operaciones</label>
        <input
          id="tx-search" type="search" value={query} onChange={(e) => onQuery(e.target.value)}
          placeholder="Buscar por fecha, monto…"
          className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground/60 [&::-webkit-search-cancel-button]:hidden"
        />
        {query && (
          <button type="button" onClick={() => onQuery("")} aria-label="Limpiar búsqueda" className="grid h-7 w-7 place-items-center rounded-full text-muted-foreground hover:bg-white/[0.06] hover:text-foreground">
            <X className="h-3.5 w-3.5" aria-hidden />
          </button>
        )}
      </div>
    </div>
  );
}