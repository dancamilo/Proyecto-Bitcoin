// Ejecutar con: node --test tests/
// No requiere ninguna dependencia instalada (usa node:test, incluido en
// Node desde la v18). Ver punto 27 del encargo ("TESTS Y VALIDACIÓN").
import { test } from "node:test";
import assert from "node:assert/strict";
import {
  calculateBuy,
  calculateSell,
  computePortfolio,
  annotateTransactions,
  computeHistoricalScenario,
  simulateDca,
} from "../src/services/calculations.js";
import { parseUsdToCents, parseBtcToSats, proportion } from "../src/utils/money.js";

const STANDARD_PLAN = { rate: 0.3, min: 0.01, mode: "deduct" };

test("parseUsdToCents parsea sin floats", () => {
  assert.equal(parseUsdToCents("20"), 2000);
  assert.equal(parseUsdToCents("19.9"), 1990);
  assert.equal(parseUsdToCents("0.01"), 1);
  assert.equal(parseUsdToCents("1.005"), 100); // trunca, no redondea — 1.00
  assert.equal(parseUsdToCents(""), null);
  assert.equal(parseUsdToCents("abc"), null);
});

test("parseBtcToSats parsea 8 decimales exactos", () => {
  assert.equal(parseBtcToSats("0.0001994"), 19940);
  assert.equal(parseBtcToSats("1"), 100_000_000);
});

test("caso del encargo: compra de $20 a $100,000 con 0.30% de comisión", () => {
  // Ejemplo textual del encargo (punto 27):
  //   Compra $20, precio BTC $100,000, comisión 0.30%
  //   → comisión = $0.06, BTC = (20 - 0.06) / 100000 = 0.0001994
  const buy = calculateBuy({ usdInput: "20", pricePerBtcUsd: 100000, plan: STANDARD_PLAN });
  assert.equal(buy.fee, 0.06);
  assert.equal(buy.btc, 0.0001994);
  assert.equal(buy.totalCharged, 20);
});

test("comisión mínima se aplica cuando el % calculado es menor", () => {
  // $1 × 0.30% = $0.003 → por debajo del mínimo de $0.01, debe cobrar $0.01
  const buy = calculateBuy({ usdInput: "1", pricePerBtcUsd: 100000, plan: STANDARD_PLAN });
  assert.equal(buy.fee, 0.01);
});

test("modo 'add': la comisión se cobra ADEMÁS del monto, no se descuenta", () => {
  const plan = { rate: 1, min: 0, mode: "add" };
  const buy = calculateBuy({ usdInput: "100", pricePerBtcUsd: 100000, plan });
  assert.equal(buy.fee, 1); // 1% de 100
  assert.equal(buy.netCents, 10000); // los $100 completos van a BTC
  assert.equal(buy.totalCharged, 101); // pero se cobran $101 en total
  assert.equal(buy.btc, 0.001); // 100/100000
});

test("venta: bruto, comisión y neto", () => {
  const sell = calculateSell({ btcInput: "0.001", pricePerBtcUsd: 100000, plan: STANDARD_PLAN });
  assert.equal(sell.gross, 100); // 0.001 * 100000
  assert.equal(sell.fee, 0.3); // 0.30% de 100
  assert.equal(sell.net, 99.7);
});

test("proportion reparte coste proporcional sin overflow", () => {
  // 5000 centavos repartidos a partes iguales (500 de 1000 sats) → 2500
  assert.equal(proportion(5000, 500, 1000), 2500);
  assert.equal(proportion(0, 500, 1000), 0);
});

test("portfolio: dos compras, coste promedio y venta parcial con P/L realizado", () => {
  // Compra 1: $20 de BTC a $100,000 → fee $0.06, coste total $20, BTC = 0.0001994
  // Compra 2: $30 de BTC a $120,000 → fee $0.09, coste total $30, BTC = 0.0002493 (aprox)
  const buy1 = calculateBuy({ usdInput: "20", pricePerBtcUsd: 100000, plan: STANDARD_PLAN });
  const buy2 = calculateBuy({ usdInput: "30", pricePerBtcUsd: 120000, plan: STANDARD_PLAN });
  const tx1 = { id: "1", date: "2026-01-01", type: "buy", ...buy1 };
  const tx2 = { id: "2", date: "2026-01-08", type: "buy", ...buy2 };

  const investedSoFar = tx1.totalCharged + tx2.totalCharged; // 50
  const btcSoFar = tx1.btc + tx2.btc;

  // Vendemos la mitad del BTC acumulado a $150,000
  const halfBtc = btcSoFar / 2;
  const sell = calculateSell({ btcInput: halfBtc, pricePerBtcUsd: 150000, plan: STANDARD_PLAN });
  const tx3 = { id: "3", date: "2026-02-01", type: "sell", ...sell };

  const portfolio = computePortfolio([tx1, tx2, tx3], 150000);

  // Coste restante ≈ mitad de lo invertido (vendimos la mitad del BTC, coste promedio)
  assert.ok(Math.abs(portfolio.totalInvested - investedSoFar / 2) < 0.01);
  // BTC restante ≈ mitad
  assert.ok(Math.abs(portfolio.btcHeld - btcSoFar / 2) < 1e-8);
  // Con el precio subiendo de ~104k promedio a 150k, la venta debe arrojar ganancia realizada positiva
  assert.ok(portfolio.realizedPnl > 0);
  // El valor actual (mitad del BTC a 150k) debe ser mayor que el coste restante → ganancia no realizada positiva
  assert.ok(portfolio.unrealizedPnl > 0);
  assert.ok(portfolio.hasTransactions);
});

test("portfolio vacío no lanza error y devuelve ceros", () => {
  const portfolio = computePortfolio([], 100000);
  assert.equal(portfolio.btcHeld, 0);
  assert.equal(portfolio.totalInvested, 0);
  assert.equal(portfolio.avgPrice, 0);
  assert.equal(portfolio.hasTransactions, false);
});

test("escenario histórico: invertir hoy hace N días", () => {
  const series = [{ date: "2025-09-26", price: 60000 }, { date: "2026-09-26", price: 108000 }];
  const scenario = computeHistoricalScenario({ usd: "100", series, currentPrice: 108000, plan: STANDARD_PLAN });
  assert.equal(scenario.startPrice, 60000);
  assert.ok(scenario.changePct > 0);
  assert.ok(scenario.value > 100);
});

test("annotateTransactions: compra sube de precio (no realizada) y venta con ganancia realizada", () => {
  // Compra a 100,000; precio actual 150,000 → +50% no realizada
  const buy = calculateBuy({ usdInput: "100", pricePerBtcUsd: 100000, plan: STANDARD_PLAN });
  const tx1 = { id: "1", date: "2026-01-01", type: "buy", ...buy };
  const [annotatedBuy] = annotateTransactions([tx1], 150000);
  assert.equal(annotatedBuy.resultKind, "unrealized");
  assert.ok(Math.abs(annotatedBuy.resultPct - 50) < 0.01);

  // Compramos a 100,000 y vendemos TODO a 200,000 → +100% realizada
  const sell = calculateSell({ btcInput: buy.btc, pricePerBtcUsd: 200000, plan: STANDARD_PLAN });
  const tx2 = { id: "2", date: "2026-02-01", type: "sell", ...sell };
  const [, annotatedSell] = annotateTransactions([tx1, tx2], 200000);
  assert.equal(annotatedSell.resultKind, "realized");
  // No es exactamente +100%: el coste base incluye la comisión de compra
  // (se pagó $100 por solo 0.000997 BTC), así que el coste efectivo por
  // BTC es algo mayor a 100,000 → el resultado real es ~99.4%, no 100%.
  assert.ok(Math.abs(annotatedSell.resultPct - 99.4) < 0.5);
  assert.ok(annotatedSell.realizedPnl > 0);
});

test("simulador DCA acumula BTC en cada compra periódica", () => {
  // 30 días de precio constante, compra semanal de $10 → 5 compras (días 0,7,14,21,28)
  const dailySeries = Array.from({ length: 30 }, (_, i) => ({
    date: `2026-01-${String(i + 1).padStart(2, "0")}`,
    price: 100000,
  }));
  const result = simulateDca({ amount: "10", frequency: "weekly", dailySeries, plan: STANDARD_PLAN });
  assert.equal(result.purchases, 5);
  assert.ok(Math.abs(result.invested - 50) < 0.01);
  assert.equal(result.series.length, 5);
});
