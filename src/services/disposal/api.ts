import type { DisposalApiResponse } from '@/types/disposal';

/**
 * 取得處置系統資料（注意股票 + 處置股票）
 *
 * 開發環境：Vite 插件攔截並處理請求
 * 生產環境：Vercel Serverless Function 處理請求
 */
export const fetchDisposalData = async (): Promise<DisposalApiResponse> => {
  const response = await fetch('/api/disposal');

  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }

  return response.json();
};
