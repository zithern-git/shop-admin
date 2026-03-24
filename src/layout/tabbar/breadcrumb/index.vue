<template>
  <!-- 顶部左侧静态 -->
  <el-icon style="margin-right: 10px" @click="changeIcon">
    <Expand v-if="!useLayoutSetting.fold"/>
    <Fold v-if="useLayoutSetting.fold"/>
  </el-icon>
  <!-- 左侧面包屑 -->
  <el-breadcrumb separator-icon="ArrowRight">
    <!-- 面包屑动态展示路由名字与标题 -->
    <!-- <el-breadcrumb-item :to="{ path: '/' }">homepage</el-breadcrumb-item> -->
    <el-breadcrumb-item
     v-for="item in $route.matched"
    :key="item.path"
    v-show="item.meta.title"
    :to="{ path: item.path }"
    >
      <!-- v-for与v-if不能同时使用，这里只能使用v-show -->
      <!-- 图标，vertical-align: top; = 元素顶部对齐；专治：图标 / 文字 / 按钮 下沉、对不齐 -->
       <el-icon style="vertical-align: top;">
        <component :is="item.meta.icon"></component>
       </el-icon>
      <!-- 面包屑展示匹配路由的标题 -->
      <span>{{item.meta.title}}</span>
    </el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';
import useLayoutSettingStore from '@/store/modules/setting'
// 获取layout配置相关的仓库
const useLayoutSetting = useLayoutSettingStore();
// 点击图标的方法
const changeIcon = () => {
  // 图标进行切换
  useLayoutSetting.fold = !useLayoutSetting.fold
}

const $route = useRoute();


 defineOptions({
    name: 'Breadcrumb'
  })
</script>

<style scoped>

</style>
