export default function ChartSkeleton() {
  return (
    <div className="flex h-full flex-col gap-3" role="status" aria-label="Cargando gráfico">
      <div className="relative flex-1 overflow-hidden rounded-2xl">
        {[18, 40, 62, 84].map((top) => (
          <div key={top} className="absolute inset-x-0 h-px bg-white/[0.04]" style={{ top: `${top}%` }} />
        ))}
        <svg viewBox="0 0 400 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full" aria-hidden>
          <path d="M0 72 C 60 62, 90 80, 140 56 S 230 42, 270 52 S 350 22, 400 30" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="2" vectorEffect="non-scaling-stroke" />
        </svg>
        <div className="skeleton absolute inset-0 opacity-40" />
      </div>
      <div className="flex justify-between">
        {[0, 1, 2, 3, 4].map((i) => <div key={i} className="skeleton h-2.5 w-10" />)}
      </div>
    </div>
  );
}