import express from "express";
import { register, login } from "../controllers/userController.js";
import { loginLimiter } from "../middlewares/rateLimit.js";

const router = express.Router();

//  HEALTH CHECK
router.get("/health", (req, res) => {
    res.json({
        status: "UP",
        service: "users-service",
        timestamp: new Date().toISOString(),
        port: process.env.PORT || 5001
    });
});

//  REGISTER
router.post("/register", loginLimiter, register);

//  LOGIN
router.post("/login", loginLimiter, login);

export default router;