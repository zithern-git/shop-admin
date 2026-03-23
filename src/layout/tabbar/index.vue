<template>
  <div class="tabbar">
    <div class="tabbar-left">
      <Breadcrumb></Breadcrumb>
    </div>
    <div class="tabbar-left">
      <Setting></Setting>
    </div>
  </div>
</template>

<script setup lang="ts">
  import Breadcrumb from './breadcrumb/index.vue'
  import Setting from './setting/index.vue'
</script>

<style scoped lang="scss">
  .tabbar {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: space-between;
    background-image: linear-gradient(to right, rgba(236, 236, 148, 0.5), rgba(107, 107, 239, 0.5));
    .tabbar-left {
      display: flex;
      align-items: center;
      margin-left: 20px;
    }

    .tabbar-right {
      display: flex;
      align-items: center;
      // scoped 样式中直接写 el-button 选择器无法穿透到 Element Plus 组件内部。修改样式，使用 :deep() 穿透：
      :deep(.el-button) {
        border: 1px solid #d5d3d3;
      }
    }
  }
</style>
