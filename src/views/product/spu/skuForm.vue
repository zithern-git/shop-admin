<template>
  <el-form label-width="70px">
    <el-form-item label="sku名称">
      <el-input v-model="skuParams.skuName" placeholder="SKU名称" />
    </el-form-item>
    <el-form-item label="价格(元)">
      <el-input v-model="skuParams.price" placeholder="价格(元)" type="number" />
    </el-form-item>
    <el-form-item label="重量(克)">
      <el-input v-model="skuParams.weight" placeholder="重量(克)" type="number" />
    </el-form-item>
    <el-form-item label="sku描述">
      <el-input v-model="skuParams.skuDesc" placeholder="SKU描述" type="textarea" />
    </el-form-item>
    <el-form-item label="平台属性">
      <el-form :inline="true">
        <el-form-item v-for="item in attrArr" :label="item.attrName" :key="item.id">
          <el-select v-model="item.attrIdAndValueId" placeholder="请选择" style="width: 200px">
            <el-option
              v-for="option in item.attrValueList"
              :label="option.valueName"
              :key="option.id"
              :value="`${item.id}:${option.id}`"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-form-item>
    <el-form-item label="销售属性">
      <el-form :inline="true">
        <el-form-item v-for="item in saleArr" :label="item.saleAttrName" :key="item.id">
          <el-select v-model="item.saleIdAndValueId" placeholder="请选择" style="width: 200px">
            <el-option
              v-for="option in item.spuSaleAttrValueList"
              :label="option.saleAttrValueName"
              :key="option.id"
              :value="`${item.id}:${option.id}`"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-form-item>
    <el-form-item label="图片名称">
      <el-table :data="imageArr" border ref="tableRef">
        <el-table-column type="selection" width="80px" align="center"></el-table-column>
        <el-table-column label="图片">
          <template #default="{ row }">
            <img :src="row.url" style="width: 100px; height: 100px" />
          </template>
        </el-table-column>
        <el-table-column label="名称" prop="name"></el-table-column>
        <el-table-column label="操作">
          <template #default="{ row }">
            <el-button type="warning" class="warning-solid" @click="handler(row)"
              >设置默认</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="save">保存</el-button>
      <el-button @click="cancel">取消</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
  import { ref, reactive } from 'vue'
  import type {
    SpuData,
    SpuImageList,
    SpuSaleAttrListResponseData,
    SpuImage,
    SpuSaleAttr,
    SkuData,
  } from '@/api/product/spu/type'
  import { reqAttr } from '@/api/product/attr'
  import { reqSpuImageList, reqSpuHasSaleAttr, reqAddSku } from '@/api/product/spu'
  import type { Attr, AttrResponseData } from '@/api/product/attr/type'
  import { ElMessage } from 'element-plus'

  // 获取tableRef组件实例
  const tableRef = ref<any>()
  // 平台属性
  const attrArr = ref<Attr[]>([])
  // 商品图片
  const imageArr = ref<SpuImage[]>([])
  // 已有的SPU销售属性
  const saleArr = ref<SpuSaleAttr[]>([])

  const skuParams = reactive<SkuData>({
    // 父组件传递过来的数据
    category3Id: '', // 三级分类的ID
    spuId: '', // 已有的SPU的ID
    tmId: '', // SPU品牌的ID
    // v-model收集
    skuName: '', // sku名字
    price: '', // sku价格
    weight: '', // sku重量
    skuDesc: '', // sku的描述
    //
    skuAttrValueList: [],
    skuSaleAttrValueList: [],
    skuDefaultImg: '',
  })

  //
  const initSkuData = async (c1Id: number | string, c2Id: number | string, spu: SpuData) => {
    // 收集数据
    skuParams.category3Id = spu.category3Id
    skuParams.spuId = spu.id as number
    skuParams.tmId = spu.tmId
    // 获取平台属性
    const result: AttrResponseData = await reqAttr(c1Id, c2Id, spu.category3Id)
    // 获取某一个品牌旗下的全部售卖商品图片
    const result1: SpuImageList = await reqSpuImageList(spu.id as number)

    // 获取已有的SPU销售属性的数据
    const result2: SpuSaleAttrListResponseData = await reqSpuHasSaleAttr(spu.id as number)

    // 平台属性
    attrArr.value = result.data
    // SPU对应商品图片
    imageArr.value = (result1.data || []).map(item => ({
      name: item.imgName as string,
      url: item.imgUrl,
    }))
    // 存储已有的SPU的销售属性
    saleArr.value = result2.data || []
  }

  // 设置默认图片的方法回调
  const handler = (row: SpuImage) => {
    // 官方方法1：清空所有勾选（保证只有一个默认）
    tableRef.value.clearSelection()
    // 官方方法2：自动勾选当前行（核心！）
    tableRef.value.toggleRowSelection(row, true)
    // 把默认图片地址赋值给表单
    skuParams.skuDefaultImg = row.url as string
  }

  // 保存按钮的方法
  const save = async (skuParams: SkuData) => {
    // 整理参数
    // 平台属性
    skuParams.skuAttrValueList = attrArr.value.reduce((prev: any, next: any) => {
      if (next.attrIdAndValueId) {
        const [attrId, valueId] = next.attrIdAndValueId.split(':')
        prev.push({
          attrId: Number(attrId),
          valueId: Number(valueId),
        })
      }
      return prev
    }, [])
    // 销售属性
    skuParams.skuSaleAttrValueList = saleArr.value.reduce((prev: any, next: any) => {
      if (next.saleIdAndValueId) {
        const [saleAttrId, saleAttrValueId] = next.saleIdAndValueId.split(':')
        prev.push({
          saleAttrId: Number(saleAttrId),
          saleAttrValueId: Number(saleAttrValueId),
        })
      }
      return prev
    }, [])
    // 添加SKU的请求
    const result: any = await reqAddSku(skuParams)
    if (result.code === 200) {
      ElMessage.success(result.message)
      // 通知父组件切换为场景0
      $emit('changeScene', { flag: 0, params: '' })
    } else {
      ElMessage.error(result.message)
    }
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
