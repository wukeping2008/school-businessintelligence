// 家校沟通模块
class CommunicationModule {
    constructor() {
        this.interactions = [...mockData.interactions]; // 复制数据避免修改原始数据
        this.currentFilter = 'all';
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.renderTimeline();
    }

    setupEventListeners() {
        // 表单提交事件
        const form = document.getElementById('interactionForm');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleFormSubmit(e);
            });
        }

        // 筛选标签事件
        const filterTabs = document.querySelectorAll('.filter-tab');
        filterTabs.forEach(tab => {
            tab.addEventListener('click', (e) => {
                this.handleFilterChange(e.target.getAttribute('data-filter'));
            });
        });
    }

    // 处理表单提交
    handleFormSubmit(e) {
        const formData = new FormData(e.target);
        const student = document.getElementById('studentSelect').value;
        const type = document.getElementById('interactionType').value;
        const content = document.getElementById('interactionContent').value;
        const teacher = document.getElementById('teacherName').value;

        // 验证表单数据
        if (!student || !type || !content.trim() || !teacher.trim()) {
            if (window.app) {
                window.app.showNotification('请填写所有必填字段', 'error');
            }
            return;
        }

        // 创建新的互动记录
        const newInteraction = {
            id: this.generateId(),
            student: student,
            teacher: teacher.trim(),
            type: type,
            content: content.trim(),
            date: new Date().toISOString().split('T')[0],
            time: new Date().toTimeString().split(' ')[0].substring(0, 5),
            subject: this.getSubjectByType(type)
        };

        // 添加到数据中
        this.interactions.unshift(newInteraction);

        // 保存到本地存储
        this.saveInteractions();

        // 重新渲染时间线
        this.renderTimeline();

        // 清空表单
        e.target.reset();

        // 显示成功通知
        if (window.app) {
            window.app.showNotification('互动记录保存成功！', 'success');
        }
    }

    // 根据类型获取学科
    getSubjectByType(type) {
        const subjectMap = {
            '学习表现': '综合',
            '课堂互动': '课堂',
            '课外活动': '活动',
            '品格表现': '品格',
            '创意表达': '创意'
        };
        return subjectMap[type] || '其他';
    }

    // 处理筛选变化
    handleFilterChange(filter) {
        this.currentFilter = filter;
        
        // 更新筛选标签状态
        const filterTabs = document.querySelectorAll('.filter-tab');
        filterTabs.forEach(tab => {
            tab.classList.remove('active');
            if (tab.getAttribute('data-filter') === filter) {
                tab.classList.add('active');
            }
        });

        // 重新渲染时间线
        this.renderTimeline();
    }

    // 渲染时间线
    renderTimeline() {
        const timeline = document.getElementById('interactionTimeline');
        if (!timeline) return;

        // 筛选数据
        let filteredInteractions = this.interactions;
        if (this.currentFilter !== 'all') {
            filteredInteractions = this.interactions.filter(interaction => 
                interaction.type === this.currentFilter
            );
        }

        // 按日期排序（最新的在前）
        filteredInteractions.sort((a, b) => {
            const dateA = new Date(a.date + ' ' + a.time);
            const dateB = new Date(b.date + ' ' + b.time);
            return dateB - dateA;
        });

        // 生成时间线HTML
        if (filteredInteractions.length === 0) {
            const noRecordsText = window.i18n ? window.i18n.t('communication.noRecords') : `暂无${this.currentFilter === 'all' ? '' : this.currentFilter}记录`;
            const startRecordingText = window.i18n ? window.i18n.t('communication.startRecording') : '开始记录学生的精彩瞬间吧！';
            
            timeline.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-comments" style="font-size: 48px; color: #ccc; margin-bottom: 15px;"></i>
                    <p>${noRecordsText}</p>
                    <p style="color: #999; font-size: 14px;">${startRecordingText}</p>
                </div>
            `;
            return;
        }

        const timelineHTML = filteredInteractions.map(interaction => {
            const avatar = this.getStudentAvatar(interaction.student);
            const timeAgo = this.getTimeAgo(interaction.date, interaction.time);
            
            return `
                <div class="timeline-item" data-interaction-id="${interaction.id}">
                    <div class="timeline-avatar">${avatar}</div>
                    <div class="timeline-content">
                        <div class="timeline-header">
                            <span class="timeline-student">${interaction.student}</span>
                            <span class="timeline-type">${interaction.type}</span>
                        </div>
                        <div class="timeline-text">${interaction.content}</div>
                        <div class="timeline-footer">
                            <span class="timeline-teacher">
                                <i class="fas fa-user-tie"></i> ${interaction.teacher}
                            </span>
                            <span class="timeline-time">
                                <i class="fas fa-clock"></i> ${timeAgo}
                            </span>
                        </div>
                        <div class="timeline-actions">
                            <button class="action-btn" onclick="shareInteraction('${interaction.id}')" title="分享给家长">
                                <i class="fas fa-share"></i>
                            </button>
                            <button class="action-btn" onclick="editInteraction('${interaction.id}')" title="编辑">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="action-btn delete-btn" onclick="deleteInteraction('${interaction.id}')" title="删除">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                </div>
            `;
        }).join('');

        timeline.innerHTML = timelineHTML;
    }

    // 获取学生头像
    getStudentAvatar(studentName) {
        // 使用学生姓名的第一个字符作为头像
        return studentName.charAt(0);
    }

    // 获取相对时间
    getTimeAgo(date, time) {
        const interactionDate = new Date(date + ' ' + time);
        const now = new Date();
        const diffMs = now - interactionDate;
        const diffMins = Math.floor(diffMs / (1000 * 60));
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

        if (diffMins < 1) {
            return '刚刚';
        } else if (diffMins < 60) {
            return `${diffMins}分钟前`;
        } else if (diffHours < 24) {
            return `${diffHours}小时前`;
        } else if (diffDays < 7) {
            return `${diffDays}天前`;
        } else {
            return `${date} ${time}`;
        }
    }

    // 分享互动记录给家长
    shareInteraction(interactionId) {
        const interaction = this.interactions.find(item => item.id == interactionId);
        if (!interaction) return;

        // 生成分享内容
        const shareContent = this.generateShareContent(interaction);
        
        // 模拟发送给家长（实际应用中会调用API）
        this.simulateShareToParent(shareContent);
        
        if (window.app) {
            window.app.showNotification(`已将${interaction.student}的互动记录分享给家长`, 'success');
        }
    }

    // 生成分享内容
    generateShareContent(interaction) {
        const date = new Date(interaction.date).toLocaleDateString('zh-CN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        return `
【${interaction.student}的校园生活分享】

📅 时间：${date} ${interaction.time}
👨‍🏫 老师：${interaction.teacher}
📚 类型：${interaction.type}

💝 温馨瞬间：
${interaction.content}

---
来自智慧校园系统的自动分享
        `.trim();
    }

    // 模拟发送给家长
    simulateShareToParent(content) {
        // 在实际应用中，这里会调用API发送消息给家长
        console.log('发送给家长的内容：', content);
        
        // 可以集成微信、短信、邮件等多种通知方式
        // 这里只是模拟存储到本地
        const shares = JSON.parse(localStorage.getItem('parentShares') || '[]');
        shares.unshift({
            id: this.generateId(),
            content: content,
            timestamp: new Date().toISOString(),
            status: 'sent'
        });
        localStorage.setItem('parentShares', JSON.stringify(shares));
    }

    // 编辑互动记录
    editInteraction(interactionId) {
        const interaction = this.interactions.find(item => item.id == interactionId);
        if (!interaction) return;

        // 填充表单
        document.getElementById('studentSelect').value = interaction.student;
        document.getElementById('interactionType').value = interaction.type;
        document.getElementById('interactionContent').value = interaction.content;
        document.getElementById('teacherName').value = interaction.teacher;

        // 删除原记录（编辑时会重新添加）
        this.deleteInteraction(interactionId, false);

        // 滚动到表单
        document.querySelector('.quick-record').scrollIntoView({ behavior: 'smooth' });

        if (window.app) {
            window.app.showNotification('记录已加载到编辑表单', 'info');
        }
    }

    // 删除互动记录
    deleteInteraction(interactionId, showConfirm = true) {
        if (showConfirm && !confirm('确定要删除这条记录吗？')) {
            return;
        }

        const index = this.interactions.findIndex(item => item.id == interactionId);
        if (index > -1) {
            this.interactions.splice(index, 1);
            this.saveInteractions();
            this.renderTimeline();
            
            if (showConfirm && window.app) {
                window.app.showNotification('记录已删除', 'success');
            }
        }
    }

    // 批量操作
    bulkShareToday() {
        const today = new Date().toISOString().split('T')[0];
        const todayInteractions = this.interactions.filter(interaction => 
            interaction.date === today
        );

        if (todayInteractions.length === 0) {
            if (window.app) {
                window.app.showNotification('今天还没有互动记录', 'info');
            }
            return;
        }

        // 按学生分组
        const groupedByStudent = {};
        todayInteractions.forEach(interaction => {
            if (!groupedByStudent[interaction.student]) {
                groupedByStudent[interaction.student] = [];
            }
            groupedByStudent[interaction.student].push(interaction);
        });

        // 为每个学生生成汇总分享
        Object.keys(groupedByStudent).forEach(student => {
            const interactions = groupedByStudent[student];
            const summaryContent = this.generateDailySummary(student, interactions);
            this.simulateShareToParent(summaryContent);
        });

        if (window.app) {
            window.app.showNotification(`已将今日${Object.keys(groupedByStudent).length}位学生的互动记录分享给家长`, 'success');
        }
    }

    // 生成每日汇总
    generateDailySummary(student, interactions) {
        const date = new Date().toLocaleDateString('zh-CN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        let content = `【${student}的今日校园生活汇总】\n\n📅 日期：${date}\n\n`;
        
        interactions.forEach((interaction, index) => {
            content += `${index + 1}. ${interaction.type} (${interaction.time})\n`;
            content += `   👨‍🏫 ${interaction.teacher}老师：${interaction.content}\n\n`;
        });

        content += `💝 今天${student}共有${interactions.length}个精彩瞬间被记录\n`;
        content += `---\n来自智慧校园系统的每日汇总`;

        return content;
    }

    // 导出互动记录
    exportInteractions() {
        const data = {
            exportDate: new Date().toISOString(),
            totalRecords: this.interactions.length,
            interactions: this.interactions
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { 
            type: 'application/json;charset=utf-8' 
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `家校互动记录_${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        if (window.app) {
            window.app.showNotification('互动记录导出成功！', 'success');
        }
    }

    // 生成统计报告
    generateStatistics() {
        const stats = {
            totalInteractions: this.interactions.length,
            byType: {},
            byStudent: {},
            byTeacher: {},
            byDate: {},
            recentTrend: []
        };

        // 按类型统计
        this.interactions.forEach(interaction => {
            stats.byType[interaction.type] = (stats.byType[interaction.type] || 0) + 1;
            stats.byStudent[interaction.student] = (stats.byStudent[interaction.student] || 0) + 1;
            stats.byTeacher[interaction.teacher] = (stats.byTeacher[interaction.teacher] || 0) + 1;
            stats.byDate[interaction.date] = (stats.byDate[interaction.date] || 0) + 1;
        });

        // 最近7天趋势
        const last7Days = [];
        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];
            last7Days.push({
                date: dateStr,
                count: stats.byDate[dateStr] || 0
            });
        }
        stats.recentTrend = last7Days;

        return stats;
    }

    // 显示统计信息
    showStatistics() {
        const stats = this.generateStatistics();
        
        const modal = document.createElement('div');
        modal.className = 'statistics-modal';
        modal.innerHTML = `
            <div class="modal-overlay" onclick="this.parentElement.remove()"></div>
            <div class="modal-content">
                <div class="modal-header">
                    <h3>互动记录统计</h3>
                    <button class="modal-close" onclick="this.closest('.statistics-modal').remove()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="stats-grid">
                        <div class="stat-card">
                            <h4>总记录数</h4>
                            <div class="stat-number">${stats.totalInteractions}</div>
                        </div>
                        <div class="stat-card">
                            <h4>活跃学生</h4>
                            <div class="stat-number">${Object.keys(stats.byStudent).length}</div>
                        </div>
                        <div class="stat-card">
                            <h4>参与老师</h4>
                            <div class="stat-number">${Object.keys(stats.byTeacher).length}</div>
                        </div>
                        <div class="stat-card">
                            <h4>记录天数</h4>
                            <div class="stat-number">${Object.keys(stats.byDate).length}</div>
                        </div>
                    </div>
                    
                    <div class="stats-section">
                        <h4>互动类型分布</h4>
                        <div class="type-stats">
                            ${Object.entries(stats.byType).map(([type, count]) => `
                                <div class="type-stat-item">
                                    <span class="type-name">${type}</span>
                                    <span class="type-count">${count}次</span>
                                    <div class="type-bar">
                                        <div class="type-bar-fill" style="width: ${(count / stats.totalInteractions * 100)}%"></div>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                    
                    <div class="stats-section">
                        <h4>最近7天趋势</h4>
                        <div class="trend-chart">
                            ${stats.recentTrend.map(day => `
                                <div class="trend-day">
                                    <div class="trend-bar" style="height: ${Math.max(day.count * 20, 5)}px"></div>
                                    <div class="trend-label">${new Date(day.date).getDate()}日</div>
                                    <div class="trend-count">${day.count}</div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
            </div>
        `;

        // 添加模态框样式
        if (!document.querySelector('#statistics-modal-styles')) {
            const styles = document.createElement('style');
            styles.id = 'statistics-modal-styles';
            styles.textContent = `
                .statistics-modal {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    z-index: 10000;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .modal-overlay {
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0,0,0,0.5);
                }
                .modal-content {
                    background: white;
                    border-radius: 15px;
                    max-width: 600px;
                    width: 90%;
                    max-height: 80vh;
                    overflow-y: auto;
                    position: relative;
                    box-shadow: 0 20px 40px rgba(0,0,0,0.3);
                }
                .modal-header {
                    padding: 20px;
                    border-bottom: 1px solid #e0e0e0;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                .modal-close {
                    background: none;
                    border: none;
                    font-size: 18px;
                    cursor: pointer;
                    color: #999;
                }
                .modal-body {
                    padding: 20px;
                }
                .stats-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
                    gap: 15px;
                    margin-bottom: 30px;
                }
                .stat-card {
                    text-align: center;
                    padding: 15px;
                    background: #f8f9fa;
                    border-radius: 10px;
                }
                .stat-number {
                    font-size: 24px;
                    font-weight: bold;
                    color: #667eea;
                }
                .stats-section {
                    margin-bottom: 25px;
                }
                .type-stat-item {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    margin-bottom: 10px;
                }
                .type-name {
                    min-width: 80px;
                }
                .type-count {
                    min-width: 40px;
                    font-size: 12px;
                    color: #666;
                }
                .type-bar {
                    flex: 1;
                    height: 8px;
                    background: #f0f0f0;
                    border-radius: 4px;
                    overflow: hidden;
                }
                .type-bar-fill {
                    height: 100%;
                    background: linear-gradient(135deg, #667eea, #764ba2);
                }
                .trend-chart {
                    display: flex;
                    align-items: end;
                    gap: 10px;
                    height: 100px;
                    padding: 10px 0;
                }
                .trend-day {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 5px;
                }
                .trend-bar {
                    background: linear-gradient(135deg, #667eea, #764ba2);
                    border-radius: 2px;
                    min-height: 5px;
                    width: 100%;
                }
                .trend-label {
                    font-size: 12px;
                    color: #666;
                }
                .trend-count {
                    font-size: 10px;
                    color: #999;
                }
            `;
            document.head.appendChild(styles);
        }

        document.body.appendChild(modal);
    }

    // 保存互动记录到本地存储
    saveInteractions() {
        if (window.app) {
            window.app.saveToStorage('interactions', this.interactions);
        }
    }

    // 从本地存储加载互动记录
    loadInteractions() {
        if (window.app) {
            const saved = window.app.loadFromStorage('interactions');
            if (saved && Array.isArray(saved)) {
                this.interactions = saved;
            }
        }
    }

    // 生成ID
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }
}

// 全局函数，供HTML调用
function shareInteraction(interactionId) {
    if (window.app && window.app.communicationModule) {
        window.app.communicationModule.shareInteraction(interactionId);
    }
}

function editInteraction(interactionId) {
    if (window.app && window.app.communicationModule) {
        window.app.communicationModule.editInteraction(interactionId);
    }
}

function deleteInteraction(interactionId) {
    if (window.app && window.app.communicationModule) {
        window.app.communicationModule.deleteInteraction(interactionId);
    }
}

function bulkShareToday() {
    if (window.app && window.app.communicationModule) {
        window.app.communicationModule.bulkShareToday();
    }
}

function exportInteractions() {
    if (window.app && window.app.communicationModule) {
        window.app.communicationModule.exportInteractions();
    }
}

function showStatistics() {
    if (window.app && window.app.communicationModule) {
        window.app.communicationModule.showStatistics();
    }
}
