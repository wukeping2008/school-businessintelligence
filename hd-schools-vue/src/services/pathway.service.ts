import api from './api'
import type { IPathway, IMilestone } from '@/types/teacher-dashboard'

export const pathwayService = {
  // 获取学生的升学路径
  async getStudentPathway(studentId: string) {
    return api.get(`/pathways/student/${studentId}`)
  },
  
  // 创建升学路径
  async createPathway(data: {
    studentId: string
    targetUniversity: any
    milestones: IMilestone[]
  }) {
    return api.post('/pathways', data)
  },
  
  // 更新里程碑
  async updateMilestone(
    pathwayId: string, 
    milestoneId: string, 
    updates: Partial<IMilestone>
  ) {
    return api.put(`/pathways/${pathwayId}/milestones/${milestoneId}`, updates)
  },
  
  // 添加里程碑
  async addMilestone(pathwayId: string, milestone: Partial<IMilestone>) {
    return api.post(`/pathways/${pathwayId}/milestones`, milestone)
  },
  
  // 更新里程碑进度
  async updateMilestoneProgress(
    pathwayId: string, 
    milestoneId: string, 
    progress: number
  ) {
    return api.patch(`/pathways/${pathwayId}/milestones/${milestoneId}/progress`, {
      progress
    })
  },
  
  // 添加Action Item
  async addActionItem(
    pathwayId: string,
    milestoneId: string,
    actionItem: {
      title: string
      assignedTo: string
      priority: string
      description?: string
      dueDate?: Date
    }
  ) {
    return api.post(
      `/pathways/${pathwayId}/milestones/${milestoneId}/action-items`,
      actionItem
    )
  }
}