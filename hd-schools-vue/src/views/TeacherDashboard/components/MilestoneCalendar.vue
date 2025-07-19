<template>
  <div class="milestone-calendar">
    <el-calendar v-model="currentDate">
      <template #date-cell="{ data }">
        <div class="calendar-cell">
          <div class="cell-date">{{ data.day.split('-').slice(-1)[0] }}</div>
          <div class="cell-content">
            <div 
              v-for="milestone in getMilestonesForDate(data.date)"
              :key="milestone.id"
              class="calendar-milestone"
              :class="[milestone.status, milestone.priority]"
              @click="$emit('select', milestone)"
            >
              <el-tooltip :content="milestone.title" placement="top">
                <div class="milestone-indicator">
                  <el-icon v-if="milestone.type === 'exam'"><Reading /></el-icon>
                  <el-icon v-else-if="milestone.type === 'document'"><Document /></el-icon>
                  <el-icon v-else-if="milestone.type === 'application'"><Promotion /></el-icon>
                  <el-icon v-else><Flag /></el-icon>
                </div>
              </el-tooltip>
            </div>
          </div>
          
          <!-- 今日标记 -->
          <div v-if="isToday(data.date)" class="today-marker">
            <el-icon><Sunny /></el-icon>
          </div>
        </div>
      </template>
    </el-calendar>
    
    <!-- 图例 -->
    <div class="calendar-legend">
      <div class="legend-item">
        <span class="legend-dot completed"></span>
        已完成
      </div>
      <div class="legend-item">
        <span class="legend-dot in_progress"></span>
        进行中
      </div>
      <div class="legend-item">
        <span class="legend-dot pending"></span>
        待开始
      </div>
      <div class="legend-item">
        <span class="legend-dot delayed"></span>
        已延期
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Reading, Document, Promotion, Flag, Sunny } from '@element-plus/icons-vue'
import dayjs from 'dayjs'
import type { IMilestone } from '@/types/teacher-dashboard'

const props = defineProps<{
  milestones: IMilestone[]
}>()

const emit = defineEmits<{
  select: [milestone: IMilestone]
  add: [date: Date]
}>()

const currentDate = ref(new Date())

const getMilestonesForDate = (date: Date) => {
  const dateStr = dayjs(date).format('YYYY-MM-DD')
  return props.milestones.filter(m => 
    dayjs(m.plannedDate).format('YYYY-MM-DD') === dateStr
  )
}

const isToday = (date: Date) => {
  return dayjs(date).format('YYYY-MM-DD') === dayjs().format('YYYY-MM-DD')
}
</script>

<style scoped>
.milestone-calendar {
  height: 600px;
}

.calendar-cell {
  height: 100%;
  position: relative;
  padding: 4px;
}

.cell-date {
  font-size: 14px;
  color: #606266;
  margin-bottom: 4px;
}

.cell-content {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.calendar-milestone {
  cursor: pointer;
  transition: all 0.3s;
}

.milestone-indicator {
  width: 24px;
  height: 24px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  background: #f5f7fa;
  border: 1px solid #e4e7ed;
}

.calendar-milestone.completed .milestone-indicator {
  background: #f0f9ff;
  border-color: #67c23a;
  color: #67c23a;
}

.calendar-milestone.in_progress .milestone-indicator {
  background: #ecf5ff;
  border-color: #409eff;
  color: #409eff;
}

.calendar-milestone.delayed .milestone-indicator {
  background: #fef0f0;
  border-color: #f56c6c;
  color: #f56c6c;
}

.calendar-milestone.critical .milestone-indicator {
  border-width: 2px;
  font-weight: bold;
}

.calendar-milestone:hover .milestone-indicator {
  transform: scale(1.1);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.today-marker {
  position: absolute;
  top: 4px;
  right: 4px;
  color: #e6a23c;
  font-size: 16px;
}

.calendar-legend {
  display: flex;
  justify-content: center;
  gap: 24px;
  margin-top: 16px;
  padding: 16px;
  background: #f5f7fa;
  border-radius: 8px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #606266;
}

.legend-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 2px solid;
}

.legend-dot.completed {
  background: #f0f9ff;
  border-color: #67c23a;
}

.legend-dot.in_progress {
  background: #ecf5ff;
  border-color: #409eff;
}

.legend-dot.pending {
  background: #f5f7fa;
  border-color: #e4e7ed;
}

.legend-dot.delayed {
  background: #fef0f0;
  border-color: #f56c6c;
}

:deep(.el-calendar) {
  background: transparent;
}

:deep(.el-calendar__header) {
  padding: 12px 20px;
}

:deep(.el-calendar-table td) {
  min-height: 80px;
}

:deep(.el-calendar-table td.is-selected) {
  background-color: #ecf5ff;
}
</style>