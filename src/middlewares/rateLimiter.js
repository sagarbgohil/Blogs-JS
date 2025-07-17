import rateLimit from 'express-rate-limit';

import env from '../config/environment.js';

export const authLimiter = rateLimit({
    windowMs: env.rateLimit * 60 * 1000,
    max: 20,
    skipSuccessfulRequests: true,
});
