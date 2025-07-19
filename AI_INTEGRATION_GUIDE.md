# HD Schools AI智能招生系统集成指南

## 🚀 快速开始

### 1. 配置API密钥

复制环境变量示例文件：
```bash
cp .env.example .env.local
```

编辑 `.env.local` 文件，填入您的API密钥：
```env
# 选择AI提供商：qwen（推荐）| kimi | openai
VITE_AI_PROVIDER=qwen

# 阿里千问API密钥
VITE_QWEN_API_KEY=sk-xxxxxxxxxxxxxx
```

### 2. 获取API密钥

#### 阿里千问（推荐）
1. 访问 [阿里云DashScope控制台](https://dashscope.console.aliyun.com/)
2. 注册/登录账号
3. 创建API密钥
4. 复制密钥到 `.env.local`

#### Kimi
1. 访问 [Moonshot AI平台](https://platform.moonshot.cn/)
2. 注册/登录账号
3. 创建API密钥
4. 复制密钥到 `.env.local`

### 3. 启动项目

```bash
cd hd-schools-vue
npm install
npm run dev
```

访问 http://localhost:5173/admission-ai 查看AI智能咨询功能。

## 🎯 功能特性

### 智能对话引擎
- ✅ 支持阿里千问、Kimi等国产AI模型
- ✅ 智能意图识别和实体提取
- ✅ 上下文管理和对话流控制
- ✅ 实时打字效果和加载动画

### 学生画像构建
- ✅ 自动提取关键信息（年龄、年级、兴趣等）
- ✅ 实时画像更新和进度显示
- ✅ 信息完整度追踪
- ✅ 智能引导对话流程

### 个性化功能
- ✅ 快捷回复建议
- ✅ 对话历史导出
- ✅ 会话状态管理
- ✅ 响应式设计（支持移动端）

## 📁 项目结构

```
src/
├── config/
│   └── ai.config.ts          # AI服务配置
├── types/ai/
│   └── admission.ts          # 类型定义
├── services/ai/
│   ├── ai-service.ts         # AI服务基类
│   └── admission-chat-engine.ts # 对话引擎
├── composables/ai/
│   └── useAdmissionChat.ts   # Vue组合函数
├── components/ai/
│   └── AdmissionChatBot.vue  # 聊天组件
└── views/
    └── AdmissionAI.vue       # AI咨询页面
```

## 🔧 技术架构

### AI服务层
```typescript
// 支持多AI提供商的统一接口
const aiService = AIServiceFactory.create('qwen')
const response = await aiService.chat(messages)
```

### 对话管理
```typescript
// 智能对话引擎
const chatEngine = new AdmissionChatEngine()
await chatEngine.startSession()
const reply = await chatEngine.processMessage(userInput)
```

### Vue集成
```typescript
// 使用组合式函数管理状态
const { 
  messages, 
  sendMessage, 
  studentProfile 
} = useAdmissionChat()
```

## 📊 成本控制

### API调用优化
- 智能上下文窗口管理（最多10条历史消息）
- 合理的token限制（单次最多2000 tokens）
- 会话轮数限制（最多20轮对话）

### 费用估算
- 阿里千问：约 ¥0.008/千tokens
- 平均每次咨询：约 ¥0.1-0.3
- 月度预算建议：¥500-1000（支持3000+次咨询）

## 🛠️ 扩展开发

### 添加新的AI提供商
1. 在 `ai.config.ts` 中添加配置
2. 创建新的服务类继承 `AIService`
3. 在 `AIServiceFactory` 中注册

### 自定义对话流程
1. 修改 `ADMISSION_SYSTEM_PROMPTS` 系统提示词
2. 扩展 `analyzeMessage` 方法添加新的实体提取
3. 自定义 `checkGuidanceNeeded` 引导逻辑

### 增强学生画像
1. 在 `StudentProfile` 接口添加新字段
2. 更新 `extractInterests` 等提取方法
3. 扩展画像展示组件

## 🚨 注意事项

1. **API密钥安全**：不要将密钥提交到代码仓库
2. **成本控制**：监控API调用量，设置合理限额
3. **用户隐私**：对话数据仅用于生成报告，注意保护隐私
4. **错误处理**：网络异常时提供友好提示

## 📞 技术支持

- 问题反馈：[GitHub Issues](https://github.com/hdschools/bi-portal/issues)
- 技术文档：查看 `docs/` 目录
- 联系邮箱：tech@hdschools.com

---

*最后更新：2025年1月17日*