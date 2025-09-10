/**
 * Mock AI服务
 * 用于开发和测试阶段，模拟真实AI服务的响应
 */

import { AIServiceBase, type AIServiceConfig, type AIResponse, type ChatMessage } from './ai-service-base'

export class MockAIService extends AIServiceBase {
  constructor(config: AIServiceConfig) {
    super({ ...config, provider: 'mock' })
  }

  async chat(messages: ChatMessage[]): Promise<AIResponse> {
    await this.simulateDelay()
    
    const lastMessage = messages[messages.length - 1]
    const userInput = lastMessage.content.toLowerCase()
    
    let response = ''
    
    // 招生咨询相关回复
    if (userInput.includes('专业') || userInput.includes('课程')) {
      response = '根据您的兴趣和能力，我推荐您考虑以下专业方向：\n\n1. **计算机科学** - 适合逻辑思维强的学生\n2. **商业管理** - 适合有领导潜质的学生\n3. **工程学** - 适合动手能力强的学生\n\n您对哪个方向更感兴趣呢？'
    } else if (userInput.includes('大学') || userInput.includes('申请')) {
      response = '基于您目前的情况，我建议您考虑以下目标大学：\n\n🎯 **冲刺目标**：剑桥大学、牛津大学\n📚 **稳妥选择**：帝国理工学院、伦敦大学学院\n🛡️ **保底选择**：华威大学、布里斯托大学\n\n为了提高申请成功率，建议您重点关注：\n- IELTS目标分数：7.5+\n- A-Level成绩：A*AA\n- 个人陈述优化\n- 课外活动丰富'
    } else if (userInput.includes('时间') || userInput.includes('规划')) {
      response = '为您制定个性化时间规划：\n\n📅 **近期目标（1-3个月）**\n- 完成IELTS考试准备\n- 提升薄弱学科成绩\n- 开始个人陈述写作\n\n📅 **中期目标（3-6个月）**\n- 参加相关竞赛或活动\n- 完善申请材料\n- 准备面试技巧\n\n📅 **长期目标（6-12个月）**\n- 提交大学申请\n- 准备入学考试\n- 获得心仪offer'
    } else if (userInput.includes('成绩') || userInput.includes('分数')) {
      response = '根据您的目标大学要求，建议达到以下成绩标准：\n\n📊 **学术成绩要求**\n- A-Level: A*AA (数学A*，物理A，化学A)\n- IELTS: 总分7.5，单项不低于7.0\n- SAT: 1450+ (如需要)\n\n📈 **提升建议**\n- 数学：加强微积分和统计部分\n- 英语：重点提升写作和口语\n- 科学：增加实验报告质量\n\n需要我为您制定具体的提升计划吗？'
    } else if (userInput.includes('活动') || userInput.includes('课外')) {
      response = '课外活动对申请非常重要！推荐以下活动：\n\n🏆 **学术竞赛**\n- 数学奥林匹克竞赛\n- 物理挑战赛\n- 化学竞赛\n\n🎭 **社会实践**\n- 志愿者服务\n- 社区项目参与\n- 环保活动\n\n💼 **领导力培养**\n- 学生会职务\n- 社团组织\n- 项目管理经验\n\n建议选择2-3个深度参与，而不是广泛涉猎。'
    } else if (userInput.includes('费用') || userInput.includes('奖学金')) {
      response = '关于留学费用和奖学金信息：\n\n💰 **年度费用预估**\n- 学费：£25,000-45,000\n- 生活费：£12,000-18,000\n- 总计：£37,000-63,000\n\n🏅 **奖学金机会**\n- 学术优秀奖学金：最高50%学费减免\n- 国际学生奖学金：£5,000-15,000\n- 专业特定奖学金：根据专业不同\n\n📋 **申请建议**\n- 提前了解各校奖学金政策\n- 准备优秀的申请材料\n- 保持优异的学术成绩'
    } else {
      response = '感谢您的咨询！我是HD Schools的AI升学顾问，专门为您提供个性化的升学指导。\n\n我可以帮助您：\n✅ 制定个性化学业规划\n✅ 推荐适合的专业和大学\n✅ 优化申请时间安排\n✅ 提供成绩提升建议\n✅ 规划课外活动\n\n请告诉我您最关心的问题，比如：\n- 想了解哪些专业？\n- 目标申请哪些大学？\n- 需要制定学习计划吗？\n- 想了解申请要求？'
    }
    
    return {
      success: true,
      data: {
        content: response,
        role: 'assistant'
      },
      usage: {
        promptTokens: this.estimateTokens(messages.map(m => m.content).join(' ')),
        completionTokens: this.estimateTokens(response),
        totalTokens: this.estimateTokens(messages.map(m => m.content).join(' ') + response)
      }
    }
  }

  async analyze(text: string, analysisType: string): Promise<AIResponse> {
    await this.simulateDelay()
    
    let result: any = {}
    
    switch (analysisType) {
      case 'student_profile':
        result = this.analyzeStudentProfile(text)
        break
      case 'academic_performance':
        result = this.analyzeAcademicPerformance(text)
        break
      case 'interaction_warmth':
        result = this.analyzeInteractionWarmth(text)
        break
      default:
        result = { analysis: '通用文本分析结果', confidence: 0.85 }
    }
    
    return {
      success: true,
      data: result
    }
  }

  async generate(prompt: string, options?: any): Promise<AIResponse> {
    await this.simulateDelay()
    
    let content = ''
    
    if (prompt.includes('学业规划报告')) {
      content = this.generateAcademicPlan(options)
    } else if (prompt.includes('里程碑')) {
      content = this.generateMilestones(options)
    } else if (prompt.includes('温暖瞬间')) {
      content = this.generateWarmMoment(options)
    } else {
      content = '这是一个AI生成的内容示例。根据您的需求，我会生成相应的专业内容。'
    }
    
    return {
      success: true,
      data: { content }
    }
  }

  async analyzeSentiment(text: string): Promise<AIResponse> {
    await this.simulateDelay()
    
    // 简单的情感分析模拟
    const positiveWords = ['好', '棒', '优秀', '进步', '成功', '开心', '满意', '温暖', '感动']
    const negativeWords = ['差', '糟糕', '失败', '困难', '担心', '焦虑', '失望']
    
    let score = 0.5 // 中性
    
    positiveWords.forEach(word => {
      if (text.includes(word)) score += 0.1
    })
    
    negativeWords.forEach(word => {
      if (text.includes(word)) score -= 0.1
    })
    
    score = Math.max(0, Math.min(1, score))
    
    let sentiment = 'neutral'
    if (score > 0.6) sentiment = 'positive'
    else if (score < 0.4) sentiment = 'negative'
    
    return {
      success: true,
      data: {
        sentiment,
        score,
        confidence: 0.85
      }
    }
  }

  async extractKeywords(text: string): Promise<AIResponse> {
    await this.simulateDelay()
    
    // 简单的关键词提取模拟
    const keywords = [
      '学习', '成绩', '进步', '目标', '大学', '专业', '考试', '申请',
      '课外活动', '竞赛', '奖学金', '规划', '时间管理', '压力'
    ].filter(keyword => text.includes(keyword))
    
    return {
      success: true,
      data: {
        keywords,
        relevance: keywords.map(k => ({ keyword: k, score: Math.random() * 0.5 + 0.5 }))
      }
    }
  }

  async summarize(text: string, maxLength: number = 200): Promise<AIResponse> {
    await this.simulateDelay()
    
    // 简单的摘要生成
    const sentences = text.split(/[。！？]/).filter(s => s.trim().length > 0)
    const summary = sentences.slice(0, Math.ceil(sentences.length / 3)).join('。') + '。'
    
    return {
      success: true,
      data: {
        summary: summary.length > maxLength ? summary.substring(0, maxLength) + '...' : summary,
        originalLength: text.length,
        summaryLength: summary.length,
        compressionRatio: summary.length / text.length
      }
    }
  }

  async checkHealth(): Promise<boolean> {
    await this.simulateDelay(100)
    return true
  }

  // 私有辅助方法
  private async simulateDelay(ms: number = 500): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, ms + Math.random() * 500))
  }

  private estimateTokens(text: string): number {
    // 简单的token估算：中文按字符数，英文按单词数
    const chineseChars = (text.match(/[\u4e00-\u9fa5]/g) || []).length
    const englishWords = (text.match(/[a-zA-Z]+/g) || []).length
    return chineseChars + englishWords
  }

  private analyzeStudentProfile(text: string): any {
    return {
      strengths: ['数学能力强', '逻辑思维清晰', '学习态度认真'],
      interests: ['科学技术', '数学建模', '编程开发'],
      personality: ['内向思考型', '注重细节', '目标导向'],
      recommendations: [
        '建议加强英语口语表达能力',
        '可以参与更多团队协作项目',
        '适合申请理工科专业'
      ],
      confidence: 0.88
    }
  }

  private analyzeAcademicPerformance(text: string): any {
    return {
      overallTrend: 'improving',
      strongSubjects: ['数学', '物理'],
      weakSubjects: ['英语写作'],
      riskFactors: ['时间管理需要改善'],
      predictions: {
        nextQuarter: 'continued_improvement',
        confidence: 0.82
      },
      recommendations: [
        '保持数学和物理的优势',
        '重点提升英语写作技能',
        '建立更好的学习计划'
      ]
    }
  }

  private analyzeInteractionWarmth(text: string): any {
    const warmthScore = Math.random() * 0.4 + 0.6 // 0.6-1.0
    
    return {
      warmthScore,
      isWorthSharing: warmthScore > 0.7,
      emotionalTags: ['温暖', '成长', '进步'],
      suggestedTitle: '今日温暖瞬间',
      sharingRecommendation: warmthScore > 0.8 ? 'highly_recommended' : 'recommended',
      enhancedContent: `今天在课堂上，${text}这样的小瞬间让我们看到了孩子的成长和进步，值得与家长分享这份温暖。`
    }
  }

  private generateAcademicPlan(options: any): string {
    return `
# 个性化学业规划报告

## 学生概况
- **姓名**: ${options?.studentName || '学生'}
- **目标大学**: ${options?.targetUniversity || '世界顶尖大学'}
- **专业方向**: ${options?.major || '理工科'}

## 当前状况分析
### 学术优势
- 数学基础扎实，逻辑思维能力强
- 理科成绩优异，具备良好的分析能力
- 学习态度认真，自主学习能力较强

### 提升空间
- 英语表达能力需要加强
- 课外活动参与度可以提高
- 时间管理技能有待完善

## 发展规划

### 短期目标（3个月内）
1. **学术提升**
   - IELTS目标分数：7.5分
   - A-Level预估成绩：A*AA
   - 完成2篇高质量学术论文

2. **能力发展**
   - 参加数学竞赛，争取获奖
   - 加入学校科学社团
   - 开始个人陈述写作

### 中期目标（6个月内）
1. **申请准备**
   - 完成5所目标大学的申请材料
   - 获得2封推荐信
   - 参加大学开放日活动

2. **综合发展**
   - 完成一个科研项目
   - 参与志愿者活动50小时
   - 提升领导力和团队协作能力

### 长期目标（12个月内）
1. **升学成果**
   - 获得至少3个大学offer
   - 争取奖学金机会
   - 顺利完成高中学业

## 具体行动计划

### 每周学习安排
- **周一至周五**: 常规课程学习 + 2小时自主学习
- **周六**: 参加课外活动 + IELTS准备
- **周日**: 复习总结 + 个人项目时间

### 月度里程碑
- **第1个月**: 完成IELTS首次考试
- **第2个月**: 提交数学竞赛申请
- **第3个月**: 完成个人陈述初稿

## 资源推荐
- 在线学习平台：Khan Academy, Coursera
- 英语提升：BBC Learning English, TED Talks
- 学术期刊：Nature, Science, IEEE

## 风险预警
- 学习压力过大，注意心理健康
- 时间分配不当，影响整体进度
- 目标过高，需要适当调整

## 总结
基于您的优势和目标，这份规划将帮助您系统性地提升各方面能力，为成功申请理想大学奠定坚实基础。建议每月回顾进度，及时调整计划。

*此报告由HD Schools AI系统生成，如需个性化调整，请联系您的升学顾问。*
    `.trim()
  }

  private generateMilestones(options: any): string {
    const milestones = [
      {
        title: 'IELTS考试准备',
        description: '系统性提升英语能力，目标分数7.5分',
        deadline: '2个月后',
        priority: '关键'
      },
      {
        title: 'A-Level期末考试',
        description: '数学、物理、化学三门科目冲刺A*AA',
        deadline: '3个月后',
        priority: '关键'
      },
      {
        title: '个人陈述写作',
        description: '突出个人特色和学术兴趣',
        deadline: '4个月后',
        priority: '重要'
      },
      {
        title: '课外活动参与',
        description: '参加数学竞赛和科学社团',
        deadline: '持续进行',
        priority: '重要'
      },
      {
        title: '大学申请提交',
        description: '完成5所目标大学的申请',
        deadline: '6个月后',
        priority: '关键'
      }
    ]

    return JSON.stringify(milestones, null, 2)
  }

  private generateWarmMoment(options: any): string {
    const templates = [
      '今天在数学课上，{studentName}主动帮助同桌解决难题，展现了很好的合作精神。',
      '课间时，{studentName}认真整理笔记，这种学习态度值得表扬。',
      '在小组讨论中，{studentName}提出了很有创意的想法，思维活跃。',
      '看到{studentName}为了理解一个概念而反复思考，这种钻研精神很可贵。',
      '{studentName}今天的作业完成得特别认真，字迹工整，思路清晰。'
    ]

    const template = templates[Math.floor(Math.random() * templates.length)]
    return template.replace('{studentName}', options?.studentName || '这位同学')
  }
}
