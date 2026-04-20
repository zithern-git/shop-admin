<template>
  <div class="rank-container">
    <div class="title">
      <p>热门景区排行</p>
    </div>
    <!-- 图形图标的容器 -->
    <div class="chart" ref="chartRef"></div>
  </div>
</template>
<script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import * as echarts from 'echarts'

  const chartRef = ref<HTMLElement | null>(null)

  onMounted(() => {
    const myChart = echarts.init(chartRef.value!)
    myChart.setOption({
      // 主标题
      title: {
        text: '景区排行',
        link: 'http://www.baidu.com',
        top: '2%',
        left: '50%',
        textStyle: {
          color: '#fff',
        },
        // 子标题
        subtext: '数据来源：旅游统计',
        subtextStyle: {
          color: '#fff',
        },
      },
      // x|y轴组件
      xAxis: {
        type: 'category',
        data: [
          '景区1',
          '景区2',
          '景区3',
          '景区4',
          '景区5',
          '景区6',
          '景区7',
          '景区8',
          '景区9',
          '景区10',
        ],
      },
      yAxis: {},
      // 布局组件
      grid: {
        top: '10%',
        bottom: '10%',
        left: '10%',
        right: '10%',
      },
      // 系列
      series: [
        {
          type: 'bar',
          data: [10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
          label: {
            show: true,
            // 文字的位置
            position: 'top',
            // 文字颜色
            color: 'yellow',
          },
          // 是否显示背景颜色
          showBackground: true,
          backgroundStyle: {
            // 底部背景颜色
            color: 'rgba(255, 255, 255, 0.1)',
          },
          // 柱条的样式
          itemStyle: {
            // 圆角边框
            borderRadius: 10,
            // 柱条颜色
            color: 'rgba(200, 160, 200, 0.8)',
          },
        },
        {
          type: 'line',
          data: [10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
          label: {
            show: true,
          },
          smooth: true,
        },
      ],
    })
  })
</script>
<style scoped lang="scss">
  .rank-container {
    width: 100%;
    height: 100%;
    .title {
      font-size: 20px;
    }
    .chart {
      width: 100%;
      height: calc(100% - 20px);
    }
  }
</style>
