// 大学数据库服务
export interface University {
  id: string
  name: string
  nameEn: string
  location: string
  country: string
  continent: string
  ranking: {
    world: number
    us: number
    uk: number
    times: number
  }
  requirements: {
    minGPA: number
    satRange: [number, number]
    toeflMin: number
    ieltsMin: number
  }
  tuition: {
    annual: number
    currency: string
  }
  programs: string[]
  tags: string[]
  tier: 'dream' | 'match' | 'safety'
  mountainImage: string
  acceptanceRate: number
  graduateEmploymentRate: number
  averageSalary: number
}

export class UniversityDatabaseService {
  private universities: University[] = [
    // 美国顶尖大学
    {
      id: 'harvard',
      name: '哈佛大学',
      nameEn: 'Harvard University',
      location: 'Cambridge, MA',
      country: 'United States',
      continent: 'North America',
      ranking: { world: 1, us: 1, uk: 0, times: 2 },
      requirements: {
        minGPA: 3.9,
        satRange: [1480, 1600],
        toeflMin: 109,
        ieltsMin: 7.0
      },
      tuition: { annual: 57261, currency: 'USD' },
      programs: ['商科', '医学', '法学', '工程', '人文'],
      tags: ['常春藤', '顶尖学府', '综合实力', '历史悠久'],
      tier: 'dream',
      mountainImage: 'everest',
      acceptanceRate: 5.2,
      graduateEmploymentRate: 98.5,
      averageSalary: 89000
    },
    {
      id: 'cambridge',
      name: '剑桥大学',
      nameEn: 'University of Cambridge',
      location: 'Cambridge, UK',
      country: 'United Kingdom',
      continent: 'Europe',
      ranking: { world: 7, us: 0, uk: 1, times: 3 },
      requirements: {
        minGPA: 3.7,
        satRange: [1450, 1550],
        toeflMin: 110,
        ieltsMin: 7.5
      },
      tuition: { annual: 22227, currency: 'GBP' },
      programs: ['自然科学', '工程', '医学', '人文', '社会科学'],
      tags: ['英国顶尖', '历史悠久', '学术声誉', '诺贝尔奖'],
      tier: 'match',
      mountainImage: 'alps',
      acceptanceRate: 21.0,
      graduateEmploymentRate: 96.8,
      averageSalary: 45000
    },
    {
      id: 'toronto',
      name: '多伦多大学',
      nameEn: 'University of Toronto',
      location: 'Toronto, ON',
      country: 'Canada',
      continent: 'North America',
      ranking: { world: 18, us: 0, uk: 0, times: 18 },
      requirements: {
        minGPA: 3.5,
        satRange: [1350, 1480],
        toeflMin: 100,
        ieltsMin: 6.5
      },
      tuition: { annual: 58160, currency: 'CAD' },
      programs: ['医学', '工程', '商科', '人文', '理学'],
      tags: ['加拿大top1', '性价比高', '多元文化', '研究型'],
      tier: 'safety',
      mountainImage: 'rockies',
      acceptanceRate: 43.0,
      graduateEmploymentRate: 93.5,
      averageSalary: 55000
    }
  ]

  // 根据学生信息智能匹配大学
  matchUniversities(studentProfile: any): University[] {
    const { gpa, satScore, toeflScore, ieltsScore, interests, budget, targetCountries } = studentProfile
    
    let matchedUniversities = this.universities.filter(uni => {
      // 基本成绩筛选
      if (gpa < uni.requirements.minGPA - 0.3) return false
      if (satScore && (satScore < uni.requirements.satRange[0] - 100)) return false
      if (toeflScore && toeflScore < uni.requirements.toeflMin - 10) return false
      if (ieltsScore && ieltsScore < uni.requirements.ieltsMin - 0.5) return false
      
      // 国家偏好筛选
      if (targetCountries && targetCountries.length > 0 && !targetCountries.includes(uni.country)) {
        return false
      }
      
      // 预算筛选
      if (budget && uni.tuition.annual > budget * 1.2) return false
      
      return true
    })

    // 计算匹配分数并排序
    matchedUniversities = matchedUniversities.map(uni => {
      let matchScore = 0
      
      // GPA匹配度 (40%)
      const gpaMatch = Math.max(0, 100 - Math.abs(gpa - uni.requirements.minGPA) * 50)
      matchScore += gpaMatch * 0.4
      
      // 考试成绩匹配度 (30%)
      let testMatch = 0
      if (satScore) {
        const satMid = (uni.requirements.satRange[0] + uni.requirements.satRange[1]) / 2
        testMatch = Math.max(0, 100 - Math.abs(satScore - satMid) / 10)
      }
      if (toeflScore) {
        testMatch = Math.max(testMatch, Math.max(0, 100 - Math.abs(toeflScore - uni.requirements.toeflMin) * 2))
      }
      matchScore += testMatch * 0.3
      
      // 兴趣匹配度 (20%)
      if (interests && interests.length > 0) {
        const interestMatch = interests.some((interest: string) => 
          uni.programs.some(program => program.includes(interest))
        ) ? 80 : 40
        matchScore += interestMatch * 0.2
      } else {
        matchScore += 50 * 0.2
      }
      
      // 预算匹配度 (10%)
      const budgetMatch = budget ? Math.max(0, 100 - (uni.tuition.annual - budget) / budget * 50) : 70
      matchScore += budgetMatch * 0.1
      
      return {
        ...uni,
        matchScore: Math.round(Math.min(100, Math.max(0, matchScore)))
      }
    })

    // 按匹配分数排序
    matchedUniversities.sort((a, b) => (b as any).matchScore - (a as any).matchScore)
    
    return matchedUniversities.slice(0, 6)
  }

  // 获取山峰背景图片
  getMountainImages(): Record<string, string> {
    return {
      everest: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80',
      fuji: 'https://images.unsplash.com/photo-1576161787924-01bb08dad4a4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80',
      alps: 'https://images.unsplash.com/photo-1464822759844-d150ad6867d9?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80',
      rockies: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80'
    }
  }

  // 生成个性化升学路径
  generatePathway(student: any, targetUniversity: University): any[] {
    const currentDate = new Date()
    const milestones = []
    
    // 基于目标学校要求和学生现状生成里程碑
    const gpaGap = targetUniversity.requirements.minGPA - (student.gpa || 3.0)
    const satGap = targetUniversity.requirements.satRange[0] - (student.satScore || 1200)
    const toeflGap = targetUniversity.requirements.toeflMin - (student.toeflScore || 80)
    
    // 学术提升阶段
    if (gpaGap > 0) {
      milestones.push({
        title: 'GPA提升计划',
        description: `目标：提升GPA至${targetUniversity.requirements.minGPA}+`,
        deadline: this.addMonths(currentDate, 6),
        status: 'in-progress',
        icon: 'fas fa-chart-line',
        progress: gpaGap > 0.5 ? 20 : 60
      })
    }
    
    // 标准化考试阶段
    if (satGap > 0 || toeflGap > 0) {
      milestones.push({
        title: '标准化考试冲刺',
        description: `SAT目标：${targetUniversity.requirements.satRange[0]}+ | TOEFL目标：${targetUniversity.requirements.toeflMin}+`,
        deadline: this.addMonths(currentDate, 8),
        status: 'pending',
        icon: 'fas fa-pencil-alt',
        progress: 0
      })
    }
    
    // 课外活动阶段
    milestones.push({
      title: '背景提升计划',
      description: '丰富课外活动和实习经历',
      deadline: this.addMonths(currentDate, 10),
      status: 'pending',
      icon: 'fas fa-users',
      progress: 0
    })
    
    // 申请准备阶段
    milestones.push({
      title: '申请材料准备',
      description: '文书写作和推荐信收集',
      deadline: this.addMonths(currentDate, 12),
      status: 'pending',
      icon: 'fas fa-file-alt',
      progress: 0
    })
    
    return milestones
  }
  
  private addMonths(date: Date, months: number): string {
    const result = new Date(date)
    result.setMonth(result.getMonth() + months)
    return result.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long' })
  }
}

export const universityDatabase = new UniversityDatabaseService()
