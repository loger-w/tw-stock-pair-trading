import type { StockPriceResponse, AnalysisPeriod } from '@/types';

// FinMind API configuration
// Use proxy to avoid CORS (Vite proxy in dev, Vercel rewrites in prod)
const FINMIND_API_URL = '/api/finmind/data';
const FINMIND_TOKEN = import.meta.env.VITE_FINMIND_TOKEN || '';

/**
 * Fetch stock prices from FinMind API
 * Note: This is prepared for future integration
 */
const fetchFromFinMind = async (
  stockIds: string[],
  days: number
): Promise<StockPriceResponse> => {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days - 50); // Extra days for weekends

  const result: StockPriceResponse = {};

  for (const stockId of stockIds) {
    const params = new URLSearchParams({
      dataset: 'TaiwanStockPrice',
      data_id: stockId,
      start_date: startDate.toISOString().split('T')[0],
      end_date: endDate.toISOString().split('T')[0],
    });

    const response = await fetch(`${FINMIND_API_URL}?${params}`, {
      headers: {
        Authorization: `Bearer ${FINMIND_TOKEN}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch data for ${stockId}`);
    }

    const data = await response.json();

    if (data.status !== 200 || !Array.isArray(data.data)) {
      throw new Error(`Invalid response for ${stockId}`);
    }

    // Transform FinMind data to our format
    // FinMind returns: date, stock_id, Trading_Volume, Trading_money, open, max, min, close, spread, Trading_turnover
    result[stockId] = data.data
      .slice(-days) // Take only the last N days
      .map(
        (item: {
          date: string;
          stock_id: string;
          open: number;
          max: number;
          min: number;
          close: number;
          Trading_Volume: number;
        }) => ({
          date: item.date,
          stockId: item.stock_id,
          open: item.open,
          high: item.max,
          low: item.min,
          close: item.close, // Note: FinMind's close is already adjusted
          volume: item.Trading_Volume,
        })
      );
  }

  return result;
};

/**
 * Fetch stock prices from FinMind API
 */
export const fetchStockPrices = async (
  stockIds: string[],
  period: AnalysisPeriod
): Promise<StockPriceResponse> => {
  if (stockIds.length === 0) {
    return {};
  }

  if (!FINMIND_TOKEN) {
    throw new Error('請先設定 FinMind API Token');
  }

  return fetchFromFinMind(stockIds, period);
};

/**
 * Check if a stock has sufficient historical data
 */
export const hasEnoughData = (
  prices: StockPriceResponse,
  stockId: string,
  requiredDays: number
): boolean => {
  const stockPrices = prices[stockId];
  if (!stockPrices) return false;

  // Allow for some weekends/holidays (roughly 70% of calendar days are trading days)
  const minRequired = Math.floor(requiredDays * 0.65);
  return stockPrices.length >= minRequired;
};
