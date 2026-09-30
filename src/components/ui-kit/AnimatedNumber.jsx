import { useEffect, useRef } from "react";
import { animate, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";
import { EASE } from "@/charts/theme";

// Número que aparece suavemente (count-up). Sin animación con reduced-motion.
export default function AnimatedNumber({ value, format = (v) => v.toFixed(2), duration = 1, className }) {
  const ref = useRef(null);
  const prev = useRef(0);
  const reduce = useReducedMotion();

  useEffect(() => {
    const node = ref.current;
    if (reduce) {
      node.textContent = format(value);
      prev.current = value;
      return;
    }
    const controls = animate(prev.current, value, {
      duration,
      ease: EASE,
      onUpdate: (v) => { node.textContent = format(v); },
    });
    prev.current = value;
    return () => controls.stop();
  }, [value, reduce]);

  return <span ref={ref} className={cn("tabular-nums", className)}>{format(reduce ? value : 0)}</span>;
}