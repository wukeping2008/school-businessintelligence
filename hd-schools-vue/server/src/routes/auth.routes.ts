import { Router, Request, Response } from 'express';
import { body } from 'express-validator';
import { User } from '../models/user.model';
import { generateToken, generateRefreshToken } from '../utils/jwt.utils';
import { validateRequest } from '../middleware/validation.middleware';
import { asyncHandler } from '../middleware/error.middleware';
import { authenticate } from '../middleware/auth.middleware';
import logger from '../config/logger';
import '../types/index';

const router = Router();

// 注册
router.post('/register',
  [
    body('username').trim().isLength({ min: 3 }).withMessage('用户名至少3个字符'),
    body('email').isEmail().normalizeEmail().withMessage('请输入有效的邮箱'),
    body('password').isLength({ min: 6 }).withMessage('密码至少6个字符'),
    body('role').isIn(['teacher', 'counselor', 'admin']).withMessage('无效的角色'),
    body('subjects').optional().isArray().withMessage('科目必须是数组')
  ],
  validateRequest,
  asyncHandler(async (req: Request, res: Response) => {
    const { username, email, password, role, subjects } = req.body;
    
    // 检查用户是否已存在
    const existingUser = await User.findOne({
      $or: [{ username }, { email }]
    });
    
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: '用户名或邮箱已存在'
      });
    }
    
    // 创建新用户
    const user = new User({
      username,
      email,
      password,
      role,
      subjects: subjects || []
    });
    
    await user.save();
    
    // 生成令牌
    const token = generateToken(user.id);
    const refreshToken = generateRefreshToken(user.id);
    
    logger.info(`New user registered: ${username} (${role})`);
    
    res.status(201).json({
      success: true,
      data: {
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role,
          permissions: user.permissions
        },
        token,
        refreshToken
      }
    });
  })
);

// 登录
router.post('/login',
  [
    body('username').trim().notEmpty().withMessage('请输入用户名或邮箱'),
    body('password').notEmpty().withMessage('请输入密码')
  ],
  validateRequest,
  asyncHandler(async (req: Request, res: Response) => {
    const { username, password } = req.body;
    
    // 查找用户（支持用户名或邮箱登录）
    const user = await User.findOne({
      $or: [
        { username },
        { email: username }
      ]
    }).select('+password');
    
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({
        success: false,
        error: '用户名或密码错误'
      });
    }
    
    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        error: '账号已被禁用'
      });
    }
    
    // 生成令牌
    const token = generateToken(user.id);
    const refreshToken = generateRefreshToken(user.id);
    
    logger.info(`User logged in: ${user.username}`);
    
    res.json({
      success: true,
      data: {
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role,
          permissions: user.permissions,
          subjects: user.subjects
        },
        token,
        refreshToken
      }
    });
  })
);

// 获取当前用户信息
router.get('/me',
  authenticate,
  asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: '未认证'
      });
    }
    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: '用户不存在'
      });
    }
    
    res.json({
      success: true,
      data: {
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role,
          permissions: user.permissions,
          subjects: user.subjects
        }
      }
    });
  })
);

// 修改密码
router.put('/change-password',
  authenticate,
  [
    body('currentPassword').notEmpty().withMessage('请输入当前密码'),
    body('newPassword').isLength({ min: 6 }).withMessage('新密码至少6个字符')
  ],
  validateRequest,
  asyncHandler(async (req: Request, res: Response) => {
    const { currentPassword, newPassword } = req.body;
    
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: '未认证'
      });
    }
    
    const user = await User.findById(req.user._id).select('+password');
    
    if (!user || !(await user.comparePassword(currentPassword))) {
      return res.status(401).json({
        success: false,
        error: '当前密码错误'
      });
    }
    
    user.password = newPassword;
    await user.save();
    
    logger.info(`Password changed for user: ${user.username}`);
    
    res.json({
      success: true,
      message: '密码修改成功'
    });
  })
);

export default router;