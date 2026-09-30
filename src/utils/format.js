import { APP_CONFIG } from "@/config/app";

const { locale, currency } = APP_CONFIG;
const MINUS = "−";

const usd = new Intl.NumberFormat(locale, { style: "currency", currency, minimumFractionDigits: 2, maximumFractionDigits: 2 });
const usd0 = new Intl.NumberFormat(locale, { style: "currency", currency, maximumFractionDigits: 0 });

export const formatUSD = (v) => usd.format(v);
export const formatUSDCompact = (v) => usd0.format(v);
export const formatSignedUSD = (v) => `${v >= 0 ? "+" : MINUS}${usd.format(Math.abs(v))}`;
export const formatBTC = (v, digits = 8) => Number(v).toFixed(digits);
export const formatSats = (btc) => Math.round(btc * 1e8).toLocaleString(locale);
export const formatPct = (v, digits = 2) => `${v >= 0 ? "+" : MINUS}${Math.abs(v).toFixed(digits)}%`;

export const formatDate = (iso, opts = { day: "2-digit", month: "short", year: "numeric" }) =>
  new Date(iso).toLocaleDateString("es-ES", opts);

export const formatTime = (iso) =>
  new Date(iso).toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" });

export const formatAxisDate = (iso, range) => {
  if (range === "7D") return formatDate(iso, { weekday: "short", day: "numeric" });
  if (range === "1Y") return formatDate(iso, { month: "short" });
  return formatDate(iso, { day: "numeric", month: "short" });
};