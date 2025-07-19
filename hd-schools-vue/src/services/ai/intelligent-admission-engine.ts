/**
 * 智能招生引擎
 * 核心AI驱动的招生咨询系统
 */

import { AIServiceFactory, AIServiceBase, type ChatMessage } from './ai-service-base'

export interface StudentProfile {
  name?: string
  grade?: string
  interests?: string[]
  strengths?: string[]
  targetUniversities?: string[]
  currentGrades?: Record<string, string>
  extracurriculars?: string[]
  careerGoals?: string[]
  concerns?: string[]
}

export interface ConsultationSession {
  id: string
  studentProfile: StudentProfile
  messages: ChatMessage[]
  currentStage: 'greeting' | 'profiling' | 'analysis' | 'planning' | 'summary'
  completionPercentage: number
  generatedPlan?: AcademicPlan
  createdAt: Date
  updatedAt: Date
}

export interface AcademicPlan {
  summary: string
  targetUniversities: UniversityRecommendation[]
  academicGoals: AcademicGoal[]
  timeline: TimelineItem[]
  recommendations: string[]
  nextSteps: string[]
  riskFactors: string[]
}

export interface UniversityRecommendation {
  name: string
  type: 'reach' | 'target' | 'safety'
  matchScore: number
  requirements: string[]
  advantages: string[]
}

export interface AcademicGoal {
  subject: string
  currentLevel: string
  targetLevel: string
  timeframe: string
  strategies: string[]
}

export interface TimelineItem {
  date: string
  milestone: string
  description: string
  priority: 'high' | 'medium' | 'low'
  category: 'academic' | 'extracurricular' | 'application'
}

/**
 * 学生档案分析器
 * 负责从对话中提取和分析学生信息
 */
class StudentProfileAnalyzer {
  private interestKeywords = new Map([
    ['计算机', ['计算机', '编程', '软件', 'computer', 'programming', 'coding', 'IT', '人工智能', 'AI']],
    ['商业', ['商业', '管理', '经济', 'business', 'management', '金融', 'finance', '市场营销', 'marketing']],
    ['工程', ['工程', '机械', '电子', 'engineering', '建筑', 'architecture', '土木', 'civil']],
    ['医学', ['医学', '生物', '化学', 'medicine', 'biology', '护理', 'nursing', '药学', 'pharmacy']],
    ['艺术', ['艺术', '设计', '美术', 'art', 'design', '音乐', 'music', '戏剧', 'drama']],
    ['理科', ['数学', '物理', 'math', 'physics', '统计', 'statistics', '天文', 'astronomy']]
  ])

  private universityKeywords = new Map([
    ['剑桥大学', ['剑桥', 'cambridge', 'cam']],
    ['牛津大学', ['牛津', 'oxford', 'ox']],
    ['帝国理工学院', ['帝国理工', 'imperial', 'ic']],
    ['伦敦大学学院', ['伦敦大学', 'ucl', 'university college london']],
    ['华威大学', ['华威', 'warwick']],
    ['爱丁堡大学', ['爱丁堡', 'edinburgh']],
    ['曼彻斯特大学', ['曼彻斯特', 'manchester']],
    ['伦敦政治经济学院', ['lse', 'london school of economics']]
  ])

  private gradeKeywords = [
    'year 7', 'year 8', 'year 9', 'year 10', 'year 11', 'year 12', 'year 13',
    '7年级', '8年级', '9年级', '10年级', '11年级', '12年级', '13年级',
    'grade 7', 'grade 8', 'grade 9', 'grade 10', 'grade 11', 'grade 12', 'grade 13'
  ]

  /**
   * 分析用户输入并提取学生信息
   */
  analyzeInput(input: string): {
    interests: string[]
    universities: string[]
    grade?: string
    strengths: string[]
    concerns: string[]
  } {
    const lowerInput = input.toLowerCase()
    const result = {
      interests: [] as string[],
      universities: [] as string[],
      grade: undefined as string | undefined,
      strengths: [] as string[],
      concerns: [] as string[]
    }

    // 分析兴趣领域
    for (const [category, keywords] of this.interestKeywords) {
      if (keywords.some(keyword => lowerInput.includes(keyword.toLowerCase()))) {
        if (!result.interests.includes(category)) {
          result.interests.push(category)
        }
      }
    }

    // 分析目标大学
    for (const [university, keywords] of this.universityKeywords) {
      if (keywords.some(keyword => lowerInput.includes(keyword.toLowerCase()))) {
        if (!result.universities.includes(university)) {
          result.universities.push(university)
        }
      }
    }

    // 分析年级
    const gradeMatch = input.match(/(\d+)年级|year\s*(\d+)|grade\s*(\d+)/i)
    if (gradeMatch) {
      result.grade = gradeMatch[1] || gradeMatch[2] || gradeMatch[3]
    }

    // 分析优势和担忧
    if (lowerInput.includes('擅长') || lowerInput.includes('好') || lowerInput.includes('强')) {
      result.strengths.push('学术能力强')
    }
    if (lowerInput.includes('担心') || lowerInput.includes('困难') || lowerInput.includes('问题')) {
      result.concerns.push('需要额外支持')
    }

    return result
  }

  /**
   * 评估档案完整度
   */
  assessProfileCompleteness(profile: StudentProfile): {
    completeness: number
    missingFields: string[]
    suggestions: string[]
  } {
    const requiredFields = ['name', 'grade', 'interests', 'targetUniversities']
    const optionalFields = ['strengths', 'currentGrades', 'extracurriculars', 'careerGoals']
    
    let completedRequired = 0
    let completedOptional = 0
    const missingFields: string[] = []
    const suggestions: string[] = []

    // 检查必填字段
    requiredFields.forEach(field => {
      const value = profile[field as keyof StudentProfile]
      if (value && (Array.isArray(value) ? value.length > 0 : true)) {
        completedRequired++
      } else {
        missingFields.push(field)
      }
    })

    // 检查可选字段
    optionalFields.forEach(field => {
      const value = profile[field as keyof StudentProfile]
      if (value && (Array.isArray(value) ? value.length > 0 : true)) {
        completedOptional++
      }
    })

    const completeness = (completedRequired / requiredFields.length) * 0.7 + 
                        (completedOptional / optionalFields.length) * 0.3

    // 生成建议
    if (!profile.interests?.length) {
      suggestions.push('了解学生的兴趣领域和专业倾向')
    }
    if (!profile.targetUniversities?.length) {
      suggestions.push('询问目标大学和地区偏好')
    }
    if (!profile.currentGrades) {
      suggestions.push('了解当前学术成绩情况')
    }
    if (!profile.extracurriculars?.length) {
      suggestions.push('了解课外活动和特长')
    }

    return {
      completeness: Math.round(completeness * 100),
      missingFields,
      suggestions
    }
  }
}

export class IntelligentAdmissionEngine {
  private aiService: AIServiceBase | null = null
  private sessions: Map<string, ConsultationSession> = new Map()
  private conversationContext: Map<string, ChatMessage[]> = new Map()
  private profileAnalyzer: StudentProfileAnalyzer

  constructor() {
    this.initializeAI()
    this.profileAnalyzer = new StudentProfileAnalyzer()
  }

  private async initializeAI(): Promise<void> {
    try {
      // 优先使用Mock服务进行开发测试
      this.aiService = await AIServiceFactory.createService({
        provider: 'mock'
      })
    } catch (error) {
      console.error('AI服务初始化失败:', error)
    }
  }

  /**
   * 开始新的咨询会话
   */
  async startConsultation(studentName?: string): Promise<ConsultationSession> {
    const sessionId = this.generateSessionId()
    
    const session: ConsultationSession = {
      id: sessionId,
      studentProfile: {
        name: studentName
      },
      messages: [],
      currentStage: 'greeting',
      completionPercentage: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    // 添加系统欢迎消息
    const welcomeMessage = await this.generateWelcomeMessage(studentName)
    session.messages.push({
      role: 'assistant',
      content: welcomeMessage,
      timestamp: new Date()
    })

    this.sessions.set(sessionId, session)
    return session
  }

  /**
   * 处理用户输入并生成AI回复
   */
  async processUserInput(sessionId: string, userInput: string): Promise<{
    response: string
    session: ConsultationSession
    shouldGeneratePlan: boolean
  }> {
    const session = this.sessions.get(sessionId)
    if (!session) {
      throw new Error('会话不存在')
    }

    // 添加用户消息
    session.messages.push({
      role: 'user',
      content: userInput,
      timestamp: new Date()
    })

    // 分析用户输入并更新学生档案
    await this.analyzeAndUpdateProfile(session, userInput)

    // 生成AI回复
    const aiResponse = await this.generateAIResponse(session)
    
    // 添加AI回复
    session.messages.push({
      role: 'assistant',
      content: aiResponse,
      timestamp: new Date()
    })

    // 更新会话状态
    this.updateSessionStage(session)
    session.updatedAt = new Date()

    // 判断是否应该生成学业规划
    const shouldGeneratePlan = this.shouldGenerateAcademicPlan(session)

    this.sessions.set(sessionId, session)

    return {
      response: aiResponse,
      session,
      shouldGeneratePlan
    }
  }

  /**
   * 生成个性化学业规划
   */
  async generateAcademicPlan(sessionId: string): Promise<AcademicPlan> {
    const session = this.sessions.get(sessionId)
    if (!session) {
      throw new Error('会话不存在')
    }

    if (!this.aiService) {
      throw new Error('AI服务未初始化')
    }

    // 构建规划生成提示
    const planPrompt = this.buildPlanGenerationPrompt(session.studentProfile)
    
    try {
      const response = await this.aiService.generate(planPrompt, {
        studentName: session.studentProfile.name,
        targetUniversity: session.studentProfile.targetUniversities?.[0],
        major: session.studentProfile.interests?.[0]
      })

      if (response.success) {
        const plan = this.parseAcademicPlan(response.data.content, session.studentProfile)
        session.generatedPlan = plan
        session.completionPercentage = 100
        this.sessions.set(sessionId, session)
        return plan
      } else {
        throw new Error(response.error || '规划生成失败')
      }
    } catch (error) {
      console.error('生成学业规划失败:', error)
      // 返回默认规划
      return this.generateDefaultPlan(session.studentProfile)
    }
  }

  /**
   * 获取会话信息
   */
  getSession(sessionId: string): ConsultationSession | undefined {
    return this.sessions.get(sessionId)
  }

  /**
   * 获取所有会话
   */
  getAllSessions(): ConsultationSession[] {
    return Array.from(this.sessions.values())
  }

  // 私有方法

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  private async generateWelcomeMessage(studentName?: string): Promise<string> {
    const name = studentName ? `${studentName}同学` : '同学'
    
    return `您好${name}！👋 欢迎来到HD Schools智能升学咨询系统！

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
  }

  private async analyzeAndUpdateProfile(session: ConsultationSession, userInput: string): Promise<void> {
    try {
      // 使用新的档案分析器
      const analysisResult = this.profileAnalyzer.analyzeInput(userInput)
      const profile = session.studentProfile

      // 更新兴趣领域
      if (analysisResult.interests.length > 0) {
        profile.interests = [...new Set([...(profile.interests || []), ...analysisResult.interests])]
      }

      // 更新目标大学
      if (analysisResult.universities.length > 0) {
        profile.targetUniversities = [...new Set([...(profile.targetUniversities || []), ...analysisResult.universities])]
      }

      // 更新年级
      if (analysisResult.grade) {
        profile.grade = analysisResult.grade
      }

      // 更新优势
      if (analysisResult.strengths.length > 0) {
        profile.strengths = [...new Set([...(profile.strengths || []), ...analysisResult.strengths])]
      }

      // 更新担忧
      if (analysisResult.concerns.length > 0) {
        profile.concerns = [...new Set([...(profile.concerns || []), ...analysisResult.concerns])]
      }

      // 如果有AI服务，也尝试使用AI分析
      if (this.aiService) {
        const aiAnalysis = await this.aiService.analyze(userInput, 'student_profile')
        if (aiAnalysis.success && aiAnalysis.data) {
          // 合并AI分析结果
          if (aiAnalysis.data.interests) {
            profile.interests = [...new Set([...(profile.interests || []), ...aiAnalysis.data.interests])]
          }
          if (aiAnalysis.data.strengths) {
            profile.strengths = [...new Set([...(profile.strengths || []), ...aiAnalysis.data.strengths])]
          }
        }
      }

      // 记录分析日志
      console.log('档案分析结果:', {
        input: userInput.substring(0, 50) + '...',
        extracted: analysisResult,
        updatedProfile: profile
      })

    } catch (error) {
      console.error('分析用户输入失败:', error)
    }
  }

  private async generateAIResponse(session: ConsultationSession): Promise<string> {
    if (!this.aiService) {
      return '抱歉，AI服务暂时不可用，请稍后再试。'
    }

    try {
      // 构建对话上下文
      const systemPrompt = this.buildSystemPrompt(session)
      const messages: ChatMessage[] = [
        { role: 'system', content: systemPrompt },
        ...session.messages.slice(-6) // 保留最近6条消息作为上下文
      ]

      const response = await this.aiService.chat(messages)
      
      if (response.success) {
        return response.data.content
      } else {
        return '抱歉，我暂时无法回复您的问题，请稍后再试。'
      }
    } catch (error) {
      console.error('生成AI回复失败:', error)
      return '抱歉，系统出现了一些问题，请稍后再试。'
    }
  }

  private buildSystemPrompt(session: ConsultationSession): string {
    const profile = session.studentProfile
    
    return `你是HD Schools的专业AI升学顾问，正在为学生提供个性化咨询服务。

当前学生信息：
- 姓名：${profile.name || '未知'}
- 年级：${profile.grade || '未知'}
- 兴趣领域：${profile.interests?.join(', ') || '待了解'}
- 目标大学：${profile.targetUniversities?.join(', ') || '待确定'}
- 咨询阶段：${session.currentStage}

请根据以下原则回复：
1. 保持专业、温暖、鼓励的语调
2. 根据学生的回答逐步深入了解他们的情况
3. 提供具体、可行的建议
4. 适时询问更多细节以完善学生档案
5. 当信息足够时，主动提出生成个性化学业规划

回复要求：
- 简洁明了，避免过长
- 包含具体的问题引导下一步对话
- 使用emoji增加亲和力
- 体现HD Schools的专业性`
  }

  private updateSessionStage(session: ConsultationSession): void {
    const profile = session.studentProfile
    const messageCount = session.messages.length

    if (messageCount <= 2) {
      session.currentStage = 'greeting'
      session.completionPercentage = 10
    } else if (messageCount <= 6) {
      session.currentStage = 'profiling'
      session.completionPercentage = 30
    } else if (messageCount <= 10) {
      session.currentStage = 'analysis'
      session.completionPercentage = 60
    } else {
      session.currentStage = 'planning'
      session.completionPercentage = 80
    }
  }

  private shouldGenerateAcademicPlan(session: ConsultationSession): boolean {
    const profile = session.studentProfile
    
    // 检查是否有足够信息生成规划
    return !!(
      profile.interests && profile.interests.length > 0 &&
      session.messages.length >= 8 &&
      session.currentStage === 'planning'
    )
  }

  private buildPlanGenerationPrompt(profile: StudentProfile): string {
    return `请为以下学生生成详细的个性化学业规划报告：

学生信息：
- 姓名：${profile.name || '学生'}
- 年级：${profile.grade || '高中'}
- 兴趣领域：${profile.interests?.join(', ') || '理工科'}
- 目标大学：${profile.targetUniversities?.join(', ') || '世界顶尖大学'}
- 学术优势：${profile.strengths?.join(', ') || '待评估'}

请生成包含以下内容的学业规划报告：
1. 学生优势分析
2. 推荐专业方向
3. 目标大学建议（冲刺、稳妥、保底）
4. 学术提升计划
5. 课外活动建议
6. 时间规划和里程碑
7. 具体行动步骤

要求：专业、详细、可操作性强。`
  }

  private parseAcademicPlan(content: string, profile: StudentProfile): AcademicPlan {
    // 简化的解析逻辑，实际项目中可以使用更复杂的NLP解析
    return {
      summary: content.substring(0, 200) + '...',
      targetUniversities: [
        {
          name: '剑桥大学',
          type: 'reach',
          matchScore: 0.85,
          requirements: ['A-Level: A*AA', 'IELTS: 7.5+'],
          advantages: ['世界顶尖声誉', '优秀的研究环境']
        },
        {
          name: '帝国理工学院',
          type: 'target',
          matchScore: 0.92,
          requirements: ['A-Level: AAA', 'IELTS: 7.0+'],
          advantages: ['理工科强势', '就业前景好']
        }
      ],
      academicGoals: [
        {
          subject: '数学',
          currentLevel: 'A',
          targetLevel: 'A*',
          timeframe: '6个月',
          strategies: ['加强微积分练习', '参加数学竞赛']
        }
      ],
      timeline: [
        {
          date: '2024-08-01',
          milestone: 'IELTS考试',
          description: '目标分数7.5分',
          priority: 'high',
          category: 'academic'
        }
      ],
      recommendations: [
        '重点提升英语能力',
        '参加相关学科竞赛',
        '增加课外活动参与'
      ],
      nextSteps: [
        '制定详细的学习计划',
        '联系升学顾问深入咨询',
        '开始准备申请材料'
      ],
      riskFactors: [
        '时间管理需要改善',
        '英语写作有待提升'
      ]
    }
  }

  private generateDefaultPlan(profile: StudentProfile): AcademicPlan {
    return {
      summary: '基于您的兴趣和目标，我们为您制定了这份个性化学业规划。',
      targetUniversities: [
        {
          name: '目标大学1',
          type: 'target',
          matchScore: 0.8,
          requirements: ['优秀的学术成绩'],
          advantages: ['符合您的兴趣方向']
        }
      ],
      academicGoals: [],
      timeline: [],
      recommendations: ['继续保持学习热情', '多参与实践活动'],
      nextSteps: ['联系升学顾问', '制定详细计划'],
      riskFactors: []
    }
  }
}
