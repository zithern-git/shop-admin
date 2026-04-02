<template>
  <div class="flex flex-wrap gap-2">
    <Category />
    <el-card style="width: 100%" shadow="always">
      <el-button
        type="primary"
        size="default"
        icon="Plus"
        :disabled="!categoryStore.c3Id">添加属性</el-button>
      <el-table border style="margin: 10px 0">
        <el-table-column label="序号" type="index" align="center" width="80px"></el-table-column>
        <el-table-column label="属性名称" width="120px"></el-table-column>
        <el-table-column label="属性值名称"></el-table-column>
        <el-table-column label="操作" width="120px"></el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
// 获取分类的仓库
import useCategoryStore from '@/store/modules/category';

const categoryStore = useCategoryStore();
</script>

<style scoped></style>
