export interface ResponseData {
  code: number;
  message: string;
  ok: boolean;
}

// 职位数据类型
export interface RoleData {
  id?: number;
  roleName: string;
  remark?: string;
  createTime?: string;
  updateTime?: string;
}

// 全部职位的数组的ts类型
export type Records = RoleData[]

// 全部职位数据的相应的ts类型
export interface RoleResponseData extends ResponseData {
  data: {
    records: Records;
    total: number;
    size: number;
    current: number;
    pages: number;
  }
}

// 菜单与按钮数据的ts类型
export interface MenuData {
  id: number;
  name: string;
  pid: number;
  level: number;
  select: boolean;
  children?: MenuList;
}

export type MenuList = MenuData[]

export interface MenuResponseData extends ResponseData {
  data: MenuList
}

export interface Data {
  roleId: number
  permissionId: number[]
}
