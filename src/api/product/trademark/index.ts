// 书写品牌管理模块接口
import request from '@/utils/request'
import type { TrademarkResponseData, Trademark, ResponseData } from './type' // 因为 TrademarkResponseData 是 TypeScript 类型（interface），不是 JS 变量 / 函数 / 组件！所以必须加上 'type'
// 品牌管理模块接口地址
enum API {
  // 获取已有品牌接口
  TRADEMARK_URL = '/admin/product/baseTrademark/',
  // 添加品牌接口
  ADDTRADEMARK_URL = '/admin/product/baseTrademark/save',
  // 修改品牌接口
  UPDATETRADEMARK_URL = '/admin/product/baseTrademark/update',
  // 删除品牌接口
  DELETE_URL = '/admin/product/baseTrademark/remove/',
}

// 获取已有品牌的接口方法
// page：获取第几页---默认第一页
// limit：获取几个已有品牌的数据
export const reqHasTrademark = (page: number, limit: number) =>
  request.get<any, TrademarkResponseData>(API.TRADEMARK_URL + `${page}/${limit}`)
// request.get<【后端原始数据类型】,【你最终要的返回类型】>(url)

// 添加与修改品牌的接口方法
export const reqAddOrUpdateTrademark = (data: Trademark) => {
  // 判断是否携带id，携带id就是修改，不携带id就是添加
  if (data.id) {
    return request.put<any, any>(API.UPDATETRADEMARK_URL, data)
  } else {
    return request.post<any, any>(API.ADDTRADEMARK_URL, data)
  }
}

// 删除已有品牌的接口方法，删除接口：必须传入 id
export const reqDeleteTrademark = (id: number) => request.delete<any, any>(API.DELETE_URL + id)
