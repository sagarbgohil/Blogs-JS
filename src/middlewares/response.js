import httpStatus from 'http-status';

export const responseMiddleware = (req, res, next) => {
    // Add custom response data
    res.success = (data) => {
        const { code: statusCode = httpStatus.OK, message = 'Request was successful!', data: responseData } = data;

        res.status(statusCode).json({
            success: true,
            message,
            data: responseData,
        });
    };

    // Add custom error response
    res.error = (data) => {
        const { error, message = 'An error occurred!', code: statusCode = httpStatus.INTERNAL_SERVER_ERROR } = data;

        res.status(statusCode).json({
            success: false,
            message,
            error: error,
        });
    };

    next();
};
