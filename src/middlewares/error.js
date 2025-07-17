import mongoose from 'mongoose';
import httpStatus from 'http-status';

import { logger } from '../config/logger.js';
import env from '../config/environment.js';
import ApiError from '../utils/apiError.js';
import { isDevLike } from '../config/constants.js';

export const errorConverter = (err, req, res, next) => {
    let error = err;
    if (!(error instanceof ApiError)) {
        const statusCode =
            error.statusCode || error instanceof mongoose.Error ? httpStatus.BAD_REQUEST : httpStatus.INTERNAL_SERVER_ERROR;

        const message = error.message || httpStatus[statusCode];

        error = new ApiError(statusCode, message, false, err.stack);
    }
    next(error);
};

export const errorHandler = (err, req, res, next) => {
    let { statusCode, message } = err;
    if (env.env === 'prod' && !err.isOperational) {
        statusCode = httpStatus.INTERNAL_SERVER_ERROR;
        // message = httpStatus[httpStatus.INTERNAL_SERVER_ERROR];
    }

    if (isDevLike) {
        logger.error(err);
    }

    // res.locals.errorMessage = err.message;
    res.error({
        code: statusCode,
        message: message,
        error: {
            code: statusCode,
            stack: env.env === 'dev' ? err.stack : undefined,
            // stack: err.stack,
        },
    });
};
