<template>
  <div class="meeting-list">
    <el-card v-loading="loading">
      <template v-if="meetings.length === 0">
        <el-empty description="暂无会议" />
      </template>
      
      <template v-else>
        <div 
          v-for="meeting in meetings" 
          :key="meeting.id" 
          class="meeting-item"
        >
          <div class="meeting-header">
            <div class="meeting-title">
              <h3>{{ meeting.title }}</h3>
              <el-tag :type="getTypeTagType(meeting.type)" size="small">
                {{ getTypeLabel(meeting.type) }}
              </el-tag>
            </div>
            <div class="meeting-actions">
              <el-button 
                v-if="meeting.status === 'scheduled'" 
                text 
                type="primary"
                @click="$emit('edit', meeting)"
              >
                编辑
              </el-button>
              <el-button 
                v-if="meeting.status === 'scheduled' || meeting.status === 'ongoing'" 
                text 
                type="success"
                @click="$emit('join', meeting)"
              >
                {{ meeting.status === 'ongoing' ? '进入会议' : '加入会议' }}
              </el-button>
              <el-button 
                v-if="meeting.status === 'scheduled'" 
                text 
                type="danger"
                @click="$emit('cancel', meeting)"
              >
                取消
              </el-button>
              <el-button 
                v-if="meeting.status === 'completed'" 
                text 
                @click="$emit('view', meeting)"
              >
                查看详情
              </el-button>
            </div>
          </div>

          <div class="meeting-info">
            <div class="info-item">
              <el-icon><Clock /></el-icon>
              <span>{{ formatDateTime(meeting.scheduledAt) }}</span>
              <span class="duration">（{{ meeting.duration }}分钟）</span>
            </div>
            
            <div class="info-item">
              <el-icon><Location /></el-icon>
              <span v-if="meeting.locationType === 'online'">
                线上会议
                <el-tag v-if="meeting.status === 'ongoing'" type="success" size="small">
                  进行中
                </el-tag>
              </span>
              <span v-else>{{ meeting.location }}</span>
            </div>

            <div v-if="meeting.participants.length > 0" class="info-item">
              <el-icon><User /></el-icon>
              <span>参会人员：</span>
              <el-tag 
                v-for="(participant, index) in getParticipantNames(meeting.participants)" 
                :key="index"
                size="small"
                class="participant-tag"
              >
                {{ participant }}
              </el-tag>
            </div>

            <div v-if="meeting.relatedStudents.length > 0" class="info-item">
              <el-icon><UserFilled /></el-icon>
              <span>相关学生：</span>
              <el-tag 
                v-for="(student, index) in getStudentNames(meeting.relatedStudents)" 
                :key="index"
                size="small"
                type="info"
                class="student-tag"
              >
                {{ student }}
              </el-tag>
            </div>
          </div>

          <div class="meeting-agenda">
            <div class="agenda-label">会议议程：</div>
            <pre>{{ meeting.agenda }}</pre>
          </div>
        </div>
      </template>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { Clock, Location, User, UserFilled } from '@element-plus/icons-vue'

interface Meeting {
  id: string
  title: string
  type: string
  relatedStudents: string[]
  participants: string[]
  scheduledAt: string
  duration: number
  locationType: 'online' | 'offline'
  location?: string
  meetingUrl?: string
  agenda: string
  notes?: string
  status: 'scheduled' | 'ongoing' | 'completed' | 'cancelled'
  createdBy: string
  createdAt: string
}

defineProps<{
  meetings: Meeting[]
  loading: boolean
}>()

defineEmits<{
  refresh: []
  edit: [meeting: Meeting]
  cancel: [meeting: Meeting]
  join: [meeting: Meeting]
  view: [meeting: Meeting]
}>()

// 模拟数据映射
const teacherMap: Record<string, string> = {
  '1': '张老师',
  '2': '李老师',
  '3': '王老师',
  '4': '陈老师'
}

const studentMap: Record<string, string> = {
  '1': '张三',
  '2': '李四',
  '3': '王五'
}

// 获取会议类型标签
const getTypeLabel = (type: string) => {
  const typeMap: Record<string, string> = {
    student_case: '学生个案',
    pathway_planning: '升学规划',
    teaching_discussion: '教学研讨',
    parent_meeting: '家长会议',
    other: '其他'
  }
  return typeMap[type] || type
}

// 获取类型标签样式
const getTypeTagType = (type: string) => {
  const typeMap: Record<string, string> = {
    student_case: 'primary',
    pathway_planning: 'success',
    teaching_discussion: 'warning',
    parent_meeting: 'danger',
    other: 'info'
  }
  return typeMap[type] || 'info'
}

// 获取参会人员名称
const getParticipantNames = (ids: string[]) => {
  return ids.map(id => teacherMap[id] || id)
}

// 获取学生名称
const getStudentNames = (ids: string[]) => {
  return ids.map(id => studentMap[id] || id)
}

// 格式化日期时间
const formatDateTime = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    weekday: 'short'
  })
}
</script>

<style scoped lang="scss">
.meeting-list {
  .meeting-item {
    padding: 20px;
    border-bottom: 1px solid #e4e7ed;

    &:last-child {
      border-bottom: none;
    }

    .meeting-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 15px;

      .meeting-title {
        display: flex;
        align-items: center;
        gap: 10px;

        h3 {
          margin: 0;
          font-size: 18px;
          color: #303133;
        }
      }

      .meeting-actions {
        display: flex;
        gap: 10px;
      }
    }

    .meeting-info {
      margin-bottom: 15px;

      .info-item {
        display: flex;
        align-items: center;
        margin-bottom: 8px;
        color: #606266;
        font-size: 14px;

        .el-icon {
          margin-right: 8px;
          color: #909399;
        }

        .duration {
          margin-left: 5px;
          color: #909399;
        }

        .participant-tag,
        .student-tag {
          margin-left: 5px;
        }
      }
    }

    .meeting-agenda {
      background-color: #f5f7fa;
      padding: 15px;
      border-radius: 4px;

      .agenda-label {
        font-weight: 500;
        margin-bottom: 8px;
        color: #606266;
      }

      pre {
        margin: 0;
        white-space: pre-wrap;
        font-family: inherit;
        font-size: 14px;
        line-height: 1.6;
        color: #606266;
      }
    }
  }
}
</style>