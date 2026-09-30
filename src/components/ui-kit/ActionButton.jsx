import { forwardRef } from "react";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const VARIANTS = {
  primary: "bg-btc text-black hover:bg-[#FFA53A] shadow-[0_10px_30px_-10px_hsl(var(--btc)/0.7)] hover:shadow-[0_14px_36px_-10px_hsl(var(--btc)/0.85)]",
  secondary: "bg-white/[0.06] text-foreground ring-1 ring-inset ring-white/[0.08] hover:bg-white/[0.1] hover:ring-white/[0.14]",
  ghost: "text-muted-foreground hover:bg-white/[0.05] hover:text-foreground",
};
const SIZES = {
  sm: "h-9 px-3.5 text-sm",
  md: "h-11 px-5 text-sm",
  lg: "h-12 px-6 text-[15px]",
};

const ActionButton = forwardRef(function ActionButton(
  { variant = "primary", size = "md", icon: Icon, loading = false, children, className, disabled, type = "button", ...props },
  ref
) {
  return (
    <motion.button
      ref={ref}
      type={type}
      whileTap={{ scale: 0.97 }}
      disabled={loading || disabled}
      aria-busy={loading || undefined}
      className={cn(
        "inline-flex select-none items-center justify-center gap-2 whitespace-nowrap rounded-full font-medium transition-[background-color,box-shadow,color] duration-200 disabled:pointer-events-none disabled:opacity-50",
        SIZES[size],
        VARIANTS[variant],
        className
      )}
      {...props}
    >
      {loading ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : Icon && <Icon className="h-4 w-4" aria-hidden />}
      {children}
    </motion.button>
  );
});

export default ActionButton;