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

// 用于过滤当前用户需要展示的异步路由
const filterRoutes = (allRoutes: any[], routeNames: string[]) => {
  return allRoutes.filter((item: any) => {
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
        // console.log('设置 avatar:', this.avatar) // 调试日志
        // 计算异步路由
        const routes = result.data.routes || []
        const userAsyncRoutes = filterRoutes(asyncRoutes, routes)
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
        // 目前没有mock接口：退出登录接口（通知服务器本地用户唯一标识失效）
        this.token = ''
        this.username = ''
        this.avatar = ''
        REMOVE_TOKEN()
        return 'ok'
      } else {
        return Promise.reject(new Error(result.message))
      }
    },
  },
})
// 对外暴露获取小仓库方法
export default useUserStore
