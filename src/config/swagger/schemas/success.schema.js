export const successResponseSchema = {
    type: 'object',
    properties: {
        success: {
            type: 'boolean',
        },
        message: {
            type: 'string',
        },
        data: {
            type: 'object',
            properties: {
                id: {
                    type: 'string',
                },
                key: {
                    type: 'string',
                },
            },
        },
    },
    example: {
        success: true,
        message: 'Success!',
        data: {
            id: '6662e2d63a477799ef99c182',
            key: 'value',
        },
    },
};
