<template>
  <el-form label-width="70px">
    <el-form-item label="sku名称">
      <el-input placeholder="SKU名称" />
    </el-form-item>
    <el-form-item label="价格(元)">
      <el-input placeholder="价格(元)" type="number" />
    </el-form-item>
    <el-form-item label="重量(克)">
      <el-input placeholder="重量(克)" type="number" />
    </el-form-item>
    <el-form-item label="sku描述">
      <el-input placeholder="SKU描述" type="textarea" />
    </el-form-item>
    <el-form-item label="平台属性">
      <el-form :inline="true">
        <el-form-item v-for="item in attrArr" :label="item.attrName" :key="item.id">
          <el-select placeholder="请选择" style="width: 200px">
            <el-option
              v-for="option in item.attrValueList"
              :label="option.valueName"
              :key="option.id"
              :value="option.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-form-item>
    <el-form-item label="销售属性">
      <el-form :inline="true">
        <el-form-item v-for="item in saleArr" :label="item.saleAttrName" :key="item.id">
          <el-select placeholder="请选择" style="width: 200px">
            <el-option
              v-for="option in item.spuSaleAttrValueList"
              :label="option.saleAttrValueName"
              :key="option.id"
              :value="option.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-form-item>
    <el-form-item label="图片名称">
      <el-table :data="imageArr" border>
        <el-table-column type="selection" width="80px" align="center"></el-table-column>
        <el-table-column label="图片">
          <template #default="{ row }">
            <img :src="row.url" style="width: 100px; height: 100px" />
          </template>
        </el-table-column>
        <el-table-column label="名称" prop="name"></el-table-column>
        <el-table-column label="操作">
          <el-button type="warning" class="warning-solid">设置默认</el-button>
        </el-table-column>
      </el-table>
    </el-form-item>
    <el-form-item>
      <el-button type="primary">保存</el-button>
      <el-button @click="cancel">取消</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import type { SpuData, HasSpuResponseData, SpuImage, SpuSaleAttr } from '@/api/product/spu/type'
  import { reqAttr } from '@/api/product/attr'
  import { reqSpuImageList, reqSpuHasSaleAttr } from '@/api/product/spu'
  import type { Attr, AttrResponseData } from '@/api/product/attr/type'

  // 平台属性
  const attrArr = ref<Attr[]>([])
  // 商品图片
  const imageArr = ref<SpuImage[]>([])
  // 已有的SPU销售属性
  const saleArr = ref<SpuSaleAttr[]>([])

  //
  const initSkuData = async (c1Id: number | string, c2Id: number | string, spu: SpuData) => {
    // 获取平台属性
    const result: AttrResponseData = await reqAttr(c1Id, c2Id, spu.category3Id)
    // 获取某一个品牌旗下的全部售卖商品图片
    const result1: HasSpuResponseData = await reqSpuImageList(spu.id as number)

    // 获取已有的SPU销售属性的数据
    const result2: HasSpuResponseData = await reqSpuHasSaleAttr(spu.id as number)

    // 平台属性
    attrArr.value = result.data
    // SPU对应商品图片
    imageArr.value = (result1.data.records[0]?.spuImageList || []).map(item => ({
      name: item.imgName as string,
      url: item.imgUrl,
    }))
    // 存储已有的SPU的销售属性
    saleArr.value = result2.data.records[0]?.spuSaleAttrList || []
  }

  // 自定义事件方法
  const $emit = defineEmits(['changeScene'])

  // 点击取消按钮：通知父组件切换场景为0，展示已有的SPU数据
  const cancel = () => {
    // 关键：emit(事件名, 要传的值)
    $emit('changeScene', { flag: 0, params: '' })
  }

  // 对外暴露方法
  defineExpose({ initSkuData })
</script>

<style scoped>
  /* .warning-solid {
    --el-button-bg-color: #e6a23c;
    --el-button-border-color: #e6a23c;
    --el-button-text-color: #fff;
    --el-button-hover-bg-color: #e6a23c;
    --el-button-hover-border-color: #e6a23c;
    --el-button-hover-text-color: #fff;
    background-color: var(--el-button-bg-color);
    color: var(--el-button-text-color) !important;
    border-color: var(--el-button-border-color);
  }
  .warning-solid:hover,
  .warning-solid:focus {
    background-color: var(--el-button-hover-bg-color);
    border-color: var(--el-button-hover-border-color);
    color: var(--el-button-hover-text-color) !important;
  } */
</style>
