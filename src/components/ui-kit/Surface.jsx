import { cn } from "@/lib/utils";

export default function Surface({ as: Tag = "section", className, children, interactive = false, glow = false, ...props }) {
  return (
    <Tag
      className={cn(
        "surface relative isolate overflow-hidden rounded-[1.75rem] p-5 sm:p-6",
        interactive && "surface-interactive",
        className
      )}
      {...props}
    >
      {glow && (
        <div aria-hidden className="pointer-events-none absolute -right-32 -top-32 -z-10 h-72 w-72 rounded-full bg-btc/[0.12] blur-3xl" />
      )}
      {children}
    </Tag>
  );
}