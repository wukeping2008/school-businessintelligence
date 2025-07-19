import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';

// Initialize Express app
const app = express();
const httpServer = createServer(app);

// Initialize Socket.io
const io = new Server(httpServer, {
  cors: {
    origin: 'http://localhost:5173',
    credentials: true
  }
});

// Middleware
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

// Mock data
const mockStudents = [
  {
    _id: '1',
    basicInfo: {
      name: '李明',
      grade: '高二',
      class: '3',
      studentId: 'S20230001',
      enrollmentDate: new Date('2023-09-01')
    },
    targetUniversities: {
      primary: {
        id: '1',
        name: '剑桥大学',
        country: '英国',
        major: '计算机科学',
        ranking: 2,
        requirements: {}
      },
      alternatives: [],
      lastUpdated: new Date()
    },
    academicStatus: {
      currentGPA: 3.85,
      subjects: [],
      standardizedTests: []
    },
    relatedTeachers: [],
    status: 'normal',
    pathwayProgress: 65
  },
  {
    _id: '2',
    basicInfo: {
      name: '王芳',
      grade: '高三',
      class: '1',
      studentId: 'S20230002',
      enrollmentDate: new Date('2022-09-01')
    },
    targetUniversities: {
      primary: {
        id: '2',
        name: '牛津大学',
        country: '英国',
        major: '经济学',
        ranking: 1,
        requirements: {}
      },
      alternatives: [],
      lastUpdated: new Date()
    },
    academicStatus: {
      currentGPA: 3.92,
      subjects: [],
      standardizedTests: []
    },
    relatedTeachers: [],
    status: 'risk',
    pathwayProgress: 45
  }
];

const mockPathway = {
  _id: '1',
  studentId: '1',
  targetUniversity: {
    id: '1',
    name: '剑桥大学',
    country: '英国',
    major: '计算机科学',
    requirements: {}
  },
  milestones: [
    {
      id: '1',
      type: 'exam',
      category: 'standardized_test',
      title: 'IELTS 考试',
      description: '目标分数 7.5，当前模考 6.5',
      plannedDate: new Date('2024-03-15'),
      status: 'in_progress',
      priority: 'high',
      progress: 60,
      dependencies: [],
      assignedTo: ['teacher1'],
      actionItems: [],
      attachments: []
    },
    {
      id: '2',
      type: 'exam',
      category: 'academic',
      title: 'A-Level 数学考试',
      description: '目标成绩 A*',
      plannedDate: new Date('2024-05-20'),
      status: 'pending',
      priority: 'critical',
      progress: 0,
      dependencies: [],
      assignedTo: ['teacher2'],
      actionItems: [],
      attachments: []
    },
    {
      id: '3',
      type: 'application',
      category: 'application',
      title: '提交UCAS申请',
      description: '完成大学申请表和个人陈述',
      plannedDate: new Date('2024-10-15'),
      status: 'pending',
      priority: 'critical',
      progress: 0,
      dependencies: ['1', '2'],
      assignedTo: ['counselor1'],
      actionItems: [],
      attachments: []
    }
  ],
  status: 'active',
  version: 1,
  adjustmentHistory: [],
  overallProgress: 30
};

// Mock API Routes
app.post('/api/v1/auth/login', (req, res) => {
  const { username, password } = req.body;
  if (username === 'admin' && password === '123456') {
    res.json({
      success: true,
      data: {
        user: {
          id: '1',
          username: 'admin',
          email: 'admin@hdschools.com',
          role: 'admin',
          permissions: ['view_all_students', 'manage_pathways']
        },
        token: 'mock-jwt-token',
        refreshToken: 'mock-refresh-token'
      }
    });
  } else {
    res.status(401).json({
      success: false,
      error: '用户名或密码错误'
    });
  }
});

app.get('/api/v1/students', (req, res) => {
  res.json({
    success: true,
    data: {
      students: mockStudents,
      pagination: {
        total: mockStudents.length,
        page: 1,
        limit: 20,
        pages: 1
      }
    }
  });
});

app.get('/api/v1/students/:id', (req, res) => {
  const student = mockStudents.find(s => s._id === req.params.id);
  if (student) {
    res.json({
      success: true,
      data: { student }
    });
  } else {
    res.status(404).json({
      success: false,
      error: '学生不存在'
    });
  }
});

app.get('/api/v1/pathways/student/:studentId', (req, res) => {
  if (req.params.studentId === '1') {
    res.json({
      success: true,
      data: { pathway: mockPathway }
    });
  } else {
    res.json({
      success: true,
      data: { pathway: null }
    });
  }
});

app.put('/api/v1/pathways/:pathwayId/milestones/:milestoneId', (req, res) => {
  const milestone = mockPathway.milestones.find(m => m.id === req.params.milestoneId);
  if (milestone) {
    Object.assign(milestone, req.body);
    res.json({
      success: true,
      data: { pathway: mockPathway }
    });
  } else {
    res.status(404).json({
      success: false,
      error: '里程碑不存在'
    });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: 'development'
  });
});

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log(`Client connected: ${socket.id}`);
  
  socket.on('join-student-room', (studentId: string) => {
    socket.join(`student:${studentId}`);
    console.log(`Socket ${socket.id} joined room: student:${studentId}`);
  });
  
  socket.on('disconnect', () => {
    console.log(`Client disconnected: ${socket.id}`);
  });
});

// Start server
const PORT = 3001;
httpServer.listen(PORT, () => {
  console.log(`Mock server running on port ${PORT}`);
  console.log(`API available at http://localhost:${PORT}/api/v1`);
  console.log('\n可以使用以下账号登录:');
  console.log('用户名: admin');
  console.log('密码: 123456');
});