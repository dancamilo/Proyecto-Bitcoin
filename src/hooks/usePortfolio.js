import { useMemo } from "react";
import { useTransactions } from "@/hooks/useTransactions";
import { useMarketPrice } from "@/hooks/useMarketData";
import { computePortfolio } from "@/services/calculations";

export function usePortfolio() {
  const { transactions, isLoading: txLoading } = useTransactions();
  const market = useMarketPrice();

  const portfolio = useMemo(
    () => computePortfolio(transactions, market.data?.price),
    [transactions, market.data?.price]
  );

  return {
    ...portfolio,
    transactions,
    market: market.data,
    isLoading: txLoading || (market.isLoading && !market.data),
    isError: market.isError && !market.data,
    marketError: market.error,
  };
}
