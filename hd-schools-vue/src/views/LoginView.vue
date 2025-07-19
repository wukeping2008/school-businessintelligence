<template>
  <div class="login-container">
    <div class="login-box">
      <div class="login-header">
        <h1>HD SCHOOLS</h1>
        <p>智慧校园门户 - 教师登录</p>
      </div>
      
      <el-form 
        ref="loginFormRef"
        :model="loginForm" 
        :rules="loginRules"
        @submit.prevent="handleLogin"
      >
        <el-form-item prop="username">
          <el-input 
            v-model="loginForm.username" 
            placeholder="用户名或邮箱"
            prefix-icon="User"
            size="large"
          />
        </el-form-item>
        
        <el-form-item prop="password">
          <el-input 
            v-model="loginForm.password" 
            type="password"
            placeholder="密码"
            prefix-icon="Lock"
            size="large"
            show-password
          />
        </el-form-item>
        
        <el-form-item>
          <el-button 
            type="primary" 
            size="large"
            :loading="loading"
            @click="handleLogin"
            style="width: 100%"
          >
            登录
          </el-button>
        </el-form-item>
      </el-form>
      
      <div class="login-footer">
        <el-link type="primary" @click="showDemoHint">使用演示账号</el-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElNotification } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import { authService } from '@/services/auth.service'

const router = useRouter()
const loginFormRef = ref<FormInstance>()
const loading = ref(false)

// 表单数据
const loginForm = reactive({
  username: '',
  password: ''
})

// 表单验证规则
const loginRules: FormRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码至少6位', trigger: 'blur' }
  ]
}

// 登录处理
const handleLogin = async () => {
  if (!loginFormRef.value) return
  
  await loginFormRef.value.validate(async (valid) => {
    if (valid) {
      loading.value = true
      
      try {
        // 模拟登录 - 实际使用时调用API
        if (loginForm.username === 'admin' && loginForm.password === '123456') {
          // 模拟保存登录信息
          localStorage.setItem('token', 'mock-jwt-token')
          localStorage.setItem('userInfo', JSON.stringify({
            id: '1',
            username: 'admin',
            email: 'admin@hdschools.com',
            role: 'admin',
            permissions: ['view_all_students', 'manage_pathways']
          }))
          
          ElMessage.success('登录成功')
          router.push('/teacher-dashboard')
        } else {
          // 实际调用API
          // const response = await authService.login(loginForm)
          // router.push('/teacher-dashboard')
          ElMessage.error('用户名或密码错误')
        }
      } catch (error) {
        console.error('登录失败:', error)
      } finally {
        loading.value = false
      }
    }
  })
}

// 显示演示提示
const showDemoHint = () => {
  ElNotification({
    title: '演示账号',
    message: '用户名: admin\n密码: 123456',
    type: 'info',
    duration: 5000
  })
}
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.login-box {
  width: 400px;
  padding: 40px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
}

.login-header {
  text-align: center;
  margin-bottom: 40px;
}

.login-header h1 {
  font-size: 32px;
  font-weight: bold;
  color: #303133;
  margin: 0 0 8px 0;
}

.login-header p {
  color: #606266;
  font-size: 14px;
}

.login-footer {
  text-align: center;
  margin-top: 20px;
}

/* 深色模式适配 */
@media (prefers-color-scheme: dark) {
  .login-box {
    background: #1a1a1a;
    color: #fff;
  }
  
  .login-header h1 {
    color: #fff;
  }
  
  .login-header p {
    color: #ccc;
  }
}
</style>