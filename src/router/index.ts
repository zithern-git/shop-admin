// 通过vue-router插件实现模板路由配置
import { createRouter, createWebHashHistory } from 'vue-router'
import { constantRoute } from './routes'

const router = createRouter({
  history: createWebHashHistory(),
  routes: constantRoute,
  // 滚动行为：每次路由切换后，页面滚动条强制回到「左上角（顶部 + 最左侧）」。
  scrollBehavior() {
    return {
      left: 0, // 水平滚动条回到最左侧
      top: 0, // 垂直滚动条回到最顶部
    }
  },
})

export default router
