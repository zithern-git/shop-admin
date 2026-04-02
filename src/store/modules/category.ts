// 商品分类全局组件的小仓库
import { defineStore } from 'pinia'
import { reqC1, reqC2, reqC3 } from '@/api/product/attr'
import type {CategoryState} from './types/types'
import type { CategoryResponseData } from '@/api/product/attr/type'

const useCategoryStore = defineStore('Category', {
  state: (): CategoryState => {
    return {
      // 存储一级分类的数据
      c1Arr: [],
      c2Arr: [],
      c3Arr: [],
      // 存储一级分类的id
      c1Id: '',
      c2Id: '',
      c3Id: '',
    }
  },
  actions: {
    async getC1() {
      // 发请求获取一级分类的数据
      const result: CategoryResponseData = await reqC1()
      if (result.code === 200) {
        this.c1Arr = result.data
      }
    },
    async getC2() {
      // 发请求获取一级分类的数据
      const result: CategoryResponseData = await reqC2(this.c1Id)
      if (result.code === 200) {
        this.c2Arr = result.data
      }
    },
    async getC3() {
      // 发请求获取一级分类的数据
      const result: any = await reqC3(this.c2Id)
      if (result.code === 200) {
        this.c2Arr = result.data
      }
    },
  },
  getters: {},
})

export default useCategoryStore
