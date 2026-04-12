export interface ResponseData {
  code: number
  message: string
  ok: boolean
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

// 获取SKU接口返回的数据ts类型
export interface SkuResponseData extends ResponseData {
  data: {
    records: SkuData[]
    current: number
    pages: number
    size: number
    total: number
  }
}
