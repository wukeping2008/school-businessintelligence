// 学业反馈模块
class AcademicModule {
    constructor() {
        this.currentStudent = '张小明';
        this.charts = {};
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadAcademicData();
    }

    setupEventListeners() {
        // 学生选择器事件
        const studentSelect = document.getElementById('academicStudentSelect');
        if (studentSelect) {
            studentSelect.addEventListener('change', (e) => {
                this.currentStudent = e.target.value;
                this.loadAcademicData();
            });
        }
    }

    // 加载学业数据
    loadAcademicData() {
        const studentData = mockData.students[this.currentStudent];
        if (!studentData) return;

        this.createRadarChart(studentData);
        this.createTrendChart(studentData);
        this.renderAIReport(studentData);
        this.renderDevelopmentSuggestions(studentData);
        this.renderKeyMetrics(studentData);
    }

    // 创建雷达图
    createRadarChart(studentData) {
        const ctx = document.getElementById('radarChart');
        if (!ctx) return;

        // 销毁现有图表
        if (this.charts.radar) {
            this.charts.radar.destroy();
        }

        const subjects = Object.keys(studentData.subjects);
        const currentScores = subjects.map(subject => studentData.subjects[subject].current);
        const targetScores = subjects.map(subject => studentData.subjects[subject].target);

        this.charts.radar = new Chart(ctx, {
            type: 'radar',
            data: {
                labels: subjects,
                datasets: [
                    {
                        label: '当前成绩',
                        data: currentScores,
                        borderColor: '#667eea',
                        backgroundColor: 'rgba(102, 126, 234, 0.2)',
                        pointBackgroundColor: '#667eea',
                        pointBorderColor: '#fff',
                        pointHoverBackgroundColor: '#fff',
                        pointHoverBorderColor: '#667eea'
                    },
                    {
                        label: '目标成绩',
                        data: targetScores,
                        borderColor: '#f093fb',
                        backgroundColor: 'rgba(240, 147, 251, 0.1)',
                        pointBackgroundColor: '#f093fb',
                        pointBorderColor: '#fff',
                        pointHoverBackgroundColor: '#fff',
                        pointHoverBorderColor: '#f093fb',
                        borderDash: [5, 5]
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                    }
                },
                scales: {
                    r: {
                        beginAtZero: true,
                        max: 100,
                        ticks: {
                            stepSize: 20
                        },
                        grid: {
                            color: 'rgba(0,0,0,0.1)'
                        },
                        angleLines: {
                            color: 'rgba(0,0,0,0.1)'
                        }
                    }
                },
                elements: {
                    line: {
                        borderWidth: 3
                    },
                    point: {
                        radius: 4,
                        hoverRadius: 6
                    }
                }
            }
        });
    }

    // 创建趋势图
    createTrendChart(studentData) {
        const ctx = document.getElementById('trendChart');
        if (!ctx) return;

        // 销毁现有图表
        if (this.charts.trend) {
            this.charts.trend.destroy();
        }

        const subjects = Object.keys(studentData.subjects);
        const labels = ['第1次', '第2次', '第3次', '第4次'];
        
        const datasets = subjects.map((subject, index) => {
            const colors = [
                '#667eea', '#f093fb', '#4facfe', '#43e97b', '#ffa726', '#ef5350'
            ];
            return {
                label: subject,
                data: studentData.subjects[subject].trend,
                borderColor: colors[index % colors.length],
                backgroundColor: colors[index % colors.length] + '20',
                tension: 0.4,
                fill: false,
                pointRadius: 4,
                pointHoverRadius: 6
            };
        });

        this.charts.trend = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: datasets
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false,
                    }
                },
                scales: {
                    y: {
                        beginAtZero: false,
                        min: 70,
                        max: 100,
                        grid: {
                            color: 'rgba(0,0,0,0.1)'
                        }
                    },
                    x: {
                        grid: {
                            color: 'rgba(0,0,0,0.1)'
                        }
                    }
                },
                interaction: {
                    mode: 'nearest',
                    axis: 'x',
                    intersect: false
                }
            }
        });
    }

    // 渲染AI报告
    renderAIReport(studentData) {
        const aiReport = document.getElementById('aiReport');
        if (!aiReport) return;

        const reportData = mockData.aiReportTemplates.academic[studentData.name];
        if (!reportData) return;

        aiReport.innerHTML = `
            <div class="ai-report-content">
                <div class="report-summary">
                    <h4><i class="fas fa-brain"></i> AI 学业分析总结</h4>
                    <p>${reportData.summary}</p>
                </div>
                
                <div class="report-section">
                    <h5><i class="fas fa-thumbs-up"></i> 优势分析</h5>
                    <ul class="strengths-list">
                        ${reportData.strengths.map(strength => `
                            <li class="strength-item">
                                <i class="fas fa-check-circle"></i>
                                <span>${strength}</span>
                            </li>
                        `).join('')}
                    </ul>
                </div>
                
                <div class="report-section">
                    <h5><i class="fas fa-arrow-up"></i> 改进建议</h5>
                    <ul class="improvements-list">
                        ${reportData.improvements.map(improvement => `
                            <li class="improvement-item">
                                <i class="fas fa-exclamation-triangle"></i>
                                <span>${improvement}</span>
                            </li>
                        `).join('')}
                    </ul>
                </div>
                
                <div class="report-section">
                    <h5><i class="fas fa-lightbulb"></i> 个性化建议</h5>
                    <ul class="recommendations-list">
                        ${reportData.recommendations.map(recommendation => `
                            <li class="recommendation-item">
                                <i class="fas fa-star"></i>
                                <span>${recommendation}</span>
                            </li>
                        `).join('')}
                    </ul>
                </div>
                
                <div class="report-footer">
                    <div class="ai-confidence">
                        <span class="confidence-label">AI分析可信度：</span>
                        <div class="confidence-bar">
                            <div class="confidence-fill" style="width: 92%"></div>
                        </div>
                        <span class="confidence-value">92%</span>
                    </div>
                    <div class="report-timestamp">
                        <i class="fas fa-clock"></i>
                        <span>生成时间：${new Date().toLocaleString('zh-CN')}</span>
                    </div>
                </div>
            </div>
        `;
    }

    // 渲染发展建议
    renderDevelopmentSuggestions(studentData) {
        const suggestions = document.getElementById('developmentSuggestions');
        if (!suggestions) return;

        const suggestionData = this.generateDevelopmentSuggestions(studentData);

        suggestions.innerHTML = `
            <div class="suggestions-container">
                ${suggestionData.map(suggestion => `
                    <div class="suggestion-item">
                        <div class="suggestion-header">
                            <div class="suggestion-icon ${suggestion.priority}">
                                <i class="${suggestion.icon}"></i>
                            </div>
                            <div class="suggestion-title">
                                <h5>${suggestion.title}</h5>
                                <span class="suggestion-priority ${suggestion.priority}">${suggestion.priorityLabel}</span>
                            </div>
                        </div>
                        <div class="suggestion-content">
                            <p>${suggestion.description}</p>
                            <div class="suggestion-actions">
                                ${suggestion.actions.map(action => `
                                    <span class="action-tag">${action}</span>
                                `).join('')}
                            </div>
                        </div>
                        <div class="suggestion-timeline">
                            <i class="fas fa-calendar-alt"></i>
                            <span>${suggestion.timeline}</span>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    // 生成发展建议
    generateDevelopmentSuggestions(studentData) {
        const suggestions = [];
        const subjects = studentData.subjects;

        // 分析各科成绩，生成针对性建议
        Object.entries(subjects).forEach(([subject, data]) => {
            const gap = data.target - data.current;
            const trend = this.calculateTrend(data.trend);

            if (gap > 5) {
                suggestions.push({
                    title: `${subject}成绩提升计划`,
                    description: `当前成绩${data.current}分，距离目标${data.target}分还有${gap}分差距。建议制定系统性提升计划。`,
                    priority: gap > 10 ? 'high' : 'medium',
                    priorityLabel: gap > 10 ? '高优先级' : '中优先级',
                    icon: 'fas fa-chart-line',
                    actions: ['制定学习计划', '增加练习时间', '寻求老师指导'],
                    timeline: '2-3个月内'
                });
            }

            if (trend < 0) {
                suggestions.push({
                    title: `${subject}成绩下滑预警`,
                    description: `最近几次考试成绩呈下降趋势，需要及时调整学习策略。`,
                    priority: 'high',
                    priorityLabel: '高优先级',
                    icon: 'fas fa-exclamation-triangle',
                    actions: ['分析下滑原因', '调整学习方法', '加强基础练习'],
                    timeline: '立即执行'
                });
            }
        });

        // 添加通用建议
        suggestions.push({
            title: '学习方法优化',
            description: '建议采用更科学的学习方法，如番茄工作法、思维导图等，提高学习效率。',
            priority: 'medium',
            priorityLabel: '中优先级',
            icon: 'fas fa-brain',
            actions: ['学习时间管理', '掌握记忆技巧', '培养思维能力'],
            timeline: '持续进行'
        });

        suggestions.push({
            title: '综合素质发展',
            description: '在保持学术成绩的同时，建议参与更多课外活动，培养综合能力。',
            priority: 'low',
            priorityLabel: '低优先级',
            icon: 'fas fa-users',
            actions: ['参加社团活动', '培养兴趣爱好', '提升社交能力'],
            timeline: '长期规划'
        });

        return suggestions;
    }

    // 计算趋势
    calculateTrend(trendData) {
        if (trendData.length < 2) return 0;
        const first = trendData[0];
        const last = trendData[trendData.length - 1];
        return last - first;
    }

    // 渲染关键指标
    renderKeyMetrics(studentData) {
        const metrics = document.getElementById('keyMetrics');
        if (!metrics) return;

        const metricsData = this.calculateKeyMetrics(studentData);

        metrics.innerHTML = `
            <div class="metrics-grid">
                ${metricsData.map(metric => `
                    <div class="metric-item">
                        <div class="metric-header">
                            <div class="metric-icon ${metric.status}">
                                <i class="${metric.icon}"></i>
                            </div>
                            <div class="metric-info">
                                <h5>${metric.name}</h5>
                                <span class="metric-category">${metric.category}</span>
                            </div>
                        </div>
                        <div class="metric-value">
                            <span class="metric-number">${metric.value}</span>
                            <span class="metric-unit">${metric.unit}</span>
                        </div>
                        <div class="metric-progress">
                            <div class="progress-bar">
                                <div class="progress-fill ${metric.status}" style="width: ${metric.progress}%"></div>
                            </div>
                            <span class="progress-text">${metric.progress}%</span>
                        </div>
                        <div class="metric-trend">
                            <i class="fas fa-${metric.trend > 0 ? 'arrow-up' : metric.trend < 0 ? 'arrow-down' : 'minus'} ${metric.trend > 0 ? 'trend-up' : metric.trend < 0 ? 'trend-down' : 'trend-stable'}"></i>
                            <span>${metric.trendText}</span>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    // 计算关键指标
    calculateKeyMetrics(studentData) {
        const subjects = studentData.subjects;
        const subjectNames = Object.keys(subjects);
        
        // 计算平均分
        const currentAverage = subjectNames.reduce((sum, subject) => 
            sum + subjects[subject].current, 0) / subjectNames.length;
        
        const targetAverage = subjectNames.reduce((sum, subject) => 
            sum + subjects[subject].target, 0) / subjectNames.length;

        // 计算进步幅度
        const improvements = subjectNames.map(subject => {
            const trend = subjects[subject].trend;
            return trend[trend.length - 1] - trend[0];
        });
        const avgImprovement = improvements.reduce((sum, imp) => sum + imp, 0) / improvements.length;

        // 计算目标达成率
        const achievementRates = subjectNames.map(subject => {
            const current = subjects[subject].current;
            const target = subjects[subject].target;
            return Math.min((current / target) * 100, 100);
        });
        const avgAchievementRate = achievementRates.reduce((sum, rate) => sum + rate, 0) / achievementRates.length;

        // 计算学科均衡度
        const scores = subjectNames.map(subject => subjects[subject].current);
        const maxScore = Math.max(...scores);
        const minScore = Math.min(...scores);
        const balance = 100 - ((maxScore - minScore) / maxScore * 100);

        return [
            {
                name: '平均成绩',
                category: '学术表现',
                value: currentAverage.toFixed(1),
                unit: '分',
                progress: (currentAverage / targetAverage * 100).toFixed(0),
                status: currentAverage >= targetAverage * 0.9 ? 'excellent' : currentAverage >= targetAverage * 0.8 ? 'good' : 'warning',
                trend: avgImprovement > 0 ? 1 : avgImprovement < 0 ? -1 : 0,
                trendText: avgImprovement > 0 ? `上升${avgImprovement.toFixed(1)}分` : avgImprovement < 0 ? `下降${Math.abs(avgImprovement).toFixed(1)}分` : '保持稳定',
                icon: 'fas fa-chart-bar'
            },
            {
                name: '目标达成率',
                category: '目标管理',
                value: avgAchievementRate.toFixed(1),
                unit: '%',
                progress: avgAchievementRate.toFixed(0),
                status: avgAchievementRate >= 90 ? 'excellent' : avgAchievementRate >= 80 ? 'good' : 'warning',
                trend: avgImprovement > 0 ? 1 : avgImprovement < 0 ? -1 : 0,
                trendText: avgAchievementRate >= 90 ? '目标达成良好' : '需要努力',
                icon: 'fas fa-bullseye'
            },
            {
                name: '学科均衡度',
                category: '全面发展',
                value: balance.toFixed(1),
                unit: '%',
                progress: balance.toFixed(0),
                status: balance >= 85 ? 'excellent' : balance >= 70 ? 'good' : 'warning',
                trend: 0,
                trendText: balance >= 85 ? '发展均衡' : '需要平衡发展',
                icon: 'fas fa-balance-scale'
            },
            {
                name: '进步幅度',
                category: '成长趋势',
                value: avgImprovement.toFixed(1),
                unit: '分',
                progress: Math.min(Math.max((avgImprovement + 10) / 20 * 100, 0), 100).toFixed(0),
                status: avgImprovement > 2 ? 'excellent' : avgImprovement > 0 ? 'good' : 'warning',
                trend: avgImprovement > 0 ? 1 : avgImprovement < 0 ? -1 : 0,
                trendText: avgImprovement > 0 ? '持续进步' : avgImprovement < 0 ? '需要关注' : '保持稳定',
                icon: 'fas fa-trending-up'
            }
        ];
    }

    // 导出学业报告
    exportAcademicReport() {
        const studentData = mockData.students[this.currentStudent];
        if (!studentData) return;

        const reportData = {
            student: studentData,
            aiReport: mockData.aiReportTemplates.academic[studentData.name],
            metrics: this.calculateKeyMetrics(studentData),
            suggestions: this.generateDevelopmentSuggestions(studentData),
            exportDate: new Date().toISOString()
        };

        const blob = new Blob([JSON.stringify(reportData, null, 2)], { 
            type: 'application/json;charset=utf-8' 
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${this.currentStudent}_学业报告_${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        if (window.app) {
            window.app.showNotification('学业报告导出成功！', 'success');
        }
    }

    // 生成PDF报告
    generatePDFReport() {
        const studentData = mockData.students[this.currentStudent];
        if (!studentData) return;

        // 创建HTML内容用于PDF生成
        const htmlContent = this.generateReportHTML(studentData);
        
        // 在新窗口中打开报告（实际应用中可以使用PDF生成库）
        const newWindow = window.open('', '_blank');
        newWindow.document.write(htmlContent);
        newWindow.document.close();

        if (window.app) {
            window.app.showNotification('PDF报告已在新窗口中打开', 'success');
        }
    }

    // 生成报告HTML
    generateReportHTML(studentData) {
        const reportData = mockData.aiReportTemplates.academic[studentData.name];
        const metrics = this.calculateKeyMetrics(studentData);
        const suggestions = this.generateDevelopmentSuggestions(studentData);

        return `
            <!DOCTYPE html>
            <html lang="zh-CN">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>${studentData.name} - 学业分析报告</title>
                <style>
                    body { font-family: 'Microsoft YaHei', sans-serif; line-height: 1.6; color: #333; max-width: 800px; margin: 0 auto; padding: 20px; }
                    h1, h2, h3 { color: #667eea; }
                    .header { text-align: center; margin-bottom: 30px; padding: 20px; background: #f8f9fa; border-radius: 10px; }
                    .section { margin-bottom: 30px; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px; }
                    .metric-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; margin-bottom: 20px; }
                    .metric-card { padding: 15px; background: #f8f9fa; border-radius: 8px; text-align: center; }
                    .metric-value { font-size: 24px; font-weight: bold; color: #667eea; }
                    ul { padding-left: 20px; }
                    li { margin-bottom: 8px; }
                    .suggestion-item { margin-bottom: 15px; padding: 15px; background: #f8f9fa; border-radius: 8px; }
                    .priority-high { color: #dc3545; font-weight: bold; }
                    .priority-medium { color: #ffc107; font-weight: bold; }
                    .priority-low { color: #28a745; font-weight: bold; }
                </style>
            </head>
            <body>
                <div class="header">
                    <h1>${studentData.name} 学业分析报告</h1>
                    <p><strong>年级：</strong>${studentData.grade} | <strong>GPA：</strong>${studentData.currentGPA}</p>
                    <p><strong>生成时间：</strong>${new Date().toLocaleString('zh-CN')}</p>
                </div>
                
                <div class="section">
                    <h2>关键指标</h2>
                    <div class="metric-grid">
                        ${metrics.map(metric => `
                            <div class="metric-card">
                                <h4>${metric.name}</h4>
                                <div class="metric-value">${metric.value}${metric.unit}</div>
                                <p>${metric.trendText}</p>
                            </div>
                        `).join('')}
                    </div>
                </div>
                
                <div class="section">
                    <h2>AI 分析总结</h2>
                    <p>${reportData.summary}</p>
                    
                    <h3>优势分析</h3>
                    <ul>
                        ${reportData.strengths.map(strength => `<li>${strength}</li>`).join('')}
                    </ul>
                    
                    <h3>改进建议</h3>
                    <ul>
                        ${reportData.improvements.map(improvement => `<li>${improvement}</li>`).join('')}
                    </ul>
                    
                    <h3>个性化建议</h3>
                    <ul>
                        ${reportData.recommendations.map(recommendation => `<li>${recommendation}</li>`).join('')}
                    </ul>
                </div>
                
                <div class="section">
                    <h2>发展建议</h2>
                    ${suggestions.map(suggestion => `
                        <div class="suggestion-item">
                            <h4>${suggestion.title} <span class="priority-${suggestion.priority}">[${suggestion.priorityLabel}]</span></h4>
                            <p>${suggestion.description}</p>
                            <p><strong>建议行动：</strong>${suggestion.actions.join('、')}</p>
                            <p><strong>时间安排：</strong>${suggestion.timeline}</p>
                        </div>
                    `).join('')}
                </div>
                
                <div class="section">
                    <h2>各科成绩详情</h2>
                    <table style="width: 100%; border-collapse: collapse;">
                        <thead>
                            <tr style="background: #f8f9fa;">
                                <th style="padding: 10px; border: 1px solid #ddd;">学科</th>
                                <th style="padding: 10px; border: 1px solid #ddd;">当前成绩</th>
                                <th style="padding: 10px; border: 1px solid #ddd;">目标成绩</th>
                                <th style="padding: 10px; border: 1px solid #ddd;">差距</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${Object.entries(studentData.subjects).map(([subject, data]) => `
                                <tr>
                                    <td style="padding: 10px; border: 1px solid #ddd;">${subject}</td>
                                    <td style="padding: 10px; border: 1px solid #ddd;">${data.current}分</td>
                                    <td style="padding: 10px; border: 1px solid #ddd;">${data.target}分</td>
                                    <td style="padding: 10px; border: 1px solid #ddd;">${data.target - data.current}分</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </body>
            </html>
        `;
    }

    // 比较学生
    compareStudents() {
        const students = Object.keys(mockData.students);
        if (students.length < 2) {
            if (window.app) {
                window.app.showNotification('需要至少2个学生才能进行比较', 'info');
            }
            return;
        }

        // 创建比较界面
        const modal = document.createElement('div');
        modal.className = 'comparison-modal';
        modal.innerHTML = `
            <div class="modal-overlay" onclick="this.parentElement.remove()"></div>
            <div class="modal-content">
                <div class="modal-header">
                    <h3>学生成绩比较</h3>
                    <button class="modal-close" onclick="this.closest('.comparison-modal').remove()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="comparison-controls">
                        <div class="student-selector">
                            <label>选择学生进行比较：</label>
                            <div class="student-checkboxes">
                                ${students.map(student => `
                                    <label class="checkbox-label">
                                        <input type="checkbox" value="${student}" ${student === this.currentStudent ? 'checked' : ''}>
                                        <span>${student}</span>
                                    </label>
                                `).join('')}
                            </div>
                        </div>
                        <button class="btn btn-primary" onclick="generateComparison()">生成比较</button>
                    </div>
                    <div class="comparison-result" id="comparisonResult">
                        <!-- 比较结果将在这里显示 -->
                    </div>
                </div>
            </div>
        `;

        // 添加样式
        if (!document.querySelector('#comparison-modal-styles')) {
            const styles = document.createElement('style');
            styles.id = 'comparison-modal-styles';
            styles.textContent = `
                .comparison-modal {
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
                .comparison-modal .modal-content {
                    max-width: 900px;
                    width: 95%;
                    max-height: 90vh;
                }
                .student-checkboxes {
                    display: flex;
                    gap: 15px;
                    margin: 10px 0;
                }
                .checkbox-label {
                    display: flex;
                    align-items: center;
                    gap: 5px;
                    cursor: pointer;
                }
                .comparison-table {
                    width: 100%;
                    border-collapse: collapse;
                    margin-top: 20px;
                }
                .comparison-table th,
                .comparison-table td {
                    padding: 10px;
                    border: 1px solid #ddd;
                    text-align: center;
                }
                .comparison-table th {
                    background: #f8f9fa;
                    font-weight: bold;
                }
                .score-high { color: #28a745; font-weight: bold; }
                .score-medium { color: #ffc107; font-weight: bold; }
                .score-low { color: #dc3545; font-weight: bold; }
            `;
            document.head.appendChild(styles);
        }

        document.body.appendChild(modal);

        // 添加全局函数
        window.generateComparison = () => {
            const checkboxes = modal.querySelectorAll('input[type="checkbox"]:checked');
            const selectedStudents = Array.from(checkboxes).map(cb => cb.value);
            
            if (selectedStudents.length < 2) {
                if (window.app) {
                    window.app.showNotification('请至少选择2个学生进行比较', 'error');
                }
                return;
            }

            const comparisonResult = document.getElementById('comparisonResult');
            const comparisonData = this.generateComparisonData(selectedStudents);
            
            comparisonResult.innerHTML = `
                <h4>学生成绩对比分析</h4>
                <table class="comparison-table">
                    <thead>
                        <tr>
                            <th>学科</th>
                            ${selectedStudents.map(student => `<th>${student}</th>`).join('')}
                        </tr>
                    </thead>
                    <tbody>
                        ${Object.keys(mockData.students[selectedStudents[0]].subjects).map(subject => `
                            <tr>
                                <td><strong>${subject}</strong></td>
                                ${selectedStudents.map(student => {
                                    const score = mockData.students[student].subjects[subject].current;
                                    const scoreClass = score >= 90 ? 'score-high' : score >= 80 ? 'score-medium' : 'score-low';
                                    return `<td class="${scoreClass}">${score}分</td>`;
                                }).join('')}
                            </tr>
                        `).join('')}
                        <tr style="background: #f8f9fa;">
                            <td><strong>平均分</strong></td>
                            ${selectedStudents.map(student => {
                                const subjects = mockData.students[student].subjects;
                                const avg = Object.values(subjects).reduce((sum, s) => sum + s.current, 0) / Object.keys(subjects).length;
                                const scoreClass = avg >= 90 ? 'score-high' : avg >= 80 ? 'score-medium' : 'score-low';
                                return `<td class="${scoreClass}"><strong>${avg.toFixed(1)}分</strong></td>`;
                            }).join('')}
                        </tr>
                    </tbody>
                </table>
                
                <div style="margin-top: 20px;">
                    <h5>对比分析总结</h5>
                    ${comparisonData.analysis.map(item => `<p>• ${item}</p>`).join('')}
                </div>
            `;
        }.bind(this);
    }

    // 生成比较数据
    generateComparisonData(selectedStudents) {
        const analysis = [];
        const studentsData = selectedStudents.map(name => mockData.students[name]);
        
        // 分析平均分
        const averages = studentsData.map(student => {
            const subjects = student.subjects;
            return Object.values(subjects).reduce((sum, s) => sum + s.current, 0) / Object.keys(subjects).length;
        });
        
        const maxAvgIndex = averages.indexOf(Math.max(...averages));
        const minAvgIndex = averages.indexOf(Math.min(...averages));
        
        analysis.push(`${selectedStudents[maxAvgIndex]}的平均成绩最高（${averages[maxAvgIndex].toFixed(1)}分）`);
        if (maxAvgIndex !== minAvgIndex) {
            analysis.push(`${selectedStudents[minAvgIndex]}的平均成绩相对较低（${averages[minAvgIndex].toFixed(1)}分），建议加强薄弱学科`);
        }
        
        // 分析各科优势
        const subjects = Object.keys(studentsData[0].subjects);
        subjects.forEach(subject => {
            const scores = studentsData.map(student => student.subjects[subject].current);
            const maxScoreIndex = scores.indexOf(Math.max(...scores));
            analysis.push(`${subject}学科中，${selectedStudents[maxScoreIndex]}表现最优秀（${scores[maxScoreIndex]}分）`);
        });
        
        return { analysis };
    }
}

// 全局函数，供HTML调用
function loadAcademicData() {
    if (window.app && window.app.academicModule) {
        window.app.academicModule.loadAcademicData();
    }
}

function exportAcademicReport() {
    if (window.app && window.app.academicModule) {
        window.app.academicModule.exportAcademicReport();
    }
}

function generatePDFReport() {
    if (window.app && window.app.academicModule) {
        window.app.academicModule.generatePDFReport();
    }
}

function compareStudents() {
    if (window.app && window.app.academicModule) {
        window.app.academicModule.compareStudents();
    }
}
