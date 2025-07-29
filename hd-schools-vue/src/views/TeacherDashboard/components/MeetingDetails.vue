<template>
  <div class="meeting-details">
    <el-descriptions :column="2" border>
      <el-descriptions-item label="会议主题" :span="2">
        {{ meeting.title }}
      </el-descriptions-item>
      
      <el-descriptions-item label="会议类型">
        <el-tag :type="getTypeTagType(meeting.type)">
          {{ getTypeLabel(meeting.type) }}
        </el-tag>
      </el-descriptions-item>
      
      <el-descriptions-item label="会议状态">
        <el-tag :type="getStatusTagType(meeting.status)">
          {{ getStatusLabel(meeting.status) }}
        </el-tag>
      </el-descriptions-item>
      
      <el-descriptions-item label="会议时间">
        {{ formatDateTime(meeting.scheduledAt) }}
      </el-descriptions-item>
      
      <el-descriptions-item label="会议时长">
        {{ meeting.duration }}分钟
      </el-descriptions-item>
      
      <el-descriptions-item label="会议地点" :span="2">
        <span v-if="meeting.locationType === 'online'">
          线上会议
          <el-link 
            v-if="meeting.meetingUrl" 
            type="primary" 
            :href="meeting.meetingUrl"
            target="_blank"
            style="margin-left: 10px;"
          >
            会议链接
          </el-link>
        </span>
        <span v-else>{{ meeting.location }}</span>
      </el-descriptions-item>
      
      <el-descriptions-item label="参会人员" :span="2">
        <el-tag 
          v-for="(participant, index) in getParticipantNames(meeting.participants)" 
          :key="index"
          style="margin-right: 5px; margin-bottom: 5px;"
        >
          {{ participant }}
        </el-tag>
      </el-descriptions-item>
      
      <el-descriptions-item v-if="meeting.relatedStudents.length > 0" label="相关学生" :span="2">
        <el-tag 
          v-for="(student, index) in getStudentNames(meeting.relatedStudents)" 
          :key="index"
          type="info"
          style="margin-right: 5px; margin-bottom: 5px;"
        >
          {{ student }}
        </el-tag>
      </el-descriptions-item>
      
      <el-descriptions-item label="创建人">
        {{ getCreatorName(meeting.createdBy) }}
      </el-descriptions-item>
      
      <el-descriptions-item label="创建时间">
        {{ formatDateTime(meeting.createdAt) }}
      </el-descriptions-item>
    </el-descriptions>

    <div class="section">
      <h4>会议议程</h4>
      <div class="content-box">
        <pre>{{ meeting.agenda }}</pre>
      </div>
    </div>

    <div v-if="meeting.notes" class="section">
      <h4>备注</h4>
      <div class="content-box">
        <pre>{{ meeting.notes }}</pre>
      </div>
    </div>

    <div v-if="meeting.status === 'completed' && meetingMinutes" class="section">
      <h4>会议纪要</h4>
      <div class="content-box">
        <div class="minutes-info">
          <p><strong>记录人：</strong>{{ meetingMinutes.recorder }}</p>
          <p><strong>记录时间：</strong>{{ formatDateTime(meetingMinutes.recordedAt) }}</p>
        </div>
        <el-divider />
        <div class="minutes-content">
          <h5>主要内容</h5>
          <pre>{{ meetingMinutes.content }}</pre>
          
          <h5>决议事项</h5>
          <ul>
            <li v-for="(decision, index) in meetingMinutes.decisions" :key="index">
              {{ decision }}
            </li>
          </ul>
          
          <h5>后续行动</h5>
          <ul>
            <li v-for="(action, index) in meetingMinutes.actions" :key="index">
              {{ action.task }} - 负责人：{{ action.assignee }}，截止时间：{{ formatDate(action.deadline) }}
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

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

interface MeetingMinutes {
  recorder: string
  recordedAt: string
  content: string
  decisions: string[]
  actions: {
    task: string
    assignee: string
    deadline: string
  }[]
}

const props = defineProps<{
  meeting: Meeting
}>()

const meetingMinutes = ref<MeetingMinutes | null>(null)

// 模拟数据映射
const teacherMap: Record<string, string> = {
  '1': '张老师',
  '2': '李老师',
  '3': '王老师',
  '4': '陈老师',
  'current-user': '当前用户'
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

// 获取状态标签
const getStatusLabel = (status: string) => {
  const statusMap: Record<string, string> = {
    scheduled: '已安排',
    ongoing: '进行中',
    completed: '已完成',
    cancelled: '已取消'
  }
  return statusMap[status] || status
}

// 获取状态标签样式
const getStatusTagType = (status: string) => {
  const typeMap: Record<string, string> = {
    scheduled: 'warning',
    ongoing: 'success',
    completed: 'info',
    cancelled: 'danger'
  }
  return typeMap[status] || 'info'
}

// 获取参会人员名称
const getParticipantNames = (ids: string[]) => {
  return ids.map(id => teacherMap[id] || id)
}

// 获取学生名称
const getStudentNames = (ids: string[]) => {
  return ids.map(id => studentMap[id] || id)
}

// 获取创建人名称
const getCreatorName = (id: string) => {
  return teacherMap[id] || id
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

// 格式化日期
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  })
}

// 获取会议纪要
const fetchMeetingMinutes = () => {
  // 模拟已完成会议的纪要
  if (props.meeting.status === 'completed') {
    meetingMinutes.value = {
      recorder: '张老师',
      recordedAt: '2024-01-30 17:00:00',
      content: '本次会议主要讨论了高三年级期末考试情况，分析了学生整体表现，并制定了下学期的教学计划。',
      decisions: [
        '加强数学和英语的课后辅导',
        '每周增加一次模拟考试',
        '建立学生一对一辅导机制'
      ],
      actions: [
        {
          task: '制定详细的辅导计划',
          assignee: '张老师',
          deadline: '2024-02-05'
        },
        {
          task: '安排模拟考试时间表',
          assignee: '李老师',
          deadline: '2024-02-03'
        }
      ]
    }
  }
}

onMounted(() => {
  fetchMeetingMinutes()
})
</script>

<style scoped lang="scss">
.meeting-details {
  .section {
    margin-top: 20px;

    h4 {
      margin-bottom: 15px;
      color: #303133;
      font-size: 16px;
    }

    h5 {
      margin: 15px 0 10px;
      color: #606266;
      font-size: 14px;
    }

    .content-box {
      background-color: #f5f7fa;
      padding: 15px;
      border-radius: 4px;

      pre {
        margin: 0;
        white-space: pre-wrap;
        font-family: inherit;
        font-size: 14px;
        line-height: 1.6;
        color: #606266;
      }

      ul {
        margin: 10px 0;
        padding-left: 20px;

        li {
          margin-bottom: 8px;
          color: #606266;
        }
      }

      .minutes-info {
        p {
          margin-bottom: 8px;
          color: #606266;
        }
      }
    }
  }
}
</style>