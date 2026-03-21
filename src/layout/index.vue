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
  .layout_slider {
    width: $base-menu-width;
    height: 100%;
    background-color: #adc1e4;
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
    // height: calc(100vh - #{$base-tabbar-height});
    height: 1000px;
    top: $base-tabbar-height;
    left: $base-menu-width;
    padding: 20px;
    background-color: #fff;
    overflow: auto;
  }
}
</style>
