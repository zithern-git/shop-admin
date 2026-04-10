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
  response?: imgResponse
}

export interface SpuSaleAttrValue {
  id?: number
  saleAttrName?: string
  baseSaleAttrId?: number | string
  saleAttrValueName?: string
}

export interface SpuSaleAttr {
  id?: number
  spuId?: number
  flag?: boolean
  baseSaleAttrId?: number | string
  saleAttrName?: string
  saleAttrValue?: string
  spuSaleAttrValueList: SpuSaleAttrValue[]
  saleIdAndValueId?: string
}

export interface imgResponse extends ResponseData {
  data: string
}
// SPU数据的ts类型
export interface SpuData {
  id?: number
  spuName: string
  spuImageList?: null | SpuImage[]
  spuSaleAttrList?: null | SpuSaleAttr[]
  description: string
  category3Id: number | string
  tmId: number | string // 品牌id
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

// SPU销售属性列表接口返回类型
export interface SpuSaleAttrListResponseData extends ResponseData {
  data: SpuSaleAttr[]
}

export interface HasSaleAttr {
  id: number
  name: string
}

export interface HasSaleAttrResponseData extends ResponseData {
  data: HasSaleAttr[]
}

export interface Attr {
  attrId: number | string // 平台属性的ID
  valueId: number | string // 属性值的ID
}

export interface SaleAttr {
  saleAttrId: number | string // 属性ID
  saleAttrValueId: number | string // 属性值的ID
}

export interface SkuData {
  category3Id: number | string // 三级分类的ID
  spuId: number | string // 已有的SPU的ID
  tmId: number | string // SPU品牌的ID
  skuName: string // sku名字
  price: number | string // sku价格
  weight: number | string // sku重量
  skuDesc: string // sku的描述
  skuAttrValueList?: Attr[]
  skuSaleAttrValueList?: SaleAttr[]
  skuDefaultImg: string
}

export interface SkuInfoRecords {
  records: SkuData[]
  current: number
  pages: number
  size: number
  total: number
}

// 获取SKU数据接口的ts类型
export interface SkuInfoData extends ResponseData {
  data: SkuData[]
}
