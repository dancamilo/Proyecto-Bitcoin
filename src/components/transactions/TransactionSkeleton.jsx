export default function TransactionSkeleton({ rows = 5 }) {
  return (
    <div className="space-y-3 py-2" role="status" aria-label="Cargando operaciones">
      {Array.from({ length: rows }, (_, i) => (
        <div key={i} className="flex items-center gap-4 rounded-2xl px-2 py-3">
          <div className="skeleton h-9 w-9 shrink-0 rounded-xl" />
          <div className="flex-1 space-y-2">
            <div className="skeleton h-3 w-1/3" />
            <div className="skeleton h-2.5 w-1/5" />
          </div>
          <div className="skeleton h-4 w-16" />
        </div>
      ))}
    </div>
  );
}