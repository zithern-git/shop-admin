import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue' // 1. 导入所有图标
import axios from 'axios'

import App from './App.vue'
import router from './router'
import 'virtual:windi.css'

axios.defaults.baseURL = 'http://localhost:3000'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(ElementPlus)
// 2. 全局注册所有图标（核心步骤！）
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
app.mount('#app')
