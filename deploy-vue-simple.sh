#!/bin/bash

# 简化的Vue部署脚本
echo "开始部署Vue版本到服务器..."

# 服务器配置
SERVER_HOST="inspire.long-arena.com"
SERVER_USER="root"
SERVER_PATH="/var/www/html/schoolbiportal"
LOCAL_DIST_PATH="./hd-schools-vue/dist"

# 检查构建文件是否存在
if [ ! -d "$LOCAL_DIST_PATH" ]; then
    echo "错误: 构建目录不存在，请先运行 npm run build"
    exit 1
fi

echo "正在上传Vue构建文件..."

# 使用scp上传文件
scp -r "$LOCAL_DIST_PATH"/* "$SERVER_USER@$SERVER_HOST:$SERVER_PATH/"

if [ $? -eq 0 ]; then
    echo "✅ Vue版本部署成功！"
    echo "🌐 访问地址: https://$SERVER_HOST/schoolbiportal/"
else
    echo "❌ 部署失败"
    exit 1
fi

echo "部署完成！"
