const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
require('dotenv').config();

const PORT = process.env.PORT || 3000;
const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'QLSV API',
            version: '1.0.0',
            description: 'API quản lý sinh viên',
        },
        servers: [
            {
                url: `http://localhost:${PORT}`, // đồng bộ port ở đây
            },
        ],
    },
    apis: ['./routes/*.js'],
};
const specs = swaggerJsdoc(options);
module.exports = { swaggerUi, specs };
