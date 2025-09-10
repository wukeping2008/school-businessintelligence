<template>
  <div class="page active">
    <div class="page-header">
      <h1>{{ t('guidance.title') }}</h1>
      <p>{{ t('guidance.subtitle') }}</p>
    </div>
    
    <div class="guidance-container">
      <div class="student-selector">
        <label>{{ t('guidance.selectStudent') }}</label>
        <select v-model="selectedStudent" @change="loadGuidanceData">
          <option v-for="student in getStudentOptions()" :key="student.value" :value="student.value">
            {{ student.label }}
          </option>
        </select>
      </div>
      
      <div class="guidance-grid">
        <div class="pathway-visualization">
          <RealMountainPathwayView 
            :student-data="currentStudentData" 
            :selected-student="selectedStudent"
            :show-parent-view="false"
          />
        </div>
        
        <div class="progress-dashboard">
          <h3>{{ t('guidance.progressDashboard') }}</h3>
          <div class="progress-items">
            <div 
              v-for="(item, index) in getLocalizedProgressData(selectedStudent)" 
              :key="index"
              class="progress-item"
            >
              <div class="progress-label">{{ item.label }}</div>
              <div class="progress-value">{{ item.value }}</div>
            </div>
          </div>
        </div>
        
        <div class="milestone-tracker">
          <h3>{{ t('guidance.milestoneTracker') }}</h3>
          <div class="milestones">
            <div 
              v-for="(milestone, index) in getLocalizedMilestonesData(selectedStudent)" 
              :key="index"
              class="milestone-item"
            >
              <div class="milestone-status" :class="milestone.status">
                <i :class="getStatusIcon(milestone.status)"></i>
              </div>
              <div class="milestone-content">
                <div class="milestone-title">{{ milestone.title }}</div>
                <div class="milestone-date">{{ milestone.date }}</div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="resource-recommendations">
          <h3>{{ t('guidance.resourceRecommendations') }}</h3>
          <div class="resources">
            <div 
              v-for="(resource, index) in getLocalizedResourcesData(selectedStudent)" 
              :key="index"
              class="resource-item"
            >
              <div class="resource-title">{{ resource.title }}</div>
              <div class="resource-description">{{ resource.description }}</div>
              <div class="resource-type">{{ resource.type }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, nextTick, watch } from 'vue'
import { useI18nStore } from '../stores/i18n'
import * as echarts from 'echarts'
import RealMountainPathwayView from '../components/RealMountainPathwayView.vue'

const i18nStore = useI18nStore()

// 翻译函数
const t = (key: string): string => {
  return i18nStore.t(key)
}

// 选中的学生
const selectedStudent = ref('张小明')

// 图表引用
const pathwayChartRef = ref<HTMLElement>()

// 获取本地化的进度数据
const getLocalizedProgressData = (studentKey: string) => {
  const isEnglish = i18nStore.currentLanguage === 'en'
  const originalData = studentsData[studentKey as keyof typeof studentsData].progress
  
  if (!isEnglish) {
    return originalData
  }
  
  const translations: { [key: string]: string } = {
    '学术准备': 'Academic Preparation',
    '语言能力': 'Language Skills',
    '课外活动': 'Extracurricular Activities',
    '申请材料': 'Application Materials'
  }
  
  return originalData.map(item => ({
    ...item,
    label: translations[item.label] || item.label
  }))
}

// 获取本地化的里程碑数据
const getLocalizedMilestonesData = (studentKey: string) => {
  const isEnglish = i18nStore.currentLanguage === 'en'
  const originalData = studentsData[studentKey as keyof typeof studentsData].milestones
  
  if (!isEnglish) {
    return originalData
  }
  
  const translations: { [key: string]: { [key: string]: string } } = {
    '张小明': {
      '完成标准化考试': 'Complete Standardized Tests',
      '准备申请文书': 'Prepare Application Essays',
      '提交申请材料': 'Submit Application Materials',
      '面试准备': 'Interview Preparation',
      '2024年12月': 'December 2024',
      '2025年1月': 'January 2025',
      '2025年3月': 'March 2025',
      '2025年4月': 'April 2025'
    },
    '李小红': {
      '完成语言考试': 'Complete Language Tests',
      '参加文学竞赛': 'Participate in Literature Contest',
      '准备作品集': 'Prepare Portfolio',
      '申请文科院校': 'Apply to Liberal Arts Schools',
      '2024年11月': 'November 2024',
      '2024年12月': 'December 2024',
      '2025年2月': 'February 2025',
      '2025年3月': 'March 2025'
    },
    '王小华': {
      '体育特长认证': 'Sports Talent Certification',
      '艺术作品展示': 'Art Portfolio Showcase',
      '社会实践项目': 'Community Service Project',
      '综合素质评估': 'Comprehensive Quality Assessment',
      '2024年10月': 'October 2024',
      '2024年12月': 'December 2024',
      '2025年1月': 'January 2025',
      '2025年4月': 'April 2025'
    }
  }
  
  const studentTranslations = translations[studentKey] || {}
  
  return originalData.map(item => ({
    ...item,
    title: studentTranslations[item.title] || item.title,
    date: studentTranslations[item.date] || item.date
  }))
}

// 获取本地化的资源数据
const getLocalizedResourcesData = (studentKey: string) => {
  const isEnglish = i18nStore.currentLanguage === 'en'
  const originalData = studentsData[studentKey as keyof typeof studentsData].resources
  
  if (!isEnglish) {
    return originalData
  }
  
  const translations: { [key: string]: { [key: string]: string } } = {
    '张小明': {
      '数学竞赛培训': 'Math Competition Training',
      '针对数学特长，推荐参加AMC数学竞赛培训': 'Recommended AMC math competition training for math talents',
      '学术提升': 'Academic Enhancement',
      '科学研究项目': 'Science Research Project',
      '参与学校科学研究项目，提升研究能力': 'Participate in school science research projects to improve research skills',
      '实践经验': 'Practical Experience',
      '英语写作课程': 'English Writing Course',
      '加强英语写作能力，为申请文书做准备': 'Strengthen English writing skills for application essays',
      '语言提升': 'Language Enhancement'
    },
    '李小红': {
      '创意写作工坊': 'Creative Writing Workshop',
      '提升创意写作能力，为文学专业申请做准备': 'Improve creative writing skills for literature major applications',
      '专业发展': 'Professional Development',
      '辩论社团': 'Debate Club',
      '参与辩论活动，提升逻辑思维和表达能力': 'Participate in debate activities to improve logical thinking and expression',
      '能力提升': 'Skill Enhancement',
      '文学作品集': 'Literature Portfolio',
      '整理个人文学作品，准备申请作品集': 'Organize personal literary works for application portfolio',
      '申请准备': 'Application Preparation'
    },
    '王小华': {
      '体育特长培训': 'Sports Talent Training',
      '继续发展体育特长，争取体育奖学金': 'Continue developing sports talents for athletic scholarships',
      '特长发展': 'Talent Development',
      '艺术创作指导': 'Art Creation Guidance',
      '提升艺术创作水平，准备艺术类申请': 'Improve artistic creation level for art applications',
      '艺术发展': 'Artistic Development',
      '领导力培养': 'Leadership Development',
      '参与学生会工作，培养领导力和组织能力': 'Participate in student council to develop leadership and organizational skills',
      '能力提升': 'Skill Enhancement'
    }
  }
  
  const studentTranslations = translations[studentKey] || {}
  
  return originalData.map(item => ({
    ...item,
    title: studentTranslations[item.title] || item.title,
    description: studentTranslations[item.description] || item.description,
    type: studentTranslations[item.type] || item.type
  }))
}

// 学生数据
const studentsData = reactive({
  '张小明': {
    progress: [
      { label: '学术准备', value: '85%' },
      { label: '语言能力', value: '78%' },
      { label: '课外活动', value: '92%' },
      { label: '申请材料', value: '65%' }
    ],
    milestones: [
      { title: '完成标准化考试', date: '2024年12月', status: 'completed' },
      { title: '准备申请文书', date: '2025年1月', status: 'in-progress' },
      { title: '提交申请材料', date: '2025年3月', status: 'pending' },
      { title: '面试准备', date: '2025年4月', status: 'pending' }
    ],
    resources: [
      {
        title: '数学竞赛培训',
        description: '针对数学特长，推荐参加AMC数学竞赛培训',
        type: '学术提升'
      },
      {
        title: '科学研究项目',
        description: '参与学校科学研究项目，提升研究能力',
        type: '实践经验'
      },
      {
        title: '英语写作课程',
        description: '加强英语写作能力，为申请文书做准备',
        type: '语言提升'
      }
    ],
    pathwayData: {
      nodes: [
        { name: '高中10年级', x: 100, y: 300, symbolSize: 100, itemStyle: { color: '#667eea' } },
        { name: '学术强化', x: 250, y: 200, symbolSize: 90, itemStyle: { color: '#28a745' } },
        { name: '语言考试', x: 250, y: 400, symbolSize: 90, itemStyle: { color: '#ffc107' } },
        { name: '科学竞赛', x: 400, y: 150, symbolSize: 90, itemStyle: { color: '#17a2b8' } },
        { name: '申请文书', x: 400, y: 350, symbolSize: 90, itemStyle: { color: '#ff6b35' } },
        { name: '理工院校', x: 550, y: 300, symbolSize: 100, itemStyle: { color: '#e74c3c' } }
      ],
      links: [
        { source: 0, target: 1 },
        { source: 0, target: 2 },
        { source: 1, target: 3 },
        { source: 2, target: 4 },
        { source: 3, target: 5 },
        { source: 4, target: 5 }
      ]
    }
  },
  '李小红': {
    progress: [
      { label: '学术准备', value: '88%' },
      { label: '语言能力', value: '95%' },
      { label: '课外活动', value: '82%' },
      { label: '申请材料', value: '70%' }
    ],
    milestones: [
      { title: '完成语言考试', date: '2024年11月', status: 'completed' },
      { title: '参加文学竞赛', date: '2024年12月', status: 'completed' },
      { title: '准备作品集', date: '2025年2月', status: 'in-progress' },
      { title: '申请文科院校', date: '2025年3月', status: 'pending' }
    ],
    resources: [
      {
        title: '创意写作工坊',
        description: '提升创意写作能力，为文学专业申请做准备',
        type: '专业发展'
      },
      {
        title: '辩论社团',
        description: '参与辩论活动，提升逻辑思维和表达能力',
        type: '能力提升'
      },
      {
        title: '文学作品集',
        description: '整理个人文学作品，准备申请作品集',
        type: '申请准备'
      }
    ],
    pathwayData: {
      nodes: [
        { name: '高中11年级', x: 100, y: 300, symbolSize: 100, itemStyle: { color: '#667eea' } },
        { name: '语言优势', x: 250, y: 200, symbolSize: 90, itemStyle: { color: '#28a745' } },
        { name: '创意写作', x: 250, y: 400, symbolSize: 90, itemStyle: { color: '#ffc107' } },
        { name: '文学竞赛', x: 400, y: 150, symbolSize: 90, itemStyle: { color: '#17a2b8' } },
        { name: '申请文书', x: 400, y: 350, symbolSize: 90, itemStyle: { color: '#ff6b35' } },
        { name: '文科院校', x: 550, y: 300, symbolSize: 100, itemStyle: { color: '#e74c3c' } }
      ],
      links: [
        { source: 0, target: 1 },
        { source: 0, target: 2 },
        { source: 1, target: 3 },
        { source: 2, target: 4 },
        { source: 3, target: 5 },
        { source: 4, target: 5 }
      ]
    }
  },
  '王小华': {
    progress: [
      { label: '学术准备', value: '82%' },
      { label: '语言能力', value: '85%' },
      { label: '课外活动', value: '96%' },
      { label: '申请材料', value: '60%' }
    ],
    milestones: [
      { title: '体育特长认证', date: '2024年10月', status: 'completed' },
      { title: '艺术作品展示', date: '2024年12月', status: 'completed' },
      { title: '社会实践项目', date: '2025年1月', status: 'in-progress' },
      { title: '综合素质评估', date: '2025年4月', status: 'pending' }
    ],
    resources: [
      {
        title: '体育特长培训',
        description: '继续发展体育特长，争取体育奖学金',
        type: '特长发展'
      },
      {
        title: '艺术创作指导',
        description: '提升艺术创作水平，准备艺术类申请',
        type: '艺术发展'
      },
      {
        title: '领导力培养',
        description: '参与学生会工作，培养领导力和组织能力',
        type: '能力提升'
      }
    ],
    pathwayData: {
      nodes: [
        { name: '高中11年级', x: 100, y: 300, symbolSize: 100, itemStyle: { color: '#667eea' } },
        { name: '体育特长', x: 250, y: 150, symbolSize: 90, itemStyle: { color: '#28a745' } },
        { name: '艺术才能', x: 250, y: 300, symbolSize: 90, itemStyle: { color: '#ffc107' } },
        { name: '领导经验', x: 250, y: 450, symbolSize: 90, itemStyle: { color: '#17a2b8' } },
        { name: '综合发展', x: 400, y: 300, symbolSize: 90, itemStyle: { color: '#ff6b35' } },
        { name: '综合院校', x: 550, y: 300, symbolSize: 100, itemStyle: { color: '#e74c3c' } }
      ],
      links: [
        { source: 0, target: 1 },
        { source: 0, target: 2 },
        { source: 0, target: 3 },
        { source: 1, target: 4 },
        { source: 2, target: 4 },
        { source: 3, target: 4 },
        { source: 4, target: 5 }
      ]
    }
  }
})

// 获取学生选项
const getStudentOptions = () => {
  const isEnglish = i18nStore.currentLanguage === 'en'
  
  if (isEnglish) {
    return [
      { value: '张小明', label: 'Zhang Xiaoming' },
      { value: '李小红', label: 'Li Xiaohong' },
      { value: '王小华', label: 'Wang Xiaohua' }
    ]
  } else {
    return [
      { value: '张小明', label: '张小明' },
      { value: '李小红', label: '李小红' },
      { value: '王小华', label: '王小华' }
    ]
  }
}

// 获取本地化的路径数据
const getLocalizedPathwayData = () => {
  const isEnglish = i18nStore.currentLanguage === 'en'
  const nodes = currentStudentData.value.pathwayData.nodes
  
  if (!isEnglish) {
    return nodes
  }
  
  // 英文版本的节点翻译
  const translations: { [key: string]: { [key: string]: string } } = {
    '张小明': {
      '高中10年级': 'Grade 10',
      '学术强化': 'Academic',
      '语言考试': 'Language',
      '科学竞赛': 'Science',
      '申请文书': 'Essays',
      '理工院校': 'STEM Schools'
    },
    '李小红': {
      '高中11年级': 'Grade 11',
      '语言优势': 'Language',
      '创意写作': 'Writing',
      '文学竞赛': 'Literature',
      '申请文书': 'Essays',
      '文科院校': 'Liberal Arts'
    },
    '王小华': {
      '高中11年级': 'Grade 11',
      '体育特长': 'Sports',
      '艺术才能': 'Arts',
      '领导经验': 'Leadership',
      '综合发展': 'Comprehensive',
      '综合院校': 'Universities'
    }
  }
  
  const studentTranslations = translations[selectedStudent.value] || {}
  
  return nodes.map(node => ({
    ...node,
    name: studentTranslations[node.name] || node.name
  }))
}

// 当前学生数据
const currentStudentData = computed(() => {
  return studentsData[selectedStudent.value as keyof typeof studentsData]
})

// 获取状态图标
const getStatusIcon = (status: string): string => {
  switch (status) {
    case 'completed':
      return 'fas fa-check-circle'
    case 'in-progress':
      return 'fas fa-play-circle'
    case 'pending':
      return 'far fa-circle'
    default:
      return 'far fa-circle'
  }
}

// 初始化升学路径图
const initPathwayChart = () => {
  if (!pathwayChartRef.value) return
  
  const chart = echarts.init(pathwayChartRef.value)
  const isEnglish = i18nStore.currentLanguage === 'en'
  
  const option = {
    title: {
      text: isEnglish ? 'Academic Pathway Planning' : '升学路径规划图',
      left: 'center',
      textStyle: {
        fontSize: 18,
        fontWeight: 'bold'
      }
    },
    tooltip: {
      trigger: 'item',
      formatter: '{b}'
    },
    series: [{
      type: 'graph',
      layout: 'none',
      symbolSize: 80, // 增大圆圈尺寸
      roam: true,
      label: {
        show: true,
        position: 'inside',
        fontSize: 10, // 减小字体大小
        fontWeight: 'bold',
        color: '#fff',
        lineHeight: 12, // 设置行高
        rich: {
          // 定义富文本样式
          normal: {
            fontSize: 10,
            lineHeight: 12
          }
        }
      },
      edgeSymbol: ['circle', 'arrow'],
      edgeSymbolSize: [4, 10],
      data: getLocalizedPathwayData(),
      links: currentStudentData.value.pathwayData.links,
      lineStyle: {
        opacity: 0.9,
        width: 2,
        curveness: 0.3,
        color: '#667eea'
      },
      emphasis: {
        focus: 'adjacency',
        lineStyle: {
          width: 4
        }
      }
    }]
  }
  
  chart.setOption(option)
  
  // 响应式调整
  window.addEventListener('resize', () => {
    chart.resize()
  })
}

// 加载升学指导数据
const loadGuidanceData = () => {
  nextTick(() => {
    initPathwayChart()
  })
}

// 监听学生选择变化
watch(selectedStudent, () => {
  loadGuidanceData()
})

// 监听语言变化
watch(() => i18nStore.currentLanguage, () => {
  loadGuidanceData()
})

onMounted(() => {
  nextTick(() => {
    loadGuidanceData()
  })
})
</script>

<style scoped>
.guidance-container {
  max-width: 1200px;
  margin: 0 auto;
}

.student-selector {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 15px;
  padding: 20px;
  margin-bottom: 30px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.student-selector label {
  margin-right: 15px;
  font-weight: 600;
  color: #333;
}

.student-selector select {
  padding: 10px 15px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 16px;
  background: white;
  cursor: pointer;
}

.guidance-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 30px;
}

.pathway-visualization {
  grid-row: 1 / 3;
  padding: 0;
  background: transparent;
  border-radius: 0;
  box-shadow: none;
  min-height: 600px;
}

.info-panels {
  grid-column: 2;
  display: grid;
  grid-template-rows: auto auto auto;
  gap: 20px;
}

.progress-dashboard,
.milestone-tracker,
.resource-recommendations {
  background: rgba(255, 255, 255, 0.98);
  border-radius: 12px;
  padding: 18px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.pathway-visualization h3,
.progress-dashboard h3,
.milestone-tracker h3,
.resource-recommendations h3 {
  margin-bottom: 16px;
  color: #2c3e50;
  font-size: 15px;
  text-align: left;
  font-weight: 600;
  padding-bottom: 10px;
  border-bottom: 2px solid #f0f0f0;
}

.progress-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #f5f5f5;
  transition: all 0.3s ease;
}

.progress-item:hover {
  padding-left: 8px;
  background: linear-gradient(to right, rgba(102, 126, 234, 0.05), transparent);
}

.progress-item:last-child {
  border-bottom: none;
}

.progress-label {
  font-weight: 500;
  color: #4a5568;
  font-size: 14px;
}

.progress-value {
  color: #667eea;
  font-weight: 600;
  font-size: 15px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.milestone-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 0;
  border-bottom: 1px solid #f5f5f5;
  transition: all 0.3s ease;
}

.milestone-item:hover {
  padding-left: 8px;
  background: linear-gradient(to right, rgba(102, 126, 234, 0.05), transparent);
}

.milestone-item:last-child {
  border-bottom: none;
}

.milestone-status {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  color: white;
  flex-shrink: 0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.milestone-status.completed {
  background: #28a745;
}

.milestone-status.in-progress {
  background: #ffc107;
}

.milestone-status.pending {
  background: #6c757d;
}

.milestone-content {
  flex: 1;
}

.milestone-title {
  font-weight: 500;
  color: #2c3e50;
  margin-bottom: 3px;
  font-size: 14px;
}

.milestone-date {
  color: #718096;
  font-size: 12px;
}

.resource-item {
  padding: 14px;
  background: linear-gradient(to right, #f8f9fa, #ffffff);
  border-radius: 8px;
  margin-bottom: 12px;
  border-left: 3px solid #667eea;
  transition: all 0.3s ease;
}

.resource-item:hover {
  transform: translateX(4px);
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.15);
}

.resource-item:last-child {
  margin-bottom: 0;
}

.resource-title {
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 6px;
  font-size: 14px;
}

.resource-description {
  color: #718096;
  font-size: 13px;
  line-height: 1.5;
  margin-bottom: 8px;
}

.resource-type {
  color: #667eea;
  font-size: 11px;
  background: rgba(102, 126, 234, 0.1);
  padding: 3px 8px;
  border-radius: 10px;
  display: inline-block;
  font-weight: 500;
}

@media (max-width: 1200px) {
  .guidance-grid {
    grid-template-columns: 1.5fr 1fr;
    gap: 20px;
  }
  
  .progress-dashboard h3,
  .milestone-tracker h3,
  .resource-recommendations h3 {
    font-size: 14px;
  }
}

@media (max-width: 768px) {
  .guidance-grid {
    grid-template-columns: 1fr;
    gap: 20px;
  }
  
  .pathway-visualization {
    grid-row: auto;
    grid-column: 1;
  }
  
  .milestone-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
    padding: 12px 0;
  }
  
  .milestone-status {
    align-self: flex-start;
  }
}
</style>
