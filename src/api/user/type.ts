// 登录接口需要携带的参数ts类型
export interface loginForm{
    username:string
    password:string
}

export interface dataType{
    token?: string
    message?: string
}

// 登录接口返回数据类型
export interface loginResponseData{
    code:number,
    data: {
        token: string
    }
}

// 用户信息对象（和 mock 完全一致）
export interface userInfo {
    userId: number
    avatar: string
    username: string
    desc: string
    roles: string[]
    buttons: string[]
    routes: string[]
    token: string
}

// 获取用户信息接口返回类型
export interface userResponseData {
    code: number
    data: userInfo   // 这里直接是 userInfo，没有多余的 user 包裹！
}
