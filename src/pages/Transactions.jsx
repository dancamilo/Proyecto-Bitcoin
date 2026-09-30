import { useState } from "react";
import { Plus } from "lucide-react";
import PageHeader from "@/components/ui-kit/PageHeader";
import ActionButton from "@/components/ui-kit/ActionButton";
import Reveal from "@/components/ui-kit/Reveal";
import TransactionSummary from "@/components/transactions/TransactionSummary";
import TransactionTable from "@/components/transactions/TransactionTable";
import RegisterTransactionModal from "@/components/forms/RegisterTransactionModal";
import { useTransactions } from "@/hooks/useTransactions";
import { useMarketPrice } from "@/hooks/useMarketData";
import { annotateTransactions } from "@/services/calculations";

export default function Transactions() {
  const [modalOpen, setModalOpen] = useState(false);
  const { transactions, remove } = useTransactions();
  const market = useMarketPrice();

  const annotated = annotateTransactions(transactions, market.data?.price).sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );

  return (
    <>
      <PageHeader
        eyebrow="Historial"
        title="Operaciones"
        description="Todas tus compras y ventas de Bitcoin, con precio, comisión y resultado."
        actions={<ActionButton icon={Plus} onClick={() => setModalOpen(true)}>Registrar operación</ActionButton>}
      />
      <TransactionSummary transactions={annotated} />
      <Reveal delay={0.1}>
        <TransactionTable
          transactions={annotated}
          status="ready"
          onRegister={() => setModalOpen(true)}
          onDelete={remove}
        />
      </Reveal>
      <RegisterTransactionModal open={modalOpen} onOpenChange={setModalOpen} />
    </>
  );
}
