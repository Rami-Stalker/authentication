// import express from "express";
// import dotenv from "dotenv";
// import { connectDB } from "./src/config/db.js";
// import { setupSecurity } from "./src/middleware/security.js";
// import { errorHandler } from "./src/middleware/errorHandler.js";
// import authRoutes from "./src/routes/authRoutes.js";

// dotenv.config();
// const app = express();
// const PORT = process.env.PORT || 5000;
// connectDB();
// app.use(express.json());
// setupSecurity(app);
// app.use("/api/auth", authRoutes);
// app.get("/", (req, res) => res.send("🚀 Secure API v3 Running"));
// app.use((req, res, next) => {
//   res.status(404);
//   next(new Error(`Not Found - ${req.originalUrl}`));
// });
// app.use(errorHandler);
// app.listen(PORT, () => console.log(`✅ Server running in ${process.env.NODE_ENV} mode on port ${PORT}`));

require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/db');
const errorMiddleware = require('./middleware/error.middleware');


connectDB();

const app = express();

app.use(helmet()); 
app.use(cors({ origin: 'http://localhost:3000', credentials: true })); 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100, 
  message: 'Too many requests from this IP, please try again after 15 minutes',
});
app.use(limiter);

app.get('/', (req, res) => res.send('Auth API Running'));
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/users', require('./routes/user.routes')); 

app.use(errorMiddleware); 

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));