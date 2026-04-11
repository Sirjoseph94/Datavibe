import logger from '../config/logger.js';
export const loggerMiddleware = (req, res, next) => {
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
//# sourceMappingURL=logger.middleware.js.map