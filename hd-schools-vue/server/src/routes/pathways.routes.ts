import { Router } from 'express';
import { body, param } from 'express-validator';
import mongoose from 'mongoose';
import { Pathway } from '../models/pathway.model';
import { Student } from '../models/student.model';
import { Notification } from '../models/notification.model';
import { authenticate, authorize } from '../middleware/auth.middleware';
import { validateRequest } from '../middleware/validation.middleware';
import { asyncHandler, AppError } from '../middleware/error.middleware';
import logger from '../config/logger';

const router = Router();

// 获取学生的升学路径
router.get('/student/:studentId',
  authenticate,
  asyncHandler(async (req: any, res) => {
    const { studentId } = req.params;
    
    // 验证学生存在且有权限
    const student = await Student.findById(studentId);
    if (!student) {
      throw new AppError('学生不存在', 404);
    }
    
    // 检查权限
    if (!req.user.hasPermission('view_all_students')) {
      const isAssigned = student.relatedTeachers.some(
        t => t.teacherId === req.user._id.toString()
      );
      if (!isAssigned) {
        throw new AppError('无权查看该学生的升学路径', 403);
      }
    }
    
    const pathway = await Pathway.findOne({ 
      studentId, 
      status: 'active' 
    });
    
    res.json({
      success: true,
      data: { pathway }
    });
  })
);

// 创建升学路径
router.post('/',
  authenticate,
  authorize('manage_pathways'),
  [
    body('studentId').notEmpty().withMessage('请选择学生'),
    body('targetUniversity').isObject().withMessage('请设置目标大学'),
    body('milestones').isArray({ min: 1 }).withMessage('请至少添加一个里程碑')
  ],
  validateRequest,
  asyncHandler(async (req: any, res) => {
    const { studentId, targetUniversity, milestones } = req.body;
    
    // 检查学生是否已有活跃路径
    const existingPathway = await Pathway.findOne({
      studentId,
      status: 'active'
    });
    
    if (existingPathway) {
      throw new AppError('该学生已有活跃的升学路径', 400);
    }
    
    // 生成里程碑ID
    const milestonesWithIds = milestones.map((m: any) => ({
      ...m,
      id: new mongoose.Types.ObjectId().toString()
    }));
    
    const pathway = new Pathway({
      studentId,
      targetUniversity,
      milestones: milestonesWithIds
    });
    
    await pathway.save();
    
    // 通知相关教师
    const student = await Student.findById(studentId);
    if (student) {
      const io = req.app.get('io');
      student.relatedTeachers.forEach(teacher => {
        io.to(`teacher:${teacher.teacherId}`).emit('pathway.created', {
          studentId: student._id,
          studentName: student.basicInfo.name,
          pathwayId: pathway._id
        });
      });
    }
    
    logger.info(`Pathway created for student ${studentId} by ${req.user.username}`);
    
    res.status(201).json({
      success: true,
      data: { pathway }
    });
  })
);

// 更新里程碑
router.put('/:pathwayId/milestones/:milestoneId',
  authenticate,
  authorize('manage_milestones'),
  validateRequest,
  asyncHandler(async (req: any, res) => {
    const { pathwayId, milestoneId } = req.params;
    const updates = req.body;
    
    const pathway = await Pathway.findById(pathwayId);
    if (!pathway) {
      throw new AppError('升学路径不存在', 404);
    }
    
    // 检查权限
    const student = await Student.findById(pathway.studentId);
    if (!req.user.hasPermission('manage_pathways')) {
      const isAssigned = student?.relatedTeachers.some(
        t => t.teacherId === req.user._id.toString()
      );
      if (!isAssigned) {
        throw new AppError('无权修改该里程碑', 403);
      }
    }
    
    await pathway.updateMilestone(milestoneId, updates);
    
    // 检查是否需要发送通知
    const milestone = pathway.milestones.find((m: any) => m.id === milestoneId);
    if (milestone && updates.status === 'delayed') {
      // 创建延期通知
      if (student) {
        for (const teacher of student.relatedTeachers) {
          await Notification.createMilestoneNotification(
            teacher.teacherId,
            milestone,
            'milestone_delayed'
          );
        }
      }
    }
    
    // 实时通知
    const io = req.app.get('io');
    io.to(`student:${pathway.studentId}`).emit('milestone.updated', {
      pathwayId,
      milestoneId,
      updates
    });
    
    res.json({
      success: true,
      data: { pathway }
    });
  })
);

// 添加里程碑
router.post('/:pathwayId/milestones',
  authenticate,
  authorize('manage_milestones'),
  [
    body('type').isIn(['exam', 'application', 'activity', 'achievement', 'document'])
      .withMessage('无效的里程碑类型'),
    body('title').trim().notEmpty().withMessage('请输入里程碑标题'),
    body('plannedDate').isISO8601().withMessage('请输入有效的计划日期'),
    body('priority').isIn(['critical', 'high', 'medium', 'low']).withMessage('无效的优先级')
  ],
  validateRequest,
  asyncHandler(async (req: any, res) => {
    const pathway = await Pathway.findById(req.params.pathwayId);
    if (!pathway) {
      throw new AppError('升学路径不存在', 404);
    }
    
    const milestone = {
      ...req.body,
      id: new mongoose.Types.ObjectId().toString(),
      status: 'pending',
      progress: 0,
      actionItems: [],
      attachments: []
    };
    
    await pathway.addMilestone(milestone);
    
    // 记录调整历史
    await pathway.addAdjustment({
      type: 'milestone_adjust',
      description: `添加新里程碑: ${milestone.title}`,
      reason: req.body.reason || '计划调整',
      madeBy: req.user._id.toString()
    });
    
    res.json({
      success: true,
      data: { pathway }
    });
  })
);

// 更新里程碑进度
router.patch('/:pathwayId/milestones/:milestoneId/progress',
  authenticate,
  [
    body('progress').isInt({ min: 0, max: 100 }).withMessage('进度必须在0-100之间')
  ],
  validateRequest,
  asyncHandler(async (req: any, res) => {
    const { pathwayId, milestoneId } = req.params;
    const { progress } = req.body;
    
    const pathway = await Pathway.findById(pathwayId);
    if (!pathway) {
      throw new AppError('升学路径不存在', 404);
    }
    
    const milestone = pathway.milestones.find((m: any) => m.id === milestoneId);
    if (!milestone) {
      throw new AppError('里程碑不存在', 404);
    }
    
    // 更新进度和状态
    const updates: any = { progress };
    if (progress === 0) {
      updates.status = 'pending';
    } else if (progress === 100) {
      updates.status = 'completed';
      updates.actualDate = new Date();
    } else {
      updates.status = 'in_progress';
    }
    
    await pathway.updateMilestone(milestoneId, updates);
    
    // 实时通知
    const io = req.app.get('io');
    io.to(`student:${pathway.studentId}`).emit('milestone.progress', {
      pathwayId,
      milestoneId,
      progress,
      status: updates.status
    });
    
    res.json({
      success: true,
      data: { 
        milestone: pathway.milestones.find((m: any) => m.id === milestoneId),
        overallProgress: pathway.overallProgress
      }
    });
  })
);

// 添加Action Item到里程碑
router.post('/:pathwayId/milestones/:milestoneId/action-items',
  authenticate,
  authorize('manage_milestones'),
  [
    body('title').trim().notEmpty().withMessage('请输入任务标题'),
    body('assignedTo').notEmpty().withMessage('请指定负责人'),
    body('priority').isIn(['high', 'medium', 'low']).withMessage('无效的优先级')
  ],
  validateRequest,
  asyncHandler(async (req: any, res) => {
    const { pathwayId, milestoneId } = req.params;
    
    const pathway = await Pathway.findById(pathwayId);
    if (!pathway) {
      throw new AppError('升学路径不存在', 404);
    }
    
    const milestone = pathway.milestones.find((m: any) => m.id === milestoneId);
    if (!milestone) {
      throw new AppError('里程碑不存在', 404);
    }
    
    const actionItem = {
      ...req.body,
      id: new mongoose.Types.ObjectId().toString(),
      completed: false
    };
    
    milestone.actionItems.push(actionItem);
    await pathway.save();
    
    // 通知被分配的教师
    await Notification.create({
      userId: actionItem.assignedTo,
      type: 'action_assigned',
      title: '新的任务分配',
      message: `您被分配了新任务: ${actionItem.title}`,
      priority: actionItem.priority === 'high' ? 'high' : 'normal',
      relatedEntity: {
        type: 'milestone',
        id: milestoneId
      }
    });
    
    const io = req.app.get('io');
    io.to(`teacher:${actionItem.assignedTo}`).emit('actionItem.assigned', {
      pathwayId,
      milestoneId,
      actionItem
    });
    
    res.json({
      success: true,
      data: { actionItem }
    });
  })
);

export default router;