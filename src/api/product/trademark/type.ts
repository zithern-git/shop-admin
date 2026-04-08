export interface ResponseData {
  code:number
  message: string
  ok: boolean
}

// 已有品牌的ts数据类型
export interface Trademark {
  id?: number
  tmName: string
  logoUrl: string
  createTime?: string
  updateTime?: string
}

// 包含全部品牌数据的ts类型
export type Records = Trademark[]

// 获取已有全部品牌数据的ts类型
export interface TrademarkResponseData extends ResponseData {
  data: {
    records: Records
    current: number
    pages: number
    size: number
    total: number
  }
}
