import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import ChartSkeleton from "@/components/charts/ChartSkeleton";
import { ErrorState, NoDataState } from "@/components/states/presets";

// Marco de gráficos con estados: ready · loading · empty · error.
export default function ChartContainer({ status = "ready", onRetry, className, children }) {
  const fade = { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, transition: { duration: 0.2 } };
  return (
    <div className={cn("relative h-[240px] sm:h-[300px]", className)}>
      <AnimatePresence mode="wait" initial={false}>
        <motion.div key={status} className="absolute inset-0" {...fade}>
          {status === "loading" && <ChartSkeleton />}
          {status === "error" && <ErrorState compact title="No se pudo cargar el gráfico" onRetry={onRetry} />}
          {status === "empty" && <NoDataState compact />}
          {status === "ready" && children}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}