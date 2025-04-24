const express = require('express');
const app = express();
const PORT = 3000;

// Middleware to parse JSON
app.use(express.json());

// Root route
app.get('/', (req, res) => {
    res.send('Hello from Express API!');
});

// Example POST route
app.post('/data', (req, res) => {
    const data = req.body;
    res.json({
        message: 'Data received successfully',
        data,
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
