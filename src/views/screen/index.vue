<template>
  <div class="container-box">
    <div class="screen" ref="screen">
      <!-- 数据大屏顶部 -->
      <div class="top">
        <Top></Top>
      </div>
      <!-- 数据大屏底部 -->
      <div class="bottom">
        <div class="left">
          <Tourist class="tourist"> </Tourist>
          <Sex class="sex"></Sex>
          <Age class="age"></Age>
        </div>
        <div class="center">
          <Map class="map"></Map>
          <Line class="line"></Line>
        </div>
        <div class="right"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted, onUnmounted } from 'vue'
  import Top from './components/Top/index.vue'
  // 引入左侧的三个子组件
  import Tourist from './components/tourist/index.vue'
  import Sex from './components/sex/index.vue'
  import Age from './components/age/index.vue'
  import Map from './components/map/index.vue'
  import Line from './components/line/index.vue'

  const screen = ref<HTMLElement | null>(null)

  // 定义大屏缩放比例
  const getScale = (w = 1920, h = 1080) => {
    const ww = window.innerWidth / w
    const wh = window.innerHeight / h
    return Math.min(ww, wh)
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
    background: linear-gradient(135deg, #2c4975 0%, #264179 50%, #1c4d81 100%);
    color: #fff;
    .screen {
      width: 1920px;
      height: 1080px;
      display: flex;
      flex-direction: column;
      transform-origin: left top;
      position: fixed;
      left: 50%;
      top: 50%;
      transform: translate(50%, 50%);
      .top {
        width: 100%;
        height: 80px;
      }
      .bottom {
        display: flex;
        height: 1040px;
        .left {
          flex: 1;
          display: flex;
          flex-direction: column;
          color: #fff;
          font-size: 20px;
          .tourist {
            margin: 20px 5px;
            height: 100px;
            flex: 1.5;
          }
          .sex {
            flex: 1;
          }
          .age {
            flex: 1;
          }
        }
        .center {
          flex: 2;
          display: flex;
          flex-direction: column;
          align-items: center;
          .map {
            flex: 3;
          }
          .line {
            flex: 1;
          }
        }
        .right {
          flex: 1;
        }
      }
    }
  }
</style>
