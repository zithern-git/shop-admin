import axios from "axios";
import { ElNotification } from 'element-plus'

const service = axios.create({
    baseURL:"http://localhost:3000"
})

// 添加请求拦截器
service.interceptors.request.use(function (config) {
    // 在发送请求之前做些什么
    return config;
  }, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
  });

// 添加响应拦截器
service.interceptors.response.use(function (response) {
    // 2xx 范围内的状态码都会触发该函数。
    // 对响应数据做点什么
    return response;
  }, function (err) {
    // 超出 2xx 范围的状态码都会触发该函数。
    // 对响应错误做点什么

    /* if (err.message.includes('Failed to fetch') || err.message.includes('Network Error')) {
      ElNotification({
        message: '连接服务器失败，请检查 Mock 服务是否启动',
        type: 'error',
        duration: 2000
      })
    } 
    // 2. 其他错误（如接口返回格式错误、状态码错误）
    else {
      ElNotification({
        message: `登录失败：${err.message || '未知错误'}`,
        type: 'error',
        duration: 2000
      })
    } */

    return Promise.reject(err);
  });

export default service