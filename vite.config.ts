import { fileURLToPath, URL } from 'node:url'

import { defineConfig, UserConfigExport, ConfigEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vueDevTools from 'vite-plugin-vue-devtools'
import WindiCSS from 'vite-plugin-windicss'
import { viteMockServe } from 'vite-plugin-mock'
import { resolve } from 'path' // 核心：引入path模块

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    vueDevTools(),
    WindiCSS(),
    viteMockServe({
      // default
      enable: true,
      mockPath: 'mock',
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  // scss全局变量的一个配置
  css: {
    preprocessorOptions: {
      scss: {
        // additionalData: `@use "./src/styles/variable.scss";`, // 报错！！！！！
        additionalData: `@use "@/styles/variable.scss" as *;`,
      },
    },
  },
})
