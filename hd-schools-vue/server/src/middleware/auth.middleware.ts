import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/user.model';
import logger from '../config/logger';
import '../types/index';

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: '请先登录' });
    }
    
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user || !user.isActive) {
      throw new Error('用户不存在或已被禁用');
    }
    
    req.user = user as any;
    next();
  } catch (error) {
    logger.error('Authentication error:', error);
    res.status(401).json({ error: '认证失败，请重新登录' });
  }
};

export const authorize = (...permissions: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: '未认证' });
    }
    
    const hasPermission = permissions.some(permission => 
      req.user?.permissions?.includes(permission)
    );
    
    if (!hasPermission) {
      return res.status(403).json({ error: '权限不足' });
    }
    
    next();
  };
};

export const authorizeRole = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: '未认证' });
    }
    
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: '角色权限不足' });
    }
    
    next();
  };
};