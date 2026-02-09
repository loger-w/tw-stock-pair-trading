/**
 * 處置系統資料轉換工具
 * 將證交所/櫃買中心 API 原始資料轉換為前端所需格式
 */

import type {
  TwseNoticeItem,
  TwseNotetransItem,
  TwsePunishItem,
  TpexWarningItem,
  TpexWarningNoteItem,
  TpexDisposalItem,
  AttentionStock,
  DisposalStock,
  AttentionCount,
  DisposalInterval,
  MarketType,
} from './types';

// ============================================
// 日期轉換工具
// ============================================

/**
 * 民國年日期轉西元年 ISO 格式
 * @example "1150129" → "2026-01-29"
 * @example "115/01/29" → "2026-01-29"
 */
export const rocToIso = (rocDate: string): string => {
  if (!rocDate.trim()) return '';

  // 移除斜線，統一格式
  const cleaned = rocDate.replace(/\//g, '');

  // 解析民國年月日
  const rocYear = parseInt(cleaned.substring(0, 3), 10);
  const month = cleaned.substring(3, 5);
  const day = cleaned.substring(5, 7);

  // 民國年 + 1911 = 西元年
  const adYear = rocYear + 1911;

  return `${adYear}-${month}-${day}`;
};

/**
 * 解析處置期間字串
 * @example "115/01/29～115/02/11" → { startDate: "2026-01-29", endDate: "2026-02-11" }
 */
export const parseDispositionPeriod = (
  period: string
): { startDate: string; endDate: string } => {
  // 分割開始和結束日期（使用全形或半形波浪號）
  const parts = period.split(/[～~]/);

  if (parts.length !== 2) {
    // 無法解析時返回空字串
    return { startDate: '', endDate: '' };
  }

  return {
    startDate: rocToIso(parts[0].trim()),
    endDate: rocToIso(parts[1].trim()),
  };
};

// ============================================
// 分盤間隔解析
// ============================================

/**
 * 從處置措施文字解析分盤間隔
 * @example "約每五分鐘撮合一次" → 5
 * @example "約每二十分鐘撮合一次" → 20
 */
export const parseDisposalInterval = (measures: string): DisposalInterval => {
  if (measures.includes('二十分鐘') || measures.includes('20分鐘')) {
    return 20;
  }
  // 預設為 5 分鐘（第一次處置）
  return 5;
};

// ============================================
// 注意次數解析
// ============================================

/**
 * 從累計次數文字解析注意次數
 * @example "最近30個營業日內第2次達標準" → 2
 */
export const parseAttentionCount = (situation: string): AttentionCount => {
  // 尋找數字
  const match = situation.match(/第(\d+)次/);
  if (match) {
    const count = parseInt(match[1], 10);
    if (count >= 2) return 2;
  }
  return 1;
};

// ============================================
// TWSE 資料轉換
// ============================================

/**
 * 轉換 TWSE 注意股票資料
 */
export const transformTwseAttentionStocks = (
  noticeItems: TwseNoticeItem[],
  notetransItems: TwseNotetransItem[]
): AttentionStock[] => {
  // 建立累計次數查詢表
  const countMap = new Map<string, AttentionCount>();
  for (const item of notetransItems) {
    countMap.set(item.Code, parseAttentionCount(item.RecentlyMetAttentionSecuritiesCriteria));
  }

  return noticeItems
    .filter((item) => item.Code.trim() !== '')
    .map((item) => ({
      stockId: item.Code,
      stockName: item.Name,
      marketType: 'TWSE' as MarketType,
      attentionCount: countMap.get(item.Code) ?? 1,
      triggerReason: item.TradingInfoForAttention,
      attentionDate: rocToIso(item.Date),
    }));
};

/**
 * 轉換 TWSE 處置股票資料
 */
export const transformTwseDisposalStocks = (
  punishItems: TwsePunishItem[]
): DisposalStock[] => {
  // 使用 Map 來去重（同一股票可能有多筆處置紀錄，取最新的）
  const stockMap = new Map<string, DisposalStock>();

  for (const item of punishItems) {
    if (!item.Code.trim()) continue;

    const { startDate, endDate } = parseDispositionPeriod(item.DispositionPeriod);

    // 跳過已過期的處置（endDate < 今天）
    const today = new Date().toISOString().split('T')[0];
    if (endDate && endDate < today) continue;

    const existing = stockMap.get(item.Code);
    // 如果已存在，保留結束日期較晚的那筆
    if (existing && existing.endDate >= endDate) continue;

    stockMap.set(item.Code, {
      stockId: item.Code,
      stockName: item.Name,
      marketType: 'TWSE' as MarketType,
      disposalInterval: parseDisposalInterval(item.Detail),
      startDate,
      endDate,
    });
  }

  return Array.from(stockMap.values());
};

// ============================================
// TPEx 資料轉換
// ============================================

/**
 * 轉換 TPEx 注意股票資料
 */
export const transformTpexAttentionStocks = (
  warningItems: TpexWarningItem[],
  warningNoteItems: TpexWarningNoteItem[]
): AttentionStock[] => {
  // 建立累計次數查詢表
  const countMap = new Map<string, AttentionCount>();
  for (const item of warningNoteItems) {
    countMap.set(
      item.SecuritiesCompanyCode,
      parseAttentionCount(item.AccumulationSituation)
    );
  }

  return warningItems
    .filter((item) => item.SecuritiesCompanyCode.trim() !== '')
    .map((item) => ({
      stockId: item.SecuritiesCompanyCode,
      stockName: item.CompanyName,
      marketType: 'TPEx' as MarketType,
      attentionCount: countMap.get(item.SecuritiesCompanyCode) ?? 1,
      triggerReason: item.TradingInformation,
      attentionDate: rocToIso(item.Date),
    }));
};

/**
 * 轉換 TPEx 處置股票資料
 */
export const transformTpexDisposalStocks = (
  disposalItems: TpexDisposalItem[]
): DisposalStock[] => {
  const stockMap = new Map<string, DisposalStock>();

  for (const item of disposalItems) {
    if (!item.SecuritiesCompanyCode.trim()) continue;

    const { startDate, endDate } = parseDispositionPeriod(item.DispositionPeriod);

    // 跳過已過期的處置
    const today = new Date().toISOString().split('T')[0];
    if (endDate && endDate < today) continue;

    const existing = stockMap.get(item.SecuritiesCompanyCode);
    if (existing && existing.endDate >= endDate) continue;

    stockMap.set(item.SecuritiesCompanyCode, {
      stockId: item.SecuritiesCompanyCode,
      stockName: item.CompanyName,
      marketType: 'TPEx' as MarketType,
      disposalInterval: parseDisposalInterval(item.DisposalCondition),
      startDate,
      endDate,
    });
  }

  return Array.from(stockMap.values());
};
