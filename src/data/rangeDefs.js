// Definiciones de rangos y periodos: solo clave/etiqueta/días. Los VALORES
// (precio, variación, máximos, mínimos...) ya no viven aquí — se calculan
// en tiempo real a partir de lo que devuelve src/services/marketService.js
// (ver src/hooks/useMarketData.js y src/pages/Market.jsx).

export const MARKET_RANGES = [
  { key: "24H", label: "Últimas 24 horas", days: 1 },
  { key: "7D", label: "Últimos 7 días", days: 7 },
  { key: "30D", label: "Últimos 30 días", days: 30 },
  { key: "90D", label: "Últimos 90 días", days: 90 },
  { key: "1Y", label: "Último año", days: 365 },
];

export const PRICE_AVERAGES = [
  { days: 7, label: "7 días" },
  { days: 30, label: "30 días" },
  { days: 90, label: "90 días" },
  { days: 200, label: "200 días" },
];

export const HISTORICAL_PERIODS = [
  { key: "7D", label: "7 días", phrase: "hace 7 días", days: 7 },
  { key: "30D", label: "30 días", phrase: "hace 30 días", days: 30 },
  { key: "90D", label: "90 días", phrase: "hace 90 días", days: 90 },
  { key: "1Y", label: "1 año", phrase: "hace 1 año", days: 365 },
  { key: "custom", label: "Fecha", phrase: "en la fecha elegida", days: null },
];

export const DCA_OPTIONS = {
  frequencies: [
    { value: "daily", label: "Diaria" },
    { value: "weekly", label: "Semanal" },
    { value: "biweekly", label: "Quincenal" },
    { value: "monthly", label: "Mensual" },
  ],
  // days: cuántos días de histórico hacen falta para simular ese periodo.
  // 24 meses se deja disponible en la UI pero se limita internamente a
  // MAX_HISTORY_DAYS (ver marketService.js) — el plan gratuito de datos no
  // ofrece más de ~1 año, así que una simulación de 24 meses usará el año
  // de histórico disponible en vez de fallar.
  periods: [
    { value: 3, label: "3 meses", days: 90 },
    { value: 6, label: "6 meses", days: 182 },
    { value: 12, label: "12 meses", days: 365 },
    { value: 24, label: "24 meses", days: 365 },
  ],
};
