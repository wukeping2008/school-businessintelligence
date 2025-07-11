// 国际化配置
class I18n {
    constructor() {
        this.currentLang = localStorage.getItem('language') || 'zh';
        this.translations = {
            zh: {
                // 通用
                'common.loading': '加载中...',
                'common.save': '保存',
                'common.cancel': '取消',
                'common.confirm': '确认',
                'common.delete': '删除',
                'common.edit': '编辑',
                'common.export': '导出',
                'common.search': '搜索',
                'common.filter': '筛选',
                'common.all': '全部',
                'common.submit': '提交',
                'common.reset': '重置',
                'common.close': '关闭',
                'common.back': '返回',
                'common.next': '下一步',
                'common.previous': '上一步',
                'common.finish': '完成',
                'common.view': '查看',
                'common.details': '详情',
                'common.settings': '设置',
                'common.help': '帮助',
                'common.about': '关于',
                'common.language': '语言',
                'common.chinese': '中文',
                'common.english': 'English',

                // 导航
                'nav.logo': '智慧校园门户',
                'nav.home': '首页',
                'nav.admission': '招生咨询',
                'nav.communication': '家校沟通',
                'nav.academic': '学业反馈',
                'nav.guidance': '升学指导',
                'nav.admin': '管理员',

                // 首页概览
                'home.overview.title': '月度数据趋势',

                // 首页
                'home.title': '智慧校园数据概览',
                'home.subtitle': '全方位了解学校运营状况',
                'home.admission.title': '招生咨询',
                'home.admission.desc': '智能化招生流程，个性化学业规划',
                'home.admission.count': '本月咨询',
                'home.communication.title': '家校沟通',
                'home.communication.desc': '记录温馨瞬间，加强家校联系',
                'home.communication.count': '互动记录',
                'home.academic.title': '学业反馈',
                'home.academic.desc': '数据驱动的学业分析与发展报告',
                'home.academic.count': '学业报告',
                'home.guidance.title': '升学指导',
                'home.guidance.desc': '可视化升学路径，智能目标调整',
                'home.guidance.count': '升学规划',

                // 招生咨询
                'admission.title': '智能招生咨询系统',
                'admission.subtitle': '通过互动问答，生成个性化学业规划报告',
                'admission.progress': '进度',
                'admission.progress.step': '第 1 步，共 5 步',
                'admission.restart': '重新开始',
                'admission.download': '下载报告',
                'admission.generateReport': '生成报告',
                'admission.question.grade': '您孩子目前的年级是？',
                'admission.question.grade.desc': '请选择孩子当前所在的年级，这将帮助我们制定合适的学业规划。',
                'admission.question.interests': '孩子的兴趣爱好是什么？',
                'admission.question.interests.desc': '了解孩子的兴趣有助于我们推荐合适的课程和活动。',
                'admission.question.goals': '您对孩子的教育目标是什么？',
                'admission.question.goals.desc': '明确的教育目标有助于制定针对性的学习计划。',
                'admission.question.concerns': '您最关心的教育问题是什么？',
                'admission.question.concerns.desc': '了解您的关注点，我们可以提供更有针对性的建议。',
                'admission.option.grade8': '8年级（初二）',
                'admission.option.grade9': '9年级（初三/高一）',
                'admission.option.grade10': '10年级（高一/高二）',
                'admission.option.grade11': '11年级（高二/高三）',
                'admission.option.grade12': '12年级（高三）',
                'admission.option.interests.science': '科学技术',
                'admission.option.interests.arts': '艺术创作',
                'admission.option.interests.sports': '体育运动',
                'admission.option.interests.language': '语言文学',
                'admission.option.interests.business': '商业经济',
                'admission.option.interests.social': '社会科学',
                'admission.option.goals.university': '进入顶尖大学',
                'admission.option.goals.skills': '培养实用技能',
                'admission.option.goals.character': '品格全面发展',
                'admission.option.goals.creativity': '激发创造潜能',
                'admission.option.concerns.academic': '学术成绩提升',
                'admission.option.concerns.social': '社交能力发展',
                'admission.option.concerns.future': '未来职业规划',
                'admission.option.concerns.wellbeing': '身心健康成长',
                'admission.option.concerns.unknown': '不确定，需要评估',
                'admission.option.goals.mixed': '多国申请，保持选择灵活性',
                'admission.option.interests.mixed': '综合发展，暂未确定',
                'admission.question.additional': '您希望我们重点关注哪些方面？',
                'admission.question.additional.desc': '请详细描述您对孩子教育的期望和关注点，比如学术提升、兴趣培养、性格发展等。',
                'admission.question.additional.placeholder': '请详细描述您的期望和关注点...',
                'admission.report.title': '个性化学业规划报告',
                'admission.report.student': '学生信息',
                'admission.report.recommendations': '课程建议',
                'admission.report.timeline': '时间规划',
                'admission.report.expectations': '预期管理',
                'admission.report.nextsteps': '下一步建议',
                'admission.report.milestones': '关键里程碑',

                // 家校沟通
                'communication.title': '家校沟通平台',
                'communication.subtitle': '记录每个温馨瞬间，让家长感受孩子的校园生活',
                'communication.quickRecord': '快速记录',
                'communication.timeline': '互动时间线',
                'communication.student': '学生姓名',
                'communication.selectStudent': '选择学生',
                'communication.type': '互动类型',
                'communication.content': '记录内容',
                'communication.contentPlaceholder': '记录这个温馨的瞬间...',
                'communication.teacher': '老师姓名',
                'communication.teacherPlaceholder': '请输入您的姓名',
                'communication.type.academic': '学习表现',
                'communication.type.interaction': '课堂互动',
                'communication.type.activity': '课外活动',
                'communication.type.character': '品格表现',
                'communication.type.creativity': '创意表达',
                'communication.share': '分享给家长',
                'communication.bulkShare': '批量分享今日记录',
                'communication.export': '导出记录',
                'communication.statistics': '统计信息',
                'communication.justNow': '刚刚',
                'communication.minutesAgo': '分钟前',
                'communication.hoursAgo': '小时前',
                'communication.daysAgo': '天前',
                'communication.save': '保存记录',
                'communication.noRecords': '暂无记录',
                'communication.startRecording': '开始记录学生的精彩瞬间吧！',

                // 学业反馈
                'academic.title': '学业反馈分析',
                'academic.subtitle': '数据驱动的学业表现分析与发展建议',
                'academic.selectStudent': '选择学生：',
                'academic.radarChart': '学科表现雷达图',
                'academic.trendChart': '成绩趋势分析',
                'academic.aiReport': 'AI 智能分析报告',
                'academic.suggestions': '发展建议',
                'academic.keyMetrics': '关键指标',
                'academic.currentScore': '当前成绩',
                'academic.targetScore': '目标成绩',
                'academic.aiAnalysis': 'AI 学业分析总结',
                'academic.strengths': '优势分析',
                'academic.improvements': '改进建议',
                'academic.recommendations': '个性化建议',
                'academic.confidence': 'AI分析可信度：',
                'academic.generatedTime': '生成时间：',
                'academic.exportReport': '导出学业报告',
                'academic.generatePDF': '生成PDF报告',
                'academic.compareStudents': '学生对比',
                'academic.averageScore': '平均成绩',
                'academic.achievementRate': '目标达成率',
                'academic.balance': '学科均衡度',
                'academic.improvement': '进步幅度',
                'academic.academicPerformance': '学术表现',
                'academic.goalManagement': '目标管理',
                'academic.comprehensiveDevelopment': '全面发展',
                'academic.growthTrend': '成长趋势',

                // 升学指导
                'guidance.title': '升学指导系统',
                'guidance.subtitle': '可视化升学路径，智能目标调整与进度追踪',
                'guidance.selectStudent': '选择学生：',
                'guidance.pathwayChart': '升学路径图',
                'guidance.progressDashboard': '进度仪表盘',
                'guidance.milestoneTracker': '里程碑追踪',
                'guidance.resourceRecommendations': '资源推荐',
                'guidance.milestoneCompletion': '里程碑完成率',
                'guidance.currentAverage': '当前平均成绩',
                'guidance.targetGPA': '目标GPA',
                'guidance.ongoingProjects': '进行中项目',
                'guidance.targetUniversity': '目标院校',
                'guidance.addMilestone': '添加里程碑',
                'guidance.exportReport': '导出升学报告',
                'guidance.targetAdjustment': '智能目标调整',
                'guidance.completed': '已完成',
                'guidance.inProgress': '进行中',
                'guidance.pending': '待开始',
                'guidance.milestoneActions': '建议行动',
                'guidance.relatedResources': '相关资源',
                'guidance.startExecution': '开始执行',
                'guidance.markCompleted': '标记完成',

                // 表单验证
                'validation.required': '此字段为必填项',
                'validation.email': '请输入有效的邮箱地址',
                'validation.phone': '请输入有效的手机号码',
                'validation.minLength': '至少需要{0}个字符',
                'validation.maxLength': '不能超过{0}个字符',

                // 消息提示
                'message.saveSuccess': '保存成功！',
                'message.deleteSuccess': '删除成功！',
                'message.exportSuccess': '导出成功！',
                'message.shareSuccess': '分享成功！',
                'message.error': '操作失败，请重试',
                'message.networkError': '网络连接失败',
                'message.noData': '暂无数据',
                'message.loading': '正在加载...',
                'message.confirm.delete': '确定要删除这条记录吗？',
                'message.confirm.share': '确定要分享给家长吗？',

                // 时间格式
                'time.today': '今天',
                'time.yesterday': '昨天',
                'time.thisWeek': '本周',
                'time.thisMonth': '本月',
                'time.thisYear': '今年',
                'time.january': '一月',
                'time.february': '二月',
                'time.march': '三月',
                'time.april': '四月',
                'time.may': '五月',
                'time.june': '六月',
                'time.july': '七月',
                'time.august': '八月',
                'time.september': '九月',
                'time.october': '十月',
                'time.november': '十一月',
                'time.december': '十二月'
            },
            en: {
                // Common
                'common.loading': 'Loading...',
                'common.save': 'Save',
                'common.cancel': 'Cancel',
                'common.confirm': 'Confirm',
                'common.delete': 'Delete',
                'common.edit': 'Edit',
                'common.export': 'Export',
                'common.search': 'Search',
                'common.filter': 'Filter',
                'common.all': 'All',
                'common.submit': 'Submit',
                'common.reset': 'Reset',
                'common.close': 'Close',
                'common.back': 'Back',
                'common.next': 'Next',
                'common.previous': 'Previous',
                'common.finish': 'Finish',
                'common.view': 'View',
                'common.details': 'Details',
                'common.settings': 'Settings',
                'common.help': 'Help',
                'common.about': 'About',
                'common.language': 'Language',
                'common.chinese': '中文',
                'common.english': 'English',

                // Navigation
                'nav.logo': 'Smart Campus Portal',
                'nav.home': 'Home',
                'nav.admission': 'Admission',
                'nav.communication': 'Communication',
                'nav.academic': 'Academic',
                'nav.guidance': 'Guidance',
                'nav.admin': 'Admin',

                // Home Overview
                'home.overview.title': 'Monthly Data Trends',

                // Home
                'home.title': 'Smart Campus Data Overview',
                'home.subtitle': 'Comprehensive insight into school operations',
                'home.admission.title': 'Admission Consultation',
                'home.admission.desc': 'Intelligent admission process with personalized academic planning',
                'home.admission.count': 'Monthly Inquiries',
                'home.communication.title': 'School-Home Communication',
                'home.communication.desc': 'Record precious moments, strengthen school-home connections',
                'home.communication.count': 'Interaction Records',
                'home.academic.title': 'Academic Feedback',
                'home.academic.desc': 'Data-driven academic analysis and development reports',
                'home.academic.count': 'Academic Reports',
                'home.guidance.title': 'College Guidance',
                'home.guidance.desc': 'Visualized college pathways with intelligent goal adjustment',
                'home.guidance.count': 'College Plans',

                // Admission
                'admission.title': 'Intelligent Admission Consultation System',
                'admission.subtitle': 'Generate personalized academic planning reports through interactive Q&A',
                'admission.progress': 'Progress',
                'admission.progress.step': 'Step 1 of 5',
                'admission.restart': 'Restart',
                'admission.download': 'Download Report',
                'admission.generateReport': 'Generate Report',
                'admission.question.grade': 'What is your child\'s current grade?',
                'admission.question.grade.desc': 'Please select your child\'s current grade to help us create an appropriate academic plan.',
                'admission.question.interests': 'What are your child\'s interests and hobbies?',
                'admission.question.interests.desc': 'Understanding your child\'s interests helps us recommend suitable courses and activities.',
                'admission.question.goals': 'What are your educational goals for your child?',
                'admission.question.goals.desc': 'Clear educational goals help create targeted learning plans.',
                'admission.question.concerns': 'What educational concerns do you have?',
                'admission.question.concerns.desc': 'Understanding your concerns allows us to provide more targeted advice.',
                'admission.option.grade8': 'Grade 8 (Middle School)',
                'admission.option.grade9': 'Grade 9 (High School Freshman)',
                'admission.option.grade10': 'Grade 10 (High School Sophomore)',
                'admission.option.grade11': 'Grade 11 (High School Junior)',
                'admission.option.grade12': 'Grade 12 (High School Senior)',
                'admission.option.interests.science': 'Science & Technology',
                'admission.option.interests.arts': 'Arts & Creativity',
                'admission.option.interests.sports': 'Sports & Athletics',
                'admission.option.interests.language': 'Language & Literature',
                'admission.option.interests.business': 'Business & Economics',
                'admission.option.interests.social': 'Social Sciences',
                'admission.option.goals.university': 'Top University Admission',
                'admission.option.goals.skills': 'Practical Skills Development',
                'admission.option.goals.character': 'Comprehensive Character Development',
                'admission.option.goals.creativity': 'Creative Potential Activation',
                'admission.option.concerns.academic': 'Academic Performance Improvement',
                'admission.option.concerns.social': 'Social Skills Development',
                'admission.option.concerns.future': 'Future Career Planning',
                'admission.option.concerns.wellbeing': 'Physical & Mental Well-being',
                'admission.option.concerns.unknown': 'Uncertain, needs assessment',
                'admission.option.goals.mixed': 'Multiple countries, flexible options',
                'admission.option.interests.mixed': 'Comprehensive development, undecided',
                'admission.question.additional': 'What aspects would you like us to focus on?',
                'admission.question.additional.desc': 'Please describe your expectations and concerns about your child\'s education, such as academic improvement, interest development, character building, etc.',
                'admission.question.additional.placeholder': 'Please describe your expectations and concerns...',
                'admission.report.title': 'Personalized Academic Planning Report',
                'admission.report.student': 'Student Information',
                'admission.report.recommendations': 'Course Recommendations',
                'admission.report.timeline': 'Timeline Planning',
                'admission.report.expectations': 'Expectation Management',
                'admission.report.nextsteps': 'Next Steps',
                'admission.report.milestones': 'Key Milestones',

                // Communication
                'communication.title': 'School-Home Communication Platform',
                'communication.subtitle': 'Record every precious moment, let parents feel their child\'s campus life',
                'communication.quickRecord': 'Quick Record',
                'communication.timeline': 'Interaction Timeline',
                'communication.student': 'Student Name',
                'communication.selectStudent': 'Select Student',
                'communication.type': 'Interaction Type',
                'communication.content': 'Record Content',
                'communication.contentPlaceholder': 'Record this precious moment...',
                'communication.teacher': 'Teacher Name',
                'communication.teacherPlaceholder': 'Please enter your name',
                'communication.type.academic': 'Academic Performance',
                'communication.type.interaction': 'Classroom Interaction',
                'communication.type.activity': 'Extracurricular Activity',
                'communication.type.character': 'Character Development',
                'communication.type.creativity': 'Creative Expression',
                'communication.share': 'Share with Parents',
                'communication.bulkShare': 'Bulk Share Today\'s Records',
                'communication.export': 'Export Records',
                'communication.statistics': 'Statistics',
                'communication.justNow': 'Just now',
                'communication.minutesAgo': 'minutes ago',
                'communication.hoursAgo': 'hours ago',
                'communication.daysAgo': 'days ago',
                'communication.save': 'Save Record',
                'communication.noRecords': 'No records available',
                'communication.startRecording': 'Start recording students\' precious moments!',

                // Academic
                'academic.title': 'Academic Feedback Analysis',
                'academic.subtitle': 'Data-driven academic performance analysis and development recommendations',
                'academic.selectStudent': 'Select Student:',
                'academic.radarChart': 'Subject Performance Radar Chart',
                'academic.trendChart': 'Grade Trend Analysis',
                'academic.aiReport': 'AI Intelligent Analysis Report',
                'academic.suggestions': 'Development Suggestions',
                'academic.keyMetrics': 'Key Metrics',
                'academic.currentScore': 'Current Score',
                'academic.targetScore': 'Target Score',
                'academic.aiAnalysis': 'AI Academic Analysis Summary',
                'academic.strengths': 'Strengths Analysis',
                'academic.improvements': 'Improvement Suggestions',
                'academic.recommendations': 'Personalized Recommendations',
                'academic.confidence': 'AI Analysis Confidence:',
                'academic.generatedTime': 'Generated Time:',
                'academic.exportReport': 'Export Academic Report',
                'academic.generatePDF': 'Generate PDF Report',
                'academic.compareStudents': 'Compare Students',
                'academic.averageScore': 'Average Score',
                'academic.achievementRate': 'Achievement Rate',
                'academic.balance': 'Subject Balance',
                'academic.improvement': 'Improvement Range',
                'academic.academicPerformance': 'Academic Performance',
                'academic.goalManagement': 'Goal Management',
                'academic.comprehensiveDevelopment': 'Comprehensive Development',
                'academic.growthTrend': 'Growth Trend',

                // Guidance
                'guidance.title': 'College Guidance System',
                'guidance.subtitle': 'Visualized college pathways with intelligent goal adjustment and progress tracking',
                'guidance.selectStudent': 'Select Student:',
                'guidance.pathwayChart': 'College Pathway Chart',
                'guidance.progressDashboard': 'Progress Dashboard',
                'guidance.milestoneTracker': 'Milestone Tracker',
                'guidance.resourceRecommendations': 'Resource Recommendations',
                'guidance.milestoneCompletion': 'Milestone Completion Rate',
                'guidance.currentAverage': 'Current Average Score',
                'guidance.targetGPA': 'Target GPA',
                'guidance.ongoingProjects': 'Ongoing Projects',
                'guidance.targetUniversity': 'Target University',
                'guidance.addMilestone': 'Add Milestone',
                'guidance.exportReport': 'Export Guidance Report',
                'guidance.targetAdjustment': 'Intelligent Target Adjustment',
                'guidance.completed': 'Completed',
                'guidance.inProgress': 'In Progress',
                'guidance.pending': 'Pending',
                'guidance.milestoneActions': 'Suggested Actions',
                'guidance.relatedResources': 'Related Resources',
                'guidance.startExecution': 'Start Execution',
                'guidance.markCompleted': 'Mark Completed',

                // Form Validation
                'validation.required': 'This field is required',
                'validation.email': 'Please enter a valid email address',
                'validation.phone': 'Please enter a valid phone number',
                'validation.minLength': 'Minimum {0} characters required',
                'validation.maxLength': 'Maximum {0} characters allowed',

                // Messages
                'message.saveSuccess': 'Saved successfully!',
                'message.deleteSuccess': 'Deleted successfully!',
                'message.exportSuccess': 'Exported successfully!',
                'message.shareSuccess': 'Shared successfully!',
                'message.error': 'Operation failed, please try again',
                'message.networkError': 'Network connection failed',
                'message.noData': 'No data available',
                'message.loading': 'Loading...',
                'message.confirm.delete': 'Are you sure you want to delete this record?',
                'message.confirm.share': 'Are you sure you want to share with parents?',

                // Time Format
                'time.today': 'Today',
                'time.yesterday': 'Yesterday',
                'time.thisWeek': 'This Week',
                'time.thisMonth': 'This Month',
                'time.thisYear': 'This Year',
                'time.january': 'January',
                'time.february': 'February',
                'time.march': 'March',
                'time.april': 'April',
                'time.may': 'May',
                'time.june': 'June',
                'time.july': 'July',
                'time.august': 'August',
                'time.september': 'September',
                'time.october': 'October',
                'time.november': 'November',
                'time.december': 'December'
            }
        };
        this.init();
    }

    init() {
        // 等待DOM加载完成
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.updatePageLanguage();
                this.setupLanguageToggle();
            });
        } else {
            this.updatePageLanguage();
            this.setupLanguageToggle();
        }
    }

    // 获取翻译文本
    t(key, params = []) {
        const translation = this.translations[this.currentLang][key] || key;
        
        // 支持参数替换 {0}, {1}, etc.
        if (params.length > 0) {
            return translation.replace(/\{(\d+)\}/g, (match, index) => {
                return params[index] || match;
            });
        }
        
        return translation;
    }

    // 切换语言
    switchLanguage(lang) {
        if (this.translations[lang]) {
            this.currentLang = lang;
            localStorage.setItem('language', lang);
            this.updatePageLanguage();
            
            // 触发语言切换事件
            window.dispatchEvent(new CustomEvent('languageChanged', {
                detail: { language: lang }
            }));
        }
    }

    // 更新页面语言
    updatePageLanguage() {
        // 更新所有带有 data-i18n 属性的元素
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            const translation = this.t(key);
            
            if (element.tagName === 'INPUT' && (element.type === 'text' || element.type === 'email')) {
                element.placeholder = translation;
            } else if (element.tagName === 'TEXTAREA') {
                element.placeholder = translation;
            } else {
                element.textContent = translation;
            }
        });

        // 更新所有带有 data-i18n-placeholder 属性的元素
        document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
            const key = element.getAttribute('data-i18n-placeholder');
            element.placeholder = this.t(key);
        });

        // 更新所有带有 data-i18n-title 属性的元素
        document.querySelectorAll('[data-i18n-title]').forEach(element => {
            const key = element.getAttribute('data-i18n-title');
            element.title = this.t(key);
        });

        // 更新页面标题
        if (document.querySelector('[data-i18n-page-title]')) {
            const key = document.querySelector('[data-i18n-page-title]').getAttribute('data-i18n-page-title');
            document.title = this.t(key);
        }

        // 更新语言切换按钮状态
        this.updateLanguageToggle();
    }

    // 设置语言切换功能
    setupLanguageToggle() {
        // 创建语言切换按钮
        const languageToggle = document.createElement('div');
        languageToggle.className = 'language-toggle';
        languageToggle.innerHTML = `
            <button class="language-btn" id="languageToggle">
                <i class="fas fa-globe"></i>
                <span class="language-text">${this.currentLang === 'zh' ? '中文' : 'English'}</span>
                <i class="fas fa-chevron-down"></i>
            </button>
            <div class="language-dropdown" id="languageDropdown">
                <div class="language-option ${this.currentLang === 'zh' ? 'active' : ''}" data-lang="zh">
                    <span>中文</span>
                </div>
                <div class="language-option ${this.currentLang === 'en' ? 'active' : ''}" data-lang="en">
                    <span>English</span>
                </div>
            </div>
        `;

        // 添加到用户信息区域
        const userInfo = document.querySelector('.user-info');
        if (userInfo) {
            userInfo.insertBefore(languageToggle, userInfo.firstChild);
        }

        // 添加样式
        this.addLanguageToggleStyles();

        // 绑定事件
        this.bindLanguageToggleEvents();
    }

    // 添加语言切换样式
    addLanguageToggleStyles() {
        if (document.querySelector('#language-toggle-styles')) return;

        const styles = document.createElement('style');
        styles.id = 'language-toggle-styles';
        styles.textContent = `
            .language-toggle {
                position: relative;
                margin-right: 15px;
            }
            
            .language-btn {
                display: flex;
                align-items: center;
                gap: 8px;
                padding: 8px 12px;
                background: rgba(255, 255, 255, 0.1);
                border: 1px solid rgba(255, 255, 255, 0.2);
                border-radius: 20px;
                color: #666;
                cursor: pointer;
                transition: all 0.3s ease;
                font-size: 14px;
            }
            
            .language-btn:hover {
                background: rgba(255, 255, 255, 0.2);
                border-color: rgba(255, 255, 255, 0.3);
            }
            
            .language-dropdown {
                position: absolute;
                top: 100%;
                right: 0;
                background: white;
                border-radius: 10px;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
                min-width: 120px;
                opacity: 0;
                visibility: hidden;
                transform: translateY(-10px);
                transition: all 0.3s ease;
                z-index: 1000;
                margin-top: 5px;
            }
            
            .language-dropdown.show {
                opacity: 1;
                visibility: visible;
                transform: translateY(0);
            }
            
            .language-option {
                padding: 12px 16px;
                cursor: pointer;
                transition: background 0.3s ease;
                color: #333;
                font-size: 14px;
            }
            
            .language-option:first-child {
                border-radius: 10px 10px 0 0;
            }
            
            .language-option:last-child {
                border-radius: 0 0 10px 10px;
            }
            
            .language-option:hover {
                background: #f8f9fa;
            }
            
            .language-option.active {
                background: rgba(102, 126, 234, 0.1);
                color: #667eea;
                font-weight: 600;
            }
            
            .language-text {
                font-weight: 500;
            }
        `;
        document.head.appendChild(styles);
    }

    // 绑定语言切换事件
    bindLanguageToggleEvents() {
        const toggleBtn = document.getElementById('languageToggle');
        const dropdown = document.getElementById('languageDropdown');
        
        if (!toggleBtn || !dropdown) return;

        // 切换下拉菜单
        toggleBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            dropdown.classList.toggle('show');
        });

        // 选择语言
        dropdown.addEventListener('click', (e) => {
            const option = e.target.closest('.language-option');
            if (option) {
                const lang = option.getAttribute('data-lang');
                this.switchLanguage(lang);
                dropdown.classList.remove('show');
            }
        });

        // 点击外部关闭下拉菜单
        document.addEventListener('click', () => {
            dropdown.classList.remove('show');
        });
    }

    // 更新语言切换按钮状态
    updateLanguageToggle() {
        const languageText = document.querySelector('.language-text');
        if (languageText) {
            languageText.textContent = this.currentLang === 'zh' ? '中文' : 'English';
        }

        // 更新下拉菜单选项状态
        const options = document.querySelectorAll('.language-option');
        options.forEach(option => {
            const lang = option.getAttribute('data-lang');
            if (lang === this.currentLang) {
                option.classList.add('active');
            } else {
                option.classList.remove('active');
            }
        });
    }

    // 获取当前语言
    getCurrentLanguage() {
        return this.currentLang;
    }

    // 检查是否为中文
    isZh() {
        return this.currentLang === 'zh';
    }

    // 检查是否为英文
    isEn() {
        return this.currentLang === 'en';
    }
}

// 全局国际化实例
window.i18n = new I18n();

// 全局翻译函数
window.t = (key, params = []) => {
    return window.i18n.t(key, params);
};

// 监听语言切换事件
window.addEventListener('languageChanged', (e) => {
    console.log('Language changed to:', e.detail.language);
    
    // 重新渲染所有模块的动态内容
    if (window.app) {
        // 重新渲染当前页面
        const currentPage = window.app.currentPage;
        window.app.initializePage(currentPage);
    }
});
