// Stock Information (from TWSE_stocks.json)
export interface StockInfo {
  名稱: string;
  代號: string;
  市場別: string;
  產業別: string;
  上市日期: string;
}

// Stock catalog map type
export type StockCatalog = Record<string, StockInfo>;

// Stock Group stored in IndexedDB
export interface StockGroup {
  id: string;
  name: string;
  stockIds: string[]; // max 5 stocks
  createdAt: number;
  updatedAt: number;
}

// Stock Price Data (from API/mock)
export interface StockPrice {
  date: string; // YYYY-MM-DD
  stockId: string;
  open: number;
  high: number;
  low: number;
  close: number; // Adjusted close price (還原股價)
  volume: number;
}

// Price Ratio for a pair on a specific date
export interface PriceRatio {
  date: string;
  ratio: number; // Stock A price / Stock B price
  stockAPrice: number;
  stockBPrice: number;
}

// Signal Strength
export type SignalStrength =
  | 'super-strong' // 超強烈
  | 'strong' // 強烈
  | 'medium' // 中等
  | 'weak' // 弱
  | 'none'; // 無

// Pair Analysis Result
export interface PairAnalysis {
  id: string; // `${stockA}-${stockB}`
  stockA: string; // Stock A code
  stockB: string; // Stock B code
  stockAName: string;
  stockBName: string;
  currentRatio: number; // Current price ratio
  historicalMean: number; // Historical average ratio
  historicalStdDev: number; // Historical standard deviation
  historicalMax: number;
  historicalMin: number;
  arbitrageSpace: number; // (current/mean) - 1
  zScore: number; // (current - mean) / stdDev
  coMovementRate: number; // Same direction movement percentage
  correlationCoef: number; // Correlation coefficient
  signalStrength: SignalStrength;
  priceRatioHistory: PriceRatio[];
  stockACurrentPrice: number;
  stockBCurrentPrice: number;
  stockAChange: number; // Today's % change
  stockBChange: number; // Today's % change
}

// Analysis Period (days)
export type AnalysisPeriod = 60 | 120 | 180;

// Position Calculation Result
export interface PositionResult {
  stockAShares: number; // Number of lots for stock A
  stockBShares: number; // Number of lots for stock B
  stockACost: number; // Total cost for stock A
  stockBCost: number; // Total cost for stock B
  totalCapital: number; // Total required capital
  valueDifference: number; // Absolute difference in position values
  valueDifferencePercent: number; // Percentage difference
  stockAAction: 'long' | 'short';
  stockBAction: 'long' | 'short';
}

// App State (Zustand)
export interface AppState {
  selectedGroupId: string | null;
  analysisPeriod: AnalysisPeriod;
  showStrongSignalsOnly: boolean;
  expandedPairId: string | null;

  setSelectedGroupId: (id: string | null) => void;
  setAnalysisPeriod: (period: AnalysisPeriod) => void;
  setShowStrongSignalsOnly: (show: boolean) => void;
  setExpandedPairId: (id: string | null) => void;
}

// API Response types
export interface StockPriceResponse {
  [stockId: string]: StockPrice[];
}
