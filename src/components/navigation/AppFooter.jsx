import Tag from "@/components/ui-kit/Tag";
import { APP_CONFIG } from "@/config/app";

export default function AppFooter() {
  return (
    <footer className="mx-auto mt-16 flex max-w-[1320px] flex-col gap-3 border-t border-white/[0.05] px-4 pb-28 pt-8 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-10 lg:pb-10">
      <p>
        {APP_CONFIG.name} — <span className="text-foreground/70">{APP_CONFIG.tagline}</span>
      </p>
      <div className="flex flex-wrap items-center gap-3">
        <Tag tone="warn">Datos de demostración</Tag>
        <span>Información educativa. No constituye asesoramiento financiero.</span>
      </div>
    </footer>
  );
}