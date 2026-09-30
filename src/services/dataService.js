// ─────────────────────────────────────────────────────────────
// Config estática de la app (sin datos de mercado ni operaciones —
// esos viven en marketService.js / storageService.js y se consumen vía
// los hooks de src/hooks/). Este archivo solo expone listas fijas que
// alimentan selectores y contenido de la UI.
// ─────────────────────────────────────────────────────────────
import { EDUCATION_TOPICS } from "@/data/educationTopics";
import { MARKET_RANGES, PRICE_AVERAGES, HISTORICAL_PERIODS, DCA_OPTIONS } from "@/data/rangeDefs";

export const getEducationTopics = () => EDUCATION_TOPICS;
export const getMarketRangeDefs = () => MARKET_RANGES;
export const getPriceAverageDefs = () => PRICE_AVERAGES;
export const getHistoricalPeriodDefs = () => HISTORICAL_PERIODS;
export const getDcaOptions = () => DCA_OPTIONS;
