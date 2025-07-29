<template>
  <div class="teacher-invitation">
    <div class="page-header">
      <h2>邀请教师</h2>
      <el-button type="primary" @click="showInviteDialog = true">
        <el-icon><Plus /></el-icon>
        发送邀请
      </el-button>
    </div>

    <!-- 邀请记录列表 -->
    <el-card>
      <template #header>
        <div class="card-header">
          <span>邀请记录</span>
          <el-button text @click="refreshInvitations">
            <el-icon><Refresh /></el-icon>
            刷新
          </el-button>
        </div>
      </template>

      <el-table 
        :data="invitations" 
        v-loading="loading"
        empty-text="暂无邀请记录"
      >
        <el-table-column prop="email" label="邮箱" min-width="200" />
        <el-table-column prop="name" label="姓名" width="120" />
        <el-table-column prop="role" label="角色" width="120">
          <template #default="{ row }">
            <el-tag>{{ getRoleLabel(row.role) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="subjects" label="科目" min-width="150">
          <template #default="{ row }">
            <el-tag v-for="subject in row.subjects" :key="subject" size="small" class="subject-tag">
              {{ subject }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)">
              {{ getStatusLabel(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="邀请时间" width="180">
          <template #default="{ row }">
            {{ formatDate(row.createdAt) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150" fixed="right">
          <template #default="{ row }">
            <el-button 
              v-if="row.status === 'pending'" 
              text 
              type="primary"
              @click="resendInvitation(row)"
            >
              重新发送
            </el-button>
            <el-button 
              v-if="row.status === 'pending'" 
              text 
              type="danger"
              @click="cancelInvitation(row)"
            >
              取消
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :page-sizes="[10, 20, 50]"
        :total="total"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handlePageChange"
      />
    </el-card>

    <!-- 邀请对话框 -->
    <el-dialog 
      v-model="showInviteDialog" 
      title="邀请新教师"
      width="600px"
      @closed="resetForm"
    >
      <el-form 
        ref="inviteFormRef" 
        :model="inviteForm" 
        :rules="inviteRules"
        label-width="100px"
      >
        <el-form-item label="邮箱" prop="email">
          <el-input 
            v-model="inviteForm.email" 
            placeholder="请输入教师邮箱"
            type="email"
          />
        </el-form-item>

        <el-form-item label="姓名" prop="name">
          <el-input 
            v-model="inviteForm.name" 
            placeholder="请输入教师姓名"
          />
        </el-form-item>

        <el-form-item label="角色" prop="role">
          <el-select v-model="inviteForm.role" placeholder="请选择角色">
            <el-option label="学科教师" value="teacher" />
            <el-option label="升学指导" value="counselor" />
            <el-option label="班主任" value="homeroom_teacher" />
            <el-option label="管理员" value="admin" />
          </el-select>
        </el-form-item>

        <el-form-item label="负责科目" prop="subjects">
          <el-select 
            v-model="inviteForm.subjects" 
            multiple 
            placeholder="请选择负责的科目"
          >
            <el-option label="数学" value="数学" />
            <el-option label="英语" value="英语" />
            <el-option label="物理" value="物理" />
            <el-option label="化学" value="化学" />
            <el-option label="生物" value="生物" />
            <el-option label="历史" value="历史" />
            <el-option label="地理" value="地理" />
            <el-option label="政治" value="政治" />
            <el-option label="计算机" value="计算机" />
            <el-option label="艺术" value="艺术" />
          </el-select>
        </el-form-item>

        <el-form-item label="邀请消息" prop="message">
          <el-input 
            v-model="inviteForm.message" 
            type="textarea"
            :rows="4"
            placeholder="请输入邀请消息（选填）"
          />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="showInviteDialog = false">取消</el-button>
        <el-button type="primary" @click="submitInvitation" :loading="submitting">
          发送邀请
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox, FormInstance, FormRules } from 'element-plus'
import { Plus, Refresh } from '@element-plus/icons-vue'
import axios from 'axios'

interface Invitation {
  id: string
  email: string
  name: string
  role: string
  subjects: string[]
  status: 'pending' | 'accepted' | 'rejected' | 'expired'
  createdAt: string
  invitedBy: string
}

const invitations = ref<Invitation[]>([])
const loading = ref(false)
const showInviteDialog = ref(false)
const submitting = ref(false)
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

const inviteFormRef = ref<FormInstance>()
const inviteForm = reactive({
  email: '',
  name: '',
  role: '',
  subjects: [] as string[],
  message: ''
})

const inviteRules: FormRules = {
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入有效的邮箱地址', trigger: 'blur' }
  ],
  name: [
    { required: true, message: '请输入姓名', trigger: 'blur' }
  ],
  role: [
    { required: true, message: '请选择角色', trigger: 'change' }
  ],
  subjects: [
    { required: true, message: '请选择至少一个科目', trigger: 'change', type: 'array', min: 1 }
  ]
}

// 获取邀请记录
const fetchInvitations = async () => {
  loading.value = true
  try {
    // 模拟数据
    invitations.value = [
      {
        id: '1',
        email: 'teacher1@school.com',
        name: '张老师',
        role: 'teacher',
        subjects: ['数学', '物理'],
        status: 'accepted',
        createdAt: '2024-01-15T10:00:00Z',
        invitedBy: 'current-user'
      },
      {
        id: '2',
        email: 'teacher2@school.com',
        name: '李老师',
        role: 'counselor',
        subjects: ['英语'],
        status: 'pending',
        createdAt: '2024-01-20T14:30:00Z',
        invitedBy: 'current-user'
      }
    ]
    total.value = invitations.value.length
  } catch (error) {
    ElMessage.error('获取邀请记录失败')
  } finally {
    loading.value = false
  }
}

// 提交邀请
const submitInvitation = async () => {
  if (!inviteFormRef.value) return

  await inviteFormRef.value.validate(async (valid) => {
    if (!valid) return

    submitting.value = true
    try {
      const response = await axios.post('http://localhost:3001/api/teachers/invite', {
        ...inviteForm
      })

      if (response.data.success) {
        ElMessage.success('邀请发送成功')
        showInviteDialog.value = false
        await fetchInvitations()
      }
    } catch (error) {
      ElMessage.error('邀请发送失败')
    } finally {
      submitting.value = false
    }
  })
}

// 重新发送邀请
const resendInvitation = async (invitation: Invitation) => {
  try {
    await ElMessageBox.confirm(
      `确定要重新发送邀请给 ${invitation.name} (${invitation.email}) 吗？`,
      '重新发送邀请',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'info'
      }
    )

    ElMessage.success('邀请已重新发送')
    await fetchInvitations()
  } catch {
    // 用户取消
  }
}

// 取消邀请
const cancelInvitation = async (invitation: Invitation) => {
  try {
    await ElMessageBox.confirm(
      `确定要取消发送给 ${invitation.name} (${invitation.email}) 的邀请吗？`,
      '取消邀请',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )

    ElMessage.success('邀请已取消')
    await fetchInvitations()
  } catch {
    // 用户取消
  }
}

// 刷新邀请记录
const refreshInvitations = () => {
  fetchInvitations()
}

// 重置表单
const resetForm = () => {
  inviteFormRef.value?.resetFields()
}

// 处理分页
const handlePageChange = (page: number) => {
  currentPage.value = page
  fetchInvitations()
}

const handleSizeChange = (size: number) => {
  pageSize.value = size
  currentPage.value = 1
  fetchInvitations()
}

// 获取角色标签
const getRoleLabel = (role: string) => {
  const roleMap: Record<string, string> = {
    teacher: '学科教师',
    counselor: '升学指导',
    homeroom_teacher: '班主任',
    admin: '管理员'
  }
  return roleMap[role] || role
}

// 获取状态类型
const getStatusType = (status: string) => {
  const typeMap: Record<string, string> = {
    pending: 'warning',
    accepted: 'success',
    rejected: 'danger',
    expired: 'info'
  }
  return typeMap[status] || 'info'
}

// 获取状态标签
const getStatusLabel = (status: string) => {
  const statusMap: Record<string, string> = {
    pending: '待接受',
    accepted: '已接受',
    rejected: '已拒绝',
    expired: '已过期'
  }
  return statusMap[status] || status
}

// 格式化日期
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

onMounted(() => {
  fetchInvitations()
})
</script>

<style scoped lang="scss">
.teacher-invitation {
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

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .subject-tag {
    margin-right: 5px;
  }

  :deep(.el-table) {
    margin-bottom: 20px;
  }

  :deep(.el-pagination) {
    display: flex;
    justify-content: flex-end;
  }
}
</style>