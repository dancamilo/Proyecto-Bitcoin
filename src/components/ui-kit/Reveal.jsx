import { motion } from "framer-motion";
import { EASE } from "@/charts/theme";

// Entrada progresiva: fade + leve desplazamiento. Respeta reduced-motion vía MotionConfig.
export default function Reveal({ children, delay = 0, className }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}