import type { MarketType, ThresholdResult } from '@/types/disposal';
import { THRESHOLD_RATES } from './constants';

/**
 * 計算進處置臨界價格
 *
 * 計算公式：
 * - 6日臨界價 = T-5日收盤價 × 1.25（上市）或 1.30（上櫃）
 * - 30日臨界價 = T-29日收盤價 × 2.00
 * - 取較低者作為警示價格（無條件進位至整數）
 *
 * @param marketType - 市場類型（TWSE 上市 / TPEx 上櫃）
 * @param priceT5 - T-5 日收盤價
 * @param priceT29 - T-29 日收盤價
 * @returns 臨界價計算結果
 */
export const calculateThresholdPrice = (
  marketType: MarketType,
  priceT5: number,
  priceT29: number
): ThresholdResult => {
  const rates = THRESHOLD_RATES[marketType];
  const limit6d = priceT5 * rates.day6;
  const limit30d = priceT29 * rates.day30;

  const isLimit6dLower = limit6d <= limit30d;

  return {
    thresholdPrice: Math.ceil(Math.min(limit6d, limit30d)),
    thresholdType: isLimit6dLower ? '6d' : '30d',
    limit6d: Math.ceil(limit6d),
    limit30d: Math.ceil(limit30d),
  };
};

/**
 * 計算距離臨界價的漲幅空間
 *
 * @param currentPrice - 當前價格
 * @param thresholdPrice - 臨界價格
 * @returns 漲幅百分比（正數表示還有空間，負數表示已超過）
 */
export const calculatePriceMargin = (
  currentPrice: number,
  thresholdPrice: number
): number => {
  if (currentPrice <= 0) return 0;
  return ((thresholdPrice - currentPrice) / currentPrice) * 100;
};

/**
 * 判斷是否接近臨界價（5% 以內）
 *
 * @param currentPrice - 當前價格
 * @param thresholdPrice - 臨界價格
 * @returns 是否接近臨界價
 */
export const isNearThreshold = (
  currentPrice: number,
  thresholdPrice: number
): boolean => {
  const margin = calculatePriceMargin(currentPrice, thresholdPrice);
  return margin >= 0 && margin <= 5;
};
