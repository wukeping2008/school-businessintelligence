<template>
  <el-form 
    ref="formRef"
    :model="formData" 
    :rules="rules"
    label-width="100px"
  >
    <el-form-item label="里程碑标题" prop="title">
      <el-input 
        v-model="formData.title" 
        placeholder="例如：IELTS考试、个人陈述完成"
      />
    </el-form-item>
    
    <el-form-item label="类型" prop="type">
      <el-select v-model="formData.type" placeholder="选择里程碑类型">
        <el-option label="考试" value="exam">
          <el-icon><Reading /></el-icon>
          <span>考试</span>
        </el-option>
        <el-option label="文档" value="document">
          <el-icon><Document /></el-icon>
          <span>文档</span>
        </el-option>
        <el-option label="申请" value="application">
          <el-icon><Promotion /></el-icon>
          <span>申请</span>
        </el-option>
        <el-option label="活动" value="activity">
          <el-icon><Trophy /></el-icon>
          <span>活动</span>
        </el-option>
      </el-select>
    </el-form-item>
    
    <el-form-item label="优先级" prop="priority">
      <el-radio-group v-model="formData.priority">
        <el-radio-button label="critical">
          <el-icon><Warning /></el-icon>
          关键
        </el-radio-button>
        <el-radio-button label="high">重要</el-radio-button>
        <el-radio-button label="medium">常规</el-radio-button>
        <el-radio-button label="low">次要</el-radio-button>
      </el-radio-group>
    </el-form-item>
    
    <el-form-item label="计划日期" prop="plannedDate">
      <el-date-picker
        v-model="formData.plannedDate"
        type="date"
        placeholder="选择目标完成日期"
        :disabled-date="disabledDate"
      />
    </el-form-item>
    
    <el-form-item label="描述" prop="description">
      <el-input 
        v-model="formData.description" 
        type="textarea"
        :rows="3"
        placeholder="详细说明里程碑的目标和要求"
      />
    </el-form-item>
    
    <el-form-item label="前置依赖">
      <el-select 
        v-model="formData.dependencies" 
        multiple
        placeholder="选择必须先完成的里程碑"
      >
        <el-option
          v-for="milestone in availableDependencies"
          :key="milestone.id"
          :label="milestone.title"
          :value="milestone.id"
          :disabled="milestone.status === 'completed'"
        />
      </el-select>
    </el-form-item>
    
    <el-form-item label="负责人">
      <el-select 
        v-model="formData.assignedTo" 
        multiple
        placeholder="选择负责的教师"
      >
        <el-option label="数学老师 - 王老师" value="teacher1" />
        <el-option label="英语老师 - 李老师" value="teacher2" />
        <el-option label="升学指导 - 陈老师" value="counselor1" />
        <el-option label="班主任 - 张老师" value="homeroom1" />
      </el-select>
    </el-form-item>
    
    <!-- 学术成就预设 -->
    <el-form-item label="成就标签">
      <el-checkbox-group v-model="formData.achievementTags">
        <el-checkbox label="breakthrough">
          <el-icon><Star /></el-icon>
          重大突破
        </el-checkbox>
        <el-checkbox label="excellence">
          <el-icon><Trophy /></el-icon>
          卓越表现
        </el-checkbox>
        <el-checkbox label="innovation">
          <el-icon><Bulb /></el-icon>
          创新成果
        </el-checkbox>
      </el-checkbox-group>
    </el-form-item>
    
    <el-form-item>
      <el-button type="primary" @click="handleSubmit">
        创建里程碑
      </el-button>
      <el-button @click="$emit('cancel')">取消</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { ElMessage } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import { 
  Reading, Document, Promotion, Trophy, Warning, Star, Bulb 
} from '@element-plus/icons-vue'
import type { IStudent, IMilestone } from '@/types/teacher-dashboard'

const props = defineProps<{
  student: IStudent | null
}>()

const emit = defineEmits<{
  save: [milestone: IMilestone]
  cancel: []
}>()

const formRef = ref<FormInstance>()

const formData = reactive({
  title: '',
  type: 'exam',
  category: 'academic',
  priority: 'high',
  plannedDate: '',
  description: '',
  dependencies: [] as string[],
  assignedTo: [] as string[],
  achievementTags: [] as string[]
})

const rules: FormRules = {
  title: [
    { required: true, message: '请输入里程碑标题', trigger: 'blur' }
  ],
  type: [
    { required: true, message: '请选择里程碑类型', trigger: 'change' }
  ],
  priority: [
    { required: true, message: '请选择优先级', trigger: 'change' }
  ],
  plannedDate: [
    { required: true, message: '请选择计划日期', trigger: 'change' }
  ],
  description: [
    { required: true, message: '请输入描述', trigger: 'blur' }
  ]
}

// 模拟可用的前置依赖
const availableDependencies = computed(() => {
  // TODO: 从实际数据获取
  return [
    { id: '1', title: 'IELTS考试', status: 'completed' },
    { id: '2', title: 'A-Level数学考试', status: 'in_progress' },
    { id: '3', title: '个人陈述初稿', status: 'pending' }
  ]
})

const disabledDate = (date: Date) => {
  // 禁用过去的日期
  return date.getTime() < Date.now() - 24 * 60 * 60 * 1000
}

const handleSubmit = async () => {
  if (!formRef.value) return
  
  await formRef.value.validate(async (valid) => {
    if (valid) {
      const milestone: IMilestone = {
        id: Date.now().toString(),
        title: formData.title,
        type: formData.type as any,
        category: getCategoryByType(formData.type),
        priority: formData.priority as any,
        plannedDate: new Date(formData.plannedDate),
        description: formData.description,
        status: 'pending',
        progress: 0,
        dependencies: formData.dependencies,
        assignedTo: formData.assignedTo,
        actionItems: [],
        attachments: []
      }
      
      emit('save', milestone)
      ElMessage.success('里程碑创建成功！')
    }
  })
}

const getCategoryByType = (type: string) => {
  const map: Record<string, string> = {
    exam: 'standardized_test',
    document: 'application',
    application: 'application',
    activity: 'extracurricular'
  }
  return map[type] || 'academic'
}
</script>

<style scoped>
:deep(.el-radio-button__inner) {
  display: flex;
  align-items: center;
  gap: 4px;
}

:deep(.el-checkbox__label) {
  display: flex;
  align-items: center;
  gap: 4px;
}
</style>