import { useCallback } from 'react';
import type {
  StockPrice,
  StockPriceResponse,
  PairAnalysis,
  StockCatalog,
} from '@/types';
import {
  generatePairs,
  buildPriceRatioHistory,
  calculateMean,
  calculateStdDev,
  calculateArbitrageSpace,
  calculateZScore,
  calculateDailyChanges,
  calculateCoMovementRate,
  calculateCorrelation,
} from '@/lib/calculations';
import { determineSignalStrength, getTradingAction } from '@/lib/signals';

/**
 * Hook to calculate pair analysis results
 */
export const usePairCalculation = () => {
  /**
   * Calculate analysis for all pairs in a group
   */
  const calculatePairAnalysis = useCallback(
    (
      stockIds: string[],
      priceData: StockPriceResponse,
      stockCatalog: StockCatalog
    ): PairAnalysis[] => {
      // Generate all directional pairs
      const pairs = generatePairs(stockIds);
      const results: PairAnalysis[] = [];

      for (const [stockA, stockB] of pairs) {
        const pricesA = priceData[stockA];
        const pricesB = priceData[stockB];

        // Skip if either stock has no data
        if (!pricesA?.length || !pricesB?.length) {
          continue;
        }

        // Build price ratio history
        const priceRatioHistory = buildPriceRatioHistory(pricesA, pricesB);

        if (priceRatioHistory.length === 0) {
          continue;
        }

        // Extract ratio values for statistics
        const ratioValues = priceRatioHistory.map((r) => r.ratio);

        // Calculate statistics
        const historicalMean = calculateMean(ratioValues);
        const historicalStdDev = calculateStdDev(ratioValues, historicalMean);
        const historicalMax = Math.max(...ratioValues);
        const historicalMin = Math.min(...ratioValues);

        // Get current (latest) values
        const latestRatio = priceRatioHistory[priceRatioHistory.length - 1];
        const currentRatio = latestRatio.ratio;

        // Calculate core indicators
        const arbitrageSpace = calculateArbitrageSpace(currentRatio, historicalMean);
        const zScore = calculateZScore(currentRatio, historicalMean, historicalStdDev);

        // Calculate co-movement and correlation
        const changesA = calculateDailyChanges(pricesA);
        const changesB = calculateDailyChanges(pricesB);
        const coMovementRate = calculateCoMovementRate(changesA, changesB);

        // Calculate correlation using closing prices
        const closePricesA = pricesA.map((p) => p.close);
        const closePricesB = pricesB.map((p) => p.close);
        const correlationCoef = calculateCorrelation(closePricesA, closePricesB);

        // Determine signal strength
        const signalStrength = determineSignalStrength(arbitrageSpace, zScore);

        // Get trading actions
        const { stockAAction, stockBAction } = getTradingAction(arbitrageSpace);

        // Calculate today's change
        const stockACurrentPrice = pricesA[pricesA.length - 1].close;
        const stockBCurrentPrice = pricesB[pricesB.length - 1].close;

        const stockAChange =
          pricesA.length > 1
            ? (stockACurrentPrice - pricesA[pricesA.length - 2].close) /
              pricesA[pricesA.length - 2].close
            : 0;
        const stockBChange =
          pricesB.length > 1
            ? (stockBCurrentPrice - pricesB[pricesB.length - 2].close) /
              pricesB[pricesB.length - 2].close
            : 0;

        // Get stock names
        const stockAName = stockCatalog[stockA]?.名稱 || stockA;
        const stockBName = stockCatalog[stockB]?.名稱 || stockB;

        results.push({
          id: `${stockA}-${stockB}`,
          stockA,
          stockB,
          stockAName,
          stockBName,
          currentRatio,
          historicalMean,
          historicalStdDev,
          historicalMax,
          historicalMin,
          arbitrageSpace,
          zScore,
          coMovementRate,
          correlationCoef,
          signalStrength,
          priceRatioHistory,
          stockACurrentPrice,
          stockBCurrentPrice,
          stockAChange,
          stockBChange,
        });
      }

      return results;
    },
    []
  );

  /**
   * Filter stocks that have sufficient historical data
   */
  const filterStocksWithSufficientData = useCallback(
    (
      stockIds: string[],
      priceData: StockPriceResponse,
      minDays: number
    ): { validStockIds: string[]; excludedStockIds: string[] } => {
      const validStockIds: string[] = [];
      const excludedStockIds: string[] = [];

      // Roughly 70% of calendar days are trading days
      const minTradingDays = Math.floor(minDays * 0.65);

      for (const stockId of stockIds) {
        const prices = priceData[stockId];
        if (prices && prices.length >= minTradingDays) {
          validStockIds.push(stockId);
        } else {
          excludedStockIds.push(stockId);
        }
      }

      return { validStockIds, excludedStockIds };
    },
    []
  );

  return {
    calculatePairAnalysis,
    filterStocksWithSufficientData,
  };
};

/**
 * Sort pair analysis results by signal strength
 */
export const sortBySignalStrength = (results: PairAnalysis[]): PairAnalysis[] => {
  const signalOrder: Record<string, number> = {
    'super-strong': 0,
    strong: 1,
    medium: 2,
    weak: 3,
    none: 4,
  };

  return [...results].sort((a, b) => {
    const orderA = signalOrder[a.signalStrength] ?? 5;
    const orderB = signalOrder[b.signalStrength] ?? 5;

    if (orderA !== orderB) {
      return orderA - orderB;
    }

    // Secondary sort by absolute arbitrage space (descending)
    return Math.abs(b.arbitrageSpace) - Math.abs(a.arbitrageSpace);
  });
};
