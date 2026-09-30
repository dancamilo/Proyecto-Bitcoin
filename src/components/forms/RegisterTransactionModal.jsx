import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import TransactionForm from "@/components/forms/TransactionForm";
import SuccessPanel from "@/components/forms/SuccessPanel";
import { useMarketPrice } from "@/hooks/useMarketData";
import { useFeeSettings } from "@/hooks/useFeeSettings";
import { useTransactions } from "@/hooks/useTransactions";
import { calculateBuy, calculateSell } from "@/services/calculations";

const todayStr = () => new Date().toISOString().slice(0, 10);
const initialForm = (type, price) => ({ type, date: todayStr(), amount: "", price: price ? String(price) : "", fee: "" });

/**
 * Aplica una comisión manual (si el usuario la escribió) sobre el
 * resultado ya calculado con el plan activo, recomputando lo que depende
 * de ella (neto, BTC/USD resultante).
 */
function applyFeeOverride(preview, type, feeOverrideUsd, pricePerBtcUsd) {
  if (!preview || feeOverrideUsd == null || Number.isNaN(feeOverrideUsd) || feeOverrideUsd < 0) return preview;
  const feeCents = Math.round(feeOverrideUsd * 100);
  if (type === "buy") {
    const netCents = Math.max(preview.usdCents - feeCents, 0);
    const sats = Math.round(((netCents / 100) / pricePerBtcUsd) * 1e8);
    return { ...preview, feeCents, netCents, totalChargedCents: preview.usdCents, sats, fee: feeOverrideUsd, net: netCents / 100, btc: sats / 1e8, totalCharged: preview.usdCents / 100 };
  }
  const netCents = Math.max(preview.grossCents - feeCents, 0);
  return { ...preview, feeCents, netCents, fee: feeOverrideUsd, net: netCents / 100 };
}

export default function RegisterTransactionModal({ open, onOpenChange, defaultType = "buy" }) {
  const market = useMarketPrice();
  const { activePlan } = useFeeSettings();
  const { add } = useTransactions();
  const [form, setForm] = useState(() => initialForm(defaultType, market.data?.price));
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle");

  useEffect(() => {
    if (open) {
      setForm(initialForm(defaultType, market.data?.price));
      setErrors({});
      setStatus("idle");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, defaultType]);

  const priceNum = parseFloat(form.price);
  const feeOverride = form.fee.trim() === "" ? null : parseFloat(form.fee);
  let preview = null;
  if (priceNum > 0 && form.amount.trim() !== "") {
    preview =
      form.type === "buy"
        ? calculateBuy({ usdInput: form.amount, pricePerBtcUsd: priceNum, plan: activePlan })
        : calculateSell({ btcInput: form.amount, pricePerBtcUsd: priceNum, plan: activePlan });
    preview = applyFeeOverride(preview, form.type, feeOverride, priceNum);
  }

  const submit = (e) => {
    e.preventDefault();
    const next = {};
    if (!(priceNum > 0)) next.price = "Introduce un precio válido";
    const amountNum = parseFloat(form.amount);
    if (!(amountNum > 0)) next.amount = form.type === "buy" ? "Introduce un monto válido" : "Introduce una cantidad de BTC válida";
    if (!form.date) next.date = "Introduce una fecha";
    setErrors(next);
    if (Object.keys(next).length || !preview) return;

    setStatus("saving");
    const record =
      form.type === "buy"
        ? {
            date: new Date(form.date).toISOString(), type: "buy",
            usd: preview.usd, price: preview.price, fee: preview.fee, btc: preview.btc,
            usdCents: preview.usdCents, feeCents: preview.feeCents, netCents: preview.netCents,
            totalChargedCents: preview.totalChargedCents, sats: preview.sats,
          }
        : {
            date: new Date(form.date).toISOString(), type: "sell",
            usd: preview.gross, price: preview.price, fee: preview.fee, btc: preview.btc,
            grossCents: preview.grossCents, feeCents: preview.feeCents, netCents: preview.netCents, sats: preview.sats,
          };
    add(record);
    setStatus("success");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[92vh] w-[calc(100%-2rem)] max-w-md overflow-y-auto rounded-[1.75rem] border-white/10 bg-surface-1 p-6 sm:rounded-[1.75rem] sm:p-7">
        <DialogHeader className="text-left">
          <DialogTitle className="text-xl tracking-tight">Registrar operación</DialogTitle>
          <DialogDescription>Añade una compra o venta a tu historial.</DialogDescription>
        </DialogHeader>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div key={status === "success" ? "ok" : "form"} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>
            {status === "success" ? (
              <SuccessPanel
                onClose={() => onOpenChange(false)}
                onAnother={() => { setForm(initialForm(form.type, market.data?.price)); setStatus("idle"); }}
              />
            ) : (
              <TransactionForm form={form} setForm={setForm} errors={errors} saving={status === "saving"} preview={preview} onSubmit={submit} />
            )}
          </motion.div>
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
