<template>
  <div class="milestone-detail">
    <el-form label-width="100px">
      <el-form-item label="里程碑标题">
        <el-input v-model="localMilestone.title" />
      </el-form-item>
      
      <el-form-item label="描述">
        <el-input 
          v-model="localMilestone.description" 
          type="textarea" 
          :rows="3"
        />
      </el-form-item>
      
      <el-form-item label="计划日期">
        <el-date-picker
          v-model="localMilestone.plannedDate"
          type="date"
          placeholder="选择日期"
        />
      </el-form-item>
      
      <el-form-item label="优先级">
        <el-select v-model="localMilestone.priority">
          <el-option label="关键" value="critical" />
          <el-option label="高" value="high" />
          <el-option label="中" value="medium" />
          <el-option label="低" value="low" />
        </el-select>
      </el-form-item>
      
      <el-form-item label="进度">
        <el-slider 
          v-model="localMilestone.progress" 
          :marks="progressMarks"
          show-input
        />
      </el-form-item>
      
      <el-form-item label="状态">
        <el-radio-group v-model="localMilestone.status">
          <el-radio label="pending">待开始</el-radio>
          <el-radio label="in_progress">进行中</el-radio>
          <el-radio label="completed">已完成</el-radio>
          <el-radio label="delayed">已延期</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    
    <div class="detail-actions">
      <el-button @click="$emit('close')">取消</el-button>
      <el-button type="primary" @click="saveMilestone">保存</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { ElMessage } from 'element-plus'
import type { IMilestone } from '@/types/teacher-dashboard'

const props = defineProps<{
  milestone: IMilestone
  pathwayId?: string
}>()

const emit = defineEmits<{
  update: []
  close: []
}>()

const localMilestone = ref({ ...props.milestone })

const progressMarks = {
  0: '0%',
  25: '25%',
  50: '50%',
  75: '75%',
  100: '100%'
}

watch(() => props.milestone, (newVal) => {
  localMilestone.value = { ...newVal }
}, { deep: true })

const saveMilestone = async () => {
  // TODO: 调用API保存
  ElMessage.success('里程碑已更新')
  emit('update')
}
</script>

<style scoped>
.milestone-detail {
  padding: 20px;
}

.detail-actions {
  margin-top: 24px;
  text-align: right;
}
</style>