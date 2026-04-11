import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import logger from '../config/logger.js';
import { config } from '../config/index.js';

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    logger.warn({ headers: req.headers }, 'Access token missing in request');
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, config.jwtSecret, (err, user) => {
    if (err) {
      logger.error({ err, token: token.substring(0, 10) + '...' }, 'JWT verification failed');
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

export const optionalAuthenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  logger.debug({ authHeader }, 'Auth header check');
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return next();

  jwt.verify(token, config.jwtSecret, (err, user) => {
    if (!err) {
      req.user = user;
    } else {
      logger.debug({ err, token: token.substring(0, 10) + '...' }, 'Optional JWT verification failed');
    }
    next();
  });
};

export const requireRole = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Forbidden: Insufficient permissions' });
    }
    next();
  };
};
