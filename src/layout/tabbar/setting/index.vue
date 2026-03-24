<template>
  <el-button size="small" icon="Refresh" circle style="border: 1px solid #d5d3d3;" @click="updateRefresh"/>
  <el-button size="small" icon="FullScreen" circle style="border: 1px solid #d5d3d3;" @click="fullScreen"/>
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
// 获取骨架的小仓库
import useLayoutSettingStore from '@/store/modules/setting'

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

 defineOptions({
    name: 'Setting'
  })
</script>

<style scoped>
</style>
