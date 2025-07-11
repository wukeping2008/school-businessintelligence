# 智慧校园门户系统 (Vue3版本)

基于Vue3 + TypeScript + Element Plus构建的现代化智慧校园管理门户系统。

## 🚀 技术栈

- **前端框架**: Vue 3.5+ (Composition API)
- **开发语言**: TypeScript 5.6+
- **UI组件库**: Element Plus 2.8+
- **状态管理**: Pinia 2.2+
- **路由管理**: Vue Router 4.4+
- **图表库**: ECharts 5.5+
- **构建工具**: Vite 7.0+
- **包管理器**: npm (淘宝镜像)

## 📋 功能特性

### ✅ 已实现功能

1. **响应式布局设计**
   - 现代化的卡片式界面
   - 完全响应式设计，支持移动端
   - 优雅的过渡动画效果

2. **多语言支持 (i18n)**
   - 中文/英文双语切换
   - 完整的翻译字典
   - 语言偏好本地存储

3. **多校区支持**
   - 上海校区、北京校区、宁波校区
   - 校区切换功能
   - 校区偏好本地存储

4. **路由导航系统**
   - Vue Router 4路由管理
   - 路由守卫和页面标题设置
   - 平滑的页面切换动画

5. **数据可视化**
   - ECharts图表集成
   - 月度数据趋势展示
   - 交互式图表组件

6. **模块化架构**
   - 数据概览 (Dashboard)
   - 招生咨询 (Admission)
   - 家校沟通 (Communication)
   - 学业反馈 (Academic)
   - 升学指导 (Guidance)

### 🔄 待开发功能

- 招生咨询智能问答系统
- 家校沟通记录管理
- 学业反馈分析报告
- 升学指导路径规划

## 🛠️ 开发环境设置

### 环境要求

- Node.js 18.0+
- npm 9.0+

### 安装依赖

```bash
cd hd-schools-vue
npm install
```

### 启动开发服务器

```bash
npm run dev
```

访问 http://localhost:3000

### 构建生产版本

```bash
npm run build
```

### 代码检查

```bash
npm run lint
```

## 📁 项目结构

```
hd-schools-vue/
├── public/                 # 静态资源
├── src/
│   ├── assets/            # 样式和资源文件
│   │   └── main.css       # 全局样式
│   ├── components/        # 可复用组件
│   ├── router/            # 路由配置
│   │   └── index.ts       # 路由定义
│   ├── stores/            # Pinia状态管理
│   │   ├── campus.ts      # 校区管理
│   │   └── i18n.ts        # 国际化
│   ├── types/             # TypeScript类型定义
│   │   └── index.ts       # 通用类型
│   ├── utils/             # 工具函数
│   │   └── index.ts       # 通用工具
│   ├── views/             # 页面组件
│   │   ├── HomeView.vue           # 首页
│   │   ├── AdmissionView.vue      # 招生咨询
│   │   ├── CommunicationView.vue  # 家校沟通
│   │   ├── AcademicView.vue       # 学业反馈
│   │   ├── GuidanceView.vue       # 升学指导
│   │   └── NotFoundView.vue       # 404页面
│   ├── App.vue            # 根组件
│   └── main.ts            # 应用入口
├── index.html             # HTML模板
├── package.json           # 项目配置
├── tsconfig.json          # TypeScript配置
├── vite.config.ts         # Vite配置
└── README.md              # 项目说明
```

## 🎨 设计系统

### 主题色彩

- **主色调**: #2B3A67 (深蓝色)
- **辅助色**: #F4C430 (金黄色)
- **强调色**: #FF6B35 (橙红色)

### 校区主题

- **上海校区**: 深蓝 + 金黄
- **北京校区**: 深红 + 金色
- **宁波校区**: 深绿 + 银色

### 响应式断点

- **移动端**: < 768px
- **平板端**: 768px - 1024px
- **桌面端**: > 1024px

## 🔧 开发规范

### 代码风格

- 使用 TypeScript 严格模式
- 遵循 Vue 3 Composition API 最佳实践
- 使用 ESLint + Prettier 代码格式化
- 组件命名采用 PascalCase
- 文件命名采用 kebab-case

### 提交规范

```
feat: 新功能
fix: 修复bug
docs: 文档更新
style: 代码格式调整
refactor: 代码重构
test: 测试相关
chore: 构建工具或辅助工具的变动
```

## 📱 浏览器支持

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 🤝 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🙏 致谢

- [Vue.js](https://vuejs.org/) - 渐进式JavaScript框架
- [Element Plus](https://element-plus.org/) - Vue 3组件库
- [ECharts](https://echarts.apache.org/) - 数据可视化图表库
- [Vite](https://vitejs.dev/) - 下一代前端构建工具

---

**开发团队**: HD Schools Development Team  
**最后更新**: 2025年7月11日
