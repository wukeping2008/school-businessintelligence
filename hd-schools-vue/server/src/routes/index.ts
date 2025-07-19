import { Application } from 'express';
import authRoutes from './auth.routes';
import studentsRoutes from './students.routes';
import pathwaysRoutes from './pathways.routes';

export const registerRoutes = (app: Application) => {
  // API路由前缀
  const apiPrefix = '/api/v1';
  
  // 注册路由
  app.use(`${apiPrefix}/auth`, authRoutes);
  app.use(`${apiPrefix}/students`, studentsRoutes);
  app.use(`${apiPrefix}/pathways`, pathwaysRoutes);
  
  // 404处理
  app.use(`${apiPrefix}/*`, (req, res) => {
    res.status(404).json({
      success: false,
      error: 'API endpoint not found'
    });
  });
};