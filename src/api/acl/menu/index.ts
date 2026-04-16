import request from '@/utils/request'
import type { PermissionResponseData, Permission, MenuParams } from './type'

// 【菜单管理】
//   GET    http://localhost:3003/admin/acl/permission
//   POST   http://localhost:3003/admin/acl/permission/save
//   PUT    http://localhost:3003/admin/acl/permission/update
//   DELETE http://localhost:3003/admin/acl/permission/remove/:id

// 枚举地址
enum API {
  // 获取全部菜单与按钮的标识数据
  ALLPERMISSION_URL = '/admin/acl/permission',
  // 给某一级菜单新增一个子菜单
  ADDPERMISSION_URL = '/admin/acl/permission/save',
  // 更新某一个已有的菜单
  UPDATEPERMISSION_URL = '/admin/acl/permission/update',
  // 删除某一个已有的菜单
  REMOVEPERMISSION_URL = '/admin/acl/permission/remove/',
}

// 获取菜单数据的请求
export const reqAllPermission = () =>
  request.get<any, PermissionResponseData>(API.ALLPERMISSION_URL)

// 添加或更新菜单的请求
export const reqAddOrUpdatePermission = (data: MenuParams) => {
  if (data.id) {
    return request.put<any, any>(API.UPDATEPERMISSION_URL, data)
  } else {
    return request.post<any, any>(API.ADDPERMISSION_URL, data)
  }
}

// 删除某一个已有菜单的请求
export const reqRemovePermission = (id: number) =>
  request.delete<any, any>(API.REMOVEPERMISSION_URL + id)
