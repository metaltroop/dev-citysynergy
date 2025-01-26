
// Config/database.js
const { Sequelize } = require('sequelize');
const mysql = require('mysql2/promise');
const config = require('./config');

const sequelize = new Sequelize(
    config.development.database,
    config.development.username,
    config.development.password,
    {
        host: config.development.host,
        dialect: config.development.dialect,
        logging: config.development.logging,
        dialectOptions: {
            ssl : {
                require : true,
                rejectUnauthorized: false
            }
        }
    }
);

const createDatabaseIfNotExist = async () => {
    try {
        const connection = await mysql.createConnection({
            host: config.development.host,
            user: config.development.username,
            password: config.development.password,
            ssl: { // Adding SSL here as well
                require: true,
                rejectUnauthorized: false
            }
        });
        await connection.query(`CREATE DATABASE IF NOT EXISTS \`${config.development.database}\`;`);
        console.log('Database created or successfully checked.');
    } catch (error) {
        console.error('Error creating database:', error);
    }
};

const connectDB = async () => {
    try {
        await createDatabaseIfNotExist();
        await sequelize.authenticate();
        console.log('Database connected successfully');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
};

module.exports = { sequelize, connectDB };