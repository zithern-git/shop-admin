import { fileURLToPath, URL } from 'node:url'

import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vueDevTools from 'vite-plugin-vue-devtools'
import WindiCSS from 'vite-plugin-windicss'
// mock插件提供方法
import { viteMockServe } from 'vite-plugin-mock'
import { resolve } from 'path' // 核心：引入path模块

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // 获取各种环境下的对应的变量，mode 是 'development' 或 'production'
  const env = loadEnv(mode, process.cwd(), '')
  return {
    server: {
      // hmr: true,
      // watch: {
      //   usePolling: true,
      // },
      proxy: {
        // 匹配请求前缀，对象键想用变量值 → 必须加 []
        // [env.VITE_APP_BASE_API]
        '/api': {
          // 获取数据的服务器地址设置
          target: env.VITE_SERVER || 'http://localhost:3001',
          // 需要代理跨域
          changeOrigin: true,
          // 路径重写
          rewrite: path => path.replace(/^\/api/, ''),
        },
      },
    },
    plugins: [
      vue(),
      vueJsx(),
      vueDevTools(),
      WindiCSS(),
      viteMockServe({
        // default
        // enable: true,
        enable: false, //关闭mock
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
  }
})
