import axios from 'axios';
// 引入 axios 1.x 正确的内部类型
import type { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import { getToken, removeToken } from './token';
import { ElMessage } from 'element-plus';

// 创建 axios 实例
const request: AxiosInstance = axios.create({
  baseURL: 'http://localhost:3000',
  timeout: 5000,
});

// 请求拦截器：使用 InternalAxiosRequestConfig 类型
request.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getToken();
    if (token) {
      // 确保 headers 存在（axios 1.x 中 config.headers 默认是 AxiosHeaders 类型，非 undefined）
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 响应拦截器：保持泛型逻辑不变
request.interceptors.response.use(
  <T>(response: AxiosResponse<T>) => response.data as T,
  (error) => {
    if (error.response?.status === 401) {
      ElMessage.error('登录已过期，请重新登录');
      removeToken();
      window.location.href = '/login';
    }
    ElMessage.error(error.message || '请求失败');
    return Promise.reject(error);
  }
);

export default request;