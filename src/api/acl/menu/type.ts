// 数据类型定义
export interface ResponseData {
  code: number
  message: string
  ok: boolean
}

// 菜单数据与按钮数据的ts类型
export interface Permission {
  id?: number,
  name: string,
  type: number,
  level: number,
  createTime: string,
  updateTime: string,
  pid: number,
  path: string,
  component: string,
  icon: string,
  permissionValue: string,
  code: null,
  toCode: null,
  status: null,
  select: boolean,
  children?: PermissionList
}

export type PermissionList = Permission[]

export interface PermissionResponseData extends ResponseData {
  data: PermissionList
}
