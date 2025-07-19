import api from './api'

interface LoginParams {
  username: string
  password: string
}

interface RegisterParams {
  username: string
  email: string
  password: string
  role: string
  subjects?: string[]
}

interface AuthResponse {
  success: boolean
  data: {
    user: {
      id: string
      username: string
      email: string
      role: string
      permissions: string[]
      subjects?: string[]
    }
    token: string
    refreshToken: string
  }
}

export const authService = {
  // 登录
  async login(params: LoginParams): Promise<AuthResponse> {
    const response = await api.post<any, AuthResponse>('/auth/login', params)
    
    if (response.success && response.data) {
      // 保存token和用户信息
      localStorage.setItem('token', response.data.token)
      localStorage.setItem('userInfo', JSON.stringify(response.data.user))
    }
    
    return response
  },
  
  // 注册
  async register(params: RegisterParams): Promise<AuthResponse> {
    return api.post<any, AuthResponse>('/auth/register', params)
  },
  
  // 获取当前用户信息
  async getCurrentUser() {
    return api.get('/auth/me')
  },
  
  // 修改密码
  async changePassword(currentPassword: string, newPassword: string) {
    return api.put('/auth/change-password', {
      currentPassword,
      newPassword
    })
  },
  
  // 退出登录
  logout() {
    localStorage.removeItem('token')
    localStorage.removeItem('userInfo')
  }
}