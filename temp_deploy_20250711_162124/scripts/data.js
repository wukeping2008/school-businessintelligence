// 模拟数据
const mockData = {
    // 学生数据
    students: {
        '张小明': {
            name: '张小明',
            grade: '10年级',
            age: 16,
            interests: ['数学', '物理', '编程'],
            targetUniversities: ['MIT', '斯坦福大学', '清华大学'],
            currentGPA: 3.8,
            subjects: {
                '数学': { current: 92, trend: [85, 88, 90, 92], target: 95 },
                '物理': { current: 89, trend: [82, 85, 87, 89], target: 92 },
                '化学': { current: 86, trend: [80, 83, 85, 86], target: 90 },
                '英语': { current: 88, trend: [85, 86, 87, 88], target: 92 },
                '历史': { current: 84, trend: [78, 80, 82, 84], target: 88 },
                '生物': { current: 90, trend: [87, 88, 89, 90], target: 93 }
            },
            milestones: [
                { name: 'SAT考试', status: 'completed', score: '1450/1600', date: '2024-03-15' },
                { name: 'AP物理考试', status: 'in-progress', score: '预计5分', date: '2024-05-10' },
                { name: '科学竞赛', status: 'pending', score: '待参加', date: '2024-06-20' },
                { name: '暑期实习申请', status: 'pending', score: '待申请', date: '2024-04-01' }
            ]
        },
        '李小红': {
            name: '李小红',
            grade: '11年级',
            age: 17,
            interests: ['文学', '艺术', '心理学'],
            targetUniversities: ['哈佛大学', '耶鲁大学', '北京大学'],
            currentGPA: 3.9,
            subjects: {
                '数学': { current: 85, trend: [80, 82, 84, 85], target: 88 },
                '物理': { current: 82, trend: [78, 79, 81, 82], target: 85 },
                '化学': { current: 88, trend: [85, 86, 87, 88], target: 90 },
                '英语': { current: 95, trend: [92, 93, 94, 95], target: 96 },
                '历史': { current: 93, trend: [90, 91, 92, 93], target: 95 },
                '生物': { current: 87, trend: [84, 85, 86, 87], target: 90 }
            },
            milestones: [
                { name: 'SAT考试', status: 'completed', score: '1520/1600', date: '2024-03-15' },
                { name: 'AP英语考试', status: 'completed', score: '5分', date: '2024-05-08' },
                { name: '文学竞赛', status: 'in-progress', score: '进行中', date: '2024-06-15' },
                { name: '心理学研究项目', status: 'pending', score: '待开始', date: '2024-07-01' }
            ]
        },
        '王小华': {
            name: '王小华',
            grade: '9年级',
            age: 15,
            interests: ['体育', '数学', '计算机科学'],
            targetUniversities: ['加州理工', 'CMU', '上海交大'],
            currentGPA: 3.7,
            subjects: {
                '数学': { current: 94, trend: [88, 90, 92, 94], target: 96 },
                '物理': { current: 91, trend: [87, 88, 90, 91], target: 94 },
                '化学': { current: 83, trend: [78, 80, 82, 83], target: 87 },
                '英语': { current: 86, trend: [82, 84, 85, 86], target: 90 },
                '历史': { current: 81, trend: [76, 78, 80, 81], target: 85 },
                '生物': { current: 88, trend: [84, 86, 87, 88], target: 91 }
            },
            milestones: [
                { name: '数学竞赛', status: 'completed', score: '省级二等奖', date: '2024-02-20' },
                { name: '编程比赛', status: 'in-progress', score: '准备中', date: '2024-05-25' },
                { name: 'PSAT考试', status: 'pending', score: '待参加', date: '2024-10-15' },
                { name: '科技创新项目', status: 'pending', score: '待开始', date: '2024-08-01' }
            ]
        }
    },

    // 招生问卷数据
    admissionQuestions: [
        {
            id: 1,
            type: 'multiple-choice',
            question: '您孩子目前的年级是？',
            questionKey: 'admission.question.grade',
            description: '请选择孩子当前所在的年级，这将帮助我们制定合适的学业规划。',
            descriptionKey: 'admission.question.grade.desc',
            options: [
                { value: 'grade-8', label: '8年级（初二）', labelKey: 'admission.option.grade8' },
                { value: 'grade-9', label: '9年级（初三/高一）', labelKey: 'admission.option.grade9' },
                { value: 'grade-10', label: '10年级（高一/高二）', labelKey: 'admission.option.grade10' },
                { value: 'grade-11', label: '11年级（高二/高三）', labelKey: 'admission.option.grade11' },
                { value: 'grade-12', label: '12年级（高三）', labelKey: 'admission.option.grade12' }
            ]
        },
        {
            id: 2,
            type: 'multiple-choice',
            question: '孩子最感兴趣的学科领域是？',
            questionKey: 'admission.question.interests',
            description: '了解孩子的兴趣有助于我们推荐合适的课程和发展方向。',
            descriptionKey: 'admission.question.interests.desc',
            options: [
                { value: 'stem', label: 'STEM（科学、技术、工程、数学）', labelKey: 'admission.option.interests.science' },
                { value: 'humanities', label: '人文学科（文学、历史、哲学）', labelKey: 'admission.option.interests.language' },
                { value: 'arts', label: '艺术类（音乐、美术、戏剧）', labelKey: 'admission.option.interests.arts' },
                { value: 'social-sciences', label: '社会科学（心理学、经济学、政治学）', labelKey: 'admission.option.interests.social' },
                { value: 'languages', label: '语言类（英语、第二外语）', labelKey: 'admission.option.interests.language' },
                { value: 'mixed', label: '综合发展，暂未确定', labelKey: 'admission.option.interests.mixed' }
            ]
        },
        {
            id: 3,
            type: 'multiple-choice',
            question: '孩子的升学目标是？',
            questionKey: 'admission.question.goals',
            description: '明确的目标有助于我们制定针对性的升学规划策略。',
            descriptionKey: 'admission.question.goals.desc',
            options: [
                { value: 'top-us', label: '美国顶尖大学（藤校、TOP30）', labelKey: 'admission.option.goals.university' },
                { value: 'good-us', label: '美国优秀大学（TOP50-100）', labelKey: 'admission.option.goals.skills' },
                { value: 'top-uk', label: '英国顶尖大学（牛津、剑桥、G5）', labelKey: 'admission.option.goals.character' },
                { value: 'good-uk', label: '英国优秀大学（罗素集团）', labelKey: 'admission.option.goals.creativity' },
                { value: 'top-china', label: '国内顶尖大学（清北、C9联盟）', labelKey: 'admission.option.goals.university' },
                { value: 'mixed', label: '多国申请，保持选择灵活性', labelKey: 'admission.option.goals.mixed' }
            ]
        },
        {
            id: 4,
            type: 'multiple-choice',
            question: '孩子目前的学术水平如何？',
            questionKey: 'admission.question.concerns',
            description: '了解现状有助于我们评估提升空间和制定合理的时间规划。',
            descriptionKey: 'admission.question.concerns.desc',
            options: [
                { value: 'excellent', label: '优秀（年级前10%）', labelKey: 'admission.option.concerns.academic' },
                { value: 'good', label: '良好（年级前25%）', labelKey: 'admission.option.concerns.social' },
                { value: 'average', label: '中等（年级前50%）', labelKey: 'admission.option.concerns.future' },
                { value: 'below-average', label: '待提升（年级后50%）', labelKey: 'admission.option.concerns.wellbeing' },
                { value: 'unknown', label: '不确定，需要评估', labelKey: 'admission.option.concerns.unknown' }
            ]
        },
        {
            id: 5,
            type: 'text',
            question: '您希望我们重点关注哪些方面？',
            questionKey: 'admission.question.additional',
            description: '请详细描述您对孩子教育的期望和关注点，比如学术提升、兴趣培养、性格发展等。',
            descriptionKey: 'admission.question.additional.desc',
            placeholder: '请详细描述您的期望和关注点...',
            placeholderKey: 'admission.question.additional.placeholder'
        }
    ],

    // 家校沟通互动记录
    interactions: [
        {
            id: 1,
            student: '张小明',
            teacher: '李老师',
            type: '学习表现',
            content: '今天数学课上，张小明主动回答了一个很有挑战性的问题，思路清晰，解题过程完整。看得出他在课后做了很多练习，进步很明显！',
            date: '2024-03-10',
            time: '14:30',
            subject: '数学'
        },
        {
            id: 2,
            student: '李小红',
            teacher: '王老师',
            type: '课堂互动',
            content: '李小红在英语课堂讨论中表现出色，不仅语言表达流畅，而且观点独特有深度。她对文学作品的理解让我印象深刻。',
            date: '2024-03-10',
            time: '10:15',
            subject: '英语'
        },
        {
            id: 3,
            student: '王小华',
            teacher: '张老师',
            type: '课外活动',
            content: '王小华在今天的编程社团活动中帮助了几个同学解决技术问题，展现出很好的团队合作精神和技术能力。',
            date: '2024-03-09',
            time: '16:45',
            subject: '计算机'
        },
        {
            id: 4,
            student: '张小明',
            teacher: '陈老师',
            type: '品格表现',
            content: '课间休息时，张小明主动帮助清理实验室，还提醒同学们注意安全。这种责任心和助人为乐的品格值得表扬。',
            date: '2024-03-09',
            time: '11:20',
            subject: '物理'
        },
        {
            id: 5,
            student: '李小红',
            teacher: '赵老师',
            type: '创意表达',
            content: '李小红在历史课上分享的关于古代文明的演讲非常精彩，她用现代的视角重新解读历史事件，很有创意！',
            date: '2024-03-08',
            time: '15:20',
            subject: '历史'
        },
        {
            id: 6,
            student: '王小华',
            teacher: '刘老师',
            type: '学习表现',
            content: '王小华的数学作业质量一直很高，今天的几何证明题解法特别巧妙，显示出很强的逻辑思维能力。',
            date: '2024-03-08',
            time: '09:30',
            subject: '数学'
        }
    ],

    // 升学路径数据
    pathwayData: {
        '张小明': {
            currentLevel: 'high-school-sophomore',
            targetUniversity: 'MIT',
            targetMajor: '计算机科学',
            pathwayNodes: [
                {
                    id: 'current',
                    name: '当前状态',
                    type: 'current',
                    status: 'completed',
                    description: '10年级学生，GPA 3.8',
                    x: 100,
                    y: 300
                },
                {
                    id: 'sat-prep',
                    name: 'SAT备考',
                    type: 'milestone',
                    status: 'completed',
                    description: 'SAT 1450分',
                    x: 250,
                    y: 200
                },
                {
                    id: 'ap-courses',
                    name: 'AP课程',
                    type: 'milestone',
                    status: 'in-progress',
                    description: '物理、数学、计算机科学',
                    x: 400,
                    y: 250
                },
                {
                    id: 'competitions',
                    name: '学科竞赛',
                    type: 'milestone',
                    status: 'pending',
                    description: '数学、物理、编程竞赛',
                    x: 550,
                    y: 150
                },
                {
                    id: 'internship',
                    name: '实习经历',
                    type: 'milestone',
                    status: 'pending',
                    description: '科技公司暑期实习',
                    x: 700,
                    y: 300
                },
                {
                    id: 'application',
                    name: '大学申请',
                    type: 'milestone',
                    status: 'pending',
                    description: '准备申请材料',
                    x: 850,
                    y: 200
                },
                {
                    id: 'target',
                    name: 'MIT录取',
                    type: 'target',
                    status: 'pending',
                    description: '目标：MIT计算机科学',
                    x: 1000,
                    y: 250
                }
            ],
            connections: [
                { from: 'current', to: 'sat-prep' },
                { from: 'sat-prep', to: 'ap-courses' },
                { from: 'ap-courses', to: 'competitions' },
                { from: 'competitions', to: 'internship' },
                { from: 'internship', to: 'application' },
                { from: 'application', to: 'target' }
            ]
        },
        '李小红': {
            currentLevel: 'high-school-junior',
            targetUniversity: '哈佛大学',
            targetMajor: '心理学',
            pathwayNodes: [
                {
                    id: 'current',
                    name: '当前状态',
                    type: 'current',
                    status: 'completed',
                    description: '11年级学生，GPA 3.9',
                    x: 100,
                    y: 300
                },
                {
                    id: 'sat-completed',
                    name: 'SAT完成',
                    type: 'milestone',
                    status: 'completed',
                    description: 'SAT 1520分',
                    x: 250,
                    y: 200
                },
                {
                    id: 'ap-humanities',
                    name: 'AP人文课程',
                    type: 'milestone',
                    status: 'completed',
                    description: '英语文学5分',
                    x: 400,
                    y: 250
                },
                {
                    id: 'research-project',
                    name: '研究项目',
                    type: 'milestone',
                    status: 'in-progress',
                    description: '心理学独立研究',
                    x: 550,
                    y: 150
                },
                {
                    id: 'leadership',
                    name: '领导力活动',
                    type: 'milestone',
                    status: 'in-progress',
                    description: '学生会主席',
                    x: 700,
                    y: 300
                },
                {
                    id: 'early-application',
                    name: '提前申请',
                    type: 'milestone',
                    status: 'pending',
                    description: 'ED申请准备',
                    x: 850,
                    y: 200
                },
                {
                    id: 'harvard-target',
                    name: '哈佛录取',
                    type: 'target',
                    status: 'pending',
                    description: '目标：哈佛心理学',
                    x: 1000,
                    y: 250
                }
            ],
            connections: [
                { from: 'current', to: 'sat-completed' },
                { from: 'sat-completed', to: 'ap-humanities' },
                { from: 'ap-humanities', to: 'research-project' },
                { from: 'research-project', to: 'leadership' },
                { from: 'leadership', to: 'early-application' },
                { from: 'early-application', to: 'harvard-target' }
            ]
        },
        '王小华': {
            currentLevel: 'high-school-freshman',
            targetUniversity: '加州理工',
            targetMajor: '数学',
            pathwayNodes: [
                {
                    id: 'current',
                    name: '当前状态',
                    type: 'current',
                    status: 'completed',
                    description: '9年级学生，GPA 3.7',
                    x: 100,
                    y: 300
                },
                {
                    id: 'math-competition',
                    name: '数学竞赛',
                    type: 'milestone',
                    status: 'completed',
                    description: '省级二等奖',
                    x: 250,
                    y: 200
                },
                {
                    id: 'advanced-math',
                    name: '高级数学',
                    type: 'milestone',
                    status: 'in-progress',
                    description: '微积分预备课程',
                    x: 400,
                    y: 250
                },
                {
                    id: 'programming',
                    name: '编程技能',
                    type: 'milestone',
                    status: 'in-progress',
                    description: 'Python, Java学习',
                    x: 550,
                    y: 150
                },
                {
                    id: 'psat',
                    name: 'PSAT考试',
                    type: 'milestone',
                    status: 'pending',
                    description: '标准化考试准备',
                    x: 700,
                    y: 300
                },
                {
                    id: 'summer-program',
                    name: '暑期项目',
                    type: 'milestone',
                    status: 'pending',
                    description: '数学夏令营',
                    x: 850,
                    y: 200
                },
                {
                    id: 'caltech-target',
                    name: '加州理工录取',
                    type: 'target',
                    status: 'pending',
                    description: '目标：加州理工数学',
                    x: 1000,
                    y: 250
                }
            ],
            connections: [
                { from: 'current', to: 'math-competition' },
                { from: 'math-competition', to: 'advanced-math' },
                { from: 'advanced-math', to: 'programming' },
                { from: 'programming', to: 'psat' },
                { from: 'psat', to: 'summer-program' },
                { from: 'summer-program', to: 'caltech-target' }
            ]
        }
    },

    // 资源推荐数据
    resources: {
        '张小明': [
            {
                title: 'MIT OpenCourseWare - 计算机科学导论',
                description: '免费的MIT计算机科学课程，适合提前了解大学课程内容',
                type: '在线课程',
                url: 'https://ocw.mit.edu'
            },
            {
                title: 'Codecademy Python课程',
                description: '交互式编程学习平台，适合初学者系统学习Python',
                type: '编程学习',
                url: 'https://codecademy.com'
            },
            {
                title: 'Khan Academy SAT数学',
                description: '免费的SAT数学备考资源，有针对性的练习题',
                type: '考试准备',
                url: 'https://khanacademy.org'
            }
        ],
        '李小红': [
            {
                title: 'TED-Ed心理学视频',
                description: '高质量的心理学科普视频，拓展学科视野',
                type: '学科拓展',
                url: 'https://ed.ted.com'
            },
            {
                title: 'Coursera心理学导论',
                description: '耶鲁大学的心理学入门课程，了解专业基础',
                type: '在线课程',
                url: 'https://coursera.org'
            },
            {
                title: 'College Board AP英语资源',
                description: 'AP英语文学官方备考资源和样题',
                type: '考试准备',
                url: 'https://collegeboard.org'
            }
        ],
        '王小华': [
            {
                title: 'Art of Problem Solving',
                description: '数学竞赛训练的权威平台，提供系统的竞赛数学课程',
                type: '竞赛准备',
                url: 'https://artofproblemsolving.com'
            },
            {
                title: 'Brilliant数学课程',
                description: '互动式数学学习平台，适合培养数学思维',
                type: '数学学习',
                url: 'https://brilliant.org'
            },
            {
                title: 'HackerRank编程练习',
                description: '编程技能提升平台，有丰富的算法题目',
                type: '编程练习',
                url: 'https://hackerrank.com'
            }
        ]
    },

    // AI报告模板
    aiReportTemplates: {
        academic: {
            '张小明': {
                summary: '张小明同学在理科方面表现突出，特别是数学和物理成绩优异。从趋势分析来看，各科成绩都在稳步提升，显示出良好的学习能力和自我管理能力。',
                strengths: [
                    '数学逻辑思维能力强，解题思路清晰',
                    '物理概念理解深入，能够灵活运用',
                    '学习态度认真，课后练习充分',
                    '对STEM领域有浓厚兴趣和天赋'
                ],
                improvements: [
                    '英语写作能力需要进一步提升',
                    '历史学科的记忆和理解需要加强',
                    '可以尝试更多跨学科的学习项目'
                ],
                recommendations: [
                    '建议参加数学和物理竞赛，展示学术能力',
                    '加强英语阅读和写作练习，为标准化考试做准备',
                    '考虑参与科研项目或实习，积累实践经验'
                ]
            },
            '李小红': {
                summary: '李小红同学在人文学科方面表现卓越，英语和历史成绩特别突出。她具有优秀的语言表达能力和深度思考能力，在文学理解和历史分析方面展现出独特的见解。',
                strengths: [
                    '英语语言能力出色，文学理解深刻',
                    '历史分析能力强，能够独立思考',
                    '表达能力优秀，善于沟通交流',
                    '对人文社科领域有深厚兴趣'
                ],
                improvements: [
                    '理科成绩需要保持稳定提升',
                    '可以加强数据分析和统计学习',
                    '建议培养更多领导力经验'
                ],
                recommendations: [
                    '建议参加文学竞赛和辩论比赛',
                    '考虑进行心理学相关的研究项目',
                    '积极参与学生组织，培养领导能力'
                ]
            },
            '王小华': {
                summary: '王小华同学数学天赋突出，在逻辑思维和问题解决方面表现优异。虽然年级较低，但已经展现出很强的学术潜力，特别是在STEM领域。',
                strengths: [
                    '数学能力突出，逻辑思维清晰',
                    '学习能力强，成绩提升明显',
                    '对编程和计算机科学有兴趣',
                    '具备良好的团队合作精神'
                ],
                improvements: [
                    '文科成绩需要均衡发展',
                    '英语表达能力需要加强',
                    '可以培养更多课外兴趣爱好'
                ],
                recommendations: [
                    '继续参加数学竞赛，争取更好成绩',
                    '系统学习编程，参与相关项目',
                    '加强英语学习，为将来标准化考试做准备'
                ]
            }
        }
    }
};

// 导出数据供其他脚本使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = mockData;
}
