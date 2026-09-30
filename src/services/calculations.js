// ─────────────────────────────────────────────────────────────
// LÓGICA FINANCIERA — funciones puras, sin efectos secundarios, fáciles
// de testear de forma aislada (ver /tests/calculations.test.mjs).
//
// Todo el dinero entra y sale de aquí en USD/BTC "humanos" (números), pero
// internamente se opera en centavos/satoshis (src/utils/money.js) para que
// las sumas nunca acumulen error de coma flotante.
// ─────────────────────────────────────────────────────────────
// Import relativo (no "@/...") a propósito: así este módulo y money.js se
// pueden ejecutar con `node --test` sin depender del resolvedor de alias de
// Vite — ver tests/calculations.test.mjs.
import {
  parseUsdToCents,
  parseBtcToSats,
  usdToCents,
  centsToUsd,
  satsToBtc,
  btcToSats,
  satsToGrossCents,
  centsToSats,
  proportion,
  clampMin0,
  SATS_PER_BTC,
} from "../utils/money.js";

/**
 * Plan de comisión configurable (ver punto 11 del encargo):
 *  - rate: porcentaje (ej. 0.3 = 0.30%)
 *  - min:  comisión mínima en USD
 *  - mode: "deduct" → la comisión se descuenta del monto introducido
 *                      (compras: recibes menos BTC; ventas: recibes menos USD)
 *          "add"    → (solo compras) la comisión se cobra ADEMÁS del monto;
 *                      el monto completo se destina a comprar BTC
 */
export const DEFAULT_FEE_PLAN = { id: "standard", rate: 0.3, min: 0.01, mode: "deduct" };

export function calcFeeCents(grossCents, plan) {
  const raw = Math.round(grossCents * (plan.rate / 100));
  const minCents = usdToCents(plan.min);
  return Math.max(raw, minCents, 0);
}

/**
 * Estima/registra una COMPRA.
 * `usdInput` puede ser un string (del formulario, se parsea sin pasar por
 * parseFloat) o un number (ej. desde los botones de monto rápido).
 */
export function calculateBuy({ usdInput, pricePerBtcUsd, plan = DEFAULT_FEE_PLAN }) {
  const usdCents = typeof usdInput === "number" ? Math.round(usdInput * 100) : parseUsdToCents(usdInput);
  if (usdCents == null || usdCents <= 0 || !pricePerBtcUsd) return null;

  const feeCents = calcFeeCents(usdCents, plan);
  const netCents = plan.mode === "add" ? usdCents : clampMin0(usdCents - feeCents);
  const totalChargedCents = plan.mode === "add" ? usdCents + feeCents : usdCents;
  const sats = centsToSats(netCents, pricePerBtcUsd);

  return {
    usdCents, feeCents, netCents, totalChargedCents, sats, price: pricePerBtcUsd,
    usd: centsToUsd(usdCents), fee: centsToUsd(feeCents), net: centsToUsd(netCents),
    btc: satsToBtc(sats), totalCharged: centsToUsd(totalChargedCents),
  };
}

/** Estima/registra una VENTA. `btcInput` string o number (BTC). */
export function calculateSell({ btcInput, pricePerBtcUsd, plan = DEFAULT_FEE_PLAN }) {
  const sats = typeof btcInput === "number" ? btcToSats(btcInput) : parseBtcToSats(btcInput);
  if (sats == null || sats <= 0 || !pricePerBtcUsd) return null;

  const grossCents = satsToGrossCents(sats, pricePerBtcUsd);
  const feeCents = calcFeeCents(grossCents, plan);
  const netCents = clampMin0(grossCents - feeCents);

  return {
    sats, grossCents, feeCents, netCents, price: pricePerBtcUsd,
    btc: satsToBtc(sats), gross: centsToUsd(grossCents), fee: centsToUsd(feeCents), net: centsToUsd(netCents),
  };
}

/**
 * Recorre el historial de operaciones en orden cronológico manteniendo el
 * estado de COSTE PROMEDIO (Average Cost Basis, ver punto 14): cada venta
 * libera BTC y coste proporcionalmente al promedio de lo que quedaba en
 * cartera en ese momento — no se usa FIFO ni ningún otro método; se eligió
 * Average Cost por ser el más simple de auditar a mano para una cartera
 * personal. Es el único lugar donde vive esta lógica: tanto
 * `computePortfolio` (el agregado final) como `annotateTransactions` (el
 * detalle por fila del historial) se derivan de este mismo recorrido, para
 * que nunca puedan quedar desincronizados entre sí.
 */
function walkTransactions(transactions) {
  const sorted = [...transactions].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime() || String(a.id).localeCompare(String(b.id))
  );

  let investedCents = 0; // coste (base) de lo que queda en cartera ahora mismo
  let satsHeld = 0;
  let realizedPnlCents = 0;
  let feesPaidCents = 0;
  const annotated = [];

  for (const tx of sorted) {
    feesPaidCents += tx.feeCents ?? 0;
    if (tx.type === "buy") {
      investedCents += tx.totalChargedCents ?? tx.usdCents ?? 0;
      satsHeld += tx.sats ?? 0;
      annotated.push({ ...tx, resultKind: "unrealized" });
    } else {
      const satsSold = Math.min(tx.sats ?? 0, satsHeld);
      const avgCostBeforeSale = satsHeld > 0 ? investedCents / satsHeld : 0; // centavos por sat, justo antes de esta venta
      const costBasisSoldCents = proportion(investedCents, satsSold, satsHeld || 1);
      investedCents = clampMin0(investedCents - costBasisSoldCents);
      satsHeld = clampMin0(satsHeld - satsSold);
      const realizedForTx = (tx.netCents ?? 0) - costBasisSoldCents;
      realizedPnlCents += realizedForTx;
      annotated.push({
        ...tx,
        resultKind: "realized",
        realizedPnlCents: realizedForTx,
        costBasisPerBtcAtSale: avgCostBeforeSale > 0 ? centsToUsd(avgCostBeforeSale * SATS_PER_BTC) : 0,
      });
    }
  }

  return { annotated, investedCents, satsHeld, realizedPnlCents, feesPaidCents };
}

/**
 * Devuelve las operaciones (orden cronológico) con el resultado de cada
 * una: para una compra, la variación del precio actual frente al precio de
 * esa compra ("no realizada"); para una venta, el resultado ya fijado
 * frente al coste promedio que tenía la cartera en el momento de vender
 * ("realizada", ver punto 15). Es lo que alimenta la columna "Resultado"
 * del historial de operaciones.
 */
export function annotateTransactions(transactions, currentPricePerBtc) {
  const { annotated } = walkTransactions(transactions);
  return annotated.map((tx) => {
    if (tx.resultKind === "unrealized") {
      const resultPct = tx.price > 0 && currentPricePerBtc ? (currentPricePerBtc / tx.price - 1) * 100 : 0;
      return { ...tx, resultPct };
    }
    const resultPct = tx.costBasisPerBtcAtSale > 0 ? (tx.price / tx.costBasisPerBtcAtSale - 1) * 100 : 0;
    return { ...tx, resultPct, realizedPnl: centsToUsd(tx.realizedPnlCents) };
  });
}

/**
 * Recalcula el portfolio completo (agregado) a partir del historial de
 * operaciones y el precio actual. Separa Realized P/L (de ventas ya
 * ejecutadas, no cambia con el precio) de Unrealized P/L (de lo que aún se
 * tiene, ver punto 15).
 */
export function computePortfolio(transactions, currentPricePerBtc) {
  const { investedCents, satsHeld, realizedPnlCents, feesPaidCents } = walkTransactions(transactions);
  const btcHeld = satsToBtc(satsHeld);
  const totalInvested = centsToUsd(investedCents);
  const avgPrice = satsHeld > 0 ? totalInvested / btcHeld : 0;
  const currentValueCents = currentPricePerBtc ? satsToGrossCents(satsHeld, currentPricePerBtc) : 0;
  const currentValue = centsToUsd(currentValueCents);
  const unrealizedPnl = currentValue - totalInvested;
  const pnlPct = totalInvested > 0 ? (unrealizedPnl / totalInvested) * 100 : 0;

  return {
    currentValue,
    totalInvested,
    pnlAbs: unrealizedPnl,
    pnlPct,
    btcHeld,
    avgPrice,
    feesPaid: centsToUsd(feesPaidCents),
    realizedPnl: centsToUsd(realizedPnlCents),
    unrealizedPnl,
    hasHoldings: satsHeld > 0,
    hasTransactions: transactions.length > 0,
  };
}

/**
 * Escenario histórico hipotético (punto 18): "¿qué habría pasado si
 * hubiera invertido X hace Y?". `series` es el histórico real de precios
 * [{date, price}] para el periodo elegido; se usa su primer punto como
 * precio de entrada. Nunca se presenta como predicción, solo como cálculo
 * retrospectivo con datos reales.
 */
export function computeHistoricalScenario({ usd, series, currentPrice, plan = DEFAULT_FEE_PLAN }) {
  if (!series?.length || !currentPrice) return null;
  const startPrice = series[0].price;
  const buy = calculateBuy({ usdInput: usd, pricePerBtcUsd: startPrice, plan });
  if (!buy) return null;
  const value = satsToBtc(buy.sats) * currentPrice;
  const changePct = ((value - buy.totalCharged) / buy.totalCharged) * 100;
  return { usd, startPrice, endPrice: currentPrice, btc: satsToBtc(buy.sats), value, changePct, series };
}

const FREQUENCY_DAYS = { daily: 1, weekly: 7, biweekly: 14, monthly: 30 };

/**
 * Simulador DCA (punto 19). Recorre el histórico real `dailySeries`
 * ([{date, price}], un punto por día) y "compra" en cada fecha que
 * corresponda según la frecuencia elegida, aplicando la misma lógica de
 * comisiones que una compra manual. Devuelve además la serie para el
 * gráfico (valor de mercado del BTC acumulado vs. total invertido, ambos
 * recalculados en cada fecha con el precio real de ese día).
 */
export function simulateDca({ amount, frequency, dailySeries, plan = DEFAULT_FEE_PLAN }) {
  if (!dailySeries?.length) return null;
  const stepDays = FREQUENCY_DAYS[frequency] ?? 7;

  let investedCents = 0;
  let sats = 0;
  let purchases = 0;
  const series = [];

  for (let i = 0; i < dailySeries.length; i += stepDays) {
    const point = dailySeries[i];
    const buy = calculateBuy({ usdInput: amount, pricePerBtcUsd: point.price, plan });
    if (!buy) continue;
    investedCents += buy.totalChargedCents;
    sats += buy.sats;
    purchases += 1;
    series.push({ date: point.date, invested: centsToUsd(investedCents), value: satsToBtc(sats) * point.price, price: point.price });
  }

  // Marca a mercado con el último precio real disponible de la serie,
  // aunque no haya caído exactamente en una fecha de compra.
  const lastPrice = dailySeries[dailySeries.length - 1].price;
  if (series.length) series[series.length - 1] = { ...series[series.length - 1], value: satsToBtc(sats) * lastPrice, price: lastPrice };

  const invested = centsToUsd(investedCents);
  const btc = satsToBtc(sats);
  const value = btc * lastPrice;
  return {
    series, invested, btc, value, purchases,
    avgPrice: btc > 0 ? invested / btc : 0,
    changePct: invested > 0 ? ((value - invested) / invested) * 100 : 0,
  };
}
