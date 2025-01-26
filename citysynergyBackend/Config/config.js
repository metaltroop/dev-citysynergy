// Config/config.js
require('dotenv').config();

module.exports = {
    development: {
        username: process.env.DB_USER || 'root',
        password: process.env.DB_PASS || 'password',
        database: process.env.DB_NAME || 'apartment_management_3',
        host: process.env.DB_HOST || 'localhost',
        dialect: 'mysql',
        logging: false
    }
};
