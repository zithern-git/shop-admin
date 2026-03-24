<template>
  <!-- 顶部左侧静态 -->
  <el-icon style="margin-right: 10px" @click="changeIcon">
    <Expand v-if="!useLayoutSetting.fold"/>
    <Fold v-if="useLayoutSetting.fold"/>
  </el-icon>
  <!-- 左侧面包屑 -->
  <el-breadcrumb separator-icon="ArrowRight">
    <el-breadcrumb-item :to="{ path: '/' }">homepage</el-breadcrumb-item>
    <el-breadcrumb-item>promotion</el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script setup lang="ts">
import useLayoutSettingStore from '@/store/modules/setting'
// 获取layout配置相关的仓库
const useLayoutSetting = useLayoutSettingStore();
// 点击图标的方法
const changeIcon = () => {
  // 图标进行切换
  useLayoutSetting.fold = !useLayoutSetting.fold
}

 defineOptions({
    name: 'Breadcrumb'
  })
</script>

<style scoped></style>
