import rateLimit from "express-rate-limit";

export const createRateLimiter = (options = {}) => {
    // Disable rate limiting in test environment
    if (process.env.NODE_ENV === 'test') {
        return (req, res, next) => next();
    }

    return rateLimit({
        windowMs: options.windowMs || 15 * 60 * 1000,
        max: options.max || 100,
        message: options.message || {
            success: false,
            message: "Too many requests, please try again later",
        },
        standardHeaders: true,
        legacyHeaders: false,
    });
};

export const loginLimiter = createRateLimiter({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: { success: false, message: "Too many login attempts. Try again in 15 minutes" },
});