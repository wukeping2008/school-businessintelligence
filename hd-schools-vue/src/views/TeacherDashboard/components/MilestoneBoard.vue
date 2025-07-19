<template>
  <div class="milestone-board">
    <div class="board-columns">
      <div 
        v-for="column in columns" 
        :key="column.status"
        class="board-column"
        :class="column.status"
      >
        <div class="column-header">
          <h4>{{ column.title }}</h4>
          <el-badge :value="getColumnCount(column.status)" />
        </div>
        
        <div 
          class="column-body"
          @dragover.prevent
          @drop="handleDrop($event, column.status)"
        >
          <transition-group name="milestone-move">
            <div
              v-for="milestone in getColumnMilestones(column.status)"
              :key="milestone.id"
              class="milestone-card"
              :class="[milestone.priority, { dragging: draggedItem?.id === milestone.id }]"
              draggable="true"
              @dragstart="handleDragStart($event, milestone)"
              @dragend="handleDragEnd"
              @click="$emit('select', milestone)"
            >
              <!-- 优先级标记 -->
              <div v-if="milestone.priority === 'critical'" class="priority-ribbon">
                <el-icon><Warning /></el-icon>
              </div>
              
              <div class="card-header">
                <h5>{{ milestone.title }}</h5>
                <el-dropdown trigger="click" @command="handleCommand($event, milestone)">
                  <el-button text :icon="MoreFilled" circle size="small" />
                  <template #dropdown>
                    <el-dropdown-menu>
                      <el-dropdown-item command="edit">编辑</el-dropdown-item>
                      <el-dropdown-item command="delete" divided>删除</el-dropdown-item>
                    </el-dropdown-menu>
                  </template>
                </el-dropdown>
              </div>
              
              <div class="card-meta">
                <el-tag :type="getTypeTag(milestone.type)" size="small">
                  {{ getTypeLabel(milestone.type) }}
                </el-tag>
                <span class="due-date" :class="{ overdue: isOverdue(milestone) }">
                  <el-icon><Calendar /></el-icon>
                  {{ formatDate(milestone.plannedDate) }}
                </span>
              </div>
              
              <el-progress 
                :percentage="milestone.progress" 
                :show-text="false"
                :stroke-width="4"
              />
              
              <div class="card-footer">
                <div class="assignees">
                  <el-avatar 
                    v-for="(assignee, index) in milestone.assignedTo.slice(0, 3)"
                    :key="assignee"
                    :size="24"
                    :style="{ marginLeft: index > 0 ? '-8px' : '0' }"
                  >
                    {{ getAssigneeInitial(assignee) }}
                  </el-avatar>
                  <span v-if="milestone.assignedTo.length > 3" class="more-assignees">
                    +{{ milestone.assignedTo.length - 3 }}
                  </span>
                </div>
                
                <div class="action-count">
                  <el-icon><Memo /></el-icon>
                  {{ milestone.actionItems?.length || 0 }}
                </div>
              </div>
              
              <!-- 鼓励标签 -->
              <div v-if="milestone.progress >= 80 && milestone.status !== 'completed'" class="encouragement-tag">
                <el-icon><Sunrise /></el-icon>
                即将完成！
              </div>
            </div>
          </transition-group>
          
          <!-- 空状态 -->
          <div v-if="getColumnMilestones(column.status).length === 0" class="empty-state">
            <el-icon :size="32"><FolderOpened /></el-icon>
            <p>暂无里程碑</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { 
  Warning, MoreFilled, Calendar, Memo, Sunrise, FolderOpened 
} from '@element-plus/icons-vue'
import dayjs from 'dayjs'
import type { IMilestone } from '@/types/teacher-dashboard'

const props = defineProps<{
  milestones: IMilestone[]
}>()

const emit = defineEmits<{
  update: [milestone: IMilestone]
  select: [milestone: IMilestone]
}>()

const draggedItem = ref<IMilestone | null>(null)

const columns = [
  { status: 'pending', title: '待开始', color: '#909399' },
  { status: 'in_progress', title: '进行中', color: '#409eff' },
  { status: 'completed', title: '已完成', color: '#67c23a' },
  { status: 'delayed', title: '已延期', color: '#f56c6c' }
]

const getColumnMilestones = (status: string) => {
  return props.milestones.filter(m => m.status === status)
}

const getColumnCount = (status: string) => {
  return getColumnMilestones(status).length
}

const handleDragStart = (event: DragEvent, milestone: IMilestone) => {
  draggedItem.value = milestone
  event.dataTransfer!.effectAllowed = 'move'
  event.dataTransfer!.setData('text/html', event.currentTarget as any)
}

const handleDragEnd = () => {
  draggedItem.value = null
}

const handleDrop = (event: DragEvent, newStatus: string) => {
  event.preventDefault()
  
  if (draggedItem.value && draggedItem.value.status !== newStatus) {
    const updatedMilestone = {
      ...draggedItem.value,
      status: newStatus as any
    }
    
    // 如果移动到完成状态，自动设置进度为100%
    if (newStatus === 'completed') {
      updatedMilestone.progress = 100
      updatedMilestone.actualDate = new Date()
    }
    
    emit('update', updatedMilestone)
    ElMessage.success(`里程碑已移动到${columns.find(c => c.status === newStatus)?.title}`)
  }
}

const handleCommand = (command: string, milestone: IMilestone) => {
  if (command === 'edit') {
    emit('select', milestone)
  } else if (command === 'delete') {
    ElMessageBox.confirm(
      `确定要删除里程碑"${milestone.title}"吗？`,
      '确认删除',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    ).then(() => {
      // TODO: 实现删除功能
      ElMessage.success('删除成功')
    })
  }
}

const formatDate = (date: Date | string) => {
  return dayjs(date).format('MM/DD')
}

const isOverdue = (milestone: IMilestone) => {
  return milestone.status !== 'completed' && 
    dayjs(milestone.plannedDate).isBefore(dayjs(), 'day')
}

const getTypeTag = (type: string) => {
  const map: Record<string, string> = {
    exam: 'success',
    document: 'warning',
    application: 'danger',
    activity: 'info',
    achievement: 'primary'
  }
  return map[type] || ''
}

const getTypeLabel = (type: string) => {
  const map: Record<string, string> = {
    exam: '考试',
    document: '文档',
    application: '申请',
    activity: '活动',
    achievement: '成就'
  }
  return map[type] || type
}

const getAssigneeInitial = (assigneeId: string) => {
  // TODO: 从真实数据获取
  return assigneeId.charAt(0).toUpperCase()
}
</script>

<style scoped>
.milestone-board {
  min-height: 600px;
}

.board-columns {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  height: 100%;
}

.board-column {
  background: #f5f7fa;
  border-radius: 8px;
  overflow: hidden;
}

.column-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background: white;
  border-bottom: 2px solid;
}

.board-column.pending .column-header {
  border-bottom-color: #909399;
}

.board-column.in_progress .column-header {
  border-bottom-color: #409eff;
}

.board-column.completed .column-header {
  border-bottom-color: #67c23a;
}

.board-column.delayed .column-header {
  border-bottom-color: #f56c6c;
}

.column-header h4 {
  margin: 0;
  font-size: 16px;
  color: #303133;
}

.column-body {
  padding: 16px;
  min-height: 500px;
  max-height: 600px;
  overflow-y: auto;
}

.milestone-card {
  position: relative;
  background: white;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 12px;
  cursor: grab;
  transition: all 0.3s;
  border: 1px solid #e4e7ed;
}

.milestone-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.milestone-card.dragging {
  opacity: 0.5;
  cursor: grabbing;
}

.milestone-card.critical {
  border-color: #f56c6c;
}

.priority-ribbon {
  position: absolute;
  top: -1px;
  right: -1px;
  background: #f56c6c;
  color: white;
  padding: 4px 8px;
  border-radius: 0 8px 0 8px;
  font-size: 12px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
}

.card-header h5 {
  margin: 0;
  font-size: 14px;
  color: #303133;
  flex: 1;
  line-height: 1.4;
}

.card-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.due-date {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #606266;
}

.due-date.overdue {
  color: #f56c6c;
  font-weight: 500;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 12px;
}

.assignees {
  display: flex;
  align-items: center;
}

.more-assignees {
  margin-left: 8px;
  font-size: 12px;
  color: #909399;
}

.action-count {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #909399;
}

.encouragement-tag {
  position: absolute;
  bottom: 8px;
  right: 8px;
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  background: #fdf6ec;
  color: #e6a23c;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 200px;
  color: #c0c4cc;
}

.empty-state p {
  margin: 8px 0 0 0;
  font-size: 14px;
}

/* 动画 */
.milestone-move-move,
.milestone-move-enter-active,
.milestone-move-leave-active {
  transition: all 0.3s ease;
}

.milestone-move-enter-from,
.milestone-move-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

.milestone-move-leave-active {
  position: absolute;
}

/* 自定义滚动条 */
.column-body::-webkit-scrollbar {
  width: 6px;
}

.column-body::-webkit-scrollbar-track {
  background: transparent;
}

.column-body::-webkit-scrollbar-thumb {
  background: #dcdfe6;
  border-radius: 3px;
}

.column-body::-webkit-scrollbar-thumb:hover {
  background: #c0c4cc;
}
</style>