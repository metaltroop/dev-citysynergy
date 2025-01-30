require('dotenv').config();
const express = require('express');
const { sequelize, connectDB } = require('./Config/database');
const authRoutes = require('./Routes/authRoutes');
const tenderRoutes = require('./Routes/tenderRoutes');
const cors = require('cors');
const axios = require('axios'); // Required for periodic PING requests
const app = express();
const cron = require('node-cron');
const { Op } = require('sequelize');
const OTP = require('./Models/OTP');

const port = process.env.PORT || 3000;

// Enable CORS
app.use(cors({ origin: "*" }));

// Middleware for parsing JSON
app.use(express.json());

// Test the database connection and sync models
connectDB();

// Sync the models
sequelize.sync({ alter: true }).then(() => {
    console.log('All models were synchronized successfully.');
}).catch((error) => {
    console.error('Error synchronizing models:', error);
});

// Routes
app.use('/auth', authRoutes);
app.use('/tender', tenderRoutes);

// Root endpoint
app.get('/', (req, res) => {
    res.send('hello hola amigo');
});

app.get('/ping', (req, res) => {
    res.json({ status: "success", message: "PING received from Node.js server" });
});

const pingFastAPI = async () => {
    const url = 'https://citysynergybackendpython.onrender.com/ping';
    try {
        const response = await axios.post(url, { message: "PING from Node.js" });
        console.log(`[PING] FastAPI responded: ${response.data.message || 'Success'}`);
    } catch (error) {
        console.error(`[PING] Error pinging FastAPI: ${error.message}`);
    }
};

// Schedule OTP cleanup every 10 minutes
cron.schedule('*/10 * * * *', async () => {
    try {
      const now = new Date();
      await OTP.destroy({ where: { expiresAt: { [Op.lt]: now } } });
      console.log('[CRON] Expired OTPs removed.');
    } catch (error) {
      console.error('[CRON] Error cleaning expired OTPs:', error);
    }
  });

// Schedule periodic PING every 10 minutes (600,000 ms)
setInterval(pingFastAPI, 600000);

// Start server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
    // Send an initial PING when the server starts
    pingFastAPI();
});