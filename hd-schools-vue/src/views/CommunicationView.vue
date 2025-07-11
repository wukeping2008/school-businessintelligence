<template>
  <div class="page active">
    <div class="page-header">
      <h1>{{ t('communication.title') }}</h1>
      <p>{{ t('communication.subtitle') }}</p>
    </div>
    
    <div class="communication-container">
      <div class="record-section">
        <div class="quick-record">
          <h3>{{ t('communication.quickRecord') }}</h3>
          <form @submit.prevent="saveInteraction">
            <div class="form-group">
              <label>{{ t('communication.student') }}</label>
              <select v-model="newInteraction.student" required>
                <option value="">{{ t('communication.selectStudent') }}</option>
                <option value="张小明">张小明</option>
                <option value="李小红">李小红</option>
                <option value="王小华">王小华</option>
              </select>
            </div>
            
            <div class="form-group">
              <label>{{ t('communication.type') }}</label>
              <select v-model="newInteraction.type" required>
                <option value="academic">{{ t('communication.types.academic') }}</option>
                <option value="interaction">{{ t('communication.types.interaction') }}</option>
                <option value="activity">{{ t('communication.types.activity') }}</option>
                <option value="character">{{ t('communication.types.character') }}</option>
                <option value="creativity">{{ t('communication.types.creativity') }}</option>
              </select>
            </div>
            
            <div class="form-group">
              <label>{{ t('communication.content') }}</label>
              <textarea 
                v-model="newInteraction.content" 
                :placeholder="t('communication.contentPlaceholder')"
                required
              ></textarea>
            </div>
            
            <div class="form-group">
              <label>{{ t('communication.teacher') }}</label>
              <input 
                type="text" 
                v-model="newInteraction.teacher" 
                :placeholder="t('communication.teacherPlaceholder')"
                required
              />
            </div>
            
            <button type="submit" class="btn btn-primary">
              {{ t('communication.save') }}
            </button>
          </form>
        </div>
      </div>
      
      <div class="timeline-section">
        <h3>{{ t('communication.timeline') }}</h3>
        <div class="filter-tabs">
          <button 
            v-for="filter in filters" 
            :key="filter.value"
            class="filter-tab" 
            :class="{ active: currentFilter === filter.value }"
            @click="setFilter(filter.value)"
          >
            {{ filter.label }}
          </button>
        </div>
        
        <div class="timeline">
          <div 
            v-for="interaction in filteredInteractions" 
            :key="interaction.id"
            class="timeline-item"
          >
            <div class="timeline-avatar">
              {{ interaction.student.charAt(0) }}
            </div>
            <div class="timeline-content">
              <div class="timeline-header">
                <span class="timeline-student">{{ interaction.student }}</span>
                <span class="timeline-type">{{ interaction.type }}</span>
              </div>
              <div class="timeline-text">{{ interaction.content }}</div>
              <div class="timeline-footer">
                <span>{{ interaction.teacher }}</span>
                <span>{{ formatDate(interaction.date) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { useI18nStore } from '../stores/i18n'

const i18nStore = useI18nStore()

// 翻译函数
const t = (key: string): string => {
  return i18nStore.t(key)
}

// 新互动记录
const newInteraction = reactive({
  student: '',
  type: '',
  content: '',
  teacher: ''
})

// 当前过滤器
const currentFilter = ref('all')

// 过滤器选项
const filters = computed(() => [
  { value: 'all', label: t('common.all') },
  { value: 'academic', label: t('communication.types.academic') },
  { value: 'interaction', label: t('communication.types.interaction') },
  { value: 'activity', label: t('communication.types.activity') },
  { value: 'character', label: t('communication.types.character') },
  { value: 'creativity', label: t('communication.types.creativity') }
])

// 获取示例数据
const getSampleData = () => {
  const isEnglish = i18nStore.currentLanguage === 'en'
  
  if (isEnglish) {
    return [
      {
        id: 1,
        student: 'Zhang Xiaoming',
        type: 'academic',
        content: 'Excellent performance in math class today, actively answering questions with clear thinking and unique problem-solving methods. Particularly showed strong spatial imagination when solving geometry problems.',
        teacher: 'Ms. Li',
        date: new Date('2024-07-10T10:30:00')
      },
      {
        id: 2,
        student: 'Li Xiaohong',
        type: 'interaction',
        content: 'Actively participated in English class discussions, shared unique insights on literary works, demonstrating good critical thinking skills.',
        teacher: 'Mr. Wang',
        date: new Date('2024-07-10T14:20:00')
      },
      {
        id: 3,
        student: 'Wang Xiaohua',
        type: 'activity',
        content: 'Outstanding performance in the science experiment club, designed an innovative physics experiment that received unanimous praise from classmates. Showed strong hands-on ability and innovative thinking.',
        teacher: 'Ms. Zhang',
        date: new Date('2024-07-09T16:45:00')
      },
      {
        id: 4,
        student: 'Zhang Xiaoming',
        type: 'character',
        content: 'Proactively helped new students adapt to campus life, showing good empathy and leadership. Served as a good role model in class activities.',
        teacher: 'Mr. Chen',
        date: new Date('2024-07-09T09:15:00')
      },
      {
        id: 5,
        student: 'Li Xiaohong',
        type: 'creativity',
        content: 'Created an imaginative artwork in art class with unique color combinations and novel composition, expressing deep understanding of environmental themes.',
        teacher: 'Ms. Zhao',
        date: new Date('2024-07-08T15:30:00')
      }
    ]
  } else {
    return [
      {
        id: 1,
        student: '张小明',
        type: 'academic',
        content: '今天在数学课上表现出色，主动回答问题，思路清晰，解题方法独特。特别是在解决几何问题时，展现了很强的空间想象能力。',
        teacher: '李老师',
        date: new Date('2024-07-10T10:30:00')
      },
      {
        id: 2,
        student: '李小红',
        type: 'interaction',
        content: '在英语课堂讨论中积极参与，与同学们分享了自己对文学作品的独特见解，展现了良好的批判性思维能力。',
        teacher: '王老师',
        date: new Date('2024-07-10T14:20:00')
      },
      {
        id: 3,
        student: '王小华',
        type: 'activity',
        content: '在科学实验社团中表现突出，设计了一个创新的物理实验，获得了同学们的一致好评。展现了很强的动手能力和创新思维。',
        teacher: '张老师',
        date: new Date('2024-07-09T16:45:00')
      },
      {
        id: 4,
        student: '张小明',
        type: 'character',
        content: '主动帮助新同学适应校园生活，展现了良好的同理心和领导力。在班级活动中起到了很好的榜样作用。',
        teacher: '陈老师',
        date: new Date('2024-07-09T09:15:00')
      },
      {
        id: 5,
        student: '李小红',
        type: 'creativity',
        content: '在艺术课上创作了一幅富有想象力的画作，色彩搭配独特，构图新颖，表达了对环保主题的深刻理解。',
        teacher: '赵老师',
        date: new Date('2024-07-08T15:30:00')
      }
    ]
  }
}

// 互动记录数据
const interactions = ref(getSampleData())

// 过滤后的互动记录
const filteredInteractions = computed(() => {
  if (currentFilter.value === 'all') {
    return interactions.value.sort((a, b) => b.date.getTime() - a.date.getTime())
  }
  return interactions.value
    .filter(item => item.type === currentFilter.value)
    .sort((a, b) => b.date.getTime() - a.date.getTime())
})

// 设置过滤器
const setFilter = (filter: string) => {
  currentFilter.value = filter
}

// 保存互动记录
const saveInteraction = () => {
  const newRecord = {
    id: interactions.value.length + 1,
    student: newInteraction.student,
    type: newInteraction.type,
    content: newInteraction.content,
    teacher: newInteraction.teacher,
    date: new Date()
  }
  
  interactions.value.unshift(newRecord)
  
  // 重置表单
  newInteraction.student = ''
  newInteraction.type = ''
  newInteraction.content = ''
  newInteraction.teacher = ''
  
  // 显示成功消息
  alert(t('communication.saveSuccess') || '记录保存成功！')
}

// 格式化日期
const formatDate = (date: Date): string => {
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const minutes = Math.floor(diff / (1000 * 60))
  
  const isEnglish = i18nStore.currentLanguage === 'en'
  
  if (days > 0) {
    return isEnglish ? `${days} days ago` : `${days}天前`
  } else if (hours > 0) {
    return isEnglish ? `${hours} hours ago` : `${hours}小时前`
  } else if (minutes > 0) {
    return isEnglish ? `${minutes} minutes ago` : `${minutes}分钟前`
  } else {
    return isEnglish ? 'Just now' : '刚刚'
  }
}
</script>

<style scoped>
.communication-container {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 30px;
  max-width: 1200px;
  margin: 0 auto;
}

.record-section, .timeline-section {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  padding: 30px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.quick-record h3 {
  margin-bottom: 25px;
  color: #333;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  color: #333;
  font-weight: 600;
}

.form-group select,
.form-group input,
.form-group textarea {
  width: 100%;
  padding: 12px 15px;
  border: 2px solid #e0e0e0;
  border-radius: 10px;
  font-size: 14px;
  transition: border-color 0.3s ease;
}

.form-group select:focus,
.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #667eea;
}

.form-group textarea {
  min-height: 100px;
  resize: vertical;
}

.filter-tabs {
  display: flex;
  gap: 10px;
  margin-bottom: 25px;
  flex-wrap: wrap;
}

.filter-tab {
  padding: 8px 16px;
  border: none;
  background: #f0f0f0;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 14px;
}

.filter-tab.active {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
}

.timeline {
  max-height: 600px;
  overflow-y: auto;
}

.timeline-item {
  display: flex;
  gap: 15px;
  margin-bottom: 25px;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 15px;
  border-left: 4px solid #667eea;
}

.timeline-avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea, #764ba2);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  flex-shrink: 0;
}

.timeline-content {
  flex: 1;
}

.timeline-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  flex-wrap: wrap;
  gap: 10px;
}

.timeline-student {
  font-weight: bold;
  color: #333;
}

.timeline-type {
  background: rgba(102, 126, 234, 0.1);
  color: #667eea;
  padding: 4px 12px;
  border-radius: 15px;
  font-size: 12px;
}

.timeline-text {
  color: #666;
  line-height: 1.5;
  margin-bottom: 10px;
}

.timeline-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
  color: #999;
}

@media (max-width: 768px) {
  .communication-container {
    grid-template-columns: 1fr;
  }
  
  .timeline-header {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .timeline-footer {
    flex-direction: column;
    align-items: flex-start;
    gap: 5px;
  }
}
</style>
