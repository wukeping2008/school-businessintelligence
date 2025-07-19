/**
 * AI服务基础类
 * 提供统一的AI服务接口和配置管理
 */

export interface AIServiceConfig {
  provider: 'openai' | 'wenxin' | 'tongyi' | 'mock'
  apiKey?: string
  baseURL?: string
  model?: string
  maxTokens?: number
  temperature?: number
}

export interface AIResponse {
  success: boolean
  data?: any
  error?: string
  usage?: {
    promptTokens: number
    completionTokens: number
    totalTokens: number
  }
}

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
  timestamp?: Date
}

export abstract class AIServiceBase {
  protected config: AIServiceConfig

  constructor(config: AIServiceConfig) {
    this.config = {
      maxTokens: 2000,
      temperature: 0.7,
      ...config
    }
  }

  /**
   * 发送聊天消息
   */
  abstract chat(messages: ChatMessage[]): Promise<AIResponse>

  /**
   * 文本分析
   */
  abstract analyze(text: string, analysisType: string): Promise<AIResponse>

  /**
   * 内容生成
   */
  abstract generate(prompt: string, options?: any): Promise<AIResponse>

  /**
   * 情感分析
   */
  abstract analyzeSentiment(text: string): Promise<AIResponse>

  /**
   * 关键词提取
   */
  abstract extractKeywords(text: string): Promise<AIResponse>

  /**
   * 文本摘要
   */
  abstract summarize(text: string, maxLength?: number): Promise<AIResponse>

  /**
   * 检查服务状态
   */
  abstract checkHealth(): Promise<boolean>

  /**
   * 获取配置信息
   */
  getConfig(): AIServiceConfig {
    return { ...this.config }
  }

  /**
   * 更新配置
   */
  updateConfig(newConfig: Partial<AIServiceConfig>): void {
    this.config = { ...this.config, ...newConfig }
  }

  /**
   * 格式化错误信息
   */
  protected formatError(error: any): string {
    if (typeof error === 'string') return error
    if (error?.message) return error.message
    if (error?.error?.message) return error.error.message
    return '未知错误'
  }

  /**
   * 验证API密钥
   */
  protected validateApiKey(): boolean {
    if (this.config.provider === 'mock') return true
    return !!this.config.apiKey
  }

  /**
   * 构建请求头
   */
  protected buildHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    }

    if (this.config.apiKey) {
      switch (this.config.provider) {
        case 'openai':
          headers['Authorization'] = `Bearer ${this.config.apiKey}`
          break
        case 'wenxin':
          headers['Authorization'] = `Bearer ${this.config.apiKey}`
          break
        case 'tongyi':
          headers['Authorization'] = `Bearer ${this.config.apiKey}`
          break
      }
    }

    return headers
  }

  /**
   * 处理API响应
   */
  protected async handleResponse(response: Response): Promise<any> {
    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`API请求失败: ${response.status} ${errorText}`)
    }

    const contentType = response.headers.get('content-type')
    if (contentType && contentType.includes('application/json')) {
      return await response.json()
    }

    return await response.text()
  }

  /**
   * 重试机制
   */
  protected async withRetry<T>(
    operation: () => Promise<T>,
    maxRetries: number = 3,
    delay: number = 1000
  ): Promise<T> {
    let lastError: any

    for (let i = 0; i <= maxRetries; i++) {
      try {
        return await operation()
      } catch (error) {
        lastError = error
        
        if (i === maxRetries) break
        
        // 指数退避
        const waitTime = delay * Math.pow(2, i)
        await new Promise(resolve => setTimeout(resolve, waitTime))
      }
    }

    throw lastError
  }

  /**
   * 限流控制
   */
  private lastRequestTime = 0
  private minInterval = 100 // 最小请求间隔(ms)

  protected async rateLimit(): Promise<void> {
    const now = Date.now()
    const timeSinceLastRequest = now - this.lastRequestTime
    
    if (timeSinceLastRequest < this.minInterval) {
      const waitTime = this.minInterval - timeSinceLastRequest
      await new Promise(resolve => setTimeout(resolve, waitTime))
    }
    
    this.lastRequestTime = Date.now()
  }
}

/**
 * AI服务工厂
 */
export class AIServiceFactory {
  private static instances: Map<string, AIServiceBase> = new Map()

  static async createService(config: AIServiceConfig): Promise<AIServiceBase> {
    const key = `${config.provider}-${config.model || 'default'}`
    
    if (this.instances.has(key)) {
      return this.instances.get(key)!
    }

    let service: AIServiceBase

    switch (config.provider) {
      case 'openai':
        const { OpenAIService } = await import('./openai-service')
        service = new OpenAIService(config)
        break
      case 'wenxin':
        const { WenxinService } = await import('./wenxin-service')
        service = new WenxinService(config)
        break
      case 'tongyi':
        const { TongyiService } = await import('./tongyi-service')
        service = new TongyiService(config)
        break
      case 'mock':
      default:
        const { MockAIService } = await import('./mock-ai-service')
        service = new MockAIService(config)
        break
    }

    this.instances.set(key, service)
    return service
  }

  static clearCache(): void {
    this.instances.clear()
  }
}
