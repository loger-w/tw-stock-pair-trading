import type { VercelRequest, VercelResponse } from '@vercel/node';
import { fetchDisposalDataFromSources } from './lib/disposal-core';

/**
 * Vercel Serverless Function: 處置系統 API
 * 核心邏輯在 disposal-core.ts，此處僅處理 HTTP 層
 */
export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // 僅允許 GET 請求
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const data = await fetchDisposalDataFromSources();

    // 設置快取標頭（5 分鐘）
    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=60');

    return res.status(200).json(data);
  } catch (error) {
    console.error('Handler Error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      attentionStocks: [],
      disposalStocks: [],
      lastUpdated: new Date().toISOString(),
    });
  }
}
