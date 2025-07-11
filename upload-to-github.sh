#!/bin/bash

# 国际学校商业智能门户系统 - GitHub上传脚本
# International School Business Intelligence Portal - GitHub Upload Script

echo "🚀 开始上传项目到GitHub..."
echo "🚀 Starting to upload project to GitHub..."

# 检查是否已经是Git仓库
if [ ! -d ".git" ]; then
    echo "📦 初始化Git仓库..."
    echo "📦 Initializing Git repository..."
    git init
fi

# 添加远程仓库
echo "🔗 添加远程仓库..."
echo "🔗 Adding remote repository..."
git remote add origin https://github.com/wukeping2008/school-businessintelligence.git

# 创建.gitignore文件
echo "📝 创建.gitignore文件..."
echo "📝 Creating .gitignore file..."
cat > .gitignore << EOF
# 依赖文件
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# 构建输出
dist/
build/
.tmp/

# 环境变量
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# 编辑器配置
.vscode/
.idea/
*.swp
*.swo
*~

# 操作系统文件
.DS_Store
Thumbs.db

# 日志文件
*.log
logs/

# 临时文件
*.tmp
*.temp

# 备份文件
*.backup
*.bak

# 缓存文件
.cache/
.parcel-cache/

# 测试覆盖率
coverage/
.nyc_output/

# 运行时文件
*.pid
*.seed
*.pid.lock

# 可选的npm缓存目录
.npm

# 可选的eslint缓存
.eslintcache

# 可选的REPL历史
.node_repl_history

# 输出的npm包
*.tgz

# Yarn完整性文件
.yarn-integrity

# dotenv环境变量文件
.env

# parcel-bundler缓存
.cache
.parcel-cache

# next.js构建输出
.next

# nuxt.js构建输出
.nuxt

# vuepress构建输出
.vuepress/dist

# Serverless目录
.serverless

# FuseBox缓存
.fusebox/

# DynamoDB本地文件
.dynamodb/
EOF

# 添加所有文件
echo "📁 添加项目文件..."
echo "📁 Adding project files..."
git add .

# 提交更改
echo "💾 提交初始版本..."
echo "💾 Committing initial version..."
git commit -m "feat: initial commit - International School Business Intelligence Portal

✨ Features:
- Complete admission consultation system with intelligent questionnaire
- School-home communication platform with timeline and sharing
- Academic feedback analysis with AI reports and visualizations
- College guidance system with 3D pathway charts and milestone tracking
- Full internationalization support (Chinese/English)
- Responsive design for all devices
- Modern frontend architecture with modular JavaScript

🛠 Tech Stack:
- HTML5, CSS3, JavaScript ES6+
- Chart.js for 2D charts
- ECharts for 3D visualizations
- Font Awesome for icons
- Custom i18n system

📚 Documentation:
- Complete project roadmap and technical documentation
- Bilingual README (Chinese/English)
- Deployment guides and development standards

🌐 Live Demo: http://inspire.long-arena.com/schoolbiportal"

# 设置主分支
echo "🌿 设置主分支..."
echo "🌿 Setting main branch..."
git branch -M main

# 推送到GitHub
echo "⬆️ 推送到GitHub..."
echo "⬆️ Pushing to GitHub..."
git push -u origin main

echo ""
echo "🎉 项目已成功上传到GitHub！"
echo "🎉 Project successfully uploaded to GitHub!"
echo ""
echo "📍 仓库地址 / Repository URL:"
echo "   https://github.com/wukeping2008/school-businessintelligence"
echo ""
echo "🌐 在线演示 / Live Demo:"
echo "   http://inspire.long-arena.com/schoolbiportal"
echo ""
echo "📚 下一步建议 / Next Steps:"
echo "   1. 在GitHub上添加项目描述和标签"
echo "   1. Add project description and tags on GitHub"
echo "   2. 设置GitHub Pages（可选）"
echo "   2. Set up GitHub Pages (optional)"
echo "   3. 创建Issues和Projects进行项目管理"
echo "   3. Create Issues and Projects for project management"
echo "   4. 邀请团队成员协作"
echo "   4. Invite team members to collaborate"
echo ""
