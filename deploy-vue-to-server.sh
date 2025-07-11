#!/bin/bash

# Vue版本部署脚本
# 将构建好的Vue项目部署到服务器的schoolbiportal目录

echo "开始部署Vue版本到服务器..."

# 服务器配置
SERVER_HOST="inspire.long-arena.com"
SERVER_USER="root"
SERVER_PATH="/var/www/html/schoolbiportal"
LOCAL_DIST_PATH="./hd-schools-vue/dist"
SSH_KEY="./inspire.long-arena.com.key"

# 检查构建文件是否存在
if [ ! -d "$LOCAL_DIST_PATH" ]; then
    echo "错误: 构建目录不存在，请先运行 npm run build"
    exit 1
fi

# 检查SSH密钥是否存在
if [ ! -f "$SSH_KEY" ]; then
    echo "错误: SSH密钥文件不存在"
    exit 1
fi

# 设置SSH密钥权限
chmod 600 "$SSH_KEY"

echo "正在连接服务器并备份现有文件..."

# 在服务器上创建备份
ssh -i "$SSH_KEY" "$SERVER_USER@$SERVER_HOST" "
    if [ -d '$SERVER_PATH' ]; then
        echo '备份现有文件...'
        cp -r '$SERVER_PATH' '${SERVER_PATH}_backup_$(date +%Y%m%d_%H%M%S)'
    else
        echo '创建目标目录...'
        mkdir -p '$SERVER_PATH'
    fi
"

if [ $? -ne 0 ]; then
    echo "错误: 无法连接到服务器或创建备份"
    exit 1
fi

echo "正在上传Vue构建文件..."

# 使用rsync上传文件
rsync -avz --delete -e "ssh -i $SSH_KEY" "$LOCAL_DIST_PATH/" "$SERVER_USER@$SERVER_HOST:$SERVER_PATH/"

if [ $? -eq 0 ]; then
    echo "✅ Vue版本部署成功！"
    echo "🌐 访问地址: https://$SERVER_HOST/schoolbiportal/"
    
    # 验证部署
    echo "正在验证部署..."
    response=$(curl -s -o /dev/null -w "%{http_code}" "https://$SERVER_HOST/schoolbiportal/")
    if [ "$response" = "200" ]; then
        echo "✅ 部署验证成功，网站可正常访问"
    else
        echo "⚠️  部署完成但验证失败，HTTP状态码: $response"
    fi
else
    echo "❌ 部署失败"
    exit 1
fi

echo "部署完成！"
