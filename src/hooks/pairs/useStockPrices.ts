import { useQuery } from '@tanstack/react-query';
import { fetchStockPrices } from '@/services/pairs/api';
import type { AnalysisPeriod, StockPriceResponse } from '@/types/pairs';
import { QUERY_KEYS, STOCK_PRICES_STALE_TIME } from '@/lib/pairs/constants';

/**
 * Hook to fetch stock prices for multiple stocks
 */
export const useStockPrices = (
  stockIds: string[],
  period: AnalysisPeriod,
  enabled: boolean = true
) => {
  return useQuery<StockPriceResponse>({
    queryKey: QUERY_KEYS.stockPrices(stockIds, period),
    queryFn: () => fetchStockPrices(stockIds, period),
    enabled: enabled && stockIds.length > 0,
    staleTime: STOCK_PRICES_STALE_TIME,
    gcTime: 30 * 60 * 1000, // 30 minutes
  });
};

/**
 * Hook to manually fetch stock prices (for calculate button)
 */
export const useFetchStockPrices = () => {
  return {
    fetchPrices: async (stockIds: string[], period: AnalysisPeriod) => {
      return fetchStockPrices(stockIds, period);
    },
  };
};
