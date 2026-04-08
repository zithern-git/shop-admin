// SPU管理模块的接口
import request from '@/utils/request'

import type { HasSpuResponseData, AllTrademark, SpuImageList, HasSaleAttrResponseData } from './type'

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
  //
  UPDATESPU_URL = '/admin/product/updateSpuInfo',
  SAVESPU_URL = '/admin/product/saveSpuInfo',
  DELETESPU_URL = '/admin/product/deleteSpu/',
}

// 获取某一个三级分类下已有的SPU数据
export const reqHasSpu = (page: number, limit: number, category3Id: string | number) =>
  request.get<any, HasSpuResponseData>(
    `${API.HASSPU_URL}${page}/${limit}?category3Id=${category3Id}`
  )

// 获取全部的SPU品牌数据
export const reqAllTrademark = () => request.get<any, AllTrademark>(API.ALLTRADEMARK_URL)

// 获取SPU图片列表
export const reqSpuImageList = (spuId: number) =>
  request.get<any, HasSpuResponseData>(API.IMAGE_URL + spuId)

export const reqSpuHasSaleAttr = (spuId: number) =>
  request.get<any, HasSpuResponseData>(API.SPUHASSALEATTR_URL + spuId)

export const reqAllSaleAttr = () => request.get<any, HasSaleAttrResponseData>(API.ALLSALEATTR_URL)
