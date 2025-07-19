<template>
  <div class="teacher-dashboard-simple">
    <div class="dashboard-header">
      <h1>教师工作台</h1>
      <p>升学里程碑追踪系统</p>
    </div>

    <div class="dashboard-content">
      <!-- 学生选择 -->
      <div class="student-selector-section">
        <h2>选择学生</h2>
        <el-select 
          v-model="selectedStudentId" 
          placeholder="请选择学生"
          @change="loadStudentData"
          style="width: 300px"
        >
          <el-option
            v-for="student in studentList"
            :key="student.id"
            :label="student.name"
            :value="student.id"
          >
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <span>{{ student.name }}</span>
              <span style="font-size: 12px; color: #999;">{{ student.target }}</span>
            </div>
          </el-option>
        </el-select>
      </div>

      <!-- 当前学生信息 -->
      <div v-if="currentStudent" class="student-info-section">
        <h2>{{ currentStudent.name }} - 升学进度</h2>
        <div class="student-stats">
          <div class="stat-card">
            <h3>目标大学</h3>
            <p>{{ currentStudent.target }}</p>
          </div>
          <div class="stat-card">
            <h3>整体进度</h3>
            <el-progress :percentage="currentStudent.progress" />
          </div>
          <div class="stat-card">
            <h3>剩余天数</h3>
            <p class="countdown">{{ daysRemaining }} 天</p>
          </div>
        </div>
      </div>

      <!-- 里程碑列表 -->
      <div v-if="currentStudent" class="milestones-section">
        <div class="section-header">
          <h2>里程碑管理</h2>
          <el-button type="primary" @click="showAddDialog = true">
            添加里程碑
          </el-button>
        </div>

        <div class="milestones-grid">
          <div 
            v-for="milestone in milestones" 
            :key="milestone.id"
            class="milestone-card"
            :class="milestone.status"
          >
            <div class="milestone-header">
              <h4>{{ milestone.title }}</h4>
              <el-tag 
                :type="getStatusType(milestone.status)"
                size="small"
              >
                {{ getStatusLabel(milestone.status) }}
              </el-tag>
            </div>
            
            <p class="milestone-desc">{{ milestone.description }}</p>
            
            <div class="milestone-meta">
              <div class="milestone-date">
                <el-icon><Calendar /></el-icon>
                {{ formatDate(milestone.date) }}
              </div>
              <div class="milestone-priority">
                <el-tag 
                  :type="getPriorityType(milestone.priority)"
                  size="small"
                  effect="plain"
                >
                  {{ milestone.priority }}
                </el-tag>
              </div>
            </div>
            
            <div class="milestone-progress">
              <span>进度: {{ milestone.progress }}%</span>
              <el-progress 
                :percentage="milestone.progress" 
                :status="milestone.progress === 100 ? 'success' : ''"
                :stroke-width="6"
              />
            </div>
            
            <div class="milestone-actions">
              <el-button size="small" @click="editMilestone(milestone)">
                编辑
              </el-button>
              <el-button 
                size="small" 
                type="success" 
                v-if="milestone.progress < 100"
                @click="updateProgress(milestone)"
              >
                更新进度
              </el-button>
            </div>
          </div>
        </div>
      </div>

      <!-- 空状态 -->
      <div v-if="!currentStudent" class="empty-state">
        <el-icon size="64"><User /></el-icon>
        <h3>请选择学生开始管理</h3>
        <p>选择一个学生来查看和管理他们的升学里程碑</p>
      </div>
    </div>

    <!-- 添加里程碑对话框 -->
    <el-dialog
      v-model="showAddDialog"
      title="添加新里程碑"
      width="500px"
    >
      <el-form :model="newMilestone" label-width="100px">
        <el-form-item label="标题">
          <el-input v-model="newMilestone.title" placeholder="例如：IELTS考试" />
        </el-form-item>
        
        <el-form-item label="描述">
          <el-input 
            v-model="newMilestone.description" 
            type="textarea"
            placeholder="详细描述里程碑内容"
          />
        </el-form-item>
        
        <el-form-item label="计划日期">
          <el-date-picker
            v-model="newMilestone.date"
            type="date"
            placeholder="选择日期"
          />
        </el-form-item>
        
        <el-form-item label="优先级">
          <el-select v-model="newMilestone.priority">
            <el-option label="关键" value="关键" />
            <el-option label="重要" value="重要" />
            <el-option label="普通" value="普通" />
          </el-select>
        </el-form-item>
      </el-form>
      
      <template #footer>
        <el-button @click="showAddDialog = false">取消</el-button>
        <el-button type="primary" @click="addMilestone">确定</el-button>
      </template>
    </el-dialog>

    <!-- 编辑进度对话框 -->
    <el-dialog
      v-model="showProgressDialog"
      title="更新进度"
      width="400px"
    >
      <div v-if="editingMilestone">
        <h4>{{ editingMilestone.title }}</h4>
        <el-form label-width="80px">
          <el-form-item label="当前进度">
            <el-slider 
              v-model="newProgress" 
              :marks="{ 0: '0%', 25: '25%', 50: '50%', 75: '75%', 100: '100%' }"
              show-input
            />
          </el-form-item>
        </el-form>
      </div>
      
      <template #footer>
        <el-button @click="showProgressDialog = false">取消</el-button>
        <el-button type="primary" @click="saveProgress">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { Calendar, User } from '@element-plus/icons-vue'

// 响应式数据
const selectedStudentId = ref('')
const currentStudent = ref(null)
const showAddDialog = ref(false)
const showProgressDialog = ref(false)
const editingMilestone = ref(null)
const newProgress = ref(0)

// 模拟学生数据
const studentList = ref([
  {
    id: '1',
    name: '李明',
    target: '剑桥大学',
    progress: 65
  },
  {
    id: '2',
    name: '王芳',
    target: '牛津大学',
    progress: 78
  },
  {
    id: '3',
    name: '张三',
    target: '帝国理工学院',
    progress: 45
  }
])

// 里程碑数据
const milestones = ref([])

// 新里程碑表单
const newMilestone = ref({
  title: '',
  description: '',
  date: '',
  priority: '普通'
})

// 计算属性
const daysRemaining = computed(() => {
  const deadline = new Date('2024-10-15')
  const today = new Date()
  const days = Math.ceil((deadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
  return days > 0 ? days : 0
})

// 方法
const loadStudentData = () => {
  const student = studentList.value.find(s => s.id === selectedStudentId.value)
  if (student) {
    currentStudent.value = student
    
    // 加载该学生的里程碑数据
    milestones.value = [
      {
        id: '1',
        title: 'IELTS 考试',
        description: '目标分数 7.5',
        date: new Date('2024-03-15'),
        status: 'completed',
        priority: '重要',
        progress: 100
      },
      {
        id: '2',
        title: 'A-Level 数学考试',
        description: '目标成绩 A*',
        date: new Date('2024-05-20'),
        status: 'in_progress',
        priority: '关键',
        progress: 75
      },
      {
        id: '3',
        title: '个人陈述完成',
        description: '完成并润色个人陈述',
        date: new Date('2024-08-01'),
        status: 'pending',
        priority: '重要',
        progress: 30
      },
      {
        id: '4',
        title: 'UCAS申请提交',
        description: '完成并提交UCAS申请',
        date: new Date('2024-10-15'),
        status: 'pending',
        priority: '关键',
        progress: 0
      }
    ]
  }
}

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('zh-CN')
}

const getStatusType = (status) => {
  const map = {
    completed: 'success',
    in_progress: 'warning',
    pending: 'info'
  }
  return map[status] || 'info'
}

const getStatusLabel = (status) => {
  const map = {
    completed: '已完成',
    in_progress: '进行中',
    pending: '待开始'
  }
  return map[status] || status
}

const getPriorityType = (priority) => {
  const map = {
    '关键': 'danger',
    '重要': 'warning',
    '普通': 'info'
  }
  return map[priority] || 'info'
}

const addMilestone = () => {
  if (!newMilestone.value.title || !newMilestone.value.date) {
    ElMessage.warning('请填写完整信息')
    return
  }
  
  const milestone = {
    id: Date.now().toString(),
    title: newMilestone.value.title,
    description: newMilestone.value.description,
    date: newMilestone.value.date,
    status: 'pending',
    priority: newMilestone.value.priority,
    progress: 0
  }
  
  milestones.value.push(milestone)
  showAddDialog.value = false
  
  // 重置表单
  newMilestone.value = {
    title: '',
    description: '',
    date: '',
    priority: '普通'
  }
  
  ElMessage.success('里程碑添加成功！')
}

const editMilestone = (milestone) => {
  ElMessage.info('编辑功能开发中')
}

const updateProgress = (milestone) => {
  editingMilestone.value = milestone
  newProgress.value = milestone.progress
  showProgressDialog.value = true
}

const saveProgress = () => {
  if (editingMilestone.value) {
    editingMilestone.value.progress = newProgress.value
    
    // 如果进度达到100%，自动标记为完成
    if (newProgress.value === 100) {
      editingMilestone.value.status = 'completed'
    } else if (newProgress.value > 0) {
      editingMilestone.value.status = 'in_progress'
    }
    
    showProgressDialog.value = false
    ElMessage.success('进度更新成功！')
  }
}

onMounted(() => {
  // 自动选择第一个学生
  if (studentList.value.length > 0) {
    selectedStudentId.value = studentList.value[0].id
    loadStudentData()
  }
})
</script>

<style scoped>
.teacher-dashboard-simple {
  min-height: 100vh;
  background: #f5f7fa;
  padding: 20px;
}

.dashboard-header {
  text-align: center;
  margin-bottom: 30px;
  padding: 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.dashboard-header h1 {
  margin: 0 0 10px 0;
  color: #303133;
  font-size: 28px;
}

.dashboard-header p {
  margin: 0;
  color: #606266;
  font-size: 16px;
}

.dashboard-content {
  max-width: 1200px;
  margin: 0 auto;
}

.student-selector-section {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

.student-selector-section h2 {
  margin: 0 0 15px 0;
  color: #303133;
}

.student-info-section {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

.student-info-section h2 {
  margin: 0 0 20px 0;
  color: #303133;
}

.student-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
}

.stat-card {
  padding: 15px;
  background: #f8f9fa;
  border-radius: 6px;
  text-align: center;
}

.stat-card h3 {
  margin: 0 0 10px 0;
  font-size: 14px;
  color: #606266;
}

.stat-card p {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #303133;
}

.countdown {
  color: #e6a23c !important;
}

.milestones-section {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.section-header h2 {
  margin: 0;
  color: #303133;
}

.milestones-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.milestone-card {
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  padding: 20px;
  transition: all 0.3s;
}

.milestone-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transform: translateY(-2px);
}

.milestone-card.completed {
  border-color: #67c23a;
  background: #f0f9ff;
}

.milestone-card.in_progress {
  border-color: #e6a23c;
  background: #fdf6ec;
}

.milestone-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 10px;
}

.milestone-header h4 {
  margin: 0;
  color: #303133;
  flex: 1;
}

.milestone-desc {
  margin: 0 0 15px 0;
  color: #606266;
  font-size: 14px;
  line-height: 1.5;
}

.milestone-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.milestone-date {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 14px;
  color: #909399;
}

.milestone-progress {
  margin-bottom: 15px;
}

.milestone-progress span {
  display: block;
  margin-bottom: 8px;
  font-size: 14px;
  color: #606266;
}

.milestone-actions {
  display: flex;
  gap: 10px;
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.empty-state h3 {
  margin: 20px 0 10px 0;
  color: #303133;
}

.empty-state p {
  margin: 0;
  color: #909399;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .teacher-dashboard-simple {
    padding: 10px;
  }
  
  .student-stats {
    grid-template-columns: 1fr;
  }
  
  .milestones-grid {
    grid-template-columns: 1fr;
  }
  
  .section-header {
    flex-direction: column;
    gap: 15px;
    align-items: stretch;
  }
}
</style>
