import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

// Input con estados: default · hover · focus · filled · error · disabled.
export default function Field({ id, label, prefix, suffix, hint, error, className, inputClassName, srOnlyLabel = false, ...props }) {
  const describedBy = error ? `${id}-error` : hint ? `${id}-hint` : undefined;
  return (
    <div className={cn("space-y-2", className)}>
      <label htmlFor={id} className={cn("block text-xs font-medium text-muted-foreground", srOnlyLabel && "sr-only")}>
        {label}
      </label>
      <div className={cn("field", error && "field-error", props.disabled && "cursor-not-allowed opacity-50")}>
        {prefix && <span className="shrink-0 text-muted-foreground">{prefix}</span>}
        <input
          id={id}
          aria-invalid={!!error}
          aria-describedby={describedBy}
          placeholder=" "
          className={cn("min-w-0 flex-1 bg-transparent tabular-nums outline-none placeholder:text-muted-foreground/40 disabled:cursor-not-allowed", inputClassName)}
          {...props}
        />
        {suffix}
      </div>
      {error ? (
        <p id={`${id}-error`} role="alert" className="flex items-center gap-1.5 text-xs text-loss">
          <AlertCircle className="h-3.5 w-3.5 shrink-0" aria-hidden />
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className="text-xs text-muted-foreground">{hint}</p>
      ) : null}
    </div>
  );
}