<template>
  <div class="student-list">
    <div class="list-header">
      <h2>我的学生</h2>
      <el-button type="primary" @click="showAddStudentDialog = true">
        <el-icon><Plus /></el-icon>
        添加学生
      </el-button>
    </div>

    <!-- 搜索和筛选 -->
    <div class="filter-section">
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            v-model="store.filters.searchQuery"
            placeholder="搜索学生姓名或学号"
            clearable
            @input="handleSearch"
          >
            <template #prefix>
              <el-icon><Search /></el-icon>
            </template>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-select 
            v-model="store.filters.grade" 
            placeholder="选择年级" 
            clearable
            @change="handleFilterChange"
          >
            <el-option label="高一" value="高一" />
            <el-option label="高二" value="高二" />
            <el-option label="高三" value="高三" />
          </el-select>
        </el-col>
        <el-col :span="4">
          <el-select 
            v-model="store.filters.class" 
            placeholder="选择班级" 
            clearable
            @change="handleFilterChange"
          >
            <el-option label="1班" value="1" />
            <el-option label="2班" value="2" />
            <el-option label="3班" value="3" />
            <el-option label="4班" value="4" />
          </el-select>
        </el-col>
        <el-col :span="4">
          <el-select 
            v-model="store.filters.status" 
            placeholder="状态筛选" 
            clearable
            @change="handleFilterChange"
          >
            <el-option label="正常进展" value="normal" />
            <el-option label="需要关注" value="attention" />
            <el-option label="风险预警" value="risk" />
          </el-select>
        </el-col>
        <el-col :span="4">
          <el-button @click="resetFilters">重置筛选</el-button>
        </el-col>
      </el-row>
    </div>

    <!-- 学生列表 -->
    <el-table
      v-loading="loading"
      :data="paginatedStudents"
      style="width: 100%"
      row-key="_id"
      @row-click="handleRowClick"
    >
      <el-table-column prop="basicInfo.name" label="姓名" width="120">
        <template #default="{ row }">
          <div class="student-name">
            <span>{{ row.basicInfo.name }}</span>
            <el-tag 
              v-if="row.status === 'risk'" 
              type="danger" 
              size="small"
              effect="plain"
            >
              风险
            </el-tag>
          </div>
        </template>
      </el-table-column>
      
      <el-table-column prop="basicInfo.studentId" label="学号" width="120" />
      
      <el-table-column label="年级班级" width="120">
        <template #default="{ row }">
          {{ row.basicInfo.grade }}({{ row.basicInfo.class }})班
        </template>
      </el-table-column>
      
      <el-table-column label="目标大学" min-width="200">
        <template #default="{ row }">
          <div class="target-university">
            <span>{{ row.targetUniversities.primary.name }}</span>
            <el-tag size="small" type="info">
              {{ row.targetUniversities.primary.major }}
            </el-tag>
          </div>
        </template>
      </el-table-column>
      
      <el-table-column prop="academicStatus.currentGPA" label="当前GPA" width="100">
        <template #default="{ row }">
          <el-tag :type="getGPAType(row.academicStatus.currentGPA)">
            {{ row.academicStatus.currentGPA.toFixed(2) }}
          </el-tag>
        </template>
      </el-table-column>
      
      <el-table-column label="升学进度" width="180">
        <template #default="{ row }">
          <div class="progress-wrapper">
            <el-progress 
              :percentage="row.pathwayProgress || 0" 
              :status="getProgressStatus(row.pathwayProgress)"
            />
          </div>
        </template>
      </el-table-column>
      
      <el-table-column label="操作" width="200" fixed="right">
        <template #default="{ row }">
          <el-button 
            size="small" 
            type="primary" 
            text 
            @click.stop="viewPathway(row)"
          >
            查看路径
          </el-button>
          <el-button 
            size="small" 
            type="primary" 
            text 
            @click.stop="editStudent(row)"
          >
            编辑
          </el-button>
          <el-button 
            size="small" 
            type="primary" 
            text 
            @click.stop="startCollaboration(row)"
          >
            协同
          </el-button>
          <el-button 
            size="small" 
            type="danger" 
            text 
            @click.stop="deleteStudent(row)"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination
      v-model:current-page="currentPage"
      v-model:page-size="pageSize"
      :page-sizes="[10, 20, 50, 100]"
      :total="totalStudents"
      layout="total, sizes, prev, pager, next, jumper"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />

    <!-- 学生详情抽屉 -->
    <el-drawer
      v-model="showStudentDetail"
      :title="currentStudent?.basicInfo.name + ' - 详细信息'"
      size="60%"
    >
      <StudentDetail 
        v-if="currentStudent" 
        :student="currentStudent"
        @update="store.fetchStudents"
      />
    </el-drawer>

    <!-- 添加/编辑学生对话框 -->
    <el-dialog
      v-model="showAddStudentDialog"
      :title="currentStudent ? '编辑学生信息' : '添加新学生'"
      width="600px"
      @close="resetStudentForm"
    >
      <el-form :model="newStudentForm" label-width="100px">
        <el-form-item label="姓名" required>
          <el-input v-model="newStudentForm.name" placeholder="请输入学生姓名" />
        </el-form-item>
        <el-form-item label="年级" required>
          <el-select v-model="newStudentForm.grade" placeholder="请选择年级">
            <el-option label="高一" value="高一" />
            <el-option label="高二" value="高二" />
            <el-option label="高三" value="高三" />
          </el-select>
        </el-form-item>
        <el-form-item label="班级" required>
          <el-select v-model="newStudentForm.class" placeholder="请选择班级">
            <el-option label="1班" value="1" />
            <el-option label="2班" value="2" />
            <el-option label="3班" value="3" />
            <el-option label="4班" value="4" />
          </el-select>
        </el-form-item>
        <el-form-item label="学号" required>
          <el-input v-model="newStudentForm.studentId" placeholder="请输入学号" />
        </el-form-item>
        <el-form-item label="目标大学">
          <el-input v-model="newStudentForm.targetUniversity" placeholder="请输入目标大学" />
        </el-form-item>
        <el-form-item label="目标专业">
          <el-input v-model="newStudentForm.targetMajor" placeholder="请输入目标专业" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showAddStudentDialog = false">取消</el-button>
        <el-button type="primary" @click="handleAddStudent">
          {{ currentStudent ? '保存' : '添加' }}
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Search } from '@element-plus/icons-vue'
import type { IStudent } from '@/types/teacher-dashboard'
import { useTeacherDashboardStore } from '@/stores/teacherDashboard'
import StudentDetail from './StudentDetail.vue'

// 使用store
const store = useTeacherDashboardStore()
const router = useRouter()

// 本地状态
const currentPage = ref(1)
const pageSize = ref(20)
const showAddStudent = ref(false)
const showStudentDetail = ref(false)
const showAddStudentDialog = ref(false)

// 新学生表单数据
const newStudentForm = ref({
  name: '',
  grade: '',
  class: '',
  studentId: '',
  targetUniversity: '',
  targetMajor: ''
})

// 计算属性
const filteredStudents = computed(() => store.filteredStudents)
const totalStudents = computed(() => filteredStudents.value.length)
const loading = computed(() => store.studentsLoading)
const currentStudent = computed(() => store.currentStudent)

// 分页后的学生列表
const paginatedStudents = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredStudents.value.slice(start, end)
})

// 监听筛选条件变化，重置页码
watch([() => store.filters], () => {
  currentPage.value = 1
})

// 方法
const handleSearch = (query: string) => {
  store.updateFilters({ searchQuery: query })
}

const handleFilterChange = () => {
  // 筛选条件已通过v-model绑定到store.filters
  currentPage.value = 1
}

const resetFilters = () => {
  store.resetFilters()
  currentPage.value = 1
}

const handleRowClick = (row: IStudent) => {
  store.setCurrentStudent(row)
  showStudentDetail.value = true
}

const viewPathway = (student: IStudent) => {
  // 设置当前学生并导航到路径管理页面
  store.setCurrentStudent(student)
  router.push({
    name: 'TeacherDashboardPathway',
    query: { studentId: student._id }
  })
}

const editStudent = (student: IStudent) => {
  store.setCurrentStudent(student)
  showAddStudentDialog.value = true
  // 填充表单数据
  newStudentForm.value = {
    name: student.basicInfo.name,
    grade: student.basicInfo.grade,
    class: student.basicInfo.class,
    studentId: student.basicInfo.studentId,
    targetUniversity: student.targetUniversities.primary.name,
    targetMajor: student.targetUniversities.primary.major
  }
}

const startCollaboration = async (student: IStudent) => {
  try {
    // 这里可以打开一个对话框选择要协同的教师
    const teacherIds = ['teacher-2', 'teacher-3'] // 临时模拟
    await store.createCollaboration(student._id, teacherIds)
    ElMessage.success('已发起协同会话')
    
    // 导航到协同页面
    router.push({
      name: 'TeacherDashboardCollaboration',
      query: { studentId: student._id }
    })
  } catch (error) {
    ElMessage.error('发起协同失败')
  }
}

const deleteStudent = async (student: IStudent) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除学生 ${student.basicInfo.name} 的所有信息吗？此操作不可恢复。`,
      '删除确认',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
    )
    
    await store.deleteStudent(student._id)
    ElMessage.success('删除成功')
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败')
    }
  }
}

const handleAddStudent = async () => {
  try {
    const studentData = {
      basicInfo: {
        name: newStudentForm.value.name,
        grade: newStudentForm.value.grade,
        class: newStudentForm.value.class,
        studentId: newStudentForm.value.studentId,
        enrollmentDate: new Date()
      },
      targetUniversities: {
        primary: {
          id: Date.now().toString(),
          name: newStudentForm.value.targetUniversity,
          country: '待定',
          major: newStudentForm.value.targetMajor,
          ranking: 0,
          requirements: {}
        },
        alternatives: [],
        lastUpdated: new Date()
      },
      academicStatus: {
        currentGPA: 0,
        subjects: [],
        standardizedTests: []
      },
      relatedTeachers: [],
      status: 'normal' as const,
      pathwayProgress: 0
    }
    
    if (currentStudent.value) {
      // 编辑模式
      await store.updateStudent(currentStudent.value._id, studentData)
      ElMessage.success('更新成功')
    } else {
      // 新增模式
      await store.createStudent(studentData)
      ElMessage.success('添加成功')
    }
    
    showAddStudentDialog.value = false
    resetStudentForm()
  } catch (error) {
    ElMessage.error('操作失败')
  }
}

const resetStudentForm = () => {
  newStudentForm.value = {
    name: '',
    grade: '',
    class: '',
    studentId: '',
    targetUniversity: '',
    targetMajor: ''
  }
  store.setCurrentStudent(null)
}

const getGPAType = (gpa: number) => {
  if (gpa >= 3.8) return 'success'
  if (gpa >= 3.5) return 'warning'
  return 'danger'
}

const getProgressStatus = (progress?: number) => {
  if (!progress) return undefined
  if (progress >= 80) return 'success'
  if (progress < 50) return 'exception'
  return undefined
}

const handleSizeChange = (val: number) => {
  pageSize.value = val
  currentPage.value = 1
}

const handleCurrentChange = (val: number) => {
  currentPage.value = val
}

// 初始化
onMounted(async () => {
  try {
    await store.fetchStudents()
  } catch (error) {
    ElMessage.error('加载学生列表失败')
  }
})
</script>

<style scoped>
.student-list {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.list-header h2 {
  margin: 0;
  font-size: 24px;
  color: #303133;
}

.filter-section {
  margin-bottom: 24px;
  padding: 20px;
  background-color: #f5f7fa;
  border-radius: 8px;
}

.student-name {
  display: flex;
  align-items: center;
  gap: 8px;
}

.target-university {
  display: flex;
  align-items: center;
  gap: 8px;
}

.progress-wrapper {
  padding: 0 8px;
}

.el-table {
  flex: 1;
  margin-bottom: 24px;
}

.el-pagination {
  display: flex;
  justify-content: center;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .filter-section .el-col {
    margin-bottom: 12px;
  }
}
</style>