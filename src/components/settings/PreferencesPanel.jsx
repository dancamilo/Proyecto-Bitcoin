import { useState } from "react";
import { SlidersHorizontal } from "lucide-react";
import Surface from "@/components/ui-kit/Surface";
import Eyebrow from "@/components/ui-kit/Eyebrow";
import Tag from "@/components/ui-kit/Tag";
import { Switch } from "@/components/ui/switch";

const PREFS = [
  { id: "hide", label: "Ocultar balances", description: "Oculta los importes en pantalla." },
  { id: "auto", label: "Actualización automática", description: "Refresca precios periódicamente." },
  { id: "motion", label: "Animaciones reducidas", description: "También se respeta la preferencia del sistema." },
];

export default function PreferencesPanel() {
  const [values, setValues] = useState({ hide: false, auto: true, motion: false });
  return (
    <Surface aria-labelledby="prefs-title">
      <Eyebrow icon={SlidersHorizontal}>Preferencias</Eyebrow>
      <h2 id="prefs-title" className="mt-3 text-xl font-semibold tracking-tight">General</h2>
      <ul className="mt-5 divide-y divide-white/[0.05]">
        <li className="flex items-center justify-between gap-4 py-4">
          <div><p className="text-sm font-medium">Moneda base</p><p className="text-xs text-muted-foreground">Más monedas próximamente.</p></div>
          <Tag>USD</Tag>
        </li>
        {PREFS.map((p) => (
          <li key={p.id} className="flex items-center justify-between gap-4 py-4">
            <label htmlFor={`pref-${p.id}`} className="cursor-pointer">
              <span className="block text-sm font-medium">{p.label}</span>
              <span className="block text-xs text-muted-foreground">{p.description}</span>
            </label>
            <Switch id={`pref-${p.id}`} checked={values[p.id]} onCheckedChange={(v) => setValues({ ...values, [p.id]: v })}
              className="data-[state=checked]:bg-btc data-[state=unchecked]:bg-white/10" />
          </li>
        ))}
      </ul>
    </Surface>
  );
}