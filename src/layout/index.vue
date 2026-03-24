<template>
  <div class="layout_container">
    <!-- 左侧菜单 -->
    <div class="layout_slider" :class="{fold: LayoutSettingStore.fold}">
      <Logo />
      <el-scrollbar class="scrollbar">
        <!-- 菜单组件 -->
        <el-menu
          background-color="#96c2e3"
          active-text-color="#ffd04b"
          text-color="#fff"
          :collapse="LayoutSettingStore.fold"
          :default-active="$route.path"
        >
          <Menu :menuList="userStore.menuRoutes"></Menu>
        </el-menu>
      </el-scrollbar>
    </div>
    <!-- 顶部导航 -->
    <div class="layout_tabbar" :class="{fold: LayoutSettingStore.fold}">
      <Tabbar></Tabbar>
    </div>
    <!-- 内容展示区域 -->
    <div class="layout_main" :class="{fold: LayoutSettingStore.fold}">
      <Main></Main>
    </div>
  </div>
</template>

<script setup lang="ts">
  // 获取路由对象
  import { useRoute } from 'vue-router'
  // 引入左侧菜单Logo子组件
  import Logo from './logo/index.vue'
  // 引入菜单组件
  import Menu from './menu/index.vue'
  // 引入顶部tabbar组件
  import Tabbar from './tabbar/index.vue'
  // 右侧内容展示区域
  import Main from './main/index.vue'
  import useLayoutSettingStore from '@/store/modules/setting'

  // 获取用户相关的小仓库
  import useUserStore from '@/store/modules/user'
  const userStore = useUserStore()

  const LayoutSettingStore = useLayoutSettingStore()
  // 获取路由对象
  const $route = useRoute()

  defineOptions({
    name: 'Layout'
  })
</script>

<style scoped lang="scss">
  .layout_container {
    width: 100%;
    height: 100vh;
    color: #fff;
    .layout_slider {
      width: $base-menu-width;
      height: 100%;
      background-color: $base-menu-background;
      transition: all 0.4s ease;
      .scrollbar {
        height: calc(100% - #{$base-menu-logo-height});

        .el-menu {
          border-right: none;
        }
      }
      &.fold {
        width: $base-menu-min-width;
      }
    }

    .layout_tabbar {
      position: fixed;
      width: calc(100% - #{$base-menu-width});
      height: $base-tabbar-height;
      top: 0;
      left: $base-menu-width;
      color: #000;
      transition: all 0.4s ease;
      &.fold {
        width: calc(100% - #{$base-menu-min-width});
      left: $base-menu-min-width;

      }
    }

    .layout_main {
      color: #000;
      position: absolute;
      width: calc(100% - #{$base-menu-width});
      height: calc(100vh - #{$base-tabbar-height});
      top: $base-tabbar-height;
      left: $base-menu-width;
      padding: 20px;
      background-color: #fff;
      overflow: auto;
      transition: all 0.4s ease;
      &.fold {
        width: calc(100% - #{$base-menu-min-width});
      left: $base-menu-min-width;
      }
    }
  }
</style>
