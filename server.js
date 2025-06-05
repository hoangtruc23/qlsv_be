const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { swaggerUi, specs } = require('./swagger');
const routes = require('./routes/routes');


const app = express();

// Middleware
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));
app.use(express.json());


// Route mặc định
app.get('/', (req, res) => {
    res.status(200).send('Hello from Express API!');
});

app.use('/api', routes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// console.log(JSON.stringify(specs, null, 2));

// Lắng nghe port
const PORT = process.env.PORT || 8889;
app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
    console.log(`Swagger docs at http://localhost:${PORT}/api-docs`);
});