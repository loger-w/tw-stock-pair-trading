import { URL, fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import { devtools } from '@tanstack/devtools-vite'
import viteReact from '@vitejs/plugin-react'

import tailwindcss from '@tailwindcss/vite'

import { tanstackRouter } from '@tanstack/router-plugin/vite'
import { disposalApiPlugin } from './vite/disposal-api-plugin'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    devtools(),
    tanstackRouter({
      target: 'react',
      autoCodeSplitting: true,
    }),
    viteReact(),
    tailwindcss(),
    // 開發環境處理 /api/disposal 請求
    disposalApiPlugin(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    proxy: {
      // FinMind API 仍需 proxy（CORS 問題）
      '/api/finmind': {
        target: 'https://api.finmindtrade.com/api/v4',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/finmind/, ''),
      },
    },
  },
})
