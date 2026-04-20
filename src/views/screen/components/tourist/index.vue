<template>
  <div>游客</div>
  <div ref="chartRef" class="chart-container"></div>
</template>

<script setup lang="ts">
  import { ref, onMounted, onUnmounted } from 'vue'
  import * as echarts from 'echarts'
  import 'echarts-liquidfill'

  // 定义 DOM 引用
  const chartRef = ref<HTMLElement | null>(null)
  let myChart: echarts.ECharts | null = null

  // 正确时机：DOM 渲染完成后
  onMounted(() => {
    // 必须加判断！
    if (!chartRef.value) return

    // 初始化图表
    myChart = echarts.init(chartRef.value)

    const option = {
      series: [
        {
          type: 'liquidFill',
          radius: '70%',
          data: [0.65, 0.4],
          color: ['#1890ff'],
          backgroundStyle: {
            color: 'rgba(240,247,255,0.6)',
          },
          label: {
            fontSize: 30,
            color: '#1890ff',
            formatter: '65%',
          },
        },
      ],
    }

    myChart.setOption(option)
  })

  // 销毁时清理
  onUnmounted(() => {
    myChart?.dispose()
  })
</script>

<style scoped>
  .chart-container {
    width: 300px;
    height: 300px;
    margin: 0 auto;
  }
</style>
