// ─────────────────────────────────────────────────────────────
// MARKET SEAM (punto 5 y 7 del encargo) — único punto de acceso a datos
// de mercado. Ningún componente llama a `fetch` directamente: todos pasan
// por las funciones de este archivo.
//
// Proveedor elegido: CoinGecko, API pública ("Keyless Public API",
// https://docs.coingecko.com/docs/keyless-public-api) — sin registro, sin
// API key, sin secretos que proteger (importante: punto 22, esta app se
// publica en GitHub Pages, un hosting público, así que no puede depender
// de ninguna clave privada).
//
// Límite conocido del plan gratuito/sin clave (documentado aquí para quien
// mantenga esto en el futuro): ~10-30 peticiones/min compartidas por IP, y
// ~1 año de histórico diario. Por eso: (a) el precio se actualiza por
// sondeo (polling) cada 60s por defecto y no en cada render — ver
// src/hooks/useMarketData.js — y (b) MAX_HISTORY_DAYS limita cuánto
// histórico se pide.
//
// Para cambiar de proveedor en el futuro (ej. a un plan de pago, u otra
// API): solo hay que reescribir las funciones de este archivo manteniendo
// la misma forma de los datos que devuelven — nada más en la app cambia.
// ─────────────────────────────────────────────────────────────

const BASE_URL = "https://api.coingecko.com/api/v3";
const COIN_ID = "bitcoin";
const VS_CURRENCY = "usd";
const REQUEST_TIMEOUT_MS = 12_000;

export const MAX_HISTORY_DAYS = 365;
const RANGE_TO_DAYS = { "24H": 1, "7D": 7, "30D": 30, "90D": 90, "1Y": MAX_HISTORY_DAYS };

class MarketApiError extends Error {
  constructor(message, status) {
    super(message);
    this.name = "MarketApiError";
    this.status = status;
  }
}

async function fetchJson(url) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    const res = await fetch(url, { signal: controller.signal });
    if (!res.ok) {
      throw new MarketApiError(
        res.status === 429 ? "Límite de peticiones alcanzado" : `Error de la API de mercado (${res.status})`,
        res.status
      );
    }
    return await res.json();
  } catch (err) {
    if (err.name === "AbortError") throw new MarketApiError("Tiempo de espera agotado", 0);
    throw err;
  } finally {
    clearTimeout(timeout);
  }
}

/** Snapshot actual: precio, variación 24h, máximo/mínimo 24h y sparkline 7D. */
export async function fetchCurrentMarket() {
  const url = `${BASE_URL}/coins/markets?vs_currency=${VS_CURRENCY}&ids=${COIN_ID}&sparkline=true&price_change_percentage=24h`;
  const [data] = await fetchJson(url);
  if (!data) throw new MarketApiError("Sin datos de mercado", 0);
  return {
    symbol: "BTC",
    name: "Bitcoin",
    price: data.current_price,
    change24hPct: data.price_change_percentage_24h ?? 0,
    change24hAbs: data.price_change_24h ?? 0,
    high24h: data.high_24h,
    low24h: data.low_24h,
    updatedAt: data.last_updated,
    sparkline: data.sparkline_in_7d?.price ?? [],
  };
}

/** Serie histórica [{date, price}] para uno de los rangos fijos de la UI. */
export async function fetchHistoricalSeries(range) {
  const days = RANGE_TO_DAYS[range] ?? 30;
  const url = `${BASE_URL}/coins/${COIN_ID}/market_chart?vs_currency=${VS_CURRENCY}&days=${days}`;
  const data = await fetchJson(url);
  return (data.prices ?? []).map(([ts, price]) => ({ date: new Date(ts).toISOString(), price }));
}

/** Serie diaria (un punto por día) para los últimos `days` días — usada por el simulador DCA. */
export async function fetchDailySeries(days) {
  const clamped = Math.max(2, Math.min(days, MAX_HISTORY_DAYS));
  const url = `${BASE_URL}/coins/${COIN_ID}/market_chart?vs_currency=${VS_CURRENCY}&days=${clamped}&interval=daily`;
  const data = await fetchJson(url);
  return (data.prices ?? []).map(([ts, price]) => ({ date: new Date(ts).toISOString(), price }));
}

/** Serie entre dos fechas arbitrarias — usada por el escenario histórico con fecha personalizada. */
export async function fetchSeriesRange(fromDate, toDate = new Date()) {
  const from = Math.floor(new Date(fromDate).getTime() / 1000);
  const to = Math.floor(new Date(toDate).getTime() / 1000);
  const url = `${BASE_URL}/coins/${COIN_ID}/market_chart/range?vs_currency=${VS_CURRENCY}&from=${from}&to=${to}`;
  const data = await fetchJson(url);
  return (data.prices ?? []).map(([ts, price]) => ({ date: new Date(ts).toISOString(), price }));
}

export { MarketApiError };
