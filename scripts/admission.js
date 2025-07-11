// 招生咨询模块
class AdmissionModule {
    constructor() {
        this.currentQuestionIndex = 0;
        this.answers = {};
        this.questions = mockData.admissionQuestions;
        this.init();
    }

    init() {
        this.renderCurrentQuestion();
        this.setupEventListeners();
    }

    setupEventListeners() {
        // 表单提交事件
        const form = document.getElementById('admissionForm');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleFormSubmit();
            });
        }
    }

    // 渲染当前问题
    renderCurrentQuestion() {
        const container = document.getElementById('questionContainer');
        if (!container) return;

        const question = this.questions[this.currentQuestionIndex];
        if (!question) return;

        // 使用国际化翻译
        const questionText = window.i18n ? window.i18n.t(question.questionKey) : question.question;
        const descriptionText = window.i18n ? window.i18n.t(question.descriptionKey) : question.description;

        let questionHTML = `
            <div class="question" data-question-id="${question.id}">
                <h3>${questionText}</h3>
                <p>${descriptionText}</p>
        `;

        if (question.type === 'multiple-choice') {
            questionHTML += '<div class="question-options">';
            question.options.forEach((option, index) => {
                const isSelected = this.answers[question.id] === option.value;
                const optionLabel = window.i18n ? window.i18n.t(option.labelKey) : option.label;
                questionHTML += `
                    <div class="option ${isSelected ? 'selected' : ''}" onclick="selectOption(${question.id}, '${option.value}', this)">
                        <input type="radio" name="question_${question.id}" value="${option.value}" ${isSelected ? 'checked' : ''}>
                        <span>${optionLabel}</span>
                    </div>
                `;
            });
            questionHTML += '</div>';
        } else if (question.type === 'text') {
            const currentAnswer = this.answers[question.id] || '';
            const placeholderText = window.i18n ? window.i18n.t(question.placeholderKey) : question.placeholder;
            questionHTML += `
                <textarea class="text-input" 
                         placeholder="${placeholderText}" 
                         onchange="saveTextAnswer(${question.id}, this.value)"
                         rows="4">${currentAnswer}</textarea>
            `;
        }

        questionHTML += '</div>';
        container.innerHTML = questionHTML;

        // 更新进度条
        this.updateProgress();
        
        // 更新按钮状态
        this.updateNavigationButtons();
    }

    // 更新进度条
    updateProgress() {
        const progressFill = document.getElementById('progressFill');
        const progressText = document.getElementById('progressText');
        
        if (progressFill && progressText) {
            const progress = ((this.currentQuestionIndex + 1) / this.questions.length) * 100;
            progressFill.style.width = `${progress}%`;
            
            // 使用国际化翻译
            if (window.i18n) {
                if (window.i18n.isZh()) {
                    progressText.textContent = `第 ${this.currentQuestionIndex + 1} 步，共 ${this.questions.length} 步`;
                } else {
                    progressText.textContent = `Step ${this.currentQuestionIndex + 1} of ${this.questions.length}`;
                }
            } else {
                progressText.textContent = `第 ${this.currentQuestionIndex + 1} 步，共 ${this.questions.length} 步`;
            }
        }
    }

    // 更新导航按钮状态
    updateNavigationButtons() {
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        
        if (prevBtn) {
            prevBtn.disabled = this.currentQuestionIndex === 0;
        }
        
        if (nextBtn) {
            const isLastQuestion = this.currentQuestionIndex === this.questions.length - 1;
            
            // 使用国际化翻译
            if (window.i18n) {
                if (isLastQuestion) {
                    nextBtn.textContent = window.i18n.t('admission.generateReport');
                } else {
                    nextBtn.textContent = window.i18n.t('common.next');
                }
            } else {
                nextBtn.textContent = isLastQuestion ? '生成报告' : '下一步';
            }
            
            // 检查当前问题是否已回答
            const currentQuestion = this.questions[this.currentQuestionIndex];
            const hasAnswer = this.answers[currentQuestion.id];
            nextBtn.disabled = !hasAnswer;
        }
    }

    // 选择选项
    selectOption(questionId, value) {
        this.answers[questionId] = value;
        
        // 更新UI
        const options = document.querySelectorAll(`[data-question-id="${questionId}"] .option`);
        options.forEach(option => {
            option.classList.remove('selected');
            const radio = option.querySelector('input[type="radio"]');
            radio.checked = false;
        });
        
        const selectedOption = document.querySelector(`[data-question-id="${questionId}"] .option input[value="${value}"]`).parentElement;
        selectedOption.classList.add('selected');
        selectedOption.querySelector('input').checked = true;
        
        this.updateNavigationButtons();
    }

    // 保存文本答案
    saveTextAnswer(questionId, value) {
        this.answers[questionId] = value.trim();
        this.updateNavigationButtons();
    }

    // 下一个问题
    nextQuestion() {
        if (this.currentQuestionIndex < this.questions.length - 1) {
            this.currentQuestionIndex++;
            this.renderCurrentQuestion();
        } else {
            // 生成报告
            this.generateReport();
        }
    }

    // 上一个问题
    previousQuestion() {
        if (this.currentQuestionIndex > 0) {
            this.currentQuestionIndex--;
            this.renderCurrentQuestion();
        }
    }

    // 生成个性化报告
    generateReport() {
        // 显示加载状态
        const questionnaireSection = document.querySelector('.questionnaire-section');
        const reportSection = document.getElementById('reportSection');
        
        if (questionnaireSection) {
            questionnaireSection.style.display = 'none';
        }
        
        if (reportSection) {
            reportSection.style.display = 'block';
            this.renderReport();
        }
    }

    // 渲染报告
    renderReport() {
        const studentInfo = document.getElementById('studentInfo');
        const courseRecommendations = document.getElementById('courseRecommendations');
        const timelinePlanning = document.getElementById('timelinePlanning');
        const expectationManagement = document.getElementById('expectationManagement');
        const keyMilestones = document.getElementById('keyMilestones');

        // 基于答案生成个性化内容
        const report = this.generatePersonalizedContent();

        // 学生信息
        if (studentInfo) {
            studentInfo.innerHTML = `
                <div class="student-summary">
                    <h4>咨询概要</h4>
                    <p><strong>年级：</strong>${this.getGradeLabel()}</p>
                    <p><strong>兴趣领域：</strong>${this.getInterestLabel()}</p>
                    <p><strong>升学目标：</strong>${this.getTargetLabel()}</p>
                    <p><strong>当前水平：</strong>${this.getLevelLabel()}</p>
                </div>
            `;
        }

        // 选课建议
        if (courseRecommendations) {
            courseRecommendations.innerHTML = `
                <div class="recommendations-list">
                    ${report.courses.map(course => `
                        <div class="recommendation-item">
                            <div class="recommendation-header">
                                <h5>${course.name}</h5>
                                <span class="priority ${course.priority}">${course.priorityLabel}</span>
                            </div>
                            <p>${course.description}</p>
                            <div class="recommendation-benefits">
                                <strong>预期收益：</strong>
                                <ul>
                                    ${course.benefits.map(benefit => `<li>${benefit}</li>`).join('')}
                                </ul>
                            </div>
                        </div>
                    `).join('')}
                </div>
            `;
        }

        // 时间规划
        if (timelinePlanning) {
            timelinePlanning.innerHTML = `
                <div class="timeline-planning">
                    ${report.timeline.map(phase => `
                        <div class="timeline-phase">
                            <div class="phase-header">
                                <h5>${phase.period}</h5>
                                <span class="phase-duration">${phase.duration}</span>
                            </div>
                            <div class="phase-tasks">
                                ${phase.tasks.map(task => `
                                    <div class="task-item">
                                        <i class="fas fa-check-circle"></i>
                                        <span>${task}</span>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    `).join('')}
                </div>
            `;
        }

        // 预期管理
        if (expectationManagement) {
            expectationManagement.innerHTML = `
                <div class="expectations">
                    <div class="expectation-section">
                        <h5><i class="fas fa-target"></i> 短期目标（6个月内）</h5>
                        <ul>
                            ${report.expectations.shortTerm.map(goal => `<li>${goal}</li>`).join('')}
                        </ul>
                    </div>
                    <div class="expectation-section">
                        <h5><i class="fas fa-chart-line"></i> 中期目标（1-2年）</h5>
                        <ul>
                            ${report.expectations.mediumTerm.map(goal => `<li>${goal}</li>`).join('')}
                        </ul>
                    </div>
                    <div class="expectation-section">
                        <h5><i class="fas fa-graduation-cap"></i> 长期目标（3-4年）</h5>
                        <ul>
                            ${report.expectations.longTerm.map(goal => `<li>${goal}</li>`).join('')}
                        </ul>
                    </div>
                </div>
            `;
        }

        // 关键里程碑
        if (keyMilestones) {
            keyMilestones.innerHTML = `
                <div class="milestones-list">
                    ${report.milestones.map((milestone, index) => `
                        <div class="milestone-item">
                            <div class="milestone-number">${index + 1}</div>
                            <div class="milestone-content">
                                <h5>${milestone.title}</h5>
                                <p class="milestone-description">${milestone.description}</p>
                                <div class="milestone-details">
                                    <span class="milestone-timeline"><i class="fas fa-calendar"></i> ${milestone.timeline}</span>
                                    <span class="milestone-importance ${milestone.importance}">
                                        <i class="fas fa-star"></i> ${milestone.importanceLabel}
                                    </span>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            `;
        }
    }

    // 生成个性化内容
    generatePersonalizedContent() {
        const grade = this.answers[1];
        const interest = this.answers[2];
        const target = this.answers[3];
        const level = this.answers[4];

        // 基于答案生成个性化建议
        const report = {
            courses: this.generateCourseRecommendations(grade, interest, target, level),
            timeline: this.generateTimelinePlanning(grade, target),
            expectations: this.generateExpectations(grade, target, level),
            milestones: this.generateMilestones(grade, interest, target)
        };

        return report;
    }

    // 生成选课建议
    generateCourseRecommendations(grade, interest, target, level) {
        const courses = [];

        // 基于兴趣领域推荐课程
        if (interest === 'stem') {
            courses.push({
                name: 'AP微积分BC',
                priority: 'high',
                priorityLabel: '高优先级',
                description: '为理工科专业打下坚实的数学基础，是申请顶尖理工院校的必备课程。',
                benefits: ['提升数学思维能力', '为大学理工科课程做准备', '增强申请竞争力']
            });
            courses.push({
                name: 'AP物理C',
                priority: 'high',
                priorityLabel: '高优先级',
                description: '深入学习力学和电磁学，培养科学思维和实验能力。',
                benefits: ['掌握核心物理概念', '培养实验设计能力', '为工程专业做准备']
            });
            courses.push({
                name: '计算机科学基础',
                priority: 'medium',
                priorityLabel: '中优先级',
                description: '学习编程基础和算法思维，适应数字化时代需求。',
                benefits: ['掌握编程技能', '培养逻辑思维', '增加就业竞争力']
            });
        } else if (interest === 'humanities') {
            courses.push({
                name: 'AP英语文学',
                priority: 'high',
                priorityLabel: '高优先级',
                description: '深入分析经典文学作品，提升批判性思维和写作能力。',
                benefits: ['提升文学鉴赏能力', '加强批判性思维', '改善写作技巧']
            });
            courses.push({
                name: 'AP世界历史',
                priority: 'high',
                priorityLabel: '高优先级',
                description: '全面了解世界历史发展脉络，培养历史思维和分析能力。',
                benefits: ['拓展历史视野', '培养分析能力', '理解文化多样性']
            });
            courses.push({
                name: '哲学导论',
                priority: 'medium',
                priorityLabel: '中优先级',
                description: '探索人生根本问题，培养深度思考和逻辑推理能力。',
                benefits: ['培养批判性思维', '提升逻辑推理能力', '拓展思维深度']
            });
        }

        // 基于目标院校调整建议
        if (target === 'top-us' || target === 'top-uk') {
            courses.forEach(course => {
                if (course.priority === 'medium') {
                    course.priority = 'high';
                    course.priorityLabel = '高优先级';
                }
            });
        }

        return courses;
    }

    // 生成时间规划
    generateTimelinePlanning(grade, target) {
        const timeline = [];

        if (grade === 'grade-9' || grade === 'grade-10') {
            timeline.push({
                period: '基础建设期',
                duration: '当前 - 6个月',
                tasks: [
                    '完成学科基础课程学习',
                    '参加1-2个课外活动',
                    '开始标准化考试准备',
                    '建立良好的学习习惯'
                ]
            });
            timeline.push({
                period: '能力提升期',
                duration: '6个月 - 1年',
                tasks: [
                    '选择并深入发展特长领域',
                    '参加学科竞赛或活动',
                    '完成第一次标准化考试',
                    '开始考虑大学专业方向'
                ]
            });
        } else if (grade === 'grade-11') {
            timeline.push({
                period: '冲刺准备期',
                duration: '当前 - 6个月',
                tasks: [
                    '完成标准化考试',
                    '确定申请院校清单',
                    '准备申请文书',
                    '收集推荐信'
                ]
            });
            timeline.push({
                period: '申请执行期',
                duration: '6个月 - 1年',
                tasks: [
                    '提交大学申请',
                    '准备面试',
                    '完成奖学金申请',
                    '做好入学准备'
                ]
            });
        }

        return timeline;
    }

    // 生成预期管理
    generateExpectations(grade, target, level) {
        const expectations = {
            shortTerm: [],
            mediumTerm: [],
            longTerm: []
        };

        // 短期目标
        expectations.shortTerm = [
            '建立稳定的学习节奏和时间管理习惯',
            '在感兴趣的学科领域取得显著进步',
            '参与至少一项有意义的课外活动',
            '与老师建立良好的师生关系'
        ];

        // 中期目标
        if (target === 'top-us' || target === 'top-uk') {
            expectations.mediumTerm = [
                '在标准化考试中取得优异成绩（SAT 1500+/ACT 33+）',
                '在特长领域获得地区或国家级认可',
                '担任学生组织重要职务',
                '完成有影响力的研究项目或社会服务'
            ];
        } else {
            expectations.mediumTerm = [
                '在标准化考试中取得良好成绩',
                '在感兴趣的领域有所建树',
                '积累丰富的课外活动经验',
                '培养独立思考和解决问题的能力'
            ];
        }

        // 长期目标
        expectations.longTerm = [
            '成功进入理想的大学和专业',
            '在大学期间保持优异的学术表现',
            '建立广泛的人际网络和专业联系',
            '为未来的职业发展奠定坚实基础'
        ];

        return expectations;
    }

    // 生成关键里程碑
    generateMilestones(grade, interest, target) {
        const milestones = [];

        milestones.push({
            title: '学术基础巩固',
            description: '在核心学科建立扎实的基础，为后续高难度课程做准备',
            timeline: '接下来3-6个月',
            importance: 'high',
            importanceLabel: '极其重要'
        });

        milestones.push({
            title: '标准化考试',
            description: '完成SAT/ACT等标准化考试，取得符合目标院校要求的分数',
            timeline: '6-12个月内',
            importance: 'high',
            importanceLabel: '极其重要'
        });

        if (interest === 'stem') {
            milestones.push({
                title: '科研项目参与',
                description: '参与科学研究项目或科技竞赛，展示学术研究能力',
                timeline: '12-18个月内',
                importance: 'medium',
                importanceLabel: '重要'
            });
        } else if (interest === 'humanities') {
            milestones.push({
                title: '人文项目实践',
                description: '参与文学创作、历史研究或社会调研项目',
                timeline: '12-18个月内',
                importance: 'medium',
                importanceLabel: '重要'
            });
        }

        milestones.push({
            title: '领导力展示',
            description: '在学生组织或社区服务中担任领导角色，展示组织协调能力',
            timeline: '18-24个月内',
            importance: 'medium',
            importanceLabel: '重要'
        });

        milestones.push({
            title: '大学申请',
            description: '完成目标院校的申请，包括文书、推荐信和面试准备',
            timeline: '最后一年',
            importance: 'high',
            importanceLabel: '极其重要'
        });

        return milestones;
    }

    // 获取年级标签
    getGradeLabel() {
        const gradeMap = {
            'grade-8': '8年级（初二）',
            'grade-9': '9年级（初三/高一）',
            'grade-10': '10年级（高一/高二）',
            'grade-11': '11年级（高二/高三）',
            'grade-12': '12年级（高三）'
        };
        return gradeMap[this.answers[1]] || '未选择';
    }

    // 获取兴趣标签
    getInterestLabel() {
        const interestMap = {
            'stem': 'STEM（科学、技术、工程、数学）',
            'humanities': '人文学科（文学、历史、哲学）',
            'arts': '艺术类（音乐、美术、戏剧）',
            'social-sciences': '社会科学（心理学、经济学、政治学）',
            'languages': '语言类（英语、第二外语）',
            'mixed': '综合发展，暂未确定'
        };
        return interestMap[this.answers[2]] || '未选择';
    }

    // 获取目标标签
    getTargetLabel() {
        const targetMap = {
            'top-us': '美国顶尖大学（藤校、TOP30）',
            'good-us': '美国优秀大学（TOP50-100）',
            'top-uk': '英国顶尖大学（牛津、剑桥、G5）',
            'good-uk': '英国优秀大学（罗素集团）',
            'top-china': '国内顶尖大学（清北、C9联盟）',
            'mixed': '多国申请，保持选择灵活性'
        };
        return targetMap[this.answers[3]] || '未选择';
    }

    // 获取水平标签
    getLevelLabel() {
        const levelMap = {
            'excellent': '优秀（年级前10%）',
            'good': '良好（年级前25%）',
            'average': '中等（年级前50%）',
            'below-average': '待提升（年级后50%）',
            'unknown': '不确定，需要评估'
        };
        return levelMap[this.answers[4]] || '未选择';
    }

    // 重新开始问卷
    restartQuestionnaire() {
        this.currentQuestionIndex = 0;
        this.answers = {};
        
        const questionnaireSection = document.querySelector('.questionnaire-section');
        const reportSection = document.getElementById('reportSection');
        
        if (questionnaireSection) {
            questionnaireSection.style.display = 'block';
        }
        
        if (reportSection) {
            reportSection.style.display = 'none';
        }
        
        this.renderCurrentQuestion();
    }

    // 下载报告
    downloadReport() {
        // 创建报告内容
        const reportContent = this.generateReportContent();
        
        // 创建下载链接
        const blob = new Blob([reportContent], { type: 'text/html;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = '个性化学业规划报告.html';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        // 显示成功通知
        if (window.app) {
            window.app.showNotification('报告下载成功！', 'success');
        }
    }

    // 生成报告内容（用于下载）
    generateReportContent() {
        const report = this.generatePersonalizedContent();
        
        return `
            <!DOCTYPE html>
            <html lang="zh-CN">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>个性化学业规划报告</title>
                <style>
                    body { font-family: 'Microsoft YaHei', sans-serif; line-height: 1.6; color: #333; max-width: 800px; margin: 0 auto; padding: 20px; }
                    h1, h2, h3 { color: #667eea; }
                    .header { text-align: center; margin-bottom: 30px; padding: 20px; background: #f8f9fa; border-radius: 10px; }
                    .section { margin-bottom: 30px; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px; }
                    .recommendation-item, .milestone-item { margin-bottom: 15px; padding: 15px; background: #f8f9fa; border-radius: 8px; }
                    .priority.high { color: #dc3545; font-weight: bold; }
                    .priority.medium { color: #ffc107; font-weight: bold; }
                    ul { padding-left: 20px; }
                    li { margin-bottom: 5px; }
                </style>
            </head>
            <body>
                <div class="header">
                    <h1>个性化学业规划报告</h1>
                    <p>生成时间：${new Date().toLocaleDateString('zh-CN')}</p>
                    <div class="student-summary">
                        <p><strong>年级：</strong>${this.getGradeLabel()}</p>
                        <p><strong>兴趣领域：</strong>${this.getInterestLabel()}</p>
                        <p><strong>升学目标：</strong>${this.getTargetLabel()}</p>
                        <p><strong>当前水平：</strong>${this.getLevelLabel()}</p>
                    </div>
                </div>
                
                <div class="section">
                    <h2>选课建议</h2>
                    ${report.courses.map(course => `
                        <div class="recommendation-item">
                            <h3>${course.name} <span class="priority ${course.priority}">[${course.priorityLabel}]</span></h3>
                            <p>${course.description}</p>
                            <strong>预期收益：</strong>
                            <ul>${course.benefits.map(benefit => `<li>${benefit}</li>`).join('')}</ul>
                        </div>
                    `).join('')}
                </div>
                
                <div class="section">
                    <h2>时间规划</h2>
                    ${report.timeline.map(phase => `
                        <div class="timeline-phase">
                            <h3>${phase.period} (${phase.duration})</h3>
                            <ul>${phase.tasks.map(task => `<li>${task}</li>`).join('')}</ul>
                        </div>
                    `).join('')}
                </div>
                
                <div class="section">
                    <h2>关键里程碑</h2>
                    ${report.milestones.map((milestone, index) => `
                        <div class="milestone-item">
                            <h3>${index + 1}. ${milestone.title}</h3>
                            <p>${milestone.description}</p>
                            <p><strong>时间安排：</strong>${milestone.timeline}</p>
                            <p><strong>重要程度：</strong>${milestone.importanceLabel}</p>
                        </div>
                    `).join('')}
                </div>
            </body>
            </html>
        `;
    }
}

// 全局函数，供HTML调用
function selectOption(questionId, value, element) {
    if (window.app && window.app.admissionModule) {
        window.app.admissionModule.selectOption(questionId, value);
    }
}

function saveTextAnswer(questionId, value) {
    if (window.app && window.app.admissionModule) {
        window.app.admissionModule.saveTextAnswer(questionId, value);
    }
}

function nextQuestion() {
    if (window.app && window.app.admissionModule) {
        window.app.admissionModule.nextQuestion();
    }
}

function previousQuestion() {
    if (window.app && window.app.admissionModule) {
        window.app.admissionModule.previousQuestion();
    }
}

function restartQuestionnaire() {
    if (window.app && window.app.admissionModule) {
        window.app.admissionModule.restartQuestionnaire();
    }
}

function downloadReport() {
    if (window.app && window.app.admissionModule) {
        window.app.admissionModule.downloadReport();
    }
}
