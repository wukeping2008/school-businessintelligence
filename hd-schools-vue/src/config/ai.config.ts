/**
 * AI服务配置文件
 * 支持阿里千问和Kimi等国产AI模型
 */

export interface AIConfig {
  provider: 'qwen' | 'kimi' | 'openai'
  apiKey: string
  apiUrl: string
  model: string
  maxTokens: number
  temperature: number
  timeout: number
}

// AI提供商配置
export const AI_PROVIDERS = {
  // 阿里千问配置
  qwen: {
    provider: 'qwen' as const,
    apiKey: process.env.VITE_QWEN_API_KEY || '',
    apiUrl: 'https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation',
    model: 'qwen-turbo', // 可选: qwen-turbo, qwen-plus, qwen-max
    maxTokens: 2000,
    temperature: 0.8,
    timeout: 30000
  },
  
  // Kimi配置
  kimi: {
    provider: 'kimi' as const,
    apiKey: process.env.VITE_KIMI_API_KEY || '',
    apiUrl: 'https://api.moonshot.cn/v1/chat/completions',
    model: 'moonshot-v1-8k', // 可选: moonshot-v1-8k, moonshot-v1-32k, moonshot-v1-128k
    maxTokens: 2000,
    temperature: 0.8,
    timeout: 30000
  },
  
  // OpenAI配置（备用）
  openai: {
    provider: 'openai' as const,
    apiKey: process.env.VITE_OPENAI_API_KEY || '',
    apiUrl: 'https://api.openai.com/v1/chat/completions',
    model: 'gpt-3.5-turbo',
    maxTokens: 2000,
    temperature: 0.8,
    timeout: 30000
  }
}

// 默认使用阿里千问
export const DEFAULT_AI_PROVIDER = 'qwen'

// 获取当前AI配置
export function getAIConfig(): AIConfig {
  const provider = (process.env.VITE_AI_PROVIDER || DEFAULT_AI_PROVIDER) as keyof typeof AI_PROVIDERS
  return AI_PROVIDERS[provider] || AI_PROVIDERS[DEFAULT_AI_PROVIDER]
}

// 招生咨询相关的系统提示词
export const ADMISSION_SYSTEM_PROMPTS = {
  qwen: `你是HD Schools国际学校的智能招生顾问。你的任务是：
1. 热情友好地与家长和学生交流
2. 了解学生的基本信息、兴趣特长、学业目标
3. 介绍学校的优势和特色项目
4. 根据学生情况推荐合适的课程和发展路径
5. 回答关于学校、课程、申请流程的问题
6. 收集关键信息用于生成个性化学业规划报告

请用专业但亲切的语气交流，展现学校的国际化视野和个性化教育理念。`,

  kimi: `你是HD Schools国际学校的智能招生顾问。你需要：
- 以专业且友好的方式与家长学生交流
- 深入了解学生背景、特长、目标
- 精准介绍学校优势和匹配的项目
- 提供个性化的课程建议和升学规划
- 准确回答各类咨询问题
- 记录关键信息用于后续分析

请保持耐心、专业、富有洞察力的交流风格。`
}

// 对话参数配置
export const CONVERSATION_CONFIG = {
  // 最大对话轮数
  maxTurns: 20,
  // 上下文窗口大小
  contextWindow: 10,
  // 关键信息提取的字段
  keyInfoFields: [
    'studentName',
    'age',
    'currentGrade',
    'interests',
    'academicStrengths',
    'languageAbilities',
    'targetUniversities',
    'careerGoals',
    'parentExpectations',
    'specialNeeds'
  ]
}