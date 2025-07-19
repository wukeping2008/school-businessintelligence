<template>
  <div class="admission-chatbot">
    <!-- 聊天容器 -->
    <el-card class="chat-container" :body-style="{ padding: 0 }">
      <!-- 头部 -->
      <div class="chat-header">
        <div class="header-content">
          <el-avatar :size="40" class="bot-avatar">
            <el-icon :size="24"><ChatLineRound /></el-icon>
          </el-avatar>
          <div class="header-info">
            <h3>HD Schools 智能招生顾问</h3>
            <el-tag v-if="isSessionActive" type="success" size="small">
              <el-icon><VideoPlay /></el-icon>
              咨询中
            </el-tag>
            <el-tag v-else size="small">
              <el-icon><VideoPause /></el-icon>
              未开始
            </el-tag>
          </div>
        </div>
        <div class="header-actions">
          <el-tooltip content="导出聊天记录">
            <el-button 
              :icon="Download" 
              circle 
              size="small"
              @click="exportChatHistory"
              :disabled="messages.length === 0"
            />
          </el-tooltip>
          <el-tooltip content="结束咨询">
            <el-button 
              :icon="SwitchButton" 
              circle 
              size="small"
              type="danger"
              @click="handleEndChat"
              :disabled="!isSessionActive"
            />
          </el-tooltip>
        </div>
      </div>
      
      <!-- 进度指示器 -->
      <div class="profile-progress" v-if="isSessionActive">
        <div class="progress-info">
          <span>信息完整度</span>
          <span>{{ profileCompleteness }}%</span>
        </div>
        <el-progress 
          :percentage="profileCompleteness" 
          :stroke-width="4"
          :color="progressColor"
        />
      </div>
      
      <!-- 消息区域 -->
      <div class="chat-messages" ref="messagesContainer">
        <!-- 欢迎界面 -->
        <div v-if="!session" class="welcome-screen">
          <el-icon :size="80" color="#409eff"><ChatLineRound /></el-icon>
          <h2>欢迎来到HD Schools</h2>
          <p>我是您的专属智能招生顾问，将为您提供：</p>
          <div class="features">
            <div class="feature-item">
              <el-icon><School /></el-icon>
              <span>个性化课程推荐</span>
            </div>
            <div class="feature-item">
              <el-icon><TrendCharts /></el-icon>
              <span>专业升学路径规划</span>
            </div>
            <div class="feature-item">
              <el-icon><Document /></el-icon>
              <span>定制学业发展报告</span>
            </div>
          </div>
          <el-button type="primary" size="large" @click="startChat">
            开始咨询
          </el-button>
        </div>
        
        <!-- 消息列表 -->
        <div v-else class="messages-list">
          <div 
            v-for="message in messages" 
            :key="message.id"
            :class="['message', `message-${message.role}`]"
          >
            <el-avatar 
              :size="32" 
              :class="['message-avatar', `avatar-${message.role}`]"
            >
              <el-icon v-if="message.role === 'assistant'"><Service /></el-icon>
              <el-icon v-else><User /></el-icon>
            </el-avatar>
            <div class="message-content">
              <div class="message-bubble">
                {{ message.content }}
              </div>
              <div class="message-time">
                {{ formatTime(message.timestamp) }}
              </div>
            </div>
          </div>
          
          <!-- 加载指示器 -->
          <div v-if="isLoading" class="message message-assistant">
            <el-avatar :size="32" class="message-avatar avatar-assistant">
              <el-icon><Service /></el-icon>
            </el-avatar>
            <div class="message-content">
              <div class="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 快捷回复 -->
      <div v-if="quickReplies.length > 0 && isSessionActive" class="quick-replies">
        <el-button
          v-for="reply in quickReplies"
          :key="reply"
          size="small"
          round
          @click="inputText = reply"
        >
          {{ reply }}
        </el-button>
      </div>
      
      <!-- 输入区域 -->
      <div class="chat-input" v-if="session">
        <el-input
          v-model="inputText"
          type="textarea"
          :rows="2"
          placeholder="请输入您的问题..."
          @keypress="handleKeyPress"
          :disabled="!isSessionActive || isLoading"
        />
        <el-button
          type="primary"
          :icon="Promotion"
          :loading="isLoading"
          :disabled="!canSendMessage"
          @click="sendMessage"
        >
          发送
        </el-button>
      </div>
    </el-card>
    
    <!-- 学生画像侧边栏 -->
    <el-card class="profile-sidebar" v-if="isSessionActive">
      <template #header>
        <div class="sidebar-header">
          <el-icon><UserFilled /></el-icon>
          <span>学生画像</span>
        </div>
      </template>
      
      <div class="profile-content">
        <div class="profile-item" v-if="studentProfile.studentName">
          <label>姓名</label>
          <span>{{ studentProfile.studentName }}</span>
        </div>
        <div class="profile-item" v-if="studentProfile.age">
          <label>年龄</label>
          <span>{{ studentProfile.age }}岁</span>
        </div>
        <div class="profile-item" v-if="studentProfile.currentGrade">
          <label>年级</label>
          <span>{{ studentProfile.currentGrade }}</span>
        </div>
        <div class="profile-item" v-if="studentProfile.interests?.length">
          <label>兴趣特长</label>
          <el-tag 
            v-for="interest in studentProfile.interests" 
            :key="interest"
            size="small"
            style="margin: 2px"
          >
            {{ interest }}
          </el-tag>
        </div>
        <div class="profile-item" v-if="studentProfile.targetUniversities?.length">
          <label>目标大学</label>
          <div>
            <div 
              v-for="uni in studentProfile.targetUniversities" 
              :key="uni"
              class="target-item"
            >
              {{ uni }}
            </div>
          </div>
        </div>
        
        <el-empty 
          v-if="Object.keys(studentProfile).length === 0"
          description="暂无信息"
          :image-size="80"
        />
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  ChatLineRound,
  Download,
  SwitchButton,
  Promotion,
  Service,
  User,
  UserFilled,
  VideoPlay,
  VideoPause,
  School,
  TrendCharts,
  Document
} from '@element-plus/icons-vue'
import { useAdmissionChat } from '@/composables/ai/useAdmissionChat'

// 使用聊天组合式函数
const {
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
  startChat,
  sendMessage,
  endChat,
  resetChat,
  exportChatHistory,
  handleKeyPress
} = useAdmissionChat()

// 模板引用
const messagesContainer = ref<HTMLElement>()

// 进度条颜色
const progressColor = computed(() => {
  const percentage = profileCompleteness.value
  if (percentage < 30) return '#f56c6c'
  if (percentage < 60) return '#e6a23c'
  if (percentage < 80) return '#409eff'
  return '#67c23a'
})

// 格式化时间
const formatTime = (timestamp: Date) => {
  return new Date(timestamp).toLocaleTimeString('zh-CN', {
    hour: '2-digit',
    minute: '2-digit'
  })
}

// 处理结束聊天
const handleEndChat = async () => {
  try {
    await ElMessageBox.confirm(
      '确定要结束本次咨询吗？我们将为您生成专属的学业规划报告。',
      '结束咨询',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    await endChat()
  } catch {
    // 用户取消
  }
}

// 自动滚动到底部
watch(messages, async () => {
  await nextTick()
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
})

// 监听错误
watch(error, (newError) => {
  if (newError) {
    ElMessage.error(newError)
  }
})
</script>

<style scoped lang="scss">
.admission-chatbot {
  display: flex;
  gap: 20px;
  height: 100%;
  
  .chat-container {
    flex: 1;
    display: flex;
    flex-direction: column;
    height: 600px;
    min-height: 500px;
    
    .chat-header {
      padding: 16px 20px;
      border-bottom: 1px solid #e4e7ed;
      display: flex;
      justify-content: space-between;
      align-items: center;
      
      .header-content {
        display: flex;
        align-items: center;
        gap: 12px;
        
        .bot-avatar {
          background: linear-gradient(135deg, #409eff 0%, #00b4d8 100%);
          color: white;
        }
        
        .header-info {
          h3 {
            margin: 0 0 4px 0;
            font-size: 16px;
            font-weight: 600;
          }
        }
      }
      
      .header-actions {
        display: flex;
        gap: 8px;
      }
    }
    
    .profile-progress {
      padding: 12px 20px;
      border-bottom: 1px solid #e4e7ed;
      
      .progress-info {
        display: flex;
        justify-content: space-between;
        font-size: 12px;
        color: #909399;
        margin-bottom: 8px;
      }
    }
    
    .chat-messages {
      flex: 1;
      overflow-y: auto;
      background: #f5f7fa;
      
      .welcome-screen {
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 40px;
        text-align: center;
        
        h2 {
          margin: 20px 0 12px;
          font-size: 24px;
          color: #303133;
        }
        
        p {
          color: #606266;
          margin-bottom: 24px;
        }
        
        .features {
          display: flex;
          gap: 40px;
          margin-bottom: 32px;
          
          .feature-item {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 8px;
            
            .el-icon {
              font-size: 32px;
              color: #409eff;
            }
            
            span {
              font-size: 14px;
              color: #606266;
            }
          }
        }
      }
      
      .messages-list {
        padding: 20px;
        
        .message {
          display: flex;
          margin-bottom: 16px;
          
          &.message-user {
            flex-direction: row-reverse;
            
            .message-bubble {
              background: #409eff;
              color: white;
            }
            
            .message-time {
              text-align: right;
            }
          }
          
          &.message-assistant {
            .message-bubble {
              background: white;
              color: #303133;
            }
          }
          
          .message-avatar {
            flex-shrink: 0;
            
            &.avatar-assistant {
              background: #f0f2f5;
              color: #606266;
            }
            
            &.avatar-user {
              background: #e6f2ff;
              color: #409eff;
            }
          }
          
          .message-content {
            margin: 0 12px;
            max-width: 70%;
            
            .message-bubble {
              padding: 12px 16px;
              border-radius: 8px;
              box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
              line-height: 1.6;
              word-break: break-word;
            }
            
            .message-time {
              margin-top: 4px;
              font-size: 12px;
              color: #909399;
            }
            
            .typing-indicator {
              display: flex;
              align-items: center;
              padding: 12px 16px;
              
              span {
                display: inline-block;
                width: 8px;
                height: 8px;
                border-radius: 50%;
                background: #909399;
                margin: 0 2px;
                animation: typing 1.4s infinite;
                
                &:nth-child(2) {
                  animation-delay: 0.2s;
                }
                
                &:nth-child(3) {
                  animation-delay: 0.4s;
                }
              }
            }
          }
        }
      }
    }
    
    .quick-replies {
      padding: 12px 20px;
      border-top: 1px solid #e4e7ed;
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
    }
    
    .chat-input {
      padding: 16px 20px;
      border-top: 1px solid #e4e7ed;
      display: flex;
      gap: 12px;
      align-items: flex-end;
      
      :deep(.el-textarea) {
        flex: 1;
      }
    }
  }
  
  .profile-sidebar {
    width: 300px;
    
    .sidebar-header {
      display: flex;
      align-items: center;
      gap: 8px;
      font-weight: 600;
    }
    
    .profile-content {
      .profile-item {
        margin-bottom: 16px;
        
        label {
          display: block;
          font-size: 12px;
          color: #909399;
          margin-bottom: 4px;
        }
        
        .target-item {
          padding: 4px 0;
          color: #606266;
        }
      }
    }
  }
}

@keyframes typing {
  0%, 60%, 100% {
    opacity: 0.3;
    transform: translateY(0);
  }
  30% {
    opacity: 1;
    transform: translateY(-10px);
  }
}

// 响应式设计
@media (max-width: 768px) {
  .admission-chatbot {
    flex-direction: column;
    
    .profile-sidebar {
      width: 100%;
    }
  }
}
</style>