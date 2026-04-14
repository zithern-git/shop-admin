// 账号信息的ts类型
export interface ResponseData {
  code: number
  message: string
  ok: boolean
}

// 代表一个账号信息的ts类型
export interface User {
  createTime?: string
  id?: number
  name?: string
  password?: string
  role?: string
  updateTime?: string
  username?: string
}

// 数组包含全部的用户信息
export type Records = User[]

// 获取全部用户信息接口返回的数据ts类型
export interface UserResponseData extends ResponseData {
  data: {
    current: number
    pages: number
    size: number
    total: number
    records: Records
  }
}

// 代表一个职位的ts类型
export interface RoleData {
  createTime?: string
  id?: number
  remark: string
  roleName: string
  updateName?: string
}

// 全部职位的列表
export type AllRole = RoleData[]

// 获取全部职位的接口返回的数据ts类型
export interface AllRoleResponseData extends ResponseData {
  data: {
    allRolesList: AllRole
    assignRoles: AllRole
  }
}

export interface data {
  roleIdList: number[]
  userId: number
}
