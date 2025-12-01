import jwt from "jsonwebtoken";

const SECRETS = {
    access: process.env.JWT_ACCESS_SECRET,
    refresh: process.env.JWT_REFRESH_SECRET,
    email: process.env.JWT_EMAIL_SECRET,
    reset: process.env.JWT_PASSWORD_RESET_SECRET
};

const validateSecrets = () => {
    const missing = [];
    if (!SECRETS.access) missing.push('JWT_ACCESS_SECRET');
    if (!SECRETS.refresh) missing.push('JWT_REFRESH_SECRET');
    if (!SECRETS.email) missing.push('JWT_EMAIL_SECRET');
    if (!SECRETS.reset) missing.push('JWT_PASSWORD_RESET_SECRET');

    if (missing.length > 0) {
        throw new Error(`Missing JWT secrets: ${missing.join(', ')}`);
    }
};

if (process.env.NODE_ENV !== 'test') {
    validateSecrets();
}

const OPTIONS = {
    audience: "stock-management-users",
    issuer: "stock-management"
};

const sign = (payload, secret, expiresIn) => {
    if (!secret) {
        throw new Error('JWT secret is required');
    }
    return jwt.sign(payload, secret, { expiresIn, ...OPTIONS });
};

const verify = (token, secret) => {
    try {
        if (!secret) {
            throw new Error('JWT secret is required');
        }
        const decoded = jwt.verify(token, secret, OPTIONS);
        return { valid: true, decoded };
    } catch (err) {
        return { valid: false, error: err.message };
    }
};

export const JWTManager = {
    generateAccessToken: (payload) => {
        return { token: sign(payload, SECRETS.access, "15m") };
    },

    verifyAccessToken: (token) => {
        return verify(token, SECRETS.access);
    },

    generateRefreshToken: (payload) => {
        return { token: sign(payload, SECRETS.refresh, "7d") };
    },

    verifyRefreshToken: (token) => {
        return verify(token, SECRETS.refresh);
    },

    generateEmailToken: (payload) => {
        return { token: sign(payload, SECRETS.email, "24h") };
    },

    verifyEmailToken: (token) => {
        return verify(token, SECRETS.email);
    },

    generatePasswordResetToken: (payload) => {
        return { token: sign(payload, SECRETS.reset, "1h") };
    },

    verifyPasswordResetToken: (token) => {
        return verify(token, SECRETS.reset);
    }
};

export default JWTManager;