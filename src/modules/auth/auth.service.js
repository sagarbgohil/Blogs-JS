import jwt from 'jsonwebtoken';

import env from '../../config/environment.js';
import moment from 'moment';
import { tokenTypes } from '../../config/constants.js';
import { generateOTP } from '../../utils/math.js';
import { createSession } from '../sessions/sessions.service.js';
import { logger } from '../../config/logger.js';

export const verifyToken = async (token) => {
    try {
        const payload = jwt.verify(token, env.jwt.secret);
        return payload;
    } catch (error) {
        logger.error(`Token verification failed: ${error.message}`);
        return null;
    }
};

export const generateAuthTokens = async (user) => {
    const accessToken = generateToken({
        userId: user.id,
        type: tokenTypes.ACCESS,
        expires: moment().add(env.jwt.accessExpirationMinutes, 'minutes').toDate(),
    });
    const refreshToken = generateToken({
        userId: user.id,
        type: tokenTypes.REFRESH,
        expires: moment().add(env.jwt.refreshExpirationDays, 'days').toDate(),
    });

    await createSession(user.id, {
        refreshToken,
    });

    return { access: accessToken, refresh: refreshToken };
};

export const generateToken = (data) => {
    const {
        userId,
        role = 'customer',
        type = tokenTypes.ACCESS,
        expires = moment().add(env.jwt.accessExpirationMinutes, 'days').toDate(),
        secret = env.jwt.secret,
    } = data;

    const payload = {
        sub: userId,
        role,
        iat: moment().unix(),
        exp: moment(expires).unix(),
        type,
    };

    switch (type) {
        case tokenTypes.ACCESS:
        case tokenTypes.REFRESH:
            return jwt.sign(payload, secret);
        case tokenTypes.RESET_PASSWORD:
        case tokenTypes.VERIFY_EMAIL:
        case tokenTypes.LOGIN_OTP:
        case tokenTypes.VERIFY_PHONE:
            return generateOTP();
        default:
            throw new Error('Invalid token type');
    }
};
