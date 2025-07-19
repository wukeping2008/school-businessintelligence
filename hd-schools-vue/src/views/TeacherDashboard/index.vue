<template>
  <div class="teacher-dashboard">
    <div class="dashboard-header">
      <h1>教师工作台</h1>
      <div class="header-actions">
        <el-badge :value="unreadNotifications" class="notification-badge">
          <el-button :icon="Notification" circle @click="showNotifications = true" />
        </el-badge>
        <el-dropdown>
          <el-button type="primary">
            {{ currentUser?.username || '教师' }}
            <el-icon class="el-icon--right"><arrow-down /></el-icon>
          </el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="goToProfile">个人资料</el-dropdown-item>
              <el-dropdown-item @click="logout">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>

    <div class="dashboard-content">
      <el-row :gutter="20">
        <!-- 左侧导航 -->
        <el-col :span="5" class="sidebar">
          <el-menu
            :default-active="activeMenu"
            router
            class="dashboard-menu"
          >
            <el-menu-item index="/teacher-dashboard/overview">
              <el-icon><DataAnalysis /></el-icon>
              <span>工作概览</span>
            </el-menu-item>
            <el-menu-item index="/teacher-dashboard/students">
              <el-icon><UserFilled /></el-icon>
              <span>我的学生</span>
            </el-menu-item>
            <el-menu-item index="/teacher-dashboard/pathway">
              <el-icon><Promotion /></el-icon>
              <span>升学路径</span>
            </el-menu-item>
            <el-menu-item index="/teacher-dashboard/milestones">
              <el-icon><Flag /></el-icon>
              <span>里程碑管理</span>
            </el-menu-item>
            <el-menu-item index="/teacher-dashboard/collaboration">
              <el-icon><ChatDotRound /></el-icon>
              <span>协同交流</span>
              <el-badge v-if="unreadMessages > 0" :value="unreadMessages" />
            </el-menu-item>
            <el-menu-item index="/teacher-dashboard/calendar">
              <el-icon><Calendar /></el-icon>
              <span>日程安排</span>
            </el-menu-item>
          </el-menu>
        </el-col>

        <!-- 主内容区 -->
        <el-col :span="19" class="main-content">
          <router-view v-slot="{ Component }">
            <transition name="fade" mode="out-in">
              <component :is="Component" />
            </transition>
          </router-view>
        </el-col>
      </el-row>
    </div>

    <!-- 通知抽屉 -->
    <el-drawer
      v-model="showNotifications"
      title="通知中心"
      direction="rtl"
      size="400px"
    >
      <NotificationList 
        v-if="showNotifications"
        @close="showNotifications = false" 
        @read="handleNotificationRead"
      />
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import {
  Notification,
  ArrowDown,
  DataAnalysis,
  UserFilled,
  Promotion,
  Flag,
  ChatDotRound,
  Calendar
} from '@element-plus/icons-vue'
import { useTeacherDashboardStore } from '@/stores/teacherDashboard'

// 导入通知组件
import NotificationList from './components/NotificationList.vue'

const router = useRouter()
const route = useRoute()
const store = useTeacherDashboardStore()

// 响应式数据
const showNotifications = ref(false)
const currentUser = ref(null)

// 计算属性
const activeMenu = computed(() => route.path)
const unreadNotifications = computed(() => store.unreadCount)
const unreadMessages = computed(() => {
  // 计算未读的协同消息数
  return store.collaborations
    .filter(c => c.status === 'active')
    .reduce((count, collaboration) => {
      const lastReadTime = localStorage.getItem(`collab-read-${collaboration._id}`)
      if (!lastReadTime) return count + collaboration.messages.length
      
      const unreadInCollab = collaboration.messages.filter(
        msg => new Date(msg.createdAt) > new Date(lastReadTime)
      ).length
      return count + unreadInCollab
    }, 0)
})

// 处理通知已读
const handleNotificationRead = (notificationId: string) => {
  store.markNotificationAsRead(notificationId)
}

// 退出登录
const logout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('userInfo')
  router.push('/login')
  ElMessage.success('已退出登录')
}

// 前往个人资料
const goToProfile = () => {
  ElMessage.info('个人资料页面开发中')
}

// 监听路由变化，标记协同消息已读
watch(() => route.path, (newPath) => {
  if (newPath.includes('/collaboration')) {
    // 标记当前协同会话的消息为已读
    if (store.activeCollaboration) {
      localStorage.setItem(
        `collab-read-${store.activeCollaboration._id}`, 
        new Date().toISOString()
      )
    }
  }
})

onMounted(async () => {
  // 获取当前用户信息
  const userInfo = localStorage.getItem('userInfo')
  if (userInfo) {
    currentUser.value = JSON.parse(userInfo)
  }
  
  // 初始化数据
  try {
    await Promise.all([
      store.fetchStudents(),
      store.fetchNotifications()
    ])
  } catch (error) {
    console.error('初始化数据失败:', error)
  }
  
  // TODO: 连接WebSocket进行实时通信
})

onUnmounted(() => {
  // TODO: 断开WebSocket连接
})
</script>

<style scoped>
.teacher-dashboard {
  height: calc(100vh - 60px); /* 减去顶部导航高度 */
  display: flex;
  flex-direction: column;
  background-color: #f5f7fa;
  margin-top: -20px; /* 抵消主容器的padding */
}

.dashboard-header {
  height: 60px;
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 24px;
  position: sticky;
  top: 0;
  z-index: 100;
}

.dashboard-header h1 {
  font-size: 20px;
  margin: 0;
  color: #303133;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 16px;
}

.notification-badge {
  margin-right: 8px;
}

.notification-badge :deep(.el-badge__content) {
  background-color: #f56c6c;
}

.dashboard-content {
  flex: 1;
  padding: 20px;
  overflow: hidden;
  height: calc(100% - 60px);
}

.dashboard-content > .el-row {
  height: 100%;
}

.sidebar {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  height: 100%;
  overflow-y: auto;
}

.dashboard-menu {
  border: none;
  padding: 12px 0;
  height: 100%;
}

.dashboard-menu .el-menu-item {
  height: 48px;
  line-height: 48px;
  margin: 4px 12px;
  border-radius: 8px;
}

.dashboard-menu .el-menu-item.is-active {
  background-color: #ecf5ff;
  color: #409eff;
}

.dashboard-menu .el-badge {
  position: absolute;
  right: 20px;
  top: 50%;
  transform: translateY(-50%);
}

.main-content {
  height: 100%;
  overflow-y: auto;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  padding: 24px;
}

/* 过渡动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* 自定义滚动条 */
.main-content::-webkit-scrollbar,
.sidebar::-webkit-scrollbar {
  width: 6px;
}

.main-content::-webkit-scrollbar-thumb,
.sidebar::-webkit-scrollbar-thumb {
  background-color: #dcdfe6;
  border-radius: 3px;
}

.main-content::-webkit-scrollbar-thumb:hover,
.sidebar::-webkit-scrollbar-thumb:hover {
  background-color: #c0c4cc;
}

/* 响应式 */
@media (max-width: 1200px) {
  .dashboard-content .el-col.sidebar {
    display: none;
  }
  
  .dashboard-content .el-col.main-content {
    flex: 0 0 100%;
    max-width: 100%;
  }
  
  .dashboard-header h1 {
    font-size: 18px;
  }
}

@media (max-width: 768px) {
  .dashboard-header {
    padding: 0 16px;
  }
  
  .dashboard-content {
    padding: 12px;
  }
  
  .main-content {
    padding: 16px;
  }
}
</style>