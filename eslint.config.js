//  @ts-check

import { tanstackConfig } from '@tanstack/eslint-config'

export default [
  ...tanstackConfig,
  {
    rules: {
      // 允許使用 number[] 語法
      '@typescript-eslint/array-type': ['error', { default: 'array' }],

      // 使用單引號
      '@typescript-eslint/quotes': ['error', 'single', { avoidEscape: true }],

      // 關閉 import 排序檢查
      'import/order': 'off',
    },
  },
]
