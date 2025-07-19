# School BI Portal - 后端服务

学生升学路径协同系统的后端API服务。

## 技术栈

- **Node.js** + **Express** - 服务器框架
- **TypeScript** - 类型安全
- **MongoDB** - 数据库
- **Socket.io** - 实时通信
- **JWT** - 身份认证

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 配置环境变量

复制 `.env.example` 到 `.env` 并修改配置：

```bash
cp .env.example .env
```

主要配置项：
- `MONGODB_URI` - MongoDB连接字符串
- `JWT_SECRET` - JWT密钥（生产环境请使用强密码）
- `CLIENT_URL` - 前端地址（用于CORS）

### 3. 启动MongoDB

确保MongoDB已安装并运行：

```bash
# macOS (使用Homebrew)
brew services start mongodb-community

# 或使用Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

### 4. 启动开发服务器

```bash
npm run dev
```

服务器将在 http://localhost:3001 启动

## API文档

### 认证相关

- `POST /api/v1/auth/register` - 用户注册
- `POST /api/v1/auth/login` - 用户登录
- `GET /api/v1/auth/me` - 获取当前用户信息
- `PUT /api/v1/auth/change-password` - 修改密码

### 学生管理

- `GET /api/v1/students` - 获取学生列表
- `GET /api/v1/students/:id` - 获取学生详情
- `POST /api/v1/students` - 创建学生
- `PUT /api/v1/students/:id` - 更新学生信息
- `POST /api/v1/students/:id/teachers` - 添加关联教师

### 升学路径

- `GET /api/v1/pathways/student/:studentId` - 获取学生升学路径
- `POST /api/v1/pathways` - 创建升学路径
- `PUT /api/v1/pathways/:id/milestones/:milestoneId` - 更新里程碑
- `POST /api/v1/pathways/:id/milestones` - 添加里程碑

## 数据模型

### User (用户)
- 支持多角色：teacher, counselor, admin
- 基于角色的权限系统

### Student (学生)
- 基本信息、目标大学、学术状态
- 关联教师列表

### Pathway (升学路径)
- 目标大学、里程碑列表
- 版本控制和调整历史

### Milestone (里程碑)
- 类型、状态、优先级
- Action Items和附件

## WebSocket事件

### 客户端事件
- `join-student-room` - 加入学生房间
- `join-teacher-room` - 加入教师房间

### 服务器事件
- `pathway.created` - 路径创建通知
- `milestone.updated` - 里程碑更新
- `actionItem.assigned` - 任务分配通知

## 开发指南

### 项目结构

```
server/
├── src/
│   ├── config/        # 配置文件
│   ├── models/        # 数据模型
│   ├── routes/        # API路由
│   ├── middleware/    # 中间件
│   ├── services/      # 业务逻辑
│   ├── utils/         # 工具函数
│   └── index.ts       # 入口文件
├── logs/              # 日志文件
└── dist/              # 编译输出
```

### 添加新功能

1. 在 `models/` 中定义数据模型
2. 在 `routes/` 中创建路由文件
3. 在 `services/` 中实现业务逻辑
4. 在 `routes/index.ts` 中注册路由

### 测试

```bash
npm test
```

## 部署

### 构建生产版本

```bash
npm run build
```

### 启动生产服务器

```bash
npm start
```

## 注意事项

1. **安全性**：生产环境必须修改 `JWT_SECRET`
2. **数据库**：建议使用MongoDB Atlas或自建集群
3. **日志**：定期清理日志文件
4. **备份**：定期备份数据库

## License

MIT