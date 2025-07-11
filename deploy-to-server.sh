#!/bin/bash

# HD Schools 智能门户系统 - 服务器部署脚本
# Deploy to http://inspire.long-arena.com/schoolbiportal

echo "🚀 开始部署到 inspire.long-arena.com 服务器..."
echo "🚀 Starting deployment to inspire.long-arena.com server..."

# 检查必要文件
echo "📋 检查项目文件..."
echo "📋 Checking project files..."

if [ ! -f "index.html" ]; then
    echo "❌ 错误：找不到 index.html 文件"
    echo "❌ Error: index.html file not found"
    exit 1
fi

if [ ! -d "styles" ] || [ ! -d "scripts" ]; then
    echo "❌ 错误：找不到 styles 或 scripts 目录"
    echo "❌ Error: styles or scripts directory not found"
    exit 1
fi

echo "✅ 项目文件检查完成"
echo "✅ Project files check completed"

# 创建部署包
echo "📦 创建部署包..."
echo "📦 Creating deployment package..."

# 创建临时目录
TEMP_DIR="temp_deploy_$(date +%Y%m%d_%H%M%S)"
mkdir -p "$TEMP_DIR"

# 复制所有必要文件
cp index.html "$TEMP_DIR/"
cp -r styles "$TEMP_DIR/"
cp -r scripts "$TEMP_DIR/"

# 复制文档文件（可选）
if [ -f "README.md" ]; then
    cp README.md "$TEMP_DIR/"
fi

if [ -f "README_EN.md" ]; then
    cp README_EN.md "$TEMP_DIR/"
fi

echo "✅ 部署包创建完成"
echo "✅ Deployment package created"

# 显示部署包内容
echo "📁 部署包内容："
echo "📁 Deployment package contents:"
ls -la "$TEMP_DIR"

echo ""
echo "🌐 准备上传到服务器..."
echo "🌐 Ready to upload to server..."
echo ""
echo "📝 请手动执行以下步骤："
echo "📝 Please manually execute the following steps:"
echo ""
echo "1. 使用FTP客户端连接到 inspire.long-arena.com"
echo "   Use FTP client to connect to inspire.long-arena.com"
echo ""
echo "2. 导航到 schoolbiportal 目录"
echo "   Navigate to schoolbiportal directory"
echo ""
echo "3. 上传 $TEMP_DIR 目录中的所有文件"
echo "   Upload all files from $TEMP_DIR directory"
echo ""
echo "4. 确保文件权限正确设置"
echo "   Ensure file permissions are set correctly"
echo ""
echo "📂 部署文件位置: $(pwd)/$TEMP_DIR"
echo "📂 Deployment files location: $(pwd)/$TEMP_DIR"
echo ""

# 如果有rsync或scp，可以尝试自动上传（需要服务器信息）
echo "💡 提示：如果您有服务器SSH访问权限，可以使用以下命令："
echo "💡 Tip: If you have SSH access to the server, you can use:"
echo ""
echo "rsync -avz $TEMP_DIR/ user@inspire.long-arena.com:/path/to/schoolbiportal/"
echo "或者 / or"
echo "scp -r $TEMP_DIR/* user@inspire.long-arena.com:/path/to/schoolbiportal/"
echo ""

# 创建压缩包便于下载
echo "📦 创建压缩包..."
echo "📦 Creating archive..."

tar -czf "schoolbiportal_deploy_$(date +%Y%m%d_%H%M%S).tar.gz" -C "$TEMP_DIR" .

echo "✅ 压缩包创建完成: schoolbiportal_deploy_*.tar.gz"
echo "✅ Archive created: schoolbiportal_deploy_*.tar.gz"

echo ""
echo "🎉 部署准备完成！"
echo "🎉 Deployment preparation completed!"
echo ""
echo "📋 下一步："
echo "📋 Next steps:"
echo "1. 下载压缩包或使用 $TEMP_DIR 目录中的文件"
echo "2. 上传到 inspire.long-arena.com 服务器的 schoolbiportal 目录"
echo "3. 访问 http://inspire.long-arena.com/schoolbiportal 验证更新"
echo ""

# 保持临时目录，用户可以手动清理
echo "🗑️  完成后可以删除临时文件："
echo "🗑️  After completion, you can delete temporary files:"
echo "rm -rf $TEMP_DIR"
echo "rm schoolbiportal_deploy_*.tar.gz"
