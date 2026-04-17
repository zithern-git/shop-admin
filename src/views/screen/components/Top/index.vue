<template>
  <div class="container-top">
    <div class="left">
      <button class="lbtn">首页</button>
    </div>
    <div class="center">智慧旅游可视化数据大平台</div>
    <div class="right">
      <button class="rbtn">统计报告</button>
      <span>当前时间：{{ currentTime }}</span>
    </div>
  </div>
</template>

<script setup lang='ts'>
import { ref, onMounted, onUnmounted } from 'vue'
import dayjs from 'dayjs'

const currentTime = ref('')
// 更新时间
const updateTime = () => {
  currentTime.value = dayjs().format('YYYY年MM月DD日 HH:mm:ss')
}

// 页面挂载后开启定时器
let timer: any = null
onMounted(() => {
  updateTime() // 先立即执行一次
  timer = setInterval(() => {
    updateTime() // 每秒更新
  }, 1000)
})

// 页面卸载时清除定时器
onUnmounted(() => {
  clearInterval(timer)
})
</script>

<style scoped lang="scss">
.container-top {
  width: 100%;
  height: 40px;
  display: flex;
  background: linear-gradient(180deg, rgba(0, 150, 255, 0.1) 0%, transparent 100%);
  border-bottom: 1px solid rgba(0, 212, 255, 0.3);
  .left {
    flex: 1.5;
  }
  .center {
    flex: 2;
  }
  .right {
    flex: 1.5
  }
}
</style>
