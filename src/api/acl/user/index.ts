// 【用户管理】
//   GET    http://localhost:3003/admin/acl/user/:page/:limit
//   POST   http://localhost:3003/admin/acl/user/save
//   PUT    http://localhost:3003/admin/acl/user/update
//   DELETE http://localhost:3003/admin/acl/user/remove/:id
import request from "@/utils/request";
import type { UserResponseData, User } from './type'

enum API {
  // 获取全部已有用户账户信息
  ALLUSER_URL = '/admin/acl/user/',
  // 添加一个新的用户账号
  ADDUSER_URL = '/admin/acl/user/save',
  // 更新一个已有的用户账号
  UPDATEUSER_URL = '/admin/acl/user/update',
  //获取全部职位，当前账号拥有的职位接口
  ALLROLE_URL = '/admin/acl/user/toAssign/'
}

// 获取用户账号信息的接口
export const reqUserInfo = (page: number, limit: number) => request.get<any, UserResponseData>(API.ALLUSER_URL + `${page}/${limit}`)

// 添加用户与更新用户接口
export const reqAddOrUpdateUser = (data: User) => {
  // 携带参数有id 更新
  if (data.id) {
    return request.put<any, any>(API.UPDATEUSER_URL, data)
  } else {
    return request.post<any, any>(API.ADDUSER_URL, data)
  }
}

// 获取全部职位以及包含当前用户的已有职位
export const reqAllRole = (adminId: number) => request.get(API.ALLROLE_URL + adminId)
