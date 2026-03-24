<template>
  <el-button size="small" icon="Refresh" circle style="border: 1px solid #d5d3d3;"/>
  <el-button size="small" icon="FullScreen" circle style="border: 1px solid #d5d3d3;"/>
  <el-button size="small" icon="Setting" circle style="border: 1px solid #d5d3d3;"/>
  <img
    src="../../../../public/logo.png"
    style="width: 24px; height: 24px; border-radius: 12px; margin: 0 10px"
  />
  <el-dropdown>
    <span class="el-dropdown-link">
      admin
      <el-icon class="el-icon--right">
        <arrow-down />
      </el-icon>
    </span>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item>退出登录</el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script setup lang="ts">
 defineOptions({
    name: 'Setting'
  })
</script>

<style scoped>
</style>
