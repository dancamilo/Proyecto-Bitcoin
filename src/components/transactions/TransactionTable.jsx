import { useEffect, useMemo, useState } from "react";
import { Plus, SearchX } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import Surface from "@/components/ui-kit/Surface";
import ActionButton from "@/components/ui-kit/ActionButton";
import TransactionFilters from "@/components/transactions/TransactionFilters";
import TransactionList from "@/components/transactions/TransactionList";
import TransactionSkeleton from "@/components/transactions/TransactionSkeleton";
import Pagination from "@/components/transactions/Pagination";
import { EmptyState, ErrorState } from "@/components/states/presets";
import { formatDate } from "@/utils/format";

const PAGE_SIZE = 6;

const matches = (tx, q) =>
  [formatDate(tx.date), tx.usd.toFixed(2), tx.price.toFixed(2), tx.type === "buy" ? "compra" : "venta"].join(" ").toLowerCase().includes(q);

export default function TransactionTable({ transactions, status = "ready", onRetry, onRegister, onDelete }) {
  const [type, setType] = useState("all");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return transactions.filter((t) => (type === "all" || t.type === type) && (!q || matches(t, q)));
  }, [transactions, type, query]);

  useEffect(() => setPage(1), [type, query]);

  const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const items = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const view = status !== "ready" ? status : transactions.length === 0 ? "empty" : filtered.length === 0 ? "nomatch" : `list-${type}-${page}`;

  return (
    <Surface aria-label="Historial de operaciones" className="space-y-5">
      <TransactionFilters type={type} onType={setType} query={query} onQuery={setQuery} />
      <AnimatePresence mode="wait" initial={false}>
        <motion.div key={view} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
          {status === "loading" && <TransactionSkeleton />}
          {status === "error" && <ErrorState title="No se pudo cargar el historial" onRetry={onRetry} />}
          {view === "empty" && (
            <EmptyState action={<ActionButton icon={Plus} size="sm" onClick={onRegister}>Registrar operación</ActionButton>} />
          )}
          {view === "nomatch" && <EmptyState icon={SearchX} title="Sin resultados" description="Ninguna operación coincide con los filtros aplicados." />}
          {view.startsWith("list") && <TransactionList items={items} onDelete={onDelete} />}
        </motion.div>
      </AnimatePresence>
      {view.startsWith("list") && <Pagination page={page} pages={pages} total={filtered.length} pageSize={PAGE_SIZE} onPage={setPage} />}
    </Surface>
  );
}