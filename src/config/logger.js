import util from 'util';
import * as winston from 'winston';

import { isDevLike } from './constants.js';

const enumerateErrorFormat = winston.format((info) => {
    if (info instanceof Error) {
        info.message = `${info.message}\n${info.stack}`;
    }
    return info;
});

const customFormat = winston.format.printf(({ level, message, timestamp, ...rest }) => {
    const restStr = Object.keys(rest).length ? ` ${util.inspect(rest, { depth: null })}` : '';
    return `${timestamp} ${level}: ${message}${restStr}`;
});

export const logger = winston.createLogger({
    level: isDevLike ? 'debug' : 'info',
    format: winston.format.combine(
        enumerateErrorFormat(),
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.uncolorize(),
        customFormat,
    ),
    transports: [
        new winston.transports.Console({
            stderrLevels: ['error'],
        }),
        ...(isDevLike
            ? []
            : [
                  new winston.transports.File({
                      filename: 'logs/error.log',
                      level: 'error',
                  }),
                  new winston.transports.File({ filename: 'logs/combined.log' }),
              ]),
    ],
});
