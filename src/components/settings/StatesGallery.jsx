import { LayoutTemplate } from "lucide-react";
import Surface from "@/components/ui-kit/Surface";
import Eyebrow from "@/components/ui-kit/Eyebrow";
import { CalculatingState, EmptyState, ErrorState, LoadingState, NoDataState, OfflineState, SuccessState, UpdatingState } from "@/components/states/presets";

// Catálogo de estados de interfaz, listo para reutilizar en cualquier módulo.
const STATES = [
  { name: "Loading", el: <LoadingState compact /> },
  { name: "Empty", el: <EmptyState compact /> },
  { name: "Success", el: <SuccessState compact /> },
  { name: "Error", el: <ErrorState compact onRetry={() => {}} /> },
  { name: "Offline", el: <OfflineState compact /> },
  { name: "No data", el: <NoDataState compact /> },
  { name: "Calculating", el: <CalculatingState compact /> },
  { name: "Updating", el: <UpdatingState compact /> },
];

export default function StatesGallery() {
  return (
    <Surface aria-labelledby="states-title">
      <Eyebrow icon={LayoutTemplate}>Sistema</Eyebrow>
      <h2 id="states-title" className="mt-3 text-xl font-semibold tracking-tight">Estados de interfaz</h2>
      <p className="mt-1 text-sm text-muted-foreground">Referencia visual de los estados disponibles en la aplicación.</p>
      <ul className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {STATES.map((s) => (
          <li key={s.name} className="surface-inset rounded-2xl px-3">
            <p className="pt-3 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground/80">{s.name}</p>
            {s.el}
          </li>
        ))}
      </ul>
    </Surface>
  );
}