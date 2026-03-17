// windi.config.ts
import { defineConfig } from 'windicss/helpers'
import type { Config } from 'windicss/types/config'

export default defineConfig({
  theme: {
    screens: {
      sm: '576px',
      md: '768px',
      lg: '992px', // 对齐 Element Plus lg 断点
      xl: '1200px',
      '2xl': '1600px'
    },
  },
  attributify: true
} as Config)