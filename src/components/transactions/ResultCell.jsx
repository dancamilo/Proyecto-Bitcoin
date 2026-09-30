import Delta from "@/components/ui-kit/Delta";

export default function ResultCell({ tx }) {
  return (
    <span className="inline-flex flex-col items-end gap-0.5">
      <Delta value={tx.resultPct} size="xs" />
      <span className="text-[10.5px] text-muted-foreground">{tx.resultKind === "realized" ? "Realizada" : "No realizada"}</span>
    </span>
  );
}