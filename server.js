import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./src/config/db.js";
import { setupSecurity } from "./src/middleware/security.js";
import { errorHandler } from "./src/middleware/errorHandler.js";
import authRoutes from "./src/routes/authRoutes.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;
connectDB();
app.use(express.json());
setupSecurity(app);
app.use("/api/auth", authRoutes);
app.get("/", (req, res) => res.send("🚀 Secure API v3 Running"));
app.use((req, res, next) => {
  res.status(404);
  next(new Error(`Not Found - ${req.originalUrl}`));
});
app.use(errorHandler);
app.listen(PORT, () => console.log(`✅ Server running in ${process.env.NODE_ENV} mode on port ${PORT}`));
