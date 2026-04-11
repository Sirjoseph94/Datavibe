import type { Request, Response, NextFunction } from 'express';
import logger from '../config/logger.js';

export const loggerMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    const { method, url } = req;
    const { statusCode } = res;

    logger.info({
      method,
      url,
      statusCode,
      duration: `${duration}ms`,
    }, `HTTP ${method} ${url} ${statusCode}`);
  });

  next();
};
