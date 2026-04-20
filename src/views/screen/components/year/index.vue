<template>
  <div class="year-container">
    <div class="title">年份统计</div>
    <div class="chart" ref="chartRef"></div>
  </div>
</template>
<script setup lang="ts">
  import { ref, onMounted, nextTick } from 'vue'
  import * as echarts from 'echarts'

  const chartRef = ref<HTMLElement | null>(null)

  onMounted(async () => {
    await nextTick()
    if (!chartRef.value) return
    const myChart = echarts.init(chartRef.value)
    myChart.setOption({
      title: {
        text: '散点图',
        top: '2%',
        left: '50%',
        textStyle: {
          color: '#fff',
        },
      },
      xAxis: {
        type: 'category',
        // data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        show: false,
      },
      yAxis: {
        show: false,
      },
      series: [
        {
          type: 'scatter',
          data: [
            [10, 10],
            [20, 0],
            [30, 30],
            [40, 5],
            [50, 40],
          ],
          symbol: 'arrow',
          symbolSize: 20, // 点大小
          itemStyle: {
            color: 'yellow', // 点颜色
          },
          label: {
            show: true,
            position: 'top',
            color: '#fff',
          },
        },
      ],
      grid: {
        left: 40,
        right: 20,
        top: 40,
        bottom: 30,
      },
    })
  })
</script>

<style scoped lang="scss">
  .year-container {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    .title {
      font-size: 20px;
      height: 30px;
      line-height: 30px;
      flex-shrink: 0;
    }
    .chart {
      flex: 1;
      width: 100%;
    }
  }
</style>
