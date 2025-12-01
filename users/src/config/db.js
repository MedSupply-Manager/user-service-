import mongoose from "mongoose";
import dotenv from "dotenv";
import logger from "../utils/logger.js";
import path from "path";

if (process.env.NODE_ENV !== 'test') {
    dotenv.config({ path: path.resolve(process.cwd(), "../.env") });
}

// Connect to MongoDB
export const connectDB = async () => {
    try {
        const mongoUri = process.env.MONGO_URI;

        if (!mongoUri) {
            throw new Error("MONGO_URI not found in environment variables");
        }

        await mongoose.connect(mongoUri);
        logger.info(`MongoDB connected successfully to ${mongoUri}`);
    } catch (err) {
        logger.error(`MongoDB connection error: ${err.message}`);
        if (process.env.NODE_ENV !== 'test') {
            process.exit(1);
        } else {
            throw err;
        }
    }
};

// Disconnect MongoDB
export const disconnectDB = async () => {
    try {
        await mongoose.disconnect();
        logger.info("MongoDB disconnected");
    } catch (err) {
        logger.error(`Error disconnecting DB: ${err.message}`);
    }
};