// 进行axios的二次封装
import axios from 'axios'
// 引入 axios 1.x 正确的内部类型
import type { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from 'axios'
import { ElMessage } from 'element-plus'

// 第一步：利用axios 的create 方法创建 axios 实例
const request: AxiosInstance = axios.create({
  // 基础路径
  baseURL: '/api',
  // baseURL: import.meta.env.BASE_URL, //基础路径上会携带'/api'
  // 设置超时时间
  timeout: 5000,
})

// 第二步：实例添加请求拦截器与响应拦截器
// 请求拦截器：使用 InternalAxiosRequestConfig 类型
request.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  // 返回配置对象，config配置对象，headers属性请求头，经常给服务器端携带公共参数
  // console.log('@@', config)
  // config.headers.token = '123'
  return config
})

// 第三步：响应拦截器
request.interceptors.response.use(
  (response) => {
    // 成功回调，简化数据
    // console.log('##', response)
    return response.data
  },
  (error) => {
    // 失败回调：处理http网络错误的
    // 定义一个变量：存储网络错误信息
    let message = ''
    // http状态码
    const status = error.response.status
    switch (status) {
      case 401:
        message = 'token过期'
        break
      case 403:
        message = '无权访问'
        break
      case 404:
        message = '请求地址错误'
        break
      case 500:
        message = '服务器出现问题'
        break
      default:
        message = '网络出现问题'
        break
    }
    // 提示错误信息
    ElMessage.error(message)
    return Promise.reject(error)
  },
)
// console.log(axios)
// console.log(request)

// 对外暴露
export default request
