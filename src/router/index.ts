import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import NotFound from '@/views/NotFound.vue'
import Login from '@/views/Login.vue'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue'),
    },
    {
      path: '/:pathMatch(.*)*', // 通配符，匹配所有未定义路径
      name: 'NotFound',
      component: NotFound,
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
    },
  ],
})

export default router
