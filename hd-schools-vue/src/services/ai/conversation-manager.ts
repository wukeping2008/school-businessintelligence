/**
 * 智能对话管理器
 * 负责管理多轮对话上下文和生成智能响应
 */

import type { ConsultationSession, StudentProfile } from './intelligent-admission-engine'

export interface ConversationStrategy {
  type: 'greeting' | 'profiling' | 'deepening' | 'planning' | 'closing'
  priority: number
  questions: string[]
  responsePatterns: string[]
}

export class ConversationManager {
  private strategies: Map<string, ConversationStrategy> = new Map()
  
  constructor() {
    this.initializeStrategies()
  }

  private initializeStrategies() {
    // 问候策略
    this.strategies.set('greeting', {
      type: 'greeting',
      priority: 1,
      questions: [
        '请问您的姓名是？',
        '您目前在读几年级？',
        '您来自哪所学校？'
      ],
      responsePatterns: [
        '很高兴认识您，{name}同学！',
        '欢迎来到HD Schools智能咨询系统！',
        '让我们开始您的个性化升学规划之旅吧！'
      ]
    })

    // 信息收集策略
    this.strategies.set('profiling', {
      type: 'profiling',
      priority: 2,
      questions: [
        '您对哪些学科领域特别感兴趣？',
        '您有什么特长或爱好吗？',
        '您理想中的大学是什么样的？',
        '您的学术成绩如何？有哪些优势科目？',
        '您参加过哪些课外活动或竞赛？'
      ],
      responsePatterns: [
        '了解了，您对{interest}很感兴趣，这是一个很有前景的领域！',
        '您的{strength}能力很出色，这将是申请大学的重要优势。',
        '{university}是一所非常优秀的大学，让我们一起努力实现这个目标！'
      ]
    })

    // 深化了解策略
    this.strategies.set('deepening', {
      type: 'deepening',
      priority: 3,
      questions: [
        '能详细说说您为什么对{interest}感兴趣吗？',
        '您在{subject}学习中遇到过什么挑战吗？',
        '您希望未来从事什么职业？',
        '您对大学生活有什么期待？',
        '您的家人对您的升学有什么期望吗？'
      ],
      responsePatterns: [
        '您的想法很成熟，看得出您对未来有清晰的规划。',
        '这些挑战都是成长的机会，我们可以一起制定克服方案。',
        '您的职业目标很明确，这有助于我们选择合适的专业方向。'
      ]
    })

    // 规划制定策略
    this.strategies.set('planning', {
      type: 'planning',
      priority: 4,
      questions: [
        '您希望什么时候开始准备标准化考试？',
        '您对申请时间有什么安排吗？',
        '您需要哪方面的重点支持？',
        '您对未来的学习计划有什么想法？'
      ],
      responsePatterns: [
        '根据您的情况，我建议制定以下学习计划...',
        '为了达到{university}的要求，您需要在以下方面努力...',
        '让我为您生成一份个性化的升学规划方案。'
      ]
    })
  }

  /**
   * 生成下一个问题
   */
  generateNextQuestion(session: ConsultationSession): string {
    const profile = session.studentProfile
    const context = session.conversationContext
    
    // 根据已讨论的话题和档案完整度选择策略
    const strategy = this.selectStrategy(session)
    
    // 从待回答问题中选择
    if (context.pendingQuestions.length > 0) {
      const question = context.pendingQuestions[0]
      // 个性化问题
      return this.personalizeQuestion(question, profile)
    }
    
    // 从策略中选择新问题
    const questions = strategy.questions
    const randomIndex = Math.floor(Math.random() * questions.length)
    return this.personalizeQuestion(questions[randomIndex], profile)
  }

  /**
   * 生成智能回复
   */
  generateSmartResponse(
    session: ConsultationSession,
    userInput: string
  ): {
    response: string
    suggestedQuestions: string[]
    shouldGeneratePlan: boolean
  } {
    const profile = session.studentProfile
    const context = session.conversationContext
    
    // 分析用户输入的情感
    const sentiment = this.analyzeSentiment(userInput)
    
    // 生成回复
    let response = this.generateContextualResponse(session, userInput, sentiment)
    
    // 生成建议问题
    const suggestedQuestions = this.generateSuggestedQuestions(session)
    
    // 判断是否应该生成规划
    const shouldGeneratePlan = this.shouldGeneratePlan(session)
    
    // 更新对话上下文
    this.updateConversationContext(session, userInput, response)
    
    return {
      response,
      suggestedQuestions,
      shouldGeneratePlan
    }
  }

  /**
   * 选择对话策略
   */
  private selectStrategy(session: ConsultationSession): ConversationStrategy {
    const stage = session.currentStage
    const completeness = session.completionPercentage
    
    if (completeness < 20) {
      return this.strategies.get('greeting')!
    } else if (completeness < 50) {
      return this.strategies.get('profiling')!
    } else if (completeness < 80) {
      return this.strategies.get('deepening')!
    } else {
      return this.strategies.get('planning')!
    }
  }

  /**
   * 个性化问题
   */
  private personalizeQuestion(question: string, profile: StudentProfile): string {
    let personalizedQuestion = question
    
    if (profile.name) {
      personalizedQuestion = personalizedQuestion.replace('{name}', profile.name)
    }
    if (profile.interests && profile.interests.length > 0) {
      personalizedQuestion = personalizedQuestion.replace('{interest}', profile.interests[0])
    }
    if (profile.targetUniversities && profile.targetUniversities.length > 0) {
      personalizedQuestion = personalizedQuestion.replace('{university}', profile.targetUniversities[0])
    }
    
    return personalizedQuestion
  }

  /**
   * 分析情感倾向
   */
  private analyzeSentiment(text: string): 'positive' | 'neutral' | 'negative' {
    const positiveWords = ['喜欢', '热爱', '擅长', '优秀', '期待', '希望', '梦想']
    const negativeWords = ['担心', '困难', '问题', '不好', '害怕', '焦虑', '压力']
    
    const lowerText = text.toLowerCase()
    let positiveScore = 0
    let negativeScore = 0
    
    positiveWords.forEach(word => {
      if (text.includes(word)) positiveScore++
    })
    
    negativeWords.forEach(word => {
      if (text.includes(word)) negativeScore++
    })
    
    if (positiveScore > negativeScore) return 'positive'
    if (negativeScore > positiveScore) return 'negative'
    return 'neutral'
  }

  /**
   * 生成上下文相关的回复
   */
  private generateContextualResponse(
    session: ConsultationSession,
    userInput: string,
    sentiment: string
  ): string {
    const profile = session.studentProfile
    let response = ''
    
    // 根据情感调整回复基调
    if (sentiment === 'positive') {
      response = '太棒了！您的积极态度将是成功的关键。'
    } else if (sentiment === 'negative') {
      response = '我理解您的担忧，让我们一起找到解决方案。'
    } else {
      response = '感谢您提供的信息。'
    }
    
    // 添加个性化内容
    if (profile.interests && profile.interests.length > 0) {
      response += ` 您对${profile.interests.join('、')}的兴趣将帮助您在申请中脱颖而出。`
    }
    
    if (profile.targetUniversities && profile.targetUniversities.length > 0) {
      response += ` ${profile.targetUniversities[0]}是一个很好的目标，我们会帮您制定详细的申请策略。`
    }
    
    return response
  }

  /**
   * 生成建议问题
   */
  private generateSuggestedQuestions(session: ConsultationSession): string[] {
    const questions: string[] = []
    const profile = session.studentProfile
    
    // 根据缺失信息生成问题
    if (!profile.grade) {
      questions.push('我目前在读10年级')
    }
    if (!profile.interests || profile.interests.length === 0) {
      questions.push('我对计算机科学很感兴趣')
    }
    if (!profile.targetUniversities || profile.targetUniversities.length === 0) {
      questions.push('我想申请剑桥大学')
    }
    if (!profile.testScores) {
      questions.push('我的雅思成绩是7.5')
    }
    
    // 添加一些通用建议
    if (questions.length < 3) {
      questions.push('如何提高我的申请竞争力？')
      questions.push('申请时间线是怎样的？')
      questions.push('需要准备哪些材料？')
    }
    
    return questions.slice(0, 3)
  }

  /**
   * 判断是否应该生成规划
   */
  private shouldGeneratePlan(session: ConsultationSession): boolean {
    const profile = session.studentProfile
    const completeness = session.completionPercentage
    
    // 如果完整度超过80%且有基本信息，可以生成规划
    return completeness >= 80 && 
           !!profile.grade && 
           !!profile.interests && 
           profile.interests.length > 0 &&
           !!profile.targetUniversities && 
           profile.targetUniversities.length > 0
  }

  /**
   * 更新对话上下文
   */
  private updateConversationContext(
    session: ConsultationSession,
    userInput: string,
    response: string
  ): void {
    const context = session.conversationContext
    
    // 更新已讨论话题
    if (userInput.includes('年级') || userInput.includes('grade')) {
      context.topicsDiscussed.push('年级信息')
    }
    if (userInput.includes('兴趣') || userInput.includes('喜欢')) {
      context.topicsDiscussed.push('兴趣爱好')
    }
    if (userInput.includes('大学') || userInput.includes('university')) {
      context.topicsDiscussed.push('目标大学')
    }
    
    // 移除已回答的问题
    context.pendingQuestions = context.pendingQuestions.filter(
      q => !userInput.includes(q.substring(0, 5))
    )
    
    // 添加关键洞察
    if (response.includes('优势') || response.includes('擅长')) {
      context.keyInsights.push('学生展现出明确的学术优势')
    }
    if (response.includes('目标') || response.includes('规划')) {
      context.keyInsights.push('学生有清晰的升学目标')
    }
  }
}