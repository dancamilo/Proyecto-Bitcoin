import { useState } from "react";
import PageHeader from "@/components/ui-kit/PageHeader";
import Reveal from "@/components/ui-kit/Reveal";
import HistoricalSimulator from "@/components/analysis/HistoricalSimulator";
import ScenarioStrip from "@/components/analysis/ScenarioStrip";

export default function Analysis() {
  const [amount, setAmount] = useState("20");
  return (
    <>
      <PageHeader
        eyebrow="Análisis"
        title="Escenarios históricos"
        description="Explora cómo habría evolucionado una inversión en el pasado. Solo con fines informativos."
      />
      <Reveal delay={0.05}><HistoricalSimulator amount={amount} onAmount={setAmount} /></Reveal>
      <ScenarioStrip amount={amount} />
    </>
  );
}