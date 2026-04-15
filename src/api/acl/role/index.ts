// 角色管理模块的接口
import request from "@/utils/request";
import type {RoleResponseData} from './type'

// 枚举地址
enum API{
  ALLROLE_URL = '/admin/acl/role/'
}

// 获取权限列表
export const reqAllRoleList = (page:number, limit: number, roleName: string) => {
  return request.get<any, RoleResponseData>(API.ALLROLE_URL + `${page}/${limit}/?roleName=${roleName}`)
}
