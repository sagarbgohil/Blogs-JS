const express = require('express');
const proxy = require('express-http-proxy');

const app = express();
const PORT = process.env.GATEWAY_PORT || 3000;

app.use('/auth', proxy('http://localhost:3001'));
app.use('/blog', proxy('http://localhost:3002'));

app.listen(PORT, () => console.log(`API Gateway running on port ${PORT}`));
