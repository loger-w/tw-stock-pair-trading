/**
 * Vite 開發環境 API 插件
 * 在開發模式下攔截 /api/disposal 請求，直接呼叫外部 API
 */

import type { Plugin, Connect } from 'vite';
import type { IncomingMessage, ServerResponse } from 'http';

/**
 * 處置系統 API 插件
 * 僅在開發環境啟用，生產環境由 Vercel Serverless Function 處理
 */
export const disposalApiPlugin = (): Plugin => {
  return {
    name: 'disposal-api-plugin',

    configureServer(server) {
      // 在 Vite 內建 middleware 之前加入自訂 middleware
      server.middlewares.use(
        '/api/disposal',
        async (
          req: Connect.IncomingMessage,
          res: ServerResponse<IncomingMessage>,
          _next: Connect.NextFunction
        ) => {
          // 僅處理 GET 請求
          if (req.method !== 'GET') {
            res.statusCode = 405;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: 'Method not allowed' }));
            return;
          }

          try {
            // 動態載入 core 模組（避免在 vite.config.ts 解析時就載入）
            const { fetchDisposalDataFromSources } = await import(
              '../api/lib/disposal-core'
            );

            const data = await fetchDisposalDataFromSources();

            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.end(JSON.stringify(data));
          } catch (error) {
            console.error('[disposal-api-plugin] Error:', error);

            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(
              JSON.stringify({
                error: 'Internal server error',
                attentionStocks: [],
                disposalStocks: [],
                lastUpdated: new Date().toISOString(),
              })
            );
          }
        }
      );
    },
  };
};
