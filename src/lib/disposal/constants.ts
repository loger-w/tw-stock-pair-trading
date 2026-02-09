/**
 * 處置預警系統常數定義
 */

/** 處置系統顏色 */
export const DISPOSAL_COLORS = {
  /** 黃色 - 注意 1 次 */
  attention1: '#f59e0b',
  /** 橘色 - 注意 2 次（高風險） */
  attention2: '#f97316',
  /** 紅色 - 處置中 */
  disposal: '#dc2626',
  /** 深藍色 - 主色調 */
  primary: '#1e3a5f',
} as const;

/** 漲幅門檻比率 */
export const THRESHOLD_RATES = {
  /** 上市股票門檻 */
  TWSE: {
    /** 6日漲幅門檻：125% */
    day6: 1.25,
    /** 30日漲幅門檻：200% */
    day30: 2.0,
  },
  /** 上櫃股票門檻 */
  TPEx: {
    /** 6日漲幅門檻：130% */
    day6: 1.3,
    /** 30日漲幅門檻：200% */
    day30: 2.0,
  },
} as const;

/** TanStack Query 快取鍵 */
export const DISPOSAL_QUERY_KEYS = {
  /** 所有處置系統資料 */
  all: ['disposal'] as const,
  /** 注意股票列表 */
  attentionStocks: ['disposal', 'attention'] as const,
  /** 處置股票列表 */
  disposalStocks: ['disposal', 'disposal'] as const,
  /** 歷史價格（用於臨界價計算） */
  historicalPrices: (stockId: string) =>
    ['disposal', 'prices', stockId] as const,
} as const;

/** 狀態標籤文字 */
export const STATUS_LABELS = {
  /** 注意 1 次 */
  attention1: '注意股票',
  /** 注意 2 次（高風險） */
  attention2: '注意股票（高風險）',
  /** 處置中（5分鐘分盤） */
  disposal5: '處置中（5分盤）',
  /** 處置中（20分鐘分盤） */
  disposal20: '處置中（20分盤）',
} as const;

/** 市場類型標籤 */
export const MARKET_LABELS = {
  TWSE: '上市',
  TPEx: '上櫃',
} as const;
