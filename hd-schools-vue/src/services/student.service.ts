import api from './api'
import type { IStudent } from '@/types/teacher-dashboard'

interface StudentListParams {
  page?: number
  limit?: number
  grade?: string
  class?: string
  search?: string
}

interface StudentListResponse {
  success: boolean
  data: {
    students: IStudent[]
    pagination: {
      total: number
      page: number
      limit: number
      pages: number
    }
  }
}

export const studentService = {
  // 获取学生列表
  async getStudents(params: StudentListParams = {}): Promise<StudentListResponse> {
    return api.get('/students', { params })
  },
  
  // 获取单个学生详情
  async getStudent(id: string) {
    return api.get(`/students/${id}`)
  },
  
  // 创建学生
  async createStudent(data: Partial<IStudent>) {
    return api.post('/students', data)
  },
  
  // 更新学生信息
  async updateStudent(id: string, data: Partial<IStudent>) {
    return api.put(`/students/${id}`, data)
  },
  
  // 添加关联教师
  async addTeacher(studentId: string, teacherData: {
    teacherId: string
    role: string
    subjects?: string[]
  }) {
    return api.post(`/students/${studentId}/teachers`, teacherData)
  },
  
  // 更新目标大学
  async updateTargetUniversity(studentId: string, data: {
    university: any
    reason: string
  }) {
    return api.put(`/students/${studentId}/target-university`, data)
  }
}