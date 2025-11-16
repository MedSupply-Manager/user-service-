import mongoose from "mongoose";
import logger from "../utils/logger.js";

// Connect to MongoDB
export const connectDB = async () => {
    try {
        const mongoUri = process.env.MONGO_URI;

        if (!mongoUri) {
            console.error(" MONGO_URI not found!");
            console.error("Available env vars:", Object.keys(process.env));
            throw new Error("MONGO_URI not found in .env");
        }

        await mongoose.connect(mongoUri);
        logger.info("MongoDB connected successfully");
    } catch (err) {
        logger.error(`MongoDB connection error: ${err.message}`);
        process.exit(1);
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