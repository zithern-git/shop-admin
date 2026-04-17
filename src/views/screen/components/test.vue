<template>
  <div class="data-screen">
    <!-- 头部 -->
    <header class="header">
      <div class="header-title">
        <span class="title-text">智慧旅游可视化大数据展示平台</span>
      </div>
      <div class="header-time">{{ currentTime }}</div>
    </header>

    <!-- 主体内容 -->
    <main class="main-content">
      <!-- 左侧面板 -->
      <div class="panel left-panel">
        <!-- 实时游客统计 -->
        <div class="card">
          <div class="card-header">
            <span class="card-title">实时游客统计</span>
          </div>
          <div class="card-body">
            <div class="number-display">
              <span v-for="(num, i) in visitorCount" :key="i" class="num-box">{{ num }}</span>
              <span class="unit">人</span>
            </div>
            <div class="gauge-chart">
              <div class="gauge-bg"></div>
              <div class="gauge-fill" :style="{ transform: `rotate(${gaugeAngle}deg)` }"></div>
              <div class="gauge-center">
                <span class="gauge-value">{{ visitorPercent }}%</span>
                <span class="gauge-label">承载量</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 男女比例 -->
        <div class="card">
          <div class="card-header">
            <span class="card-title">男女比例</span>
          </div>
          <div class="card-body gender-stats">
            <div class="gender-item">
              <div class="gender-icon male">
                <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/></svg>
              </div>
              <div class="gender-bar">
                <div class="bar-bg">
                  <div class="bar-fill male" :style="{ width: malePercent + '%' }"></div>
                </div>
                <span class="gender-label">男士 {{ malePercent }}%</span>
              </div>
            </div>
            <div class="gender-item">
              <div class="gender-icon female">
                <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/></svg>
              </div>
              <div class="gender-bar">
                <div class="bar-bg">
                  <div class="bar-fill female" :style="{ width: femalePercent + '%' }"></div>
                </div>
                <span class="gender-label">女士 {{ femalePercent }}%</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 年龄比例 -->
        <div class="card">
          <div class="card-header">
            <span class="card-title">年龄比例</span>
          </div>
          <div class="card-body">
            <div class="pie-chart">
              <div v-for="(item, i) in ageData" :key="i" class="pie-slice" 
                   :style="getPieStyle(i)"></div>
              <div class="pie-center">
                <span class="center-text">本年度</span>
              </div>
            </div>
            <div class="pie-legend">
              <div v-for="(item, i) in ageData" :key="i" class="legend-item">
                <span class="legend-color" :style="{ background: item.color }"></span>
                <span class="legend-text">{{ item.label }} {{ item.value }}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 中间面板 -->
      <div class="panel center-panel">
        <!-- 地图区域 -->
        <div class="map-container">
          <div class="map-bg">
            <svg viewBox="0 0 800 600" class="china-map">
              <!-- 简化版中国地图轮廓 -->
              <path class="map-path" d="M200,150 Q250,120 300,140 T400,130 T500,150 T600,180 T650,250 T620,350 T550,450 T450,480 T350,460 T280,400 T220,300 T180,200 Z" />
              <circle v-for="(city, i) in cities" :key="i" 
                      :cx="city.x" :cy="city.y" r="4" 
                      class="city-point"
                      @mouseover="showCityInfo(city)"
                      @mouseleave="hideCityInfo">
                <animate attributeName="r" values="4;6;4" dur="2s" repeatCount="indefinite" />
              </circle>
            </svg>
          </div>
          <div class="map-info" v-if="selectedCity">
            <div class="info-title">{{ selectedCity.name }}</div>
            <div class="info-data">游客数: {{ selectedCity.visitors }}万</div>
          </div>
        </div>

        <!-- 趋势图 -->
        <div class="card trend-card">
          <div class="card-header">
            <span class="card-title">未来30天游客量趋势图</span>
          </div>
          <div class="card-body">
            <div class="trend-chart">
              <svg viewBox="0 0 600 150" class="trend-svg">
                <defs>
                  <linearGradient id="trendGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" style="stop-color:#00d4ff;stop-opacity:0.6" />
                    <stop offset="100%" style="stop-color:#00d4ff;stop-opacity:0" />
                  </linearGradient>
                </defs>
                <path class="trend-area" :d="trendAreaPath" fill="url(#trendGradient)" />
                <path class="trend-line" :d="trendLinePath" fill="none" stroke="#00d4ff" stroke-width="2" />
                <circle v-for="(point, i) in trendData" :key="i" 
                        :cx="point.x" :cy="point.y" r="3" fill="#00d4ff" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- 右侧面板 -->
      <div class="panel right-panel">
        <!-- 热门景区排行 -->
        <div class="card">
          <div class="card-header">
            <span class="card-title">热门景区排行</span>
          </div>
          <div class="card-body">
            <div class="rank-list">
              <div v-for="(item, i) in rankData" :key="i" class="rank-item">
                <span class="rank-num" :class="{ top: i < 3 }">{{ i + 1 }}</span>
                <span class="rank-name">{{ item.name }}</span>
                <div class="rank-bar">
                  <div class="rank-fill" :style="{ width: item.percent + '%', background: item.color }"></div>
                </div>
                <span class="rank-value">{{ item.value }}w</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 年度游客量对比 -->
        <div class="card">
          <div class="card-header">
            <span class="card-title">年度游客量对比</span>
          </div>
          <div class="card-body">
            <div class="bar-chart">
              <div v-for="(item, i) in yearData" :key="i" class="bar-item">
                <div class="bar-group">
                  <div v-for="(val, j) in item.values" :key="j" 
                       class="bar-segment" 
                       :style="{ height: val + 'px', background: yearColors[j] }"></div>
                </div>
                <span class="bar-label">{{ item.month }}</span>
              </div>
            </div>
            <div class="year-legend">
              <span v-for="(color, i) in yearColors" :key="i" class="year-tag">
                <span class="year-dot" :style="{ background: color }"></span>
                {{ 2021 + i }}年
              </span>
            </div>
          </div>
        </div>

        <!-- 预约渠道数据统计 -->
        <div class="card">
          <div class="card-header">
            <span class="card-title">预约渠道数据统计</span>
          </div>
          <div class="card-body channel-stats">
            <div class="donut-chart">
              <svg viewBox="0 0 120 120" class="donut-svg">
                <circle cx="60" cy="60" r="50" fill="none" stroke="#1e3a5f" stroke-width="12" />
                <circle v-for="(item, i) in channelData" :key="i"
                        cx="60" cy="60" r="50" fill="none"
                        :stroke="item.color" stroke-width="12"
                        :stroke-dasharray="getDonutDash(item)"
                        :stroke-dashoffset="getDonutOffset(i)"
                        transform="rotate(-90 60 60)" />
                <text x="60" y="55" text-anchor="middle" fill="#fff" font-size="14">总预约</text>
                <text x="60" y="75" text-anchor="middle" fill="#00d4ff" font-size="16" font-weight="bold">100%</text>
              </svg>
            </div>
            <div class="channel-legend">
              <div v-for="(item, i) in channelData" :key="i" class="channel-item">
                <span class="channel-dot" :style="{ background: item.color }"></span>
                <span class="channel-name">{{ item.name }}</span>
                <span class="channel-value">{{ item.value }}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'

// 当前时间
const currentTime = ref('')
const updateTime = () => {
  const now = new Date()
  currentTime.value = now.toLocaleString('zh-CN', { 
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit'
  })
}
let timeTimer: number

// 实时游客统计
const visitorCount = ref(['2', '1', '6', '9', '0', '8'])
const visitorPercent = ref(68)
const gaugeAngle = computed(() => (visitorPercent.value / 100) * 180 - 90)

// 男女比例
const malePercent = ref(60)
const femalePercent = computed(() => 100 - malePercent.value)

// 年龄比例
const ageData = [
  { label: '10岁以下', value: 20, color: '#ff6b6b' },
  { label: '10-18岁', value: 15, color: '#4ecdc4' },
  { label: '18-30岁', value: 25, color: '#45b7d1' },
  { label: '30-50岁', value: 24, color: '#f9ca24' },
  { label: '50-60岁', value: 10, color: '#6c5ce7' },
  { label: '60岁以上', value: 6, color: '#a29bfe' }
]

const getPieStyle = (index: number) => {
  let startAngle = 0
  for (let i = 0; i < index; i++) {
    startAngle += ageData[i].value * 3.6
  }
  const endAngle = startAngle + ageData[index].value * 3.6
  return {
    background: `conic-gradient(from 0deg, ${ageData[index].color} ${startAngle}deg, ${ageData[index].color} ${endAngle}deg, transparent ${endAngle}deg)`
  }
}

// 地图城市数据
const cities = [
  { name: '北京', x: 520, y: 220, visitors: 120 },
  { name: '上海', x: 580, y: 320, visitors: 98 },
  { name: '广州', x: 480, y: 420, visitors: 85 },
  { name: '成都', x: 350, y: 320, visitors: 76 },
  { name: '西安', x: 420, y: 280, visitors: 65 }
]
const selectedCity = ref<typeof cities[0] | null>(null)
const showCityInfo = (city: typeof cities[0]) => { selectedCity.value = city }
const hideCityInfo = () => { selectedCity.value = null }

// 趋势图数据
const trendData = ref([
  { x: 0, y: 80 }, { x: 50, y: 60 }, { x: 100, y: 90 },
  { x: 150, y: 50 }, { x: 200, y: 70 }, { x: 250, y: 40 },
  { x: 300, y: 85 }, { x: 350, y: 55 }, { x: 400, y: 75 },
  { x: 450, y: 45 }, { x: 500, y: 95 }, { x: 550, y: 65 }, { x: 600, y: 50 }
])

const trendLinePath = computed(() => {
  return trendData.value.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')
})

const trendAreaPath = computed(() => {
  const points = trendData.value.map(p => `${p.x},${p.y}`).join(' ')
  return `M 0,150 L ${points} L 600,150 Z`
})

// 热门排行
const rankData = [
  { name: '峨眉山', value: 8.00, percent: 90, color: '#ff6b6b' },
  { name: '乐山大佛', value: 6.00, percent: 75, color: '#4ecdc4' },
  { name: '九寨沟', value: 5.00, percent: 65, color: '#45b7d1' },
  { name: '万里长城', value: 4.00, percent: 55, color: '#f9ca24' },
  { name: '北京故宫', value: 3.00, percent: 45, color: '#6c5ce7' }
]

// 年度对比
const yearData = [
  { month: '1', values: [30, 45, 60] },
  { month: '2', values: [40, 55, 70] },
  { month: '3', values: [50, 65, 80] },
  { month: '4', values: [45, 60, 75] },
  { month: '5', values: [60, 75, 90] },
  { month: '6', values: [55, 70, 85] },
  { month: '7', values: [70, 85, 100] },
  { month: '8', values: [65, 80, 95] },
  { month: '9', values: [50, 65, 80] },
  { month: '10', values: [55, 70, 85] },
  { month: '11', values: [40, 55, 70] },
  { month: '12', values: [35, 50, 65] }
]
const yearColors = ['#ff6b6b', '#4ecdc4', '#45b7d1']

// 渠道数据
const channelData = [
  { name: '携程', value: 40, color: '#00d4ff' },
  { name: '美团', value: 10, color: '#ff6b6b' },
  { name: '飞猪', value: 20, color: '#ffd93d' },
  { name: '官网', value: 30, color: '#6bcf7f' }
]

const getDonutDash = (item: typeof channelData[0]) => {
  const circumference = 2 * Math.PI * 50
  const dash = (item.value / 100) * circumference
  return `${dash} ${circumference - dash}`
}

const getDonutOffset = (index: number) => {
  const circumference = 2 * Math.PI * 50
  let offset = 0
  for (let i = 0; i < index; i++) {
    offset += (channelData[i].value / 100) * circumference
  }
  return -offset
}

onMounted(() => {
  updateTime()
  timeTimer = window.setInterval(updateTime, 1000)
})

onUnmounted(() => {
  clearInterval(timeTimer)
})
</script>

<style scoped lang="scss">
.data-screen {
  width: 100vw;
  height: 100vh;
  background: linear-gradient(135deg, #0a1628 0%, #1a2a4a 50%, #0d1b2a 100%);
  color: #fff;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

/* 头部样式 */
.header {
  height: 80px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(180deg, rgba(0, 150, 255, 0.1) 0%, transparent 100%);
  border-bottom: 1px solid rgba(0, 212, 255, 0.3);
}

.header::before,
.header::after {
  content: '';
  position: absolute;
  top: 0;
  width: 200px;
  height: 100%;
  border: 2px solid transparent;
  border-image: linear-gradient(180deg, #00d4ff, transparent) 1;
}

.header::before {
  left: 20px;
  border-right: none;
  border-bottom: none;
}

.header::after {
  right: 20px;
  border-left: none;
  border-bottom: none;
}

.header-title {
  position: relative;
  padding: 0 60px;
}

.header-title::before,
.header-title::after {
  content: '◆';
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  color: #00d4ff;
  font-size: 12px;
}

.header-title::before {
  left: 30px;
}

.header-title::after {
  right: 30px;
}

.title-text {
  font-size: 28px;
  font-weight: bold;
  background: linear-gradient(90deg, #00d4ff, #0099ff, #00d4ff);
  background-size: 200% 100%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: shimmer 3s linear infinite;
  text-shadow: 0 0 20px rgba(0, 212, 255, 0.5);
}

@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

.header-time {
  position: absolute;
  right: 30px;
  font-size: 14px;
  color: #00d4ff;
}

/* 主体内容 */
.main-content {
  flex: 1;
  display: flex;
  padding: 20px;
  gap: 20px;
}

.panel {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.left-panel,
.right-panel {
  width: 320px;
}

.center-panel {
  flex: 1;
}

/* 卡片样式 */
.card {
  background: rgba(10, 30, 60, 0.6);
  border: 1px solid rgba(0, 212, 255, 0.2);
  border-radius: 8px;
  padding: 15px;
  position: relative;
}

.card::before {
  content: '';
  position: absolute;
  top: -1px;
  left: 20px;
  right: 20px;
  height: 2px;
  background: linear-gradient(90deg, transparent, #00d4ff, transparent);
}

.card::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: 8px;
  pointer-events: none;
  box-shadow: inset 0 0 20px rgba(0, 212, 255, 0.05);
}

.card-header {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
}

.card-title {
  font-size: 16px;
  font-weight: bold;
  color: #00d4ff;
  padding-left: 10px;
  border-left: 3px solid #00d4ff;
}

/* 数字展示 */
.number-display {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  margin-bottom: 20px;
}

.num-box {
  width: 36px;
  height: 48px;
  background: linear-gradient(180deg, #1e3a5f, #0d2137);
  border: 1px solid #00d4ff;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  font-weight: bold;
  color: #00d4ff;
  text-shadow: 0 0 10px rgba(0, 212, 255, 0.5);
}

.unit {
  font-size: 14px;
  color: #888;
  margin-left: 5px;
}

/* 仪表盘 */
.gauge-chart {
  width: 150px;
  height: 80px;
  margin: 0 auto;
  position: relative;
  overflow: hidden;
}

.gauge-bg {
  position: absolute;
  width: 150px;
  height: 150px;
  border-radius: 50%;
  border: 15px solid #1e3a5f;
  border-bottom-color: transparent;
  border-left-color: transparent;
  transform: rotate(-135deg);
}

.gauge-fill {
  position: absolute;
  width: 150px;
  height: 150px;
  border-radius: 50%;
  border: 15px solid transparent;
  border-top-color: #00d4ff;
  border-right-color: #00d4ff;
  transform: rotate(-90deg);
  transition: transform 0.5s ease;
}

.gauge-center {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  text-align: center;
}

.gauge-value {
  display: block;
  font-size: 20px;
  font-weight: bold;
  color: #00d4ff;
}

.gauge-label {
  font-size: 12px;
  color: #888;
}

/* 性别统计 */
.gender-stats {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.gender-item {
  display: flex;
  align-items: center;
  gap: 15px;
}

.gender-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.gender-icon.male {
  background: rgba(0, 150, 255, 0.2);
  color: #0096ff;
}

.gender-icon.female {
  background: rgba(255, 107, 107, 0.2);
  color: #ff6b6b;
}

.gender-icon svg {
  width: 24px;
  height: 24px;
}

.gender-bar {
  flex: 1;
}

.bar-bg {
  height: 10px;
  background: #1e3a5f;
  border-radius: 5px;
  overflow: hidden;
}

.bar-fill {
  height: 100%;
  border-radius: 5px;
  transition: width 0.5s ease;
}

.bar-fill.male {
  background: linear-gradient(90deg, #0096ff, #00d4ff);
}

.bar-fill.female {
  background: linear-gradient(90deg, #ff6b6b, #ff8585);
}

.gender-label {
  display: block;
  font-size: 12px;
  color: #888;
  margin-top: 5px;
}

/* 饼图 */
.pie-chart {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  position: relative;
  margin: 0 auto 15px;
}

.pie-slice {
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 50%;
}

.pie-center {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 60px;
  height: 60px;
  background: #0a1628;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.center-text {
  font-size: 12px;
  color: #888;
}

.pie-legend {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 11px;
}

.legend-color {
  width: 10px;
  height: 10px;
  border-radius: 2px;
}

.legend-text {
  color: #aaa;
}

/* 地图容器 */
.map-container {
  flex: 1;
  position: relative;
  min-height: 350px;
  background: rgba(10, 30, 60, 0.4);
  border: 1px solid rgba(0, 212, 255, 0.2);
  border-radius: 8px;
  overflow: hidden;
}

.map-bg {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.china-map {
  width: 100%;
  height: 100%;
}

.map-path {
  fill: rgba(0, 150, 255, 0.1);
  stroke: #00d4ff;
  stroke-width: 1;
}

.city-point {
  fill: #ff6b6b;
  cursor: pointer;
}

.city-point:hover {
  fill: #ffd93d;
}

.map-info {
  position: absolute;
  top: 20px;
  right: 20px;
  background: rgba(10, 30, 60, 0.9);
  border: 1px solid #00d4ff;
  border-radius: 4px;
  padding: 10px;
  min-width: 120px;
}

.info-title {
  font-size: 14px;
  color: #00d4ff;
  margin-bottom: 5px;
}

.info-data {
  font-size: 12px;
  color: #aaa;
}

/* 趋势卡片 */
.trend-card {
  height: 200px;
}

.trend-chart {
  height: 120px;
}

.trend-svg {
  width: 100%;
  height: 100%;
}

.trend-line {
  filter: drop-shadow(0 0 4px rgba(0, 212, 255, 0.5));
}

/* 排行列表 */
.rank-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.rank-item {
  display: flex;
  align-items: center;
  gap: 10px;
}

.rank-num {
  width: 24px;
  height: 24px;
  background: #1e3a5f;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: bold;
}

.rank-num.top {
  background: linear-gradient(135deg, #ffd700, #ff6b00);
  color: #000;
}

.rank-name {
  width: 80px;
  font-size: 13px;
}

.rank-bar {
  flex: 1;
  height: 8px;
  background: #1e3a5f;
  border-radius: 4px;
  overflow: hidden;
}

.rank-fill {
  height: 100%;
  border-radius: 4px;
  transition: width 0.5s ease;
}

.rank-value {
  width: 50px;
  text-align: right;
  font-size: 12px;
  color: #00d4ff;
}

/* 柱状图 */
.bar-chart {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  height: 100px;
  padding: 0 10px;
}

.bar-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
}

.bar-group {
  display: flex;
  align-items: flex-end;
  gap: 2px;
}

.bar-segment {
  width: 6px;
  border-radius: 2px 2px 0 0;
  transition: height 0.5s ease;
}

.bar-label {
  font-size: 10px;
  color: #888;
}

.year-legend {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 10px;
}

.year-tag {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 11px;
  color: #aaa;
}

.year-dot {
  width: 8px;
  height: 8px;
  border-radius: 2px;
}

/* 渠道统计 */
.channel-stats {
  display: flex;
  align-items: center;
  gap: 20px;
}

.donut-chart {
  width: 100px;
  height: 100px;
}

.donut-svg {
  width: 100%;
  height: 100%;
}

.channel-legend {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.channel-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
}

.channel-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
}

.channel-name {
  color: #aaa;
  flex: 1;
}

.channel-value {
  color: #00d4ff;
  font-weight: bold;
}
</style>
