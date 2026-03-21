<template>
  <div class="layout_container">
    <!-- 左侧菜单 -->
    <div class="layout_slider">
      <Logo />
      <el-scrollbar class="scrollbar">
        <!-- 菜单组件 -->
        <el-menu
          active-text-color="#ffd04b"
          background-color="rgb(150, 194, 227)"
          class="el-menu-vertical-demo"
          default-active="1"
          text-color="#fff"
          @open="handleOpen"
          @close="handleClose"
        >
          <el-menu-item index="1">
            <el-icon><HomeFilled /></el-icon>
            <span>首页</span>
          </el-menu-item>
          <el-menu-item index="2">
            <el-icon><DataBoard /></el-icon>
            <span>数据大屏</span>
          </el-menu-item>
          <el-sub-menu index="3">
            <template #title>
              <el-icon><Lock /></el-icon>
              <span>权限管理</span>
            </template>
            <el-menu-item index="1-1">用户管理</el-menu-item>
            <el-menu-item index="1-2">角色管理</el-menu-item>
            <el-menu-item index="1-3">菜单管理</el-menu-item>
          </el-sub-menu>
          <el-sub-menu index="4">
            <template #title>
              <el-icon><User /></el-icon>
              <span>系统管理</span>
            </template>
            <el-menu-item-group title="Group One">
              <el-menu-item index="1-1">item one</el-menu-item>
              <el-menu-item index="1-2">item two</el-menu-item>
            </el-menu-item-group>
            <el-menu-item-group title="Group Two">
              <el-menu-item index="1-3">item three</el-menu-item>
            </el-menu-item-group>
            <el-sub-menu index="1-4">
              <template #title>item four</template>
              <el-menu-item index="1-4-1">item one</el-menu-item>
            </el-sub-menu>
          </el-sub-menu>
        </el-menu>
      </el-scrollbar>
    </div>
    <!-- 顶部导航 -->
    <div class="layout_tabbar">tabbar</div>
    <!-- 内容展示区域 -->
    <div class="layout_main">main</div>
  </div>
</template>

<script setup lang="ts">
import Logo from './logo/index.vue'

import { HomeFilled, DataBoard, Lock, User } from '@element-plus/icons-vue'

const handleOpen = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}
const handleClose = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}
</script>

<style scoped lang="scss">
.layout_container {
  width: 100%;
  height: 100vh;
  .layout_slider {
    width: $base-menu-width;
    height: 100%;
    background-color: $base-menu-background;
  }
  .layout_tabbar {
    position: fixed;
    width: calc(100% - #{$base-menu-width});
    height: $base-tabbar-height;
    top: 0;
    left: $base-menu-width;
    background-color: #444440;
  }
  .layout_main {
    position: absolute;
    width: calc(100% - #{$base-menu-width});
    height: calc(100vh - #{$base-tabbar-height});
    // height: 1000px;
    top: $base-tabbar-height;
    left: $base-menu-width;
    padding: 20px;
    background-color: #fff;
    overflow: auto;
  }
}

.scrollbar {
  height: calc(100% - #{$base-menu-logo-height});
}
</style>
