<template>
  <div class="dashboard-overview">
    <h2>工作概览</h2>
    
    <!-- 统计卡片 -->
    <el-row :gutter="20" class="stat-cards">
      <el-col :span="6">
        <el-card class="stat-card">
          <div class="stat-content">
            <div class="stat-icon pending">
              <el-icon><Clock /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ stats.pendingTasks }}</div>
              <div class="stat-label">待处理任务</div>
            </div>
          </div>
        </el-card>
      </el-col>
      
      <el-col :span="6">
        <el-card class="stat-card">
          <div class="stat-content">
            <div class="stat-icon progress">
              <el-icon><Loading /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ stats.inProgressMilestones }}</div>
              <div class="stat-label">进行中里程碑</div>
            </div>
          </div>
        </el-card>
      </el-col>
      
      <el-col :span="6">
        <el-card class="stat-card">
          <div class="stat-content">
            <div class="stat-icon meeting">
              <el-icon><VideoCamera /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ stats.weeklyMeetings }}</div>
              <div class="stat-label">本周会议</div>
            </div>
          </div>
        </el-card>
      </el-col>
      
      <el-col :span="6">
        <el-card class="stat-card">
          <div class="stat-content">
            <div class="stat-icon risk">
              <el-icon><Warning /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ stats.riskStudents }}</div>
              <div class="stat-label">风险学生</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 今日重点 -->
    <el-card class="today-focus">
      <template #header>
        <div class="card-header">
          <h3>今日重点关注</h3>
          <el-button text @click="refreshFocus">
            <el-icon><Refresh /></el-icon>
          </el-button>
        </div>
      </template>
      
      <el-timeline>
        <el-timeline-item
          v-for="item in todayFocus"
          :key="item.id"
          :timestamp="item.time"
          :type="item.type"
        >
          <div class="focus-item">
            <div class="focus-title">{{ item.title }}</div>
            <div class="focus-student">学生：{{ item.studentName }}</div>
            <el-button 
              size="small" 
              type="primary" 
              text 
              @click="handleFocusItem(item)"
            >
              查看详情
            </el-button>
          </div>
        </el-timeline-item>
      </el-timeline>
    </el-card>

    <!-- 快速操作 -->
    <el-card class="quick-actions">
      <template #header>
        <h3>快速操作</h3>
      </template>
      
      <el-row :gutter="20">
        <el-col :span="6">
          <el-button 
            class="action-btn"
            @click="createMilestone"
          >
            <el-icon><Plus /></el-icon>
            <span>创建里程碑</span>
          </el-button>
        </el-col>
        <el-col :span="6">
          <el-button 
            class="action-btn"
            @click="scheduleCollaboration"
          >
            <el-icon><Calendar /></el-icon>
            <span>安排协同会议</span>
          </el-button>
        </el-col>
        <el-col :span="6">
          <el-button 
            class="action-btn"
            @click="viewReports"
          >
            <el-icon><Document /></el-icon>
            <span>查看报告</span>
          </el-button>
        </el-col>
        <el-col :span="6">
          <el-button 
            class="action-btn"
            @click="sendNotification"
          >
            <el-icon><Message /></el-icon>
            <span>发送通知</span>
          </el-button>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import {
  Clock,
  Loading,
  VideoCamera,
  Warning,
  Refresh,
  Plus,
  Calendar,
  Document,
  Message
} from '@element-plus/icons-vue'

// 统计数据
const stats = ref({
  pendingTasks: 12,
  inProgressMilestones: 8,
  weeklyMeetings: 3,
  riskStudents: 2
})

// 今日重点数据
const todayFocus = ref([
  {
    id: 1,
    time: '09:00',
    type: 'danger',
    title: 'A-Level数学模考延期',
    studentName: '李明',
    studentId: '1'
  },
  {
    id: 2,
    time: '14:00',
    type: 'warning',
    title: '牛津大学申请材料需审核',
    studentName: '王芳',
    studentId: '2'
  },
  {
    id: 3,
    time: '15:00',
    type: 'primary',
    title: '升学方案讨论会议',
    studentName: '张三',
    studentId: '3'
  }
])

// 刷新今日重点
const refreshFocus = () => {
  ElMessage.success('已刷新')
  // TODO: 从API获取最新数据
}

// 处理重点事项
const handleFocusItem = (item: any) => {
  console.log('查看详情:', item)
  // TODO: 导航到相应页面
}

// 快速操作
const createMilestone = () => {
  console.log('创建里程碑')
}

const scheduleCollaboration = () => {
  console.log('安排协同会议')
}

const viewReports = () => {
  console.log('查看报告')
}

const sendNotification = () => {
  console.log('发送通知')
}

onMounted(() => {
  // TODO: 从API获取数据
})
</script>

<style scoped>
.dashboard-overview {
  height: 100%;
}

.dashboard-overview h2 {
  margin: 0 0 24px 0;
  font-size: 24px;
  color: #303133;
}

/* 统计卡片 */
.stat-cards {
  margin-bottom: 24px;
}

.stat-card {
  border: none;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  transition: all 0.3s;
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.stat-content {
  display: flex;
  align-items: center;
  padding: 8px 0;
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 16px;
  font-size: 24px;
}

.stat-icon.pending {
  background-color: #fef0f0;
  color: #f56c6c;
}

.stat-icon.progress {
  background-color: #fdf6ec;
  color: #e6a23c;
}

.stat-icon.meeting {
  background-color: #f0f9ff;
  color: #409eff;
}

.stat-icon.risk {
  background-color: #fef0f0;
  color: #f56c6c;
}

.stat-info {
  flex: 1;
}

.stat-value {
  font-size: 28px;
  font-weight: 600;
  color: #303133;
  line-height: 1;
}

.stat-label {
  font-size: 14px;
  color: #909399;
  margin-top: 4px;
}

/* 今日重点 */
.today-focus {
  margin-bottom: 24px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-header h3 {
  margin: 0;
  font-size: 18px;
}

.focus-item {
  padding: 12px;
  background-color: #f5f7fa;
  border-radius: 8px;
}

.focus-title {
  font-weight: 500;
  color: #303133;
  margin-bottom: 4px;
}

.focus-student {
  font-size: 14px;
  color: #606266;
  margin-bottom: 8px;
}

/* 快速操作 */
.quick-actions h3 {
  margin: 0;
  font-size: 18px;
}

.action-btn {
  width: 100%;
  height: 80px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 14px;
  border: 1px solid #e4e7ed;
  background-color: #fff;
  color: #606266;
  transition: all 0.3s;
}

.action-btn:hover {
  color: #409eff;
  border-color: #409eff;
  background-color: #ecf5ff;
}

.action-btn .el-icon {
  font-size: 24px;
}
</style>