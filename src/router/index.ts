import { createRouter, createWebHashHistory } from 'vue-router'
import IndexView from '../views/IndexView.vue'
import NotFound from '@/views/NotFound.vue'
import LoginView from '@/views/LoginView.vue'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', redirect: '/login' },
    {
      path: '/index',
      name: 'index',
      component: () => import('../views/IndexView.vue'),
      // 路由守卫：如果没登录，强制跳回登录页
      beforeEnter: (to, from, next) => {
        const isLoggedIn = localStorage.getItem('isLoggedIn')
        if (isLoggedIn) next()
        else next('/login')
      }
    },
    {
      path: '/:pathMatch(.*)*', // 通配符，匹配所有未定义路径
      name: 'NotFound',
      component: NotFound,
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
    },
  ],
})

export default router
