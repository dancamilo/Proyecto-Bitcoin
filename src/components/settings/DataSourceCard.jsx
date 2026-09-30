import { Database } from "lucide-react";
import Surface from "@/components/ui-kit/Surface";
import Eyebrow from "@/components/ui-kit/Eyebrow";
import Tag from "@/components/ui-kit/Tag";
import LineItem from "@/components/ui-kit/LineItem";

export default function DataSourceCard() {
  return (
    <Surface aria-labelledby="source-title">
      <Eyebrow icon={Database}>Datos</Eyebrow>
      <div className="mt-3 flex items-center justify-between gap-3">
        <h2 id="source-title" className="text-xl font-semibold tracking-tight">Fuente de datos</h2>
        <Tag tone="warn">Demo</Tag>
      </div>
      <dl className="mt-4 divide-y divide-white/[0.05]">
        <LineItem label="Precios de mercado" value="Datos de demostración" tone="muted" />
        <LineItem label="Operaciones" value="Datos de demostración" tone="muted" />
        <LineItem label="Almacenamiento" value="No configurado" tone="muted" />
      </dl>
    </Surface>
  );
}