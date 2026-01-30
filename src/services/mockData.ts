import type { StockPrice, StockPriceResponse } from '@/types';
import dayjs from 'dayjs';

// Mock base prices for common Taiwan stocks
const MOCK_BASE_PRICES: Record<string, number> = {
  // 半導體
  '2330': 580, // 台積電
  '2303': 52, // 聯電
  '2454': 1150, // 聯發科
  '3034': 540, // 聯詠
  '2379': 48, // 瑞昱
  '3711': 128, // 日月光投控

  // 記憶體
  '2344': 32, // 華邦電
  '2408': 78, // 南亞科
  '2337': 42, // 旺宏
  '3260': 95, // 威剛
  '8299': 38, // 群聯

  // AI / 伺服器
  '2317': 108, // 鴻海
  '3231': 125, // 緯創
  '2356': 98, // 英業達
  '2382': 1680, // 廣達
  '3017': 245, // 奇鋐

  // 面板
  '2409': 18, // 友達
  '3481': 22, // 群創

  // 金融
  '2881': 68, // 富邦金
  '2882': 32, // 國泰金
  '2884': 28, // 玉山金
  '2886': 25, // 兆豐金

  // 傳產
  '1301': 88, // 台塑
  '1303': 68, // 南亞
  '2002': 25, // 中鋼
};

// Seed for deterministic random (same seed = same prices)
let seed = 12345;
const seededRandom = (): number => {
  seed = (seed * 9301 + 49297) % 233280;
  return seed / 233280;
};

/**
 * Generate mock price data for a single stock
 */
const generateMockPrices = (
  stockId: string,
  basePrice: number,
  days: number
): StockPrice[] => {
  // Reset seed for each stock to get consistent data
  seed = stockId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 12345);

  const prices: StockPrice[] = [];
  let currentPrice = basePrice;

  // Generate prices from oldest to newest
  for (let i = days - 1; i >= 0; i--) {
    const date = dayjs().subtract(i, 'day').format('YYYY-MM-DD');

    // Skip weekends (Saturday = 6, Sunday = 0)
    const dayOfWeek = dayjs().subtract(i, 'day').day();
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      continue;
    }

    // Random daily change between -3% to +3%
    const volatility = 0.03;
    const change = (seededRandom() - 0.5) * 2 * volatility;
    currentPrice = currentPrice * (1 + change);

    // Ensure price doesn't go below 1
    currentPrice = Math.max(currentPrice, 1);

    // Generate OHLC based on close price
    const openVar = (seededRandom() - 0.5) * 0.02;
    const highVar = seededRandom() * 0.02;
    const lowVar = seededRandom() * 0.02;

    const open = currentPrice * (1 + openVar);
    const high = Math.max(open, currentPrice) * (1 + highVar);
    const low = Math.min(open, currentPrice) * (1 - lowVar);

    prices.push({
      date,
      stockId,
      open: Math.round(open * 100) / 100,
      high: Math.round(high * 100) / 100,
      low: Math.round(low * 100) / 100,
      close: Math.round(currentPrice * 100) / 100,
      volume: Math.floor(seededRandom() * 50000000) + 1000000,
    });
  }

  return prices;
};

/**
 * Get mock stock prices for multiple stocks
 */
export const getMockStockPrices = (
  stockIds: string[],
  days: number
): StockPriceResponse => {
  const result: StockPriceResponse = {};

  for (const stockId of stockIds) {
    const basePrice = MOCK_BASE_PRICES[stockId] || 50 + seededRandom() * 200;
    result[stockId] = generateMockPrices(stockId, basePrice, days);
  }

  return result;
};

/**
 * Simulate API delay
 */
export const simulateDelay = (ms: number = 500): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

/**
 * Get mock stock prices with simulated delay
 */
export const fetchMockStockPrices = async (
  stockIds: string[],
  days: number
): Promise<StockPriceResponse> => {
  // Simulate network delay
  await simulateDelay(300 + Math.random() * 400);
  return getMockStockPrices(stockIds, days);
};
