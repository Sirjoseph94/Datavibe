import express, { type Request, type Response, type NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import 'dotenv/config';
import apiRoutes from './routes/index.js';
import logger from './config/logger.js';
import { loggerMiddleware } from './middlewares/logger.middleware.js';

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

const app = express();
app.use(helmet());
app.use(express.json());
app.use(cors());
app.use(loggerMiddleware);

// Mount the aggregator API router
app.use('/api', apiRoutes);

// Global Error Handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  logger.error({
    err: {
      message: err.message,
      stack: err.stack,
    },
    method: req.method,
    url: req.url,
  }, 'Unhandled Exception');

  res.status(500).json({ error: 'Internal Server Error' });
});

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  logger.info(`API Server running on http://localhost:${PORT}`);
}).on('error', (error) => {
  logger.error({ err: error }, 'Failed to start server');
});
