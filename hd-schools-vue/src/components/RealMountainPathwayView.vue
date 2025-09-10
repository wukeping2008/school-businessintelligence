d<template>
  <div class="real-mountain-pathway-container">
    <!-- 真实山峰背景 -->
    <div class="mountain-background">
      <!-- 动态山峰图片背景 -->
      <div 
        class="mountain-image-layer"
        :style="{ backgroundImage: `url(${currentMountainImage})` }"
      >
        <!-- 遮罩层提供更好的对比度 -->
        <div class="mountain-overlay"></div>
      </div>
      
      <!-- 动态天空效果 -->
      <div class="dynamic-sky">
        <div class="cloud-layer">
          <div class="cloud cloud-1"></div>
          <div class="cloud cloud-2"></div>
          <div class="cloud cloud-3"></div>
        </div>
      </div>
    </div>
    
    <!-- 升学路径内容 -->
    <div class="pathway-content">
      <!-- 标题区域 -->
      <div class="pathway-header">
        <h1 class="main-title">
          <i class="fas fa-graduation-cap"></i>
          {{ t('guidance.pathwayChart') }}
        </h1>
        <h2 class="subtitle">{{ getMountainTitle() }}</h2>
        <p class="description">个性化升学路径规划，助您攀登学术珠峰</p>
      </div>
      
      <!-- 学校推荐展示区 -->
      <div class="target-schools-section">
        <h3 class="section-title">
          <i class="fas fa-award"></i>
          推荐目标学校
        </h3>
        <div class="schools-grid">
          <div 
            v-for="(school, index) in recommendedSchools" 
            :key="index"
            class="school-card"
            :class="school.tier"
            @click="selectTargetSchool(school)"
          >
            <div class="school-flag" :class="school.tier">
              <i class="fas fa-flag"></i>
            </div>
            <div class="school-info">
              <h4 class="school-name">{{ school.name }}</h4>
              <p class="school-location">{{ school.location }}</p>
              <div class="match-score">
                <span class="label">匹配度:</span>
                <div class="score-bar">
                  <div 
                    class="score-fill" 
                    :style="{ width: school.matchScore + '%' }"
                  ></div>
                </div>
                <span class="score-text">{{ school.matchScore }}%</span>
              </div>
              <div class="school-tags">
                <span 
                  v-for="tag in school.tags" 
                  :key="tag" 
                  class="tag"
                >{{ tag }}</span>
              </div>
            </div>
            <div class="school-difficulty">
              <span class="difficulty-label">{{ getDifficultyLabel(school.tier) }}</span>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 升学路径可视化 -->
      <div class="pathway-visualization">
        <div class="pathway-chart" ref="pathwayChartRef">
          <!-- ECharts 容器 -->
          <div class="echarts-container"></div>
          
          <!-- 山峰路径覆盖层 -->
          <div class="mountain-path-overlay">
            <!-- 起点营地 -->
            <div class="milestone base-camp" :style="getPositionStyle(0)">
              <div class="milestone-icon">
                <i class="fas fa-home"></i>
              </div>
              <div class="milestone-info">
                <h5>起点营地</h5>
                <p>当前状态</p>
              </div>
            </div>
            
            <!-- 中间里程碑 -->
            <div 
              v-for="(milestone, index) in pathwayMilestones" 
              :key="index"
              class="milestone" 
              :class="[milestone.status, `level-${index + 1}`]"
              :style="getPositionStyle(index + 1)"
              @click="showMilestoneDetails(milestone)"
            >
              <!-- 连接线 (只在非第一个节点显示) -->
              <svg v-if="index > 0" class="milestone-path" :style="getPathStyle(index)">
                <path 
                  :d="getPathData(index)"
                  stroke="rgba(255, 255, 255, 0.3)" 
                  stroke-width="2" 
                  fill="none" 
                  stroke-dasharray="5,5"
                  class="animated-path"
                />
              </svg>
              
              <div class="milestone-icon">
                <i :class="milestone.icon"></i>
              </div>
              <div class="milestone-info">
                <h5>{{ milestone.title }}</h5>
                <p>{{ milestone.description }}</p>
                <div class="deadline">{{ milestone.deadline }}</div>
              </div>
              <div class="progress-indicator" v-if="milestone.progress">
                <div 
                  class="progress-bar" 
                  :style="{ width: milestone.progress + '%' }"
                ></div>
              </div>
            </div>
            
            <!-- 目标学校峰顶 -->
            <div class="milestone summit" :style="getPositionStyle(-1)">
              <div class="university-silhouette">
                <i class="fas fa-university"></i>
              </div>
              <div class="milestone-info">
                <h5>{{ selectedSchool?.name || '目标学府' }}</h5>
                <p>学术巅峰</p>
              </div>
              <div class="success-badge">
                <i class="fas fa-trophy"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 详细规划时间线 -->
      <div class="detailed-timeline">
        <h3 class="section-title">
          <i class="fas fa-route"></i>
          攀登时间线
        </h3>
        <div class="timeline-container">
          <div class="timeline-line"></div>
          <div 
            v-for="(phase, index) in detailedPhases" 
            :key="index"
            class="timeline-phase"
            :class="phase.status"
          >
            <div class="phase-marker">
              <i :class="phase.icon"></i>
            </div>
            <div class="phase-content">
              <h4>{{ phase.title }}</h4>
              <p class="phase-description">{{ phase.description }}</p>
              <div class="phase-tasks">
                <div 
                  v-for="task in phase.tasks" 
                  :key="task.id"
                  class="task-item"
                  :class="{ completed: task.completed }"
                >
                  <i :class="task.completed ? 'fas fa-check-circle' : 'far fa-circle'"></i>
                  <span>{{ task.name }}</span>
                  <span class="task-deadline">{{ task.deadline }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 家长展示面板 -->
      <div class="parent-dashboard" v-if="showParentView">
        <h3 class="section-title">
          <i class="fas fa-chart-line"></i>
          升学投资回报分析
        </h3>
        <div class="roi-analysis">
          <div class="stat-card">
            <h4>成功概率</h4>
            <div class="large-stat">{{ calculatedSuccessRate }}%</div>
          </div>
          <div class="stat-card">
            <h4>投资回报率</h4>
            <div class="large-stat">{{ estimatedROI }}%</div>
          </div>
          <div class="stat-card">
            <h4>预估时长</h4>
            <div class="large-stat">{{ estimatedDuration }}</div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 分享功能 -->
    <div class="share-panel">
      <button class="share-btn" @click="generateShareImage">
        <i class="fas fa-share-alt"></i>
        分享升学路径
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import { useI18nStore } from '../stores/i18n'
import * as echarts from 'echarts'

// Props
interface Props {
  studentData?: any
  selectedStudent?: string
  showParentView?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  studentData: () => ({}),
  selectedStudent: '',
  showParentView: false
})

const i18nStore = useI18nStore()
const pathwayChartRef = ref<HTMLElement>()

// 翻译函数
const t = (key: string): string => {
  return i18nStore.t(key)
}

// 山峰图片数据 - 使用可靠的山峰背景图片
const perfectMountainImage = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2000&q=80'

const mountainImages = {
  everest: perfectMountainImage,
  fuji: perfectMountainImage,
  alps: perfectMountainImage,
  rockies: perfectMountainImage
}

// 当前山峰背景
const currentMountainImage = ref(mountainImages.everest)
const selectedSchool = ref(null)

// 推荐学校数据
const recommendedSchools = ref([
  {
    name: 'Harvard University',
    location: 'Cambridge, MA',
    tier: 'dream',
    matchScore: 75,
    tags: ['顶尖学府', '常春藤', '综合实力'],
    mountain: 'everest',
    requirements: {
      gpa: 3.9,
      sat: 1520,
      activities: '优秀'
    }
  },
  {
    name: 'University of Cambridge',
    location: 'Cambridge, UK',
    tier: 'match',
    matchScore: 85,
    tags: ['英国名校', '历史悠久', '学术声誉'],
    mountain: 'alps',
    requirements: {
      gpa: 3.7,
      sat: 1450,
      activities: '良好'
    }
  },
  {
    name: 'University of Toronto',
    location: 'Toronto, Canada',
    tier: 'safety',
    matchScore: 95,
    tags: ['加拿大top1', '性价比高', '多元文化'],
    mountain: 'rockies',
    requirements: {
      gpa: 3.5,
      sat: 1350,
      activities: '一般'
    }
  }
])

// 路径里程碑数据
const pathwayMilestones = ref([
  {
    title: '学术强化期',
    description: '提升GPA，准备标准化考试',
    deadline: '2025年6月',
    status: 'in-progress',
    icon: 'fas fa-book-open',
    progress: 65
  },
  {
    title: '语言冲刺期',
    description: '托福/雅思达标，英语能力提升',
    deadline: '2025年9月',
    status: 'pending',
    icon: 'fas fa-language',
    progress: 30
  },
  {
    title: '申请准备期',
    description: '文书写作，推荐信准备',
    deadline: '2025年12月',
    status: 'pending',
    icon: 'fas fa-edit',
    progress: 0
  },
  {
    title: '面试冲刺期',
    description: '面试技巧训练，模拟面试',
    deadline: '2026年3月',
    status: 'pending',
    icon: 'fas fa-user-tie',
    progress: 0
  }
])

// 详细时间线数据
const detailedPhases = ref([
  {
    title: '基础准备阶段 (6个月)',
    description: '建立坚实的学术基础，提升综合能力',
    status: 'active',
    icon: 'fas fa-seedling',
    tasks: [
      { id: 1, name: '制定学习计划', completed: true, deadline: '2025年1月' },
      { id: 2, name: 'GPA提升至3.8+', completed: false, deadline: '2025年6月' },
      { id: 3, name: '选择标化考试', completed: true, deadline: '2025年2月' }
    ]
  },
  {
    title: '能力提升阶段 (4个月)',
    description: '语言能力突破，课外活动丰富',
    status: 'upcoming',
    icon: 'fas fa-chart-line',
    tasks: [
      { id: 4, name: '托福100+/雅思7.0+', completed: false, deadline: '2025年9月' },
      { id: 5, name: '领导力项目', completed: false, deadline: '2025年8月' },
      { id: 6, name: '科研实习经历', completed: false, deadline: '2025年10月' }
    ]
  },
  {
    title: '申请冲刺阶段 (3个月)',
    description: '申请材料准备，展现个人特色',
    status: 'upcoming',
    icon: 'fas fa-rocket',
    tasks: [
      { id: 7, name: '个人陈述写作', completed: false, deadline: '2025年11月' },
      { id: 8, name: '推荐信收集', completed: false, deadline: '2025年12月' },
      { id: 9, name: '申请材料提交', completed: false, deadline: '2026年1月' }
    ]
  }
])

// 计算属性
const calculatedSuccessRate = computed(() => {
  const baseRate = 70
  const selectedTier = selectedSchool.value?.tier
  if (selectedTier === 'dream') return Math.max(baseRate - 20, 30)
  if (selectedTier === 'match') return baseRate
  if (selectedTier === 'safety') return Math.min(baseRate + 15, 95)
  return baseRate
})

const estimatedROI = computed(() => {
  return selectedSchool.value?.tier === 'dream' ? 450 : 
         selectedSchool.value?.tier === 'match' ? 380 : 320
})

const estimatedDuration = computed(() => {
  return '18个月'
})

// 方法
const getMountainTitle = () => {
  const mountainTitles = {
    everest: '征服珠穆朗玛峰 - 追求学术巅峰',
    fuji: '攀登富士山 - 稳步提升实力',
    alps: '穿越阿尔卑斯山 - 欧洲求学之路',
    rockies: '翻越落基山脉 - 北美教育梦想'
  }
  const currentMountain = Object.keys(mountainImages).find(key => 
    mountainImages[key] === currentMountainImage.value
  )
  return mountainTitles[currentMountain] || mountainTitles.everest
}

const getDifficultyLabel = (tier: string) => {
  const labels = {
    dream: '冲刺目标',
    match: '匹配目标',
    safety: '保底目标'
  }
  return labels[tier] || '目标学校'
}

const selectTargetSchool = (school: any) => {
  selectedSchool.value = school
  currentMountainImage.value = mountainImages[school.mountain] || mountainImages.everest
  
  // 重新初始化图表
  nextTick(() => {
    initPathwayChart()
  })
}

const getPositionStyle = (index: number) => {
  // 阶梯式路径布局 - 匹配实际的里程碑数量
  // 起点(index=0) + 4个里程碑(index=1-4) + 峰顶(index=-1)
  const positions = [
    { bottom: '15%', left: '20%' },  // 起点 - 山脚营地 (index=0)
    { bottom: '30%', left: '35%' },  // 里程碑1 - 学术强化期 (index=1)
    { bottom: '45%', left: '25%' },  // 里程碑2 - 语言冲刺期 (index=2)
    { bottom: '60%', left: '40%' },  // 里程碑3 - 申请准备期 (index=3)
    { bottom: '75%', left: '30%' },  // 里程碑4 - 面试冲刺期 (index=4)
    { bottom: '88%', left: '45%' }   // 峰顶 - 目标达成 (index=-1/5)
  ]
  
  // 根据学生特点添加微小偏移，保持个性化
  const studentOffsets = {
    '张小明': { x: 0, y: 0 },      // 标准路径
    '李小红': { x: 5, y: 0 },      // 稍向右偏
    '王小华': { x: -5, y: 0 }      // 稍向左偏
  }
  
  const offset = studentOffsets[props.selectedStudent] || { x: 0, y: 0 }
  
  // 处理特殊索引
  if (index === -1) {
    // 峰顶位置
    const summit = positions[positions.length - 1]
    return {
      bottom: summit.bottom,
      left: `calc(${summit.left} + ${offset.x}%)`
    }
  }
  
  // 正常索引位置
  const pos = positions[index] || positions[0]
  return {
    bottom: pos.bottom,
    left: `calc(${pos.left} + ${offset.x}%)`
  }
}

const showMilestoneDetails = (milestone: any) => {
  // 显示里程碑详情模态框
  console.log('Showing details for milestone:', milestone.title)
}

// 获取连接线的样式
const getPathStyle = (index: number) => {
  return {
    position: 'absolute',
    width: '200px',
    height: '200px',
    pointerEvents: 'none',
    zIndex: 5,
    bottom: '0',
    left: '0'
  }
}

// 生成SVG路径数据
const getPathData = (index: number) => {
  // 根据索引返回不同的路径数据
  // 这里使用简单的曲线连接
  const paths = [
    'M 0,0 Q 50,20 100,0',      // 平缓上升
    'M 0,0 Q 30,30 100,0',      // 稍微弯曲
    'M 0,0 Q 60,25 100,0',      // 中等弧度
    'M 0,0 Q 40,35 100,0',      // 较大弧度
    'M 0,0 Q 50,30 100,0'       // 最后冲刺
  ]
  return paths[index - 1] || paths[0]
}

const generateShareImage = () => {
  // 生成分享图片
  console.log('Generating share image...')
}

const initPathwayChart = () => {
  const container = pathwayChartRef.value?.querySelector('.echarts-container')
  if (!container) return
  
  const chart = echarts.init(container as HTMLElement)
  
  const option = {
    backgroundColor: 'transparent',
    series: [{
      type: 'graph',
      layout: 'none',
      symbolSize: 0, // 隐藏默认节点，使用自定义覆盖层
      roam: false,
      label: { show: false },
      data: [],
      links: [],
      lineStyle: {
        color: 'rgba(255, 255, 255, 0.8)',
        width: 3,
        type: 'dashed'
      }
    }]
  }
  
  chart.setOption(option)
}

onMounted(() => {
  nextTick(() => {
    initPathwayChart()
  })
})
</script>

<style scoped>
.real-mountain-pathway-container {
  position: relative;
  width: 100%;
  min-height: 100vh;
  overflow: hidden;
}

/* 真实山峰背景 */
.mountain-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}

.mountain-image-layer {
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  transition: background-image 1s ease-in-out;
}

.mountain-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    180deg,
    rgba(0, 0, 0, 0.3) 0%,
    rgba(0, 0, 0, 0.1) 50%,
    rgba(0, 0, 0, 0.4) 100%
  );
}

/* 动态天空效果 */
.dynamic-sky {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 50%;
  z-index: 2;
}

.cloud-layer {
  position: relative;
  width: 100%;
  height: 100%;
}

.cloud {
  position: absolute;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 50px;
  opacity: 0.8;
  animation: drift 30s infinite linear;
}

.cloud::before,
.cloud::after {
  content: '';
  position: absolute;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 50px;
}

.cloud-1 {
  width: 100px;
  height: 40px;
  top: 20%;
  left: -120px;
  animation-duration: 35s;
}

.cloud-1::before {
  width: 70px;
  height: 50px;
  top: -25px;
  left: 15px;
}

.cloud-1::after {
  width: 80px;
  height: 35px;
  top: -15px;
  right: 15px;
}

.cloud-2 {
  width: 80px;
  height: 35px;
  top: 35%;
  left: -100px;
  animation-duration: 40s;
  animation-delay: -10s;
}

.cloud-3 {
  width: 120px;
  height: 45px;
  top: 15%;
  left: -140px;
  animation-duration: 45s;
  animation-delay: -20s;
}

@keyframes drift {
  0% {
    transform: translateX(-100px);
  }
  100% {
    transform: translateX(calc(100vw + 100px));
  }
}

/* 内容区域 */
.pathway-content {
  position: relative;
  z-index: 10;
  padding: 30px;
  background: transparent;
}

/* 标题区域 */
.pathway-header {
  text-align: center;
  margin-bottom: 40px;
  color: white;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.7);
}

.main-title {
  font-size: 48px;
  font-weight: 900;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
}

.main-title i {
  font-size: 52px;
  color: #FFD700;
  filter: drop-shadow(2px 2px 4px rgba(0, 0, 0, 0.5));
}

.subtitle {
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 15px;
  color: #FFD700;
}

.description {
  font-size: 18px;
  opacity: 0.9;
  font-weight: 500;
}

/* 学校推荐展示 */
.target-schools-section {
  margin-bottom: 50px;
}

.section-title {
  color: white;
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 20px;
  text-align: center;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.schools-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 25px;
  max-width: 1200px;
  margin: 0 auto;
}

.school-card {
  background: rgba(0, 0, 0, 0.3);
  border-radius: 20px;
  padding: 25px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(10px);
  position: relative;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.school-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 5px;
  transition: all 0.3s ease;
}

.school-card.dream::before {
  background: linear-gradient(90deg, #FF6B6B, #FF8E53);
}

.school-card.match::before {
  background: linear-gradient(90deg, #4ECDC4, #44A08D);
}

.school-card.safety::before {
  background: linear-gradient(90deg, #45B7D1, #96C93D);
}

.school-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
}

.school-flag {
  position: absolute;
  top: -10px;
  right: 20px;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 18px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.school-flag.dream {
  background: linear-gradient(135deg, #FF6B6B, #FF8E53);
}

.school-flag.match {
  background: linear-gradient(135deg, #4ECDC4, #44A08D);
}

.school-flag.safety {
  background: linear-gradient(135deg, #45B7D1, #96C93D);
}

.school-name {
  font-size: 20px;
  font-weight: 700;
  color: white;
  margin-bottom: 8px;
}

.school-location {
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 15px;
  font-size: 14px;
}

.match-score {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 15px;
}

.score-bar {
  flex: 1;
  height: 8px;
  background: #E0E0E0;
  border-radius: 4px;
  overflow: hidden;
}

.score-fill {
  height: 100%;
  background: linear-gradient(90deg, #4ECDC4, #44A08D);
  border-radius: 4px;
  transition: width 0.5s ease;
}

.score-text {
  font-weight: 600;
  color: white;
  font-size: 14px;
}

.school-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 15px;
}

.tag {
  background: rgba(102, 126, 234, 0.1);
  color: #667eea;
  padding: 4px 12px;
  border-radius: 15px;
  font-size: 12px;
  font-weight: 600;
}

.school-difficulty {
  text-align: center;
  padding: 8px;
  border-radius: 12px;
  font-weight: 600;
  font-size: 14px;
}

.difficulty-label {
  color: white;
}

/* 路径可视化 */
.pathway-visualization {
  margin-bottom: 50px;
  background: transparent;
}

.pathway-chart {
  position: relative;
  height: 500px;
  background: transparent;
  border-radius: 20px;
  overflow: hidden;
}

.echarts-container {
  width: 100%;
  height: 100%;
}

.mountain-path-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 10;
}

.milestone {
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  pointer-events: auto;
  cursor: pointer;
  transition: all 0.3s ease;
  z-index: 20;
  animation: fadeInUp 0.6s ease-out forwards;
}

.milestone:hover {
  transform: scale(1.1) translateY(-3px);
  z-index: 25;
}

/* 阶梯式层级样式 */
.milestone.level-1 { animation-delay: 0.1s; }
.milestone.level-2 { animation-delay: 0.2s; }
.milestone.level-3 { animation-delay: 0.3s; }
.milestone.level-4 { animation-delay: 0.4s; }
.milestone.level-5 { animation-delay: 0.5s; }

/* 节点进入动画 */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* SVG路径样式 */
.milestone-path {
  position: absolute;
  overflow: visible;
}

.animated-path {
  stroke-dashoffset: 100;
  animation: drawPath 1s ease-out forwards;
}

@keyframes drawPath {
  to {
    stroke-dashoffset: 0;
  }
}

.milestone-icon {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: white;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
  transition: all 0.3s ease;
}

.milestone.base-camp .milestone-icon {
  background: linear-gradient(135deg, #667eea, #764ba2);
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
}

.milestone.completed .milestone-icon {
  background: linear-gradient(135deg, #28a745, #20c997);
  box-shadow: 0 4px 15px rgba(40, 167, 69, 0.4);
}

.milestone.in-progress .milestone-icon {
  background: linear-gradient(135deg, #FFD700, #FFA500);
  animation: pulse-glow 2s infinite;
  box-shadow: 0 4px 15px rgba(255, 215, 0, 0.5);
}

.milestone.pending .milestone-icon {
  background: linear-gradient(135deg, #95A5A6, #BDC3C7);
  opacity: 0.8;
}

.milestone.summit .milestone-icon,
.university-silhouette {
  background: linear-gradient(135deg, #FF6B35, #F7931E);
  width: 80px;
  height: 80px;
  font-size: 32px;
}

@keyframes pulse-glow {
  0%, 100% {
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3), 0 0 0 0 rgba(255, 215, 0, 0.4);
  }
  50% {
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3), 0 0 0 20px rgba(255, 215, 0, 0);
  }
}

.milestone-info {
  text-align: center;
  color: white;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.9);
  background: rgba(0, 0, 0, 0.4);
  padding: 8px 12px;
  border-radius: 12px;
  backdrop-filter: blur(5px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.milestone-info h5 {
  font-size: 14px;
  font-weight: 700;
  margin-bottom: 4px;
}

.milestone-info p {
  font-size: 12px;
  opacity: 0.9;
}

.deadline {
  font-size: 11px;
  color: #FFD700;
  font-weight: 600;
}

.progress-indicator {
  width: 40px;
  height: 6px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 3px;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  background: linear-gradient(90deg, #4ECDC4, #44A08D);
  border-radius: 3px;
  transition: width 0.5s ease;
}

/* 详细时间线 */
.detailed-timeline {
  margin-bottom: 50px;
}

.timeline-container {
  position: relative;
  max-width: 800px;
  margin: 0 auto;
  background: rgba(0, 0, 0, 0.4);
  border-radius: 20px;
  padding: 30px;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.timeline-line {
  position: absolute;
  left: 30px;
  top: 80px;
  bottom: 80px;
  width: 4px;
  background: linear-gradient(180deg, #4ECDC4, #44A08D);
  border-radius: 2px;
}

.timeline-phase {
  position: relative;
  margin-bottom: 40px;
  padding-left: 80px;
}

.phase-marker {
  position: absolute;
  left: 13px;
  top: 0;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  color: white;
  z-index: 5;
}

.timeline-phase.active .phase-marker {
  background: linear-gradient(135deg, #4ECDC4, #44A08D);
  box-shadow: 0 4px 12px rgba(78, 205, 196, 0.4);
}

.timeline-phase.upcoming .phase-marker {
  background: linear-gradient(135deg, #95A5A6, #BDC3C7);
}

.phase-content h4 {
  font-size: 20px;
  font-weight: 700;
  color: white;
  margin-bottom: 10px;
}

.phase-description {
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 20px;
  line-height: 1.6;
}

.phase-tasks {
  display: grid;
  gap: 10px;
}

.task-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px;
  background: #F8F9FA;
  border-radius: 8px;
  font-size: 14px;
  transition: all 0.3s ease;
}

.task-item:hover {
  background: #E9ECEF;
}

.task-item.completed {
  color: #28a745;
  background: rgba(40, 167, 69, 0.1);
}

.task-item i {
  color: #28a745;
  font-size: 16px;
}

.task-deadline {
  margin-left: auto;
  font-size: 12px;
  color: #666;
  font-weight: 600;
}

/* 家长展示面板 */
.parent-dashboard {
  margin-bottom: 30px;
}

.roi-analysis {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 25px;
  max-width: 800px;
  margin: 0 auto;
}

.stat-card {
  background: rgba(0, 0, 0, 0.4);
  border-radius: 20px;
  padding: 30px;
  text-align: center;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.stat-card h4 {
  color: white;
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 15px;
}

.large-stat {
  font-size: 36px;
  font-weight: 900;
  color: #4ECDC4;
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.1);
}

/* 分享面板 */
.share-panel {
  position: fixed;
  bottom: 30px;
  right: 30px;
  z-index: 100;
}

.share-btn {
  background: linear-gradient(135deg, #FF6B35, #F7931E);
  color: white;
  border: none;
  padding: 15px 25px;
  border-radius: 30px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 8px 20px rgba(255, 107, 53, 0.4);
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 10px;
}

.share-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 25px rgba(255, 107, 53, 0.5);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .main-title {
    font-size: 32px;
  }
  
  .subtitle {
    font-size: 18px;
  }
  
  .schools-grid {
    grid-template-columns: 1fr;
    gap: 15px;
  }
  
  .pathway-chart {
    height: 300px;
  }
  
  .timeline-container {
    padding: 20px;
  }
  
  .phase-content h4 {
    font-size: 18px;
  }
  
  .roi-analysis {
    grid-template-columns: 1fr;
    gap: 15px;
  }
}

@media (max-width: 480px) {
  .pathway-content {
    padding: 20px;
  }
  
  .main-title {
    font-size: 28px;
    flex-direction: column;
    gap: 10px;
  }
  
  .milestone-icon {
    width: 50px;
    height: 50px;
    font-size: 20px;
  }
  
  .university-silhouette {
    width: 60px;
    height: 60px;
    font-size: 24px;
  }
}
</style>
