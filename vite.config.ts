import { fileURLToPath, URL } from 'node:url'

import { defineConfig, UserConfigExport, ConfigEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vueDevTools from 'vite-plugin-vue-devtools'
import WindiCSS from 'vite-plugin-windicss'
import { viteMockServe } from 'vite-plugin-mock'

// https://vite.dev/config/
export default defineConfig(
  {
    plugins: [vue(), vueJsx(), vueDevTools(), WindiCSS(),
      viteMockServe({
          // default
          enable: true, 
          mockPath: 'mock' ,
        })
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    server: {
      port: 5173 // 固定 Vite 端口
    }
  }
)
