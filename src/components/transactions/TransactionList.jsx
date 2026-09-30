import TransactionRow from "@/components/transactions/TransactionRow";
import TransactionCard from "@/components/transactions/TransactionCard";

const HEADERS = [
  { label: "Fecha", className: "pl-5 pr-3 text-left" },
  { label: "Tipo", className: "px-3 text-left" },
  { label: "BTC", className: "px-3 text-right" },
  { label: "USD", className: "px-3 text-right" },
  { label: "Precio", className: "px-3 text-right" },
  { label: "Comisión", className: "px-3 text-right" },
  { label: "Resultado", className: "pl-3 pr-3 text-right" },
  { label: "", className: "pl-3 pr-5 text-right" },
];

export default function TransactionList({ items, onDelete }) {
  return (
    <>
      <div className="-mx-5 hidden overflow-x-auto sm:-mx-6 md:block">
        <table className="w-full min-w-[760px]">
          <caption className="sr-only">Historial de operaciones</caption>
          <thead>
            <tr>
              {HEADERS.map((h) => (
                <th key={h.label || "actions"} scope="col" className={`pb-3 font-mono text-[10.5px] font-normal uppercase tracking-[0.12em] text-muted-foreground ${h.className}`}>{h.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>{items.map((tx) => <TransactionRow key={tx.id} tx={tx} onDelete={onDelete} />)}</tbody>
        </table>
      </div>
      <ul className="space-y-2.5 md:hidden">{items.map((tx) => <TransactionCard key={tx.id} tx={tx} onDelete={onDelete} />)}</ul>
    </>
  );
}
