# HD Schools 智能门户系统 - 部署指南
# Deployment Guide for HD Schools Business Intelligence Portal

## 🎯 部署目标 / Deployment Target
- **目标服务器**: http://inspire.long-arena.com/schoolbiportal
- **Target Server**: http://inspire.long-arena.com/schoolbiportal

## 📦 部署文件 / Deployment Files

### ✅ 已准备的部署包 / Ready Deployment Package
- **压缩包**: `schoolbiportal_deploy_20250711_162124.tar.gz` (59KB)
- **临时目录**: `temp_deploy_20250711_162124/`

### 📁 包含文件 / Included Files
```
├── index.html              (21KB) - 主页面文件
├── README.md               (19KB) - 中文说明文档  
├── README_EN.md            (19KB) - 英文说明文档
├── styles/
│   └── main.css            - HD Schools 样式文件
└── scripts/
    ├── main.js             - 主应用逻辑
    ├── i18n.js             - 国际化系统
    ├── admission.js        - 招生咨询模块
    ├── communication.js    - 家校沟通模块
    ├── academic.js         - 学业反馈模块
    ├── guidance.js         - 升学指导模块
    └── data.js             - 数据管理
```

## 🚀 部署步骤 / Deployment Steps

### 方法1: FTP上传 / Method 1: FTP Upload
1. **连接FTP服务器**
   ```
   服务器: inspire.long-arena.com
   目录: /schoolbiportal/
   ```

2. **上传文件**
   - 解压 `schoolbiportal_deploy_20250711_162124.tar.gz`
   - 上传所有文件到 `/schoolbiportal/` 目录
   - 保持目录结构不变

3. **设置权限**
   ```bash
   chmod 644 *.html *.md
   chmod 644 styles/*.css
   chmod 644 scripts/*.js
   chmod 755 styles/ scripts/
   ```

### 方法2: SSH上传 / Method 2: SSH Upload
如果有SSH访问权限：
```bash
# 上传压缩包
scp schoolbiportal_deploy_20250711_162124.tar.gz user@inspire.long-arena.com:/tmp/

# 登录服务器
ssh user@inspire.long-arena.com

# 解压到目标目录
cd /path/to/schoolbiportal/
tar -xzf /tmp/schoolbiportal_deploy_20250711_162124.tar.gz

# 设置权限
chmod -R 644 *
chmod 755 styles/ scripts/
```

### 方法3: rsync同步 / Method 3: rsync Sync
```bash
rsync -avz temp_deploy_20250711_162124/ user@inspire.long-arena.com:/path/to/schoolbiportal/
```

## 🔧 更新内容 / Update Contents

### ✅ 已修复的问题 / Fixed Issues
1. **Logo和Dashboard布局问题** - 完美解决
2. **主题字白色显示不清** - 深蓝色清晰可见  
3. **语言选择按钮显示** - 当前语言正确显示
4. **语言切换按钮颜色** - 白色文字清晰可见

### 🎨 HD Schools 品牌设计 / Brand Design
- **配色方案**: 深蓝(#2B3A67) + 金黄(#F4C430) + 橙红(#FF6B35)
- **Logo设计**: 盾牌图标 + "HD SCHOOLS" + 双语副标题
- **国际化**: 完整的中英文双语支持
- **响应式**: 适配各种屏幕尺寸

### 🌟 新增功能 / New Features
- **语言切换**: 地球图标下拉菜单，支持中文/English
- **校区选择**: 支持上海/北京/宁波三校区
- **品牌配色**: 图表和界面使用HD Schools配色
- **交互优化**: 悬停效果和状态反馈

## 🧪 测试验证 / Testing & Verification

### 部署后测试清单 / Post-Deployment Checklist
- [ ] 访问 http://inspire.long-arena.com/schoolbiportal
- [ ] 检查Logo和导航条布局是否正确
- [ ] 测试语言切换功能（中文 ⇄ English）
- [ ] 验证页面标题颜色是否清晰可见
- [ ] 测试校区选择器功能
- [ ] 检查所有模块页面是否正常加载
- [ ] 验证图表配色是否使用HD Schools配色
- [ ] 测试响应式设计（移动端/桌面端）

### 预期效果 / Expected Results
- **中文界面**: "智慧校园数据概览" (深蓝色标题)
- **英文界面**: "Smart Campus Data Overview" (深蓝色标题)
- **语言按钮**: 显示"中文"或"English"，白色文字
- **悬停效果**: 金黄色(#F4C430)反馈
- **图表配色**: 金黄、橙红、深蓝三色搭配

## 🆘 故障排除 / Troubleshooting

### 常见问题 / Common Issues
1. **文件权限错误**
   ```bash
   chmod 644 *.html *.css *.js
   chmod 755 styles/ scripts/
   ```

2. **缓存问题**
   - 清除浏览器缓存
   - 强制刷新 (Ctrl+F5 / Cmd+Shift+R)

3. **文件路径错误**
   - 确保目录结构正确
   - 检查相对路径引用

4. **字符编码问题**
   - 确保文件以UTF-8编码保存

## 📞 联系支持 / Support Contact

如果部署过程中遇到问题，请提供以下信息：
- 错误信息截图
- 浏览器控制台日志
- 服务器错误日志

## 🎉 部署完成 / Deployment Complete

部署成功后，您将看到：
- 专业的HD Schools品牌形象
- 清晰的导航和布局
- 流畅的双语切换体验
- 完整的商业智能功能模块

**访问地址**: http://inspire.long-arena.com/schoolbiportal
