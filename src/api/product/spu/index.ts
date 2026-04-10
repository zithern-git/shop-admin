// SPU管理模块的接口
import request from '@/utils/request'

import type {
  HasSpuResponseData,
  AllTrademark,
  HasSaleAttrResponseData,
  SpuData,
  SkuData,
  SkuInfoData,
  SpuImageList,
  SpuSaleAttrListResponseData,
} from './type'

enum API {
  // 获取已有的SPU数据
  HASSPU_URL = '/admin/product/',
  // 获取全部品牌 trademark 列表
  ALLTRADEMARK_URL = '/admin/product/baseTrademark/getTrademarkList',
  // 获取SPU图片列表
  IMAGE_URL = '/admin/product/spuImageList/',
  // 获取某一个SPU下全部已有的销售属性接口地址
  SPUHASSALEATTR_URL = '/admin/product/spuSaleAttrList/',
  // 获取整个项目全部的销售属性[颜色、版本、尺码]
  ALLSALEATTR_URL = '/admin/product/baseSaleAttrList',
  // 更新已有的SPU
  UPDATESPU_URL = '/admin/product/updateSpuInfo',
  // 追加一个新的SPU
  ADDSPU_URL = '/admin/product/saveSpuInfo',
  // 追加一个新的SKU
  ADDSKU_URL = '/admin/product/saveSkuInfo',
  // 查看某一个已有的SPU下全部售卖的商品
  SKUINFO_URL = '/admin/product/findBySpuId/',
  //
  DELETESPU_URL = '/admin/product/deleteSpu/',
}

// 获取某一个三级分类下已有的SPU数据
export const reqHasSpu = (page: number, limit: number, category3Id: string | number) =>
  request.get<any, HasSpuResponseData>(
    `${API.HASSPU_URL}${page}/${limit}?category3Id=${category3Id}`
  )

// 获取全部的SPU品牌数据
export const reqAllTrademark = () => request.get<any, AllTrademark>(API.ALLTRADEMARK_URL)

// 获取某一个已有的SPU下全部商品的图片地址
export const reqSpuImageList = (spuId: number) =>
  request.get<any, SpuImageList>(API.IMAGE_URL + spuId)

// 获取某一个已有的SPU拥有多少个销售属性
export const reqSpuHasSaleAttr = (spuId: number) =>
  request.get<any, SpuSaleAttrListResponseData>(API.SPUHASSALEATTR_URL + spuId)

// 获取全部的销售属性
export const reqAllSaleAttr = () => request.get<any, HasSaleAttrResponseData>(API.ALLSALEATTR_URL)

// 添加一个新的SPU
// 更新已有的SPU接口
export const reqAddOrUpdateSpu = (data: SpuData) => {
  // 判断是否携带id，携带id就是修改，不携带id就是添加
  if (data.id) {
    return request.post<any, any>(API.UPDATESPU_URL, data)
  } else {
    return request.post<any, any>(API.ADDSPU_URL, data)
  }
}

// 添加SKU的请求方法
export const reqAddSku = (data: SkuData) => request.post<any, any>(API.ADDSKU_URL, data)

// 获取SKU数据
export const reqSkuList = (spuId: number | string) =>
  request.get<any, SkuInfoData>(API.SKUINFO_URL + spuId)
