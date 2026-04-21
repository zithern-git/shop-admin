// 引入数据类型
// import type { loginForm, loginResponseData } from '@/api/user/type'
import type { UserState } from './types/types'
import { reqLogin, reqUserInfo, reqLogout } from '@/api/user/index'
import type { loginFormData, loginRealResponseData, userInfoResponseData } from '@/api/user/type'

// 创建用户相关的小仓库
import { defineStore } from 'pinia'
// 引入操作本地存储的工具方法
import { SET_TOKEN, GET_TOKEN, REMOVE_TOKEN } from '@/utils/token'
// 引入路由（常量路由）
import { constantRoutes, asyncRoutes, anyRoutes } from '@/router/routes'
import router from '@/router'
// 引入深拷贝方法
import cloneDeep from 'lodash/cloneDeep'

// 用于过滤当前用户需要展示的异步路由
const filterRoutes = (asyncRoute: any[], routeNames: string[]) => {
  return asyncRoute.filter((item: any) => {
    if (routeNames.includes(item.name)) {
      if (item.children && item.children.length > 0) {
        item.children = filterRoutes(item.children, routeNames)
      }
      return true
    }
    return false
  })
}

// 创建用户小仓库
const useUserStore = defineStore('User', {
  // 小仓库存储数据的地方
  state: (): UserState => {
    return {
      token: GET_TOKEN(), // 用户唯一标识token
      menuRoutes: constantRoutes, //仓库存储生成菜单需要数组（路由）
      username: '',
      avatar: '',
      buttons: [],
    }
  },
  getters: {},
  // 异步|逻辑的地方
  actions: {
    // 用户登录的方法
    async userLogin(data: loginFormData) {
      // 登录请求
      const result: any = await reqLogin(data)
      // 登录请求：成功200->token
      // 登录失败：成功201->登录失败错误信息
      if (result.code === 200) {
        // 后端返回 data: { token: '...' }
        const token = result.data.token
        this.token = token
        // 本地存储 持久化存储一份
        SET_TOKEN(token)
        return 'ok'
      } else {
        return Promise.reject(new Error(result.message))
      }
    },
    // 获取用户信息的方法
    async userInfo() {
      // 获取用户信息进行存储仓库当中[用户头像、名字]
      const result: userInfoResponseData = await reqUserInfo()
      // console.log('userInfo 返回:', result) // 调试日志
      // 如果获取用户信息成功，存储一下用户信息
      if (result.code === 200) {
        this.username = result.data.name
        this.avatar = result.data.avatar
        this.buttons = result.data.buttons
        // console.log('设置 avatar:', this.avatar) // 调试日志
        // 计算异步路由
        const routes = result.data.routes || []
        const userAsyncRoutes = filterRoutes(cloneDeep(asyncRoutes), routes)
        // 菜单的数据
        this.menuRoutes = [...constantRoutes, ...userAsyncRoutes, anyRoutes]
        // 目前路由器管理的只有常量路由：用户计算完毕异步路由、任意路由动态追加
        const routesToAdd = [...userAsyncRoutes, anyRoutes]
        routesToAdd.forEach((route: any) => {
          router.addRoute(route)
        })
        return 'ok'
      } else {
        return Promise.reject('获取用户信息失败')
      }
    },
    // 用户退出登录的方法
    async userLogout() {
      const result: any = await reqLogout()
      if (result.code === 200) {
        // 清空动态添加的路由
        this.resetRouter()
        // 重置仓库状态
        this.token = ''
        this.username = ''
        this.avatar = ''
        this.menuRoutes = constantRoutes
        REMOVE_TOKEN()
        return 'ok'
      } else {
        return Promise.reject(new Error(result.message))
      }
    },

    // 重置路由方法
    resetRouter() {
      // 获取当前所有路由
      const allRoutes = router.getRoutes()
      // 移除动态添加的异步路由
      allRoutes.forEach(route => {
        const routeName = route.name
        // 只移除异步路由（根据 name 判断）
        if (routeName && asyncRoutes.some(r => r.name === routeName)) {
          router.removeRoute(routeName)
        }
      })
    },
  },
})
// 对外暴露获取小仓库方法
export default useUserStore
