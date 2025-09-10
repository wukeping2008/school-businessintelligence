/**
 * 个性化学业规划生成器
 * 基于学生档案生成定制化的升学规划
 */

import type { 
  StudentProfile, 
  AcademicPlan, 
  UniversityRecommendation,
  AcademicGoal,
  TimelineItem 
} from './intelligent-admission-engine'

export class PersonalizedPlanner {
  /**
   * 生成完整的学业规划
   */
  generateCompletePlan(profile: StudentProfile): AcademicPlan {
    const universities = this.recommendUniversities(profile)
    const goals = this.generateAcademicGoals(profile)
    const timeline = this.createTimeline(profile)
    const recommendations = this.generateRecommendations(profile)
    const nextSteps = this.generateNextSteps(profile)
    const riskFactors = this.identifyRiskFactors(profile)
    
    const summary = this.generatePlanSummary(profile, universities, goals)
    
    return {
      summary,
      targetUniversities: universities,
      academicGoals: goals,
      timeline,
      recommendations,
      nextSteps,
      riskFactors
    }
  }

  /**
   * 推荐适合的大学
   */
  private recommendUniversities(profile: StudentProfile): UniversityRecommendation[] {
    const universities: UniversityRecommendation[] = []
    
    // 根据学生兴趣和成绩推荐大学
    const topTierUnis = [
      { name: '剑桥大学', strengths: ['理科', '工程', '医学'] },
      { name: '牛津大学', strengths: ['文科', '法律', '商业'] },
      { name: '帝国理工学院', strengths: ['工程', '计算机', '理科'] },
      { name: '伦敦政治经济学院', strengths: ['商业', '经济', '社会科学'] }
    ]
    
    const midTierUnis = [
      { name: '华威大学', strengths: ['商业', '数学', '工程'] },
      { name: '爱丁堡大学', strengths: ['医学', '文科', '理科'] },
      { name: '曼彻斯特大学', strengths: ['工程', '商业', '医学'] },
      { name: '伦敦大学学院', strengths: ['建筑', '艺术', '工程'] }
    ]
    
    // 如果学生已有目标大学，优先考虑
    if (profile.targetUniversities && profile.targetUniversities.length > 0) {
      profile.targetUniversities.forEach(uni => {
        universities.push({
          name: uni,
          type: 'target',
          matchScore: 0.85,
          requirements: this.getUniversityRequirements(uni),
          advantages: this.getUniversityAdvantages(uni, profile)
        })
      })
    }
    
    // 基于兴趣匹配推荐
    if (profile.interests) {
      // 推荐冲刺院校
      const reachUni = this.selectBestMatch(topTierUnis, profile.interests)
      if (reachUni) {
        universities.push({
          name: reachUni.name,
          type: 'reach',
          matchScore: 0.7,
          requirements: this.getUniversityRequirements(reachUni.name),
          advantages: this.getUniversityAdvantages(reachUni.name, profile)
        })
      }
      
      // 推荐保底院校
      const safetyUni = this.selectBestMatch(midTierUnis, profile.interests)
      if (safetyUni) {
        universities.push({
          name: safetyUni.name,
          type: 'safety',
          matchScore: 0.9,
          requirements: this.getUniversityRequirements(safetyUni.name),
          advantages: this.getUniversityAdvantages(safetyUni.name, profile)
        })
      }
    }
    
    return universities
  }

  /**
   * 生成学术目标
   */
  private generateAcademicGoals(profile: StudentProfile): AcademicGoal[] {
    const goals: AcademicGoal[] = []
    
    // 根据兴趣生成学科目标
    if (profile.interests) {
      profile.interests.forEach(interest => {
        const relatedSubjects = this.getRelatedSubjects(interest)
        relatedSubjects.forEach(subject => {
          goals.push({
            subject,
            currentLevel: profile.currentGrades?.[subject] || 'B',
            targetLevel: 'A*',
            timeframe: '6个月',
            strategies: this.generateStrategies(subject, profile)
          })
        })
      })
    }
    
    // 添加语言目标
    if (!profile.testScores?.ielts || profile.testScores.ielts < 7.5) {
      goals.push({
        subject: '英语（雅思）',
        currentLevel: profile.testScores?.ielts?.toString() || '6.5',
        targetLevel: '7.5+',
        timeframe: '3个月',
        strategies: [
          '每日进行听说读写练习',
          '参加模拟考试',
          '扩充学术词汇',
          '练习学术写作'
        ]
      })
    }
    
    return goals
  }

  /**
   * 创建时间线
   */
  private createTimeline(profile: StudentProfile): TimelineItem[] {
    const timeline: TimelineItem[] = []
    const currentDate = new Date()
    
    // 根据年级生成时间线
    const grade = parseInt(profile.grade || '11')
    const monthsUntilApplication = (13 - grade) * 12
    
    // 近期任务（1-3个月）
    timeline.push({
      date: this.getDateString(1),
      milestone: '完善学生档案和评估',
      description: '全面评估当前学术水平，确定目标和差距',
      priority: 'high',
      category: 'academic'
    })
    
    timeline.push({
      date: this.getDateString(2),
      milestone: '制定学习计划',
      description: '根据目标大学要求制定详细的学习提升计划',
      priority: 'high',
      category: 'academic'
    })
    
    timeline.push({
      date: this.getDateString(3),
      milestone: '开始标准化考试准备',
      description: '报名并开始准备雅思/托福等标准化考试',
      priority: 'high',
      category: 'application'
    })
    
    // 中期任务（4-6个月）
    timeline.push({
      date: this.getDateString(4),
      milestone: '参加课外活动',
      description: '选择并深度参与2-3项与专业相关的课外活动',
      priority: 'medium',
      category: 'extracurricular'
    })
    
    timeline.push({
      date: this.getDateString(5),
      milestone: '首次标准化考试',
      description: '参加第一次雅思/托福考试，评估成绩',
      priority: 'high',
      category: 'application'
    })
    
    timeline.push({
      date: this.getDateString(6),
      milestone: '暑期项目申请',
      description: '申请参加暑期学校或实习项目',
      priority: 'medium',
      category: 'extracurricular'
    })
    
    // 长期任务（7-12个月）
    if (monthsUntilApplication > 6) {
      timeline.push({
        date: this.getDateString(9),
        milestone: '大学开放日参访',
        description: '参加目标大学的开放日活动，深入了解',
        priority: 'medium',
        category: 'application'
      })
      
      timeline.push({
        date: this.getDateString(10),
        milestone: '准备申请材料',
        description: '开始准备个人陈述、推荐信等申请材料',
        priority: 'high',
        category: 'application'
      })
      
      timeline.push({
        date: this.getDateString(12),
        milestone: '提交大学申请',
        description: '完成并提交UCAS申请',
        priority: 'high',
        category: 'application'
      })
    }
    
    return timeline
  }

  /**
   * 生成建议
   */
  private generateRecommendations(profile: StudentProfile): string[] {
    const recommendations: string[] = []
    
    // 基于档案生成个性化建议
    if (!profile.testScores?.ielts || profile.testScores.ielts < 7) {
      recommendations.push('建议立即开始雅思备考，目标分数7.5以上')
    }
    
    if (!profile.extracurriculars || profile.extracurriculars.length < 2) {
      recommendations.push('增加课外活动参与，特别是与目标专业相关的活动')
    }
    
    if (profile.interests?.includes('计算机')) {
      recommendations.push('参加编程竞赛或开源项目，积累实践经验')
    }
    
    if (profile.interests?.includes('商业')) {
      recommendations.push('参加商业案例分析比赛或创业项目')
    }
    
    if (profile.concerns?.length > 0) {
      recommendations.push('寻求专业辅导，解决学习中的困难')
    }
    
    // 通用建议
    recommendations.push('保持优秀的学术成绩，特别是核心科目')
    recommendations.push('培养批判性思维和独立研究能力')
    recommendations.push('建立与老师的良好关系，为推荐信做准备')
    
    return recommendations.slice(0, 6)
  }

  /**
   * 生成下一步行动
   */
  private generateNextSteps(profile: StudentProfile): string[] {
    const steps: string[] = []
    
    // 立即行动项
    if (!profile.grade) {
      steps.push('确认当前年级和学制信息')
    }
    
    if (!profile.currentGrades) {
      steps.push('整理当前各科成绩单')
    }
    
    if (!profile.testScores) {
      steps.push('了解并报名标准化考试')
    }
    
    // 一周内完成
    steps.push('与家长讨论升学目标和期望')
    steps.push('研究目标大学的具体要求')
    steps.push('制定每日学习计划表')
    
    // 一个月内完成
    steps.push('选择并报名合适的补习课程')
    steps.push('开始建立个人作品集或项目')
    
    return steps.slice(0, 5)
  }

  /**
   * 识别风险因素
   */
  private identifyRiskFactors(profile: StudentProfile): string[] {
    const risks: string[] = []
    
    if (profile.concerns && profile.concerns.length > 0) {
      risks.push('学生表达了一些担忧，需要额外的心理支持')
    }
    
    if (!profile.testScores || profile.testScores.ielts < 6.5) {
      risks.push('语言成绩可能成为申请瓶颈')
    }
    
    if (!profile.extracurriculars || profile.extracurriculars.length === 0) {
      risks.push('缺乏课外活动经历可能影响申请竞争力')
    }
    
    if (profile.grade && parseInt(profile.grade) >= 12) {
      risks.push('时间紧迫，需要加快准备进度')
    }
    
    return risks
  }

  /**
   * 生成规划摘要
   */
  private generatePlanSummary(
    profile: StudentProfile,
    universities: UniversityRecommendation[],
    goals: AcademicGoal[]
  ): string {
    const name = profile.name || '同学'
    const grade = profile.grade || '11'
    const interests = profile.interests?.join('、') || '多个领域'
    const targetUni = universities[0]?.name || '顶尖大学'
    
    return `根据${name}的个人情况分析，您目前就读${grade}年级，对${interests}表现出浓厚兴趣。
    
基于您的学术背景和发展潜力，我们为您制定了申请${targetUni}等名校的个性化规划。
    
这份规划涵盖了${goals.length}个核心学术目标，通过系统的准备和努力，您将在申请中展现出独特的竞争优势。
    
关键成功因素包括：保持优异的学术成绩、提升标准化考试分数、丰富课外活动经历，以及展现独特的个人特质。
    
让我们一起努力，实现您的名校梦想！`
  }

  // 辅助方法

  private getUniversityRequirements(universityName: string): string[] {
    const requirementsMap: Record<string, string[]> = {
      '剑桥大学': [
        'A-Level成绩：A*A*A或以上',
        '雅思：总分7.5，单项不低于7.0',
        '需要参加入学考试和面试',
        '强烈推荐有学科竞赛经历'
      ],
      '牛津大学': [
        'A-Level成绩：A*A*A-AAA',
        '雅思：总分7.0-7.5',
        '需要提交written work',
        '重视批判性思维能力'
      ],
      '帝国理工学院': [
        'A-Level成绩：A*A*A-A*AA',
        '雅思：总分6.5-7.0',
        '数理成绩要求高',
        '看重研究和实践经验'
      ]
    }
    
    return requirementsMap[universityName] || [
      'A-Level成绩：AAA或以上',
      '雅思：总分6.5以上',
      '良好的学术背景',
      '相关课外活动经历'
    ]
  }

  private getUniversityAdvantages(universityName: string, profile: StudentProfile): string[] {
    const advantages: string[] = []
    
    if (profile.interests?.includes('计算机')) {
      advantages.push('计算机科学专业排名世界前列')
    }
    if (profile.interests?.includes('商业')) {
      advantages.push('商学院享有国际声誉')
    }
    if (profile.interests?.includes('工程')) {
      advantages.push('工程学院设施先进，产学研结合紧密')
    }
    
    advantages.push('优秀的师资力量')
    advantages.push('丰富的国际交流机会')
    advantages.push('完善的就业支持体系')
    
    return advantages.slice(0, 4)
  }

  private selectBestMatch(
    universities: Array<{name: string, strengths: string[]}>,
    interests: string[]
  ): {name: string, strengths: string[]} | null {
    let bestMatch = null
    let maxScore = 0
    
    universities.forEach(uni => {
      let score = 0
      interests.forEach(interest => {
        if (uni.strengths.some(s => s.includes(interest) || interest.includes(s))) {
          score++
        }
      })
      
      if (score > maxScore) {
        maxScore = score
        bestMatch = uni
      }
    })
    
    return bestMatch
  }

  private getRelatedSubjects(interest: string): string[] {
    const subjectMap: Record<string, string[]> = {
      '计算机': ['数学', '物理', '计算机科学'],
      '商业': ['数学', '经济', '商业研究'],
      '工程': ['数学', '物理', '化学'],
      '医学': ['生物', '化学', '物理'],
      '艺术': ['艺术与设计', '历史', '文学'],
      '理科': ['数学', '物理', '化学']
    }
    
    return subjectMap[interest] || ['数学', '英语']
  }

  private generateStrategies(subject: string, profile: StudentProfile): string[] {
    const strategies: string[] = []
    
    // 基于学习风格生成策略
    if (profile.learningStyle === 'visual') {
      strategies.push('使用思维导图和图表辅助学习')
    } else if (profile.learningStyle === 'auditory') {
      strategies.push('参加讨论小组和听力练习')
    } else if (profile.learningStyle === 'kinesthetic') {
      strategies.push('通过实验和实践项目深化理解')
    }
    
    // 通用策略
    strategies.push('每周进行知识点复习和总结')
    strategies.push('完成历年真题练习')
    strategies.push('寻求老师的个性化指导')
    strategies.push('建立错题本，定期回顾')
    
    return strategies.slice(0, 4)
  }

  private getDateString(monthsFromNow: number): string {
    const date = new Date()
    date.setMonth(date.getMonth() + monthsFromNow)
    return date.toISOString().split('T')[0]
  }
}