import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { storage } from '@/utils'

type Language = 'zh' | 'en'

interface TranslationDict {
  [key: string]: string | TranslationDict
}

export const useI18nStore = defineStore('i18n', () => {
  // 状态
  const currentLanguage = ref<Language>('zh')
  
  // 翻译字典
  const translations = ref<Record<Language, TranslationDict>>({
    zh: {
      nav: {
        logo: '智慧校园门户',
        dashboard: '数据概览',
        admission: '招生咨询',
        communication: '家校沟通',
        academic: '学业反馈',
        guidance: '升学指导'
      },
      campus: {
        shanghai: '上海校区',
        beijing: '北京校区',
        ningbo: '宁波校区'
      },
      user: {
        welcome: '欢迎，管理员'
      },
      home: {
        title: '智慧校园数据概览',
        subtitle: '全方位了解学校运营状况',
        admission: {
          title: '招生咨询',
          desc: '智能化招生流程，个性化学业规划',
          count: '本月咨询'
        },
        communication: {
          title: '家校沟通',
          desc: '记录温馨瞬间，加强家校联系',
          count: '互动记录'
        },
        academic: {
          title: '学业反馈',
          desc: '数据驱动的学业分析与发展报告',
          count: '学业报告'
        },
        guidance: {
          title: '升学指导',
          desc: '可视化升学路径，智能目标调整',
          count: '升学规划'
        },
        overview: {
          title: '月度数据趋势'
        }
      },
      admission: {
        title: '智能招生咨询系统',
        subtitle: '通过互动问答，生成个性化学业规划报告',
        progress: {
          step: '第'
        },
        generate: '生成报告',
        report: {
          title: '个性化学业规划报告',
          student: '学生姓名',
          recommendations: '选课建议',
          timeline: '时间规划',
          expectations: '预期管理',
          milestones: '关键里程碑'
        },
        restart: '重新开始',
        download: '下载报告'
      },
      communication: {
        title: '家校沟通平台',
        subtitle: '记录每一个温馨瞬间，让家长感受孩子的校园生活',
        quickRecord: '快速记录',
        student: '学生姓名',
        selectStudent: '选择学生',
        type: '互动类型',
        content: '记录内容',
        contentPlaceholder: '请描述这次互动的具体内容...',
        teacher: '老师姓名',
        teacherPlaceholder: '请输入老师姓名',
        save: '保存记录',
        saveSuccess: '记录保存成功！',
        timeline: '互动时间线',
        types: {
          academic: '学习表现',
          interaction: '课堂互动',
          activity: '课外活动',
          character: '品格表现',
          creativity: '创意表达'
        }
      },
      academic: {
        title: '学业反馈分析',
        subtitle: '数据驱动的学业表现分析与发展建议',
        selectStudent: '选择学生：',
        radarChart: '学科表现雷达图',
        trendChart: '成绩趋势分析',
        aiReport: 'AI 学业分析报告',
        suggestions: '发展建议',
        keyMetrics: '关键指标'
      },
      guidance: {
        title: '升学指导系统',
        subtitle: '可视化升学路径，智能目标调整与进度追踪',
        selectStudent: '选择学生：',
        pathwayChart: '升学路径图',
        progressDashboard: '进度仪表盘',
        milestoneTracker: '里程碑追踪',
        resourceRecommendations: '资源推荐'
      },
      common: {
        all: '全部',
        previous: '上一步',
        next: '下一步',
        save: '保存',
        cancel: '取消',
        confirm: '确认',
        delete: '删除',
        edit: '编辑',
        view: '查看',
        loading: '加载中...',
        noData: '暂无数据',
        success: '操作成功',
        error: '操作失败',
        warning: '警告',
        info: '提示',
        student: '学生'
      }
    },
    en: {
      nav: {
        logo: 'Smart Campus Portal',
        dashboard: 'Dashboard',
        admission: 'Admission',
        communication: 'Communication',
        academic: 'Academic',
        guidance: 'Guidance'
      },
      campus: {
        shanghai: 'Shanghai Campus',
        beijing: 'Beijing Campus',
        ningbo: 'Ningbo Campus'
      },
      user: {
        welcome: 'Welcome, Admin'
      },
      home: {
        title: 'Smart Campus Dashboard',
        subtitle: 'Comprehensive overview of school operations',
        admission: {
          title: 'Admission Consultation',
          desc: 'Intelligent admission process with personalized academic planning',
          count: 'Monthly Consultations'
        },
        communication: {
          title: 'School-Home Communication',
          desc: 'Record warm moments and strengthen school-home connections',
          count: 'Interaction Records'
        },
        academic: {
          title: 'Academic Feedback',
          desc: 'Data-driven academic analysis and development reports',
          count: 'Academic Reports'
        },
        guidance: {
          title: 'College Guidance',
          desc: 'Visualized college pathways with intelligent goal adjustment',
          count: 'College Planning'
        },
        overview: {
          title: 'Monthly Data Trends'
        }
      },
      admission: {
        title: 'Intelligent Admission Consultation System',
        subtitle: 'Generate personalized academic planning reports through interactive Q&A',
        progress: {
          step: 'Step'
        },
        generate: 'Generate Report',
        report: {
          title: 'Personalized Academic Planning Report',
          student: 'Student Name',
          recommendations: 'Course Recommendations',
          timeline: 'Timeline Planning',
          expectations: 'Expectation Management',
          milestones: 'Key Milestones'
        },
        restart: 'Restart',
        download: 'Download Report'
      },
      communication: {
        title: 'School-Home Communication Platform',
        subtitle: 'Record every warm moment and let parents feel their children\'s campus life',
        quickRecord: 'Quick Record',
        student: 'Student Name',
        selectStudent: 'Select Student',
        type: 'Interaction Type',
        content: 'Record Content',
        contentPlaceholder: 'Please describe the specific content of this interaction...',
        teacher: 'Teacher Name',
        teacherPlaceholder: 'Please enter teacher name',
        save: 'Save Record',
        saveSuccess: 'Record saved successfully!',
        timeline: 'Interaction Timeline',
        types: {
          academic: 'Academic Performance',
          interaction: 'Classroom Interaction',
          activity: 'Extracurricular Activity',
          character: 'Character Performance',
          creativity: 'Creative Expression'
        }
      },
      academic: {
        title: 'Academic Feedback Analysis',
        subtitle: 'Data-driven academic performance analysis and development suggestions',
        selectStudent: 'Select Student:',
        radarChart: 'Subject Performance Radar Chart',
        trendChart: 'Grade Trend Analysis',
        aiReport: 'AI Academic Analysis Report',
        suggestions: 'Development Suggestions',
        keyMetrics: 'Key Metrics'
      },
      guidance: {
        title: 'College Guidance System',
        subtitle: 'Visualized college pathways with intelligent goal adjustment and progress tracking',
        selectStudent: 'Select Student:',
        pathwayChart: 'College Pathway Chart',
        progressDashboard: 'Progress Dashboard',
        milestoneTracker: 'Milestone Tracker',
        resourceRecommendations: 'Resource Recommendations'
      },
      common: {
        all: 'All',
        previous: 'Previous',
        next: 'Next',
        save: 'Save',
        cancel: 'Cancel',
        confirm: 'Confirm',
        delete: 'Delete',
        edit: 'Edit',
        view: 'View',
        loading: 'Loading...',
        noData: 'No Data',
        success: 'Success',
        error: 'Error',
        warning: 'Warning',
        info: 'Info',
        student: 'Student'
      }
    }
  })

  // 计算属性
  const isEnglish = computed(() => currentLanguage.value === 'en')
  const isChinese = computed(() => currentLanguage.value === 'zh')
  
  const currentTranslations = computed(() => translations.value[currentLanguage.value])

  // 方法
  const t = (key: string, params?: Record<string, string | number>): string => {
    const keys = key.split('.')
    let value: any = currentTranslations.value
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k]
      } else {
        console.warn(`Translation key not found: ${key}`)
        return key
      }
    }
    
    if (typeof value !== 'string') {
      console.warn(`Translation value is not a string: ${key}`)
      return key
    }
    
    // 参数替换
    if (params) {
      return value.replace(/\{(\w+)\}/g, (match, paramKey) => {
        return params[paramKey]?.toString() || match
      })
    }
    
    return value
  }

  const setLanguage = (lang: Language) => {
    currentLanguage.value = lang
    saveLanguagePreference(lang)
    updateDocumentLanguage(lang)
  }

  const toggleLanguage = () => {
    const newLang = currentLanguage.value === 'zh' ? 'en' : 'zh'
    setLanguage(newLang)
  }

  const saveLanguagePreference = (lang: Language) => {
    storage.set('selectedLanguage', lang)
  }

  const loadLanguagePreference = () => {
    const saved = storage.get<Language>('selectedLanguage')
    if (saved && (saved === 'zh' || saved === 'en')) {
      currentLanguage.value = saved
      updateDocumentLanguage(saved)
    }
  }

  const updateDocumentLanguage = (lang: Language) => {
    document.documentElement.lang = lang
  }

  // 批量更新页面内容
  const updatePageContent = () => {
    // 更新所有带有 data-i18n 属性的元素
    const elements = document.querySelectorAll('[data-i18n]')
    elements.forEach(element => {
      const key = element.getAttribute('data-i18n')
      if (key) {
        element.textContent = t(key)
      }
    })

    // 更新所有带有 data-i18n-placeholder 属性的元素
    const placeholderElements = document.querySelectorAll('[data-i18n-placeholder]')
    placeholderElements.forEach(element => {
      const key = element.getAttribute('data-i18n-placeholder')
      if (key && element instanceof HTMLInputElement) {
        element.placeholder = t(key)
      }
    })

    // 更新所有带有 data-i18n-title 属性的元素
    const titleElements = document.querySelectorAll('[data-i18n-title]')
    titleElements.forEach(element => {
      const key = element.getAttribute('data-i18n-title')
      if (key) {
        element.setAttribute('title', t(key))
      }
    })
  }

  // 初始化
  const initialize = () => {
    loadLanguagePreference()
    updateDocumentLanguage(currentLanguage.value)
  }

  return {
    // 状态
    currentLanguage,
    translations,
    
    // 计算属性
    isEnglish,
    isChinese,
    currentTranslations,
    
    // 方法
    t,
    setLanguage,
    toggleLanguage,
    updatePageContent,
    initialize
  }
})
