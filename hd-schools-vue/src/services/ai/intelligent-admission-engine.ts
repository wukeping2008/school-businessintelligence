/**
 * 智能招生引擎
 * 核心AI驱动的招生咨询系统
 */

import { AIServiceFactory, AIServiceBase, ChatMessage } from './ai-service-base'

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

export class IntelligentAdmissionEngine {
  private aiService: AIServiceBase | null = null
  private sessions: Map<string, ConsultationSession> = new Map()

  constructor() {
    this.initializeAI()
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
    if (!this.aiService) return

    try {
      const analysis = await this.aiService.analyze(userInput, 'student_profile')
      
      if (analysis.success && analysis.data) {
        const profile = session.studentProfile
        
        // 提取并更新学生信息
        if (analysis.data.interests) {
          profile.interests = [...(profile.interests || []), ...analysis.data.interests]
        }
        
        if (analysis.data.strengths) {
          profile.strengths = [...(profile.strengths || []), ...analysis.data.strengths]
        }

        // 简单的关键词提取
        const lowerInput = userInput.toLowerCase()
        
        // 年级识别
        if (lowerInput.includes('年级') || lowerInput.includes('grade')) {
          const gradeMatch = userInput.match(/(\d+)年级|grade\s*(\d+)/i)
          if (gradeMatch) {
            profile.grade = gradeMatch[1] || gradeMatch[2]
          }
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
            if (!profile.interests) profile.interests = []
            if (!profile.interests.includes(keyword)) {
              profile.interests.push(keyword)
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
            if (!profile.targetUniversities) profile.targetUniversities = []
            if (!profile.targetUniversities.includes(uni)) {
              profile.targetUniversities.push(uni)
            }
          }
        })
      }
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
