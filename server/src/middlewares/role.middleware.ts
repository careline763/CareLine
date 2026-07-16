import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth.middleware';
import { forbidden } from '../utils/response';

export function requireRole(...roles: string[]) {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user || !roles.includes(req.user.role)) {
      forbidden(res, 'Insufficient permissions');
      return;
    }
    next();
  };
}
