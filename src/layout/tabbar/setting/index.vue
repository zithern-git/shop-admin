<template>
  <el-button size="small" icon="Refresh" circle style="border: 1px solid #d5d3d3;" @click="updateRefresh"/>
  <el-button size="small" icon="FullScreen" circle style="border: 1px solid #d5d3d3;" @click="fullScreen"/>
  <el-button size="small" icon="Setting" circle style="border: 1px solid #d5d3d3;"/>
  <img
    :src="userStore.avatar"
    style="width: 24px; height: 24px; border-radius: 12px; margin: 0 10px"
  />
  <el-dropdown>
    <span class="el-dropdown-link">
      {{userStore.username}}
      <el-icon class="el-icon--right">
        <arrow-down />
      </el-icon>
    </span>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item @click="logout">退出登录</el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script setup lang="ts">
// 获取骨架的小仓库
import useLayoutSettingStore from '@/store/modules/setting'
// 获取用户相关的小仓库
import useUserStore from '@/store/modules/user'
import { useRouter, useRoute } from 'vue-router'

const userStore = useUserStore()
// 获取路由器对象
const $router = useRouter()
// 获取路由对象
const $route:any = useRoute()

const layoutSettingStore = useLayoutSettingStore()
// 刷新按钮点击回调
const updateRefresh = () => {
  layoutSettingStore.refresh = !layoutSettingStore.refresh
}

// 全屏按钮点击回调
const fullScreen = () => {
  // DOM对象的一个属性：可以用来判断当前是不是全屏模式[全屏：有全屏元素 → 返回该 DOM 元素；没有全屏 → 返回 null]
  const full = document.fullscreenElement
  // 切换为全屏模式
  if(!full) {
    // 文档根节点的requestFullscreen()方法，让整个网页进入「全屏模式」
    document.documentElement.requestFullscreen()
  } else {
    // 退出全屏模式
    document.exitFullscreen()
  }
}

// 退出登录点击回调
const logout = () => {
  // 第一件事情，需要向服务器发请求[退出登录接口]******
  // 第二件事情，仓库当中关于用户的数据清空[token|username|avatar]
  userStore.userLogout();
  // 第三件事情，跳转到登录页面
  $router.push({path: '/login', query: {redirect: $route.path}})
}

defineOptions({
    name: 'Setting'
  })
</script>

<style scoped>
</style>
