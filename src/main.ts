import { createApp } from 'vue'
import ElementPlus from 'element-plus'
// 导入 Element Plus 基础样式和主题变量
import 'element-plus/theme-chalk/src/index.scss'
import 'element-plus/dist/index.css'
import 'virtual:windi.css'
import pinia from './store'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import App from './App.vue'
import router from './router'
// 引入模板的全局样式（放在最后，避免覆盖 Element Plus）
import '@/styles/index.scss'
// 引入路由鉴权文件
import './permission'
// 引入 SVG 图标注册脚本（必须）
import 'virtual:svg-icons-register'
import globalComponent from './components'
import 'element-plus/theme-chalk/dark/css-vars.css' // 👈 暗黑模式必须加这个
// 引入自定义指令文件
import { hasButtons } from '@/directive/has'

const app = createApp(App)

hasButtons(app)
app.use(pinia)
app.use(router)
app.use(ElementPlus)
app.use(globalComponent)

// 全局注册所有图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.mount('#app')
