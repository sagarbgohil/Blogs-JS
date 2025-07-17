import httpStatus from 'http-status';
import passport from 'passport';
import crypto from 'crypto';

import env from '../config/environment.js';
import { roleRights } from '../config/constants.js';

export const verifyCallback = (req, resolve, reject, data) => async (err, user, info) => {
    if (err || info || !user) {
        if (info && info.name === 'TokenExpiredError') {
            return reject(new ApiError(httpStatus.UNAUTHORIZED, 'TokenExpired'));
        }

        return reject(new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate'));
    }
    req.user = user;

    const { roles, rights } = data || {};

    if (rights.length) {
        const userRights = roleRights.get(user.role);
        const hasRequiredRights = rights.every((requiredRight) => userRights.includes(requiredRight));
        if (!hasRequiredRights && req.params.userId !== user.id) {
            return reject(new ApiError(httpStatus.FORBIDDEN, 'Forbidden'));
        }
    }

    if (roles.length && !roles.includes(user.role)) {
        return reject(new ApiError(httpStatus.FORBIDDEN, 'Forbidden'));
    }

    resolve();
};

export const auth = (data) => async (req, res, next) => {
    return new Promise((resolve, reject) => {
        passport.authenticate('jwt', { session: false }, verifyCallback(req, resolve, reject, data))(req, res, next);
    })
        .then(() => next())
        .catch((err) => next(err));
};

export const signAuth = () => async (req, res, next) => {
    try {
        const secret = env.apiKey;
        const timestamp = req.headers['x-timestamp'];
        const signature = req.headers['x-signature'];
        const apiKey = req.headers['x-api-key'];
        const currentTime = Date.now();
        console.log('req.baseUrl: ', req.baseUrl);

        // Ensure at least one authentication method is provided
        if ((!timestamp || !signature) && !apiKey) {
            throw new ApiError(httpStatus.UNAUTHORIZED, 'Unauthorized');
        }

        // Validate timestamp (request should not be older than 1 day)
        if (timestamp && currentTime - timestamp > 86400000) {
            throw new ApiError(httpStatus.UNAUTHORIZED, 'Unauthorized - Request expired');
        }

        // Validate API Key authentication
        if (apiKey) {
            const timestamp = apiKey.split('.')[1];

            // 1 hour expiry for API Key
            // if (timestamp && currentTime - timestamp > 3600000) {
            //     throw new ApiError(httpStatus.UNAUTHORIZED, 'Unauthorized - Request expired');
            // }

            const apiKeyData = `${timestamp}.${req.method}.${req.baseUrl}`;
            const expectedApiKey = crypto.createHmac('sha256', secret).update(apiKeyData).digest('hex');

            if (apiKey.split('.')[0] !== expectedApiKey) {
                throw new ApiError(httpStatus.UNAUTHORIZED, 'Unauthorized - Invalid API Key');
            }
        }

        // Validate HMAC Signature authentication
        if (signature) {
            const signData = `${timestamp}.${req.method}.${req.baseUrl}`;
            const expectedSignature = crypto.createHmac('sha256', secret).update(signData).digest('hex');

            if (signature !== expectedSignature) {
                throw new ApiError(httpStatus.UNAUTHORIZED, 'Unauthorized - Invalid Signature');
            }
        }

        next();
    } catch (error) {
        next(error);
    }
};

export const eitherAuth = (auth1, auth2) => async (req, res, next) => {
    try {
        // Try first auth method
        await new Promise((resolve, reject) => {
            auth1(req, res, (err) => (err ? reject(err) : resolve()));
        });

        return next(); // If auth1 succeeds, continue to the next middleware
    } catch (err1) {
        try {
            // If auth1 fails, try auth2
            await new Promise((resolve, reject) => {
                auth2(req, res, (err) => (err ? reject(err) : resolve()));
            });

            return next(); // If auth2 succeeds, continue
        } catch (err2) {
            // If both fail, return Unauthorized error
            return res.status(401).json({ message: 'Unauthorized' });
        }
    }
};
