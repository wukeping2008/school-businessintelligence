<template>
  <div class="teacher-dashboard-collaborative">
    <div class="dashboard-header">
      <h1>教师协同工作台</h1>
      <p>多方协作 · 动态调整 · 目标达成</p>
    </div>

    <div class="dashboard-content">
      <!-- 学生选择 -->
      <div class="student-selector-section">
        <h2>选择学生</h2>
        <el-select 
          v-model="selectedStudentId" 
          placeholder="请选择学生"
          @change="loadStudentData"
          style="width: 300px"
        >
          <el-option
            v-for="student in studentList"
            :key="student.id"
            :label="student.name"
            :value="student.id"
          >
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <span>{{ student.name }}</span>
              <span style="font-size: 12px; color: #999;">{{ student.target }}</span>
            </div>
          </el-option>
        </el-select>
      </div>

      <!-- 当前学生信息 -->
      <div v-if="currentStudent" class="student-info-section">
        <h2>{{ currentStudent.name }} - 升学进度</h2>
        <div class="student-stats">
          <div class="stat-card">
            <h3>目标大学</h3>
            <p>{{ currentStudent.target }}</p>
          </div>
          <div class="stat-card">
            <h3>整体进度</h3>
            <el-progress :percentage="currentStudent.progress" />
          </div>
          <div class="stat-card">
            <h3>剩余天数</h3>
            <p class="countdown">{{ daysRemaining }} 天</p>
          </div>
          <div class="stat-card">
            <h3>协作教师</h3>
            <el-avatar-group :max="3">
              <el-avatar 
                v-for="teacher in onlineTeachers" 
                :key="teacher.id"
                :size="24"
                :title="teacher.name + ' - ' + teacher.subject"
              >
                {{ teacher.name.charAt(0) }}
              </el-avatar>
            </el-avatar-group>
          </div>
        </div>
      </div>

      <!-- 里程碑列表 -->
      <div v-if="currentStudent" class="milestones-section">
        <div class="section-header">
          <h2>里程碑管理</h2>
          <div class="header-actions">
            <el-button @click="filterByTeacher = !filterByTeacher" :type="filterByTeacher ? 'primary' : ''">
              <el-icon><Filter /></el-icon>
              {{ filterByTeacher ? '显示全部' : '我的里程碑' }}
            </el-button>
            <el-button type="primary" @click="showAddDialog = true">
              <el-icon><Plus /></el-icon>
              添加里程碑
            </el-button>
          </div>
        </div>

        <div class="milestones-grid">
          <div 
            v-for="milestone in filteredMilestones" 
            :key="milestone.id"
            class="milestone-card"
            :class="[milestone.status, { 'has-update': milestone.hasUpdate }]"
          >
            <div class="milestone-header">
              <h4>{{ milestone.title }}</h4>
              <el-tag 
                :type="getStatusType(milestone.status)"
                size="small"
              >
                {{ getStatusLabel(milestone.status) }}
              </el-tag>
            </div>
            
            <p class="milestone-desc">{{ milestone.description }}</p>
            
            <div class="milestone-meta">
              <div class="milestone-date">
                <el-icon><Calendar /></el-icon>
                {{ formatDate(milestone.date) }}
              </div>
              <div class="milestone-priority">
                <el-tag 
                  :type="getPriorityType(milestone.priority)"
                  size="small"
                  effect="plain"
                >
                  {{ milestone.priority }}
                </el-tag>
              </div>
            </div>
            
            <!-- 负责教师 -->
            <div class="milestone-teachers">
              <span class="label">负责教师：</span>
              <el-avatar 
                v-for="teacher in milestone.assignedTeachers" 
                :key="teacher.id"
                :size="28"
                :title="teacher.name + ' - ' + teacher.subject"
                style="margin-right: 5px;"
              >
                {{ teacher.name.charAt(0) }}
              </el-avatar>
              <el-button 
                size="small" 
                circle 
                :icon="Plus"
                @click="assignTeacher(milestone)"
                title="分配教师"
              />
            </div>
            
            <div class="milestone-progress">
              <div class="progress-header">
                <span>进度: {{ milestone.progress }}%</span>
                <span class="last-update" v-if="milestone.lastUpdated">
                  {{ milestone.lastUpdatedBy }} 更新于 {{ formatTime(milestone.lastUpdated) }}
                </span>
              </div>
              <el-progress 
                :percentage="milestone.progress" 
                :status="milestone.progress === 100 ? 'success' : ''"
                :stroke-width="6"
              />
            </div>
            
            <div class="milestone-actions">
              <el-button size="small" @click="editMilestone(milestone)">
                编辑
              </el-button>
              <el-button 
                size="small" 
                type="success" 
                v-if="milestone.progress < 100"
                @click="updateProgress(milestone)"
              >
                更新进度
              </el-button>
              <el-button 
                size="small" 
                type="primary" 
                @click="showDiscussion(milestone)"
              >
                <el-badge :value="milestone.comments?.length || 0" :hidden="!milestone.comments?.length">
                  讨论
                </el-badge>
              </el-button>
            </div>
          </div>
        </div>
      </div>

      <!-- 空状态 -->
      <div v-if="!currentStudent" class="empty-state">
        <el-icon size="64"><User /></el-icon>
        <h3>请选择学生开始管理</h3>
        <p>选择一个学生来查看和管理他们的升学里程碑</p>
      </div>
    </div>

    <!-- 添加里程碑对话框 -->
    <el-dialog
      v-model="showAddDialog"
      title="添加新里程碑"
      width="600px"
    >
      <el-form :model="newMilestone" label-width="100px">
        <el-form-item label="标题">
          <el-input v-model="newMilestone.title" placeholder="例如：IELTS考试" />
        </el-form-item>
        
        <el-form-item label="描述">
          <el-input 
            v-model="newMilestone.description" 
            type="textarea"
            :rows="3"
            placeholder="详细描述里程碑内容"
          />
        </el-form-item>
        
        <el-form-item label="计划日期">
          <el-date-picker
            v-model="newMilestone.date"
            type="date"
            placeholder="选择日期"
          />
        </el-form-item>
        
        <el-form-item label="优先级">
          <el-select v-model="newMilestone.priority">
            <el-option label="关键" value="关键" />
            <el-option label="重要" value="重要" />
            <el-option label="普通" value="普通" />
          </el-select>
        </el-form-item>
        
        <el-form-item label="负责教师">
          <el-checkbox-group v-model="newMilestone.teachers">
            <el-checkbox 
              v-for="teacher in availableTeachers" 
              :key="teacher.id"
              :label="teacher.id"
            >
              {{ teacher.name }} ({{ teacher.subject }})
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      
      <template #footer>
        <el-button @click="showAddDialog = false">取消</el-button>
        <el-button type="primary" @click="addMilestone">确定</el-button>
      </template>
    </el-dialog>

    <!-- 编辑进度对话框 -->
    <el-dialog
      v-model="showProgressDialog"
      title="更新进度"
      width="500px"
    >
      <div v-if="editingMilestone">
        <h4>{{ editingMilestone.title }}</h4>
        <el-form label-width="100px">
          <el-form-item label="当前进度">
            <el-slider 
              v-model="newProgress" 
              :marks="{ 0: '0%', 25: '25%', 50: '50%', 75: '75%', 100: '100%' }"
              show-input
            />
          </el-form-item>
          <el-form-item label="更新说明">
            <el-input
              v-model="progressNote"
              type="textarea"
              :rows="3"
              placeholder="请说明进度更新的具体内容"
            />
          </el-form-item>
        </el-form>
      </div>
      
      <template #footer>
        <el-button @click="showProgressDialog = false">取消</el-button>
        <el-button type="primary" @click="saveProgress">保存</el-button>
      </template>
    </el-dialog>

    <!-- 教师分配对话框 -->
    <el-dialog
      v-model="showTeacherDialog"
      title="分配负责教师"
      width="500px"
    >
      <div v-if="assigningMilestone">
        <h4>{{ assigningMilestone.title }}</h4>
        <p>选择负责此里程碑的教师：</p>
        <el-checkbox-group v-model="selectedTeachers">
          <el-checkbox 
            v-for="teacher in availableTeachers" 
            :key="teacher.id"
            :label="teacher.id"
            style="display: block; margin-bottom: 10px;"
          >
            <el-space>
              <el-avatar :size="32">{{ teacher.name.charAt(0) }}</el-avatar>
              <div>
                <div>{{ teacher.name }}</div>
                <div style="font-size: 12px; color: #999;">{{ teacher.subject }}</div>
              </div>
            </el-space>
          </el-checkbox>
        </el-checkbox-group>
      </div>
      
      <template #footer>
        <el-button @click="showTeacherDialog = false">取消</el-button>
        <el-button type="primary" @click="saveTeacherAssignment">确定</el-button>
      </template>
    </el-dialog>

    <!-- 讨论抽屉 -->
    <el-drawer
      v-model="showDiscussionDrawer"
      :title="discussionMilestone?.title + ' - 协同讨论'"
      size="40%"
    >
      <div v-if="discussionMilestone" class="discussion-container">
        <!-- 讨论历史 -->
        <div class="discussion-history">
          <div 
            v-for="comment in discussionMilestone.comments" 
            :key="comment.id"
            class="comment-item"
          >
            <el-avatar :size="32">{{ comment.author.charAt(0) }}</el-avatar>
            <div class="comment-content">
              <div class="comment-header">
                <strong>{{ comment.author }}</strong>
                <span class="comment-time">{{ formatTime(comment.time) }}</span>
              </div>
              <p>{{ comment.content }}</p>
              <div v-if="comment.type === 'progress'" class="comment-progress">
                <el-tag size="small" type="success">进度更新</el-tag>
                <span>{{ comment.oldProgress }}% → {{ comment.newProgress }}%</span>
              </div>
            </div>
          </div>
          <el-empty v-if="!discussionMilestone.comments?.length" description="暂无讨论" />
        </div>
        
        <!-- 发送新评论 -->
        <div class="comment-input">
          <el-input
            v-model="newComment"
            type="textarea"
            :rows="3"
            placeholder="输入您的意见或建议..."
          />
          <el-button 
            type="primary" 
            @click="sendComment"
            :disabled="!newComment.trim()"
            style="margin-top: 10px;"
          >
            发送
          </el-button>
        </div>
      </div>
    </el-drawer>

    <!-- 实时协同状态栏 -->
    <div class="collaboration-bar" v-if="currentStudent">
      <div class="collab-info">
        <el-icon class="online-indicator"><CircleCheck /></el-icon>
        <span>在线协作中</span>
        <el-divider direction="vertical" />
        <span>当前在线：</span>
        <el-avatar-group :max="5" style="margin-left: 10px;">
          <el-avatar 
            v-for="teacher in onlineTeachers" 
            :key="teacher.id"
            :size="28"
            :title="teacher.name + ' (' + teacher.subject + ')'"
          >
            {{ teacher.name.charAt(0) }}
          </el-avatar>
        </el-avatar-group>
      </div>
      <div class="collab-actions">
        <el-button size="small" @click="inviteTeacher">
          <el-icon><Plus /></el-icon>
          邀请教师
        </el-button>
        <el-button size="small" type="primary" @click="startVideoCall">
          <el-icon><VideoCamera /></el-icon>
          发起会议
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElNotification } from 'element-plus'
import { Calendar, User, Plus, VideoCamera, Filter, CircleCheck } from '@element-plus/icons-vue'
import { useTeacherDashboardStore } from '@/stores/teacherDashboard'

// 使用store
const store = useTeacherDashboardStore()
const router = useRouter()

// 响应式数据
const selectedStudentId = ref('')
const currentStudent = ref<any>(null)
const showAddDialog = ref(false)
const showProgressDialog = ref(false)
const editingMilestone = ref<any>(null)
const newProgress = ref(0)
const progressNote = ref('')
const filterByTeacher = ref(false)
const currentTeacherId = ref('teacher-current') // 实际应从认证系统获取

// 协同相关
const showTeacherDialog = ref(false)
const assigningMilestone = ref<any>(null)
const selectedTeachers = ref<string[]>([])
const showDiscussionDrawer = ref(false)
const discussionMilestone = ref<any>(null)
const newComment = ref('')
const onlineTeachers = ref<any[]>([])

// 可用教师列表
const availableTeachers = ref([
  { id: 'teacher-1', name: '张老师', subject: '英语' },
  { id: 'teacher-2', name: '李老师', subject: '数学' },
  { id: 'teacher-3', name: '王老师', subject: '物理' },
  { id: 'teacher-4', name: '陈老师', subject: '化学' },
  { id: 'teacher-5', name: '赵老师', subject: '升学顾问' }
])

// 模拟学生数据
const studentList = ref([
  {
    id: '1',
    name: '李明',
    target: '剑桥大学',
    progress: 65
  },
  {
    id: '2',
    name: '王芳',
    target: '牛津大学',
    progress: 78
  },
  {
    id: '3',
    name: '张三',
    target: '帝国理工学院',
    progress: 45
  }
])

// 里程碑数据
const milestones = ref<any[]>([])

// 新里程碑表单
const newMilestone = ref({
  title: '',
  description: '',
  date: '',
  priority: '普通',
  teachers: []
})

// 计算属性
const daysRemaining = computed(() => {
  const deadline = new Date('2024-10-15')
  const today = new Date()
  const days = Math.ceil((deadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
  return days > 0 ? days : 0
})

const filteredMilestones = computed(() => {
  if (!filterByTeacher.value) {
    return milestones.value
  }
  // 只显示当前教师负责的里程碑
  return milestones.value.filter(m => 
    m.assignedTeachers.some((t: any) => t.id === currentTeacherId.value)
  )
})

// 方法
const loadStudentData = () => {
  const student = studentList.value.find(s => s.id === selectedStudentId.value)
  if (student) {
    currentStudent.value = student
    loadMilestones(student.id)
    loadOnlineTeachers(student.id)
  }
}

// 加载在线教师
const loadOnlineTeachers = (studentId: string) => {
  // 模拟加载在线教师
  onlineTeachers.value = [
    { id: 'teacher-current', name: '我', subject: '班主任' },
    { id: 'teacher-1', name: '张老师', subject: '英语' },
    { id: 'teacher-5', name: '赵老师', subject: '升学顾问' }
  ]
}

const loadMilestones = (studentId: string) => {
  // 模拟加载里程碑数据 - 包含协同信息
  milestones.value = [
    {
      id: 1,
      title: 'IELTS 考试',
      description: '目标分数7.5，需要重点提升写作部分',
      date: '2024-06-15',
      priority: '关键',
      status: 'in-progress',
      progress: 60,
      assignedTeachers: [
        { id: 'teacher-1', name: '张老师', subject: '英语' }
      ],
      lastUpdated: new Date(Date.now() - 3600000),
      lastUpdatedBy: '张老师',
      hasUpdate: true,
      comments: [
        {
          id: 1,
          author: '张老师',
          content: '写作部分建议每天练习一篇，我会定期批改。',
          time: new Date(Date.now() - 86400000),
          type: 'comment'
        },
        {
          id: 2,
          author: '班主任',
          content: '已完成3次模拟考试，写作有明显进步',
          time: new Date(Date.now() - 3600000),
          type: 'progress',
          oldProgress: 40,
          newProgress: 60
        }
      ]
    },
    {
      id: 2,
      title: 'A-Level 期末考试',
      description: '数学、物理、化学三门科目',
      date: '2024-05-20',
      priority: '关键',
      status: 'pending',
      progress: 30,
      assignedTeachers: [
        { id: 'teacher-2', name: '李老师', subject: '数学' },
        { id: 'teacher-3', name: '王老师', subject: '物理' },
        { id: 'teacher-4', name: '陈老师', subject: '化学' }
      ],
      lastUpdated: new Date(Date.now() - 172800000),
      lastUpdatedBy: '李老师',
      hasUpdate: false,
      comments: []
    },
    {
      id: 3,
      title: '个人陈述初稿',
      description: '突出科研经历和个人特质',
      date: '2024-07-01',
      priority: '重要',
      status: 'pending',
      progress: 0,
      assignedTeachers: [
        { id: 'teacher-5', name: '赵老师', subject: '升学顾问' },
        { id: 'teacher-current', name: '班主任', subject: '班主任' }
      ],
      comments: []
    }
  ]
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('zh-CN')
}

const formatTime = (date: Date) => {
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)
  
  if (minutes < 1) return '刚刚'
  if (minutes < 60) return `${minutes}分钟前`
  if (hours < 24) return `${hours}小时前`
  return `${days}天前`
}

const getStatusType = (status: string) => {
  const map: Record<string, string> = {
    completed: 'success',
    'in-progress': 'warning',
    pending: 'info'
  }
  return map[status] || 'info'
}

const getStatusLabel = (status: string) => {
  const map: Record<string, string> = {
    completed: '已完成',
    'in-progress': '进行中',
    pending: '待开始'
  }
  return map[status] || status
}

const getPriorityType = (priority: string) => {
  const map: Record<string, string> = {
    '关键': 'danger',
    '重要': 'warning',
    '普通': 'info'
  }
  return map[priority] || 'info'
}

const addMilestone = () => {
  if (!newMilestone.value.title || !newMilestone.value.date) {
    ElMessage.warning('请填写完整信息')
    return
  }
  
  const milestone = {
    id: Date.now(),
    title: newMilestone.value.title,
    description: newMilestone.value.description,
    date: newMilestone.value.date,
    status: 'pending',
    priority: newMilestone.value.priority,
    progress: 0,
    assignedTeachers: newMilestone.value.teachers.map(id => {
      const teacher = availableTeachers.value.find(t => t.id === id)
      return teacher ? { id: teacher.id, name: teacher.name, subject: teacher.subject } : null
    }).filter(Boolean),
    comments: []
  }
  
  milestones.value.push(milestone)
  
  // 通知被分配的教师
  notifyTeachersAssigned(milestone)
  
  showAddDialog.value = false
  
  // 重置表单
  newMilestone.value = {
    title: '',
    description: '',
    date: '',
    priority: '普通',
    teachers: []
  }
  
  ElMessage.success('里程碑添加成功！')
}

const editMilestone = (milestone: any) => {
  ElMessage.info('编辑功能开发中')
}

const updateProgress = (milestone: any) => {
  editingMilestone.value = milestone
  newProgress.value = milestone.progress
  progressNote.value = ''
  showProgressDialog.value = true
}

const saveProgress = () => {
  if (editingMilestone.value) {
    const oldProgress = editingMilestone.value.progress
    editingMilestone.value.progress = newProgress.value
    editingMilestone.value.lastUpdated = new Date()
    editingMilestone.value.lastUpdatedBy = '当前教师'
    
    if (newProgress.value === 100) {
      editingMilestone.value.status = 'completed'
    } else if (newProgress.value > 0) {
      editingMilestone.value.status = 'in-progress'
    }
    
    // 添加进度更新到评论
    if (!editingMilestone.value.comments) {
      editingMilestone.value.comments = []
    }
    
    editingMilestone.value.comments.push({
      id: Date.now(),
      author: '当前教师',
      content: progressNote.value || '更新了进度',
      time: new Date(),
      type: 'progress',
      oldProgress,
      newProgress: newProgress.value
    })
    
    // 通知其他教师
    notifyProgressUpdate(editingMilestone.value, oldProgress, newProgress.value)
    
    showProgressDialog.value = false
    ElMessage.success('进度更新成功！')
  }
}

// 分配教师
const assignTeacher = (milestone: any) => {
  assigningMilestone.value = milestone
  selectedTeachers.value = milestone.assignedTeachers?.map((t: any) => t.id) || []
  showTeacherDialog.value = true
}

// 保存教师分配
const saveTeacherAssignment = () => {
  if (assigningMilestone.value) {
    const oldTeachers = assigningMilestone.value.assignedTeachers
    assigningMilestone.value.assignedTeachers = selectedTeachers.value.map(id => {
      const teacher = availableTeachers.value.find(t => t.id === id)
      return teacher ? { id: teacher.id, name: teacher.name, subject: teacher.subject } : null
    }).filter(Boolean)
    
    // 通知新分配的教师
    notifyTeachersAssigned(assigningMilestone.value, oldTeachers)
    
    ElMessage.success('教师分配成功')
    showTeacherDialog.value = false
  }
}

// 显示讨论
const showDiscussion = (milestone: any) => {
  discussionMilestone.value = milestone
  if (!milestone.comments) {
    milestone.comments = []
  }
  // 清除未读标记
  milestone.hasUpdate = false
  showDiscussionDrawer.value = true
}

// 发送评论
const sendComment = () => {
  if (discussionMilestone.value && newComment.value.trim()) {
    const comment = {
      id: Date.now(),
      author: '当前教师',
      content: newComment.value,
      time: new Date(),
      type: 'comment'
    }
    
    if (!discussionMilestone.value.comments) {
      discussionMilestone.value.comments = []
    }
    discussionMilestone.value.comments.push(comment)
    
    // 通知其他教师
    notifyNewComment(discussionMilestone.value, comment)
    
    newComment.value = ''
    ElMessage.success('评论已发送')
  }
}

// 邀请教师
const inviteTeacher = () => {
  router.push('/teacher-dashboard-full/teacher-invitation')
}

// 发起视频会议
const startVideoCall = () => {
  router.push('/teacher-dashboard-full/meetings')
}

// 通知进度更新
const notifyProgressUpdate = (milestone: any, oldProgress: number, newProgress: number) => {
  // 模拟发送通知给其他教师
  if (milestone.assignedTeachers && milestone.assignedTeachers.length > 0) {
    ElNotification({
      title: '里程碑进度更新',
      message: `${milestone.title} 的进度从 ${oldProgress}% 更新到 ${newProgress}%`,
      type: 'info',
      position: 'bottom-right'
    })
  }
}

// 通知新评论
const notifyNewComment = (milestone: any, comment: any) => {
  // 模拟发送通知
  ElNotification({
    title: '新的讨论',
    message: `${comment.author} 在 ${milestone.title} 中发表了评论`,
    type: 'info',
    position: 'bottom-right'
  })
}

// 通知教师分配
const notifyTeachersAssigned = (milestone: any, oldTeachers?: any[]) => {
  const newTeachers = milestone.assignedTeachers.filter((t: any) => 
    !oldTeachers?.some((old: any) => old.id === t.id)
  )
  
  if (newTeachers.length > 0) {
    ElNotification({
      title: '新的任务分配',
      message: `您被分配到里程碑：${milestone.title}`,
      type: 'success',
      position: 'bottom-right'
    })
  }
}

// WebSocket 连接（模拟）
let wsConnection: any = null
let updateInterval: any = null

const connectWebSocket = () => {
  // 实际项目中应连接真实的WebSocket服务器
  console.log('连接协同服务器...')
  
  // 模拟接收实时更新
  updateInterval = setInterval(() => {
    // 模拟随机更新
    if (Math.random() > 0.9 && milestones.value.length > 0) {
      const randomMilestone = milestones.value[Math.floor(Math.random() * milestones.value.length)]
      const randomTeacher = availableTeachers.value[Math.floor(Math.random() * availableTeachers.value.length)]
      
      // 模拟其他教师的更新
      randomMilestone.hasUpdate = true
      
      ElNotification({
        title: '协同更新',
        message: `${randomTeacher.name} 更新了 ${randomMilestone.title} 的信息`,
        type: 'info',
        position: 'bottom-right',
        duration: 3000
      })
    }
  }, 30000) // 每30秒模拟一次更新
}

onMounted(() => {
  // 连接WebSocket
  connectWebSocket()
  
  // 自动选择第一个学生
  if (studentList.value.length > 0) {
    selectedStudentId.value = studentList.value[0].id
    loadStudentData()
  }
})

onUnmounted(() => {
  // 断开WebSocket连接
  if (updateInterval) {
    clearInterval(updateInterval)
  }
  if (wsConnection) {
    console.log('断开协同连接')
  }
})
</script>

<style scoped>
.teacher-dashboard-collaborative {
  min-height: 100vh;
  background: #f5f7fa;
  padding: 20px;
  padding-bottom: 80px; /* 为底部协作栏留出空间 */
}

.dashboard-header {
  text-align: center;
  margin-bottom: 30px;
  padding: 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.dashboard-header h1 {
  margin: 0 0 10px 0;
  color: #303133;
  font-size: 28px;
}

.dashboard-header p {
  margin: 0;
  color: #606266;
  font-size: 16px;
}

.dashboard-content {
  max-width: 1400px;
  margin: 0 auto;
}

.student-selector-section {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

.student-selector-section h2 {
  margin: 0 0 15px 0;
  color: #303133;
}

.student-info-section {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

.student-info-section h2 {
  margin: 0 0 20px 0;
  color: #303133;
}

.student-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
}

.stat-card {
  padding: 15px;
  background: #f8f9fa;
  border-radius: 6px;
  text-align: center;
}

.stat-card h3 {
  margin: 0 0 10px 0;
  font-size: 14px;
  color: #606266;
}

.stat-card p {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #303133;
}

.countdown {
  color: #e6a23c !important;
}

.milestones-section {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.section-header h2 {
  margin: 0;
  color: #303133;
}

.header-actions {
  display: flex;
  gap: 10px;
}

.milestones-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 20px;
}

.milestone-card {
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  padding: 20px;
  transition: all 0.3s;
  position: relative;
}

.milestone-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transform: translateY(-2px);
}

.milestone-card.completed {
  border-color: #67c23a;
  background: #f0f9ff;
}

.milestone-card.in-progress {
  border-color: #e6a23c;
  background: #fdf6ec;
}

.milestone-card.has-update::before {
  content: '';
  position: absolute;
  top: 10px;
  right: 10px;
  width: 8px;
  height: 8px;
  background: #f56c6c;
  border-radius: 50%;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(245, 108, 108, 0.7);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(245, 108, 108, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(245, 108, 108, 0);
  }
}

.milestone-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 10px;
}

.milestone-header h4 {
  margin: 0;
  color: #303133;
  flex: 1;
}

.milestone-desc {
  margin: 0 0 15px 0;
  color: #606266;
  font-size: 14px;
  line-height: 1.5;
}

.milestone-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.milestone-date {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 14px;
  color: #909399;
}

.milestone-teachers {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
  padding: 10px;
  background: #f5f7fa;
  border-radius: 6px;
}

.milestone-teachers .label {
  font-size: 14px;
  color: #606266;
  margin-right: 10px;
}

.milestone-progress {
  margin-bottom: 15px;
}

.progress-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  font-size: 14px;
  color: #606266;
}

.last-update {
  font-size: 12px;
  color: #909399;
}

.milestone-actions {
  display: flex;
  gap: 10px;
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.empty-state h3 {
  margin: 20px 0 10px 0;
  color: #303133;
}

.empty-state p {
  margin: 0;
  color: #909399;
}

/* 讨论容器样式 */
.discussion-container {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.discussion-history {
  flex: 1;
  overflow-y: auto;
  margin-bottom: 20px;
  max-height: 500px;
}

.comment-item {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
  padding-bottom: 20px;
  border-bottom: 1px solid #ebeef5;
}

.comment-item:last-child {
  border-bottom: none;
}

.comment-content {
  flex: 1;
}

.comment-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
}

.comment-header strong {
  color: #303133;
}

.comment-time {
  font-size: 12px;
  color: #909399;
}

.comment-content p {
  margin: 0;
  color: #606266;
  line-height: 1.5;
}

.comment-progress {
  margin-top: 8px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.comment-input {
  border-top: 1px solid #ebeef5;
  padding-top: 20px;
}

/* 协作状态栏 */
.collaboration-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 60px;
  background: white;
  border-top: 1px solid #e4e7ed;
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 40px;
  z-index: 100;
}

.collab-info {
  display: flex;
  align-items: center;
  gap: 15px;
}

.online-indicator {
  color: #67c23a;
  animation: blink 2s infinite;
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.collab-actions {
  display: flex;
  gap: 10px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .teacher-dashboard-collaborative {
    padding: 10px;
    padding-bottom: 70px;
  }
  
  .student-stats {
    grid-template-columns: 1fr;
  }
  
  .milestones-grid {
    grid-template-columns: 1fr;
  }
  
  .section-header {
    flex-direction: column;
    gap: 15px;
    align-items: stretch;
  }
  
  .collaboration-bar {
    padding: 0 20px;
  }
  
  .collab-info span:not(.online-indicator) {
    display: none;
  }
}
</style>