// ─────────────────────────────────────────────────────────────
// PRECISIÓN FINANCIERA (ver punto 21 del encargo)
//
// Por qué enteros y no floats:
// JavaScript representa los números en coma flotante binaria (IEEE 754),
// por lo que sumas repetidas de valores como 0.1 + 0.2 acumulan error
// (0.1 + 0.2 !== 0.3). En una cartera con decenas de operaciones, sumar
// USD y BTC como floats directamente arrastra ese error cada vez más.
//
// La solución sin añadir ninguna librería externa: guardar y sumar el
// dinero y el BTC como ENTEROS en su unidad atómica real:
//   - USD  → centavos (1 USD = 100 centavos)
//   - BTC  → satoshis (1 BTC = 100,000,000 sats — la unidad más pequeña
//            que Bitcoin puede representar; no existen fracciones de sat)
//
// Sumar/restar enteros en JS siempre es exacto. La única operación que
// sigue necesitando una división real (USD ÷ precio = BTC, o BTC × precio
// = USD) se redondea EXACTAMENTE en el límite de la unidad atómica
// correspondiente (al satoshi más cercano, o al centavo más cercano).
// Eso no es "perder precisión": es la precisión real del sistema — no
// existe un pago de medio centavo ni una fracción de satoshi.
//
// El redondeo a más decimales de los necesarios (ej. mostrar solo 2
// decimales en pantalla) ocurre exclusivamente en la capa de presentación
// (src/utils/format.js), nunca aquí.
// ─────────────────────────────────────────────────────────────

export const SATS_PER_BTC = 100_000_000;
export const CENTS_PER_USD = 100;

/**
 * Convierte un string de entrada de usuario ("20", "19.9", "0.005") a
 * centavos enteros SIN pasar por parseFloat, para no depender de cómo el
 * motor de JS redondea la representación binaria del número. Trabaja
 * directamente sobre el texto.
 * Trunca (no redondea) a 2 decimales: es el comportamiento esperado al
 * escribir dinero — "19.999" son "19.99" centavos, no 20.00.
 * Devuelve null si el texto no es un número válido no negativo.
 */
export function parseUsdToCents(input) {
  const s = String(input ?? "").trim();
  if (s === "" || s === ".") return null;
  if (!/^\d*\.?\d*$/.test(s)) return null;
  const [intPartRaw, fracPartRaw = ""] = s.split(".");
  const intPart = intPartRaw === "" ? "0" : intPartRaw;
  const frac = (fracPartRaw + "00").slice(0, 2);
  const cents = parseInt(intPart, 10) * CENTS_PER_USD + parseInt(frac, 10);
  return Number.isFinite(cents) ? cents : null;
}

/** Igual que parseUsdToCents pero para cantidades de BTC (8 decimales → satoshis). */
export function parseBtcToSats(input) {
  const s = String(input ?? "").trim();
  if (s === "" || s === ".") return null;
  if (!/^\d*\.?\d*$/.test(s)) return null;
  const [intPartRaw, fracPartRaw = ""] = s.split(".");
  const intPart = intPartRaw === "" ? "0" : intPartRaw;
  const frac = (fracPartRaw + "00000000").slice(0, 8);
  const sats = parseInt(intPart, 10) * SATS_PER_BTC + parseInt(frac, 10);
  return Number.isFinite(sats) ? sats : null;
}

export const centsToUsd = (cents) => cents / CENTS_PER_USD;
export const usdToCents = (usd) => Math.round(usd * CENTS_PER_USD);
export const satsToBtc = (sats) => sats / SATS_PER_BTC;
export const btcToSats = (btc) => Math.round(btc * SATS_PER_BTC);

/**
 * USD (en centavos) que se obtienen `sats` satoshis a un precio de mercado
 * `pricePerBtcUsd`. Único punto de redondeo: al centavo más cercano.
 */
export function satsToGrossCents(sats, pricePerBtcUsd) {
  return Math.round(((sats / SATS_PER_BTC) * pricePerBtcUsd) * CENTS_PER_USD);
}

/**
 * Satoshis que se obtienen con `cents` centavos a un precio de mercado
 * `pricePerBtcUsd`. Único punto de redondeo: al satoshi más cercano.
 */
export function centsToSats(cents, pricePerBtcUsd) {
  if (!pricePerBtcUsd) return 0;
  return Math.round(((cents / CENTS_PER_USD) / pricePerBtcUsd) * SATS_PER_BTC);
}

/**
 * Reparte `totalCents` proporcionalmente a `part` sobre `whole` (todos
 * enteros) sin perder precisión: usa BigInt para la multiplicación
 * intermedia, que en Number podría exceder 2^53 en carteras muy grandes.
 */
export function proportion(totalCents, part, whole) {
  if (whole === 0) return 0;
  const result = (BigInt(totalCents) * BigInt(part)) / BigInt(whole);
  return Number(result);
}

export const clampMin0 = (n) => (n < 0 ? 0 : n);
