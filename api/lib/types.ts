/**
 * 證交所/櫃買中心 API 原始回應型別
 * 以及處置系統共用型別（複製自 src/types/disposal）
 */

// ============================================
// 處置系統共用型別（Vercel Functions 需要獨立定義）
// ============================================

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
  stockId: string;
  stockName: string;
  marketType: MarketType;
  attentionCount: AttentionCount;
  triggerReason: string;
  attentionDate: string;
  thresholdPrice?: number;
  thresholdType?: ThresholdType;
}

/** 處置股票 */
export interface DisposalStock {
  stockId: string;
  stockName: string;
  marketType: MarketType;
  disposalInterval: DisposalInterval;
  startDate: string;
  endDate: string;
}

/** 處置系統 API 回應 */
export interface DisposalApiResponse {
  attentionStocks: AttentionStock[];
  disposalStocks: DisposalStock[];
  lastUpdated: string;
}

// ============================================
// 上市 (TWSE) API 回應型別
// ============================================

/** TWSE 當日注意股票 - GET /announcement/notice */
export interface TwseNoticeItem {
  Number: string;
  Code: string;
  Name: string;
  NumberOfAnnouncement: string;
  TradingInfoForAttention: string;
  Date: string;
  ClosingPrice: string;
  PE: string;
}

/** TWSE 注意累計次數 - GET /announcement/notetrans */
export interface TwseNotetransItem {
  Number: string;
  Code: string;
  Name: string;
  RecentlyMetAttentionSecuritiesCriteria: string;
}

/** TWSE 處置股票 - GET /announcement/punish */
export interface TwsePunishItem {
  Number: string;
  Date: string;
  Code: string;
  Name: string;
  NumberOfAnnouncement: string;
  ReasonsOfDisposition: string;
  DispositionPeriod: string;
  DispositionMeasures: string;
  Detail: string;
  LinkInformation: string;
}

// ============================================
// 上櫃 (TPEx) API 回應型別
// ============================================

/** TPEx 當日注意股票 */
export interface TpexWarningItem {
  Date: string;
  SecuritiesCompanyCode: string;
  CompanyName: string;
  TradingInformation: string;
  ClosePrice: string;
  PriceEarningRatio: string;
}

/** TPEx 注意累計次數 */
export interface TpexWarningNoteItem {
  Date: string;
  SecuritiesCompanyCode: string;
  CompanyName: string;
  AccumulationSituation: string;
}

/** TPEx 處置股票 */
export interface TpexDisposalItem {
  Date: string;
  SecuritiesCompanyCode: string;
  CompanyName: string;
  DispositionPeriod: string;
  DispositionReasons: string;
  DisposalCondition: string;
}

// ============================================
// API 端點常數
// ============================================

export const API_ENDPOINTS = {
  TWSE: {
    BASE: 'https://openapi.twse.com.tw/v1',
    NOTICE: '/announcement/notice',
    NOTETRANS: '/announcement/notetrans',
    PUNISH: '/announcement/punish',
  },
  TPEX: {
    WARNING: 'https://www.tpex.org.tw/openapi/v1/tpex_trading_warning_information',
    WARNING_NOTE: 'https://www.tpex.org.tw/openapi/v1/tpex_trading_warning_note',
    DISPOSAL: 'https://www.tpex.org.tw/openapi/v1/tpex_disposal_information',
  },
} as const;
