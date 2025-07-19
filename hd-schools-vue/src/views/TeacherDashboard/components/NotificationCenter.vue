<template>
  <div class="notification-center">
    <!-- 通知筛选 -->
    <div class="notification-filter">
      <el-radio-group v-model="filterType" size="small">
        <el-radio-button label="all">全部</el-radio-button>
        <el-radio-button label="unread">未读</el-radio-button>
        <el-radio-button label="milestone">里程碑</el-radio-button>
        <el-radio-button label="collaboration">协同</el-radio-button>
      </el-radio-group>
      
      <el-button 
        v-if="hasUnread" 
        text 
        type="primary"
        @click="markAllAsRead"
      >
        全部标记已读
      </el-button>
    </div>

    <!-- 通知列表 -->
    <div class="notification-list">
      <transition-group name="notification">
        <div
          v-for="notification in filteredNotifications"
          :key="notification.id"
          class="notification-item"
          :class="{ 
            unread: !notification.read,
            [notification.priority]: true
          }"
          @click="handleNotificationClick(notification)"
        >
          <!-- 通知图标 -->
          <div class="notification-icon">
            <el-icon v-if="notification.type === 'milestone_due'"><Clock /></el-icon>
            <el-icon v-else-if="notification.type === 'milestone_delayed'"><WarningFilled /></el-icon>
            <el-icon v-else-if="notification.type === 'achievement'"><Trophy /></el-icon>
            <el-icon v-else-if="notification.type === 'collaboration'"><Connection /></el-icon>
            <el-icon v-else><Bell /></el-icon>
          </div>
          
          <!-- 通知内容 -->
          <div class="notification-content">
            <h4>{{ notification.title }}</h4>
            <p>{{ notification.message }}</p>
            
            <!-- 学术成就标签 -->
            <div v-if="notification.achievement" class="achievement-badge">
              <el-icon><Medal /></el-icon>
              {{ notification.achievement }}
            </div>
            
            <div class="notification-meta">
              <span class="notification-time">
                <el-icon><Clock /></el-icon>
                {{ formatTime(notification.createdAt) }}
              </span>
              <span v-if="notification.student" class="notification-student">
                <el-icon><User /></el-icon>
                {{ notification.student }}
              </span>
            </div>
          </div>
          
          <!-- 快速操作 -->
          <div class="notification-actions">
            <el-button 
              v-if="!notification.read"
              text 
              size="small"
              @click.stop="markAsRead(notification)"
            >
              标记已读
            </el-button>
            <el-button 
              text 
              size="small"
              type="primary"
              @click.stop="handleAction(notification)"
            >
              查看详情
            </el-button>
          </div>
        </div>
      </transition-group>
      
      <!-- 空状态 -->
      <div v-if="filteredNotifications.length === 0" class="empty-state">
        <el-icon :size="48"><Notification /></el-icon>
        <p>暂无{{ filterType === 'unread' ? '未读' : '' }}通知</p>
      </div>
    </div>

    <!-- 底部统计 -->
    <div class="notification-footer">
      <div class="stats">
        <span>共 {{ notifications.length }} 条通知</span>
        <span v-if="unreadCount > 0" class="unread-count">
          {{ unreadCount }} 条未读
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import {
  Clock, WarningFilled, Trophy, Connection, Bell, Medal, User, Notification
} from '@element-plus/icons-vue'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/zh-cn'

dayjs.extend(relativeTime)
dayjs.locale('zh-cn')

const emit = defineEmits<{
  close: []
  read: [id: string]
}>()

const filterType = ref('all')

// 模拟通知数据
const notifications = ref([
  {
    id: '1',
    type: 'milestone_due',
    title: '里程碑即将到期',
    message: 'IELTS考试将于3天后进行，请确保学生李明做好充分准备。',
    priority: 'high',
    read: false,
    student: '李明',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    relatedEntity: { type: 'milestone', id: '1' }
  },
  {
    id: '2',
    type: 'achievement',
    title: '学术成就达成！',
    message: '恭喜！王芳在A-Level数学模考中获得A*成绩，超越预期目标。',
    priority: 'success',
    read: false,
    student: '王芳',
    achievement: '卓越表现',
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
    relatedEntity: { type: 'student', id: '2' }
  },
  {
    id: '3',
    type: 'collaboration',
    title: '新的协同讨论',
    message: '陈老师邀请您参与关于张三升学方案的讨论。',
    priority: 'normal',
    read: true,
    student: '张三',
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
    relatedEntity: { type: 'discussion', id: '1' }
  },
  {
    id: '4',
    type: 'milestone_delayed',
    title: '里程碑延期警告',
    message: '个人陈述撰写进度滞后，可能影响申请时间表，请及时跟进。',
    priority: 'urgent',
    read: false,
    student: '李明',
    createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
    relatedEntity: { type: 'milestone', id: '3' }
  }
])

const filteredNotifications = computed(() => {
  let result = notifications.value
  
  if (filterType.value === 'unread') {
    result = result.filter(n => !n.read)
  } else if (filterType.value === 'milestone') {
    result = result.filter(n => n.type.includes('milestone'))
  } else if (filterType.value === 'collaboration') {
    result = result.filter(n => n.type === 'collaboration')
  }
  
  return result.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
})

const unreadCount = computed(() => {
  return notifications.value.filter(n => !n.read).length
})

const hasUnread = computed(() => unreadCount.value > 0)

const formatTime = (date: Date) => {
  return dayjs(date).fromNow()
}

const markAsRead = (notification: any) => {
  notification.read = true
  emit('read', notification.id)
}

const markAllAsRead = () => {
  notifications.value.forEach(n => {
    if (!n.read) {
      n.read = true
      emit('read', n.id)
    }
  })
  ElMessage.success('已全部标记为已读')
}

const handleNotificationClick = (notification: any) => {
  if (!notification.read) {
    markAsRead(notification)
  }
  handleAction(notification)
}

const handleAction = (notification: any) => {
  // TODO: 根据通知类型导航到相应页面
  console.log('查看详情:', notification)
  emit('close')
}
</script>

<style scoped>
.notification-center {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.notification-filter {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid #e4e7ed;
}

.notification-list {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
}

.notification-item {
  display: flex;
  gap: 16px;
  padding: 16px;
  margin-bottom: 12px;
  background: #f5f7fa;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
  border-left: 4px solid transparent;
}

.notification-item:hover {
  background: #ecf5ff;
  transform: translateX(4px);
}

.notification-item.unread {
  background: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.notification-item.urgent {
  border-left-color: #f56c6c;
}

.notification-item.high {
  border-left-color: #e6a23c;
}

.notification-item.success {
  border-left-color: #67c23a;
}

.notification-item.normal {
  border-left-color: #409eff;
}

.notification-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  flex-shrink: 0;
}

.notification-item.urgent .notification-icon {
  color: #f56c6c;
  background: #fef0f0;
}

.notification-item.high .notification-icon {
  color: #e6a23c;
  background: #fdf6ec;
}

.notification-item.success .notification-icon {
  color: #67c23a;
  background: #f0f9ff;
}

.notification-content {
  flex: 1;
  min-width: 0;
}

.notification-content h4 {
  margin: 0 0 4px 0;
  font-size: 14px;
  color: #303133;
}

.notification-content p {
  margin: 0 0 8px 0;
  font-size: 13px;
  color: #606266;
  line-height: 1.5;
}

.achievement-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 12px;
  background: linear-gradient(135deg, #ffd700 0%, #ffed4e 100%);
  color: #5a3f00;
  border-radius: 16px;
  font-size: 12px;
  font-weight: 500;
  margin: 8px 0;
}

.notification-meta {
  display: flex;
  gap: 16px;
  font-size: 12px;
  color: #909399;
}

.notification-meta span {
  display: flex;
  align-items: center;
  gap: 4px;
}

.notification-actions {
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex-shrink: 0;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 300px;
  color: #c0c4cc;
}

.empty-state p {
  margin: 16px 0 0 0;
  font-size: 14px;
}

.notification-footer {
  padding: 16px;
  border-top: 1px solid #e4e7ed;
}

.stats {
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  color: #909399;
}

.unread-count {
  color: #e6a23c;
  font-weight: 500;
}

/* 动画 */
.notification-enter-active,
.notification-leave-active {
  transition: all 0.3s ease;
}

.notification-enter-from {
  opacity: 0;
  transform: translateX(-20px);
}

.notification-leave-to {
  opacity: 0;
  transform: translateX(20px);
}

/* 自定义滚动条 */
.notification-list::-webkit-scrollbar {
  width: 6px;
}

.notification-list::-webkit-scrollbar-track {
  background: transparent;
}

.notification-list::-webkit-scrollbar-thumb {
  background: #dcdfe6;
  border-radius: 3px;
}

.notification-list::-webkit-scrollbar-thumb:hover {
  background: #c0c4cc;
}
</style>