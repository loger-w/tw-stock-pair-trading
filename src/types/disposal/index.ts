/**
 * 處置預警系統型別定義
 */

/** 市場類型 */
export type MarketType = 'TWSE' | 'TPEx';

/** 臨界價類型 */
export type ThresholdType = '6d' | '30d';

/** 處置分盤間隔類型 */
export type DisposalInterval = 5 | 20;

/** 注意次數類型 */
export type AttentionCount = 1 | 2;

/** 注意股票 */
export interface AttentionStock {
  /** 股票代號 */
  stockId: string;
  /** 股票名稱 */
  stockName: string;
  /** 市場類型（上市/上櫃） */
  marketType: MarketType;
  /** 累計注意次數（1-2次） */
  attentionCount: AttentionCount;
  /** 觸發原因 */
  triggerReason: string;
  /** 注意日期 */
  attentionDate: string;
  /** 進處置臨界價格（僅 attentionCount=2 時有值） */
  thresholdPrice?: number;
  /** 臨界價類型（6日/30日） */
  thresholdType?: ThresholdType;
}

/** 處置股票 */
export interface DisposalStock {
  /** 股票代號 */
  stockId: string;
  /** 股票名稱 */
  stockName: string;
  /** 市場類型（上市/上櫃） */
  marketType: MarketType;
  /** 分盤間隔（5分鐘/20分鐘） */
  disposalInterval: DisposalInterval;
  /** 處置開始日期 */
  startDate: string;
  /** 處置結束日期（出關日） */
  endDate: string;
}

/** 處置系統 API 回應 */
export interface DisposalApiResponse {
  /** 注意股票列表 */
  attentionStocks: AttentionStock[];
  /** 處置股票列表 */
  disposalStocks: DisposalStock[];
  /** 資料最後更新時間 */
  lastUpdated: string;
}

/** 臨界價計算結果 */
export interface ThresholdResult {
  /** 最終臨界價格（取較低者，無條件進位） */
  thresholdPrice: number;
  /** 觸發的臨界價類型 */
  thresholdType: ThresholdType;
  /** 6日臨界價 */
  limit6d: number;
  /** 30日臨界價 */
  limit30d: number;
}
