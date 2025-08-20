<template>
  <div class="pathway-mountain-container">
    <!-- 登山背景 -->
    <div class="mountain-background">
      <!-- 天空渐变 -->
      <div class="sky-gradient"></div>
      
      <!-- 山峰层次 -->
      <div class="mountain-layers">
        <!-- 远山 -->
        <svg class="mountain-far" viewBox="0 0 1200 400">
          <path d="M0,400 L0,280 Q100,240 200,260 Q300,240 400,220 Q500,200 600,180 Q700,160 800,140 Q900,120 1000,100 Q1100,80 1200,60 L1200,400 Z" 
                fill="rgba(102, 126, 234, 0.15)" />
        </svg>
        
        <!-- 中山 -->
        <svg class="mountain-mid" viewBox="0 0 1200 400">
          <path d="M0,400 L0,320 Q150,280 300,300 Q450,280 600,260 Q750,240 900,220 Q1050,200 1200,180 L1200,400 Z" 
                fill="rgba(102, 126, 234, 0.25)" />
        </svg>
        
        <!-- 近山 -->
        <svg class="mountain-near" viewBox="0 0 1200 400">
          <path d="M0,400 L0,360 Q200,340 400,350 Q600,340 800,330 Q1000,320 1200,310 L1200,400 Z" 
                fill="rgba(102, 126, 234, 0.35)" />
        </svg>
      </div>
      
      <!-- 云朵 -->
      <div class="clouds">
        <div class="cloud cloud-1"></div>
        <div class="cloud cloud-2"></div>
        <div class="cloud cloud-3"></div>
      </div>
      
      <!-- 太阳光芒 -->
      <div class="sun-rays">
        <div class="ray ray-1"></div>
        <div class="ray ray-2"></div>
        <div class="ray ray-3"></div>
        <div class="ray ray-4"></div>
      </div>
    </div>
    
    <!-- 升学路径内容 -->
    <div class="pathway-content">
      <div class="pathway-header">
        <h2 class="pathway-title">
          <i class="fas fa-mountain"></i>
          {{ t('guidance.pathwayChart') }}
          <span class="subtitle">追求卓越，攀登学术高峰</span>
        </h2>
      </div>
      
      <!-- 登山路径图表 -->
      <div class="mountain-pathway-chart" ref="pathwayChartRef">
        <!-- ECharts 图表容器 -->
        <div class="echarts-container" style="height: 500px;"></div>
        
        <!-- 自定义路径元素覆盖层 -->
        <div class="pathway-overlay">
          <!-- 起点标识 -->
          <div class="milestone-marker start-point">
            <i class="fas fa-home"></i>
            <span>起点</span>
          </div>
          
          <!-- 中间里程碑 -->
          <div class="milestone-marker mid-point">
            <i class="fas fa-flag"></i>
            <span>里程碑</span>
          </div>
          
          <!-- 终点标识 -->
          <div class="milestone-marker end-point">
            <i class="fas fa-trophy"></i>
            <span>目标院校</span>
          </div>
        </div>
      </div>
      
      <!-- 进度指示器 -->
      <div class="climbing-progress">
        <div class="progress-header">
          <h3><i class="fas fa-route"></i> 攀登进度</h3>
        </div>
        <div class="progress-trail">
          <div class="trail-line"></div>
          <div class="progress-steps">
            <div v-for="(step, index) in progressSteps" :key="index" 
                 class="progress-step" 
                 :class="{ active: step.completed, current: step.current }">
              <div class="step-marker">
                <i :class="step.icon"></i>
              </div>
              <div class="step-label">{{ step.label }}</div>
              <div class="step-description">{{ step.description }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick, watch, computed } from 'vue'
import { useI18nStore } from '../stores/i18n'
import * as echarts from 'echarts'

// Props
interface Props {
  studentData?: any
  selectedStudent?: string
}

const props = withDefaults(defineProps<Props>(), {
  studentData: () => ({}),
  selectedStudent: ''
})

const i18nStore = useI18nStore()
const pathwayChartRef = ref<HTMLElement>()

// 翻译函数
const t = (key: string): string => {
  return i18nStore.t(key)
}

// 进度步骤数据
const progressSteps = computed(() => [
  {
    label: '学术准备',
    description: '强化学术基础',
    icon: 'fas fa-book',
    completed: true,
    current: false
  },
  {
    label: '语言考试',
    description: '提升语言能力',
    icon: 'fas fa-language',
    completed: true,
    current: false
  },
  {
    label: '申请准备',
    description: '准备申请材料',
    icon: 'fas fa-file-alt',
    completed: false,
    current: true
  },
  {
    label: '院校申请',
    description: '提交申请',
    icon: 'fas fa-paper-plane',
    completed: false,
    current: false
  },
  {
    label: '面试准备',
    description: '准备面试',
    icon: 'fas fa-user-tie',
    completed: false,
    current: false
  },
  {
    label: '录取入学',
    description: '成功入学',
    icon: 'fas fa-graduation-cap',
    completed: false,
    current: false
  }
])

// 初始化登山路径图表
const initPathwayChart = () => {
  if (!pathwayChartRef.value) return
  
  const chartContainer = pathwayChartRef.value.querySelector('.echarts-container') as HTMLElement
  if (!chartContainer) return
  
  const chart = echarts.init(chartContainer)
  
  // 自定义登山路径配置
  const option = {
    backgroundColor: 'transparent',
    title: {
      text: '',
      show: false
    },
    tooltip: {
      trigger: 'item',
      formatter: function(params: any) {
        return `<div style="padding: 10px;">
          <strong>${params.name}</strong><br/>
          <span>点击查看详细信息</span>
        </div>`
      },
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderColor: '#667eea',
      borderWidth: 2,
      textStyle: {
        color: '#333'
      }
    },
    series: [{
      type: 'graph',
      layout: 'none',
      symbolSize: function(value: any, params: any) {
        // 根据节点类型设置不同大小
        if (params.name.includes('起点') || params.name.includes('目标')) {
          return 120
        }
        return 100
      },
      roam: true,
      focusNodeAdjacency: true,
      draggable: false,
      label: {
        show: true,
        position: 'inside',
        fontSize: 12,
        fontWeight: 'bold',
        color: '#fff',
        formatter: function(params: any) {
          return params.name.length > 6 ? params.name.substring(0, 6) + '...' : params.name
        }
      },
      edgeSymbol: ['none', 'arrow'],
      edgeSymbolSize: [0, 15],
      data: [
        {
          name: '高中阶段',
          x: 100,
          y: 380,
          symbolSize: 110,
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {offset: 0, color: '#667eea'},
              {offset: 1, color: '#764ba2'}
            ]),
            shadowColor: 'rgba(102, 126, 234, 0.3)',
            shadowBlur: 10
          }
        },
        {
          name: '学术强化',
          x: 250,
          y: 320,
          symbolSize: 95,
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {offset: 0, color: '#28a745'},
              {offset: 1, color: '#20c997'}
            ]),
            shadowColor: 'rgba(40, 167, 69, 0.3)',
            shadowBlur: 8
          }
        },
        {
          name: '语言考试',
          x: 400,
          y: 280,
          symbolSize: 95,
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {offset: 0, color: '#ffc107'},
              {offset: 1, color: '#fd7e14'}
            ]),
            shadowColor: 'rgba(255, 193, 7, 0.3)',
            shadowBlur: 8
          }
        },
        {
          name: '课外活动',
          x: 350,
          y: 200,
          symbolSize: 90,
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {offset: 0, color: '#17a2b8'},
              {offset: 1, color: '#6f42c1'}
            ]),
            shadowColor: 'rgba(23, 162, 184, 0.3)',
            shadowBlur: 8
          }
        },
        {
          name: '申请材料',
          x: 550,
          y: 240,
          symbolSize: 95,
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {offset: 0, color: '#e83e8c'},
              {offset: 1, color: '#fd7e14'}
            ]),
            shadowColor: 'rgba(232, 62, 140, 0.3)',
            shadowBlur: 8
          }
        },
        {
          name: '面试准备',
          x: 700,
          y: 200,
          symbolSize: 90,
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {offset: 0, color: '#6610f2'},
              {offset: 1, color: '#6f42c1'}
            ]),
            shadowColor: 'rgba(102, 16, 242, 0.3)',
            shadowBlur: 8
          }
        },
        {
          name: '目标院校',
          x: 850,
          y: 120,
          symbolSize: 130,
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {offset: 0, color: '#ff6b35'},
              {offset: 1, color: '#f4c430'}
            ]),
            shadowColor: 'rgba(255, 107, 53, 0.4)',
            shadowBlur: 15
          }
        }
      ],
      links: [
        {
          source: 0,
          target: 1,
          lineStyle: {
            width: 4,
            color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
              {offset: 0, color: '#667eea'},
              {offset: 1, color: '#28a745'}
            ]),
            curveness: 0.2
          }
        },
        {
          source: 1,
          target: 2,
          lineStyle: {
            width: 4,
            color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
              {offset: 0, color: '#28a745'},
              {offset: 1, color: '#ffc107'}
            ]),
            curveness: 0.15
          }
        },
        {
          source: 1,
          target: 3,
          lineStyle: {
            width: 3,
            color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
              {offset: 0, color: '#28a745'},
              {offset: 1, color: '#17a2b8'}
            ]),
            curveness: 0.3
          }
        },
        {
          source: 2,
          target: 4,
          lineStyle: {
            width: 4,
            color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
              {offset: 0, color: '#ffc107'},
              {offset: 1, color: '#e83e8c'}
            ]),
            curveness: 0.1
          }
        },
        {
          source: 3,
          target: 5,
          lineStyle: {
            width: 3,
            color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
              {offset: 0, color: '#17a2b8'},
              {offset: 1, color: '#6610f2'}
            ]),
            curveness: 0.2
          }
        },
        {
          source: 4,
          target: 6,
          lineStyle: {
            width: 4,
            color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
              {offset: 0, color: '#e83e8c'},
              {offset: 1, color: '#ff6b35'}
            ]),
            curveness: 0.25
          }
        },
        {
          source: 5,
          target: 6,
          lineStyle: {
            width: 4,
            color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
              {offset: 0, color: '#6610f2'},
              {offset: 1, color: '#ff6b35'}
            ]),
            curveness: 0.2
          }
        }
      ],
      emphasis: {
        focus: 'adjacency',
        lineStyle: {
          width: 6
        },
        itemStyle: {
          shadowBlur: 20
        }
      },
      animationDuration: 1500,
      animationEasing: 'elasticOut'
    }]
  }
  
  chart.setOption(option)
  
  // 响应式调整
  window.addEventListener('resize', () => {
    chart.resize()
  })
  
  // 添加点击事件
  chart.on('click', function(params: any) {
    if (params.dataType === 'node') {
      console.log('Clicked node:', params.name)
      // 这里可以添加节点点击后的交互逻辑
    }
  })
}

onMounted(() => {
  nextTick(() => {
    initPathwayChart()
  })
})

watch(() => props.selectedStudent, () => {
  nextTick(() => {
    initPathwayChart()
  })
})

watch(() => i18nStore.currentLanguage, () => {
  nextTick(() => {
    initPathwayChart()
  })
})
</script>

<style scoped>
.pathway-mountain-container {
  position: relative;
  width: 100%;
  min-height: 800px;
  overflow: hidden;
  border-radius: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

/* 登山背景 */
.mountain-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}

/* 天空渐变 */
.sky-gradient {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 60%;
  background: linear-gradient(180deg, 
    #87ceeb 0%,
    #98d8e8 20%,
    #b8e4f0 40%,
    #d4f1f4 60%,
    rgba(255, 255, 255, 0.8) 100%);
  opacity: 0.9;
}

/* 山峰层次 */
.mountain-layers {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.mountain-far,
.mountain-mid,
.mountain-near {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

/* 云朵动画 */
.clouds {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.cloud {
  position: absolute;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 50px;
  opacity: 0.7;
  animation: drift 20s infinite linear;
}

.cloud::before,
.cloud::after {
  content: '';
  position: absolute;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 50px;
}

.cloud-1 {
  width: 80px;
  height: 40px;
  top: 15%;
  left: -100px;
  animation-duration: 25s;
}

.cloud-1::before {
  width: 60px;
  height: 50px;
  top: -25px;
  left: 10px;
}

.cloud-1::after {
  width: 70px;
  height: 35px;
  top: -15px;
  right: 10px;
}

.cloud-2 {
  width: 100px;
  height: 50px;
  top: 25%;
  left: -120px;
  animation-duration: 30s;
  animation-delay: -5s;
}

.cloud-2::before {
  width: 70px;
  height: 60px;
  top: -30px;
  left: 20px;
}

.cloud-2::after {
  width: 80px;
  height: 40px;
  top: -20px;
  right: 15px;
}

.cloud-3 {
  width: 90px;
  height: 45px;
  top: 35%;
  left: -110px;
  animation-duration: 35s;
  animation-delay: -10s;
}

.cloud-3::before {
  width: 65px;
  height: 55px;
  top: -28px;
  left: 15px;
}

.cloud-3::after {
  width: 75px;
  height: 38px;
  top: -18px;
  right: 12px;
}

@keyframes drift {
  0% {
    transform: translateX(-100px);
  }
  100% {
    transform: translateX(calc(100vw + 100px));
  }
}

/* 太阳光芒 */
.sun-rays {
  position: absolute;
  top: 10%;
  right: 15%;
  width: 150px;
  height: 150px;
  pointer-events: none;
}

.ray {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 2px;
  height: 60px;
  background: linear-gradient(to bottom, rgba(255, 215, 0, 0.8), transparent);
  transform-origin: center bottom;
  animation: shine 4s infinite ease-in-out;
}

.ray-1 {
  transform: translate(-50%, -100%) rotate(0deg);
  animation-delay: 0s;
}

.ray-2 {
  transform: translate(-50%, -100%) rotate(30deg);
  animation-delay: 0.5s;
}

.ray-3 {
  transform: translate(-50%, -100%) rotate(60deg);
  animation-delay: 1s;
}

.ray-4 {
  transform: translate(-50%, -100%) rotate(90deg);
  animation-delay: 1.5s;
}

@keyframes shine {
  0%, 100% {
    opacity: 0.3;
    transform: translate(-50%, -100%) rotate(var(--rotation, 0deg)) scaleY(1);
  }
  50% {
    opacity: 0.8;
    transform: translate(-50%, -100%) rotate(var(--rotation, 0deg)) scaleY(1.2);
  }
}

/* 路径内容 */
.pathway-content {
  position: relative;
  z-index: 10;
  padding: 30px;
  height: 100%;
}

.pathway-header {
  text-align: center;
  margin-bottom: 30px;
}

.pathway-title {
  color: #fff;
  font-size: 32px;
  font-weight: 700;
  margin-bottom: 10px;
  text-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;
  flex-direction: column;
}

.pathway-title i {
  font-size: 36px;
  color: #f4c430;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
}

.subtitle {
  font-size: 18px;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.9);
  font-style: italic;
}

/* 登山路径图表 */
.mountain-pathway-chart {
  position: relative;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  padding: 20px;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.15);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  margin-bottom: 30px;
}

.echarts-container {
  width: 100%;
  position: relative;
}

/* 路径覆盖层 */
.pathway-overlay {
  position: absolute;
  top: 20px;
  left: 20px;
  right: 20px;
  bottom: 20px;
  pointer-events: none;
  z-index: 5;
}

.milestone-marker {
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
  pointer-events: auto;
  cursor: pointer;
  transition: all 0.3s ease;
}

.milestone-marker i {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 18px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.milestone-marker span {
  background: rgba(255, 255, 255, 0.95);
  color: #333;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.start-point {
  top: 75%;
  left: 8%;
}

.start-point i {
  background: linear-gradient(135deg, #667eea, #764ba2);
}

.mid-point {
  top: 45%;
  left: 45%;
}

.mid-point i {
  background: linear-gradient(135deg, #ffc107, #fd7e14);
}

.end-point {
  top: 15%;
  right: 12%;
}

.end-point i {
  background: linear-gradient(135deg, #ff6b35, #f4c430);
}

.milestone-marker:hover {
  transform: translateY(-5px);
}

.milestone-marker:hover span {
  transform: scale(1.05);
}

/* 攀登进度 */
.climbing-progress {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  padding: 25px;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.15);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.progress-header h3 {
  color: #333;
  font-size: 20px;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.progress-header i {
  color: #667eea;
}

.progress-trail {
  position: relative;
}

.trail-line {
  position: absolute;
  top: 25px;
  left: 25px;
  right: 25px;
  height: 4px;
  background: linear-gradient(to right, #667eea, #f4c430);
  border-radius: 2px;
  z-index: 1;
}

.progress-steps {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  position: relative;
  z-index: 2;
}

.progress-step {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  flex: 1;
  text-align: center;
  transition: all 0.3s ease;
}

.step-marker {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #e9ecef;
  color: #6c757d;
  font-size: 18px;
  transition: all 0.3s ease;
  border: 3px solid transparent;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.progress-step.active .step-marker {
  background: linear-gradient(135deg, #28a745, #20c997);
  color: white;
  border-color: rgba(255, 255, 255, 0.3);
}

.progress-step.current .step-marker {
  background: linear-gradient(135deg, #ffc107, #fd7e14);
  color: white;
  border-color: rgba(255, 255, 255, 0.3);
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1), 0 0 0 0 rgba(255, 193, 7, 0.4);
  }
  50% {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1), 0 0 0 15px rgba(255, 193, 7, 0);
  }
}

.step-label {
  font-weight: 600;
  color: #333;
  font-size: 14px;
}

.step-description {
  font-size: 12px;
  color: #666;
  line-height: 1.4;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .pathway-mountain-container {
    min-height: 600px;
  }
  
  .pathway-content {
    padding: 20px;
  }
  
  .pathway-title {
    font-size: 24px;
    flex-direction: column;
    gap: 10px;
  }
  
  .pathway-title i {
    font-size: 28px;
  }
  
  .subtitle {
    font-size: 16px;
  }
  
  .mountain-pathway-chart {
    padding: 15px;
  }
  
  .echarts-container {
    height: 350px !important;
  }
  
  .progress-steps {
    flex-direction: column;
    gap: 20px;
  }
  
  .progress-step {
    flex-direction: row;
    text-align: left;
    align-items: center;
  }
  
  .trail-line {
    display: none;
  }
  
  .milestone-marker span {
    font-size: 11px;
    padding: 3px 8px;
  }
  
  .milestone-marker i {
    width: 35px;
    height: 35px;
    font-size: 16px;
  }
}

@media (max-width: 480px) {
  .pathway-title {
    font-size: 20px;
  }
  
  .subtitle {
    font-size: 14px;
  }
  
  .echarts-container {
    height: 300px !important;
  }
  
  .step-marker {
    width: 40px;
    height: 40px;
    font-size: 16px;
  }
}
</style>
