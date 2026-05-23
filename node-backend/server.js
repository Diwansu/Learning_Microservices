require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');
const routes = require('./routes/shipmentRoutes');
const authRoutes = require('./routes/authRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS with credentials and JSON/Cookie parsing
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// Log incoming requests
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Register Modular API routes
app.use('/api', routes);
app.use('/api/auth', authRoutes);
app.use('/api/analytics', analyticsRoutes);

// Boot database & server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Express gateway running on port ${PORT}`);
  });
});
