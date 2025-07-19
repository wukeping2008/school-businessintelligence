import { Router } from 'express';
import { body, param, query } from 'express-validator';
import { Student } from '../models/student.model';
import { authenticate, authorize } from '../middleware/auth.middleware';
import { validateRequest } from '../middleware/validation.middleware';
import { asyncHandler, AppError } from '../middleware/error.middleware';
import logger from '../config/logger';

const router = Router();

// 获取学生列表
router.get('/',
  authenticate,
  authorize('view_all_students', 'view_assigned_students'),
  asyncHandler(async (req: any, res) => {
    const {
      page = 1,
      limit = 20,
      grade,
      class: className,
      search
    } = req.query;
    
    // 构建查询条件
    const query: any = {};
    
    // 如果用户只能查看分配的学生
    if (!req.user.hasPermission('view_all_students')) {
      query['relatedTeachers.teacherId'] = req.user._id.toString();
    }
    
    if (grade) query['basicInfo.grade'] = grade;
    if (className) query['basicInfo.class'] = className;
    if (search) {
      query.$or = [
        { 'basicInfo.name': new RegExp(search, 'i') },
        { 'basicInfo.studentId': new RegExp(search, 'i') }
      ];
    }
    
    const students = await Student.find(query)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ 'basicInfo.grade': 1, 'basicInfo.class': 1, 'basicInfo.name': 1 });
    
    const total = await Student.countDocuments(query);
    
    res.json({
      success: true,
      data: {
        students,
        pagination: {
          total,
          page: Number(page),
          limit: Number(limit),
          pages: Math.ceil(total / limit)
        }
      }
    });
  })
);

// 获取单个学生详情
router.get('/:id',
  authenticate,
  authorize('view_all_students', 'view_assigned_students'),
  asyncHandler(async (req: any, res) => {
    const student = await Student.findById(req.params.id);
    
    if (!student) {
      throw new AppError('学生不存在', 404);
    }
    
    // 检查权限
    if (!req.user.hasPermission('view_all_students')) {
      const isAssigned = student.relatedTeachers.some(
        t => t.teacherId === req.user._id.toString()
      );
      if (!isAssigned) {
        throw new AppError('无权查看该学生信息', 403);
      }
    }
    
    res.json({
      success: true,
      data: { student }
    });
  })
);

// 创建学生
router.post('/',
  authenticate,
  authorize('edit_all_students'),
  [
    body('basicInfo.name').trim().notEmpty().withMessage('请输入学生姓名'),
    body('basicInfo.grade').trim().notEmpty().withMessage('请输入年级'),
    body('basicInfo.class').trim().notEmpty().withMessage('请输入班级'),
    body('basicInfo.studentId').trim().notEmpty().withMessage('请输入学号'),
    body('basicInfo.enrollmentDate').isISO8601().withMessage('请输入有效的入学日期'),
    body('targetUniversities.primary').isObject().withMessage('请设置目标大学'),
    body('academicStatus.currentGPA').isFloat({ min: 0, max: 4.0 }).withMessage('GPA必须在0-4.0之间')
  ],
  validateRequest,
  asyncHandler(async (req: any, res) => {
    // 检查学号是否已存在
    const existing = await Student.findOne({
      'basicInfo.studentId': req.body.basicInfo.studentId
    });
    
    if (existing) {
      throw new AppError('学号已存在', 400);
    }
    
    const student = new Student(req.body);
    await student.save();
    
    logger.info(`New student created: ${student.basicInfo.name} by ${req.user.username}`);
    
    res.status(201).json({
      success: true,
      data: { student }
    });
  })
);

// 更新学生信息
router.put('/:id',
  authenticate,
  authorize('edit_all_students', 'edit_assigned_students'),
  validateRequest,
  asyncHandler(async (req: any, res) => {
    const student = await Student.findById(req.params.id);
    
    if (!student) {
      throw new AppError('学生不存在', 404);
    }
    
    // 检查权限
    if (!req.user.hasPermission('edit_all_students')) {
      const isAssigned = student.relatedTeachers.some(
        t => t.teacherId === req.user._id.toString()
      );
      if (!isAssigned) {
        throw new AppError('无权编辑该学生信息', 403);
      }
    }
    
    // 更新学生信息
    Object.assign(student, req.body);
    await student.save();
    
    logger.info(`Student updated: ${student.basicInfo.name} by ${req.user.username}`);
    
    res.json({
      success: true,
      data: { student }
    });
  })
);

// 添加关联教师
router.post('/:id/teachers',
  authenticate,
  authorize('edit_all_students'),
  [
    body('teacherId').notEmpty().withMessage('请选择教师'),
    body('role').isIn(['subject_teacher', 'counselor', 'homeroom_teacher', 'coordinator'])
      .withMessage('无效的教师角色'),
    body('subjects').optional().isArray().withMessage('科目必须是数组')
  ],
  validateRequest,
  asyncHandler(async (req: any, res) => {
    const student = await Student.findById(req.params.id);
    
    if (!student) {
      throw new AppError('学生不存在', 404);
    }
    
    const teacherRole = {
      teacherId: req.body.teacherId,
      role: req.body.role,
      subjects: req.body.subjects || [],
      startDate: new Date()
    };
    
    await student.addTeacher(teacherRole);
    
    // 通知相关教师
    const io = req.app.get('io');
    io.to(`teacher:${req.body.teacherId}`).emit('student.assigned', {
      studentId: student._id,
      studentName: student.basicInfo.name
    });
    
    res.json({
      success: true,
      data: { student }
    });
  })
);

// 更新目标大学
router.put('/:id/target-university',
  authenticate,
  authorize('edit_all_students', 'edit_assigned_students'),
  [
    body('university').isObject().withMessage('请提供大学信息'),
    body('reason').trim().notEmpty().withMessage('请说明修改原因')
  ],
  validateRequest,
  asyncHandler(async (req: any, res) => {
    const student = await Student.findById(req.params.id);
    
    if (!student) {
      throw new AppError('学生不存在', 404);
    }
    
    await student.updateTargetUniversity(req.body.university, req.body.reason);
    
    // 通知所有相关教师
    const io = req.app.get('io');
    student.relatedTeachers.forEach(teacher => {
      io.to(`teacher:${teacher.teacherId}`).emit('student.targetUpdated', {
        studentId: student._id,
        studentName: student.basicInfo.name,
        newTarget: req.body.university.name,
        reason: req.body.reason
      });
    });
    
    logger.info(`Target university updated for ${student.basicInfo.name}: ${req.body.university.name}`);
    
    res.json({
      success: true,
      data: { student }
    });
  })
);

export default router;