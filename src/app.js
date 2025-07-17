import express from 'express';
import helmet from 'helmet';
// import mongoSanitize from 'express-mongo-sanitize';
import compression from 'compression';
import cors from 'cors';
import passport from 'passport';
import swaggerUi from 'swagger-ui-express';
import httpStatus from 'http-status';

import { responseMiddleware } from './middlewares/response.js';
import { jwtStrategy } from './config/passport.js';
import env from './config/environment.js';
import { authLimiter } from './middlewares/rateLimiter.js';
import { swaggerSpecs } from './config/swagger/swagger.js';
import { apiRouter } from './routes/api.routes.js';
import ApiError from './utils/apiError.js';
import { errorConverter, errorHandler } from './middlewares/error.js';

export const app = express();

app.use(helmet());

app.use(
    express.json({
        limit: '100mb',
    }),
);

app.use(
    express.urlencoded({
        extended: true,
        limit: '100mb',
    }),
);
app.use(responseMiddleware);

// app.use(mongoSanitize());

app.use(compression());

app.use(express.static('public'));

app.use(cors());
app.options('*cors', cors());

app.use(passport.initialize());
passport.use('jwt', jwtStrategy);

if (env.environment === 'prod') {
    app.use('/api', authLimiter);
}

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

app.use('/api', apiRouter);

app.use((req, _, next) => {
    if (req.path.includes('.env')) {
        throw new ApiError(httpStatus.FORBIDDEN, 'Access Denied');
    }
    next(new ApiError(httpStatus.NOT_FOUND, 'Not Found'));
});

app.use(errorConverter);

app.use(errorHandler);

export default app;
