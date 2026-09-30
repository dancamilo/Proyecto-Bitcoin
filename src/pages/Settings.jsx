import PageHeader from "@/components/ui-kit/PageHeader";
import Reveal from "@/components/ui-kit/Reveal";
import FeeSettings from "@/components/settings/FeeSettings";
import PreferencesPanel from "@/components/settings/PreferencesPanel";
import DataSourceCard from "@/components/settings/DataSourceCard";
import StatesGallery from "@/components/settings/StatesGallery";

export default function Settings() {
  return (
    <>
      <PageHeader eyebrow="Ajustes" title="Configuración" description="Comisiones, preferencias y origen de los datos." />
      <div className="grid gap-4 lg:grid-cols-12">
        <Reveal delay={0.05} className="lg:col-span-7"><FeeSettings /></Reveal>
        <div className="space-y-4 lg:col-span-5">
          <Reveal delay={0.1}><PreferencesPanel /></Reveal>
          <Reveal delay={0.15}><DataSourceCard /></Reveal>
        </div>
        <Reveal delay={0.2} className="lg:col-span-12"><StatesGallery /></Reveal>
      </div>
    </>
  );
}