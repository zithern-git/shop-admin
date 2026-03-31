// 书写品牌管理模块接口
import request from "@/utils/request";
import type {TrademarkResponseData} from "./type" // 因为 TrademarkResponseData 是 TypeScript 类型（interface），不是 JS 变量 / 函数 / 组件！所以必须加上 'type'
// 品牌管理模块接口地址
enum API {
  // 获取已有品牌接口
  TRADEMARK_URL = '/admin/product/baseTrademark/',
}

// 获取已有品牌的接口方法
// page：获取第几页---默认第一页
// limit：获取几个已有品牌的数据
export const reqHasTrademark = (page: number, limit: number) => request.get<any, TrademarkResponseData>(API.TRADEMARK_URL + `${page}/${limit}`)
// request.get<【后端原始数据类型】,【你最终要的返回类型】>(url)
