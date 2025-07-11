#!/bin/bash

# Base project structure
mkdir -p services/auth-service/src/{controllers,models,routes,services,utils,config,middlewares}
mkdir -p services/blog-service/src/{controllers,models,routes,services,utils,config,middlewares}
mkdir -p api-gateway/src/routes
mkdir config

# Docker Compose file
cat <<EOL > docker-compose.yml
version: '3.8'

services:
  auth-service:
    build: ./services/auth-service
    ports:
      - "3001:3001"
    environment:
      - MONGO_URI=mongodb://mongo:27017/auth

  blog-service:
    build: ./services/blog-service
    ports:
      - "3002:3002"
    environment:
      - MONGO_URI=mongodb://mongo:27017/blog

  api-gateway:
    build: ./api-gateway
    ports:
      - "3000:3000"

  mongo:
    image: mongo:latest
    ports:
      - "27017:27017"
EOL

# Auth Service files
cat <<EOL > services/auth-service/src/index.js
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
    app.listen(PORT, () => console.log(\`Auth Service running on port \${PORT}\`));
});
EOL

# Blog Service files
cat <<EOL > services/blog-service/src/index.js
const express = require('express');
const routes = require('./routes');
const { connectToDB } = require('./config/database');
const { errorHandler } = require('./middlewares/errorHandler');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const app = express();
const PORT = process.env.PORT || 3002;

app.use(express.json());
app.use('/api', routes);
app.use(errorHandler);

const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'Blog Service API',
            version: '1.0.0',
            description: 'API Documentation for the Blog Service'
        }
    },
    apis: ['./src/routes/*.js']
};
const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

connectToDB().then(() => {
    app.listen(PORT, () => console.log(\`Blog Service running on port \${PORT}\`));
});
EOL

# API Gateway index file
cat <<EOL > api-gateway/src/index.js
const express = require('express');
const proxy = require('express-http-proxy');

const app = express();
const PORT = process.env.GATEWAY_PORT || 3000;

app.use('/auth', proxy('http://localhost:3001'));
app.use('/blog', proxy('http://localhost:3002'));

app.listen(PORT, () => console.log(\`API Gateway running on port \${PORT}\`));
EOL

# Auth Service Routes and Controllers
cat <<EOL > services/auth-service/src/routes/index.js
const express = require('express');
const { signup, login, verifyOtp } = require('../controllers/authController');

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/verify-otp', verifyOtp);

module.exports = router;
EOL

cat <<EOL > services/auth-service/src/controllers/authController.js
const User = require('../models/User');
const { sendOtp } = require('../utils/otpUtils');

async function signup(req, res) {
    // Email signup logic
}

async function login(req, res) {
    // Email/pass login logic
}

async function verifyOtp(req, res) {
    // OTP verification logic
    await sendOtp(req.body.email);
    res.status(200).json({ message: "OTP sent to your email." });
}

module.exports = { signup, login, verifyOtp };
EOL

cat <<EOL > services/auth-service/src/models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String },
    otp: { type: String },
    isVerified: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
EOL

# Blog Service Routes and Controllers
cat <<EOL > services/blog-service/src/routes/index.js
const express = require('express');
const { createBlog, getBlogs, likeBlog, addComment } = require('../controllers/blogController');

const router = express.Router();

router.post('/', createBlog);
router.get('/', getBlogs);
router.post('/:id/like', likeBlog);
router.post('/:id/comment', addComment);

module.exports = router;
EOL

cat <<EOL > services/blog-service/src/controllers/blogController.js
const Blog = require('../models/Blog');

async function createBlog(req, res) {
    // Create a new blog
}

async function getBlogs(req, res) {
    // Get all blogs
}

async function likeBlog(req, res) {
    // Increment likes on a blog
}

async function addComment(req, res) {
    // Add a comment to a blog
}

module.exports = { createBlog, getBlogs, likeBlog, addComment };
EOL

cat <<EOL > services/blog-service/src/models/Blog.js
const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    likes: { type: Number, default: 0 },
    comments: [{ userId: String, comment: String }],
    views: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Blog', blogSchema);
EOL

echo "Project structure created successfully."
