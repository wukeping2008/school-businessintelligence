<template>
  <div class="pathway-management">
    <div class="management-header">
      <h2>升学路径管理</h2>
      <div class="header-actions">
        <el-select 
          v-model="selectedStudentId" 
          placeholder="选择学生"
          @change="loadStudentPathway"
          style="width: 200px; margin-right: 12px;"
        >
          <el-option
            v-for="student in studentList"
            :key="student._id"
            :label="student.basicInfo.name"
            :value="student._id"
          />
        </el-select>
        <el-button type="primary" @click="createNewPathway">
          <el-icon><Plus /></el-icon>
          创建路径
        </el-button>
      </div>
    </div>

    <!-- 学生信息概览 -->
    <el-card v-if="currentStudent" class="student-overview">
      <el-row :gutter="20" align="middle">
        <el-col :span="6">
          <div class="info-item">
            <label>学生姓名：</label>
            <span>{{ currentStudent.basicInfo.name }}</span>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="info-item">
            <label>目标大学：</label>
            <el-tag type="primary">
              {{ currentStudent.targetUniversities.primary.name }}
            </el-tag>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="info-item">
            <label>目标专业：</label>
            <span>{{ currentStudent.targetUniversities.primary.major }}</span>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="info-item">
            <label>整体进度：</label>
            <el-progress 
              :percentage="pathway?.overallProgress || 0" 
              :status="getProgressStatus(pathway?.overallProgress)"
            />
          </div>
        </el-col>
      </el-row>
    </el-card>

    <!-- 路径时间线 -->
    <div v-if="pathway" class="pathway-timeline">
      <h3>升学路径时间线</h3>
      
      <!-- 时间线视图切换 -->
      <el-radio-group v-model="viewMode" class="view-mode-switch">
        <el-radio-button label="timeline">时间线视图</el-radio-button>
        <el-radio-button label="gantt">甘特图视图</el-radio-button>
        <el-radio-button label="kanban">看板视图</el-radio-button>
      </el-radio-group>

      <!-- 时间线视图 -->
      <div v-if="viewMode === 'timeline'" class="timeline-view">
        <el-timeline>
          <el-timeline-item
            v-for="milestone in sortedMilestones"
            :key="milestone.id"
            :timestamp="formatDate(milestone.plannedDate)"
            :type="getMilestoneType(milestone)"
            :hollow="milestone.status === 'pending'"
            :size="milestone.priority === 'critical' ? 'large' : 'normal'"
          >
            <el-card 
              :class="['milestone-card', milestone.status]"
              @click="selectMilestone(milestone)"
            >
              <div class="milestone-header">
                <h4>{{ milestone.title }}</h4>
                <el-tag 
                  :type="getPriorityType(milestone.priority)"
                  size="small"
                >
                  {{ getPriorityLabel(milestone.priority) }}
                </el-tag>
              </div>
              
              <p class="milestone-description">{{ milestone.description }}</p>
              
              <div class="milestone-meta">
                <span class="meta-item">
                  <el-icon><User /></el-icon>
                  {{ milestone.assignedTo?.length || 0 }} 位负责人
                </span>
                <span class="meta-item">
                  <el-icon><Memo /></el-icon>
                  {{ milestone.actionItems?.length || 0 }} 个任务
                </span>
                <span class="meta-item">
                  <el-icon><CircleCheck /></el-icon>
                  {{ milestone.progress }}%
                </span>
              </div>
              
              <el-progress 
                :percentage="milestone.progress" 
                :status="milestone.status === 'completed' ? 'success' : undefined"
              />
            </el-card>
          </el-timeline-item>
        </el-timeline>
      </div>

      <!-- 看板视图 -->
      <div v-else-if="viewMode === 'kanban'" class="kanban-view">
        <el-row :gutter="20">
          <el-col :span="6" v-for="status in kanbanColumns" :key="status.value">
            <div class="kanban-column">
              <div class="column-header">
                <h4>{{ status.label }}</h4>
                <el-tag>{{ getMilestonesByStatus(status.value).length }}</el-tag>
              </div>
              
              <draggable
                :list="getMilestonesByStatus(status.value)"
                :group="{ name: 'milestones' }"
                item-key="id"
                @change="handleDragChange"
                class="milestone-list"
              >
                <template #item="{ element }">
                  <el-card 
                    class="kanban-milestone"
                    @click="selectMilestone(element)"
                  >
                    <h5>{{ element.title }}</h5>
                    <el-tag 
                      :type="getPriorityType(element.priority)" 
                      size="small"
                    >
                      {{ getPriorityLabel(element.priority) }}
                    </el-tag>
                    <div class="milestone-date">
                      <el-icon><Calendar /></el-icon>
                      {{ formatDate(element.plannedDate) }}
                    </div>
                  </el-card>
                </template>
              </draggable>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>

    <!-- 空状态 -->
    <el-empty v-else description="请选择学生查看升学路径" />

    <!-- 里程碑详情侧边栏 -->
    <el-drawer
      v-model="showMilestoneDetail"
      :title="selectedMilestone?.title"
      size="50%"
    >
      <MilestoneDetail 
        v-if="selectedMilestone"
        :milestone="selectedMilestone"
        :pathway-id="pathway?._id"
        @update="handleMilestoneUpdate"
        @close="showMilestoneDetail = false"
      />
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { 
  Plus, User, Memo, CircleCheck, Calendar 
} from '@element-plus/icons-vue'
import type { IStudent, IPathway, IMilestone } from '@/types/teacher-dashboard'

// 模拟数据
const studentList = ref<IStudent[]>([])
const selectedStudentId = ref('')
const currentStudent = ref<IStudent | null>(null)
const pathway = ref<IPathway | null>(null)
const viewMode = ref('timeline')
const showMilestoneDetail = ref(false)
const selectedMilestone = ref<IMilestone | null>(null)

// 看板列定义
const kanbanColumns = [
  { label: '待开始', value: 'pending' },
  { label: '进行中', value: 'in_progress' },
  { label: '已完成', value: 'completed' },
  { label: '已延期', value: 'delayed' }
]

// 计算属性
const sortedMilestones = computed(() => {
  if (!pathway.value) return []
  return [...pathway.value.milestones].sort((a, b) => 
    new Date(a.plannedDate).getTime() - new Date(b.plannedDate).getTime()
  )
})

// 方法
const loadStudentPathway = async () => {
  if (!selectedStudentId.value) return
  
  // TODO: 从API加载数据
  // 模拟数据
  currentStudent.value = studentList.value.find(s => s._id === selectedStudentId.value) || null
  
  if (currentStudent.value) {
    pathway.value = {
      _id: '1',
      studentId: selectedStudentId.value,
      targetUniversity: currentStudent.value.targetUniversities.primary,
      milestones: [
        {
          id: '1',
          type: 'exam',
          category: 'standardized_test',
          title: 'IELTS 考试',
          description: '目标分数 7.5，当前模考 6.5',
          plannedDate: new Date('2024-03-15'),
          status: 'in_progress',
          priority: 'high',
          progress: 60,
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
          status: 'pending',
          priority: 'critical',
          progress: 0,
          dependencies: [],
          assignedTo: ['teacher2'],
          actionItems: [],
          attachments: []
        }
      ],
      status: 'active',
      version: 1,
      adjustmentHistory: [],
      createdAt: new Date(),
      lastModified: new Date(),
      overallProgress: 30
    }
  }
}

const createNewPathway = () => {
  ElMessage.info('创建新路径功能开发中')
}

const selectMilestone = (milestone: IMilestone) => {
  selectedMilestone.value = milestone
  showMilestoneDetail.value = true
}

const formatDate = (date: Date | string) => {
  const d = new Date(date)
  return d.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  })
}

const getMilestoneType = (milestone: IMilestone) => {
  if (milestone.status === 'completed') return 'success'
  if (milestone.status === 'delayed') return 'danger'
  if (milestone.status === 'in_progress') return 'primary'
  return ''
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
    high: '高',
    medium: '中',
    low: '低'
  }
  return map[priority] || priority
}

const getProgressStatus = (progress?: number) => {
  if (!progress) return undefined
  if (progress >= 80) return 'success'
  if (progress < 50) return 'exception'
  return undefined
}

const getMilestonesByStatus = (status: string) => {
  if (!pathway.value) return []
  return pathway.value.milestones.filter(m => m.status === status)
}

const handleDragChange = (evt: any) => {
  console.log('拖拽变化:', evt)
  // TODO: 更新里程碑状态
}

const handleMilestoneUpdate = () => {
  loadStudentPathway()
  ElMessage.success('里程碑已更新')
}

onMounted(() => {
  // TODO: 加载学生列表
  studentList.value = [
    {
      _id: '1',
      basicInfo: {
        name: '李明',
        grade: '高二',
        class: '3',
        studentId: 'S20230001',
        enrollmentDate: new Date()
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
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ]
})
</script>

<style scoped>
.pathway-management {
  height: 100%;
  overflow-y: auto;
}

.management-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.management-header h2 {
  margin: 0;
  font-size: 24px;
  color: #303133;
}

.header-actions {
  display: flex;
  align-items: center;
}

/* 学生信息概览 */
.student-overview {
  margin-bottom: 24px;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.info-item label {
  color: #606266;
  font-weight: 500;
}

/* 路径时间线 */
.pathway-timeline h3 {
  font-size: 18px;
  margin-bottom: 16px;
}

.view-mode-switch {
  margin-bottom: 24px;
}

/* 时间线视图 */
.timeline-view {
  padding: 0 24px;
}

.milestone-card {
  cursor: pointer;
  transition: all 0.3s;
}

.milestone-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.milestone-card.completed {
  opacity: 0.8;
}

.milestone-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.milestone-header h4 {
  margin: 0;
  font-size: 16px;
}

.milestone-description {
  color: #606266;
  margin-bottom: 12px;
  font-size: 14px;
}

.milestone-meta {
  display: flex;
  gap: 16px;
  margin-bottom: 12px;
  font-size: 13px;
  color: #909399;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 4px;
}

/* 看板视图 */
.kanban-view {
  height: calc(100vh - 300px);
  overflow-x: auto;
}

.kanban-column {
  background-color: #f5f7fa;
  border-radius: 8px;
  padding: 16px;
  height: 100%;
}

.column-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.column-header h4 {
  margin: 0;
  font-size: 16px;
}

.milestone-list {
  min-height: 400px;
}

.kanban-milestone {
  margin-bottom: 12px;
  cursor: move;
}

.kanban-milestone h5 {
  margin: 0 0 8px 0;
  font-size: 14px;
}

.milestone-date {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-top: 8px;
  font-size: 12px;
  color: #909399;
}
</style>