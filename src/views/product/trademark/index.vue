<template>
  <!-- 卡片顶部添加品牌按钮 -->
  <el-card>
    <el-button type="primary" size="default" class="add"><el-icon><Plus /></el-icon> 添加品牌</el-button>
    <!-- 表格组件：用于展示已有品牌的数据 -->
     <!--
      table
      ---border：可以设置表格纵向是否有边框
      table-column
      ---width:对应列的宽度
      ---align:对齐方式
     -->
    <el-table :data="trademarkArr" border style="width: 100%; margin: 10px 0">
      <el-table-column type="index" label="序号" width="80px" align="center"/>
      <el-table-column prop="tmName" label="品牌名称"/>
      <!-- el-table-column 默认展示数据用div -->
      <el-table-column label="品牌Logo">
        <template #default='{row}'>
          <img
            :src="row.logoUrl"
            alt="未有图片"
            style="width: 50px; height: 50px; object-fit: cover"
          />
        </template>
      </el-table-column>
      <el-table-column prop="option" label="品牌操作">
        <template #default="{row, $index}">
          <el-button type="primary" icon="Edit" circle />
          <el-button type="danger" icon="Delete" circle />
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页器组件
      pagination
        v-model:current-page：设置当前页数
        v-model:page-size: 每页显示条目个数
        page-sizes：每页显示个数选择器的选项设置
        background:是否为分页按钮添加背景色
        layout:可以设置分页器6个子组件布局调整，子组件名用逗号分隔
    -->
    <el-pagination
      v-model:current-page="pageNo"
      v-model:page-size="limit"
      :page-sizes="[3, 5, 7, 9]"
      :size="size"
      :disabled="disabled"
      :background="background"
      layout=" prev, pager, next, jumper, ->, sizes, total "
      :total="total"
    />
  </el-card>
</template>

<script setup lang='ts'>
// 引入组合式API函数ref
import { ref, onMounted, watch } from 'vue'
import type { ComponentSize } from 'element-plus'
import { reqHasTrademark } from '@/api/product/trademark'
import type {Records, TrademarkResponseData} from '@/api/product/trademark/type'
// 当前页码
const pageNo = ref<number>(1)
// 每一页展示多少条数据
const limit = ref<number>(3)
const size = ref<ComponentSize>('default')
const background = ref(true)
const disabled = ref(false)
// 存储已有品牌数据总数
const total = ref<number>(0)
const trademarkArr = ref<Records>([])
// 获取已有品牌的接口封装为一个函数：在任何情况下获取数据，调用函数即可
const getHasTrademark = async () => {
  // pageNo.value = pager;
  const result: TrademarkResponseData = await reqHasTrademark(pageNo.value, limit.value);
  if (result.code === 200) {
    // 存储已有品牌的总数
    total.value = result.data.total;
    trademarkArr.value = result.data.records
  }
}
// 组件挂载完毕钩子————发一次请求，获取第一页，一页三个已有品牌数据
onMounted(() => {
  getHasTrademark();
})

// 监听 limit 变化 → 切回第1页
watch(limit, () => {
  pageNo.value = 1 // ✅ 切换每页条数时，强制回到第1页
})

watch(
  [pageNo, limit], // 监听两个变量
  () => {
    getHasTrademark() // 只要变了，就重新请求数据
  },
  { immediate: false }
)
</script>

<style scoped>
.add {
  color: #fff;
  background-color: #76bbf0;
  padding: 3px;
}

</style>
