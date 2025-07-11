// 升学指导模块
class GuidanceModule {
    constructor() {
        this.currentStudent = '张小明';
        this.pathwayChart = null;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadGuidanceData();
    }

    setupEventListeners() {
        // 学生选择器事件
        const studentSelect = document.getElementById('guidanceStudentSelect');
        if (studentSelect) {
            studentSelect.addEventListener('change', (e) => {
                this.currentStudent = e.target.value;
                this.loadGuidanceData();
            });
        }
    }

    // 加载升学指导数据
    loadGuidanceData() {
        const studentData = mockData.students[this.currentStudent];
        const pathwayData = mockData.pathwayData[this.currentStudent];
        const resources = mockData.resources[this.currentStudent];
        
        if (!studentData || !pathwayData) return;

        this.createPathwayChart(pathwayData);
        this.renderProgressDashboard(studentData);
        this.renderMilestoneTracker(studentData);
        this.renderResourceRecommendations(resources);
    }

    // 创建升学路径图
    createPathwayChart(pathwayData) {
        const container = document.getElementById('pathwayChart');
        if (!container) return;

        // 销毁现有图表
        if (this.pathwayChart) {
            this.pathwayChart.dispose();
        }

        // 初始化ECharts
        this.pathwayChart = echarts.init(container);

        // 准备节点数据
        const nodes = pathwayData.pathwayNodes.map(node => ({
            id: node.id,
            name: node.name,
            x: node.x,
            y: node.y,
            symbolSize: this.getNodeSize(node.type),
            itemStyle: {
                color: this.getNodeColor(node.status, node.type)
            },
            label: {
                show: true,
                position: 'bottom',
                fontSize: 12,
                color: '#333'
            },
            tooltip: {
                formatter: `<strong>${node.name}</strong><br/>${node.description}`
            },
            category: node.type
        }));

        // 准备连接线数据
        const links = pathwayData.connections.map(conn => ({
            source: conn.from,
            target: conn.to,
            lineStyle: {
                color: '#667eea',
                width: 2,
                type: 'solid'
            }
        }));

        // 图表配置
        const option = {
            title: {
                text: `${this.currentStudent} - ${pathwayData.targetUniversity} ${pathwayData.targetMajor}`,
                left: 'center',
                textStyle: {
                    color: '#333',
                    fontSize: 16
                }
            },
            tooltip: {
                trigger: 'item',
                backgroundColor: 'rgba(255,255,255,0.95)',
                borderColor: '#667eea',
                textStyle: {
                    color: '#333'
                }
            },
            legend: {
                data: window.i18n && window.i18n.isEn() 
                    ? ['Current Status', 'Milestones', 'Target']
                    : ['当前状态', '里程碑', '目标'],
                bottom: 10,
                itemGap: 20
            },
            series: [{
                type: 'graph',
                layout: 'none',
                coordinateSystem: null,
                symbolSize: 50,
                roam: true,
                label: {
                    show: true,
                    position: 'bottom'
                },
                edgeSymbol: ['circle', 'arrow'],
                edgeSymbolSize: [4, 10],
                data: nodes,
                links: links,
                categories: [
                    { name: '当前状态', itemStyle: { color: '#43e97b' } },
                    { name: '里程碑', itemStyle: { color: '#667eea' } },
                    { name: '目标', itemStyle: { color: '#f093fb' } }
                ],
                lineStyle: {
                    opacity: 0.9,
                    width: 2,
                    curveness: 0.3
                }
            }]
        };

        this.pathwayChart.setOption(option);

        // 添加点击事件
        this.pathwayChart.on('click', (params) => {
            if (params.dataType === 'node') {
                this.showNodeDetails(params.data);
            }
        });
    }

    // 获取节点大小
    getNodeSize(type) {
        const sizeMap = {
            'current': 60,
            'milestone': 50,
            'target': 70
        };
        return sizeMap[type] || 50;
    }

    // 获取节点颜色
    getNodeColor(status, type) {
        if (type === 'current') return '#43e97b';
        if (type === 'target') return '#f093fb';
        
        const statusColors = {
            'completed': '#28a745',
            'in-progress': '#ffc107',
            'pending': '#6c757d'
        };
        return statusColors[status] || '#667eea';
    }

    // 显示节点详情
    showNodeDetails(nodeData) {
        const pathwayData = mockData.pathwayData[this.currentStudent];
        const node = pathwayData.pathwayNodes.find(n => n.id === nodeData.id);
        
        if (!node) return;

        const modal = document.createElement('div');
        modal.className = 'node-detail-modal';
        modal.innerHTML = `
            <div class="modal-overlay" onclick="this.parentElement.remove()"></div>
            <div class="modal-content">
                <div class="modal-header">
                    <h3>${node.name}</h3>
                    <button class="modal-close" onclick="this.closest('.node-detail-modal').remove()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="node-status">
                        <span class="status-badge ${node.status}">${this.getStatusLabel(node.status)}</span>
                    </div>
                    <p class="node-description">${node.description}</p>
                    
                    ${node.type === 'milestone' ? `
                        <div class="milestone-actions">
                            <h4>建议行动</h4>
                            <ul>
                                ${this.getMilestoneActions(node).map(action => `<li>${action}</li>`).join('')}
                            </ul>
                        </div>
                        
                        <div class="milestone-resources">
                            <h4>相关资源</h4>
                            <div class="resource-links">
                                ${this.getMilestoneResources(node).map(resource => `
                                    <a href="${resource.url}" target="_blank" class="resource-link">
                                        <i class="fas fa-external-link-alt"></i>
                                        ${resource.title}
                                    </a>
                                `).join('')}
                            </div>
                        </div>
                    ` : ''}
                    
                    ${node.status === 'pending' ? `
                        <div class="node-actions">
                            <button class="btn btn-primary" onclick="markAsInProgress('${node.id}')">
                                开始执行
                            </button>
                        </div>
                    ` : ''}
                    
                    ${node.status === 'in-progress' ? `
                        <div class="node-actions">
                            <button class="btn btn-success" onclick="markAsCompleted('${node.id}')">
                                标记完成
                            </button>
                        </div>
                    ` : ''}
                </div>
            </div>
        `;

        // 添加样式
        if (!document.querySelector('#node-detail-modal-styles')) {
            const styles = document.createElement('style');
            styles.id = 'node-detail-modal-styles';
            styles.textContent = `
                .node-detail-modal {
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
                .node-detail-modal .modal-content {
                    max-width: 500px;
                    width: 90%;
                }
                .node-status {
                    margin-bottom: 15px;
                }
                .status-badge {
                    padding: 5px 12px;
                    border-radius: 15px;
                    font-size: 12px;
                    font-weight: bold;
                    text-transform: uppercase;
                }
                .status-badge.completed {
                    background: #d4edda;
                    color: #155724;
                }
                .status-badge.in-progress {
                    background: #fff3cd;
                    color: #856404;
                }
                .status-badge.pending {
                    background: #f8d7da;
                    color: #721c24;
                }
                .node-description {
                    margin-bottom: 20px;
                    line-height: 1.6;
                }
                .milestone-actions,
                .milestone-resources {
                    margin-bottom: 20px;
                }
                .resource-links {
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                }
                .resource-link {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    padding: 8px 12px;
                    background: #f8f9fa;
                    border-radius: 6px;
                    text-decoration: none;
                    color: #667eea;
                    transition: background 0.3s;
                }
                .resource-link:hover {
                    background: #e9ecef;
                }
                .node-actions {
                    text-align: center;
                    margin-top: 20px;
                }
            `;
            document.head.appendChild(styles);
        }

        document.body.appendChild(modal);

        // 添加全局函数
        window.markAsInProgress = (nodeId) => {
            this.updateNodeStatus(nodeId, 'in-progress');
            modal.remove();
        };

        window.markAsCompleted = (nodeId) => {
            this.updateNodeStatus(nodeId, 'completed');
            modal.remove();
        };
    }

    // 获取状态标签
    getStatusLabel(status) {
        const labels = {
            'completed': '已完成',
            'in-progress': '进行中',
            'pending': '待开始'
        };
        return labels[status] || status;
    }

    // 获取里程碑行动建议
    getMilestoneActions(node) {
        const actionMap = {
            'sat-prep': [
                '制定详细的备考计划',
                '每天坚持词汇和阅读练习',
                '定期进行模拟考试',
                '分析错题并总结经验'
            ],
            'ap-courses': [
                '选择与专业相关的AP课程',
                '合理安排学习时间',
                '积极参与课堂讨论',
                '准备AP考试'
            ],
            'competitions': [
                '选择适合的竞赛项目',
                '组建学习小组',
                '寻求老师指导',
                '制定训练计划'
            ],
            'internship': [
                '准备简历和求职信',
                '网络搜索实习机会',
                '准备面试技巧',
                '建立专业网络'
            ]
        };
        return actionMap[node.id] || ['制定具体行动计划', '寻求专业指导', '定期评估进展'];
    }

    // 获取里程碑相关资源
    getMilestoneResources(node) {
        const resourceMap = {
            'sat-prep': [
                { title: 'Khan Academy SAT练习', url: 'https://khanacademy.org' },
                { title: 'College Board官方资源', url: 'https://collegeboard.org' }
            ],
            'ap-courses': [
                { title: 'AP课程官方信息', url: 'https://apstudents.collegeboard.org' },
                { title: 'AP备考资源', url: 'https://apcentral.collegeboard.org' }
            ],
            'competitions': [
                { title: '数学竞赛信息', url: 'https://artofproblemsolving.com' },
                { title: '科学竞赛平台', url: 'https://scienceolympiad.org' }
            ]
        };
        return resourceMap[node.id] || [];
    }

    // 更新节点状态
    updateNodeStatus(nodeId, newStatus) {
        const pathwayData = mockData.pathwayData[this.currentStudent];
        const node = pathwayData.pathwayNodes.find(n => n.id === nodeId);
        
        if (node) {
            node.status = newStatus;
            this.loadGuidanceData(); // 重新加载数据
            
            if (window.app) {
                window.app.showNotification(`里程碑"${node.name}"状态已更新为${this.getStatusLabel(newStatus)}`, 'success');
            }
        }
    }

    // 渲染进度仪表盘
    renderProgressDashboard(studentData) {
        const progressItems = document.getElementById('progressItems');
        if (!progressItems) return;

        const progressData = this.calculateProgress(studentData);

        progressItems.innerHTML = `
            ${progressData.map(item => `
                <div class="progress-item">
                    <div class="progress-label">${window.i18n ? window.i18n.t(item.labelKey) : item.label}</div>
                    <div class="progress-value">${item.value}</div>
                </div>
            `).join('')}
        `;
    }

    // 计算进度数据
    calculateProgress(studentData) {
        const pathwayData = mockData.pathwayData[this.currentStudent];
        const milestones = pathwayData.pathwayNodes.filter(node => node.type === 'milestone');
        
        const completed = milestones.filter(m => m.status === 'completed').length;
        const inProgress = milestones.filter(m => m.status === 'in-progress').length;
        const total = milestones.length;
        
        const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;
        
        // 计算平均成绩
        const subjects = studentData.subjects;
        const avgScore = Object.values(subjects).reduce((sum, s) => sum + s.current, 0) / Object.keys(subjects).length;
        
        return [
            {
                label: '里程碑完成率',
                labelKey: 'guidance.milestoneCompletion',
                value: `${completionRate}%`
            },
            {
                label: '当前平均成绩',
                labelKey: 'guidance.currentAverage',
                value: `${avgScore.toFixed(1)}分`
            },
            {
                label: '目标GPA',
                labelKey: 'guidance.targetGPA',
                value: studentData.currentGPA.toString()
            },
            {
                label: '进行中项目',
                labelKey: 'guidance.ongoingProjects',
                value: `${inProgress}个`
            },
            {
                label: '目标院校',
                labelKey: 'guidance.targetUniversity',
                value: studentData.targetUniversities[0]
            }
        ];
    }

    // 渲染里程碑追踪
    renderMilestoneTracker(studentData) {
        const milestoneList = document.getElementById('milestoneList');
        if (!milestoneList) return;

        const milestones = studentData.milestones;

        milestoneList.innerHTML = `
            ${milestones.map(milestone => `
                <div class="milestone-item">
                    <div class="milestone-status ${milestone.status}">
                        <i class="fas fa-${this.getMilestoneIcon(milestone.status)}"></i>
                    </div>
                    <div class="milestone-content">
                        <h5>${milestone.name}</h5>
                        <p class="milestone-score">${milestone.score}</p>
                        <p class="milestone-date">
                            <i class="fas fa-calendar"></i>
                            ${milestone.date}
                        </p>
                    </div>
                    <div class="milestone-actions">
                        <button class="action-btn" onclick="editMilestone('${milestone.name}')" title="编辑">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="action-btn" onclick="viewMilestoneDetails('${milestone.name}')" title="详情">
                            <i class="fas fa-info-circle"></i>
                        </button>
                    </div>
                </div>
            `).join('')}
        `;
    }

    // 获取里程碑图标
    getMilestoneIcon(status) {
        const iconMap = {
            'completed': 'check',
            'in-progress': 'clock',
            'pending': 'hourglass-start'
        };
        return iconMap[status] || 'circle';
    }

    // 渲染资源推荐
    renderResourceRecommendations(resources) {
        const resourceList = document.getElementById('resourceList');
        if (!resourceList || !resources) return;

        resourceList.innerHTML = `
            ${resources.map(resource => `
                <div class="resource-item">
                    <div class="resource-title">${resource.title}</div>
                    <div class="resource-description">${resource.description}</div>
                    <div class="resource-meta">
                        <span class="resource-type">${resource.type}</span>
                        <a href="${resource.url}" target="_blank" class="resource-link">
                            <i class="fas fa-external-link-alt"></i>
                            访问资源
                        </a>
                    </div>
                </div>
            `).join('')}
        `;
    }

    // 添加新里程碑
    addMilestone() {
        const modal = document.createElement('div');
        modal.className = 'add-milestone-modal';
        modal.innerHTML = `
            <div class="modal-overlay" onclick="this.parentElement.remove()"></div>
            <div class="modal-content">
                <div class="modal-header">
                    <h3>添加新里程碑</h3>
                    <button class="modal-close" onclick="this.closest('.add-milestone-modal').remove()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    <form id="addMilestoneForm">
                        <div class="form-group">
                            <label>里程碑名称</label>
                            <input type="text" id="milestoneName" required>
                        </div>
                        <div class="form-group">
                            <label>目标分数/成果</label>
                            <input type="text" id="milestoneScore" required>
                        </div>
                        <div class="form-group">
                            <label>目标日期</label>
                            <input type="date" id="milestoneDate" required>
                        </div>
                        <div class="form-group">
                            <label>状态</label>
                            <select id="milestoneStatus">
                                <option value="pending">待开始</option>
                                <option value="in-progress">进行中</option>
                                <option value="completed">已完成</option>
                            </select>
                        </div>
                        <div class="form-actions">
                            <button type="button" class="btn btn-secondary" onclick="this.closest('.add-milestone-modal').remove()">取消</button>
                            <button type="submit" class="btn btn-primary">添加里程碑</button>
                        </div>
                    </form>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // 处理表单提交
        const form = modal.querySelector('#addMilestoneForm');
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const newMilestone = {
                name: document.getElementById('milestoneName').value,
                score: document.getElementById('milestoneScore').value,
                date: document.getElementById('milestoneDate').value,
                status: document.getElementById('milestoneStatus').value
            };

            // 添加到学生数据
            const studentData = mockData.students[this.currentStudent];
            studentData.milestones.push(newMilestone);

            // 重新渲染
            this.renderMilestoneTracker(studentData);
            modal.remove();

            if (window.app) {
                window.app.showNotification('新里程碑添加成功！', 'success');
            }
        });
    }

    // 生成升学报告
    generateGuidanceReport() {
        const studentData = mockData.students[this.currentStudent];
        const pathwayData = mockData.pathwayData[this.currentStudent];
        const resources = mockData.resources[this.currentStudent];

        const reportData = {
            student: studentData,
            pathway: pathwayData,
            resources: resources,
            progress: this.calculateProgress(studentData),
            exportDate: new Date().toISOString()
        };

        const blob = new Blob([JSON.stringify(reportData, null, 2)], { 
            type: 'application/json;charset=utf-8' 
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${this.currentStudent}_升学指导报告_${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        if (window.app) {
            window.app.showNotification('升学指导报告导出成功！', 'success');
        }
    }

    // 模拟目标调整
    simulateTargetAdjustment() {
        const pathwayData = mockData.pathwayData[this.currentStudent];
        const studentData = mockData.students[this.currentStudent];
        
        // 计算当前表现
        const avgScore = Object.values(studentData.subjects).reduce((sum, s) => sum + s.current, 0) / Object.keys(studentData.subjects).length;
        const completedMilestones = studentData.milestones.filter(m => m.status === 'completed').length;
        
        // 模拟目标调整逻辑
        let adjustmentMessage = '';
        let newTarget = pathwayData.targetUniversity;
        
        if (avgScore >= 92 && completedMilestones >= 2) {
            // 表现优秀，可以冲击更高目标
            const higherTargets = ['哈佛大学', 'MIT', '斯坦福大学'];
            if (!higherTargets.includes(newTarget)) {
                newTarget = higherTargets[0];
                adjustmentMessage = `基于优异的学术表现（平均分${avgScore.toFixed(1)}）和里程碑完成情况，建议将目标调整为${newTarget}`;
            } else {
                adjustmentMessage = `当前表现优秀，继续保持对${newTarget}的冲击`;
            }
        } else if (avgScore < 85 || completedMilestones < 1) {
            // 表现需要改进，建议调整为更现实的目标
            const realisticTargets = ['加州大学洛杉矶分校', '纽约大学', '波士顿大学'];
            if (!realisticTargets.includes(newTarget)) {
                newTarget = realisticTargets[0];
                adjustmentMessage = `基于当前表现，建议将目标调整为${newTarget}，并加强薄弱环节`;
            } else {
                adjustmentMessage = `需要加强学术表现和里程碑完成度，以确保${newTarget}的申请成功率`;
            }
        } else {
            adjustmentMessage = `当前表现良好，继续朝着${newTarget}的目标努力`;
        }

        // 显示调整建议
        const modal = document.createElement('div');
        modal.className = 'target-adjustment-modal';
        modal.innerHTML = `
            <div class="modal-overlay" onclick="this.parentElement.remove()"></div>
            <div class="modal-content">
                <div class="modal-header">
                    <h3>智能目标调整建议</h3>
                    <button class="modal-close" onclick="this.closest('.target-adjustment-modal').remove()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="current-performance">
                        <h4>当前表现分析</h4>
                        <div class="performance-metrics">
                            <div class="metric">
                                <span class="metric-label">平均成绩：</span>
                                <span class="metric-value">${avgScore.toFixed(1)}分</span>
                            </div>
                            <div class="metric">
                                <span class="metric-label">完成里程碑：</span>
                                <span class="metric-value">${completedMilestones}个</span>
                            </div>
                            <div class="metric">
                                <span class="metric-label">当前目标：</span>
                                <span class="metric-value">${pathwayData.targetUniversity}</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="adjustment-recommendation">
                        <h4>调整建议</h4>
                        <p class="recommendation-text">${adjustmentMessage}</p>
                        
                        ${newTarget !== pathwayData.targetUniversity ? `
                            <div class="target-change">
                                <div class="change-arrow">
                                    <span class="old-target">${pathwayData.targetUniversity}</span>
                                    <i class="fas fa-arrow-right"></i>
                                    <span class="new-target">${newTarget}</span>
                                </div>
                            </div>
                        ` : ''}
                    </div>
                    
                    <div class="action-plan">
                        <h4>建议行动计划</h4>
                        <ul>
                            ${this.generateActionPlan(avgScore, completedMilestones).map(action => `<li>${action}</li>`).join('')}
                        </ul>
                    </div>
                    
                    <div class="modal-actions">
                        <button class="btn btn-secondary" onclick="this.closest('.target-adjustment-modal').remove()">关闭</button>
                        ${newTarget !== pathwayData.targetUniversity ? `
                            <button class="btn btn-primary" onclick="applyTargetAdjustment('${newTarget}')">应用调整</button>
                        ` : ''}
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // 添加全局函数
        window.applyTargetAdjustment = (newTarget) => {
            pathwayData.targetUniversity = newTarget;
            this.loadGuidanceData();
            modal.remove();
            
            if (window.app) {
                window.app.showNotification(`目标已调整为${newTarget}`, 'success');
            }
        };
    }

    // 生成行动计划
    generateActionPlan(avgScore, completedMilestones) {
        const actions = [];
        
        if (avgScore < 85) {
            actions.push('重点提升薄弱学科成绩，制定针对性学习计划');
            actions.push('增加学习时间，寻求老师和同学的帮助');
        }
        
        if (completedMilestones < 2) {
            actions.push('加快里程碑完成进度，优先处理重要项目');
            actions.push('制定详细的时间表，确保按时完成各项任务');
        }
        
        if (avgScore >= 90 && completedMilestones >= 2) {
            actions.push('保持当前优秀表现，继续挑战更高难度');
            actions.push('参与更多高质量的课外活动和竞赛');
        }
        
        actions.push('定期评估进展，及时调整策略');
        actions.push('与升学顾问保持密切沟通，获取专业指导');
        
        return actions;
    }
}

// 全局函数，供HTML调用
function loadGuidanceData() {
    if (window.app && window.app.guidanceModule) {
        window.app.guidanceModule.loadGuidanceData();
    }
}

function addMilestone() {
    if (window.app && window.app.guidanceModule) {
        window.app.guidanceModule.addMilestone();
    }
}

function editMilestone(milestoneName) {
    if (window.app) {
        window.app.showNotification(`编辑里程碑"${milestoneName}"功能开发中`, 'info');
    }
}

function viewMilestoneDetails(milestoneName) {
    if (window.app) {
        window.app.showNotification(`查看里程碑"${milestoneName}"详情功能开发中`, 'info');
    }
}

function generateGuidanceReport() {
    if (window.app && window.app.guidanceModule) {
        window.app.guidanceModule.generateGuidanceReport();
    }
}

function simulateTargetAdjustment() {
    if (window.app && window.app.guidanceModule) {
        window.app.guidanceModule.simulateTargetAdjustment();
    }
}
