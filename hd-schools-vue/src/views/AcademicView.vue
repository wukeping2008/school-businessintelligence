<template>
  <div class="page active">
    <div class="page-header">
      <h1>{{ t('academic.title') }}</h1>
      <p>{{ t('academic.subtitle') }}</p>
    </div>
    
    <div class="academic-container">
      <div class="student-selector">
        <label>{{ t('academic.selectStudent') }}</label>
        <select v-model="selectedStudent" @change="loadAcademicData">
          <option v-for="student in getStudentOptions()" :key="student.value" :value="student.value">
            {{ student.label }}
          </option>
        </select>
      </div>
      
      <div class="academic-grid">
        <div class="academic-card">
          <h3>{{ t('academic.radarChart') }}</h3>
          <div class="chart-container">
            <div ref="radarChartRef" style="height: 300px;"></div>
          </div>
        </div>
        
        <div class="academic-card">
          <h3>{{ t('academic.trendChart') }}</h3>
          <div class="chart-container">
            <div ref="trendChartRef" style="height: 300px;"></div>
          </div>
        </div>
        
        <div class="academic-card full-width">
          <h3>{{ t('academic.aiReport') }}</h3>
          <div class="ai-report">
            <div class="report-section">
              <h4>{{ getReportSectionTitle('summary') }}</h4>
              <p>{{ currentStudentData.summary }}</p>
            </div>
            <div class="report-section">
              <h4>{{ getReportSectionTitle('strengths') }}</h4>
              <ul>
                <li v-for="strength in currentStudentData.strengths" :key="strength">{{ strength }}</li>
              </ul>
            </div>
            <div class="report-section">
              <h4>{{ getReportSectionTitle('improvements') }}</h4>
              <ul>
                <li v-for="improvement in currentStudentData.improvements" :key="improvement">{{ improvement }}</li>
              </ul>
            </div>
          </div>
        </div>
        
        <div class="academic-card">
          <h3>{{ t('academic.suggestions') }}</h3>
          <div class="suggestions">
            <div 
              v-for="(suggestion, index) in currentStudentData.suggestions" 
              :key="index"
              class="suggestion-item"
            >
              <div class="suggestion-title">{{ suggestion.title }}</div>
              <div class="suggestion-content">{{ suggestion.content }}</div>
            </div>
          </div>
        </div>
        
        <div class="academic-card">
          <h3>{{ t('academic.keyMetrics') }}</h3>
          <div class="key-metrics">
            <div 
              v-for="(metric, index) in currentStudentData.metrics" 
              :key="index"
              class="metric-item"
            >
              <div class="metric-label">{{ metric.label }}</div>
              <div class="metric-value" :class="metric.status">{{ metric.value }}</div>
              <div class="metric-trend">{{ metric.trend }}</div>
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

const i18nStore = useI18nStore()

// 翻译函数
const t = (key: string): string => {
  return i18nStore.t(key)
}

// 选中的学生
const selectedStudent = ref('张小明')

// 图表引用
const radarChartRef = ref<HTMLElement>()
const trendChartRef = ref<HTMLElement>()

// 学生数据
const studentsData = reactive({
  '张小明': {
    summary: '张小明在本学期表现优异，数学和科学方面尤为突出。学习态度积极主动，课堂参与度高，具有很强的逻辑思维能力。建议在语言表达方面加强练习，以实现全面发展。',
    strengths: [
      '数学逻辑思维能力强，解题思路清晰',
      '科学实验操作熟练，观察能力敏锐',
      '学习主动性强，课堂参与度高',
      '团队合作能力良好，乐于助人'
    ],
    improvements: [
      '加强语言表达训练，提升口语和写作能力',
      '增加阅读量，拓宽知识面',
      '培养艺术审美能力，参与更多创意活动',
      '加强体育锻炼，提升身体素质'
    ],
    suggestions: [
      {
        title: '数学强化',
        content: '继续保持数学优势，可以尝试更高难度的数学竞赛题目，培养数学思维的深度和广度。'
      },
      {
        title: '语言提升',
        content: '建议每天进行30分钟的阅读练习，并尝试写作日记，提升语言表达能力。'
      },
      {
        title: '全面发展',
        content: '在保持理科优势的同时，适当增加文科和艺术类课程的学习时间。'
      }
    ],
    metrics: [
      { label: '学习成绩', value: '92分', status: 'excellent', trend: '↗ 上升趋势' },
      { label: '课堂参与', value: '95%', status: 'excellent', trend: '→ 保持稳定' },
      { label: '作业完成', value: '98%', status: 'excellent', trend: '↗ 持续改善' },
      { label: '团队合作', value: '88分', status: 'good', trend: '↗ 逐步提升' }
    ],
    radarData: [
      { subject: '数学', A: 95, fullMark: 100 },
      { subject: '科学', A: 92, fullMark: 100 },
      { subject: '语文', A: 78, fullMark: 100 },
      { subject: '英语', A: 82, fullMark: 100 },
      { subject: '艺术', A: 75, fullMark: 100 },
      { subject: '体育', A: 85, fullMark: 100 }
    ],
    trendData: [85, 87, 89, 88, 92, 94, 92]
  },
  '李小红': {
    summary: '李小红在语言文学方面表现卓越，具有很强的文字表达能力和创意思维。英语水平突出，阅读理解能力强。建议在数理科目方面加强基础训练，培养逻辑思维能力。',
    strengths: [
      '语言文学天赋突出，写作能力强',
      '英语水平优秀，口语表达流利',
      '创意思维活跃，想象力丰富',
      '阅读理解能力强，知识面广'
    ],
    improvements: [
      '加强数学基础训练，提升计算能力',
      '培养科学实验兴趣，提高动手能力',
      '增强逻辑思维训练，提升分析能力',
      '加强体育锻炼，提升身体协调性'
    ],
    suggestions: [
      {
        title: '语言优势',
        content: '继续发挥语言优势，可以尝试参加写作比赛和演讲活动，进一步提升表达能力。'
      },
      {
        title: '数理补强',
        content: '建议制定数学学习计划，每天进行基础练习，逐步提升数理思维能力。'
      },
      {
        title: '综合发展',
        content: '在保持文科优势的同时，适当增加理科学习时间，实现均衡发展。'
      }
    ],
    metrics: [
      { label: '学习成绩', value: '89分', status: 'good', trend: '↗ 稳步上升' },
      { label: '课堂参与', value: '92%', status: 'excellent', trend: '→ 保持优秀' },
      { label: '作业完成', value: '96%', status: 'excellent', trend: '→ 持续稳定' },
      { label: '创新思维', value: '94分', status: 'excellent', trend: '↗ 不断提升' }
    ],
    radarData: [
      { subject: '数学', A: 72, fullMark: 100 },
      { subject: '科学', A: 75, fullMark: 100 },
      { subject: '语文', A: 96, fullMark: 100 },
      { subject: '英语', A: 94, fullMark: 100 },
      { subject: '艺术', A: 91, fullMark: 100 },
      { subject: '体育', A: 78, fullMark: 100 }
    ],
    trendData: [82, 84, 85, 87, 88, 89, 89]
  },
  '王小华': {
    summary: '王小华是一个全面发展的学生，各科成绩均衡，特别在体育和艺术方面表现突出。具有很强的实践能力和创新精神，团队协作能力优秀。建议在学术深度方面进一步提升。',
    strengths: [
      '各科发展均衡，综合素质高',
      '体育运动能力强，身体素质好',
      '艺术创作有天赋，审美能力强',
      '实践动手能力突出，创新意识强'
    ],
    improvements: [
      '提升学术深度，加强专业知识学习',
      '增强理论思维能力，提升抽象思维',
      '加强阅读习惯，扩大知识储备',
      '培养专注力，提高学习效率'
    ],
    suggestions: [
      {
        title: '均衡发展',
        content: '继续保持各科均衡发展的优势，可以选择一到两个特长领域进行深入发展。'
      },
      {
        title: '实践应用',
        content: '发挥实践能力强的优势，多参与科学实验和创新项目，培养创新思维。'
      },
      {
        title: '深度学习',
        content: '在保持广度的同时，选择感兴趣的领域进行深入学习和研究。'
      }
    ],
    metrics: [
      { label: '学习成绩', value: '86分', status: 'good', trend: '↗ 持续进步' },
      { label: '实践能力', value: '96%', status: 'excellent', trend: '→ 保持领先' },
      { label: '团队协作', value: '94%', status: 'excellent', trend: '↗ 不断提升' },
      { label: '创新思维', value: '90分', status: 'excellent', trend: '↗ 稳步提升' }
    ],
    radarData: [
      { subject: '数学', A: 84, fullMark: 100 },
      { subject: '科学', A: 88, fullMark: 100 },
      { subject: '语文', A: 85, fullMark: 100 },
      { subject: '英语', A: 83, fullMark: 100 },
      { subject: '艺术', A: 92, fullMark: 100 },
      { subject: '体育', A: 95, fullMark: 100 }
    ],
    trendData: [80, 81, 83, 84, 85, 86, 86]
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

// 获取本地化的学生数据
const getLocalizedStudentData = (studentKey: string) => {
  const isEnglish = i18nStore.currentLanguage === 'en'
  const originalData = studentsData[studentKey as keyof typeof studentsData]
  
  if (!isEnglish) {
    return originalData
  }
  
  // 英文翻译数据
  const translations: { [key: string]: any } = {
    '张小明': {
      summary: 'Zhang Xiaoming has performed excellently this semester, particularly outstanding in mathematics and science. He has a positive learning attitude, high classroom participation, and strong logical thinking abilities. It is recommended to strengthen language expression practice to achieve comprehensive development.',
      strengths: [
        'Strong mathematical logical thinking ability with clear problem-solving approaches',
        'Proficient in science experiment operations with keen observation skills',
        'Strong learning initiative with high classroom participation',
        'Good teamwork ability and willingness to help others'
      ],
      improvements: [
        'Strengthen language expression training to improve speaking and writing abilities',
        'Increase reading volume to broaden knowledge base',
        'Cultivate artistic aesthetic ability and participate in more creative activities',
        'Strengthen physical exercise to improve physical fitness'
      ],
      suggestions: [
        {
          title: 'Math Enhancement',
          content: 'Continue to maintain mathematical advantages, try more challenging math competition problems to develop depth and breadth of mathematical thinking.'
        },
        {
          title: 'Language Improvement',
          content: 'Recommend 30 minutes of daily reading practice and try writing diaries to improve language expression abilities.'
        },
        {
          title: 'Comprehensive Development',
          content: 'While maintaining science advantages, appropriately increase study time for liberal arts and art courses.'
        }
      ],
      metrics: [
        { label: 'Academic Performance', value: '92 points', status: 'excellent', trend: '↗ Rising trend' },
        { label: 'Class Participation', value: '95%', status: 'excellent', trend: '→ Stable' },
        { label: 'Homework Completion', value: '98%', status: 'excellent', trend: '↗ Continuous improvement' },
        { label: 'Teamwork', value: '88 points', status: 'good', trend: '↗ Gradual improvement' }
      ]
    },
    '李小红': {
      summary: 'Li Xiaohong excels in language and literature with strong written expression and creative thinking abilities. Her English level is outstanding with strong reading comprehension skills. It is recommended to strengthen basic training in mathematics and science subjects to develop logical thinking abilities.',
      strengths: [
        'Outstanding talent in language and literature with strong writing abilities',
        'Excellent English level with fluent oral expression',
        'Active creative thinking with rich imagination',
        'Strong reading comprehension ability with broad knowledge'
      ],
      improvements: [
        'Strengthen mathematics basic training to improve calculation abilities',
        'Cultivate interest in science experiments to improve hands-on abilities',
        'Enhance logical thinking training to improve analytical abilities',
        'Strengthen physical exercise to improve body coordination'
      ],
      suggestions: [
        {
          title: 'Language Advantage',
          content: 'Continue to leverage language advantages, try participating in writing competitions and speech activities to further improve expression abilities.'
        },
        {
          title: 'Math & Science Enhancement',
          content: 'Recommend creating a mathematics study plan with daily basic practice to gradually improve mathematical thinking abilities.'
        },
        {
          title: 'Comprehensive Development',
          content: 'While maintaining liberal arts advantages, appropriately increase science study time to achieve balanced development.'
        }
      ],
      metrics: [
        { label: 'Academic Performance', value: '89 points', status: 'good', trend: '↗ Steady rise' },
        { label: 'Class Participation', value: '92%', status: 'excellent', trend: '→ Maintaining excellence' },
        { label: 'Homework Completion', value: '96%', status: 'excellent', trend: '→ Consistently stable' },
        { label: 'Creative Thinking', value: '94 points', status: 'excellent', trend: '↗ Continuous improvement' }
      ]
    },
    '王小华': {
      summary: 'Wang Xiaohua is a well-rounded student with balanced performance across all subjects, particularly outstanding in sports and arts. He has strong practical abilities and innovative spirit with excellent teamwork skills. It is recommended to further improve academic depth.',
      strengths: [
        'Balanced development across all subjects with high comprehensive quality',
        'Strong athletic abilities with good physical fitness',
        'Talented in artistic creation with strong aesthetic abilities',
        'Outstanding practical hands-on abilities with strong innovation awareness'
      ],
      improvements: [
        'Improve academic depth and strengthen professional knowledge learning',
        'Enhance theoretical thinking abilities and improve abstract thinking',
        'Strengthen reading habits to expand knowledge reserves',
        'Cultivate focus to improve learning efficiency'
      ],
      suggestions: [
        {
          title: 'Balanced Development',
          content: 'Continue to maintain the advantage of balanced development across subjects, choose one or two specialty areas for in-depth development.'
        },
        {
          title: 'Practical Application',
          content: 'Leverage strong practical abilities, participate more in science experiments and innovation projects to cultivate innovative thinking.'
        },
        {
          title: 'Deep Learning',
          content: 'While maintaining breadth, choose areas of interest for in-depth learning and research.'
        }
      ],
      metrics: [
        { label: 'Academic Performance', value: '86 points', status: 'good', trend: '↗ Continuous progress' },
        { label: 'Practical Ability', value: '96%', status: 'excellent', trend: '→ Maintaining lead' },
        { label: 'Team Collaboration', value: '94%', status: 'excellent', trend: '↗ Continuous improvement' },
        { label: 'Creative Thinking', value: '90 points', status: 'excellent', trend: '↗ Steady improvement' }
      ]
    }
  }
  
  const studentTranslations = translations[studentKey]
  if (!studentTranslations) return originalData
  
  return {
    ...originalData,
    summary: studentTranslations.summary,
    strengths: studentTranslations.strengths,
    improvements: studentTranslations.improvements,
    suggestions: studentTranslations.suggestions,
    metrics: studentTranslations.metrics
  }
}

// 获取报告部分标题
const getReportSectionTitle = (section: string): string => {
  const isEnglish = i18nStore.currentLanguage === 'en'
  
  const titles = {
    zh: {
      summary: '学业表现总结',
      strengths: '优势分析',
      improvements: '改进建议'
    },
    en: {
      summary: 'Academic Performance Summary',
      strengths: 'Strengths Analysis',
      improvements: 'Improvement Suggestions'
    }
  }
  
  return titles[isEnglish ? 'en' : 'zh'][section as keyof typeof titles.zh] || section
}

// 获取学科名称
const getSubjectName = (subject: string): string => {
  const isEnglish = i18nStore.currentLanguage === 'en'
  
  const subjectNames = {
    zh: {
      '数学': '数学',
      '科学': '科学',
      '语文': '语文',
      '英语': '英语',
      '艺术': '艺术',
      '体育': '体育'
    },
    en: {
      '数学': 'Math',
      '科学': 'Science',
      '语文': 'Chinese',
      '英语': 'English',
      '艺术': 'Arts',
      '体育': 'PE'
    }
  }
  
  return subjectNames[isEnglish ? 'en' : 'zh'][subject as keyof typeof subjectNames.zh] || subject
}

// 当前学生数据
const currentStudentData = computed(() => {
  return getLocalizedStudentData(selectedStudent.value)
})

// 初始化雷达图
const initRadarChart = () => {
  if (!radarChartRef.value) return
  
  const chart = echarts.init(radarChartRef.value)
  const isEnglish = i18nStore.currentLanguage === 'en'
  
  const option = {
    title: {
      text: isEnglish ? 'Subject Performance Radar Chart' : '学科能力雷达图',
      left: 'center',
      textStyle: {
        fontSize: 16,
        fontWeight: 'bold'
      }
    },
    tooltip: {
      trigger: 'item'
    },
    radar: {
      indicator: currentStudentData.value.radarData.map(item => ({
        name: getSubjectName(item.subject),
        max: item.fullMark
      })),
      center: ['50%', '55%'],
      radius: '70%'
    },
    series: [{
      name: isEnglish ? 'Subject Ability' : '学科能力',
      type: 'radar',
      data: [{
        value: currentStudentData.value.radarData.map(item => item.A),
        name: selectedStudent.value,
        areaStyle: {
          color: 'rgba(102, 126, 234, 0.3)'
        },
        lineStyle: {
          color: '#667eea',
          width: 2
        },
        itemStyle: {
          color: '#667eea'
        }
      }]
    }]
  }
  
  chart.setOption(option)
  
  // 响应式调整
  window.addEventListener('resize', () => {
    chart.resize()
  })
}

// 初始化趋势图
const initTrendChart = () => {
  if (!trendChartRef.value) return
  
  const chart = echarts.init(trendChartRef.value)
  const isEnglish = i18nStore.currentLanguage === 'en'
  
  const option = {
    title: {
      text: isEnglish ? 'Grade Trend Analysis' : '成绩趋势分析',
      left: 'center',
      textStyle: {
        fontSize: 16,
        fontWeight: 'bold'
      }
    },
    tooltip: {
      trigger: 'axis'
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: isEnglish 
        ? ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6', 'Week 7']
        : ['第1周', '第2周', '第3周', '第4周', '第5周', '第6周', '第7周']
    },
    yAxis: {
      type: 'value',
      min: 60,
      max: 100
    },
    series: [{
      name: isEnglish ? 'Grade' : '成绩',
      type: 'line',
      smooth: true,
      data: currentStudentData.value.trendData,
      lineStyle: {
        color: '#667eea',
        width: 3
      },
      itemStyle: {
        color: '#667eea'
      },
      areaStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: 'rgba(102, 126, 234, 0.3)' },
          { offset: 1, color: 'rgba(102, 126, 234, 0.1)' }
        ])
      }
    }]
  }
  
  chart.setOption(option)
  
  // 响应式调整
  window.addEventListener('resize', () => {
    chart.resize()
  })
}

// 加载学业数据
const loadAcademicData = () => {
  nextTick(() => {
    initRadarChart()
    initTrendChart()
  })
}

// 监听学生选择变化
watch(selectedStudent, () => {
  loadAcademicData()
})

// 监听语言变化
watch(() => i18nStore.currentLanguage, () => {
  loadAcademicData()
})

onMounted(() => {
  nextTick(() => {
    loadAcademicData()
  })
})
</script>

<style scoped>
.academic-container {
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

.academic-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 30px;
}

.academic-card {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  padding: 30px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.academic-card.full-width {
  grid-column: 1 / -1;
}

.academic-card h3 {
  margin-bottom: 20px;
  color: #333;
  font-size: 20px;
  text-align: center;
}

.ai-report {
  background: #f8f9fa;
  border-radius: 15px;
  padding: 25px;
  border-left: 5px solid #667eea;
}

.report-section {
  margin-bottom: 25px;
}

.report-section:last-child {
  margin-bottom: 0;
}

.report-section h4 {
  color: #333;
  margin-bottom: 15px;
  font-size: 18px;
}

.report-section p {
  color: #666;
  line-height: 1.6;
  margin-bottom: 15px;
}

.report-section ul {
  list-style: none;
  padding: 0;
}

.report-section li {
  color: #666;
  margin-bottom: 10px;
  padding-left: 20px;
  position: relative;
}

.report-section li::before {
  content: '•';
  color: #667eea;
  font-weight: bold;
  position: absolute;
  left: 0;
}

.suggestions {
  display: grid;
  gap: 15px;
}

.suggestion-item {
  background: #f8f9fa;
  padding: 15px;
  border-radius: 10px;
  border-left: 3px solid #667eea;
}

.suggestion-title {
  font-weight: bold;
  color: #333;
  margin-bottom: 8px;
}

.suggestion-content {
  color: #666;
  line-height: 1.5;
}

.key-metrics {
  display: grid;
  gap: 15px;
}

.metric-item {
  background: #f8f9fa;
  padding: 15px;
  border-radius: 10px;
  border-left: 3px solid #667eea;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
}

.metric-label {
  font-weight: bold;
  color: #333;
}

.metric-value {
  font-weight: bold;
  font-size: 18px;
}

.metric-value.excellent {
  color: #28a745;
}

.metric-value.good {
  color: #17a2b8;
}

.metric-value.average {
  color: #ffc107;
}

.metric-value.poor {
  color: #dc3545;
}

.metric-trend {
  color: #666;
  font-size: 14px;
}

@media (max-width: 768px) {
  .academic-grid {
    grid-template-columns: 1fr;
  }
  
  .metric-item {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
