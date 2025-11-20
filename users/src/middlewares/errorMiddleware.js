import logger from "../utils/logger.js";

export const errorHandler = (err, req, res, next) => {
    if (process.env.NODE_ENV === "development") {
        console.error(err.stack);
        logger?.error(err.stack);
    } else {
        logger?.error(err.message);
    }

    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(statusCode).json({
        success: false,
        message,
        errors: err.errors || null,
    });
};
