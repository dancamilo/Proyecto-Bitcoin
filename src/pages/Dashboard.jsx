import { useState } from "react";
import Reveal from "@/components/ui-kit/Reveal";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import PortfolioSummary from "@/components/dashboard/PortfolioSummary";
import BitcoinPriceCard from "@/components/dashboard/BitcoinPriceCard";
import DashboardMetrics from "@/components/dashboard/DashboardMetrics";
import PerformanceCard from "@/components/dashboard/PerformanceCard";
import LastTransactionCard from "@/components/dashboard/LastTransactionCard";
import SellSimulator from "@/components/dashboard/SellSimulator";
import BuySimulator from "@/components/dashboard/BuySimulator";
import RegisterTransactionModal from "@/components/forms/RegisterTransactionModal";
import { LoadingState, ErrorState } from "@/components/states/presets";
import { usePortfolio } from "@/hooks/usePortfolio";
import { useFeeSettings } from "@/hooks/useFeeSettings";

export default function Dashboard() {
  const [modalOpen, setModalOpen] = useState(false);
  const portfolio = usePortfolio();
  const { activePlan } = useFeeSettings();
  const open = () => setModalOpen(true);

  if (portfolio.isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <LoadingState />
      </div>
    );
  }
  if (portfolio.isError) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <ErrorState
          title="No se pudo cargar el precio de Bitcoin"
          description="Comprueba tu conexión e inténtalo de nuevo."
        />
      </div>
    );
  }

  const { market, transactions } = portfolio;
  const lastTx = [...transactions].sort((a, b) => new Date(b.date) - new Date(a.date))[0];

  return (
    <>
      <DashboardHeader market={market} onRegister={open} />
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-12">
        <Reveal delay={0.05} className="col-span-2 lg:col-span-7">
          <PortfolioSummary portfolio={portfolio} className="h-full" />
        </Reveal>
        <Reveal delay={0.1} className="col-span-2 lg:col-span-5">
          <BitcoinPriceCard market={market} className="h-full" />
        </Reveal>
        <DashboardMetrics portfolio={portfolio} market={market} plan={activePlan} />
        <Reveal delay={0.2} className="col-span-2 lg:col-span-8">
          <PerformanceCard portfolio={portfolio} className="h-full" />
        </Reveal>
        <Reveal delay={0.24} className="col-span-2 lg:col-span-4">
          <LastTransactionCard tx={lastTx} className="h-full" />
        </Reveal>
        <Reveal delay={0.28} className="col-span-2 lg:col-span-5">
          <SellSimulator portfolio={portfolio} className="h-full" />
        </Reveal>
        <Reveal delay={0.32} className="col-span-2 lg:col-span-7">
          <BuySimulator market={market} onRegister={open} className="h-full" />
        </Reveal>
      </div>
      <RegisterTransactionModal open={modalOpen} onOpenChange={setModalOpen} />
    </>
  );
}
