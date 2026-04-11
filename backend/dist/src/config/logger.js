import pino from 'pino';
const logger = pino({
    level: process.env.LOG_LEVEL || 'debug',
    transport: {
        target: 'pino-pretty',
        options: {
            colorize: true,
            ignore: 'pid,hostname',
            translateTime: 'SYS:standard',
        },
    },
});
export default logger;
//# sourceMappingURL=logger.js.map