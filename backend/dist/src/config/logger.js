import pino from 'pino';
import { config } from './index.js';
const logger = pino({
    level: config.logLevel,
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