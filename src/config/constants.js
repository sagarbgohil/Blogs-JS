import env from './environment.js';

export const tokenTypes = {
    ACCESS: 'access',
    REFRESH: 'refresh',
    RESET_PASSWORD: 'resetPassword',
    VERIFY_EMAIL: 'verifyEmail',
    VERIFY_PHONE: 'verifyPhone',
    LOGIN_OTP: 'loginOTP',
};

export const isDevLike = ['stage', 'test', 'local'].includes(env.environment);

export const userProvider = ['google', 'facebook', 'github', 'twitter', 'email'];

export const allRights = {
    customer: [],
    admin: [],
    superadmin: [],
};

export const userRoles = Object.keys(allRights);

export const roleRights = new Map(Object.entries(allRights));
