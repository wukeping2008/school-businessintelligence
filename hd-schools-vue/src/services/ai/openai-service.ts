/**
 * OpenAI服务实现
 * 集成OpenAI GPT API
 */

import { AIServiceBase, type AIServiceConfig, type AIResponse, type ChatMessage } from './ai-service-base'

export class OpenAIService extends AIServiceBase {
  private readonly baseURL: string

  constructor(config: AIServiceConfig) {
    super({
      ...config,
      provider: 'openai',
      model: config.model || 'gpt-3.5-turbo',
      baseURL: config.baseURL || 'https://api.openai.com/v1'
    })
    this.baseURL = this.config.baseURL!
  }

  async chat(messages: ChatMessage[]): Promise<AIResponse> {
    if (!this.validateApiKey()) {
      return {
        success: false,
        error: 'OpenAI API密钥未配置'
      }
    }

    await this.rateLimit()

    try {
      const response = await this.withRetry(async () => {
        const res = await fetch(`${this.baseURL}/chat/completions`, {
          method: 'POST',
          headers: this.buildHeaders(),
          body: JSON.stringify({
            model: this.config.model,
            messages: messages.map(m => ({
              role: m.role,
              content: m.content
            })),
            max_tokens: this.config.maxTokens,
            temperature: this.config.temperature
          })
        })

        return await this.handleResponse(res)
      })

      return {
        success: true,
        data: {
          content: response.choices[0].message.content,
          role: 'assistant'
        },
        usage: response.usage
      }
    } catch (error) {
      return {
        success: false,
        error: this.formatError(error)
      }
    }
  }

  async analyze(text: string, analysisType: string): Promise<AIResponse> {
    const prompt = this.buildAnalysisPrompt(text, analysisType)
    return await this.chat([
      { role: 'system', content: '你是一个专业的教育数据分析师。' },
      { role: 'user', content: prompt }
    ])
  }

  async generate(prompt: string, options?: any): Promise<AIResponse> {
    return await this.chat([
      { role: 'system', content: '你是HD Schools的AI助手，专门帮助生成教育相关内容。' },
      { role: 'user', content: prompt }
    ])
  }

  async analyzeSentiment(text: string): Promise<AIResponse> {
    const prompt = `请分析以下文本的情感倾向，返回JSON格式：
    文本：${text}
    
    返回格式：
    {
      "sentiment": "positive/negative/neutral",
      "score": 0.0-1.0,
      "confidence": 0.0-1.0
    }`

    return await this.chat([
      { role: 'system', content: '你是情感分析专家，只返回JSON格式结果。' },
      { role: 'user', content: prompt }
    ])
  }

  async extractKeywords(text: string): Promise<AIResponse> {
    const prompt = `从以下文本中提取关键词：${text}`
    return await this.chat([
      { role: 'system', content: '你是关键词提取专家。' },
      { role: 'user', content: prompt }
    ])
  }

  async summarize(text: string, maxLength: number = 200): Promise<AIResponse> {
    const prompt = `请将以下内容总结为不超过${maxLength}字的摘要：${text}`
    return await this.chat([
      { role: 'system', content: '你是文本摘要专家。' },
      { role: 'user', content: prompt }
    ])
  }

  async checkHealth(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseURL}/models`, {
        headers: this.buildHeaders()
      })
      return response.ok
    } catch {
      return false
    }
  }

  private buildAnalysisPrompt(text: string, analysisType: string): string {
    const prompts: Record<string, string> = {
      student_profile: `分析以下学生信息，提取学生的优势、兴趣、性格特点和建议：${text}`,
      academic_performance: `分析以下学业表现数据，给出趋势分析和建议：${text}`,
      interaction_warmth: `分析以下师生互动内容的温暖程度，判断是否值得分享给家长：${text}`
    }

    return prompts[analysisType] || `分析以下内容：${text}`
  }
}
