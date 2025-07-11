import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Campus, CampusTheme } from '@/types'
import { storage } from '@/utils'

export const useCampusStore = defineStore('campus', () => {
  // 状态
  const currentCampus = ref<Campus>('shanghai')
  
  // 校区主题配置
  const campusThemes = ref<Record<Campus, CampusTheme>>({
    shanghai: {
      primary: '#2B3A67',
      secondary: '#F4C430',
      accent: '#FF6B35',
      name: '上海校区'
    },
    beijing: {
      primary: '#1E2A54',
      secondary: '#FFD700',
      accent: '#E55A4E',
      name: '北京校区'
    },
    ningbo: {
      primary: '#3D4F7A',
      secondary: '#F4C430',
      accent: '#FF8A65',
      name: '宁波校区'
    }
  })

  // 计算属性
  const currentTheme = computed(() => campusThemes.value[currentCampus.value])
  
  const campusList = computed(() => 
    Object.entries(campusThemes.value).map(([key, theme]) => ({
      value: key as Campus,
      label: theme.name,
      theme
    }))
  )

  // 方法
  const switchCampus = (campus: Campus) => {
    currentCampus.value = campus
    applyTheme(currentTheme.value)
    saveCampusPreference(campus)
  }

  const applyTheme = (theme: CampusTheme) => {
    const root = document.documentElement
    root.style.setProperty('--primary-color', theme.primary)
    root.style.setProperty('--secondary-color', theme.secondary)
    root.style.setProperty('--accent-color', theme.accent)
  }

  const saveCampusPreference = (campus: Campus) => {
    storage.set('selectedCampus', campus)
  }

  const loadCampusPreference = () => {
    const saved = storage.get<Campus>('selectedCampus')
    if (saved && campusThemes.value[saved]) {
      currentCampus.value = saved
      applyTheme(currentTheme.value)
    }
  }

  // 初始化
  const initialize = () => {
    loadCampusPreference()
    applyTheme(currentTheme.value)
  }

  return {
    // 状态
    currentCampus,
    campusThemes,
    
    // 计算属性
    currentTheme,
    campusList,
    
    // 方法
    switchCampus,
    applyTheme,
    initialize
  }
})
