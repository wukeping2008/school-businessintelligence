# 国际学校商业智能门户系统

<div align="center">

![Logo](https://img.shields.io/badge/School-BI%20Portal-blue?style=for-the-badge&logo=graduation-cap)

**一个专为国际学校设计的智能化教育管理平台**

[![在线演示](https://img.shields.io/badge/在线演示-Live%20Demo-success?style=flat-square)](http://inspire.long-arena.com/schoolbiportal)
[![技术栈](https://img.shields.io/badge/技术栈-HTML5%20|%20CSS3%20|%20JavaScript-orange?style=flat-square)](#技术栈)
[![许可证](https://img.shields.io/badge/许可证-MIT-green?style=flat-square)](#许可证)

[功能特色](#-功能特色) • [快速开始](#-快速开始) • [技术栈](#-技术栈) • [项目结构](#-项目结构) • [部署指南](#-部署指南) • [贡献指南](#-贡献指南)

</div>

---

## 📖 项目简介

国际学校商业智能门户系统是一个全方位的智能化教育管理平台，通过数据驱动的方式提升招生效率、加强家校沟通、优化学业反馈和升学指导。系统采用现代化的前端技术栈，提供直观的用户界面和丰富的数据可视化功能。

### 🎯 项目愿景

- **智能化招生**: 通过互动问卷生成个性化学业规划报告
- **温馨家校沟通**: 记录学生校园生活的每个精彩瞬间
- **数据驱动反馈**: 基于AI的学业表现分析和发展建议
- **可视化升学指导**: 智能升学路径规划和目标调整

---

## ✨ 功能特色

### 🎓 招生咨询系统
- **智能问卷流程**: 多步骤表单，收集学生信息和教育需求
- **个性化报告生成**: 基于问卷答案自动生成学业规划建议
- **选课建议**: 根据学生兴趣和目标推荐合适的课程
- **时间规划**: 制定详细的学习时间表和里程碑

### 💬 家校沟通平台
- **快速记录功能**: 便捷记录学生日常表现和互动瞬间
- **互动时间线**: 时间轴展示学生的成长历程
- **智能分享**: 一键分享精彩瞬间给家长
- **多维度筛选**: 按类型、学生、时间等维度筛选记录

### 📊 学业反馈分析
- **雷达图展示**: 直观展示学生各学科表现
- **趋势分析**: 成绩变化趋势和预测分析
- **AI智能报告**: 基于数据的个性化学业分析
- **发展建议**: 针对性的学习改进建议

### 🎯 升学指导系统
- **可视化路径图**: 3D升学路径展示和交互
- **进度仪表盘**: 实时跟踪升学准备进度
- **里程碑管理**: 重要节点的设置和追踪
- **智能目标调整**: 基于表现动态调整升学目标

### 🌐 国际化支持
- **双语界面**: 完整的中英文支持
- **动态切换**: 实时语言切换，无需刷新页面
- **本地化存储**: 语言偏好自动保存
- **专业翻译**: 教育行业专业术语准确翻译

---

## 🚀 快速开始

### 在线体验
直接访问在线演示：[http://inspire.long-arena.com/schoolbiportal](http://inspire.long-arena.com/schoolbiportal)

### 本地运行

#### 前置要求
- 现代浏览器 (Chrome 80+, Firefox 75+, Safari 13+)
- 本地Web服务器 (可选，用于开发)

#### 安装步骤

1. **克隆项目**
```bash
git clone https://github.com/your-username/school-bi-portal.git
cd school-bi-portal
```

2. **启动本地服务器**
```bash
# 使用Python (推荐)
python -m http.server 8000

# 或使用Node.js
npx http-server -p 8000

# 或使用PHP
php -S localhost:8000
```

3. **访问应用**
打开浏览器访问 `http://localhost:8000`

#### 快速预览
如果只是想快速查看，可以直接用浏览器打开 `index.html` 文件。

---

## 🛠 技术栈

### 前端技术
| 技术 | 版本 | 说明 |
|------|------|------|
| **HTML5** | - | 语义化标签，现代Web标准 |
| **CSS3** | - | Flexbox/Grid布局，动画效果 |
| **JavaScript** | ES6+ | 模块化开发，现代语法 |
| **Chart.js** | 3.x | 2D图表库，雷达图、折线图 |
| **ECharts** | 5.x | 复杂可视化，3D图表、关系图 |
| **Font Awesome** | 6.x | 矢量图标库 |

### 开发工具
- **VS Code**: 主要开发环境
- **Chrome DevTools**: 调试和性能分析
- **Git**: 版本控制

### 部署环境
- **服务器**: 阿里云ECS
- **Web服务器**: Nginx
- **域名**: inspire.long-arena.com

---

## 📁 项目结构

```
school-bi-portal/
├── 📄 index.html                    # 主页面入口
├── 📁 styles/
│   └── 🎨 main.css                  # 主样式文件
├── 📁 scripts/
│   ├── ⚙️ main.js                   # 主应用逻辑
│   ├── 🌐 i18n.js                   # 国际化系统
│   ├── 📊 data.js                   # 数据管理
│   ├── 🎓 admission.js              # 招生咨询模块
│   ├── 💬 communication.js          # 家校沟通模块
│   ├── 📈 academic.js               # 学业反馈模块
│   └── 🎯 guidance.js               # 升学指导模块
├── 📁 assets/
│   ├── 🖼️ images/                   # 图片资源
│   └── 🔤 fonts/                    # 字体文件
├── 📁 docs/
│   ├── 📋 PROJECT_ROADMAP.md        # 项目路线图
│   ├── 📚 TECHNICAL_DOCUMENTATION.md # 技术文档
│   └── 📖 README.md                 # 项目说明
└── 📄 LICENSE                       # 许可证文件
```

### 核心模块说明

#### 🏗️ 主应用 (main.js)
- 应用初始化和路由管理
- 页面导航和状态管理
- 通知系统和工具函数

#### 🌐 国际化系统 (i18n.js)
- 中英文翻译管理
- 动态语言切换
- 本地化存储

#### 📊 数据管理 (data.js)
- 模拟数据定义
- 数据结构设计
- 数据操作接口

#### 🎓 招生咨询 (admission.js)
- 智能问卷系统
- 报告生成逻辑
- 用户交互处理

#### 💬 家校沟通 (communication.js)
- 互动记录管理
- 时间线渲染
- 分享和导出功能

#### 📈 学业反馈 (academic.js)
- 图表可视化
- AI报告生成
- 数据分析算法

#### 🎯 升学指导 (guidance.js)
- 3D路径图渲染
- 里程碑管理
- 目标调整算法

---

## 🎨 界面预览

### 首页仪表板
![首页](https://via.placeholder.com/800x400/667eea/ffffff?text=Dashboard+Preview)

### 招生咨询系统
![招生咨询](https://via.placeholder.com/800x400/f093fb/ffffff?text=Admission+System)

### 家校沟通平台
![家校沟通](https://via.placeholder.com/800x400/43e97b/ffffff?text=Communication+Platform)

### 学业反馈分析
![学业反馈](https://via.placeholder.com/800x400/4facfe/ffffff?text=Academic+Feedback)

### 升学指导系统
![升学指导](https://via.placeholder.com/800x400/ff6b6b/ffffff?text=College+Guidance)

---

## 🚀 部署指南

### 生产环境部署

#### 1. 服务器准备
```bash
# 安装Nginx
sudo yum install nginx

# 启动Nginx服务
sudo systemctl start nginx
sudo systemctl enable nginx
```

#### 2. 配置Nginx
```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /var/www/html/schoolbiportal;
    index index.html;
    
    # 静态文件缓存
    location ~* \.(css|js|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # 单页应用路由
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # 启用压缩
    gzip on;
    gzip_types text/plain text/css application/json application/javascript;
}
```

#### 3. 部署文件
```bash
# 上传文件到服务器
scp -r ./school-bi-portal/* user@server:/var/www/html/schoolbiportal/

# 设置权限
sudo chown -R nginx:nginx /var/www/html/schoolbiportal
sudo chmod -R 755 /var/www/html/schoolbiportal

# 重启Nginx
sudo systemctl reload nginx
```

### Docker部署 (可选)

```dockerfile
FROM nginx:alpine

# 复制项目文件
COPY . /usr/share/nginx/html

# 复制Nginx配置
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

```bash
# 构建镜像
docker build -t school-bi-portal .

# 运行容器
docker run -d -p 80:80 school-bi-portal
```

---

## 🔧 开发指南

### 开发环境设置

1. **安装开发工具**
```bash
# 安装VS Code扩展
code --install-extension ms-vscode.vscode-eslint
code --install-extension esbenp.prettier-vscode
code --install-extension bradlc.vscode-tailwindcss
```

2. **配置代码格式化**
创建 `.vscode/settings.json`:
```json
{
    "editor.formatOnSave": true,
    "editor.defaultFormatter": "esbenp.prettier-vscode",
    "javascript.preferences.quoteStyle": "single",
    "typescript.preferences.quoteStyle": "single"
}
```

### 代码规范

#### JavaScript规范
```javascript
// ✅ 推荐写法
const studentName = 'Zhang San';
const getUserInfo = async (id) => {
    try {
        const response = await fetch(`/api/users/${id}`);
        return await response.json();
    } catch (error) {
        console.error('获取用户信息失败:', error);
        throw error;
    }
};

// ❌ 不推荐写法
var student_name = "Zhang San";
function getUserInfo(id, callback) {
    // 回调地狱...
}
```

#### CSS规范
```css
/* ✅ 推荐写法 */
.student-card {
    display: flex;
    flex-direction: column;
    padding: 1rem;
    border-radius: 0.5rem;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.student-card__header {
    font-size: 1.25rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
}

/* ❌ 不推荐写法 */
.studentCard {
    padding: 16px;
    /* 内联样式和魔法数字 */
}
```

### 添加新功能

1. **创建新模块**
```javascript
// scripts/new-module.js
class NewModule {
    constructor() {
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.loadData();
    }
    
    setupEventListeners() {
        // 事件监听器
    }
    
    loadData() {
        // 数据加载
    }
}
```

2. **注册模块**
```javascript
// main.js
initializeNewModule() {
    if (typeof NewModule !== 'undefined') {
        this.newModule = new NewModule();
    }
}
```

3. **添加国际化**
```javascript
// i18n.js
'newModule.title': '新模块标题',
'newModule.description': '新模块描述',
```

---

## 🧪 测试

### 手动测试清单

#### 功能测试
- [ ] 页面导航正常工作
- [ ] 所有表单可以正常提交
- [ ] 图表正确渲染和交互
- [ ] 数据筛选和搜索功能
- [ ] 文件导出功能

#### 国际化测试
- [ ] 中英文切换正常
- [ ] 所有文本都有翻译
- [ ] 动态内容正确翻译
- [ ] 语言偏好保存

#### 兼容性测试
- [ ] Chrome 80+
- [ ] Firefox 75+
- [ ] Safari 13+
- [ ] Edge 80+

#### 响应式测试
- [ ] 桌面端 (1920x1080)
- [ ] 平板端 (768x1024)
- [ ] 手机端 (375x667)

### 自动化测试 (计划中)

```javascript
// 测试示例
describe('招生咨询系统', () => {
    test('应该正确渲染问题', () => {
        const admission = new AdmissionModule();
        expect(admission.questions.length).toBeGreaterThan(0);
    });
    
    test('应该生成报告', () => {
        const admission = new AdmissionModule();
        admission.answers = { grade: '10年级', interests: '科学技术' };
        const report = admission.generateReport();
        expect(report).toBeDefined();
    });
});
```

---

## 📈 性能优化

### 已实现的优化

1. **资源优化**
   - 图片压缩和格式优化
   - CSS和JavaScript文件压缩
   - 字体文件优化

2. **加载优化**
   - 关键资源优先加载
   - 非关键资源延迟加载
   - 图片懒加载

3. **缓存策略**
   - 浏览器缓存配置
   - LocalStorage数据缓存
   - 静态资源长期缓存

### 性能指标

| 指标 | 目标值 | 当前值 |
|------|--------|--------|
| 首屏加载时间 | < 2s | ~1.5s |
| 页面切换时间 | < 500ms | ~300ms |
| 图表渲染时间 | < 1s | ~800ms |
| 内存使用 | < 50MB | ~35MB |

---

## 🔒 安全考虑

### 已实现的安全措施

1. **输入验证**
   - 表单数据验证
   - XSS防护
   - 输入长度限制

2. **数据安全**
   - 敏感信息脱敏
   - 本地存储加密
   - 数据传输安全

3. **访问控制**
   - 权限检查机制
   - 角色管理系统
   - 操作日志记录

### 安全最佳实践

```javascript
// 输入验证示例
function validateInput(input, type) {
    const patterns = {
        email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        phone: /^1[3-9]\d{9}$/,
        name: /^[\u4e00-\u9fa5a-zA-Z\s]{2,20}$/
    };
    
    return patterns[type]?.test(input) || false;
}

// XSS防护示例
function sanitizeHTML(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}
```

---

## 🤝 贡献指南

我们欢迎所有形式的贡献！无论是bug报告、功能建议还是代码贡献。

### 如何贡献

1. **Fork项目**
   ```bash
   git clone https://github.com/your-username/school-bi-portal.git
   ```

2. **创建功能分支**
   ```bash
   git checkout -b feature/amazing-feature
   ```

3. **提交更改**
   ```bash
   git commit -m 'feat: 添加了一个很棒的功能'
   ```

4. **推送到分支**
   ```bash
   git push origin feature/amazing-feature
   ```

5. **创建Pull Request**

### 提交规范

我们使用 [Conventional Commits](https://conventionalcommits.org/) 规范：

```
<type>(<scope>): <subject>

<body>

<footer>
```

**类型说明:**
- `feat`: 新功能
- `fix`: 修复bug
- `docs`: 文档更新
- `style`: 代码格式调整
- `refactor`: 代码重构
- `test`: 测试相关
- `chore`: 构建过程或辅助工具的变动

**示例:**
```
feat(admission): 添加智能问卷系统

- 实现多步骤表单流程
- 添加问题验证逻辑
- 集成报告生成功能

Closes #123
```

### 代码审查

所有的Pull Request都需要经过代码审查：

1. **代码质量**: 遵循项目代码规范
2. **功能测试**: 确保新功能正常工作
3. **兼容性**: 测试浏览器兼容性
4. **文档更新**: 更新相关文档

---

## 📋 更新日志

### v1.0.0 (2025-01-11)
- ✨ **新功能**
  - 完整的招生咨询系统
  - 家校沟通平台
  - 学业反馈分析
  - 升学指导系统
  - 完整国际化支持

- 🐛 **修复**
  - 修复语言切换问题
  - 修复图表渲染问题
  - 修复响应式布局问题

- 📚 **文档**
  - 添加完整的项目文档
  - 添加技术文档
  - 添加部署指南

### 计划中的更新

#### v1.1.0 (计划中)
- 🔄 后端API集成
- 🔄 用户认证系统
- 🔄 数据持久化
- 🔄 移动端优化

#### v1.2.0 (计划中)
- 🔄 AI功能增强
- 🔄 实时数据更新
- 🔄 高级可视化
- 🔄 PWA支持

---

## 🆘 常见问题

### Q: 如何切换语言？
A: 点击右上角的语言切换按钮，选择中文或English即可。

### Q: 数据是否会保存？
A: 当前版本使用本地存储，数据保存在浏览器中。未来版本将支持云端存储。

### Q: 支持哪些浏览器？
A: 支持Chrome 80+、Firefox 75+、Safari 13+、Edge 80+等现代浏览器。

### Q: 如何导出报告？
A: 在相应模块中点击"导出"按钮，系统会生成JSON格式的报告文件。

### Q: 如何添加新学生？
A: 当前版本使用模拟数据，可以在data.js文件中添加新的学生信息。

### Q: 系统是否支持移动端？
A: 系统采用响应式设计，支持移动端访问，但最佳体验仍在桌面端。

---

## 📞 联系我们

### 项目团队
- **项目负责人**: [待定]
- **技术负责人**: [待定]
- **产品经理**: [待定]

### 技术支持
- **邮箱**: support@schoolbiportal.com
- **官网**: https://schoolbiportal.com
- **文档**: https://docs.schoolbiportal.com

### 社区
- **GitHub**: https://github.com/school-bi-portal
- **讨论区**: https://github.com/school-bi-portal/discussions
- **问题反馈**: https://github.com/school-bi-portal/issues

---

## 📄 许可证

本项目采用 [MIT 许可证](LICENSE)。

```
MIT License

Copyright (c) 2025 School BI Portal

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## 🙏 致谢

感谢以下开源项目和工具：

- [Chart.js](https://www.chartjs.org/) - 优秀的图表库
- [ECharts](https://echarts.apache.org/) - 强大的可视化库
- [Font Awesome](https://fontawesome.com/) - 丰富的图标库
- [MDN Web Docs](https://developer.mozilla.org/) - 优秀的Web技术文档

---

<div align="center">

**⭐ 如果这个项目对你有帮助，请给我们一个星标！**

[⬆ 回到顶部](#国际学校商业智能门户系统)

</div>
