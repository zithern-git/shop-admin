<template>
  <h1>{{ menuList }}</h1>
  <!-- <el-menu
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
        </el-menu> -->
  <template v-for="(item, index) in menuList" :key="item.path">
    <el-menu-item v-if="!item.children">
      <template #title> </template>
    </el-menu-item>
  </template>
</template>

<script setup lang="ts">
// 获取父组件传递过来的全部路由数组
defineProps(['menuList'])
</script>

<style scoped></style>
