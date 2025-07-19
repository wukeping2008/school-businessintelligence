<template>
  <div class="collaboration-hub">
    <!-- 头部区域 -->
    <div class="hub-header">
      <h2>协同中心</h2>
      <el-button type="primary" @click="showNewCollaboration = true">
        <el-icon><Plus /></el-icon>
        发起协同
      </el-button>
    </div>

    <!-- 协同会话列表 -->
    <div class="collaboration-list">
      <el-tabs v-model="activeTab" class="collaboration-tabs">
        <el-tab-pane label="进行中" name="active">
          <div v-if="activeCollaborations.length === 0" class="empty-state">
            <el-empty description="暂无进行中的协同会话" />
          </div>
          <div v-else class="session-list">
            <CollaborationCard
              v-for="collaboration in activeCollaborations"
              :key="collaboration._id"
              :collaboration="collaboration"
              @click="selectCollaboration(collaboration)"
              @close="closeCollaboration(collaboration._id)"
            />
          </div>
        </el-tab-pane>
        
        <el-tab-pane label="已完成" name="completed">
          <div v-if="completedCollaborations.length === 0" class="empty-state">
            <el-empty description="暂无已完成的协同会话" />
          </div>
          <div v-else class="session-list">
            <CollaborationCard
              v-for="collaboration in completedCollaborations"
              :key="collaboration._id"
              :collaboration="collaboration"
              @click="selectCollaboration(collaboration)"
            />
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>

    <!-- 协同详情面板 -->
    <el-drawer
      v-model="showCollaborationDetail"
      :title="currentCollaboration ? `协同会话 - ${currentStudent?.basicInfo.name}` : ''"
      size="60%"
      direction="rtl"
    >
      <div v-if="currentCollaboration" class="collaboration-detail">
        <!-- 学生信息概要 -->
        <div class="student-summary">
          <h3>学生信息</h3>
          <el-descriptions :column="2" border>
            <el-descriptions-item label="姓名">
              {{ currentStudent?.basicInfo.name }}
            </el-descriptions-item>
            <el-descriptions-item label="年级班级">
              {{ currentStudent?.basicInfo.grade }}({{ currentStudent?.basicInfo.class }})班
            </el-descriptions-item>
            <el-descriptions-item label="目标大学">
              {{ currentStudent?.targetUniversities.primary.name }}
            </el-descriptions-item>
            <el-descriptions-item label="目标专业">
              {{ currentStudent?.targetUniversities.primary.major }}
            </el-descriptions-item>
          </el-descriptions>
        </div>

        <!-- 参与者列表 -->
        <div class="participants">
          <h3>参与教师</h3>
          <div class="participant-list">
            <el-tag
              v-for="participant in currentCollaboration.participants"
              :key="participant.teacherId"
              :type="participant.status === 'active' ? 'success' : 'info'"
              class="participant-tag"
            >
              {{ getTeacherName(participant.teacherId) }}
            </el-tag>
          </div>
        </div>

        <!-- 聊天区域 -->
        <div class="chat-area">
          <h3>讨论记录</h3>
          <div class="messages-container" ref="messagesContainer">
            <div 
              v-for="message in currentCollaboration.messages" 
              :key="message._id"
              class="message-item"
              :class="{ 'own-message': message.senderId === currentTeacherId }"
            >
              <div class="message-header">
                <span class="sender-name">{{ getTeacherName(message.senderId) }}</span>
                <span class="send-time">{{ formatTime(message.createdAt) }}</span>
              </div>
              <div class="message-content">{{ message.content }}</div>
              
              <!-- 附件 -->
              <div v-if="message.attachments && message.attachments.length > 0" class="attachments">
                <el-tag
                  v-for="attachment in message.attachments"
                  :key="attachment.id"
                  type="info"
                  effect="plain"
                  class="attachment-tag"
                >
                  <el-icon><Document /></el-icon>
                  {{ attachment.name }}
                </el-tag>
              </div>
            </div>
          </div>

          <!-- 消息输入区 -->
          <div class="message-input">
            <el-input
              v-model="newMessage"
              type="textarea"
              :rows="3"
              placeholder="输入消息..."
              @keyup.enter.ctrl="sendMessage"
            />
            <div class="input-actions">
              <el-button @click="attachFile">
                <el-icon><Paperclip /></el-icon>
                附件
              </el-button>
              <el-button type="primary" @click="sendMessage" :disabled="!newMessage.trim()">
                发送
              </el-button>
            </div>
          </div>
        </div>

        <!-- 行动项 -->
        <div class="action-items">
          <h3>行动项</h3>
          <el-button size="small" @click="showAddActionItem = true">
            <el-icon><Plus /></el-icon>
            添加任务
          </el-button>
          
          <div class="action-list">
            <div
              v-for="item in collaborationActionItems"
              :key="item._id"
              class="action-item"
            >
              <el-checkbox
                :model-value="item.status === 'completed'"
                @change="toggleActionItem(item)"
              >
                <span :class="{ 'completed': item.status === 'completed' }">
                  {{ item.title }}
                </span>
              </el-checkbox>
              <div class="action-meta">
                <el-tag size="small" type="info">{{ getTeacherName(item.assignedTo) }}</el-tag>
                <span class="due-date">{{ formatDate(item.dueDate) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </el-drawer>

    <!-- 发起协同对话框 -->
    <el-dialog
      v-model="showNewCollaboration"
      title="发起协同会话"
      width="600px"
    >
      <el-form :model="newCollaborationForm" label-width="100px">
        <el-form-item label="选择学生" required>
          <el-select
            v-model="newCollaborationForm.studentId"
            placeholder="请选择学生"
            filterable
          >
            <el-option
              v-for="student in store.students"
              :key="student._id"
              :label="student.basicInfo.name"
              :value="student._id"
            />
          </el-select>
        </el-form-item>
        
        <el-form-item label="邀请教师" required>
          <el-select
            v-model="newCollaborationForm.teacherIds"
            multiple
            placeholder="请选择要邀请的教师"
          >
            <el-option
              v-for="teacher in availableTeachers"
              :key="teacher.id"
              :label="teacher.name"
              :value="teacher.id"
            />
          </el-select>
        </el-form-item>
        
        <el-form-item label="协同主题">
          <el-input
            v-model="newCollaborationForm.topic"
            placeholder="请输入协同主题"
          />
        </el-form-item>
        
        <el-form-item label="说明">
          <el-input
            v-model="newCollaborationForm.description"
            type="textarea"
            :rows="3"
            placeholder="请输入协同说明"
          />
        </el-form-item>
      </el-form>
      
      <template #footer>
        <el-button @click="showNewCollaboration = false">取消</el-button>
        <el-button type="primary" @click="createNewCollaboration">
          发起协同
        </el-button>
      </template>
    </el-dialog>

    <!-- 添加行动项对话框 -->
    <el-dialog
      v-model="showAddActionItem"
      title="添加行动项"
      width="500px"
    >
      <el-form :model="newActionItemForm" label-width="100px">
        <el-form-item label="任务标题" required>
          <el-input v-model="newActionItemForm.title" placeholder="请输入任务标题" />
        </el-form-item>
        
        <el-form-item label="负责人" required>
          <el-select v-model="newActionItemForm.assignedTo" placeholder="请选择负责人">
            <el-option
              v-for="participant in currentCollaboration?.participants"
              :key="participant.teacherId"
              :label="getTeacherName(participant.teacherId)"
              :value="participant.teacherId"
            />
          </el-select>
        </el-form-item>
        
        <el-form-item label="截止日期">
          <el-date-picker
            v-model="newActionItemForm.dueDate"
            type="date"
            placeholder="选择截止日期"
          />
        </el-form-item>
        
        <el-form-item label="说明">
          <el-input
            v-model="newActionItemForm.description"
            type="textarea"
            :rows="2"
            placeholder="请输入任务说明"
          />
        </el-form-item>
      </el-form>
      
      <template #footer>
        <el-button @click="showAddActionItem = false">取消</el-button>
        <el-button type="primary" @click="addActionItem">添加</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Document, Paperclip } from '@element-plus/icons-vue'
import { useTeacherDashboardStore } from '@/stores/teacherDashboard'
import type { ICollaboration, IActionItem } from '@/types/teacher-dashboard'

// 协同卡片组件
const CollaborationCard = {
  props: ['collaboration'],
  emits: ['click', 'close'],
  template: `
    <div class="collaboration-card" @click="$emit('click')">
      <div class="card-header">
        <h4>{{ studentName }}</h4>
        <el-tag :type="collaboration.status === 'active' ? 'success' : 'info'" size="small">
          {{ collaboration.status === 'active' ? '进行中' : '已完成' }}
        </el-tag>
      </div>
      <div class="card-content">
        <p class="topic">{{ collaboration.topic || '升学规划讨论' }}</p>
        <div class="card-meta">
          <span>{{ participantCount }}位教师参与</span>
          <span>{{ messageCount }}条消息</span>
        </div>
      </div>
      <div v-if="collaboration.status === 'active'" class="card-actions">
        <el-button 
          type="danger" 
          size="small" 
          text 
          @click.stop="$emit('close')"
        >
          结束会话
        </el-button>
      </div>
    </div>
  `,
  setup(props: any) {
    const store = useTeacherDashboardStore()
    const student = computed(() => 
      store.students.find(s => s._id === props.collaboration.studentId)
    )
    
    return {
      studentName: computed(() => student.value?.basicInfo.name || '未知学生'),
      participantCount: computed(() => props.collaboration.participants.length),
      messageCount: computed(() => props.collaboration.messages?.length || 0)
    }
  }
}

const store = useTeacherDashboardStore()

// 当前教师ID（实际应从认证系统获取）
const currentTeacherId = ref('current-teacher-id')

// 状态
const activeTab = ref('active')
const showCollaborationDetail = ref(false)
const showNewCollaboration = ref(false)
const showAddActionItem = ref(false)
const newMessage = ref('')
const messagesContainer = ref<HTMLElement>()

// 表单数据
const newCollaborationForm = ref({
  studentId: '',
  teacherIds: [] as string[],
  topic: '',
  description: ''
})

const newActionItemForm = ref({
  title: '',
  assignedTo: '',
  dueDate: null as Date | null,
  description: ''
})

// 模拟教师数据
const availableTeachers = ref([
  { id: 'teacher-2', name: '王老师', subject: '数学' },
  { id: 'teacher-3', name: '李老师', subject: '英语' },
  { id: 'teacher-4', name: '张老师', subject: '物理' },
  { id: 'teacher-5', name: '陈老师', subject: '化学' }
])

// 计算属性
const activeCollaborations = computed(() => 
  store.collaborations.filter(c => c.status === 'active')
)

const completedCollaborations = computed(() => 
  store.collaborations.filter(c => c.status === 'completed')
)

const currentCollaboration = computed(() => store.activeCollaboration)

const currentStudent = computed(() => {
  if (!currentCollaboration.value) return null
  return store.students.find(s => s._id === currentCollaboration.value!.studentId)
})

const collaborationActionItems = computed(() => {
  if (!currentCollaboration.value) return []
  return store.actionItems.filter(item => 
    item.relatedCollaboration === currentCollaboration.value!._id
  )
})

// 方法
const selectCollaboration = (collaboration: ICollaboration) => {
  store.activeCollaboration = collaboration
  showCollaborationDetail.value = true
  
  // 滚动到底部显示最新消息
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
    }
  })
}

const closeCollaboration = async (collaborationId: string) => {
  try {
    await ElMessageBox.confirm(
      '确定要结束这个协同会话吗？结束后将无法继续发送消息。',
      '结束协同',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
    )
    
    // 更新协同状态
    const collaboration = store.collaborations.find(c => c._id === collaborationId)
    if (collaboration) {
      collaboration.status = 'completed'
      collaboration.updatedAt = new Date()
    }
    
    ElMessage.success('协同会话已结束')
  } catch {
    // 用户取消
  }
}

const createNewCollaboration = async () => {
  try {
    const { studentId, teacherIds, topic, description } = newCollaborationForm.value
    
    if (!studentId || teacherIds.length === 0) {
      ElMessage.warning('请选择学生和邀请的教师')
      return
    }
    
    const collaboration = await store.createCollaboration(studentId, teacherIds)
    
    // 添加初始消息
    if (topic || description) {
      collaboration.messages.push({
        _id: Date.now().toString(),
        senderId: currentTeacherId.value,
        content: `${topic}\n${description}`,
        type: 'text',
        createdAt: new Date()
      })
    }
    
    // 设置主题
    collaboration.topic = topic
    
    showNewCollaboration.value = false
    resetCollaborationForm()
    
    // 打开新创建的协同会话
    selectCollaboration(collaboration)
    
    ElMessage.success('协同会话创建成功')
  } catch (error) {
    ElMessage.error('创建协同会话失败')
  }
}

const sendMessage = () => {
  if (!newMessage.value.trim() || !currentCollaboration.value) return
  
  const message = {
    _id: Date.now().toString(),
    senderId: currentTeacherId.value,
    content: newMessage.value,
    type: 'text' as const,
    createdAt: new Date()
  }
  
  currentCollaboration.value.messages.push(message)
  newMessage.value = ''
  
  // 滚动到底部
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
    }
  })
}

const attachFile = () => {
  ElMessage.info('文件附件功能开发中')
}

const addActionItem = () => {
  if (!newActionItemForm.value.title || !newActionItemForm.value.assignedTo) {
    ElMessage.warning('请填写必要信息')
    return
  }
  
  const actionItem: IActionItem = {
    _id: Date.now().toString(),
    type: 'collaboration_task',
    title: newActionItemForm.value.title,
    description: newActionItemForm.value.description,
    status: 'pending',
    priority: 'medium',
    assignedTo: newActionItemForm.value.assignedTo,
    relatedStudent: currentStudent.value?._id,
    relatedCollaboration: currentCollaboration.value?._id,
    dueDate: newActionItemForm.value.dueDate || undefined,
    createdBy: currentTeacherId.value,
    createdAt: new Date(),
    updatedAt: new Date()
  }
  
  store.actionItems.push(actionItem)
  showAddActionItem.value = false
  resetActionItemForm()
  
  ElMessage.success('行动项添加成功')
}

const toggleActionItem = (item: IActionItem) => {
  item.status = item.status === 'completed' ? 'pending' : 'completed'
  item.updatedAt = new Date()
}

const getTeacherName = (teacherId: string) => {
  if (teacherId === currentTeacherId.value) return '我'
  const teacher = availableTeachers.value.find(t => t.id === teacherId)
  return teacher?.name || '未知教师'
}

const formatTime = (date: Date) => {
  const now = new Date()
  const diff = now.getTime() - new Date(date).getTime()
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)
  
  if (minutes < 1) return '刚刚'
  if (minutes < 60) return `${minutes}分钟前`
  if (hours < 24) return `${hours}小时前`
  if (days < 7) return `${days}天前`
  
  return new Date(date).toLocaleDateString()
}

const formatDate = (date?: Date) => {
  if (!date) return '未设置'
  return new Date(date).toLocaleDateString()
}

const resetCollaborationForm = () => {
  newCollaborationForm.value = {
    studentId: '',
    teacherIds: [],
    topic: '',
    description: ''
  }
}

const resetActionItemForm = () => {
  newActionItemForm.value = {
    title: '',
    assignedTo: '',
    dueDate: null,
    description: ''
  }
}

// 监听键盘事件
watch(showCollaborationDetail, (val) => {
  if (val) {
    document.addEventListener('keydown', handleKeyDown)
  } else {
    document.removeEventListener('keydown', handleKeyDown)
  }
})

const handleKeyDown = (e: KeyboardEvent) => {
  if (e.ctrlKey && e.key === 'Enter') {
    sendMessage()
  }
}

// 生成模拟的协同数据
onMounted(() => {
  // 生成一些模拟的协同会话
  if (store.collaborations.length === 0 && store.students.length > 0) {
    const mockCollaboration: ICollaboration = {
      _id: 'collab-1',
      studentId: store.students[0]._id,
      initiatorId: currentTeacherId.value,
      participants: [
        {
          teacherId: currentTeacherId.value,
          joinedAt: new Date(),
          status: 'active'
        },
        {
          teacherId: 'teacher-2',
          joinedAt: new Date(),
          status: 'active'
        }
      ],
      topic: '关于李明的升学规划讨论',
      messages: [
        {
          _id: 'msg-1',
          senderId: currentTeacherId.value,
          content: '我想和大家讨论一下李明的升学规划，他的目标是剑桥大学计算机科学专业。',
          type: 'text',
          createdAt: new Date(Date.now() - 3600000)
        },
        {
          _id: 'msg-2',
          senderId: 'teacher-2',
          content: '李明的数学成绩很好，但英语还需要加强，特别是雅思写作部分。',
          type: 'text',
          createdAt: new Date(Date.now() - 1800000)
        }
      ],
      status: 'active',
      createdAt: new Date(Date.now() - 3600000),
      updatedAt: new Date()
    }
    
    store.collaborations.push(mockCollaboration)
  }
})
</script>

<style scoped>
.collaboration-hub {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.hub-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.hub-header h2 {
  margin: 0;
  font-size: 24px;
  color: #303133;
}

.collaboration-list {
  flex: 1;
  overflow: hidden;
}

.collaboration-tabs {
  height: 100%;
}

.collaboration-tabs :deep(.el-tabs__content) {
  height: calc(100% - 55px);
  overflow-y: auto;
}

.session-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 16px;
  padding: 4px;
}

.collaboration-card {
  background: #fff;
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  padding: 16px;
  cursor: pointer;
  transition: all 0.3s;
}

.collaboration-card:hover {
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.card-header h4 {
  margin: 0;
  font-size: 16px;
  color: #303133;
}

.card-content .topic {
  color: #606266;
  margin-bottom: 12px;
  font-size: 14px;
}

.card-meta {
  display: flex;
  gap: 16px;
  font-size: 12px;
  color: #909399;
}

.card-actions {
  margin-top: 12px;
  text-align: right;
}

.empty-state {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 协同详情样式 */
.collaboration-detail {
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.student-summary,
.participants,
.chat-area,
.action-items {
  background: #f5f7fa;
  border-radius: 8px;
  padding: 16px;
}

.student-summary h3,
.participants h3,
.chat-area h3,
.action-items h3 {
  margin: 0 0 16px 0;
  font-size: 16px;
  color: #303133;
}

.participant-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.participant-tag {
  cursor: default;
}

/* 聊天区域样式 */
.chat-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 400px;
}

.messages-container {
  flex: 1;
  overflow-y: auto;
  max-height: 400px;
  margin-bottom: 16px;
  padding: 12px;
  background: #fff;
  border-radius: 4px;
}

.message-item {
  margin-bottom: 16px;
}

.message-item.own-message .message-content {
  background: #409eff;
  color: #fff;
  margin-left: auto;
  margin-right: 0;
}

.message-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 4px;
  font-size: 12px;
  color: #909399;
}

.message-content {
  background: #e4e7ed;
  padding: 8px 12px;
  border-radius: 4px;
  max-width: 70%;
  word-wrap: break-word;
  white-space: pre-wrap;
}

.attachments {
  margin-top: 8px;
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.attachment-tag {
  cursor: pointer;
}

.message-input {
  border-top: 1px solid #e4e7ed;
  padding-top: 12px;
}

.input-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 8px;
}

/* 行动项样式 */
.action-list {
  margin-top: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.action-item {
  background: #fff;
  padding: 12px;
  border-radius: 4px;
  border: 1px solid #e4e7ed;
}

.action-item .completed {
  text-decoration: line-through;
  color: #909399;
}

.action-meta {
  margin-top: 8px;
  margin-left: 24px;
  display: flex;
  gap: 12px;
  align-items: center;
  font-size: 12px;
  color: #909399;
}

.due-date {
  font-size: 12px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .session-list {
    grid-template-columns: 1fr;
  }
  
  .message-content {
    max-width: 85%;
  }
}
</style>