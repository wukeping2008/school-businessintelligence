// 模拟启动脚本，不需要MongoDB
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Mock auth routes
app.post('/api/auth/register', (req, res) => {
  res.json({
    success: true,
    data: {
      user: {
        id: '1',
        username: req.body.username,
        email: req.body.email,
        role: req.body.role,
        permissions: ['view_all_students', 'edit_all_students']
      },
      token: 'mock-token-123',
      refreshToken: 'mock-refresh-token-123'
    }
  });
});

app.post('/api/auth/login', (req, res) => {
  res.json({
    success: true,
    data: {
      user: {
        id: '1',
        username: 'teacher',
        email: 'teacher@school.com',
        role: 'teacher',
        permissions: ['view_all_students', 'edit_all_students']
      },
      token: 'mock-token-123',
      refreshToken: 'mock-refresh-token-123'
    }
  });
});

// Mock student routes
app.get('/api/students', (req, res) => {
  res.json({
    success: true,
    data: {
      students: [],
      total: 0,
      page: 1,
      limit: 10
    }
  });
});

// Mock teacher invitation endpoint
app.post('/api/teachers/invite', (req, res) => {
  res.json({
    success: true,
    data: {
      invitation: {
        id: 'inv-123',
        email: req.body.email,
        role: req.body.role,
        status: 'pending',
        invitedBy: 'current-user',
        createdAt: new Date()
      }
    }
  });
});

// Mock meeting endpoint
app.post('/api/meetings', (req, res) => {
  res.json({
    success: true,
    data: {
      meeting: {
        id: 'meet-123',
        title: req.body.title,
        participants: req.body.participants,
        scheduledAt: req.body.scheduledAt,
        meetingUrl: 'https://meet.example.com/123',
        status: 'scheduled',
        createdBy: 'current-user',
        createdAt: new Date()
      }
    }
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', mode: 'mock' });
});

// Socket.io setup
const http = require('http');
const { Server } = require('socket.io');
const httpServer = http.createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Start server
httpServer.listen(PORT, () => {
  console.log(`Mock server running on port ${PORT}`);
  console.log('Available endpoints:');
  console.log('  POST /api/auth/login');
  console.log('  POST /api/auth/register');
  console.log('  GET  /api/students');
  console.log('  POST /api/teachers/invite');
  console.log('  POST /api/meetings');
  console.log('  GET  /api/health');
});