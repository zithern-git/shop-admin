// 统一管理项目用户相关的接口
import request from "@/utils/request";
import type { loginForm, loginResponseData, userResponseData } from "./type";

// 统一管理接口
enum API{
    LOGIN_URL='/user/login',
    USERINFO_URL='/user/info',
}

// 暴露请求函数
// 登录接口方法
export const reqLogin = (data:loginForm) => request.post<any, loginResponseData>(API.LOGIN_URL, data); 
//data对应user.ts登录接口的respons的{ username, password }

// 获取用户信息
export const reqUserInfo = () => request.get<any, userResponseData>(API.USERINFO_URL);
