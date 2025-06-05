const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors({
    origin: '*', // hoặc '*' nếu bạn chấp nhận mọi nguồn
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));
app.use(express.json());

const routes = require('./routes/routes');


// Route mặc định
app.get('/', (req, res) => {
    res.status(200).send('Hello from Express API!');
});

app.use('/api', routes);

// Lắng nghe port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});