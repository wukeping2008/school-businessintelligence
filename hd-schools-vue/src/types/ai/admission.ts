/**
 * 招生咨询AI相关类型定义
 */

// 对话消息类型
export interface ChatMessage {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: Date
  metadata?: {
    intent?: string // 意图识别
    entities?: Record<string, any> // 实体提取
    confidence?: number // 置信度
  }
}

// 对话会话
export interface ChatSession {
  id: string
  startTime: Date
  endTime?: Date
  messages: ChatMessage[]
  studentProfile: Partial<StudentProfile>
  status: 'active' | 'completed' | 'abandoned'
  summary?: string
}

// 学生画像
export interface StudentProfile {
  // 基本信息
  studentName: string
  age: number
  currentGrade: string
  currentSchool?: string
  
  // 学术信息
  academicStrengths: string[]
  academicWeaknesses?: string[]
  gpa?: number
  standardizedTests?: {
    type: string
    score: number
    date: string
  }[]
  
  // 兴趣特长
  interests: string[]
  extracurriculars: string[]
  achievements?: string[]
  
  // 语言能力
  languageAbilities: {
    language: string
    proficiency: 'native' | 'fluent' | 'intermediate' | 'basic'
    certifications?: string[]
  }[]
  
  // 目标规划
  targetUniversities: string[]
  targetMajors?: string[]
  careerGoals: string[]
  
  // 家长期望
  parentExpectations: string[]
  
  // 特殊需求
  specialNeeds?: string[]
  
  // AI分析结果
  analysis?: {
    strengths: string[]
    opportunities: string[]
    challenges: string[]
    recommendations: string[]
    matchScore: number // 与学校匹配度 0-100
  }
}

// 学业规划报告
export interface AcademicPlanReport {
  studentProfile: StudentProfile
  generatedAt: Date
  
  // 个性化建议
  recommendations: {
    courses: CourseRecommendation[]
    activities: ActivityRecommendation[]
    timeline: TimelineMilestone[]
  }
  
  // 升学路径
  pathways: {
    primary: PathwayOption
    alternatives: PathwayOption[]
  }
  
  // 发展预测
  predictions: {
    academicGrowth: GrowthPrediction
    universityAdmission: AdmissionPrediction
    careerProspects: CareerPrediction
  }
  
  // 行动计划
  actionPlan: ActionItem[]
}

// 课程推荐
export interface CourseRecommendation {
  courseName: string
  level: 'standard' | 'honors' | 'AP' | 'IB'
  reason: string
  priority: 'required' | 'recommended' | 'optional'
  timing: string // e.g., "Grade 10 - Semester 1"
}

// 活动推荐
export interface ActivityRecommendation {
  activityName: string
  category: 'academic' | 'sports' | 'arts' | 'leadership' | 'community'
  reason: string
  expectedOutcome: string
}

// 时间线里程碑
export interface TimelineMilestone {
  date: string
  title: string
  description: string
  category: 'academic' | 'test' | 'application' | 'activity'
  importance: 'critical' | 'important' | 'suggested'
}

// 升学路径选项
export interface PathwayOption {
  name: string
  description: string
  requirements: string[]
  advantages: string[]
  challenges: string[]
  successRate: number // 0-100
}

// 成长预测
export interface GrowthPrediction {
  currentLevel: number
  predictedLevel: number
  growthRate: string
  keyFactors: string[]
}

// 录取预测
export interface AdmissionPrediction {
  targetUniversities: {
    name: string
    admissionProbability: number // 0-100
    requirements: string[]
    gaps?: string[]
  }[]
}

// 职业预测
export interface CareerPrediction {
  recommendedFields: string[]
  growthPotential: string
  marketDemand: string
  preparationSteps: string[]
}

// 行动项
export interface ActionItem {
  id: string
  title: string
  description: string
  deadline: string
  priority: 'high' | 'medium' | 'low'
  responsible: 'student' | 'parent' | 'school'
  status: 'pending' | 'in-progress' | 'completed'
}

// AI服务响应
export interface AIResponse {
  success: boolean
  data?: any
  error?: {
    code: string
    message: string
    details?: any
  }
  usage?: {
    promptTokens: number
    completionTokens: number
    totalTokens: number
  }
}