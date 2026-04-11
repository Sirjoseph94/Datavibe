import express, {} from 'express';
import cors from 'cors';
import 'dotenv/config';
import apiRoutes from './routes/index.js';
import logger from './config/logger.js';
import { loggerMiddleware } from './middlewares/logger.middleware.js';
const app = express();
app.use(express.json());
app.use(cors());
app.use(loggerMiddleware);
// Mount the aggregator API router
app.use('/api', apiRoutes);
// Global Error Handler
app.use((err, req, res, next) => {
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
});
//# sourceMappingURL=index.js.map