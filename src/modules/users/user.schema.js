import { userRoles } from '../../config/constants.js';

export const userSchemas = {
    fetchUsersRequest: {
        type: 'object',
        properties: {
            name: {
                type: 'string',
                description: 'The name of the user',
            },
            email: {
                type: 'string',
                format: 'email',
                description: 'The email address of the user',
            },
            role: {
                type: 'string',
                enum: userRoles,
                description: 'The role of the user',
            },
            sortBy: {
                type: 'string',
                description: 'Field to sort by',
                default: 'createdAt',
            },
            orderBy: {
                type: 'string',
                enum: ['asc', 'desc'],
                description: 'Order of sorting',
                default: 'desc',
            },
            limit: {
                type: 'integer',
                description: 'Number of users to fetch per page',
                default: 10,
            },
            page: {
                type: 'integer',
                description: 'Page number to fetch',
                default: 1,
            },
        },
        required: [],
        additionalProperties: false,
        example: {
            name: 'John',
            email: 'test@gmail.com',
            role: 'user',
            sortBy: 'createdAt',
            orderBy: 'desc',
            limit: 10,
            page: 1,
        },
    },
    fetchUserByIdRequest: {
        type: 'object',
        properties: {
            id: {
                type: 'string',
                description: 'The ID of the user to fetch',
            },
        },
        required: ['id'],
        additionalProperties: false,
        example: {
            id: '60c72b2f9b1e8b001c8e4d3a',
        },
    },
    modifyMeRequest: {
        type: 'object',
        properties: {
            name: {
                type: 'string',
                description: 'The name of the user',
            },
            bio: {
                type: 'string',
                description: 'A short biography of the user',
            },
            phone: {
                type: 'string',
                description: 'The phone number of the user',
            },
            phoneCountryCode: {
                type: 'string',
                description: 'The country code for the phone number',
            },
        },
        required: [],
        additionalProperties: false,
        example: {
            name: 'John Doe',
            bio: 'Software Developer',
            phone: '+1234567890',
            phoneCountryCode: '+1',
        },
    },
    modifyUserBackgroundRequest: {
        type: 'object',
        properties: {
            file: {
                type: 'string',
                format: 'binary',
                description: 'The background image file to upload',
            },
        },
        required: ['file'],
        additionalProperties: false,
    },
    modifyUserPhotoRequest: {
        type: 'object',
        properties: {
            file: {
                type: 'string',
                format: 'binary',
                description: 'The profile photo file to upload',
            },
        },
        required: ['file'],
        additionalProperties: false,
    },
};
