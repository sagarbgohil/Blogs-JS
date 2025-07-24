export const authSchemas = {
    logoutRequest: {
        type: 'object',
        properties: {
            refreshToken: {
                type: 'string',
                description: 'The refresh token to log out',
            },
        },
        required: ['refreshToken'],
        additionalProperties: false,
        example: {
            refreshToken: 'your-refresh-token',
        },
    },
    refreshTokensRequest: {
        type: 'object',
        properties: {
            refreshToken: {
                type: 'string',
                description: 'The refresh token to refresh',
            },
        },
        required: ['refreshToken'],
        additionalProperties: false,
        example: {
            refreshToken: 'your-refresh-token',
        },
    },
    resetPasswordRequest: {
        type: 'object',
        properties: {
            email: {
                type: 'string',
                format: 'email',
                description: 'The email address of the user',
            },
            password: {
                type: 'string',
                description: 'The new password for the user',
            },
        },
        required: ['email', 'password'],
        additionalProperties: false,
        example: {
            email: 'test@gmail.com',
            password: 'newpassword123!',
        },
    },
    sendOtpRequest: {
        type: 'object',
        properties: {
            email: {
                type: 'string',
                format: 'email',
                description: 'The email address to send OTP to',
            },
            type: {
                type: 'string',
                enum: ['email', 'reset-password'],
                default: 'email',
                description: 'The type of OTP request',
            },
        },
        required: ['email'],
        additionalProperties: false,
        example: {
            email: 'test@gmail.com',
            type: 'email',
        },
    },
    verifyOtpRequest: {
        type: 'object',
        properties: {
            email: {
                type: 'string',
                format: 'email',
                description: 'The email address to verify OTP for',
            },
            otp: {
                type: 'string',
                description: 'The OTP to verify',
            },
            type: {
                type: 'string',
                enum: ['email', 'reset-password'],
                description: 'The type of OTP verification',
            },
        },
        required: ['email', 'otp', 'type'],
        additionalProperties: false,
        example: {
            email: 'test@gmail.com',
            otp: '123456',
            type: 'email',
        },
    },
    signInRequest: {
        type: 'object',
        properties: {
            email: {
                type: 'string',
                format: 'email',
                description: 'The email address of the user',
            },
            password: {
                type: 'string',
                description: 'The password of the user',
            },
        },
        required: ['email', 'password'],
        additionalProperties: false,
        example: {
            email: 'test@gmail.com',
            password: 'password123!',
        },
    },
    signUpRequest: {
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
            password: {
                type: 'string',
                description: 'The password for the user account',
            },
        },
        required: ['name', 'email', 'password'],
        additionalProperties: false,
        example: {
            name: 'John Doe',
            email: 'test@gmail.com',
            password: 'password123!',
        },
    },
    socialSignInRequest: {
        type: 'object',
        properties: {
            email: {
                type: 'string',
                format: 'email',
                description: 'The email address of the user',
            },
            name: {
                type: 'string',
                description: 'The name of the user',
            },
            provider: {
                type: 'string',
                enum: ['google', 'facebook', 'github'],
                default: 'google',
                description: 'The social provider for sign-in',
            },
            providerUserId: {
                type: 'string',
                description: 'The unique ID from the social provider',
            },
            profile: {
                type: 'string',
                format: 'uri',
                description: 'The profile image URL of the user',
            },
        },
        required: ['email', 'name', 'providerUserId'],
        additionalProperties: false,
        example: {
            email: 'test@gmail.com',
            name: 'John Doe',
            provider: 'google',
            providerUserId: '123456789',
            image: 'https://example.com/profile.jpg',
        },
    },
};
