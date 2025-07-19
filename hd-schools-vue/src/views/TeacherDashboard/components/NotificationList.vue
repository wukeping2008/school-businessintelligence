<template>
  <div class="notification-list">
    <div class="notification-header">
      <el-button 
        v-if="unreadNotifications.length > 0" 
        size="small" 
        @click="markAllAsRead"
      >
        全部标记已读
      </el-button>
    </div>
    
    <el-tabs v-model="activeTab" class="notification-tabs">
      <el-tab-pane label="未读" name="unread">
        <el-empty 
          v-if="unreadNotifications.length === 0" 
          description="暂无未读通知" 
        />
        <div v-else class="notification-items">
          <div 
            v-for="notification in unreadNotifications" 
            :key="notification._id"
            class="notification-item unread"
            @click="handleNotificationClick(notification)"
          >
            <NotificationItem :notification="notification" />
          </div>
        </div>
      </el-tab-pane>
      
      <el-tab-pane label="全部" name="all">
        <el-empty 
          v-if="allNotifications.length === 0" 
          description="暂无通知" 
        />
        <div v-else class="notification-items">
          <div 
            v-for="notification in allNotifications" 
            :key="notification._id"
            class="notification-item"
            :class="{ unread: !notification.read }"
            @click="handleNotificationClick(notification)"
          >
            <NotificationItem :notification="notification" />
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useTeacherDashboardStore } from '@/stores/teacherDashboard'
import type { INotification } from '@/types/teacher-dashboard'

// 通知项组件
const NotificationItem = {
  props: ['notification'],
  template: `
    <div>
      <div class="item-header">
        <el-tag :type="getNotificationType(notification.priority)" size="small">
          {{ getNotificationTypeLabel(notification.type) }}
        </el-tag>
        <span class="notification-time">{{ formatTime(notification.createdAt) }}</span>
      </div>
      <h4>{{ notification.title }}</h4>
      <p>{{ notification.content }}</p>
      <div v-if="notification.actionRequired" class="notification-actions">
        <el-button size="small" type="primary" text>查看详情</el-button>
      </div>
    </div>
  `,
  setup() {
    const getNotificationType = (priority: string) => {
      const map: Record<string, string> = {
        urgent: 'danger',
        high: 'warning',
        medium: '',
        low: 'info'
      }
      return map[priority] || ''
    }
    
    const getNotificationTypeLabel = (type: string) => {
      const labels: Record<string, string> = {
        milestone_due: '里程碑提醒',
        collaboration_invite: '协同邀请',
        student_risk: '风险预警',
        meeting_reminder: '会议提醒',
        system: '系统通知'
      }
      return labels[type] || type
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
    
    return {
      getNotificationType,
      getNotificationTypeLabel,
      formatTime
    }
  }
}

const emit = defineEmits<{
  close: []
  read: [notificationId: string]
}>()

const store = useTeacherDashboardStore()
const router = useRouter()

const activeTab = ref('unread')

// 计算属性
const allNotifications = computed(() => store.notifications)
const unreadNotifications = computed(() => store.unreadNotifications)

// 处理通知点击
const handleNotificationClick = async (notification: INotification) => {
  // 标记为已读
  if (!notification.read) {
    await store.markNotificationAsRead(notification._id)
    emit('read', notification._id)
  }
  
  // 根据通知类型进行导航
  switch (notification.type) {
    case 'milestone_due':
      if (notification.relatedMilestone) {
        router.push({
          name: 'TeacherDashboardMilestones',
          query: { milestoneId: notification.relatedMilestone }
        })
      }
      break
      
    case 'collaboration_invite':
      if (notification.relatedStudent) {
        router.push({
          name: 'TeacherDashboardCollaboration',
          query: { studentId: notification.relatedStudent }
        })
      }
      break
      
    case 'student_risk':
      if (notification.relatedStudent) {
        router.push({
          name: 'TeacherDashboardPathway',
          query: { studentId: notification.relatedStudent }
        })
      }
      break
      
    default:
      // 其他类型的通知
      ElMessage.info('查看通知详情')
  }
  
  // 关闭抽屉
  emit('close')
}

// 全部标记为已读
const markAllAsRead = async () => {
  try {
    for (const notification of unreadNotifications.value) {
      await store.markNotificationAsRead(notification._id)
    }
    ElMessage.success('已全部标记为已读')
  } catch (error) {
    ElMessage.error('操作失败')
  }
}
</script>

<style scoped>
.notification-list {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.notification-header {
  padding: 0 0 16px 0;
  text-align: right;
}

.notification-tabs {
  flex: 1;
}

.notification-tabs :deep(.el-tabs__content) {
  height: calc(100% - 55px);
  overflow-y: auto;
}

.notification-items {
  padding: 0;
}

.notification-item {
  padding: 16px;
  border-bottom: 1px solid #ebeef5;
  cursor: pointer;
  transition: background-color 0.3s;
}

.notification-item:hover {
  background-color: #f5f7fa;
}

.notification-item.unread {
  background-color: #f0f9ff;
  border-left: 3px solid #409eff;
}

.item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.notification-time {
  font-size: 12px;
  color: #909399;
}

.notification-item h4 {
  margin: 0 0 4px 0;
  font-size: 14px;
  font-weight: 500;
  color: #303133;
}

.notification-item p {
  margin: 0;
  font-size: 13px;
  color: #606266;
  line-height: 1.5;
}

.notification-actions {
  margin-top: 8px;
}

/* 自定义滚动条 */
.notification-tabs :deep(.el-tabs__content)::-webkit-scrollbar {
  width: 6px;
}

.notification-tabs :deep(.el-tabs__content)::-webkit-scrollbar-thumb {
  background-color: #dcdfe6;
  border-radius: 3px;
}

.notification-tabs :deep(.el-tabs__content)::-webkit-scrollbar-thumb:hover {
  background-color: #c0c4cc;
}
</style>