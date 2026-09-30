import Field from "@/components/ui-kit/Field";
import Segmented from "@/components/ui-kit/Segmented";
import ActionButton from "@/components/ui-kit/ActionButton";
import LineItem from "@/components/ui-kit/LineItem";
import { formatBTC, formatUSD } from "@/utils/format";

const TYPES = [{ value: "buy", label: "Compra" }, { value: "sell", label: "Venta" }];

export default function TransactionForm({ form, setForm, errors, saving, preview, onSubmit }) {
  const set = (key) => (e) => setForm({ ...form, [key]: key === "date" ? e.target.value : e.target.value.replace(/[^0-9.]/g, "") });
  const isBuy = form.type === "buy";

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-4">
      <Segmented options={TYPES} value={form.type} onChange={(type) => setForm({ ...form, type })} label="Tipo de operación" fill />
      <Field id="tx-date" label="Fecha" type="date" value={form.date} max={new Date().toISOString().slice(0, 10)} onChange={set("date")} error={errors.date} />
      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          id="tx-amount"
          label={isBuy ? "Monto a invertir" : "BTC a vender"}
          prefix={isBuy ? "$" : undefined}
          suffix={isBuy ? undefined : <span className="text-xs text-muted-foreground">BTC</span>}
          inputMode="decimal" placeholder={isBuy ? "0.00" : "0.00000000"}
          value={form.amount} onChange={set("amount")} error={errors.amount}
        />
        <Field id="tx-price" label="Precio BTC (ejecución)" prefix="$" inputMode="decimal" placeholder="0.00" value={form.price} onChange={set("price")} error={errors.price} />
      </div>
      <Field id="tx-fee" label="Comisión (opcional)" prefix="$" inputMode="decimal" placeholder="Se calculará según tu plan" value={form.fee} onChange={set("fee")} hint="Si lo dejas vacío se usará tu configuración de comisiones." />

      {preview && (
        <dl className="surface-inset rounded-2xl px-4 divide-y divide-white/[0.05]">
          {isBuy ? (
            <>
              <LineItem label="Comisión aplicada" value={formatUSD(preview.fee)} />
              <LineItem label="BTC que recibirías" value={`${formatBTC(preview.btc)} BTC`} />
              <LineItem label="Coste total" value={formatUSD(preview.totalCharged)} />
            </>
          ) : (
            <>
              <LineItem label="Valor bruto" value={formatUSD(preview.gross)} />
              <LineItem label="Comisión aplicada" value={formatUSD(preview.fee)} />
              <LineItem label="Recibirías" value={formatUSD(preview.net)} />
            </>
          )}
        </dl>
      )}

      <ActionButton type="submit" size="lg" loading={saving} className="w-full">
        {saving ? "Registrando…" : isBuy ? "Registrar compra" : "Registrar venta"}
      </ActionButton>
    </form>
  );
}
