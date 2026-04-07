import type { Trademark } from '../trademark/type'
// 服务器全部接口返回的数据类型
export interface ResponseData {
  code: number
  message: string
  ok: boolean
}

// SPU图片类型
export interface SpuImage {
  id?: number
  spuId?: number
  imgName?: string
  imgUrl?: string
  name?: string
  url?: string
}

export interface SpuSaleAttrValue {
  id?: number
  saleAttrName: string
  baseSaleAttrId?: number
  saleAttrValueName?: string
}

export interface SpuSaleAttr {
  id?: number
  spuId?: number
  baseSaleAttrId?: number
  saleAttrName?: string
  saleAttrValueList: SpuSaleAttrValue[]
}

// SPU数据的ts类型
export interface SpuData {
  id?: number
  spuName: string
  spuImageList?: SpuImage[]
  spuSaleAttrList?: SpuSaleAttr[]
  description: string
  category3Id: number | string
  tmId: number
  createTime?: string
  updateTime?: string
}

// 数组：元素都是已有SPU数据类型
export type Records = SpuData[]

// 定义获取已有的SPU接口返回的数据ts类型
export interface HasSpuResponseData extends ResponseData {
  data: {
    records: Records
    current: number
    pages: number
    size: number
    total: number
  }
}

// 品牌接口返回数据的ts类型
export interface AllTrademark extends ResponseData {
  data: Trademark[]
}

// SPU图片列表接口返回类型
export interface SpuImageList extends ResponseData {
  data: SpuImage[]
}

// 已有的SPU销售属性值对象ts类型
export interface SpuSaleAttrList extends ResponseData {
  data: SpuSaleAttr[]
}
