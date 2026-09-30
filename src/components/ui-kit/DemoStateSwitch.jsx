import { FlaskConical } from "lucide-react";
import Segmented from "@/components/ui-kit/Segmented";

// Solo para demo: permite previsualizar los estados de un módulo. Eliminar al conectar datos reales.
const OPTIONS = [
  { value: "ready", label: "Datos" },
  { value: "loading", label: "Cargando" },
  { value: "empty", label: "Vacío" },
  { value: "error", label: "Error" },
];

export default function DemoStateSwitch({ value, onChange }) {
  return (
    <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-dashed border-white/10 px-3 py-2">
      <span className="flex items-center gap-1.5 font-mono text-[10.5px] uppercase tracking-[0.12em] text-muted-foreground">
        <FlaskConical className="h-3.5 w-3.5" aria-hidden /> Vista previa de estado
      </span>
      <Segmented size="sm" options={OPTIONS} value={value} onChange={onChange} label="Vista previa de estado" />
    </div>
  );
}