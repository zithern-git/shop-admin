<template>
  <el-card>
    <el-table border style="margin-bottom: 10px">
      <el-table-column label="序号" type="index" align="center" width="80px"></el-table-column>
      <el-table-column label="名称" show-overflow-tooltip width="150px"></el-table-column>
      <el-table-column label="描述" show-overflow-tooltip width="150px"></el-table-column>
      <el-table-column label="默认图片" width="150px"></el-table-column>
      <el-table-column label="重量(g)" width="150px"></el-table-column>
      <el-table-column label="价格(元)" width="150px"></el-table-column>
      <el-table-column label="操作" fixed="right" width="250px"></el-table-column>
    </el-table>
    <el-pagination
      v-model:current-page="pageNo"
      v-model:page-size="pageSize"
      :page-sizes="[1, 3, 5, 7]"
      :background="true"
      layout="prev,pager,next,jumper,->, sizes, total"
      :total="total"
    />
  </el-card>
</template>

<script setup lang="ts">
  import { ref } from 'vue'

  // 分页器当前页码
  const pageNo = ref<number>(1)
  // 分页器每页条数
  const pageSize = ref<number>(3)
  // 分页器总条数
  const total = ref<number>(10)
</script>

<style scoped></style>
