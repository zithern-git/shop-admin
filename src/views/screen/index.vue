<template>
  <div class="container-box">
    <div class="screen" ref="screen">
      <div class="top">
        <Top></Top>
      </div>
      <div class="bottom">
        <div class="left">left</div>
        <div class="center">center</div>
        <div class="right">right</div>
      </div>
    </div>
  </div>
</template>

<script setup lang='ts'>
import {ref, onMounted} from 'vue'
import Top from './components/Top/index.vue'
const screen = ref<HTMLElement | null>(null)

// 定义大屏缩放比例
const getScale = (w = 1920, h = 1080) => {
  const ww = window.innerWidth / w;
  const wh = window.innerHeight/ h;
  return Math.min(ww, wh);
}

onMounted(() => {
  if (screen.value) {
    screen.value.style.transform = `scale(${getScale()}) translate(-50%, -50%) `
  }
})

// 监听视口变化
window.onresize = () => {
  if (screen.value) {
    screen.value.style.transform = `scale(${getScale()}) translate(-50%, -50%) `
  }
}
</script>

<style scoped lang="scss">
.container-box {
  width: 100vw;
  height: 100vh;
  background: linear-gradient(135deg, #0a1628 0%, #1a2a4a 50%, #0d1b2a 100%);
  color: #fff;
  .screen {
    width: 1920px;
    height: 1080px;
    display: flex;
    align-items: center;
    flex-direction: column;
    transform-origin: left top;
    position: fixed;
    left: 50%;
    top: 50%;
    transform: translate(50%, 50%);
    background-color: #b3f253;
    .top {
        width: 100%;
        height: 80px;
        // background-color: antiquewhite;
      }
  }
}
</style>
