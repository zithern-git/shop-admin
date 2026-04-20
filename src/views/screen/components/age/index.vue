<template>
  <div class="age-container">
    <div class="title">
      <p>年龄比例</p>
    </div>
    <!-- 图表容器 -->
    <div class="charts" ref="ageChart"></div>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import * as echarts from 'echarts'

  const ageChart = ref<HTMLElement>()

  onMounted(() => {
    const myChart = echarts.init(ageChart.value)
    myChart.setOption({
      tooltip: {
        trigger: 'item',
      },
      legend: {
        orient: 'vertical', // 纵向排列
        right: '5%', // 距离右侧 5%
        top: 'center',
        textStyle: {
          color: '#fff', // 字体颜色
        },
      },
      series: [
        {
          name: 'Access From',
          type: 'pie',
          radius: ['40%', '70%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10,
            borderColor: '#fff',
            borderWidth: 1,
          },
          label: {
            show: true,
            position: 'inner',
            color: '#fff',
          },
          // 放大效果
          // emphasis: {
          //   label: {
          //     show: true,
          //     fontSize: 40,
          //     fontWeight: 'bold',
          //   },
          // },
          labelLine: {
            show: false,
          },
          data: [
            { value: 1048, name: '军事' },
            { value: 735, name: '新闻' },
            { value: 580, name: '娱乐' },
            { value: 484, name: '直播' },
            { value: 300, name: '财经' },
          ],
        },
      ],
      // 调整图形图标的位置
      grid: {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
      },
    })
  })
</script>

<style scoped>
  .age-container {
    width: 100%;
    height: 100%;
    .charts {
      height: 300px;
      color: #fff;
    }
  }
</style>
