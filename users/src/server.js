import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import cookieParser from "cookie-parser";
import { fileURLToPath } from 'url';
import { connectDB } from "./config/index.js";
import userRoutes from "./routes/userRoutes.js";
import { errorHandler } from "./middlewares/errorMiddleware.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env') });

// Create Express app
const app = express();

// CORS CONFIGURATION
const allowedOrigins = [
    'http://localhost:5173',
    process.env.FRONTEND_URL,
].filter(Boolean);

app.use(cors({
    origin: allowedOrigins,
    credentials: true
}));

// GLOBAL MIDDLEWARES
app.use(express.json());
app.use(cookieParser());

// API ROUTES
app.use("/api/users", userRoutes);

// Root health check (for load balancers)
app.get("/", (req, res) => {
    res.json({
        service: "users-service",
        status: "running",
        port: process.env.PORT || 5001,
        timestamp: new Date().toISOString()
    });
});

// ERROR HANDLER 
app.use(errorHandler);

// Export app for testing
export default app;

// SERVER 
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