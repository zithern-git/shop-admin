<template>
  <div class="sex-container">
    <div class="title">性别比例</div>
    <div class="sex">
      <div class="male">
        <img src="../../images/male.png" />
      </div>
      <div class="female">
        <img src="../../images/female.png" />
      </div>
    </div>
    <div class="rate">
      <div class="genderRate">
        <p>男士 60%</p>
        <p>女士 40%</p>
      </div>
    </div>
    <div ref="genderChart" class="genderChart"></div>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import * as echarts from 'echarts'

  const genderChart = ref<HTMLElement>()

  onMounted(() => {
    // 初始化echarts实例
    const myChart = echarts.init(genderChart.value)
    // 设置配置项
    myChart.setOption({
      xAxis: {
        show: false,
        min: 0,
        max: 100,
      },
      yAxis: {
        show: false,
        type: 'category',
      },
      series: [
        {
          type: 'bar',
          data: [60],
          barWidth: 20,
          z: 10,
          itemStyle: {
            color: 'blue',
            borderRadius: 10,
          },
        },
        {
          type: 'bar',
          data: [100],
          barWidth: 20,
          barGap: '-100%',
          itemStyle: {
            color: 'red',
            borderRadius: 10,
          },
        },
      ],
    })
  })
</script>

<style scoped lang="scss">
  .sex-container {
    width: 100%;
    height: 100%;
    .sex {
      display: flex;
      align-items: center;
      justify-content: center;
      .male {
        width: 200px;
        height: 200px;
        background: url('../../images/male.png') no-repeat;
      }
      .female {
        width: 200px;
        height: 200px;
        background: url('../../images/female.png') no-repeat;
      }
    }
    .rate {
      width: 100%;
      height: 60px;
      display: flex;
      flex-direction: column;
      align-items: center;
      .genderRate {
        display: flex;
        justify-content: space-between;
        align-items: center;
        p {
          margin: 20px;
        }
      }
    }
    .genderChart {
      width: 100%;
      height: 80px;
    }
  }
</style>
