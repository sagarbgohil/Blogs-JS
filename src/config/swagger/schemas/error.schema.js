export const errorResponseSchema = {
    type: 'object',
    properties: {
        success: {
            type: 'boolean',
        },
        message: {
            type: 'string',
        },
        error: {
            type: 'object',
            properties: {
                errorCode: {
                    type: 'integer',
                },
                message: {
                    type: 'string',
                },
            },
        },
    },
    example: {
        success: false,
        message: 'An error occurred!',
        error: {
            errorCode: 420,
            message: 'Error message here',
        },
    },
};
