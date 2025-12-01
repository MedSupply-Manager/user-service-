import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import cookieParser from "cookie-parser";
import { connectDB } from "./config/index.js";
import userRoutes from "./routes/userRoutes.js";
import { errorHandler } from "./middlewares/errorMiddleware.js";

dotenv.config({ path: path.resolve(process.cwd(), "../.env") });
const app = express();
const allowedOrigins = [process.env.FRONTEND_URL || 'http://localhost:5173'];

app.use(cors({
    origin: allowedOrigins,
    credentials: true
}));

app.use(express.json());
app.use(cookieParser());

// API ROUTES
app.use("/api/users", userRoutes);
app.get("/", (req, res) => {
    res.json({
        service: "users-service",
        status: "running",
        port: process.env.PORT || 5001,
        timestamp: new Date().toISOString()
    });
});

app.use(errorHandler);

// Export app for testing
export default app;

// Only start server if not in test mode
if (process.env.NODE_ENV !== 'test') {
    const PORT = process.env.PORT || 5001;

    connectDB()
        .then(() => {
            app.listen(PORT, () => {
                console.log(` Users Service running on http://localhost:${PORT}`);
                console.log(` Health Check: http://localhost:${PORT}/api/users/health`);
            });
        })
        .catch((err) => {
            console.error(" Failed to connect to MongoDB:", err);
            process.exit(1);
        });
}