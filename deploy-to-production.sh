#!/bin/bash

# 部署配置
SERVER_IP="47.101.20.14"
SERVER_USER="root"
SERVER_PASSWORD="Longarena@2025"
REMOTE_PATH="/var/www/html/schoolbiportal"
LOCAL_BUILD_PATH="hd-schools-vue/dist"

echo "开始部署到生产服务器..."

# 检查本地构建文件是否存在
if [ ! -d "$LOCAL_BUILD_PATH" ]; then
    echo "错误: 构建文件夹不存在，请先运行 npm run build"
    exit 1
fi

# 创建临时部署包
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
DEPLOY_PACKAGE="vue-build-${TIMESTAMP}.tar.gz"

echo "创建部署包: $DEPLOY_PACKAGE"
cd hd-schools-vue
tar -czf "../$DEPLOY_PACKAGE" -C dist .
cd ..

# 使用sshpass进行自动化部署
echo "上传文件到服务器..."
sshpass -p "$SERVER_PASSWORD" scp "$DEPLOY_PACKAGE" "$SERVER_USER@$SERVER_IP:/tmp/"

echo "在服务器上解压并部署..."
sshpass -p "$SERVER_PASSWORD" ssh "$SERVER_USER@$SERVER_IP" << EOF
    # 创建目标目录
    mkdir -p $REMOTE_PATH
    
    # 备份现有文件（如果存在）
    if [ -d "$REMOTE_PATH" ] && [ "\$(ls -A $REMOTE_PATH)" ]; then
        echo "备份现有文件..."
        mv $REMOTE_PATH ${REMOTE_PATH}_backup_${TIMESTAMP}
        mkdir -p $REMOTE_PATH
    fi
    
    # 解压新文件
    echo "解压新文件到 $REMOTE_PATH"
    cd $REMOTE_PATH
    tar -xzf /tmp/$DEPLOY_PACKAGE
    
    # 设置正确的权限
    chown -R www-data:www-data $REMOTE_PATH
    chmod -R 755 $REMOTE_PATH
    
    # 清理临时文件
    rm /tmp/$DEPLOY_PACKAGE
    
    echo "部署完成！"
    echo "网站地址: http://inspire.long-arena.com/schoolbiportal/"
EOF

# 清理本地临时文件
rm "$DEPLOY_PACKAGE"

echo "部署完成！"
echo "访问地址: http://inspire.long-arena.com/schoolbiportal/"
