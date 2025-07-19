<template>
  <div class="milestone-dashboard">
    <!-- 顶部导航栏 -->
    <header class="dashboard-header">
      <div class="header-left">
        <h1 class="dashboard-title">
          <el-icon class="title-icon"><Trophy /></el-icon>
          升学里程碑追踪系统
        </h1>
        <div class="academic-motto">
          "Excellence is a journey, not a destination" 
        </div>
      </div>
      
      <div class="header-right">
        <div class="achievement-badges">
          <el-tooltip content="本月完成里程碑数">
            <div class="badge-item">
              <el-icon><Trophy /></el-icon>
              <span>12</span>
            </div>
          </el-tooltip>
          <el-tooltip content="学生升学成功率">
            <div class="badge-item success">
              <el-icon><Star /></el-icon>
              <span>95%</span>
            </div>
          </el-tooltip>
        </div>
        
        <el-badge :value="unreadNotifications" :hidden="unreadNotifications === 0">
          <el-button :icon="Bell" circle @click="showNotifications = true" />
        </el-badge>
        
        <el-dropdown>
          <div class="user-avatar">
            <el-avatar :size="40">{{ getUserInitial() }}</el-avatar>
            <span class="user-name">{{ currentUser?.username }}</span>
          </div>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="goToProfile">
                <el-icon><User /></el-icon>
                个人资料
              </el-dropdown-item>
              <el-dropdown-item @click="showSettings = true">
                <el-icon><Setting /></el-icon>
                设置
              </el-dropdown-item>
              <el-dropdown-item divided @click="logout">
                <el-icon><SwitchButton /></el-icon>
                退出登录
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </header>

    <!-- 主要内容区 -->
    <main class="dashboard-main">
      <!-- 学生快速切换栏 -->
      <div class="student-switcher">
        <div class="switcher-label">
          <el-icon><User /></el-icon>
          当前学生：
        </div>
        <el-select 
          v-model="selectedStudentId" 
          placeholder="选择学生"
          @change="loadStudentData"
          class="student-selector"
        >
          <el-option
            v-for="student in studentList"
            :key="student._id"
            :label="student.basicInfo.name"
            :value="student._id"
          >
            <div class="student-option">
              <span class="student-name">{{ student.basicInfo.name }}</span>
              <span class="student-target">{{ student.targetUniversities.primary.name }}</span>
              <el-progress 
                :percentage="student.pathwayProgress || 0" 
                :width="60"
                :show-text="false"
              />
            </div>
          </el-option>
        </el-select>
        
        <div class="quick-stats">
          <div class="stat-item">
            <span class="stat-label">目标</span>
            <span class="stat-value">{{ currentStudent?.targetUniversities.primary.name }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">进度</span>
            <el-progress 
              :percentage="overallProgress" 
              :status="progressStatus"
              :stroke-width="8"
            />
          </div>
          <div class="stat-item">
            <span class="stat-label">剩余天数</span>
            <span class="stat-value countdown">{{ daysRemaining }}</span>
          </div>
        </div>
      </div>

      <!-- 里程碑时间轴主视图 -->
      <div class="milestone-timeline-container">
        <div class="timeline-header">
          <h2>
            <el-icon><Flag /></el-icon>
            升学里程碑路线图
          </h2>
          <div class="timeline-actions">
            <el-button-group>
              <el-button 
                :type="viewMode === 'timeline' ? 'primary' : ''"
                @click="viewMode = 'timeline'"
              >
                时间轴
              </el-button>
              <el-button 
                :type="viewMode === 'calendar' ? 'primary' : ''"
                @click="viewMode = 'calendar'"
              >
                日历
              </el-button>
              <el-button 
                :type="viewMode === 'board' ? 'primary' : ''"
                @click="viewMode = 'board'"
              >
                看板
              </el-button>
            </el-button-group>
            
            <el-button type="primary" :icon="Plus" @click="showAddMilestone = true">
              添加里程碑
            </el-button>
          </div>
        </div>

        <!-- 时间轴视图 -->
        <div v-if="viewMode === 'timeline'" class="timeline-view">
          <div class="timeline-track">
            <div 
              v-for="(milestone, index) in sortedMilestones" 
              :key="milestone.id"
              class="milestone-node"
              :class="[
                milestone.status,
                milestone.priority,
                { 'is-current': isCurrentMilestone(milestone) }
              ]"
              :style="{ left: getMilestonePosition(milestone) + '%' }"
              @click="selectMilestone(milestone)"
            >
              <div class="milestone-dot">
                <el-icon v-if="milestone.status === 'completed'"><SuccessFilled /></el-icon>
                <el-icon v-else-if="milestone.status === 'in_progress'"><Loading /></el-icon>
                <el-icon v-else-if="milestone.status === 'delayed'"><WarningFilled /></el-icon>
                <el-icon v-else><Aim /></el-icon>
              </div>
              
              <div class="milestone-card">
                <div class="milestone-date">
                  {{ formatDate(milestone.plannedDate) }}
                </div>
                <h4 class="milestone-title">{{ milestone.title }}</h4>
                <div class="milestone-meta">
                  <el-tag 
                    :type="getPriorityType(milestone.priority)" 
                    size="small"
                    effect="plain"
                  >
                    {{ getPriorityLabel(milestone.priority) }}
                  </el-tag>
                  <span class="milestone-progress">
                    <el-icon><Star /></el-icon>
                    {{ milestone.progress }}%
                  </span>
                </div>
                
                <!-- 鼓励性消息 -->
                <div v-if="milestone.status === 'completed'" class="encouragement">
                  <el-icon><Star /></el-icon>
                  卓越成就！
                </div>
                <div v-else-if="milestone.status === 'in_progress' && milestone.progress >= 70" class="encouragement">
                  <el-icon><Sunrise /></el-icon>
                  即将完成！
                </div>
              </div>
            </div>
          </div>
          
          <!-- 时间轴底部标尺 -->
          <div class="timeline-ruler">
            <div class="ruler-start">{{ timelineStart }}</div>
            <div class="ruler-end">{{ timelineEnd }}</div>
            <div class="ruler-today" :style="{ left: getTodayPosition() + '%' }">
              <el-icon><Calendar /></el-icon>
              今天
            </div>
          </div>
        </div>

        <!-- 日历视图 -->
        <div v-else-if="viewMode === 'calendar'" class="calendar-view">
          <MilestoneCalendar 
            :milestones="milestones"
            @select="selectMilestone"
            @add="showAddMilestone = true"
          />
        </div>

        <!-- 看板视图 -->
        <div v-else-if="viewMode === 'board'" class="board-view">
          <MilestoneBoard
            :milestones="milestones"
            @update="handleMilestoneUpdate"
            @select="selectMilestone"
          />
        </div>
      </div>

      <!-- 协同交流面板 -->
      <div class="collaboration-panel">
        <h3>
          <el-icon><Connection /></el-icon>
          团队协同
        </h3>
        
        <div class="collaboration-content">
          <div class="recent-activities">
            <h4>最新动态</h4>
            <el-timeline>
              <el-timeline-item
                v-for="activity in recentActivities"
                :key="activity.id"
                :timestamp="activity.time"
                :type="activity.type"
              >
                <div class="activity-content">
                  <strong>{{ activity.teacher }}</strong>
                  {{ activity.action }}
                  <el-link type="primary">{{ activity.target }}</el-link>
                </div>
              </el-timeline-item>
            </el-timeline>
          </div>
          
          <div class="quick-actions">
            <h4>快速操作</h4>
            <el-button 
              class="action-btn"
              @click="startDiscussion"
            >
              <el-icon><ChatDotSquare /></el-icon>
              发起讨论
            </el-button>
            <el-button 
              class="action-btn"
              @click="scheduleMeeting"
            >
              <el-icon><VideoCamera /></el-icon>
              安排会议
            </el-button>
            <el-button 
              class="action-btn"
              @click="createReport"
            >
              <el-icon><Document /></el-icon>
              生成报告
            </el-button>
          </div>
        </div>
      </div>
    </main>

    <!-- 里程碑详情侧边栏 -->
    <el-drawer
      v-model="showMilestoneDetail"
      :title="selectedMilestone?.title"
      size="50%"
      :before-close="handleDetailClose"
    >
      <MilestoneDetail 
        v-if="selectedMilestone"
        :milestone="selectedMilestone"
        :student="currentStudent"
        @update="handleMilestoneUpdate"
        @close="showMilestoneDetail = false"
      />
    </el-drawer>

    <!-- 添加里程碑对话框 -->
    <el-dialog
      v-model="showAddMilestone"
      title="创建新里程碑"
      width="600px"
    >
      <AddMilestoneForm
        :student="currentStudent"
        @save="handleAddMilestone"
        @cancel="showAddMilestone = false"
      />
    </el-dialog>

    <!-- 通知中心 -->
    <el-drawer
      v-model="showNotifications"
      title="通知中心"
      direction="rtl"
      size="400px"
    >
      <NotificationCenter 
        @close="showNotifications = false"
        @read="unreadNotifications--"
      />
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import {
  Trophy, Bell, User, Setting, SwitchButton,
  Flag, Plus, SuccessFilled, Loading, WarningFilled,
  Star, Calendar, Connection,
  VideoCamera, Document, ArrowDown, Aim, ChatDotSquare,
  Sunrise
} from '@element-plus/icons-vue'
import dayjs from 'dayjs'

// 导入子组件
import MilestoneDetail from './components/MilestoneDetail.vue'
import MilestoneCalendar from './components/MilestoneCalendar.vue'
import MilestoneBoard from './components/MilestoneBoard.vue'
import AddMilestoneForm from './components/AddMilestoneForm.vue'
import NotificationCenter from './components/NotificationCenter.vue'

import type { IStudent, IPathway, IMilestone } from '@/types/teacher-dashboard'

const router = useRouter()

// 响应式数据
const selectedStudentId = ref('')
const currentStudent = ref<IStudent | null>(null)
const pathway = ref<IPathway | null>(null)
const milestones = ref<IMilestone[]>([])
const viewMode = ref<'timeline' | 'calendar' | 'board'>('timeline')
const showMilestoneDetail = ref(false)
const selectedMilestone = ref<IMilestone | null>(null)
const showAddMilestone = ref(false)
const showNotifications = ref(false)
const unreadNotifications = ref(3)
const currentUser = ref(null)

// 模拟数据
const studentList = ref<IStudent[]>([
  {
    _id: '1',
    basicInfo: {
      name: '李明',
      grade: '高二',
      class: '3',
      studentId: 'S20230001',
      enrollmentDate: new Date('2023-09-01')
    },
    targetUniversities: {
      primary: {
        id: '1',
        name: '剑桥大学',
        country: '英国',
        major: '计算机科学',
        requirements: {}
      },
      alternatives: [],
      lastUpdated: new Date()
    },
    academicStatus: {
      currentGPA: 3.85,
      subjects: [],
      standardizedTests: []
    },
    relatedTeachers: [],
    pathwayProgress: 65,
    createdAt: new Date(),
    updatedAt: new Date()
  }
])

const recentActivities = ref([
  {
    id: 1,
    teacher: '王老师',
    action: '更新了',
    target: 'A-Level数学进度',
    time: '10分钟前',
    type: 'primary'
  },
  {
    id: 2,
    teacher: '李老师',
    action: '评论了',
    target: '雅思备考计划',
    time: '2小时前',
    type: 'success'
  },
  {
    id: 3,
    teacher: '陈老师',
    action: '完成了',
    target: '推荐信初稿',
    time: '今天 09:30',
    type: 'success'
  }
])

// 计算属性
const sortedMilestones = computed(() => {
  return [...milestones.value].sort((a, b) => 
    new Date(a.plannedDate).getTime() - new Date(b.plannedDate).getTime()
  )
})

const overallProgress = computed(() => {
  if (!milestones.value.length) return 0
  const total = milestones.value.reduce((sum, m) => sum + m.progress, 0)
  return Math.round(total / milestones.value.length)
})

const progressStatus = computed(() => {
  if (overallProgress.value >= 80) return 'success'
  if (overallProgress.value < 50) return 'warning'
  return ''
})

const daysRemaining = computed(() => {
  if (!currentStudent.value) return '-'
  // 计算到最终申请截止的天数
  const deadline = new Date('2024-10-15')
  const today = new Date()
  const days = Math.ceil((deadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
  return days > 0 ? days : 0
})

const timelineStart = computed(() => {
  if (!milestones.value.length) return ''
  const earliest = sortedMilestones.value[0]
  return dayjs(earliest.plannedDate).format('YYYY年MM月')
})

const timelineEnd = computed(() => {
  if (!milestones.value.length) return ''
  const latest = sortedMilestones.value[sortedMilestones.value.length - 1]
  return dayjs(latest.plannedDate).format('YYYY年MM月')
})

// 方法
const getUserInitial = () => {
  return currentUser.value?.username?.charAt(0).toUpperCase() || 'U'
}

const loadStudentData = async () => {
  if (!selectedStudentId.value) return
  
  currentStudent.value = studentList.value.find(s => s._id === selectedStudentId.value) || null
  
  // 加载里程碑数据
  if (currentStudent.value) {
    milestones.value = [
      {
        id: '1',
        type: 'exam',
        category: 'standardized_test',
        title: 'IELTS 考试',
        description: '目标分数 7.5',
        plannedDate: new Date('2024-03-15'),
        status: 'completed',
        priority: 'high',
        progress: 100,
        dependencies: [],
        assignedTo: ['teacher1'],
        actionItems: [],
        attachments: []
      },
      {
        id: '2',
        type: 'exam',
        category: 'academic',
        title: 'A-Level 数学考试',
        description: '目标成绩 A*',
        plannedDate: new Date('2024-05-20'),
        status: 'in_progress',
        priority: 'critical',
        progress: 75,
        dependencies: [],
        assignedTo: ['teacher2'],
        actionItems: [],
        attachments: []
      },
      {
        id: '3',
        type: 'document',
        category: 'application',
        title: '个人陈述完成',
        description: '完成并润色个人陈述',
        plannedDate: new Date('2024-08-01'),
        status: 'pending',
        priority: 'high',
        progress: 30,
        dependencies: ['1', '2'],
        assignedTo: ['counselor1'],
        actionItems: [],
        attachments: []
      },
      {
        id: '4',
        type: 'application',
        category: 'application',
        title: 'UCAS申请提交',
        description: '完成并提交UCAS申请',
        plannedDate: new Date('2024-10-15'),
        status: 'pending',
        priority: 'critical',
        progress: 0,
        dependencies: ['3'],
        assignedTo: ['counselor1'],
        actionItems: [],
        attachments: []
      }
    ]
  }
}

const getMilestonePosition = (milestone: IMilestone) => {
  if (!milestones.value.length) return 0
  
  const start = new Date(sortedMilestones.value[0].plannedDate).getTime()
  const end = new Date(sortedMilestones.value[sortedMilestones.value.length - 1].plannedDate).getTime()
  const current = new Date(milestone.plannedDate).getTime()
  
  return ((current - start) / (end - start)) * 100
}

const getTodayPosition = () => {
  if (!milestones.value.length) return 50
  
  const start = new Date(sortedMilestones.value[0].plannedDate).getTime()
  const end = new Date(sortedMilestones.value[sortedMilestones.value.length - 1].plannedDate).getTime()
  const today = new Date().getTime()
  
  return ((today - start) / (end - start)) * 100
}

const isCurrentMilestone = (milestone: IMilestone) => {
  return milestone.status === 'in_progress'
}

const formatDate = (date: Date | string) => {
  return dayjs(date).format('MM/DD')
}

const getPriorityType = (priority: string) => {
  const map: Record<string, string> = {
    critical: 'danger',
    high: 'warning',
    medium: '',
    low: 'info'
  }
  return map[priority] || ''
}

const getPriorityLabel = (priority: string) => {
  const map: Record<string, string> = {
    critical: '关键',
    high: '重要',
    medium: '常规',
    low: '次要'
  }
  return map[priority] || priority
}

const selectMilestone = (milestone: IMilestone) => {
  selectedMilestone.value = milestone
  showMilestoneDetail.value = true
}

const handleMilestoneUpdate = () => {
  loadStudentData()
  ElMessage.success('里程碑已更新')
}

const handleAddMilestone = (milestone: IMilestone) => {
  milestones.value.push(milestone)
  showAddMilestone.value = false
  ElMessage.success('里程碑已添加')
}

const handleDetailClose = () => {
  showMilestoneDetail.value = false
  selectedMilestone.value = null
}

const startDiscussion = () => {
  ElMessage.info('讨论功能开发中')
}

const scheduleMeeting = () => {
  ElMessage.info('会议安排功能开发中')
}

const createReport = () => {
  ElMessage.info('报告生成功能开发中')
}

const goToProfile = () => {
  router.push('/profile')
}

const logout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('userInfo')
  router.push('/login')
  ElMessage.success('已退出登录')
}

onMounted(() => {
  const userInfo = localStorage.getItem('userInfo')
  if (userInfo) {
    currentUser.value = JSON.parse(userInfo)
  }
  
  // 自动选择第一个学生
  if (studentList.value.length > 0) {
    selectedStudentId.value = studentList.value[0]._id
    loadStudentData()
  }
})
</script>

<style scoped>
.milestone-dashboard {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  display: flex;
  flex-direction: column;
}

/* 顶部导航栏 */
.dashboard-header {
  background: white;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  padding: 16px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 24px;
}

.dashboard-title {
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 0;
  font-size: 24px;
  color: #303133;
}

.title-icon {
  color: #f39c12;
  font-size: 28px;
}

.academic-motto {
  font-style: italic;
  color: #909399;
  font-size: 14px;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 20px;
}

.achievement-badges {
  display: flex;
  gap: 16px;
}

.badge-item {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: #ecf5ff;
  border-radius: 20px;
  color: #409eff;
  font-weight: 500;
}

.badge-item.success {
  background: #f0f9ff;
  color: #67c23a;
}

.user-avatar {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.user-name {
  color: #606266;
}

/* 主内容区 */
.dashboard-main {
  flex: 1;
  padding: 24px;
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
}

/* 学生切换栏 */
.student-switcher {
  background: white;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 24px;
  display: flex;
  align-items: center;
  gap: 24px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
}

.switcher-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 500;
  color: #606266;
}

.student-selector {
  width: 240px;
}

.student-option {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 4px 0;
}

.student-name {
  font-weight: 500;
}

.student-target {
  font-size: 12px;
  color: #909399;
}

.quick-stats {
  display: flex;
  gap: 32px;
  margin-left: auto;
}

.stat-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.stat-label {
  font-size: 12px;
  color: #909399;
}

.stat-value {
  font-size: 18px;
  font-weight: 600;
  color: #303133;
}

.stat-value.countdown {
  color: #e6a23c;
}

/* 里程碑时间轴容器 */
.milestone-timeline-container {
  background: white;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
}

.timeline-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
}

.timeline-header h2 {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0;
  font-size: 20px;
  color: #303133;
}

.timeline-actions {
  display: flex;
  gap: 16px;
}

/* 时间轴视图 */
.timeline-view {
  position: relative;
  padding: 60px 0 40px;
}

.timeline-track {
  position: relative;
  height: 200px;
  background: linear-gradient(to right, #e4e7ed 0%, #e4e7ed 100%);
  background-size: 10px 2px;
  background-position: center;
  background-repeat: repeat-x;
}

.milestone-node {
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
  cursor: pointer;
  transition: all 0.3s;
}

.milestone-node:hover {
  z-index: 10;
}

.milestone-dot {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: white;
  border: 3px solid #e4e7ed;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  transition: all 0.3s;
}

.milestone-node.completed .milestone-dot {
  border-color: #67c23a;
  color: #67c23a;
}

.milestone-node.in_progress .milestone-dot {
  border-color: #409eff;
  color: #409eff;
  animation: pulse 2s infinite;
}

.milestone-node.delayed .milestone-dot {
  border-color: #f56c6c;
  color: #f56c6c;
}

.milestone-node.critical .milestone-dot {
  width: 40px;
  height: 40px;
  border-width: 4px;
}

@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(64, 158, 255, 0.4);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(64, 158, 255, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(64, 158, 255, 0);
  }
}

.milestone-card {
  position: absolute;
  top: 60px;
  left: 50%;
  transform: translateX(-50%);
  background: white;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  min-width: 200px;
  opacity: 0;
  transition: all 0.3s;
  pointer-events: none;
}

.milestone-node:hover .milestone-card {
  opacity: 1;
  top: 50px;
}

.milestone-node.is-current .milestone-card {
  opacity: 1;
  top: 50px;
  border: 2px solid #409eff;
}

.milestone-date {
  font-size: 12px;
  color: #909399;
  margin-bottom: 4px;
}

.milestone-title {
  margin: 0 0 8px 0;
  font-size: 14px;
  color: #303133;
}

.milestone-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}

.milestone-progress {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #606266;
}

.encouragement {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-top: 8px;
  padding: 4px 8px;
  background: #f0f9ff;
  border-radius: 4px;
  font-size: 12px;
  color: #409eff;
  font-weight: 500;
}

/* 时间轴标尺 */
.timeline-ruler {
  position: relative;
  margin-top: 40px;
  padding-top: 20px;
  border-top: 1px solid #e4e7ed;
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #909399;
}

.ruler-today {
  position: absolute;
  top: -20px;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #e6a23c;
  font-weight: 500;
}

.ruler-today::before {
  content: '';
  position: absolute;
  top: -40px;
  width: 2px;
  height: 40px;
  background: #e6a23c;
}

/* 协同面板 */
.collaboration-panel {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
}

.collaboration-panel h3 {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0 0 20px 0;
  font-size: 18px;
  color: #303133;
}

.collaboration-content {
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 32px;
}

.recent-activities h4,
.quick-actions h4 {
  margin: 0 0 16px 0;
  font-size: 14px;
  color: #606266;
}

.activity-content {
  font-size: 14px;
}

.quick-actions {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.action-btn {
  width: 100%;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border: 1px solid #e4e7ed;
  background: #fff;
  color: #606266;
  transition: all 0.3s;
}

.action-btn:hover {
  color: #409eff;
  border-color: #409eff;
  background: #ecf5ff;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .dashboard-main {
    padding: 16px;
  }
  
  .collaboration-content {
    grid-template-columns: 1fr;
  }
  
  .quick-stats {
    display: none;
  }
}
</style>
