import { defineStore } from 'pinia'
import type { 
  IStudent, 
  IPathway, 
  IMilestone, 
  ICollaboration,
  INotification,
  IActionItem
} from '@/types/teacher-dashboard'

interface TeacherDashboardState {
  // 学生相关
  students: IStudent[]
  currentStudent: IStudent | null
  studentsLoading: boolean
  
  // 路径相关
  pathways: IPathway[]
  currentPathway: IPathway | null
  pathwaysLoading: boolean
  
  // 里程碑相关
  milestones: IMilestone[]
  currentMilestone: IMilestone | null
  milestonesLoading: boolean
  
  // 协同相关
  collaborations: ICollaboration[]
  activeCollaboration: ICollaboration | null
  
  // 通知相关
  notifications: INotification[]
  unreadCount: number
  
  // 任务相关
  actionItems: IActionItem[]
  
  // 筛选和搜索
  filters: {
    searchQuery: string
    grade: string
    class: string
    status: string
    teacherId?: string
  }
  
  // 视图状态
  viewMode: 'timeline' | 'gantt' | 'kanban'
}

export const useTeacherDashboardStore = defineStore('teacherDashboard', {
  state: (): TeacherDashboardState => ({
    // 学生相关
    students: [],
    currentStudent: null,
    studentsLoading: false,
    
    // 路径相关
    pathways: [],
    currentPathway: null,
    pathwaysLoading: false,
    
    // 里程碑相关
    milestones: [],
    currentMilestone: null,
    milestonesLoading: false,
    
    // 协同相关
    collaborations: [],
    activeCollaboration: null,
    
    // 通知相关
    notifications: [],
    unreadCount: 0,
    
    // 任务相关
    actionItems: [],
    
    // 筛选和搜索
    filters: {
      searchQuery: '',
      grade: '',
      class: '',
      status: ''
    },
    
    // 视图状态
    viewMode: 'timeline'
  }),
  
  getters: {
    // 过滤后的学生列表
    filteredStudents: (state) => {
      let result = state.students
      
      if (state.filters.searchQuery) {
        const query = state.filters.searchQuery.toLowerCase()
        result = result.filter(student => 
          student.basicInfo.name.toLowerCase().includes(query) ||
          student.basicInfo.studentId.toLowerCase().includes(query)
        )
      }
      
      if (state.filters.grade) {
        result = result.filter(student => 
          student.basicInfo.grade === state.filters.grade
        )
      }
      
      if (state.filters.class) {
        result = result.filter(student => 
          student.basicInfo.class === state.filters.class
        )
      }
      
      if (state.filters.status) {
        result = result.filter(student => 
          student.status === state.filters.status
        )
      }
      
      return result
    },
    
    // 风险学生
    riskStudents: (state) => {
      return state.students.filter(student => student.status === 'risk')
    },
    
    // 需要关注的学生
    attentionStudents: (state) => {
      return state.students.filter(student => student.status === 'attention')
    },
    
    // 当前学生的路径
    currentStudentPathways: (state) => {
      if (!state.currentStudent) return []
      return state.pathways.filter(pathway => 
        pathway.studentId === state.currentStudent!._id
      )
    },
    
    // 当前路径的里程碑
    currentPathwayMilestones: (state) => {
      if (!state.currentPathway) return []
      return state.milestones.filter(milestone =>
        milestone.pathwayId === state.currentPathway!._id
      )
    },
    
    // 按状态分组的里程碑（用于看板视图）
    milestonesByStatus: (state) => {
      const grouped = {
        pending: [] as IMilestone[],
        in_progress: [] as IMilestone[],
        completed: [] as IMilestone[],
        delayed: [] as IMilestone[]
      }
      
      state.currentPathwayMilestones.forEach(milestone => {
        if (milestone.status in grouped) {
          grouped[milestone.status as keyof typeof grouped].push(milestone)
        }
      })
      
      return grouped
    },
    
    // 即将到期的里程碑
    upcomingMilestones: (state) => {
      const threeDaysFromNow = new Date()
      threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3)
      
      return state.milestones.filter(milestone => {
        if (milestone.status === 'completed') return false
        if (!milestone.dueDate) return false
        return new Date(milestone.dueDate) <= threeDaysFromNow
      }).sort((a, b) => 
        new Date(a.dueDate!).getTime() - new Date(b.dueDate!).getTime()
      )
    },
    
    // 进行中的里程碑
    activeMilestones: (state) => {
      return state.milestones.filter(m => m.status === 'in_progress')
    },
    
    // 待处理的任务
    pendingActionItems: (state) => {
      return state.actionItems.filter(item => 
        item.status === 'pending' || item.status === 'in_progress'
      )
    },
    
    // 未读通知
    unreadNotifications: (state) => {
      return state.notifications.filter(n => !n.read)
    }
  },
  
  actions: {
    // 获取学生列表
    async fetchStudents() {
      this.studentsLoading = true
      try {
        // TODO: 调用API获取学生数据
        // const response = await api.getStudents(this.filters)
        // this.students = response.data
        
        // 临时模拟数据
        this.students = generateMockStudents()
      } catch (error) {
        console.error('获取学生列表失败:', error)
        throw error
      } finally {
        this.studentsLoading = false
      }
    },
    
    // 设置当前学生
    setCurrentStudent(student: IStudent | null) {
      this.currentStudent = student
      if (student) {
        this.fetchStudentDetails(student._id)
      }
    },
    
    // 获取学生详情
    async fetchStudentDetails(studentId: string) {
      try {
        // TODO: 调用API获取学生详细信息
        // const response = await api.getStudentDetails(studentId)
        // this.currentStudent = response.data
        
        // 同时获取相关的路径和里程碑
        await Promise.all([
          this.fetchStudentPathways(studentId),
          this.fetchStudentMilestones(studentId)
        ])
      } catch (error) {
        console.error('获取学生详情失败:', error)
        throw error
      }
    },
    
    // 获取学生的升学路径
    async fetchStudentPathways(studentId: string) {
      this.pathwaysLoading = true
      try {
        // TODO: 调用API
        // const response = await api.getStudentPathways(studentId)
        // this.pathways = response.data
        
        // 临时模拟数据
        this.pathways = generateMockPathways(studentId)
        
        // 默认选择第一个路径
        if (this.pathways.length > 0 && !this.currentPathway) {
          this.currentPathway = this.pathways[0]
        }
      } catch (error) {
        console.error('获取升学路径失败:', error)
        throw error
      } finally {
        this.pathwaysLoading = false
      }
    },
    
    // 获取学生的里程碑
    async fetchStudentMilestones(studentId: string) {
      this.milestonesLoading = true
      try {
        // TODO: 调用API
        // const response = await api.getStudentMilestones(studentId)
        // this.milestones = response.data
        
        // 临时模拟数据
        const pathwayIds = this.pathways
          .filter(p => p.studentId === studentId)
          .map(p => p._id)
        this.milestones = generateMockMilestones(pathwayIds)
      } catch (error) {
        console.error('获取里程碑失败:', error)
        throw error
      } finally {
        this.milestonesLoading = false
      }
    },
    
    // 创建新里程碑
    async createMilestone(milestoneData: Omit<IMilestone, '_id' | 'createdAt' | 'updatedAt'>) {
      try {
        // TODO: 调用API
        // const response = await api.createMilestone(milestoneData)
        // this.milestones.push(response.data)
        
        // 临时模拟
        const newMilestone: IMilestone = {
          ...milestoneData,
          _id: Date.now().toString(),
          createdAt: new Date(),
          updatedAt: new Date()
        }
        this.milestones.push(newMilestone)
        return newMilestone
      } catch (error) {
        console.error('创建里程碑失败:', error)
        throw error
      }
    },
    
    // 更新里程碑
    async updateMilestone(milestoneId: string, updates: Partial<IMilestone>) {
      try {
        // TODO: 调用API
        // const response = await api.updateMilestone(milestoneId, updates)
        
        // 更新本地状态
        const index = this.milestones.findIndex(m => m._id === milestoneId)
        if (index !== -1) {
          this.milestones[index] = { 
            ...this.milestones[index], 
            ...updates,
            updatedAt: new Date()
          }
        }
        
        if (this.currentMilestone?._id === milestoneId) {
          this.currentMilestone = { 
            ...this.currentMilestone, 
            ...updates,
            updatedAt: new Date()
          }
        }
      } catch (error) {
        console.error('更新里程碑失败:', error)
        throw error
      }
    },
    
    // 更新里程碑状态
    async updateMilestoneStatus(milestoneId: string, newStatus: IMilestone['status']) {
      await this.updateMilestone(milestoneId, { status: newStatus })
    },
    
    // 更新里程碑进度
    async updateMilestoneProgress(milestoneId: string, progress: number) {
      await this.updateMilestone(milestoneId, { progress })
    },
    
    // 删除里程碑
    async deleteMilestone(milestoneId: string) {
      try {
        // TODO: 调用API
        // await api.deleteMilestone(milestoneId)
        
        // 更新本地状态
        this.milestones = this.milestones.filter(m => m._id !== milestoneId)
        if (this.currentMilestone?._id === milestoneId) {
          this.currentMilestone = null
        }
      } catch (error) {
        console.error('删除里程碑失败:', error)
        throw error
      }
    },
    
    // 设置当前里程碑
    setCurrentMilestone(milestone: IMilestone | null) {
      this.currentMilestone = milestone
    },
    
    // 设置当前路径
    setCurrentPathway(pathway: IPathway | null) {
      this.currentPathway = pathway
    },
    
    // 切换视图模式
    setViewMode(mode: TeacherDashboardState['viewMode']) {
      this.viewMode = mode
    },
    
    // 更新学生信息
    async updateStudent(studentId: string, updates: Partial<IStudent>) {
      try {
        // TODO: 调用API
        // const response = await api.updateStudent(studentId, updates)
        
        // 更新本地状态
        const index = this.students.findIndex(s => s._id === studentId)
        if (index !== -1) {
          this.students[index] = { ...this.students[index], ...updates }
        }
        
        if (this.currentStudent?._id === studentId) {
          this.currentStudent = { ...this.currentStudent, ...updates }
        }
      } catch (error) {
        console.error('更新学生信息失败:', error)
        throw error
      }
    },
    
    // 创建新学生
    async createStudent(studentData: Omit<IStudent, '_id' | 'createdAt' | 'updatedAt'>) {
      try {
        // TODO: 调用API
        // const response = await api.createStudent(studentData)
        // this.students.unshift(response.data)
        
        // 临时模拟
        const newStudent: IStudent = {
          ...studentData,
          _id: Date.now().toString(),
          createdAt: new Date(),
          updatedAt: new Date()
        }
        this.students.unshift(newStudent)
        return newStudent
      } catch (error) {
        console.error('创建学生失败:', error)
        throw error
      }
    },
    
    // 更新筛选条件
    updateFilters(filters: Partial<TeacherDashboardState['filters']>) {
      this.filters = { ...this.filters, ...filters }
    },
    
    // 重置筛选条件
    resetFilters() {
      this.filters = {
        searchQuery: '',
        grade: '',
        class: '',
        status: ''
      }
    },
    
    // 获取通知
    async fetchNotifications() {
      try {
        // TODO: 调用API
        // const response = await api.getNotifications()
        // this.notifications = response.data
        
        // 临时模拟数据
        this.notifications = generateMockNotifications()
        this.unreadCount = this.unreadNotifications.length
      } catch (error) {
        console.error('获取通知失败:', error)
        throw error
      }
    },
    
    // 标记通知为已读
    async markNotificationAsRead(notificationId: string) {
      try {
        // TODO: 调用API
        // await api.markNotificationAsRead(notificationId)
        
        // 更新本地状态
        const notification = this.notifications.find(n => n._id === notificationId)
        if (notification) {
          notification.read = true
          this.unreadCount = this.unreadNotifications.length
        }
      } catch (error) {
        console.error('标记通知失败:', error)
        throw error
      }
    },
    
    // 创建协同会话
    async createCollaboration(studentId: string, teacherIds: string[]) {
      try {
        // TODO: 调用API创建协同会话
        // const response = await api.createCollaboration({ studentId, teacherIds })
        // this.activeCollaboration = response.data
        
        // 临时模拟
        const collaboration: ICollaboration = {
          _id: Date.now().toString(),
          studentId,
          initiatorId: 'current-teacher-id',
          participants: teacherIds.map(id => ({
            teacherId: id,
            joinedAt: new Date(),
            status: 'active' as const
          })),
          messages: [],
          status: 'active',
          createdAt: new Date(),
          updatedAt: new Date()
        }
        this.collaborations.push(collaboration)
        this.activeCollaboration = collaboration
        return collaboration
      } catch (error) {
        console.error('创建协同会话失败:', error)
        throw error
      }
    }
  }
})

// 模拟数据生成函数
function generateMockStudents(): IStudent[] {
  const names = ['李明', '王芳', '张伟', '刘洋', '陈静', '赵强', '周敏', '吴昊']
  const grades = ['高一', '高二', '高三']
  const classes = ['1', '2', '3', '4']
  const universities = [
    { name: '剑桥大学', country: '英国', ranking: 2 },
    { name: '牛津大学', country: '英国', ranking: 1 },
    { name: '哈佛大学', country: '美国', ranking: 3 },
    { name: 'MIT', country: '美国', ranking: 4 },
    { name: '斯坦福大学', country: '美国', ranking: 5 }
  ]
  const majors = ['计算机科学', '经济学', '物理学', '数学', '工程学', '医学']
  
  return names.map((name, index) => ({
    _id: (index + 1).toString(),
    basicInfo: {
      name,
      grade: grades[Math.floor(Math.random() * grades.length)],
      class: classes[Math.floor(Math.random() * classes.length)],
      studentId: `S202300${String(index + 1).padStart(2, '0')}`,
      enrollmentDate: new Date(2023, 8, 1)
    },
    targetUniversities: {
      primary: {
        id: (index + 1).toString(),
        ...universities[index % universities.length],
        major: majors[Math.floor(Math.random() * majors.length)],
        requirements: {}
      },
      alternatives: [],
      lastUpdated: new Date()
    },
    academicStatus: {
      currentGPA: 3.5 + Math.random() * 0.5,
      subjects: [],
      standardizedTests: []
    },
    relatedTeachers: [],
    status: Math.random() > 0.8 ? 'risk' : Math.random() > 0.6 ? 'attention' : 'normal',
    pathwayProgress: Math.floor(Math.random() * 100),
    createdAt: new Date(),
    updatedAt: new Date()
  }))
}

function generateMockPathways(studentId: string): IPathway[] {
  return [{
    _id: `pathway-${studentId}`,
    studentId,
    name: '英国G5申请路径',
    description: '目标申请英国G5大学的完整升学规划',
    targetUniversity: {
      id: '1',
      name: '剑桥大学',
      country: '英国',
      major: '计算机科学',
      ranking: 2,
      requirements: {}
    },
    milestones: [],
    overallProgress: 65,
    status: 'active',
    createdBy: 'teacher-1',
    createdAt: new Date(),
    updatedAt: new Date()
  }]
}

function generateMockMilestones(pathwayIds: string[]): IMilestone[] {
  const milestoneTemplates = [
    { title: '完成A-Level选课', category: 'academic', daysFromNow: -30 },
    { title: '雅思考试准备', category: 'test', daysFromNow: 7 },
    { title: '参加数学竞赛', category: 'extracurricular', daysFromNow: 14 },
    { title: '撰写个人陈述', category: 'application', daysFromNow: 30 },
    { title: '准备推荐信', category: 'application', daysFromNow: 45 }
  ]
  
  return pathwayIds.flatMap(pathwayId =>
    milestoneTemplates.map((template, index) => {
      const dueDate = new Date()
      dueDate.setDate(dueDate.getDate() + template.daysFromNow)
      
      return {
        _id: `${pathwayId}-milestone-${index + 1}`,
        pathwayId,
        title: template.title,
        description: `${template.title}的详细计划和要求`,
        category: template.category as IMilestone['category'],
        status: template.daysFromNow < 0 ? 'completed' : 
                template.daysFromNow < 14 ? 'in_progress' : 'pending' as IMilestone['status'],
        priority: template.daysFromNow < 7 ? 'high' : 
                 template.daysFromNow < 30 ? 'medium' : 'low' as IMilestone['priority'],
        startDate: new Date(),
        dueDate,
        progress: template.daysFromNow < 0 ? 100 : 
                 template.daysFromNow < 14 ? Math.floor(Math.random() * 80) : 0,
        assignedTo: [],
        attachments: [],
        comments: [],
        createdBy: 'teacher-1',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    })
  )
}

function generateMockNotifications(): INotification[] {
  return [
    {
      _id: '1',
      type: 'milestone_due',
      title: '里程碑即将到期',
      content: '学生李明的"雅思考试准备"里程碑将在3天后到期',
      priority: 'high',
      read: false,
      relatedStudent: '1',
      relatedMilestone: 'milestone-1',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      _id: '2',
      type: 'collaboration_invite',
      title: '协同邀请',
      content: '英语老师邀请您参与学生王芳的升学规划讨论',
      priority: 'medium',
      read: false,
      relatedStudent: '2',
      actionRequired: true,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ]
}