<template>
  <div class="page active">
    <div class="page-header">
      <h1>{{ t('home.title') }}</h1>
      <p>{{ t('home.subtitle') }}</p>
    </div>
    
    <div class="dashboard-grid">
      <div class="dashboard-card" @click="navigateToPage('admission')">
        <div class="card-icon admission">
          <i class="fas fa-user-plus"></i>
        </div>
        <div class="card-content">
          <h3>{{ t('home.admission.title') }}</h3>
          <p>{{ t('home.admission.desc') }}</p>
          <div class="card-stats">
            <span class="stat-number">156</span>
            <span class="stat-label">{{ t('home.admission.count') }}</span>
          </div>
        </div>
        <div class="card-arrow">
          <i class="fas fa-arrow-right"></i>
        </div>
      </div>

      <div class="dashboard-card" @click="navigateToPage('communication')">
        <div class="card-icon communication">
          <i class="fas fa-comments"></i>
        </div>
        <div class="card-content">
          <h3>{{ t('home.communication.title') }}</h3>
          <p>{{ t('home.communication.desc') }}</p>
          <div class="card-stats">
            <span class="stat-number">2340</span>
            <span class="stat-label">{{ t('home.communication.count') }}</span>
          </div>
        </div>
        <div class="card-arrow">
          <i class="fas fa-arrow-right"></i>
        </div>
      </div>

      <div class="dashboard-card" @click="navigateToPage('academic')">
        <div class="card-icon academic">
          <i class="fas fa-chart-line"></i>
        </div>
        <div class="card-content">
          <h3>{{ t('home.academic.title') }}</h3>
          <p>{{ t('home.academic.desc') }}</p>
          <div class="card-stats">
            <span class="stat-number">89</span>
            <span class="stat-label">{{ t('home.academic.count') }}</span>
          </div>
        </div>
        <div class="card-arrow">
          <i class="fas fa-arrow-right"></i>
        </div>
      </div>

      <div class="dashboard-card" @click="navigateToPage('guidance')">
        <div class="card-icon guidance">
          <i class="fas fa-route"></i>
        </div>
        <div class="card-content">
          <h3>{{ t('home.guidance.title') }}</h3>
          <p>{{ t('home.guidance.desc') }}</p>
          <div class="card-stats">
            <span class="stat-number">67</span>
            <span class="stat-label">{{ t('home.guidance.count') }}</span>
          </div>
        </div>
        <div class="card-arrow">
          <i class="fas fa-arrow-right"></i>
        </div>
      </div>
    </div>

    <div class="overview-charts">
      <div class="chart-container">
        <h3>{{ t('home.overview.title') }}</h3>
        <div ref="chartRef" style="height: 300px;"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { useI18nStore } from '../stores/i18n'
import * as echarts from 'echarts'

const router = useRouter()
const i18nStore = useI18nStore()
const chartRef = ref<HTMLElement>()

// 翻译函数
const t = (key: string): string => {
  return i18nStore.t(key)
}

// 导航到指定页面
const navigateToPage = (page: string) => {
  router.push(`/${page}`)
}

// 初始化图表
const initChart = () => {
  if (!chartRef.value) return
  
  const chart = echarts.init(chartRef.value)
  
  const option = {
    title: {
      text: t('home.overview.title'),
      left: 'center',
      textStyle: {
        color: '#333',
        fontSize: 18,
        fontWeight: 'bold'
      }
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        label: {
          backgroundColor: '#6a7985'
        }
      }
    },
    legend: {
      data: [t('home.admission.title'), t('home.communication.title'), t('home.academic.title'), t('home.guidance.title')],
      bottom: 10
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '15%',
      containLabel: true
    },
    xAxis: [
      {
        type: 'category',
        boundaryGap: false,
        data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月']
      }
    ],
    yAxis: [
      {
        type: 'value'
      }
    ],
    series: [
      {
        name: t('home.admission.title'),
        type: 'line',
        stack: 'Total',
        smooth: true,
        lineStyle: {
          width: 3,
          color: '#F4C430'
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(244, 196, 48, 0.3)' },
            { offset: 1, color: 'rgba(244, 196, 48, 0.1)' }
          ])
        },
        data: [120, 132, 101, 134, 90, 230, 210]
      },
      {
        name: t('home.communication.title'),
        type: 'line',
        stack: 'Total',
        smooth: true,
        lineStyle: {
          width: 3,
          color: '#FF6B35'
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(255, 107, 53, 0.3)' },
            { offset: 1, color: 'rgba(255, 107, 53, 0.1)' }
          ])
        },
        data: [220, 182, 191, 234, 290, 330, 310]
      },
      {
        name: t('home.academic.title'),
        type: 'line',
        stack: 'Total',
        smooth: true,
        lineStyle: {
          width: 3,
          color: '#17A2B8'
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(23, 162, 184, 0.3)' },
            { offset: 1, color: 'rgba(23, 162, 184, 0.1)' }
          ])
        },
        data: [150, 232, 201, 154, 190, 330, 410]
      },
      {
        name: t('home.guidance.title'),
        type: 'line',
        stack: 'Total',
        smooth: true,
        lineStyle: {
          width: 3,
          color: '#28A745'
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(40, 167, 69, 0.3)' },
            { offset: 1, color: 'rgba(40, 167, 69, 0.1)' }
          ])
        },
        data: [320, 332, 301, 334, 390, 330, 320]
      }
    ]
  }
  
  chart.setOption(option)
  
  // 响应式调整
  window.addEventListener('resize', () => {
    chart.resize()
  })
}

onMounted(() => {
  nextTick(() => {
    initChart()
  })
})
</script>

<style scoped>
/* 页面特定样式 */
.dashboard-card {
  cursor: pointer;
}

.chart-container {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  padding: 30px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.chart-container h3 {
  margin-bottom: 20px;
  color: #333;
  font-size: 20px;
  text-align: center;
}
</style>
