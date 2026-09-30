import { motion } from "framer-motion";
import { Check } from "lucide-react";
import ActionButton from "@/components/ui-kit/ActionButton";

export default function SuccessPanel({ onClose, onAnother }) {
  return (
    <div className="flex flex-col items-center py-6 text-center" role="status">
      <motion.span
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 400, damping: 22 }}
        className="grid h-14 w-14 place-items-center rounded-full bg-gain/15 text-gain ring-1 ring-inset ring-gain/30"
      >
        <Check className="h-6 w-6" aria-hidden />
      </motion.span>
      <p className="mt-5 text-lg font-semibold tracking-tight">Operación registrada</p>
      <p className="mt-1.5 max-w-xs text-sm text-muted-foreground">Se guardó en tu navegador y ya está reflejada en tu cartera.</p>
      <div className="mt-6 flex w-full gap-2">
        <ActionButton variant="secondary" className="flex-1" onClick={onAnother}>Registrar otra</ActionButton>
        <ActionButton className="flex-1" onClick={onClose}>Listo</ActionButton>
      </div>
    </div>
  );
}