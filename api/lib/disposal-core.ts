/**
 * 處置系統核心邏輯
 * 供 Vercel Serverless Function 和 Vite 開發插件共用
 */

import {
  API_ENDPOINTS,
  type TwseNoticeItem,
  type TwseNotetransItem,
  type TwsePunishItem,
  type TpexWarningItem,
  type TpexWarningNoteItem,
  type TpexDisposalItem,
  type DisposalApiResponse,
} from './types';
import {
  transformTwseAttentionStocks,
  transformTwseDisposalStocks,
  transformTpexAttentionStocks,
  transformTpexDisposalStocks,
} from './disposal-transformer';

/**
 * 安全地 fetch JSON 資料
 * 如果請求失敗，返回空陣列而非拋出錯誤
 */
export const safeFetch = async <T>(url: string): Promise<T[]> => {
  try {
    const response = await fetch(url, {
      headers: {
        Accept: 'application/json',
        'User-Agent': 'TW-Stock-Pairs-Trading/1.0',
      },
    });

    if (!response.ok) {
      console.error(`API Error: ${url} returned ${response.status}`);
      return [];
    }

    const data = await response.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error(`Fetch Error: ${url}`, error);
    return [];
  }
};

/**
 * 取得處置系統資料
 * 並行呼叫證交所 + 櫃買中心 API，合併並轉換資料格式
 */
export const fetchDisposalDataFromSources =
  async (): Promise<DisposalApiResponse> => {
    // 並行呼叫 6 個 API
    const [
      twseNotice,
      twseNotetrans,
      twsePunish,
      tpexWarning,
      tpexWarningNote,
      tpexDisposal,
    ] = await Promise.all([
      // TWSE APIs
      safeFetch<TwseNoticeItem>(
        `${API_ENDPOINTS.TWSE.BASE}${API_ENDPOINTS.TWSE.NOTICE}`
      ),
      safeFetch<TwseNotetransItem>(
        `${API_ENDPOINTS.TWSE.BASE}${API_ENDPOINTS.TWSE.NOTETRANS}`
      ),
      safeFetch<TwsePunishItem>(
        `${API_ENDPOINTS.TWSE.BASE}${API_ENDPOINTS.TWSE.PUNISH}`
      ),
      // TPEx APIs
      safeFetch<TpexWarningItem>(API_ENDPOINTS.TPEX.WARNING),
      safeFetch<TpexWarningNoteItem>(API_ENDPOINTS.TPEX.WARNING_NOTE),
      safeFetch<TpexDisposalItem>(API_ENDPOINTS.TPEX.DISPOSAL),
    ]);

    // 轉換資料
    const twseAttentionStocks = transformTwseAttentionStocks(
      twseNotice,
      twseNotetrans
    );
    const twseDisposalStocks = transformTwseDisposalStocks(twsePunish);

    const tpexAttentionStocks = transformTpexAttentionStocks(
      tpexWarning,
      tpexWarningNote
    );
    const tpexDisposalStocks = transformTpexDisposalStocks(tpexDisposal);

    // 合併上市 + 上櫃資料
    const attentionStocks = [...twseAttentionStocks, ...tpexAttentionStocks];
    const disposalStocks = [...twseDisposalStocks, ...tpexDisposalStocks];

    // 排序：注意股票按累計次數降序，處置股票按出關日升序
    attentionStocks.sort((a, b) => b.attentionCount - a.attentionCount);
    disposalStocks.sort((a, b) => a.endDate.localeCompare(b.endDate));

    return {
      attentionStocks,
      disposalStocks,
      lastUpdated: new Date().toISOString(),
    };
  };
