/**
 * 招生咨询智能对话引擎
 * 负责对话管理、意图识别、信息提取和学生画像构建
 */

import { v4 as uuidv4 } from 'uuid'
import { AIServiceFactory } from './ai-service'
import { ADMISSION_SYSTEM_PROMPTS, CONVERSATION_CONFIG } from '@/config/ai.config'
import type {
  ChatMessage,
  ChatSession,
  StudentProfile,
  AIResponse,
  AcademicPlanReport
} from '@/types/ai/admission'

export class AdmissionChatEngine {
  private aiService = AIServiceFactory.create()
  private currentSession: ChatSession | null = null
  private profileExtractor = new StudentProfileExtractor()
  
  /**
   * 开始新的咨询会话
   */
  async startSession(): Promise<ChatSession> {
    this.currentSession = {
      id: uuidv4(),
      startTime: new Date(),
      messages: [],
      studentProfile: {},
      status: 'active'
    }
    
    // 添加系统提示词
    const systemPrompt: ChatMessage = {
      id: uuidv4(),
      role: 'system',
      content: ADMISSION_SYSTEM_PROMPTS.qwen, // 根据实际provider选择
      timestamp: new Date()
    }
    
    this.currentSession.messages.push(systemPrompt)
    
    // 生成开场白
    const greeting = await this.generateGreeting()
    if (greeting) {
      this.currentSession.messages.push(greeting)
    }
    
    return this.currentSession
  }
  
  /**
   * 处理用户消息
   */
  async processMessage(userInput: string): Promise<ChatMessage> {
    if (!this.currentSession || this.currentSession.status !== 'active') {
      throw new Error('No active session')
    }
    
    // 创建用户消息
    const userMessage: ChatMessage = {
      id: uuidv4(),
      role: 'user',
      content: userInput,
      timestamp: new Date()
    }
    
    this.currentSession.messages.push(userMessage)
    
    // 意图识别和实体提取
    const analysis = await this.analyzeMessage(userInput)
    userMessage.metadata = analysis
    
    // 更新学生画像
    this.updateStudentProfile(analysis.entities)
    
    // 检查是否需要主动引导
    const guidanceNeeded = this.checkGuidanceNeeded()
    
    // 生成AI回复
    const response = await this.generateResponse(guidanceNeeded)
    
    if (response) {
      this.currentSession.messages.push(response)
      
      // 检查是否达到对话结束条件
      if (this.shouldEndConversation()) {
        await this.endSession()
      }
    }
    
    return response
  }
  
  /**
   * 生成开场白
   */
  private async generateGreeting(): Promise<ChatMessage> {
    const greetingPrompt = `生成一个友好专业的招生咨询开场白，包括：
1. 欢迎语
2. 自我介绍（HD Schools智能招生顾问）
3. 询问如何帮助
4. 营造轻松的交流氛围`
    
    const response = await this.aiService.chat([
      {
        id: uuidv4(),
        role: 'system',
        content: ADMISSION_SYSTEM_PROMPTS.qwen,
        timestamp: new Date()
      },
      {
        id: uuidv4(),
        role: 'user',
        content: greetingPrompt,
        timestamp: new Date()
      }
    ])
    
    if (response.success && response.data?.content) {
      return {
        id: uuidv4(),
        role: 'assistant',
        content: response.data.content,
        timestamp: new Date()
      }
    }
    
    // 默认开场白
    return {
      id: uuidv4(),
      role: 'assistant',
      content: '您好！我是HD Schools的智能招生顾问。很高兴为您服务！请问您是想了解我们学校的哪些方面呢？比如课程设置、申请流程、或是为孩子规划升学路径？',
      timestamp: new Date()
    }
  }
  
  /**
   * 分析用户消息，提取意图和实体
   */
  private async analyzeMessage(userInput: string): Promise<{
    intent?: string
    entities?: Record<string, any>
    confidence?: number
  }> {
    // 简单的规则基础实体提取
    const entities: Record<string, any> = {}
    
    // 提取年龄
    const ageMatch = userInput.match(/(\d+)\s*岁|年龄\s*[:：]?\s*(\d+)/i)
    if (ageMatch) {
      entities.age = parseInt(ageMatch[1] || ageMatch[2])
    }
    
    // 提取年级
    const gradeMatch = userInput.match(/(\d+)\s*年级|[初高]中|小学/i)
    if (gradeMatch) {
      entities.currentGrade = gradeMatch[0]
    }
    
    // 提取兴趣爱好
    const interestKeywords = ['喜欢', '爱好', '特长', '擅长', '感兴趣']
    if (interestKeywords.some(keyword => userInput.includes(keyword))) {
      // 这里可以使用更复杂的NLP提取
      entities.interests = this.extractInterests(userInput)
    }
    
    // 意图识别（简化版）
    let intent = 'general_inquiry'
    if (userInput.includes('申请') || userInput.includes('入学')) {
      intent = 'application_process'
    } else if (userInput.includes('课程') || userInput.includes('学习')) {
      intent = 'curriculum_inquiry'
    } else if (userInput.includes('费用') || userInput.includes('学费')) {
      intent = 'tuition_inquiry'
    } else if (userInput.includes('升学') || userInput.includes('大学')) {
      intent = 'university_guidance'
    }
    
    return {
      intent,
      entities,
      confidence: 0.8
    }
  }
  
  /**
   * 提取兴趣爱好
   */
  private extractInterests(text: string): string[] {
    const interests: string[] = []
    
    // 常见兴趣爱好关键词
    const interestPatterns = [
      '数学', '物理', '化学', '生物', '计算机', '编程',
      '音乐', '钢琴', '小提琴', '绘画', '美术', '舞蹈',
      '篮球', '足球', '游泳', '网球', '羽毛球',
      '阅读', '写作', '演讲', '辩论', '科研'
    ]
    
    interestPatterns.forEach(interest => {
      if (text.includes(interest)) {
        interests.push(interest)
      }
    })
    
    return interests
  }
  
  /**
   * 更新学生画像
   */
  private updateStudentProfile(entities?: Record<string, any>) {
    if (!entities || !this.currentSession) return
    
    const profile = this.currentSession.studentProfile
    
    // 合并新信息到画像
    Object.entries(entities).forEach(([key, value]) => {
      if (key === 'interests' && Array.isArray(value)) {
        profile.interests = [...(profile.interests || []), ...value]
      } else {
        (profile as any)[key] = value
      }
    })
  }
  
  /**
   * 检查是否需要主动引导
   */
  private checkGuidanceNeeded(): string | null {
    if (!this.currentSession) return null
    
    const profile = this.currentSession.studentProfile
    const messageCount = this.currentSession.messages.filter(m => m.role === 'user').length
    
    // 根据已收集信息决定下一步引导
    if (!profile.studentName && messageCount > 2) {
      return '请问学生的姓名是？'
    }
    
    if (!profile.age && messageCount > 3) {
      return '请问学生现在几岁了？'
    }
    
    if (!profile.currentGrade && messageCount > 4) {
      return '学生现在读几年级呢？'
    }
    
    if (!profile.interests || profile.interests.length === 0) {
      return '能告诉我学生有哪些兴趣爱好或特长吗？'
    }
    
    if (!profile.targetUniversities || profile.targetUniversities.length === 0) {
      return '对于未来的大学，有什么目标或想法吗？'
    }
    
    return null
  }
  
  /**
   * 生成AI回复
   */
  private async generateResponse(guidancePrompt: string | null): Promise<ChatMessage> {
    if (!this.currentSession) {
      throw new Error('No active session')
    }
    
    // 构建对话上下文
    const contextMessages = this.getContextMessages()
    
    // 如果需要引导，添加引导提示
    if (guidancePrompt) {
      const lastMessage = contextMessages[contextMessages.length - 1]
      if (lastMessage && lastMessage.role === 'user') {
        // 在用户消息后添加引导
        contextMessages.push({
          id: uuidv4(),
          role: 'system',
          content: `在回答用户问题后，自然地引导话题到：${guidancePrompt}`,
          timestamp: new Date()
        })
      }
    }
    
    // 调用AI服务
    const response = await this.aiService.chat(contextMessages)
    
    if (response.success && response.data?.content) {
      return {
        id: uuidv4(),
        role: 'assistant',
        content: response.data.content,
        timestamp: new Date(),
        metadata: {
          confidence: 0.9
        }
      }
    }
    
    // 错误处理
    return {
      id: uuidv4(),
      role: 'assistant',
      content: '抱歉，我现在遇到了一些技术问题。请您稍后再试，或者直接联系我们的招生老师。',
      timestamp: new Date()
    }
  }
  
  /**
   * 获取对话上下文
   */
  private getContextMessages(): ChatMessage[] {
    if (!this.currentSession) return []
    
    const messages = this.currentSession.messages
    const contextWindow = CONVERSATION_CONFIG.contextWindow
    
    // 保留系统提示词和最近的N条消息
    const systemMessage = messages.find(m => m.role === 'system')
    const recentMessages = messages.slice(-contextWindow)
    
    if (systemMessage && !recentMessages.includes(systemMessage)) {
      return [systemMessage, ...recentMessages]
    }
    
    return recentMessages
  }
  
  /**
   * 检查是否应该结束对话
   */
  private shouldEndConversation(): boolean {
    if (!this.currentSession) return false
    
    const messageCount = this.currentSession.messages.filter(m => m.role === 'user').length
    const profile = this.currentSession.studentProfile
    
    // 达到最大轮数
    if (messageCount >= CONVERSATION_CONFIG.maxTurns) {
      return true
    }
    
    // 收集到足够的关键信息
    const requiredFields = ['studentName', 'age', 'currentGrade', 'interests']
    const collectedFields = requiredFields.filter(field => (profile as any)[field])
    
    if (collectedFields.length >= requiredFields.length * 0.8) {
      // 80%的必要信息已收集
      const lastMessage = this.currentSession.messages[this.currentSession.messages.length - 1]
      // 检查是否是结束语境
      if (lastMessage?.content.includes('谢谢') || lastMessage?.content.includes('再见')) {
        return true
      }
    }
    
    return false
  }
  
  /**
   * 结束会话
   */
  async endSession(): Promise<ChatSession> {
    if (!this.currentSession) {
      throw new Error('No active session')
    }
    
    this.currentSession.status = 'completed'
    this.currentSession.endTime = new Date()
    
    // 生成会话摘要
    this.currentSession.summary = await this.generateSessionSummary()
    
    // 生成学业规划报告
    const report = await this.generateAcademicPlanReport()
    
    return this.currentSession
  }
  
  /**
   * 生成会话摘要
   */
  private async generateSessionSummary(): Promise<string> {
    if (!this.currentSession) return ''
    
    const profile = this.currentSession.studentProfile
    const summary = `
咨询摘要：
- 学生姓名：${profile.studentName || '未提供'}
- 年龄：${profile.age || '未提供'}
- 年级：${profile.currentGrade || '未提供'}
- 兴趣特长：${profile.interests?.join('、') || '未提供'}
- 目标大学：${profile.targetUniversities?.join('、') || '未提供'}
- 咨询重点：${this.extractConsultationFocus()}
    `.trim()
    
    return summary
  }
  
  /**
   * 提取咨询重点
   */
  private extractConsultationFocus(): string {
    if (!this.currentSession) return '一般咨询'
    
    const intents = this.currentSession.messages
      .filter(m => m.metadata?.intent)
      .map(m => m.metadata!.intent)
    
    // 统计最常见的意图
    const intentCounts = intents.reduce((acc, intent) => {
      acc[intent!] = (acc[intent!] || 0) + 1
      return acc
    }, {} as Record<string, number>)
    
    const topIntent = Object.entries(intentCounts)
      .sort(([, a], [, b]) => b - a)[0]?.[0]
    
    const focusMap: Record<string, string> = {
      'application_process': '申请流程',
      'curriculum_inquiry': '课程设置',
      'tuition_inquiry': '费用咨询',
      'university_guidance': '升学指导',
      'general_inquiry': '综合了解'
    }
    
    return focusMap[topIntent] || '一般咨询'
  }
  
  /**
   * 生成学业规划报告
   */
  async generateAcademicPlanReport(): Promise<AcademicPlanReport | null> {
    if (!this.currentSession || !this.currentSession.studentProfile.studentName) {
      return null
    }
    
    // TODO: 实现完整的报告生成逻辑
    // 这里需要调用AI来生成个性化的学业规划报告
    
    return null
  }
  
  /**
   * 获取当前会话
   */
  getCurrentSession(): ChatSession | null {
    return this.currentSession
  }
  
  /**
   * 获取学生画像
   */
  getStudentProfile(): Partial<StudentProfile> {
    return this.currentSession?.studentProfile || {}
  }
}

/**
 * 学生画像提取器
 */
class StudentProfileExtractor {
  // TODO: 实现更智能的信息提取逻辑
  // 可以考虑使用NLP库或调用专门的信息提取API
}