<template>
  <div class="student-detail">
    <el-tabs v-model="activeTab">
      <el-tab-pane label="基本信息" name="basic">
        <el-form label-width="120px">
          <el-form-item label="学生姓名">
            <span>{{ student.basicInfo.name }}</span>
          </el-form-item>
          <el-form-item label="学号">
            <span>{{ student.basicInfo.studentId }}</span>
          </el-form-item>
          <el-form-item label="年级班级">
            <span>{{ student.basicInfo.grade }}({{ student.basicInfo.class }})班</span>
          </el-form-item>
          <el-form-item label="入学日期">
            <span>{{ formatDate(student.basicInfo.enrollmentDate) }}</span>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      
      <el-tab-pane label="学术状态" name="academic">
        <el-form label-width="120px">
          <el-form-item label="当前GPA">
            <el-tag :type="getGPAType(student.academicStatus.currentGPA)">
              {{ student.academicStatus.currentGPA.toFixed(2) }}
            </el-tag>
          </el-form-item>
          <el-form-item label="标准化考试">
            <el-table :data="student.academicStatus.standardizedTests" size="small">
              <el-table-column prop="type" label="考试类型" />
              <el-table-column prop="score" label="分数" />
              <el-table-column label="考试日期">
                <template #default="{ row }">
                  {{ formatDate(row.date) }}
                </template>
              </el-table-column>
            </el-table>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      
      <el-tab-pane label="目标大学" name="target">
        <el-form label-width="120px">
          <el-form-item label="首选大学">
            <el-tag type="primary" size="large">
              {{ student.targetUniversities.primary.name }}
            </el-tag>
          </el-form-item>
          <el-form-item label="目标专业">
            <span>{{ student.targetUniversities.primary.major }}</span>
          </el-form-item>
          <el-form-item label="备选大学">
            <el-tag 
              v-for="uni in student.targetUniversities.alternatives" 
              :key="uni.id"
              style="margin-right: 8px;"
            >
              {{ uni.name }}
            </el-tag>
          </el-form-item>
        </el-form>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { IStudent } from '@/types/teacher-dashboard'

const props = defineProps<{
  student: IStudent
}>()

const activeTab = ref('basic')

const formatDate = (date: Date | string) => {
  return new Date(date).toLocaleDateString('zh-CN')
}

const getGPAType = (gpa: number) => {
  if (gpa >= 3.8) return 'success'
  if (gpa >= 3.5) return 'warning'
  return 'danger'
}
</script>

<style scoped>
.student-detail {
  padding: 20px;
}
</style>