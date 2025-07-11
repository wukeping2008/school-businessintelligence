// 基础类型定义
export type Campus = 'shanghai' | 'beijing' | 'ningbo'

export type InteractionType = '学习表现' | '课堂互动' | '课外活动' | '品格表现' | '创意表达'

export type AcademicLevel = 'beginner' | 'intermediate' | 'advanced'

// 学生相关类型
export interface Student {
  id: string
  name: string
  grade: string
  campus: Campus
  profile: StudentProfile
  createdAt: Date
  updatedAt: Date
}

export interface StudentProfile {
  interests: string[]
  academicLevel: AcademicLevel
  goals: string[]
  strengths: string[]
  weaknesses?: string[]
  parentContact?: ContactInfo
}

export interface ContactInfo {
  email: string
  phone: string
  wechat?: string
}

// 互动记录类型
export interface InteractionRecord {
  id: string
  studentId: string
  type: InteractionType
  content: string
  teacher: string
  timestamp: Date
  tags: string[]
  emotion?: EmotionScore
  isShared: boolean
  shareDate?: Date
}

export interface EmotionScore {
  positive: number
  negative: number
  neutral: number
  warmth: number
  confidence: number
}

// 学业数据类型
export interface AcademicData {
  studentId: string
  subjects: SubjectScore[]
  trends: TrendData[]
  predictions: PredictionData[]
  lastUpdated: Date
}

export interface SubjectScore {
  subject: string
  score: number
  maxScore: number
  trend: 'up' | 'down' | 'stable'
  comments?: string
}

export interface TrendData {
  date: string
  subject: string
  score: number
}

export interface PredictionData {
  subject: string
  predictedScore: number
  confidence: number
  timeframe: string
  recommendations: string[]
}

// 升学指导类型
export interface GuidanceData {
  studentId: string
  currentGoals: Goal[]
  pathway: PathwayNode[]
  milestones: Milestone[]
  progress: ProgressItem[]
  resources: Resource[]
}

export interface Goal {
  id: string
  title: string
  description: string
  targetDate: Date
  priority: 'high' | 'medium' | 'low'
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled'
  progress: number
}

export interface PathwayNode {
  id: string
  title: string
  description: string
  type: 'academic' | 'extracurricular' | 'test' | 'application'
  position: { x: number; y: number; z?: number }
  connections: string[]
  status: 'completed' | 'current' | 'upcoming' | 'optional'
  estimatedDuration: string
}

export interface Milestone {
  id: string
  title: string
  description: string
  dueDate: Date
  status: 'completed' | 'in-progress' | 'overdue' | 'upcoming'
  importance: 'critical' | 'important' | 'normal'
  dependencies: string[]
}

export interface ProgressItem {
  id: string
  category: string
  title: string
  current: number
  target: number
  unit: string
  lastUpdated: Date
}

export interface Resource {
  id: string
  title: string
  type: 'course' | 'book' | 'website' | 'tutor' | 'program'
  description: string
  url?: string
  rating: number
  tags: string[]
  recommended: boolean
}

// AI相关类型
export interface AIResponse<T = any> {
  success: boolean
  data: T
  confidence: number
  timestamp: Date
  error?: string
}

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: Date
  metadata?: Record<string, any>
}

export interface AIAnalysisResult {
  summary: string
  insights: string[]
  recommendations: string[]
  confidence: number
  dataPoints: Record<string, any>
}

// 招生咨询类型
export interface AdmissionQuestion {
  id: string
  type: 'single' | 'multiple' | 'text' | 'scale'
  question: string
  options?: string[]
  required: boolean
  category: string
}

export interface AdmissionAnswer {
  questionId: string
  value: string | string[] | number
  timestamp: Date
}

export interface AdmissionReport {
  studentProfile: StudentProfile
  recommendations: {
    courses: CourseRecommendation[]
    timeline: TimelineItem[]
    expectations: string[]
    milestones: string[]
  }
  generatedAt: Date
  confidence: number
}

export interface CourseRecommendation {
  course: string
  reason: string
  priority: number
  prerequisites?: string[]
}

export interface TimelineItem {
  phase: string
  duration: string
  activities: string[]
  goals: string[]
}

// 校区主题类型
export interface CampusTheme {
  primary: string
  secondary: string
  accent: string
  name: string
}

// 通用API响应类型
export interface ApiResponse<T = any> {
  code: number
  message: string
  data: T
  timestamp: Date
}

// 分页类型
export interface PaginationParams {
  page: number
  pageSize: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

// 表单验证类型
export interface ValidationRule {
  required?: boolean
  min?: number
  max?: number
  pattern?: RegExp
  validator?: (value: any) => boolean | string
  message?: string
}

export interface FormField {
  name: string
  label: string
  type: 'text' | 'email' | 'phone' | 'select' | 'textarea' | 'date' | 'number'
  rules?: ValidationRule[]
  options?: { label: string; value: any }[]
  placeholder?: string
  disabled?: boolean
}

// 通知类型
export interface Notification {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message: string
  duration?: number
  timestamp: Date
}

// 用户类型
export interface User {
  id: string
  name: string
  email: string
  role: 'admin' | 'teacher' | 'parent' | 'student'
  campus: Campus
  avatar?: string
  permissions: string[]
  lastLogin?: Date
}

// 导出所有类型
// 其他模块类型定义将在后续添加
