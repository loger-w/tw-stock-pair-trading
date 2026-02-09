import { useQuery } from '@tanstack/react-query';
import { DISPOSAL_QUERY_KEYS } from '@/lib/disposal/constants';
import { calculateThresholdPrice } from '@/lib/disposal/calculations';
import type { AttentionStock, MarketType, ThresholdResult } from '@/types/disposal';

/**
 * Mock 歷史價格資料（未來串接真實 API 時替換）
 */
const fetchHistoricalPrices = async (
  stockId: string,
  _marketType: MarketType
): Promise<{ priceT5: number; priceT29: number }> => {
  // 模擬 API 延遲
  await new Promise((resolve) => setTimeout(resolve, 300));

  // Mock 資料：根據股票代號生成假資料
  const seed = parseInt(stockId, 10) || 1000;
  const basePrice = (seed % 500) + 50;

  return {
    priceT5: basePrice * 0.85,
    priceT29: basePrice * 0.55,
  };
};

interface UseThresholdCalculationResult {
  data: ThresholdResult | undefined;
  isLoading: boolean;
  isError: boolean;
}

/**
 * 計算注意股票的臨界價 Hook
 *
 * 僅針對累計 2 次的高風險股票計算臨界價
 * 若股票資料中已有 thresholdPrice，直接使用不重新計算
 *
 * @param stock - 注意股票資料（null 時不啟用查詢）
 */
export const useThresholdCalculation = (
  stock: AttentionStock | null
): UseThresholdCalculationResult => {
  const shouldFetch =
    stock !== null &&
    stock.attentionCount === 2 &&
    stock.thresholdPrice === undefined;

  const query = useQuery({
    queryKey: stock
      ? DISPOSAL_QUERY_KEYS.historicalPrices(stock.stockId)
      : ['noop'],
    queryFn: async () => {
      if (!stock) {
        throw new Error('No stock provided');
      }

      const { priceT5, priceT29 } = await fetchHistoricalPrices(
        stock.stockId,
        stock.marketType
      );

      return calculateThresholdPrice(stock.marketType, priceT5, priceT29);
    },
    enabled: shouldFetch,
    staleTime: 10 * 60 * 1000, // 10 分鐘
    refetchOnWindowFocus: false,
  });

  // 若股票已有臨界價，直接返回
  if (stock?.thresholdPrice !== undefined && stock?.thresholdType !== undefined) {
    return {
      data: {
        thresholdPrice: stock.thresholdPrice,
        thresholdType: stock.thresholdType,
        limit6d: stock.thresholdPrice, // Mock 資料無法得知實際值
        limit30d: stock.thresholdPrice,
      },
      isLoading: false,
      isError: false,
    };
  }

  return {
    data: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
  };
};
