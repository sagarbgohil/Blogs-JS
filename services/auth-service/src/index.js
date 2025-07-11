const express = require('express');
const routes = require('./routes');
const { connectToDB } = require('./config/database');
const { errorHandler } = require('./middlewares/errorHandler');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use('/api', routes);
app.use(errorHandler);

const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'Auth Service API',
            version: '1.0.0',
            description: 'API Documentation for the Auth Service'
        }
    },
    apis: ['./src/routes/*.js']
};
const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

connectToDB().then(() => {
    app.listen(PORT, () => console.log(`Auth Service running on port ${PORT}`));
});
