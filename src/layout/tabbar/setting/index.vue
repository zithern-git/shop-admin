<template>
  <el-button
    size="small"
    icon="Refresh"
    circle
    style="border: 1px solid #d5d3d3"
    @click="updateRefresh"
  />
  <el-button
    size="small"
    icon="FullScreen"
    circle
    style="border: 1px solid #d5d3d3"
    @click="fullScreen"
  />
  <el-popover title="主题设置">
    <!-- 表单元素 -->
    <el-form>
      <el-form-item label="主题颜色">
        <!-- 颜色选择器 -->
        <el-color-picker v-model="color" show-alpha color-format="hex" @change="changeColor" :hide-after="2000"/>
      </el-form-item>
      <el-form-item label="暗黑模式">
        <!-- 开关 -->
        <el-switch
          v-model="isDark"
          inline-prompt
          :active-icon="Moon"
          :inactive-icon="Sunny"
          @change="changeDark"
        />
      </el-form-item>
    </el-form>
    <template #reference>
      <el-button size="small" icon="Setting" circle style="border: 1px solid #d5d3d3" />
    </template>
  </el-popover>
  <img
    :src="userStore.avatar"
    style="width: 24px; height: 24px; border-radius: 12px; margin: 0 10px"
  />
  <el-dropdown>
    <span class="el-dropdown-link">
      {{ userStore.username }}
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
  import { ref } from 'vue'
  // 👇 必须先导入这两个图标
  import { Sunny, Moon } from '@element-plus/icons-vue'
  // 获取骨架的小仓库
  import useLayoutSettingStore from '@/store/modules/setting'
  // 获取用户相关的小仓库
  import useUserStore from '@/store/modules/user'
  import { useRouter, useRoute } from 'vue-router'

  const userStore = useUserStore()
  // 获取路由器对象
  const $router = useRouter()
  // 获取路由对象
  const $route: any = useRoute()

  const layoutSettingStore = useLayoutSettingStore()

  const color = ref<string>('red')
  const isDark = ref<boolean>(false)
  // switch开关的change事件进行暗黑模式切换
  const changeDark = () => {
    const html = document.documentElement
    // 判断html标签标签是否有类名dark
    isDark.value ? (html.className = 'dark') : (html.className = '')
  }

  const changeColor = () => {
    // document.documentElement 是全局变量时
    const el = document.documentElement
    console.log('el', el.style)
    // 获取 css 变量
    // getComputedStyle(el).getPropertyValue(`--el-color-primary`)
    // 设置 css 变量
    el.style.setProperty('--el-color-primary', color.value)
  }

  // 刷新按钮点击回调
  const updateRefresh = () => {
    layoutSettingStore.refresh = !layoutSettingStore.refresh
  }

  // 全屏按钮点击回调
  const fullScreen = () => {
    // DOM对象的一个属性：可以用来判断当前是不是全屏模式[全屏：有全屏元素 → 返回该 DOM 元素；没有全屏 → 返回 null]
    const full = document.fullscreenElement
    // 切换为全屏模式
    if (!full) {
      // 文档根节点的requestFullscreen()方法，让整个网页进入「全屏模式」
      document.documentElement.requestFullscreen()
    } else {
      // 退出全屏模式
      document.exitFullscreen()
    }
  }

  // 退出登录点击回调
  const logout = async () => {
    // 第一件事情，需要向服务器发请求[退出登录接口]******
    // 第二件事情，仓库当中关于用户的数据清空[token|username|avatar]
    await userStore.userLogout()
    // 第三件事情，跳转到登录页面
    $router.push({ path: '/login', query: { redirect: $route.path } })
  }

  defineOptions({
    name: 'Setting',
  })
</script>

<style scoped></style>
