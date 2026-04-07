<template>
  <div class="flex flex-wrap gap-2">
    <Category :scene="scene" />
    <el-card style="width: 100%" shadow="always">
      <div v-show="scene === 0">
        <el-button
          type="primary"
          size="default"
          icon="Plus"
          :disabled="!categoryStore.c3Id"
          @click="addSpu"
          >添加属性</el-button
        >
        <!-- 展示已有SPU数据 -->
        <el-table :data="records" border style="margin: 10px 0">
          <el-table-column label="序号" type="index" align="center" width="80px"></el-table-column>
          <el-table-column prop="spuName" label="SPU名称" width="120px"></el-table-column>
          <el-table-column
            prop="description"
            label="SPU描述"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column label="操作" width="240px">
            <!-- row:已有的属性对象 -->
            <template #default="{ row, $index }">
              <el-button type="primary" size="small" icon="Plus" title="添加SKU" />
              <!-- 修改已有属性的按钮 -->
              <el-button
                type="warning"
                style="background: #ff9f00; color: #fff"
                size="small"
                icon="Edit"
                @click="updateSpu(row, $index)"
                title="修改SPU"
              />
              <el-button
                type="info"
                style="background: #909399; color: #fff"
                size="small"
                icon="InfoFilled"
                title="查看SPU"
              />
              <el-popconfirm :title="`确认删除${row.attrName}吗？`" width="200px">
                <template #reference>
                  <el-button type="danger" size="small" icon="Delete" title="删除SPU" />
                </template>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页器 -->
        <el-pagination
          v-model:current-page="pageNo"
          v-model:page-size="pageSize"
          :page-sizes="[1, 3, 5, 7]"
          :background="true"
          layout="prev,pager,next,jumper,->, sizes, total"
          :total="total"
        />
      </div>
      <div v-show="scene === 1">
        <!-- 添加SPU|修改SPU子组件 -->
        <SpuForm @changeScene="changeScene" :options="options" />
      </div>
      <div v-show="scene === 2">
        <!-- 添加SKU子组件 -->
        <SkuForm />
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
  import { ref, watch } from 'vue'
  // 引入分类的仓库
  import useCategoryStore from '@/store/modules/category'
  import { reqHasSpu, reqAllTrademark, reqSpuImageList, reqSpuHasSaleAttr } from '@/api/product/spu'
  import type { Records, HasSpuResponseData, SpuImageList } from '@/api/product/spu/type'
  import SpuForm from './spuForm.vue'
  import SkuForm from './skuForm.vue'

  // 场景切换和分类存储,0：显示已有SPU；1：添加或者修改已有SPU；2：添加SKU的结构
  const scene = ref<number>(0)
  const categoryStore = useCategoryStore()
  // 分页器默认页码
  const pageNo = ref<number>(1)
  // 每一页展示几条数据
  const pageSize = ref<number>(3)
  // 存储已有SPU总数
  const total = ref<number>(0)
  const records = ref<Records>([])

  // 此方法执行：可以获取某一个三级分类下全部已有的SPU
  const getHasSPU = async () => {
    // const result: HasSpuResponseData = await reqHasSpu(pageNo.value, pageSize.value, categoryStore.c3Id);
    const result: HasSpuResponseData = await reqHasSpu(pageNo.value, pageSize.value, 61)
    if (result.code === 200) {
      records.value = result.data.records
      total.value = result.data.total
    }
  }

  // 监听三级分类ID变化
  watch(
    () => categoryStore.c3Id,
    () => {
      if (categoryStore.c3Id) {
        getHasSPU()
      }
    }
  )

  // 监听分页变化 → 自动请求
  watch([pageNo, pageSize], () => {
    getHasSPU()
  })

  // 添加新的SPU按钮的回调
  const addSpu = () => {
    // 切换为场景1：添加与修改已有SPU结构->SpuForm
    scene.value = 1
  }

  const options = ref<any>([])
  // 修改已有的SPU按钮的回调
  const updateSpu = async (row, $index: number) => {
    console.log('row', row)
    // 切换为场景1：修改已有SPU结构->SpuForm
    scene.value = 1
    const result = await reqAllTrademark()
    options.value = result.data
    const imgListResult = await reqSpuImageList(row.id)
    const imgList: SpuImageList = imgListResult.data.records[0]?.spuImageList
    const hasSaleAttrResult = await reqSpuHasSaleAttr(row.id)
    console.log('hasSaleAttrResult', hasSaleAttrResult)
  }

  // 子组件SpuForm绑定自定义事件：目前是让子组件通知父组件切换场景为0
  const changeScene = (SceneNum: number) => {
    // 子组件SpuForm点击取消变为场景0，展示已有的SPU
    scene.value = SceneNum
  }
</script>

<style></style>
