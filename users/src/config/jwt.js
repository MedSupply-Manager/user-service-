import jwt from "jsonwebtoken";

// Don't read secrets at module load time - read them when functions are called
const getSecrets = () => ({
    access: process.env.JWT_ACCESS_SECRET,
    refresh: process.env.JWT_REFRESH_SECRET,
    email: process.env.JWT_EMAIL_SECRET,
    reset: process.env.JWT_PASSWORD_RESET_SECRET
});

const OPTIONS = { audience: "stock-management-users", issuer: "stock-management" };

// Sign token
const sign = (payload, secret, expiresIn) => jwt.sign(payload, secret, { expiresIn, ...OPTIONS });

// Verify token
const verify = (token, secret) => {
    try {
        const decoded = jwt.verify(token, secret);
        return { valid: true, decoded };
    } catch (err) {
        return { valid: false, error: err.message };
    }
};

// JWT Manager
export const JWTManager = {
    generateAccessToken: (payload) => {
        const SECRETS = getSecrets();
        return { token: sign(payload, SECRETS.access, "15m") };
    },
    verifyAccessToken: (token) => {
        const SECRETS = getSecrets();
        return verify(token, SECRETS.access);
    },

    generateRefreshToken: (payload) => {
        const SECRETS = getSecrets();
        return { token: sign(payload, SECRETS.refresh, "7d") };
    },
    verifyRefreshToken: (token) => {
        const SECRETS = getSecrets();
        return verify(token, SECRETS.refresh);
    },

    generateEmailToken: (payload) => {
        const SECRETS = getSecrets();
        return { token: sign(payload, SECRETS.email, "24h") };
    },
    verifyEmailToken: (token) => {
        const SECRETS = getSecrets();
        return verify(token, SECRETS.email);
    },

    generatePasswordResetToken: (payload) => {
        const SECRETS = getSecrets();
        return { token: sign(payload, SECRETS.reset, "1h") };
    },
    verifyPasswordResetToken: (token) => {
        const SECRETS = getSecrets();
        return verify(token, SECRETS.reset);
    }
};