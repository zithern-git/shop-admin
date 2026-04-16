// 角色管理模块的接口
import request from "@/utils/request";
import type { RoleResponseData, RoleData, MenuResponseData, AssignData} from './type'

// 枚举地址
enum API{
  // 获取全部角色的接口
  ALLROLE_URL = '/admin/acl/role/',
  // 新增角色接口的地址
  ADDROLE_URL = '/admin/acl/role/save',
  // 更新已有角色
  UPDATEROLE_URL = '/admin/acl/role/update',
  // 获取全部的菜单与按钮的数据
  ALLPERMISSIONS = '/admin/acl/permission/toAssign/',
  // 给角色分配权限的接口
  ASSIGNPERMISSION_URL = '/admin/acl/permission/doAssign'
}

// 获取权限列表
export const reqAllRoleList = (page:number, limit: number, roleName: string) => {
  return request.get<any, RoleResponseData>(API.ALLROLE_URL + `${page}/${limit}/?roleName=${roleName}`)
}

// 添加角色与更新已有角色
export const reqAddOrUpdateRole = (data: RoleData) => {
  if (data.id) {
    return request.put<any, any>(API.UPDATEROLE_URL, data)
  } else {
    return request.post<any, any>(API.ADDROLE_URL, data)
  }
}

// 获取全部菜单与按钮权限数据
export const reqAllMenuList = (roleId: number) => request.get<any, MenuResponseData>(API.ALLPERMISSIONS + roleId)

// 给角色分配权限
export const reqAssignPermission = (data: AssignData) => request.post<any, any>(API.ASSIGNPERMISSION_URL, data)
