import { useCookies } from '@vueuse/integrations/useCookies'

// 初始化 Cookies 实例（指定 Cookie 前缀，避免冲突）
const cookies = useCookies(['token']);

// Token 的 Cookie 键名（统一定义，方便维护）
const TOKEN_KEY = 'user_token';

/**
 * 存储 Token 到 Cookie
 * @param {string} token - 登录返回的 Token 字符串
 * @param {number} expires - 过期时间（单位：天，默认 1 天）
 */
export function setToken(token:string, expires = 1) {
  // 设置 Cookie：key + 值 + 过期时间 + 路径（/ 表示全站可用）
  cookies.set(TOKEN_KEY, token, {
    expires: new Date(Date.now() + expires * 24 * 60 * 60 * 1000),
    path: '/', // 确保所有路由都能读取到
    // 生产环境建议添加：secure: true（仅 HTTPS 传输）、sameSite: 'strict'（防止 CSRF）
  });
}

/**
 * 从 Cookie 读取 Token
 * @returns {string|null} Token 字符串（不存在则返回 null）
 */
export function getToken() {
  return cookies.get(TOKEN_KEY) || null;
}

/**
 * 从 Cookie 删除 Token（退出登录用）
 */
export function removeToken() {
  cookies.remove(TOKEN_KEY, { path: '/' }); // 路径要和设置时一致
}