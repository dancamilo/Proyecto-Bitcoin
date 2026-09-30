import { AnimatePresence, motion } from "framer-motion";
import { WifiOff } from "lucide-react";
import useOnlineStatus from "@/hooks/useOnlineStatus";

export default function OfflineBanner() {
  const online = useOnlineStatus();
  return (
    <AnimatePresence>
      {!online && (
        <motion.div
          role="status"
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="overflow-hidden border-b border-warn/20 bg-warn/10"
        >
          <p className="mx-auto flex max-w-[1320px] items-center gap-2 px-4 py-2.5 text-xs text-warn sm:px-6 lg:px-10">
            <WifiOff className="h-3.5 w-3.5" aria-hidden />
            Sin conexión · Mostrando los últimos datos disponibles.
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}