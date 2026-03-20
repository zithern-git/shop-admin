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
    data:dataType
}

interface userInfo {
    userId: number,
    avatar: string,
    username: string,
    desc: string,
    roles: string[],
    buttons: string[],
    routes: string[],
    token: string
}

interface userType {
    user: userInfo
}
// 定义服务器返回用户信息相关的数据类型
export interface userResponseData {
    code: number
    data: userType
}