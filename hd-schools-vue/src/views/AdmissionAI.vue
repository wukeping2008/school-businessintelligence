<template>
  <div class="admission-ai-container">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-content">
        <div class="header-left">
          <h1 class="page-title">
            <i class="fas fa-robot"></i>
            AI智能招生咨询
          </h1>
          <p class="page-subtitle">基于人工智能的个性化升学指导系统</p>
        </div>
        <div class="header-right">
          <span class="ai-badge">
            <i class="fas fa-cpu"></i>
            AI 赋能
          </span>
        </div>
      </div>
    </div>

    <!-- 主要内容区域 -->
    <div class="main-content">
      <!-- 左侧：聊天界面 -->
      <div class="chat-section">
        <div class="chat-card">
          <div class="chat-header">
            <div class="chat-title">
              <i class="fas fa-comments"></i>
              <span>AI升学顾问</span>
            </div>
            <div class="chat-status">
              <span class="status-online">在线</span>
            </div>
          </div>

          <!-- 聊天消息区域 -->
          <div class="chat-messages" ref="messagesContainer">
            <div
              v-for="(message, index) in messages"
              :key="index"
              :class="['message', message.role === 'user' ? 'user-message' : 'ai-message']"
            >
              <div class="message-avatar">
                <i :class="message.role === 'user' ? 'fas fa-user' : 'fas fa-robot'"></i>
              </div>
              <div class="message-content">
                <div class="message-text" v-html="formatMessage(message.content)"></div>
                <div class="message-time">
                  {{ formatTime(message.timestamp) }}
                </div>
              </div>
            </div>

            <!-- AI 思考中指示器 -->
            <div v-if="isThinking" class="message ai-message thinking">
              <div class="message-avatar">
                <i class="fas fa-robot"></i>
              </div>
              <div class="message-content">
                <div class="thinking-indicator">
                  <span>AI正在思考中</span>
                  <div class="thinking-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 输入区域 -->
          <div class="chat-input-area">
            <textarea
              v-model="userInput"
              placeholder="请输入您的问题或想法..."
              :disabled="isThinking"
              @keydown.ctrl.enter="sendMessage"
              class="chat-input"
              rows="3"
            ></textarea>
            <div class="input-actions">
              <div class="input-tips">
                <small>Ctrl + Enter 快速发送</small>
              </div>
              <div class="action-buttons">
                <button @click="clearChat" :disabled="isThinking" class="btn btn-secondary">
                  清空对话
                </button>
                <button
                  @click="sendMessage"
                  :disabled="!userInput.trim() || isThinking"
                  class="btn btn-primary"
                >
                  <i class="fas fa-paper-plane"></i>
                  {{ isThinking ? '发送中...' : '发送' }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 右侧：学生档案和进度 -->
      <div class="profile-section">
        <!-- 咨询进度 -->
        <div class="progress-card">
          <div class="card-header">
            <i class="fas fa-chart-line"></i>
            <span>咨询进度</span>
          </div>
          
          <div class="progress-content">
            <div class="progress-bar">
              <div class="progress-fill" :style="{ width: completionPercentage + '%' }"></div>
            </div>
            <div class="progress-info">
              <div class="progress-stage">
                <span class="stage-badge">{{ currentStage }}</span>
              </div>
              <div class="progress-text">
                咨询进度：{{ completionPercentage }}%
              </div>
            </div>
          </div>
        </div>

        <!-- 学生档案 -->
        <div class="profile-card">
          <div class="card-header">
            <i class="fas fa-user"></i>
            <span>学生档案</span>
          </div>

          <div class="profile-content">
            <div v-if="studentProfile.name" class="profile-items">
              <div class="profile-item" v-if="studentProfile.name">
                <label>姓名:</label>
                <span>{{ studentProfile.name }}</span>
              </div>
              <div class="profile-item" v-if="studentProfile.grade">
                <label>年级:</label>
                <span>{{ studentProfile.grade }}年级</span>
              </div>
              <div class="profile-item" v-if="studentProfile.interests?.length">
                <label>兴趣领域:</label>
                <div class="tag-list">
                  <span
                    v-for="interest in studentProfile.interests"
                    :key="interest"
                    class="tag tag-primary"
                  >
                    {{ interest }}
                  </span>
                </div>
              </div>
              <div class="profile-item" v-if="studentProfile.targetUniversities?.length">
                <label>目标大学:</label>
                <div class="tag-list">
                  <span
                    v-for="uni in studentProfile.targetUniversities"
                    :key="uni"
                    class="tag tag-success"
                  >
                    {{ uni }}
                  </span>
                </div>
              </div>
            </div>
            <div v-else class="empty-profile">
              <i class="fas fa-user-plus"></i>
              <p>开始对话后，学生档案信息将在这里显示</p>
            </div>
          </div>
        </div>

        <!-- 快速操作 -->
        <div class="actions-card">
          <div class="card-header">
            <i class="fas fa-tools"></i>
            <span>快速操作</span>
          </div>

          <div class="actions-content">
            <button
              v-if="canGeneratePlan"
              @click="generateAcademicPlan"
              :disabled="isGeneratingPlan"
              class="btn btn-primary action-button"
            >
              <i class="fas fa-file-alt"></i>
              {{ isGeneratingPlan ? '生成中...' : '生成学业规划' }}
            </button>
            
            <button
              @click="startNewConsultation"
              class="btn btn-success action-button"
            >
              <i class="fas fa-plus"></i>
              新建咨询
            </button>

            <button
              @click="viewHistory"
              class="btn btn-info action-button"
            >
              <i class="fas fa-history"></i>
              查看历史
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 学业规划对话框 -->
    <div v-if="showPlanDialog" class="modal-overlay" @click="closePlanDialog">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>学业规划报告</h3>
          <button @click="closePlanDialog" class="close-btn">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="modal-body">
          <div v-if="generatedPlan" class="plan-content">
            <div class="plan-summary">
              <h4>规划摘要</h4>
              <p>{{ generatedPlan.summary }}</p>
            </div>

            <div class="plan-universities">
              <h4>推荐大学</h4>
              <div class="university-list">
                <div
                  v-for="uni in generatedPlan.targetUniversities"
                  :key="uni.name"
                  class="university-item"
                >
                  <div class="university-header">
                    <h5>{{ uni.name }}</h5>
                    <span :class="['university-type', `type-${uni.type}`]">
                      {{ getUniversityTypeText(uni.type) }}
                    </span>
                  </div>
                  <div class="university-details">
                    <div class="match-score">
                      <span>匹配度: {{ Math.round(uni.matchScore * 100) }}%</span>
                    </div>
                    <div class="requirements">
                      <strong>申请要求:</strong>
                      <ul>
                        <li v-for="req in uni.requirements" :key="req">{{ req }}</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="plan-recommendations">
              <h4>建议</h4>
              <ul>
                <li v-for="rec in generatedPlan.recommendations" :key="rec">{{ rec }}</li>
              </ul>
            </div>

            <div class="plan-next-steps">
              <h4>下一步行动</h4>
              <ul>
                <li v-for="step in generatedPlan.nextSteps" :key="step">{{ step }}</li>
              </ul>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button @click="closePlanDialog" class="btn btn-secondary">
            关闭
          </button>
          <button @click="downloadPlan" class="btn btn-primary">
            <i class="fas fa-download"></i>
            下载规划
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from 'vue'

// 响应式数据
const userInput = ref('')
const isThinking = ref(false)
const messages = ref<Array<{
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}>>([])
const showPlanDialog = ref(false)
const isGeneratingPlan = ref(false)
const messagesContainer = ref<HTMLElement>()

// 学生档案
const studentProfile = ref({
  name: '',
  grade: '',
  interests: [] as string[],
  targetUniversities: [] as string[]
})

// 咨询状态
const currentStage = ref('初始问候')
const completionPercentage = ref(0)

// 生成的规划
const generatedPlan = ref<any>(null)

// 计算属性
const canGeneratePlan = computed(() => {
  return completionPercentage.value >= 80 && !generatedPlan.value
})

// 方法
const startNewConsultation = () => {
  const studentName = prompt('请输入学生姓名:')
  if (studentName) {
    studentProfile.value.name = studentName
    messages.value = []
    
    // 添加欢迎消息
    const welcomeMessage = `您好${studentName}同学！👋 欢迎来到HD Schools智能升学咨询系统！

我是您的专属AI升学顾问，将为您提供个性化的学业规划和升学指导。

🎯 **我可以帮助您：**
✅ 分析您的学术优势和兴趣方向
✅ 推荐适合的专业和目标大学
✅ 制定详细的学业提升计划
✅ 规划课外活动和竞赛参与
✅ 优化申请时间线和策略

为了给您最精准的建议，我想先了解一下您的情况。请告诉我：

**您目前在读几年级？对哪些专业领域比较感兴趣？**

比如：计算机科学、商业管理、工程学、医学、艺术设计等等...`

    messages.value.push({
      role: 'assistant',
      content: welcomeMessage,
      timestamp: new Date()
    })
    
    currentStage.value = '初始问候'
    completionPercentage.value = 10
    
    nextTick(() => {
      scrollToBottom()
    })
  }
}

const sendMessage = async () => {
  if (!userInput.value.trim() || isThinking.value) return
  
  if (!studentProfile.value.name) {
    startNewConsultation()
    if (!studentProfile.value.name) return
  }

  const message = userInput.value.trim()
  userInput.value = ''
  isThinking.value = true

  // 添加用户消息
  messages.value.push({
    role: 'user',
    content: message,
    timestamp: new Date()
  })

  // 分析用户输入并更新档案
  analyzeUserInput(message)

  // 模拟AI思考时间
  await new Promise(resolve => setTimeout(resolve, 1500))

  // 生成AI回复
  const aiResponse = generateAIResponse(message)
  
  messages.value.push({
    role: 'assistant',
    content: aiResponse,
    timestamp: new Date()
  })

  // 更新进度
  updateProgress()

  isThinking.value = false
  
  nextTick(() => {
    scrollToBottom()
  })
}

const analyzeUserInput = (input: string) => {
  const lowerInput = input.toLowerCase()
  
  // 年级识别
  const gradeMatch = input.match(/(\d+)年级|grade\s*(\d+)/i)
  if (gradeMatch) {
    studentProfile.value.grade = gradeMatch[1] || gradeMatch[2]
  }

  // 兴趣识别
  const interestKeywords = [
    '计算机', '编程', '软件', 'computer', 'programming',
    '商业', '管理', '经济', 'business', 'management',
    '工程', '机械', '电子', 'engineering',
    '医学', '生物', '化学', 'medicine', 'biology',
    '艺术', '设计', '美术', 'art', 'design',
    '数学', '物理', 'math', 'physics'
  ]

  interestKeywords.forEach(keyword => {
    if (lowerInput.includes(keyword)) {
      if (!studentProfile.value.interests.includes(keyword)) {
        studentProfile.value.interests.push(keyword)
      }
    }
  })

  // 大学识别
  const universityKeywords = [
    '剑桥', '牛津', '帝国理工', '伦敦大学', '华威',
    'cambridge', 'oxford', 'imperial', 'ucl', 'warwick'
  ]

  universityKeywords.forEach(uni => {
    if (lowerInput.includes(uni)) {
      if (!studentProfile.value.targetUniversities.includes(uni)) {
        studentProfile.value.targetUniversities.push(uni)
      }
    }
  })
}

const generateAIResponse = (userMessage: string) => {
  const responses = [
    `很好！我了解到您对${studentProfile.value.interests.join('、')}感兴趣。这些都是很有前景的领域。

请告诉我更多关于您的情况：
- 您目前的学术成绩如何？
- 有参加过什么课外活动或竞赛吗？
- 对未来的职业发展有什么想法？`,

    `根据您提到的信息，我建议您可以考虑以下发展方向：

🎯 **专业建议：**
- 如果对技术感兴趣，可以考虑计算机科学、软件工程
- 如果喜欢商业，可以考虑商业管理、经济学
- 如果对创新感兴趣，可以考虑工程类专业

📚 **学术准备：**
- 重点提升数学和英语能力
- 多参与相关领域的实践项目
- 准备标准化考试（如IELTS、SAT等）

您还有什么具体问题想了解的吗？`,

    `基于我们的对话，我已经收集了足够的信息来为您制定个性化的学业规划。

✅ **已了解信息：**
- 学生姓名：${studentProfile.value.name}
- 年级：${studentProfile.value.grade || '待确认'}年级
- 兴趣领域：${studentProfile.value.interests.join('、') || '待深入了解'}
- 目标大学：${studentProfile.value.targetUniversities.join('、') || '待确定'}

现在我可以为您生成详细的学业规划报告了！点击右侧的"生成学业规划"按钮即可获取个性化建议。

还有什么其他问题需要我帮助解答的吗？`
  ]

  const messageCount = messages.value.length
  if (messageCount <= 4) {
    return responses[0]
  } else if (messageCount <= 8) {
    return responses[1]
  } else {
    return responses[2]
  }
}

const updateProgress = () => {
  const messageCount = messages.value.length
  
  if (messageCount <= 2) {
    currentStage.value = '初始问候'
    completionPercentage.value = 20
  } else if (messageCount <= 6) {
    currentStage.value = '信息收集'
    completionPercentage.value = 50
  } else if (messageCount <= 10) {
    currentStage.value = '深度分析'
    completionPercentage.value = 75
  } else {
    currentStage.value = '规划制定'
    completionPercentage.value = 90
  }
}

const generateAcademicPlan = async () => {
  isGeneratingPlan.value = true
  
  // 模拟生成时间
  await new Promise(resolve => setTimeout(resolve, 2000))
  
  generatedPlan.value = {
    summary: `基于${studentProfile.value.name}同学的兴趣和目标，我们为您制定了这份个性化学业规划。重点关注${studentProfile.value.interests.join('、')}领域的发展。`,
    targetUniversities: [
      {
        name: '剑桥大学',
        type: 'reach',
        matchScore: 0.85,
        requirements: ['A-Level: A*AA', 'IELTS: 7.5+', '优秀的个人陈述'],
        advantages: ['世界顶尖声誉', '优秀的研究环境']
      },
      {
        name: '帝国理工学院',
        type: 'target',
        matchScore: 0.92,
        requirements: ['A-Level: AAA', 'IELTS: 7.0+', '相关学科背景'],
        advantages: ['理工科强势', '就业前景好']
      },
      {
        name: '华威大学',
        type: 'safety',
        matchScore: 0.95,
        requirements: ['A-Level: AAB', 'IELTS: 6.5+'],
        advantages: ['商科排名高', '国际化程度高']
      }
    ],
    recommendations: [
      '重点提升英语能力，目标IELTS 7.5分',
      '参加相关学科竞赛，增强学术背景',
      '增加课外活动参与，展现领导力',
      '提前准备个人陈述和推荐信',
      '考虑参加暑期学校或实习项目'
    ],
    nextSteps: [
      '制定详细的学习计划和时间表',
      '联系升学顾问进行深入咨询',
      '开始准备申请材料',
      '参加相关的标准化考试',
      '建立目标大学的联系'
    ]
  }
  
  showPlanDialog.value = true
  completionPercentage.value = 100
  isGeneratingPlan.value = false
}

const clearChat = () => {
  if (confirm('确定要清空当前对话吗？')) {
    messages.value = []
    studentProfile.value = {
      name: '',
      grade: '',
      interests: [],
      targetUniversities: []
    }
    currentStage.value = '初始问候'
    completionPercentage.value = 0
    generatedPlan.value = null
  }
}

const viewHistory = () => {
  alert('历史记录功能即将推出！')
}

const closePlanDialog = () => {
  showPlanDialog.value = false
}

const downloadPlan = () => {
  if (!generatedPlan.value) return
  
  const content = JSON.stringify(generatedPlan.value, null, 2)
  const blob = new Blob([content], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `academic-plan-${studentProfile.value.name}-${Date.now()}.json`
  a.click()
  URL.revokeObjectURL(url)
  
  alert('规划已下载！')
}

const formatMessage = (content: string) => {
  return content
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/\n/g, '<br>')
    .replace(/✅/g, '<span style="color: #67c23a;">✅</span>')
    .replace(/🎯/g, '<span style="color: #409eff;">🎯</span>')
    .replace(/📅/g, '<span style="color: #e6a23c;">📅</span>')
    .replace(/📚/g, '<span style="color: #909399;">📚</span>')
}

const formatTime = (timestamp: Date) => {
  return timestamp.toLocaleTimeString('zh-CN', {
    hour: '2-digit',
    minute: '2-digit'
  })
}

const getUniversityTypeText = (type: string) => {
  switch (type) {
    case 'reach': return '冲刺目标'
    case 'target': return '稳妥选择'
    case 'safety': return '保底选择'
    default: return '推荐'
  }
}

const scrollToBottom = () => {
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}

// 组件挂载
onMounted(() => {
  // 自动开始咨询
  startNewConsultation()
})
</script>

<style scoped>
.admission-ai-container {
  padding: 20px;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  min-height: calc(100vh - 60px);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.page-header {
  margin-bottom: 20px;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.page-title {
  display: flex;
  align-items: center;
  margin: 0 0 8px 0;
  font-size: 28px;
  font-weight: 600;
  color: #409eff;
}

.page-title i {
  margin-right: 12px;
  font-size: 32px;
}

.page-subtitle {
  margin: 0;
  color: #666;
  font-size: 16px;
}

.ai-badge {
  background: #67c23a;
  color: white;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
}

.ai-badge i {
  margin-right: 6px;
}

.main-content {
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: 20px;
  height: calc(100vh - 200px);
}

.chat-section {
  display: flex;
  flex-direction: column;
}

.chat-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  height: 100%;
  display: flex;
  flex-direction: column;
}

.chat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #eee;
}

.chat-title {
  display: flex;
  align-items: center;
  font-weight: 600;
  color: #409eff;
}

.chat-title i {
  margin-right: 8px;
}

.status-online {
  background: #67c23a;
  color: white;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  max-height: calc(100vh - 400px);
}

.message {
  display: flex;
  margin-bottom: 20px;
}

.user-message {
  flex-direction: row-reverse;
}

.user-message .message-content {
  background: #409eff;
  color: white;
  margin-right: 12px;
  margin-left: 0;
}

.ai-message .message-content {
  background: #f5f7fa;
  color: #333;
  margin-left: 12px;
}

.thinking .message-content {
  background: #e8f4fd;
  border: 1px dashed #409eff;
}

.message-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #409eff;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.user-message .message-avatar {
  background: #67c23a;
}

.message-content {
  max-width: 70%;
  padding: 12px 16px;
  border-radius: 12px;
  position: relative;
}

.message-text {
  line-height: 1.6;
  word-wrap: break-word;
}

.message-time {
  font-size: 12px;
  opacity: 0.7;
  margin-top: 8px;
}

.thinking-indicator {
  display: flex;
  align-items: center;
}

.thinking-dots {
  margin-left: 8px;
  display: flex;
  gap: 4px;
}

.thinking-dots span {
  width: 6px;
  height: 6px;
  background: #409eff;
  border-radius: 50%;
  animation: thinking 1.4s infinite ease-in-out;
}

.thinking-dots span:nth-child(1) { animation-delay: -0.32s; }
.thinking-dots span:nth-child(2) { animation-delay: -0.16s; }

@keyframes thinking {
  0%, 80%, 100% { transform: scale(0); }
  40% { transform: scale(1); }
}

.chat-input-area {
  border-top: 1px solid #eee;
  padding: 20px;
}

.chat-input {
  width: 100%;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 12px;
  font-size: 14px;
  resize: vertical;
  margin-bottom: 12px;
}

.input-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.input-tips {
  color: #999;
  font-size: 12px;
}

.action-buttons {
  display: flex;
  gap: 12px;
}

.btn {
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 6px;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-primary {
  background: #409eff;
  color: white;
}

.btn-secondary {
  background: #909399;
  color: white;
}

.btn-success {
  background: #67c23a;
  color: white;
}

.btn-info {
  background: #909399;
  color: white;
}

.profile-section {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.progress-card,
.profile-card,
.actions-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.card-header {
  display: flex;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #eee;
  font-weight: 600;
  color: #333;
}

.card-header i {
  margin-right: 8px;
  color: #409eff;
}

.progress-content {
  padding: 20px;
}

.progress-bar {
  width: 100%;
  height: 8px;
  background: #f0f0f0;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 16px;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #409eff, #67c23a);
  transition: width 0.3s ease;
}

.progress-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.stage-badge {
  background: #409eff;
  color: white;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
}

.progress-text {
  font-size: 14px;
  color: #666;
}

.profile-content {
  padding: 20px;
}

.profile-items {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.profile-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.profile-item label {
  font-weight: 600;
  color: #333;
  font-size: 14px;
}

.tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tag {
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.tag-primary {
  background: #e8f4fd;
  color: #409eff;
}

.tag-success {
  background: #f0f9ff;
  color: #67c23a;
}

.empty-profile {
  text-align: center;
  padding: 40px 20px;
  color: #999;
}

.empty-profile i {
  font-size: 48px;
  margin-bottom: 16px;
  color: #ddd;
}

.actions-content {
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.action-button {
  width: 100%;
  justify-content: center;
  padding: 12px 16px;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 12px;
  width: 90%;
  max-width: 800px;
  max-height: 90vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #eee;
}

.modal-header h3 {
  margin: 0;
  color: #333;
}

.close-btn {
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: #999;
  padding: 4px;
}

.close-btn:hover {
  color: #333;
}

.modal-body {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
}

.plan-content {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.plan-summary h4,
.plan-universities h4,
.plan-recommendations h4,
.plan-next-steps h4 {
  margin: 0 0 12px 0;
  color: #409eff;
  font-size: 18px;
}

.university-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.university-item {
  border: 1px solid #eee;
  border-radius: 8px;
  padding: 16px;
}

.university-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.university-header h5 {
  margin: 0;
  color: #333;
}

.university-type {
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.type-reach {
  background: #fef0f0;
  color: #f56c6c;
}

.type-target {
  background: #f0f9ff;
  color: #409eff;
}

.type-safety {
  background: #f0f9ff;
  color: #67c23a;
}

.university-details {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.match-score {
  font-weight: 600;
  color: #67c23a;
}

.requirements ul {
  margin: 8px 0 0 0;
  padding-left: 20px;
}

.plan-recommendations ul,
.plan-next-steps ul {
  margin: 0;
  padding-left: 20px;
}

.plan-recommendations li,
.plan-next-steps li {
  margin-bottom: 8px;
  line-height: 1.5;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 20px;
  border-top: 1px solid #eee;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .main-content {
    grid-template-columns: 1fr;
    gap: 20px;
  }
  
  .profile-section {
    flex-direction: row;
    gap: 20px;
  }
  
  .progress-card,
  .profile-card,
  .actions-card {
    flex: 1;
  }
}

@media (max-width: 768px) {
  .admission-ai-container {
    padding: 10px;
  }
  
  .header-content {
    flex-direction: column;
    gap: 16px;
    text-align: center;
  }
  
  .page-title {
    font-size: 24px;
  }
  
  .profile-section {
    flex-direction: column;
  }
  
  .modal-content {
    width: 95%;
    margin: 20px;
  }
}
</style>
