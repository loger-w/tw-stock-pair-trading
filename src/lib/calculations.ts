import type { StockPrice, PriceRatio, PositionResult } from '@/types';
import { LOT_SIZE } from './constants';

/**
 * Calculate price ratio: Stock A price / Stock B price
 */
export const calculatePriceRatio = (priceA: number, priceB: number): number => {
  if (priceB === 0) return 0;
  return priceA / priceB;
};

/**
 * Calculate mean (average) of an array of numbers
 */
export const calculateMean = (values: number[]): number => {
  if (values.length === 0) return 0;
  return values.reduce((sum, val) => sum + val, 0) / values.length;
};

/**
 * Calculate standard deviation
 */
export const calculateStdDev = (values: number[], mean?: number): number => {
  if (values.length === 0) return 0;
  const avg = mean ?? calculateMean(values);
  const squaredDiffs = values.map((val) => Math.pow(val - avg, 2));
  const avgSquaredDiff = squaredDiffs.reduce((sum, val) => sum + val, 0) / values.length;
  return Math.sqrt(avgSquaredDiff);
};

/**
 * Calculate arbitrage space: (current ratio / historical mean) - 1
 * Positive = A is relatively expensive vs B
 * Negative = A is relatively cheap vs B
 */
export const calculateArbitrageSpace = (
  currentRatio: number,
  historicalMean: number
): number => {
  if (historicalMean === 0) return 0;
  return currentRatio / historicalMean - 1;
};

/**
 * Calculate Z-Score: (current ratio - mean) / stdDev
 */
export const calculateZScore = (
  currentRatio: number,
  mean: number,
  stdDev: number
): number => {
  if (stdDev === 0) return 0;
  return (currentRatio - mean) / stdDev;
};

/**
 * Calculate daily price changes from price array
 */
export const calculateDailyChanges = (prices: StockPrice[]): number[] => {
  const changes: number[] = [];
  for (let i = 1; i < prices.length; i++) {
    const prevClose = prices[i - 1].close;
    const currClose = prices[i].close;
    if (prevClose !== 0) {
      changes.push((currClose - prevClose) / prevClose);
    }
  }
  return changes;
};

/**
 * Calculate co-movement rate (漲跌同向率)
 * Percentage of days where both stocks moved in the same direction
 */
export const calculateCoMovementRate = (
  stockAChanges: number[],
  stockBChanges: number[]
): number => {
  if (stockAChanges.length === 0 || stockAChanges.length !== stockBChanges.length) {
    return 0;
  }

  let sameDirection = 0;
  for (let i = 0; i < stockAChanges.length; i++) {
    const aUp = stockAChanges[i] >= 0;
    const bUp = stockBChanges[i] >= 0;
    if (aUp === bUp) {
      sameDirection++;
    }
  }

  return sameDirection / stockAChanges.length;
};

/**
 * Calculate Pearson correlation coefficient
 */
export const calculateCorrelation = (
  valuesA: number[],
  valuesB: number[]
): number => {
  if (valuesA.length !== valuesB.length || valuesA.length === 0) {
    return 0;
  }

  const n = valuesA.length;
  const meanA = calculateMean(valuesA);
  const meanB = calculateMean(valuesB);

  let numerator = 0;
  let sumSqA = 0;
  let sumSqB = 0;

  for (let i = 0; i < n; i++) {
    const diffA = valuesA[i] - meanA;
    const diffB = valuesB[i] - meanB;
    numerator += diffA * diffB;
    sumSqA += diffA * diffA;
    sumSqB += diffB * diffB;
  }

  const denominator = Math.sqrt(sumSqA * sumSqB);
  if (denominator === 0) return 0;

  return numerator / denominator;
};

/**
 * Generate all directional pairs from N stocks
 * Returns N×(N-1) pairs
 */
export const generatePairs = (stockIds: string[]): Array<[string, string]> => {
  const pairs: Array<[string, string]> = [];
  for (const stockA of stockIds) {
    for (const stockB of stockIds) {
      if (stockA !== stockB) {
        pairs.push([stockA, stockB]);
      }
    }
  }
  return pairs;
};

/**
 * Build price ratio history from two stock price arrays
 */
export const buildPriceRatioHistory = (
  pricesA: StockPrice[],
  pricesB: StockPrice[]
): PriceRatio[] => {
  // Create a map for quick lookup by date
  const priceMapB = new Map<string, number>();
  for (const p of pricesB) {
    priceMapB.set(p.date, p.close);
  }

  const ratios: PriceRatio[] = [];
  for (const pA of pricesA) {
    const priceB = priceMapB.get(pA.date);
    if (priceB !== undefined && priceB !== 0) {
      ratios.push({
        date: pA.date,
        ratio: pA.close / priceB,
        stockAPrice: pA.close,
        stockBPrice: priceB,
      });
    }
  }

  return ratios;
};

/**
 * Calculate minimum position for pairs trading
 * Finds the smallest lot combination where position values are roughly equal
 */
export const calculateMinPosition = (
  priceA: number,
  priceB: number,
  actionA: 'long' | 'short',
  actionB: 'long' | 'short'
): PositionResult => {
  const valuePerLotA = priceA * LOT_SIZE;
  const valuePerLotB = priceB * LOT_SIZE;

  // Find GCD-like approach: try to minimize difference
  // Start with 1 lot each and find best ratio
  let bestLotsA = 1;
  let bestLotsB = 1;
  let bestDiff = Math.abs(valuePerLotA - valuePerLotB);

  // Try combinations up to 10 lots each
  for (let lotsA = 1; lotsA <= 10; lotsA++) {
    for (let lotsB = 1; lotsB <= 10; lotsB++) {
      const valueA = lotsA * valuePerLotA;
      const valueB = lotsB * valuePerLotB;
      const diff = Math.abs(valueA - valueB);

      // Prefer smaller total lots with similar difference
      if (
        diff < bestDiff ||
        (diff <= bestDiff * 1.1 && lotsA + lotsB < bestLotsA + bestLotsB)
      ) {
        bestDiff = diff;
        bestLotsA = lotsA;
        bestLotsB = lotsB;
      }
    }
  }

  const stockACost = bestLotsA * valuePerLotA;
  const stockBCost = bestLotsB * valuePerLotB;

  return {
    stockAShares: bestLotsA,
    stockBShares: bestLotsB,
    stockACost,
    stockBCost,
    totalCapital: stockACost + stockBCost,
    valueDifference: Math.abs(stockACost - stockBCost),
    valueDifferencePercent:
      Math.abs(stockACost - stockBCost) / ((stockACost + stockBCost) / 2),
    stockAAction: actionA,
    stockBAction: actionB,
  };
};

/**
 * Calculate position for custom capital
 * Divides capital roughly equally between the two positions
 */
export const calculateCustomPosition = (
  priceA: number,
  priceB: number,
  totalCapital: number,
  actionA: 'long' | 'short',
  actionB: 'long' | 'short'
): PositionResult => {
  const capitalPerSide = totalCapital / 2;
  const valuePerLotA = priceA * LOT_SIZE;
  const valuePerLotB = priceB * LOT_SIZE;

  // Calculate lots that fit within half capital
  const lotsA = Math.floor(capitalPerSide / valuePerLotA);
  const lotsB = Math.floor(capitalPerSide / valuePerLotB);

  // Ensure at least 1 lot each if capital allows
  const finalLotsA = Math.max(lotsA, totalCapital >= valuePerLotA ? 1 : 0);
  const finalLotsB = Math.max(lotsB, totalCapital >= valuePerLotB ? 1 : 0);

  const stockACost = finalLotsA * valuePerLotA;
  const stockBCost = finalLotsB * valuePerLotB;

  return {
    stockAShares: finalLotsA,
    stockBShares: finalLotsB,
    stockACost,
    stockBCost,
    totalCapital: stockACost + stockBCost,
    valueDifference: Math.abs(stockACost - stockBCost),
    valueDifferencePercent:
      stockACost + stockBCost > 0
        ? Math.abs(stockACost - stockBCost) / ((stockACost + stockBCost) / 2)
        : 0,
    stockAAction: actionA,
    stockBAction: actionB,
  };
};

/**
 * Format number as currency (TWD)
 */
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('zh-TW', {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

/**
 * Format number as percentage
 */
export const formatPercent = (value: number, decimals: number = 1): string => {
  return `${(value * 100).toFixed(decimals)}%`;
};

/**
 * Format price with 2 decimal places
 */
export const formatPrice = (value: number): string => {
  return value.toFixed(2);
};
