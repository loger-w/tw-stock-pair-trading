import type { AnalysisPeriod } from '@/types';

// Color palette
export const COLORS = {
  // Main theme
  primary: '#1e3a5f', // Dark blue
  primaryLight: '#3b82f6', // Light blue

  // Signal colors
  strongSignal: '#dc2626', // Red
  mediumSignal: '#f59e0b', // Orange-yellow
  weakSignal: '#9ca3af', // Gray

  // Taiwan stock convention (up = red, down = green)
  long: '#dc2626', // Red - 做多
  short: '#16a34a', // Green - 做空

  // Chart colors
  chartLine: '#3b82f6', // Blue
  chartMean: '#f97316', // Orange (mean line)
  chartUpperBand: '#fee2e2', // Light red (overbought zone)
  chartLowerBand: '#dcfce7', // Light green (oversold zone)
  chartToday: '#8b5cf6', // Purple (today marker)
} as const;

// Signal thresholds
export const SIGNAL_THRESHOLDS = {
  superStrong: { arbitrage: 0.2, zScore: 2.0 },
  strong: { arbitrage: 0.15, zScore: 2.0 },
  mediumHigh: { arbitrage: 0.15, zScoreMin: 1.5, zScoreMax: 2.0 },
  mediumLow: { arbitrage: 0.1, zScore: 2.0 },
  minimum: { arbitrage: 0.1 },
} as const;

// Analysis periods
export const ANALYSIS_PERIODS: readonly AnalysisPeriod[] = [60, 120, 180];

export const PERIOD_LABELS: Record<AnalysisPeriod, string> = {
  60: '60 天',
  120: '120 天',
  180: '180 天',
};

// Group constraints
export const GROUP_CONSTRAINTS = {
  maxStocks: 5,
  minStocks: 2,
} as const;

// Taiwan stock lot size (1 張 = 1000 股)
export const LOT_SIZE = 1000;

// Signal strength labels
export const SIGNAL_LABELS = {
  'super-strong': '超強烈',
  strong: '強烈',
  medium: '中等',
  weak: '弱',
  none: '無',
} as const;

// Action labels
export const ACTION_LABELS = {
  long: '買',
  short: '空',
} as const;

// Default analysis period
export const DEFAULT_ANALYSIS_PERIOD: AnalysisPeriod = 120;

// IndexedDB configuration
export const DB_CONFIG = {
  name: 'pairs-trading-db',
  version: 1,
  stores: {
    groups: 'groups',
  },
} as const;

// Query keys for TanStack Query
export const QUERY_KEYS = {
  groups: ['groups'] as const,
  group: (id: string) => ['groups', id] as const,
  stockPrices: (stockIds: string[], period: AnalysisPeriod) =>
    ['stockPrices', stockIds.sort().join(','), period] as const,
} as const;

// Stale time for stock prices (5 minutes)
export const STOCK_PRICES_STALE_TIME = 5 * 60 * 1000;
