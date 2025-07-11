import type { ValidationRule } from '@/types'

// 日期格式化工具
export const formatDate = (date: Date | string, format = 'YYYY-MM-DD'): string => {
  const d = typeof date === 'string' ? new Date(date) : date
  
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  const hours = String(d.getHours()).padStart(2, '0')
  const minutes = String(d.getMinutes()).padStart(2, '0')
  const seconds = String(d.getSeconds()).padStart(2, '0')

  return format
    .replace('YYYY', String(year))
    .replace('MM', month)
    .replace('DD', day)
    .replace('HH', hours)
    .replace('mm', minutes)
    .replace('ss', seconds)
}

// 时间格式化
export const formatTime = (time: string | Date): string => {
  if (typeof time === 'string') {
    const [hours, minutes] = time.split(':')
    return `${hours}:${minutes}`
  }
  return formatDate(time, 'HH:mm')
}

// 生成唯一ID
export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

// 防抖函数
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: number
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = window.setTimeout(() => func(...args), wait)
  }
}

// 节流函数
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}

// 深拷贝
export const deepClone = <T>(obj: T): T => {
  if (obj === null || typeof obj !== 'object') return obj
  if (obj instanceof Date) return new Date(obj.getTime()) as unknown as T
  if (obj instanceof Array) return obj.map(item => deepClone(item)) as unknown as T
  if (typeof obj === 'object') {
    const clonedObj = {} as T
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        clonedObj[key] = deepClone(obj[key])
      }
    }
    return clonedObj
  }
  return obj
}

// 数据验证工具
export const validators = {
  email: (value: string): boolean => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return re.test(value)
  },
  
  phone: (value: string): boolean => {
    const re = /^1[3-9]\d{9}$/
    return re.test(value)
  },
  
  required: (value: any): boolean => {
    if (typeof value === 'string') return value.trim().length > 0
    if (Array.isArray(value)) return value.length > 0
    return value !== null && value !== undefined
  },
  
  minLength: (min: number) => (value: string): boolean => {
    return value.length >= min
  },
  
  maxLength: (max: number) => (value: string): boolean => {
    return value.length <= max
  },
  
  range: (min: number, max: number) => (value: number): boolean => {
    return value >= min && value <= max
  }
}

// 表单验证
export const validateField = (value: any, rules: ValidationRule[]): string | null => {
  for (const rule of rules) {
    if (rule.required && !validators.required(value)) {
      return rule.message || '此字段为必填项'
    }
    
    if (rule.min && typeof value === 'string' && value.length < rule.min) {
      return rule.message || `最少需要${rule.min}个字符`
    }
    
    if (rule.max && typeof value === 'string' && value.length > rule.max) {
      return rule.message || `最多允许${rule.max}个字符`
    }
    
    if (rule.pattern && !rule.pattern.test(value)) {
      return rule.message || '格式不正确'
    }
    
    if (rule.validator && !rule.validator(value)) {
      return rule.message || '验证失败'
    }
  }
  
  return null
}

// 本地存储工具
export const storage = {
  set: (key: string, value: any): boolean => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
      return true
    } catch (error) {
      console.error('保存到本地存储失败:', error)
      return false
    }
  },
  
  get: <T = any>(key: string): T | null => {
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : null
    } catch (error) {
      console.error('从本地存储读取失败:', error)
      return null
    }
  },
  
  remove: (key: string): boolean => {
    try {
      localStorage.removeItem(key)
      return true
    } catch (error) {
      console.error('从本地存储删除失败:', error)
      return false
    }
  },
  
  clear: (): boolean => {
    try {
      localStorage.clear()
      return true
    } catch (error) {
      console.error('清空本地存储失败:', error)
      return false
    }
  }
}

// 数组工具
export const arrayUtils = {
  // 数组去重
  unique: <T>(arr: T[]): T[] => {
    return [...new Set(arr)]
  },
  
  // 数组分组
  groupBy: <T>(arr: T[], key: keyof T): Record<string, T[]> => {
    return arr.reduce((groups, item) => {
      const group = String(item[key])
      groups[group] = groups[group] || []
      groups[group].push(item)
      return groups
    }, {} as Record<string, T[]>)
  },
  
  // 数组排序
  sortBy: <T>(arr: T[], key: keyof T, order: 'asc' | 'desc' = 'asc'): T[] => {
    return [...arr].sort((a, b) => {
      const aVal = a[key]
      const bVal = b[key]
      
      if (aVal < bVal) return order === 'asc' ? -1 : 1
      if (aVal > bVal) return order === 'asc' ? 1 : -1
      return 0
    })
  },
  
  // 数组分页
  paginate: <T>(arr: T[], page: number, pageSize: number): T[] => {
    const start = (page - 1) * pageSize
    const end = start + pageSize
    return arr.slice(start, end)
  }
}

// 字符串工具
export const stringUtils = {
  // 首字母大写
  capitalize: (str: string): string => {
    return str.charAt(0).toUpperCase() + str.slice(1)
  },
  
  // 驼峰转换
  camelCase: (str: string): string => {
    return str.replace(/-([a-z])/g, (g) => g[1].toUpperCase())
  },
  
  // 短横线转换
  kebabCase: (str: string): string => {
    return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()
  },
  
  // 截断文本
  truncate: (str: string, length: number, suffix = '...'): string => {
    if (str.length <= length) return str
    return str.slice(0, length) + suffix
  },
  
  // 移除HTML标签
  stripHtml: (str: string): string => {
    return str.replace(/<[^>]*>/g, '')
  }
}

// 数字工具
export const numberUtils = {
  // 格式化数字
  format: (num: number, decimals = 2): string => {
    return num.toFixed(decimals)
  },
  
  // 百分比格式化
  percentage: (num: number, decimals = 1): string => {
    return `${(num * 100).toFixed(decimals)}%`
  },
  
  // 随机数生成
  random: (min: number, max: number): number => {
    return Math.floor(Math.random() * (max - min + 1)) + min
  },
  
  // 数字范围限制
  clamp: (num: number, min: number, max: number): number => {
    return Math.min(Math.max(num, min), max)
  }
}

// URL工具
export const urlUtils = {
  // 获取查询参数
  getQueryParam: (name: string): string | null => {
    const urlParams = new URLSearchParams(window.location.search)
    return urlParams.get(name)
  },
  
  // 设置查询参数
  setQueryParam: (name: string, value: string): void => {
    const url = new URL(window.location.href)
    url.searchParams.set(name, value)
    window.history.replaceState({}, '', url.toString())
  },
  
  // 移除查询参数
  removeQueryParam: (name: string): void => {
    const url = new URL(window.location.href)
    url.searchParams.delete(name)
    window.history.replaceState({}, '', url.toString())
  }
}

// 颜色工具
export const colorUtils = {
  // 十六进制转RGB
  hexToRgb: (hex: string): { r: number; g: number; b: number } | null => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null
  },
  
  // RGB转十六进制
  rgbToHex: (r: number, g: number, b: number): string => {
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`
  },
  
  // 生成随机颜色
  randomColor: (): string => {
    return `#${Math.floor(Math.random() * 16777215).toString(16)}`
  }
}

// 文件工具
export const fileUtils = {
  // 获取文件扩展名
  getExtension: (filename: string): string => {
    return filename.slice((filename.lastIndexOf('.') - 1 >>> 0) + 2)
  },
  
  // 格式化文件大小
  formatSize: (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  },
  
  // 下载文件
  download: (data: string | Blob, filename: string, type = 'text/plain'): void => {
    const blob = typeof data === 'string' ? new Blob([data], { type }) : data
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
  }
}
