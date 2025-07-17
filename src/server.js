import { createServer } from 'http';
import mongoose from 'mongoose';

import env from './config/environment.js';
import { logger } from './config/logger.js';
import app from './app.js';

export const server = createServer(app);

mongoose
    .connect(env.mongo.url, env.mongo.options)
    .then(() => {
        logger.info('Connected to MongoDB');

        server.listen(env.port, () => {
            logger.info(`Server is running on port ${env.port}`);
        });
    })
    .catch((error) => {
        logger.error('MongoDB connection error:', error);
        process.exit(1);
    });

const exitHandler = () => {
    if (server) {
        server.close(() => {
            logger.info('Server closed');
            process.exit(1);
        });
    } else {
        process.exit(1);
    }
};

const unexpectedErrorHandler = (error) => {
    logger.error(error);
    exitHandler();
};

process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);
process.on('SIGTERM', exitHandler);
process.on('SIGINT', exitHandler);
process.on('SIGUSR2', () => {
    exitHandler();
});
