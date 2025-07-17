import swaggerJsdoc from 'swagger-jsdoc';

import env from '../environment.js';
import { swaggerSchemas } from './schema.js';

const tags = [
    {
        name: 'Auth',
        description: 'Authentication APIs',
    },
    {
        name: 'Users',
        description: 'User Management APIs',
    },
];

const options = {
    swaggerDefinition: {
        openapi: '3.1.0',
        info: {
            title: 'Backend Server',
            version: '1.0.0',
            description: 'API documentation for the Backend Server',
        },
        servers: [
            {
                url: `${env.urls.local}`,
                description: 'Local development server',
            },
            {
                url: `${env.urls.prod}`,
                description: 'Production server',
            },
            {
                url: `${env.urls.stage}`,
                description: 'Staging server',
            },
        ],
        tags: tags,
        components: {
            schemas: swaggerSchemas,
            securitySchemes: {
                Authorization_Bearer_Token: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                    description: 'The JWT token will be passed in the Authorization field as a Bearer token.',
                },
            },
        },
    },
    apis: ['./src/modules/**/*.routes.js'],
};

export const swaggerSpecs = swaggerJsdoc(options);
