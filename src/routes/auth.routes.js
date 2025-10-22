import express from "express";
import { register, login, logout, getMe } from "../controllers/authController.js";
import { validate } from "../middleware/validate.js";
import { registerSchema, loginSchema } from "../validation/authValidation.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();
router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);
router.post("/logout", protect, logout);
router.get("/me", protect, getMe);
export default router;
