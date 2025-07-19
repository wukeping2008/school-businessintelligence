/**
 * 招生咨询聊天组合式函数
 * 管理聊天状态和交互逻辑
 */

import { ref, computed, onUnmounted } from 'vue'
import { ElMessage } from 'element-plus'
import { AdmissionChatEngine } from '@/services/ai/admission-chat-engine'
import type { ChatSession, ChatMessage, StudentProfile } from '@/types/ai/admission'

export function useAdmissionChat() {
  // 状态管理
  const chatEngine = new AdmissionChatEngine()
  const session = ref<ChatSession | null>(null)
  const messages = computed(() => session.value?.messages.filter(m => m.role !== 'system') || [])
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const inputText = ref('')
  
  // 学生画像
  const studentProfile = computed(() => session.value?.studentProfile || {})
  const profileCompleteness = computed(() => {
    const profile = studentProfile.value
    const fields = ['studentName', 'age', 'currentGrade', 'interests', 'targetUniversities']
    const filledFields = fields.filter(field => (profile as any)[field])
    return Math.round((filledFields.length / fields.length) * 100)
  })
  
  // 聊天状态
  const isSessionActive = computed(() => session.value?.status === 'active')
  const canSendMessage = computed(() => 
    isSessionActive.value && 
    !isLoading.value && 
    inputText.value.trim().length > 0
  )
  
  /**
   * 开始新会话
   */
  const startChat = async () => {
    try {
      isLoading.value = true
      error.value = null
      
      session.value = await chatEngine.startSession()
      
      // 播放欢迎消息的打字效果
      const greetingMessage = messages.value[0]
      if (greetingMessage) {
        await simulateTyping(greetingMessage)
      }
    } catch (err: any) {
      error.value = err.message || '启动会话失败'
      ElMessage.error('无法启动咨询会话，请稍后重试')
    } finally {
      isLoading.value = false
    }
  }
  
  /**
   * 发送消息
   */
  const sendMessage = async () => {
    if (!canSendMessage.value) return
    
    const userInput = inputText.value.trim()
    inputText.value = '' // 清空输入框
    
    try {
      isLoading.value = true
      error.value = null
      
      // 立即显示用户消息
      if (session.value) {
        const tempUserMessage: ChatMessage = {
          id: 'temp-' + Date.now(),
          role: 'user',
          content: userInput,
          timestamp: new Date()
        }
        session.value.messages.push(tempUserMessage)
      }
      
      // 处理消息并获取AI回复
      const response = await chatEngine.processMessage(userInput)
      
      // 移除临时消息（真实消息已经在engine中添加）
      if (session.value) {
        session.value.messages = session.value.messages.filter(
          m => !m.id.startsWith('temp-')
        )
      }
      
      // 模拟打字效果
      await simulateTyping(response)
      
      // 检查会话是否结束
      if (session.value?.status === 'completed') {
        handleSessionComplete()
      }
    } catch (err: any) {
      error.value = err.message || '发送消息失败'
      ElMessage.error('消息发送失败，请重试')
    } finally {
      isLoading.value = false
    }
  }
  
  /**
   * 模拟打字效果
   */
  const simulateTyping = async (message: ChatMessage, speed = 30) => {
    if (!message.content) return
    
    const fullContent = message.content
    message.content = ''
    
    for (let i = 0; i <= fullContent.length; i++) {
      message.content = fullContent.slice(0, i)
      await new Promise(resolve => setTimeout(resolve, speed))
    }
  }
  
  /**
   * 处理会话结束
   */
  const handleSessionComplete = () => {
    ElMessage.success({
      message: '咨询会话已结束，正在生成您的专属学业规划报告...',
      duration: 3000
    })
    
    // TODO: 跳转到报告页面或显示报告弹窗
  }
  
  /**
   * 结束会话
   */
  const endChat = async () => {
    if (!isSessionActive.value) return
    
    try {
      isLoading.value = true
      await chatEngine.endSession()
      handleSessionComplete()
    } catch (err: any) {
      error.value = err.message || '结束会话失败'
      ElMessage.error('结束会话时出错')
    } finally {
      isLoading.value = false
    }
  }
  
  /**
   * 重置聊天
   */
  const resetChat = () => {
    session.value = null
    inputText.value = ''
    error.value = null
    isLoading.value = false
  }
  
  /**
   * 导出聊天记录
   */
  const exportChatHistory = () => {
    if (!session.value) return
    
    const chatHistory = messages.value.map(m => 
      `[${new Date(m.timestamp).toLocaleTimeString()}] ${
        m.role === 'user' ? '您' : 'HD Schools顾问'
      }: ${m.content}`
    ).join('\n\n')
    
    const blob = new Blob([chatHistory], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `HD_Schools_咨询记录_${new Date().toLocaleDateString()}.txt`
    link.click()
    URL.revokeObjectURL(url)
  }
  
  /**
   * 快捷回复选项
   */
  const quickReplies = computed(() => {
    if (!isSessionActive.value) return []
    
    const profile = studentProfile.value
    const options = []
    
    // 根据对话阶段提供不同的快捷回复
    if (!profile.age) {
      options.push(
        '孩子今年15岁',
        '目前读初三',
        '计划申请美国大学'
      )
    } else if (!profile.interests || profile.interests.length === 0) {
      options.push(
        '对理工科比较感兴趣',
        '喜欢艺术和设计',
        '体育特长生'
      )
    } else if (!profile.targetUniversities) {
      options.push(
        '目标是常春藤',
        '想申请英国G5',
        '还没有明确目标'
      )
    } else {
      options.push(
        '了解AP课程',
        '咨询申请流程',
        '询问学费情况'
      )
    }
    
    return options
  })
  
  // 键盘快捷键支持
  const handleKeyPress = (event: KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      sendMessage()
    }
  }
  
  // 清理
  onUnmounted(() => {
    if (isSessionActive.value) {
      // 保存未完成的会话到本地存储
      if (session.value) {
        localStorage.setItem('admission_chat_session', JSON.stringify(session.value))
      }
    }
  })
  
  return {
    // 状态
    session,
    messages,
    isLoading,
    error,
    inputText,
    studentProfile,
    profileCompleteness,
    isSessionActive,
    canSendMessage,
    quickReplies,
    
    // 方法
    startChat,
    sendMessage,
    endChat,
    resetChat,
    exportChatHistory,
    handleKeyPress
  }
}