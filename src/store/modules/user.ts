import type { loginForm, loginResponseData } from '@/api/user/type'
import type { UserState } from './types/types'
import { reqLogin, reqUserInfo } from '@/api/user/index'
// 创建用户相关的小仓库
import { defineStore } from 'pinia'
// 引入操作本地存储的工具方法
import { SET_TOKEN, GET_TOKEN } from '@/utils/token'
// 引入路由（常量路由）
import { constantRoutes } from '@/router/routes'

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
    async userLogin(data: loginForm) {
      // 登录请求
      const res: loginResponseData = await reqLogin(data)
      // 登录请求：成功200->token
      // 登录失败：成功201->登录失败错误信息
      if (res.code === 200) {
        this.token = res.data.token as string // 不断言会报错
        // 本地存储 持久化存储一份
        SET_TOKEN(res.data.token as string)
        return 'ok'
      } else {
        return Promise.reject(new Error(res.data.message))
      }
    },
    // 获取用户信息的方法
    async userInfo() {
      // 获取用户信息进行存储仓库当中[用户头像、名字]
      const result = await reqUserInfo()
      console.log('result', result.data)
      // 如果获取用户信息成功，存储一下用户信息
      if (result.code === 200) {
        this.username = result.data.username
        this.avatar = result.data.avatar
      } else {

      }
    }
  },
})
// 对外暴露获取小仓库方法
export default useUserStore
