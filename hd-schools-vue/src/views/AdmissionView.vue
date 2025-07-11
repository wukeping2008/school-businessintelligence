<template>
  <div class="page active">
    <div class="page-header">
      <h1>{{ t('admission.title') }}</h1>
      <p>{{ t('admission.subtitle') }}</p>
    </div>
    
    <div class="admission-container">
      <div class="questionnaire-section" v-if="!showReport">
        <div class="progress-bar">
          <div class="progress-fill" :style="{ width: progressPercentage + '%' }"></div>
          <span class="progress-text">{{ t('admission.progress.step') }} {{ currentStep + 1 }}/{{ questions.length }}</span>
        </div>
        
        <div class="question-container">
          <div class="question" v-if="currentQuestion">
            <h3>{{ getQuestionTitle(currentStep) }}</h3>
            <p>{{ getQuestionDescription(currentStep) }}</p>
            
            <div v-if="currentQuestion.type === 'multiple'" class="question-options">
              <div 
                v-for="(option, index) in getQuestionOptions(currentStep)" 
                :key="index"
                class="option"
                :class="{ selected: answers[currentStep] === option }"
                @click="selectOption(option)"
              >
                <input 
                  type="radio" 
                  :name="`question-${currentStep}`"
                  :value="option"
                  v-model="answers[currentStep]"
                />
                {{ option }}
              </div>
            </div>
            
            <div v-else-if="currentQuestion.type === 'text'">
              <input 
                type="text" 
                class="text-input"
                v-model="answers[currentStep]"
                :placeholder="getQuestionPlaceholder(currentStep)"
              />
            </div>
          </div>
        </div>
        
        <div class="navigation-buttons">
          <button 
            class="btn btn-secondary" 
            @click="previousQuestion" 
            :disabled="currentStep === 0"
          >
            {{ t('common.previous') }}
          </button>
          <button 
            class="btn btn-primary" 
            @click="nextQuestion"
            :disabled="!answers[currentStep]"
          >
            {{ currentStep === questions.length - 1 ? t('admission.generate') : t('common.next') }}
          </button>
        </div>
      </div>
      
      <div class="report-section" v-if="showReport">
        <div class="report-header">
          <h2>{{ t('admission.report.title') }}</h2>
          <div class="student-info">
            {{ t('admission.report.student') }}: {{ answers[0] || t('common.student') }}
          </div>
        </div>
        
        <div class="report-content">
          <div class="report-card">
            <h3><i class="fas fa-book"></i> {{ t('admission.report.recommendations') }}</h3>
            <div class="recommendations">
              <div v-for="(rec, index) in getRecommendations().courses" :key="index" class="recommendation-item">
                <strong>{{ rec.subject }}</strong>: {{ rec.description }}
              </div>
            </div>
          </div>
          
          <div class="report-card">
            <h3><i class="fas fa-calendar-alt"></i> {{ t('admission.report.timeline') }}</h3>
            <div class="timeline-planning">
              <div v-for="(item, index) in getRecommendations().timeline" :key="index" class="timeline-item">
                <div class="timeline-date">{{ item.period }}</div>
                <div class="timeline-content">{{ item.activity }}</div>
              </div>
            </div>
          </div>
          
          <div class="report-card">
            <h3><i class="fas fa-bullseye"></i> {{ t('admission.report.expectations') }}</h3>
            <div class="expectations">
              <div v-for="(exp, index) in getRecommendations().expectations" :key="index" class="expectation-item">
                {{ exp }}
              </div>
            </div>
          </div>
          
          <div class="report-card">
            <h3><i class="fas fa-tasks"></i> {{ t('admission.report.milestones') }}</h3>
            <div class="milestones">
              <div v-for="(milestone, index) in getRecommendations().milestones" :key="index" class="milestone-item">
                <div class="milestone-date">{{ milestone.date }}</div>
                <div class="milestone-task">{{ milestone.task }}</div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="report-actions">
          <button class="btn btn-secondary" @click="restartQuestionnaire">
            {{ t('admission.restart') }}
          </button>
          <button class="btn btn-primary" @click="downloadReport">
            {{ t('admission.download') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue'
import { useI18nStore } from '../stores/i18n'

const i18nStore = useI18nStore()

// 翻译函数
const t = (key: string): string => {
  return i18nStore.t(key)
}

// 问卷状态
const currentStep = ref(0)
const answers = reactive<Record<number, string>>({})
const showReport = ref(false)

// 问题数据结构
const questions = ref([
  { type: 'text' },
  { type: 'multiple' },
  { type: 'multiple' },
  { type: 'multiple' },
  { type: 'multiple' }
])

// 当前问题
const currentQuestion = computed(() => {
  return questions.value[currentStep.value]
})

// 进度百分比
const progressPercentage = computed(() => {
  return ((currentStep.value + 1) / questions.value.length) * 100
})

// 获取问题标题
const getQuestionTitle = (step: number): string => {
  const titles = {
    zh: [
      '请输入学生姓名',
      '学生目前的年级是？',
      '学生最感兴趣的学科领域是？',
      '学生的学习目标是什么？',
      '希望重点关注哪个方面的发展？'
    ],
    en: [
      'Please enter student name',
      'What is the student\'s current grade level?',
      'What subject area is the student most interested in?',
      'What are the student\'s learning goals?',
      'Which aspect of development would you like to focus on?'
    ]
  }
  return titles[i18nStore.currentLanguage][step] || ''
}

// 获取问题描述
const getQuestionDescription = (step: number): string => {
  const descriptions = {
    zh: [
      '我们将为您生成个性化的学业规划报告',
      '了解学生当前的学习阶段',
      '帮助我们了解学生的兴趣方向',
      '明确学习目标有助于制定合适的规划',
      '我们将根据您的选择提供针对性建议'
    ],
    en: [
      'We will generate a personalized academic planning report for you',
      'Understanding the student\'s current learning stage',
      'Help us understand the student\'s interests',
      'Clear learning goals help develop appropriate plans',
      'We will provide targeted suggestions based on your choices'
    ]
  }
  return descriptions[i18nStore.currentLanguage][step] || ''
}

// 获取问题选项
const getQuestionOptions = (step: number): string[] => {
  const options = {
    zh: [
      [],
      ['小学1-3年级', '小学4-6年级', '初中7-9年级', '高中10-12年级'],
      ['数学与科学', '语言文学', '艺术创作', '体育运动', '社会科学'],
      ['提高学术成绩', '培养特长技能', '准备升学考试', '全面发展', '兴趣探索'],
      ['学术能力提升', '创新思维培养', '领导力发展', '国际视野拓展', '实践能力锻炼']
    ],
    en: [
      [],
      ['Elementary 1-3', 'Elementary 4-6', 'Middle School 7-9', 'High School 10-12'],
      ['Math & Science', 'Language & Literature', 'Arts & Creativity', 'Sports & Athletics', 'Social Sciences'],
      ['Improve Academic Performance', 'Develop Special Skills', 'Prepare for Entrance Exams', 'Comprehensive Development', 'Interest Exploration'],
      ['Academic Ability Enhancement', 'Creative Thinking Development', 'Leadership Development', 'International Perspective', 'Practical Skills Training']
    ]
  }
  return options[i18nStore.currentLanguage][step] || []
}

// 获取问题占位符
const getQuestionPlaceholder = (step: number): string => {
  const placeholders = {
    zh: ['请输入学生姓名', '', '', '', ''],
    en: ['Please enter student name', '', '', '', '']
  }
  return placeholders[i18nStore.currentLanguage][step] || ''
}

// 获取推荐内容
const getRecommendations = () => {
  const recommendations = {
    zh: {
      courses: [
        { subject: '数学强化', description: '基于学生兴趣，建议加强数学逻辑思维训练' },
        { subject: '科学探索', description: '培养实验能力和科学思维方法' },
        { subject: '语言表达', description: '提升中英文表达和沟通能力' }
      ],
      timeline: [
        { period: '第1学期', activity: '基础能力评估与强化训练' },
        { period: '第2学期', activity: '专项技能培养与实践应用' },
        { period: '第3学期', activity: '综合能力提升与成果展示' }
      ],
      expectations: [
        '学术成绩稳步提升，各科目均衡发展',
        '培养独立思考和解决问题的能力',
        '建立良好的学习习惯和时间管理能力'
      ],
      milestones: [
        { date: '3个月后', task: '完成基础能力评估' },
        { date: '6个月后', task: '达成第一阶段学习目标' },
        { date: '1年后', task: '实现综合能力显著提升' }
      ]
    },
    en: {
      courses: [
        { subject: 'Math Enhancement', description: 'Based on student interests, recommend strengthening mathematical logical thinking training' },
        { subject: 'Science Exploration', description: 'Develop experimental skills and scientific thinking methods' },
        { subject: 'Language Expression', description: 'Improve Chinese and English expression and communication skills' }
      ],
      timeline: [
        { period: 'Semester 1', activity: 'Basic ability assessment and strengthening training' },
        { period: 'Semester 2', activity: 'Specialized skill development and practical application' },
        { period: 'Semester 3', activity: 'Comprehensive ability improvement and achievement demonstration' }
      ],
      expectations: [
        'Steady improvement in academic performance with balanced development across subjects',
        'Develop independent thinking and problem-solving abilities',
        'Establish good study habits and time management skills'
      ],
      milestones: [
        { date: 'After 3 months', task: 'Complete basic ability assessment' },
        { date: 'After 6 months', task: 'Achieve first-stage learning goals' },
        { date: 'After 1 year', task: 'Achieve significant improvement in comprehensive abilities' }
      ]
    }
  }
  return recommendations[i18nStore.currentLanguage]
}

// 选择选项
const selectOption = (option: string) => {
  answers[currentStep.value] = option
}

// 上一题
const previousQuestion = () => {
  if (currentStep.value > 0) {
    currentStep.value--
  }
}

// 下一题
const nextQuestion = () => {
  if (currentStep.value < questions.value.length - 1) {
    currentStep.value++
  } else {
    generateReport()
  }
}

// 生成报告
const generateReport = () => {
  showReport.value = true
}

// 重新开始
const restartQuestionnaire = () => {
  currentStep.value = 0
  Object.keys(answers).forEach(key => delete answers[parseInt(key)])
  showReport.value = false
}

// 下载报告
const downloadReport = () => {
  const isEnglish = i18nStore.currentLanguage === 'en'
  const recs = getRecommendations()
  
  const reportContent = isEnglish ? `
Academic Planning Report
Student Name: ${answers[0] || 'Student'}
Grade Level: ${answers[1] || 'Not specified'}
Interest Area: ${answers[2] || 'Not specified'}
Learning Goals: ${answers[3] || 'Not specified'}
Development Focus: ${answers[4] || 'Not specified'}

Course Recommendations:
${recs.courses.map(c => `- ${c.subject}: ${c.description}`).join('\n')}

Timeline Planning:
${recs.timeline.map(t => `- ${t.period}: ${t.activity}`).join('\n')}

Expected Outcomes:
${recs.expectations.map(e => `- ${e}`).join('\n')}

Key Milestones:
${recs.milestones.map(m => `- ${m.date}: ${m.task}`).join('\n')}
  ` : `
学业规划报告
学生姓名: ${answers[0] || '学生'}
年级: ${answers[1] || '未填写'}
兴趣领域: ${answers[2] || '未填写'}
学习目标: ${answers[3] || '未填写'}
发展重点: ${answers[4] || '未填写'}

课程推荐:
${recs.courses.map(c => `- ${c.subject}: ${c.description}`).join('\n')}

时间规划:
${recs.timeline.map(t => `- ${t.period}: ${t.activity}`).join('\n')}

预期目标:
${recs.expectations.map(e => `- ${e}`).join('\n')}

关键里程碑:
${recs.milestones.map(m => `- ${m.date}: ${m.task}`).join('\n')}
  `
  
  const blob = new Blob([reportContent], { type: 'text/plain;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = isEnglish 
    ? `Academic_Planning_Report_${answers[0] || 'Student'}.txt`
    : `学业规划报告_${answers[0] || '学生'}.txt`
  link.click()
  URL.revokeObjectURL(url)
}
</script>

<style scoped>
.recommendation-item,
.expectation-item {
  margin-bottom: 15px;
  padding: 10px;
  background: #f8f9fa;
  border-radius: 8px;
  border-left: 3px solid #667eea;
}

.timeline-planning .timeline-item {
  display: flex;
  margin-bottom: 15px;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 8px;
  border-left: 3px solid #667eea;
}

.timeline-date {
  font-weight: bold;
  color: #667eea;
  min-width: 100px;
}

.timeline-content {
  flex: 1;
  color: #333;
}

.milestone-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 8px;
  border-left: 3px solid #667eea;
}

.milestone-date {
  font-weight: bold;
  color: #667eea;
}

.milestone-task {
  color: #333;
}
</style>
