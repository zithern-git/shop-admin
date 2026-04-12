<template>
  <el-card>
    <el-table :data="skuArr" border style="margin-bottom: 10px">
      <el-table-column label="序号" type="index" align="center" width="80px"></el-table-column>
      <el-table-column
        label="名称"
        prop="skuName"
        show-overflow-tooltip
        width="150px"
      ></el-table-column>
      <el-table-column
        label="描述"
        prop="skuDesc"
        show-overflow-tooltip
        width="150px"
      ></el-table-column>
      <el-table-column label="默认图片" width="150px">
        <template #default="{ row }">
          <img :src="row.skuDefaultImg" style="width: 100px; height: 100px" />
        </template>
      </el-table-column>
      <el-table-column label="重量(g)" prop="weight" width="150px"></el-table-column>
      <el-table-column label="价格(元)" prop="price" width="150px"></el-table-column>
      <el-table-column label="操作" fixed="right" width="250px">
        <template #default="{ row }">
          <el-button type="success" size="small" icon="Top"></el-button>
          <el-button type="primary" size="small" icon="Edit"></el-button>
          <el-button type="info" size="small" icon="InfoFilled"></el-button>
          <el-button type="danger" size="small" icon="Delete"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      v-model:current-page="pageNo"
      v-model:page-size="pageSize"
      :page-sizes="[3, 5, 7, 10]"
      :background="true"
      layout="prev,pager,next,jumper,->, sizes, total"
      :total="total"
      @current-change="getHasSku"
      @size-change="handler"
    />
  </el-card>
</template>

<script setup lang="ts">
  import { ref, onMounted } from 'vue'
  // 引入请求
  import { reqSkuList } from '@/api/product/sku'
  import type { SkuData, SkuResponseData } from '@/api/product/sku/type'
  import { ElMessage } from 'element-plus'

  // 分页器当前页码
  const pageNo = ref<number>(1)
  // 分页器每页条数
  const pageSize = ref<number>(5)
  // 分页器总条数
  const total = ref<number>(0)
  //
  const skuArr = ref<SkuData[]>([])

  //
  const getHasSku = async (pager = 1) => {
    pageNo.value = pager
    const result: SkuResponseData = await reqSkuList(pageNo.value, pageSize.value)
    console.log(result)
    if (result.code === 200) {
      skuArr.value = result.data.records
      total.value = result.data.total
      ElMessage.success(result.message)
    } else {
      ElMessage.error(result.message)
    }
  }

  // 每页条数变化时的回调
  const handler = () => {
    getHasSku()
  }

  // 组件挂载完毕
  onMounted(() => {
    getHasSku()
  })
</script>

<style scoped></style>
