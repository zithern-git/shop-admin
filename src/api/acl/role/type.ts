export interface ResponseData {
  code: number;
  message: string;
  ok: boolean;
}

// 职位数据类型
export interface RoleData {
  id: number;
  roleName: string;
  remark: string;
  createTime: string;
  updateTime: string;
}

// 全部职位的数组的ts类型
export type Records = RoleData[]

// 全部职位数据的相应的ts类型
export interface RoleListResponseData extends ResponseData {
  data: {
    records: Records;
    total: number;
    size: number;
    current: number;
    pages: number;
  }
}
