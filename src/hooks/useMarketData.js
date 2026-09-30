import { useQuery } from "@tanstack/react-query";
import { fetchCurrentMarket, fetchHistoricalSeries, fetchDailySeries, fetchSeriesRange } from "@/services/marketService";
import { getCachedMarket, setCachedMarket } from "@/services/storageService";
import { usePreferences } from "@/hooks/usePreferences";

/**
 * Precio de mercado actual, con actualización automática periódica (punto
 * 6). El intervalo es configurable desde Ajustes (usePreferences) y puede
 * desactivarse. Si la petición falla (sin conexión, límite de peticiones,
 * API caída) React Query conserva el último dato bueno en `data` — y si
 * es la primera carga de la sesión, se usa el último snapshot guardado en
 * localStorage como `placeholderData` para no arrancar en blanco.
 */
export function useMarketPrice() {
  const { preferences } = usePreferences();
  return useQuery({
    queryKey: ["market", "current"],
    queryFn: async () => {
      const data = await fetchCurrentMarket();
      setCachedMarket(data);
      return data;
    },
    refetchInterval: preferences.autoRefresh ? preferences.refreshIntervalMs : false,
    refetchOnWindowFocus: true,
    staleTime: 15_000,
    retry: 2,
    placeholderData: () => getCachedMarket() ?? undefined,
  });
}

/** Serie histórica para uno de los rangos fijos del selector (24H/7D/30D/90D/1Y). */
export function useMarketHistory(range) {
  return useQuery({
    queryKey: ["market", "history", range],
    queryFn: () => fetchHistoricalSeries(range),
    staleTime: 5 * 60_000,
    retry: 1,
  });
}

/** Serie diaria de los últimos `days` días — usada por el simulador DCA. */
export function useDailyHistory(days) {
  return useQuery({
    queryKey: ["market", "daily", days],
    queryFn: () => fetchDailySeries(days),
    staleTime: 5 * 60_000,
    retry: 1,
    enabled: days > 0,
  });
}

/** Serie entre una fecha concreta y hoy — usada por el escenario con fecha personalizada. */
export function useSeriesRange(fromDate) {
  return useQuery({
    queryKey: ["market", "range", fromDate],
    queryFn: () => fetchSeriesRange(fromDate),
    staleTime: 5 * 60_000,
    retry: 1,
    enabled: Boolean(fromDate),
  });
}
