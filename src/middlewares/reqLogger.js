import onFinished from 'on-finished';
import { logger } from '../config/logger.js';

export const requestLogger = (req, res, next) => {
    const start = process.hrtime.bigint();

    onFinished(res, () => {
        const duration = Number(process.hrtime.bigint() - start) / 1e6; // convert to ms

        logger.info(`${req.method} ${req.originalUrl} ${res.statusCode} - ${duration.toFixed(2)} ms`);
    });

    next();
};
