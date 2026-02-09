# 處置系統 API 串接問題釐清

## 目前狀況

### 已完成的檔案

| 檔案 | 用途 | 狀態 |
|------|------|------|
| `api/lib/types.ts` | API 原始回應型別定義 | ✅ 已建立 |
| `api/lib/disposal-transformer.ts` | 資料轉換工具（民國年→西元年等） | ✅ 已建立 |
| `api/disposal.ts` | Vercel Serverless Function | ✅ 已建立 |
| `src/services/disposal/api.ts` | 前端 API 服務（改呼叫 `/api/disposal`） | ✅ 已修改 |
| `vite.config.ts` | 開發環境 proxy 設定 | ✅ 已修改 |

### 目前架構

```
瀏覽器 (localhost:3000)
    │
    ▼ fetch('/api/disposal')
    │
Vite Dev Server (port 3000)
    │
    ▼ proxy 到 localhost:3001
    │
❌ 沒有 server 在運行
    │
    ▼ 500 Error
```

---

## 問題描述

1. **前端呼叫 `/api/disposal` 收到 500 錯誤**
2. **沒有真正呼叫證交所/櫃買中心的 API**

### 原因

目前的 `vite.config.ts` 設定：
```typescript
'/api/disposal': {
  target: 'http://localhost:3001',  // ← 這裡期望 vercel dev 在運行
  changeOrigin: true,
},
```

但你只運行了 `npm run dev`，沒有運行 `vercel dev`，所以 proxy 找不到目標 server。

---

## 解決方案選項

### 方案 A：運行兩個 Server（原設計）

**終端機 1：**
```bash
npx vercel dev --listen 3001
```

**終端機 2：**
```bash
npm run dev
```

**優點：** 與生產環境一致
**缺點：** 需要同時運行兩個終端機

---

### 方案 B：Vite 插件處理開發環境 API

建立 `vite-plugin-disposal-api.ts`，在 Vite dev server 中直接處理 `/api/disposal` 請求。

**優點：** 只需運行 `npm run dev`
**缺點：** 需要維護兩份 API 處理邏輯（Vite 插件 + Vercel Function）

---

### 方案 C：開發環境直接 Proxy 到官方 API

修改 `vite.config.ts`，直接 proxy 到證交所/櫃買中心 API。

```typescript
proxy: {
  '/api/twse': {
    target: 'https://openapi.twse.com.tw/v1',
    changeOrigin: true,
    rewrite: (path) => path.replace(/^\/api\/twse/, ''),
  },
  '/api/tpex': {
    target: 'https://www.tpex.org.tw/openapi/v1',
    changeOrigin: true,
    rewrite: (path) => path.replace(/^\/api\/tpex/, ''),
  },
}
```

然後前端在開發環境中分別呼叫這些端點，自行合併資料。

**優點：** 簡單直接
**缺點：** 開發環境和生產環境的 API 呼叫方式不同

---

### 方案 D：暫時使用 Mock Data

在 `src/services/disposal/api.ts` 中將 `USE_REAL_API` 設為 `false`：

```typescript
const USE_REAL_API = false;  // 暫時使用 Mock Data
```

**優點：** 最快速，不需要任何修改
**缺點：** 無法測試真實 API

---

## 待確認事項

1. **你偏好哪個方案？**
   - A：運行兩個 server
   - B：Vite 插件
   - C：直接 proxy
   - D：暫時用 Mock

2. **vercel dev 是否能正常運行？**
   - 是否需要先執行 `vercel login`？
   - 是否需要先執行 `vercel link`？

3. **生產環境部署方式？**
   - 確定使用 Vercel 部署嗎？
   - 還是考慮其他平台？

---

## 相關檔案位置

- Vercel Function: `api/disposal.ts`
- 前端 API 服務: `src/services/disposal/api.ts`
- Vite 配置: `vite.config.ts`
- Vercel 配置: `vercel.json`
