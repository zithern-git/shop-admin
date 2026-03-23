<template>
  <div class="layout_container">
    <!-- 左侧菜单 -->
    <div class="layout_slider">
      <Logo />
      <el-scrollbar class="scrollbar">
        <!-- 菜单组件 -->
        <el-menu
          background-color="#96c2e3"
          active-text-color="#ffd04b"
          >
          <Menu :menuList="userStore.menuRoutes"></Menu>
        </el-menu>
      </el-scrollbar>
    </div>
    <!-- 顶部导航 -->
    <div class="layout_tabbar">tabbar</div>
    <!-- 内容展示区域 -->
    <div class="layout_main">
      <Main></Main>
    </div>
  </div>
</template>

<script setup lang="ts">
// 引入左侧菜单Logo子组件
import Logo from './logo/index.vue'
// 引入菜单组件
import Menu from './menu/index.vue'
// 右侧内容展示区域
import Main from './main/index.vue'
// 获取用户相关的小仓库
import useUserStore from '@/store/modules/user'
const userStore = useUserStore()

/* const handleOpen = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}
const handleClose = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
} */
</script>

<style scoped lang="scss">
.layout_container {
  width: 100%;
  height: 100vh;

  .layout_slider {
    width: $base-menu-width;
    height: 100%;
    background-color: $base-menu-background;

    .scrollbar {
      height: calc(100% - #{$base-menu-logo-height});

      .el-menu {
        border-right: none;
      }
    }
  }

  .layout_tabbar {
    position: fixed;
    width: calc(100% - #{$base-menu-width});
    height: $base-tabbar-height;
    // height: 50px;
    top: 0;
    left: $base-menu-width;
    background-color: #cd4619;
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

</style>
