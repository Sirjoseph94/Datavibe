import type { Request, Response, NextFunction } from 'express';
import { ZodError, ZodObject } from 'zod';

export const validateRequest = (schema: ZodObject) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      return next();
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          error: 'Validation Error',
          details: error.issues.map(e => ({
            path: e.path.join('.'),
            message: e.message
          }))
        });
      }
      return res.status(400).json({ error: 'Validation failed' });
    }
  };
};
