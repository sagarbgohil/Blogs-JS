export const miscSchemas = {
    uploadFileRequest: {
        type: 'object',
        properties: {
            file: {
                type: 'string',
                format: 'binary',
                description: 'The file to upload',
            },
        },
        required: ['file'],
        additionalProperties: false,
    },
};
