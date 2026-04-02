<template>
  <el-card style="width: 100%" shadow="always">
    <el-form :inline="true">
      <el-form-item label="一级分类">
        <el-select v-model="categoryStore.c1Id" placeholder="请选择" style="width: 200px">
          <!-- option:label即为展示数据，value即为select下拉菜单收集的数据 -->
          <el-option v-for="c1 in categoryStore.c1Arr" :key="c1.id" :label="c1.name" :value="c1.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="二级分类">
        <el-select v-model="categoryStore.c2Id" placeholder="请选择" style="width: 200px">
          <el-option v-for="c2 in categoryStore.c2Arr" :key="c2.id" :label="c2.name" :value="c2.id" :disabled="!c1Id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="三级分类">
        <el-select placeholder="请选择" style="width: 200px">
        </el-select>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script setup lang="ts">
// 引入组件挂载完毕方法
import { onMounted, ref } from 'vue'
// 引入分类相关的仓库
import useCategoryStore from '@/store/modules/category'

const categoryStore  = useCategoryStore()
// 分类全局组件挂载完毕，通知仓库发请求获取一级分类的数据
onMounted(() => {
  getC1()
})

// 通知仓库获取一级分类的数据
const getC1 = () => {
  // 通知分类仓库发请求获取一级分类的数据
  categoryStore.getC1()
}

const getC2 = () => {
  // 通知分类仓库发请求获取二级分类的数据
  categoryStore.getC2()
}
</script>

<style scoped></style>
