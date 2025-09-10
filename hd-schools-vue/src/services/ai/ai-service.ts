/**
 * 通用AI服务基类
 * 支持阿里千问、Kimi等多种AI提供商
 */

import axios, { type AxiosInstance } from 'axios'
import { getAIConfig, type AIConfig } from '@/config/ai.config'
import type { AIResponse, ChatMessage } from '@/types/ai/admission'

export abstract class AIService {
  protected config: AIConfig
  protected client: AxiosInstance
  
  constructor(config?: AIConfig) {
    this.config = config || getAIConfig()
    this.client = this.createClient()
  }
  
  // 创建HTTP客户端
  protected createClient(): AxiosInstance {
    return axios.create({
      timeout: this.config.timeout,
      headers: this.getHeaders()
    })
  }
  
  // 获取请求头（子类可重写）
  protected getHeaders(): Record<string, string> {
    return {
      'Content-Type': 'application/json'
    }
  }
  
  // 发送聊天请求（抽象方法，子类必须实现）
  abstract chat(messages: ChatMessage[], options?: any): Promise<AIResponse>
  
  // 处理错误
  protected handleError(error: any): AIResponse {
    console.error('AI Service Error:', error)
    
    if (error.response) {
      return {
        success: false,
        error: {
          code: error.response.status.toString(),
          message: error.response.data?.message || error.message,
          details: error.response.data
        }
      }
    }
    
    return {
      success: false,
      error: {
        code: 'NETWORK_ERROR',
        message: error.message || '网络请求失败'
      }
    }
  }
}

/**
 * 阿里千问AI服务实现
 */
export class QwenAIService extends AIService {
  protected getHeaders(): Record<string, string> {
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.config.apiKey}`
    }
  }
  
  async chat(messages: ChatMessage[], options?: any): Promise<AIResponse> {
    try {
      // 转换消息格式为千问API格式
      const qwenMessages = messages.map(msg => ({
        role: msg.role === 'assistant' ? 'assistant' : 'user',
        content: msg.content
      }))
      
      const response = await this.client.post(this.config.apiUrl, {
        model: this.config.model,
        input: {
          messages: qwenMessages
        },
        parameters: {
          temperature: options?.temperature || this.config.temperature,
          max_tokens: options?.maxTokens || this.config.maxTokens,
          top_p: options?.topP || 0.9,
          ...options
        }
      })
      
      if (response.data.output?.text) {
        return {
          success: true,
          data: {
            content: response.data.output.text,
            finishReason: response.data.output.finish_reason
          },
          usage: {
            promptTokens: response.data.usage?.input_tokens || 0,
            completionTokens: response.data.usage?.output_tokens || 0,
            totalTokens: response.data.usage?.total_tokens || 0
          }
        }
      }
      
      throw new Error('Invalid response format')
    } catch (error) {
      return this.handleError(error)
    }
  }
}

/**
 * Kimi AI服务实现
 */
export class KimiAIService extends AIService {
  protected getHeaders(): Record<string, string> {
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.config.apiKey}`
    }
  }
  
  async chat(messages: ChatMessage[], options?: any): Promise<AIResponse> {
    try {
      // Kimi使用标准的OpenAI格式
      const kimiMessages = messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }))
      
      const response = await this.client.post(this.config.apiUrl, {
        model: this.config.model,
        messages: kimiMessages,
        temperature: options?.temperature || this.config.temperature,
        max_tokens: options?.maxTokens || this.config.maxTokens,
        top_p: options?.topP || 0.95,
        frequency_penalty: options?.frequencyPenalty || 0,
        presence_penalty: options?.presencePenalty || 0,
        ...options
      })
      
      if (response.data.choices?.[0]?.message) {
        return {
          success: true,
          data: {
            content: response.data.choices[0].message.content,
            finishReason: response.data.choices[0].finish_reason
          },
          usage: {
            promptTokens: response.data.usage?.prompt_tokens || 0,
            completionTokens: response.data.usage?.completion_tokens || 0,
            totalTokens: response.data.usage?.total_tokens || 0
          }
        }
      }
      
      throw new Error('Invalid response format')
    } catch (error) {
      return this.handleError(error)
    }
  }
}

/**
 * AI服务工厂
 */
export class AIServiceFactory {
  private static instances: Map<string, AIService> = new Map()
  
  static create(provider?: string): AIService {
    const config = getAIConfig()
    const providerName = provider || config.provider
    
    // 使用单例模式
    if (!this.instances.has(providerName)) {
      let service: AIService
      
      switch (providerName) {
        case 'qwen':
          service = new QwenAIService()
          break
        case 'kimi':
          service = new KimiAIService()
          break
        default:
          throw new Error(`Unsupported AI provider: ${providerName}`)
      }
      
      this.instances.set(providerName, service)
    }
    
    return this.instances.get(providerName)!
  }
  
  // 清除缓存的实例
  static clear(): void {
    this.instances.clear()
  }
}