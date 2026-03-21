<template>
  <div class="layout_container">
    <!-- 左侧菜单 -->
    <div class="layout_slider">slider</div>
    <!-- 顶部导航 -->
    <div class="layout_tabbar">tabbar</div>
    <!-- 内容展示区域 -->
    <div class="layout_main">main</div>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped lang="scss">
.layout_container {
  width: 100%;
  height: 100vh;
  background-color: #b0df98;
  .layout_slider {
    // width: $base-menu-width;
    width: 260px;
  }
}
</style>
