<template>
  <div class="meeting-management">
    <div class="page-header">
      <h2>会议管理</h2>
      <el-button type="primary" @click="showMeetingDialog = true">
        <el-icon><Plus /></el-icon>
        发起会议
      </el-button>
    </div>

    <!-- 会议列表 -->
    <el-tabs v-model="activeTab" @tab-click="handleTabChange">
      <el-tab-pane label="即将进行" name="upcoming">
        <MeetingList 
          :meetings="upcomingMeetings" 
          :loading="loading"
          @refresh="fetchMeetings"
          @edit="editMeeting"
          @cancel="cancelMeeting"
          @join="joinMeeting"
        />
      </el-tab-pane>
      <el-tab-pane label="进行中" name="ongoing">
        <MeetingList 
          :meetings="ongoingMeetings" 
          :loading="loading"
          @refresh="fetchMeetings"
          @join="joinMeeting"
        />
      </el-tab-pane>
      <el-tab-pane label="已结束" name="completed">
        <MeetingList 
          :meetings="completedMeetings" 
          :loading="loading"
          @refresh="fetchMeetings"
          @view="viewMeetingDetails"
        />
      </el-tab-pane>
    </el-tabs>

    <!-- 发起会议对话框 -->
    <el-dialog 
      v-model="showMeetingDialog" 
      :title="editingMeeting ? '编辑会议' : '发起会议'"
      width="700px"
      @closed="resetForm"
    >
      <el-form 
        ref="meetingFormRef" 
        :model="meetingForm" 
        :rules="meetingRules"
        label-width="120px"
      >
        <el-form-item label="会议主题" prop="title">
          <el-input 
            v-model="meetingForm.title" 
            placeholder="请输入会议主题"
          />
        </el-form-item>

        <el-form-item label="会议类型" prop="type">
          <el-select v-model="meetingForm.type" placeholder="请选择会议类型">
            <el-option label="学生个案讨论" value="student_case" />
            <el-option label="升学路径规划" value="pathway_planning" />
            <el-option label="教学研讨" value="teaching_discussion" />
            <el-option label="家长会议" value="parent_meeting" />
            <el-option label="其他" value="other" />
          </el-select>
        </el-form-item>

        <el-form-item label="相关学生" prop="relatedStudents">
          <el-select 
            v-model="meetingForm.relatedStudents" 
            multiple 
            filterable
            placeholder="请选择相关学生（可选）"
          >
            <el-option 
              v-for="student in studentList"
              :key="student.id"
              :label="student.name"
              :value="student.id"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="参会人员" prop="participants">
          <el-select 
            v-model="meetingForm.participants" 
            multiple 
            filterable
            placeholder="请选择参会人员"
          >
            <el-option 
              v-for="teacher in teacherList"
              :key="teacher.id"
              :label="teacher.name"
              :value="teacher.id"
            >
              <span>{{ teacher.name }}</span>
              <span style="color: #999; margin-left: 10px;">{{ teacher.role }}</span>
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="会议时间" prop="scheduledAt">
          <el-date-picker
            v-model="meetingForm.scheduledAt"
            type="datetime"
            placeholder="选择日期时间"
            format="YYYY-MM-DD HH:mm"
            value-format="YYYY-MM-DD HH:mm:ss"
          />
        </el-form-item>

        <el-form-item label="预计时长" prop="duration">
          <el-select v-model="meetingForm.duration" placeholder="请选择预计时长">
            <el-option label="30分钟" :value="30" />
            <el-option label="45分钟" :value="45" />
            <el-option label="1小时" :value="60" />
            <el-option label="1.5小时" :value="90" />
            <el-option label="2小时" :value="120" />
          </el-select>
        </el-form-item>

        <el-form-item label="会议地点" prop="location">
          <el-radio-group v-model="meetingForm.locationType">
            <el-radio label="online">线上会议</el-radio>
            <el-radio label="offline">线下会议</el-radio>
          </el-radio-group>
          <el-input 
            v-if="meetingForm.locationType === 'offline'"
            v-model="meetingForm.location" 
            placeholder="请输入会议地点"
            style="margin-top: 10px;"
          />
        </el-form-item>

        <el-form-item label="会议议程" prop="agenda">
          <el-input 
            v-model="meetingForm.agenda" 
            type="textarea"
            :rows="4"
            placeholder="请输入会议议程"
          />
        </el-form-item>

        <el-form-item label="备注" prop="notes">
          <el-input 
            v-model="meetingForm.notes" 
            type="textarea"
            :rows="3"
            placeholder="请输入备注信息（选填）"
          />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="showMeetingDialog = false">取消</el-button>
        <el-button type="primary" @click="submitMeeting" :loading="submitting">
          {{ editingMeeting ? '保存' : '创建会议' }}
        </el-button>
      </template>
    </el-dialog>

    <!-- 会议详情对话框 -->
    <el-dialog 
      v-model="showDetailsDialog" 
      title="会议详情"
      width="700px"
    >
      <MeetingDetails 
        v-if="selectedMeeting"
        :meeting="selectedMeeting"
      />
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox, FormInstance, FormRules } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import axios from 'axios'
import MeetingList from './MeetingList.vue'
import MeetingDetails from './MeetingDetails.vue'

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

interface Student {
  id: string
  name: string
  grade: string
  class: string
}

interface Teacher {
  id: string
  name: string
  role: string
}

const meetings = ref<Meeting[]>([])
const loading = ref(false)
const showMeetingDialog = ref(false)
const showDetailsDialog = ref(false)
const submitting = ref(false)
const activeTab = ref('upcoming')
const editingMeeting = ref<Meeting | null>(null)
const selectedMeeting = ref<Meeting | null>(null)

const studentList = ref<Student[]>([
  { id: '1', name: '张三', grade: '高三', class: '1班' },
  { id: '2', name: '李四', grade: '高三', class: '2班' },
  { id: '3', name: '王五', grade: '高二', class: '3班' }
])

const teacherList = ref<Teacher[]>([
  { id: '1', name: '张老师', role: '数学老师' },
  { id: '2', name: '李老师', role: '英语老师' },
  { id: '3', name: '王老师', role: '班主任' },
  { id: '4', name: '陈老师', role: '升学指导' }
])

const meetingFormRef = ref<FormInstance>()
const meetingForm = reactive({
  title: '',
  type: '',
  relatedStudents: [] as string[],
  participants: [] as string[],
  scheduledAt: '',
  duration: 60,
  locationType: 'online' as 'online' | 'offline',
  location: '',
  agenda: '',
  notes: ''
})

const meetingRules: FormRules = {
  title: [
    { required: true, message: '请输入会议主题', trigger: 'blur' }
  ],
  type: [
    { required: true, message: '请选择会议类型', trigger: 'change' }
  ],
  participants: [
    { required: true, message: '请选择参会人员', trigger: 'change', type: 'array', min: 1 }
  ],
  scheduledAt: [
    { required: true, message: '请选择会议时间', trigger: 'change' }
  ],
  duration: [
    { required: true, message: '请选择预计时长', trigger: 'change' }
  ],
  agenda: [
    { required: true, message: '请输入会议议程', trigger: 'blur' }
  ]
}

// 按状态过滤会议
const upcomingMeetings = computed(() => 
  meetings.value.filter(m => m.status === 'scheduled')
)

const ongoingMeetings = computed(() => 
  meetings.value.filter(m => m.status === 'ongoing')
)

const completedMeetings = computed(() => 
  meetings.value.filter(m => m.status === 'completed')
)

// 获取会议列表
const fetchMeetings = async () => {
  loading.value = true
  try {
    // 模拟数据
    meetings.value = [
      {
        id: '1',
        title: '张三升学路径讨论会',
        type: 'pathway_planning',
        relatedStudents: ['1'],
        participants: ['1', '3', '4'],
        scheduledAt: '2024-02-01 14:00:00',
        duration: 60,
        locationType: 'online',
        meetingUrl: 'https://meet.example.com/123',
        agenda: '1. 当前学习情况分析\n2. 目标大学讨论\n3. 提升计划制定',
        status: 'scheduled',
        createdBy: 'current-user',
        createdAt: '2024-01-25 10:00:00'
      },
      {
        id: '2',
        title: '高三年级教学研讨会',
        type: 'teaching_discussion',
        relatedStudents: [],
        participants: ['1', '2', '3'],
        scheduledAt: '2024-01-30 15:00:00',
        duration: 90,
        locationType: 'offline',
        location: '会议室A',
        agenda: '1. 期末考试分析\n2. 下学期教学计划\n3. 学生情况交流',
        status: 'ongoing',
        createdBy: 'current-user',
        createdAt: '2024-01-20 09:00:00'
      }
    ]
  } catch (error) {
    ElMessage.error('获取会议列表失败')
  } finally {
    loading.value = false
  }
}

// 提交会议
const submitMeeting = async () => {
  if (!meetingFormRef.value) return

  await meetingFormRef.value.validate(async (valid) => {
    if (!valid) return

    submitting.value = true
    try {
      const response = await axios.post('http://localhost:3001/api/meetings', {
        ...meetingForm
      })

      if (response.data.success) {
        ElMessage.success(editingMeeting.value ? '会议更新成功' : '会议创建成功')
        showMeetingDialog.value = false
        await fetchMeetings()
      }
    } catch (error) {
      ElMessage.error('操作失败')
    } finally {
      submitting.value = false
    }
  })
}

// 编辑会议
const editMeeting = (meeting: Meeting) => {
  editingMeeting.value = meeting
  Object.assign(meetingForm, {
    title: meeting.title,
    type: meeting.type,
    relatedStudents: meeting.relatedStudents,
    participants: meeting.participants,
    scheduledAt: meeting.scheduledAt,
    duration: meeting.duration,
    locationType: meeting.locationType,
    location: meeting.location || '',
    agenda: meeting.agenda,
    notes: meeting.notes || ''
  })
  showMeetingDialog.value = true
}

// 取消会议
const cancelMeeting = async (meeting: Meeting) => {
  try {
    await ElMessageBox.confirm(
      `确定要取消会议"${meeting.title}"吗？`,
      '取消会议',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )

    ElMessage.success('会议已取消')
    await fetchMeetings()
  } catch {
    // 用户取消
  }
}

// 加入会议
const joinMeeting = (meeting: Meeting) => {
  if (meeting.locationType === 'online' && meeting.meetingUrl) {
    window.open(meeting.meetingUrl, '_blank')
  } else {
    ElMessage.info(`会议地点：${meeting.location}`)
  }
}

// 查看会议详情
const viewMeetingDetails = (meeting: Meeting) => {
  selectedMeeting.value = meeting
  showDetailsDialog.value = true
}

// 重置表单
const resetForm = () => {
  editingMeeting.value = null
  meetingFormRef.value?.resetFields()
  Object.assign(meetingForm, {
    title: '',
    type: '',
    relatedStudents: [],
    participants: [],
    scheduledAt: '',
    duration: 60,
    locationType: 'online',
    location: '',
    agenda: '',
    notes: ''
  })
}

// 处理标签页切换
const handleTabChange = () => {
  // 可以在这里添加额外的逻辑
}

onMounted(() => {
  fetchMeetings()
})
</script>

<style scoped lang="scss">
.meeting-management {
  padding: 20px;

  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;

    h2 {
      margin: 0;
      font-size: 24px;
    }
  }

  :deep(.el-tabs__content) {
    padding-top: 20px;
  }
}
</style>