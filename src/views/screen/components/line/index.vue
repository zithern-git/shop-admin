<template>
  <div class="line-chart">
    <div class="chart" ref="chartRef"></div>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import * as echarts from 'echarts'

  const chartRef = ref<HTMLElement | null>(null)

  const option = {
    color: ['#80FFA5'],
    title: {
      text: '未来30天游客量趋势图',
      textStyle: {
        color: '#fff',
      },
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        label: {
          backgroundColor: '#6a7985',
        },
      },
    },
    toolbox: {
      feature: {
        saveAsImage: {},
      },
    },
    xAxis: [
      {
        type: 'category',
        boundaryGap: false, // x轴两侧不留白
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      },
    ],
    yAxis: [
      {
        type: 'value',
        // 去除分割线
        splitLine: {
          show: false,
        },
        // 轴线的设置
        axisLine: {
          show: true,
        },
        // 轴线刻度
        axisTick: {
          show: true,
        },
      },
    ],
    series: [
      {
        name: 'Line 1',
        type: 'line',
        stack: 'Total',
        smooth: true, //平滑曲线的设置
        lineStyle: {
          width: 0,
        },
        showSymbol: false,
        // 区域填充样式
        areaStyle: {
          opacity: 0.8,
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: 'rgb(128, 255, 165)',
            },
            {
              offset: 1,
              color: 'rgb(1, 191, 236)',
            },
          ]),
        },
        emphasis: {
          focus: 'series',
        },
        data: [140, 232, 101, 264, 90, 340, 250],
      },
    ],
    grid: {
      left: 40,
      right: 20,
      top: 10,
      bottopm: 20,
    },
  }

  onMounted(() => {
    const myChart = echarts.init(chartRef.value)
    myChart.setOption(option)
  })
</script>

<style scoped lang="scss">
  .line-chart {
    width: 100%;
    height: 100%;
    margin: 0 20px;
    .chart {
      width: 100%;
      height: 100%;
    }
  }
</style>
