import jwt from "jsonwebtoken";

// CRITICAL: These must match what's set in users.test.js
const SECRETS = {
    access: process.env.JWT_ACCESS_SECRET || 'test_access_secret_key_12345678901234567890',
    refresh: process.env.JWT_REFRESH_SECRET || 'test_refresh_secret_key_12345678901234567890',
    email: process.env.JWT_EMAIL_SECRET || 'test_email_secret_key_12345678901234567890',
    reset: process.env.JWT_PASSWORD_RESET_SECRET || 'test_reset_secret_key_12345678901234567890'
};

// Validate secrets are loaded
if (!SECRETS.access || !SECRETS.refresh || !SECRETS.email || !SECRETS.reset) {
    throw new Error('JWT secrets not properly loaded in test environment');
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
    generateAccessToken: (payload) => ({ token: sign(payload, SECRETS.access, "15m") }),
    verifyAccessToken: (token) => verify(token, SECRETS.access),

    generateRefreshToken: (payload) => ({ token: sign(payload, SECRETS.refresh, "7d") }),
    verifyRefreshToken: (token) => verify(token, SECRETS.refresh),

    generateEmailToken: (payload) => ({ token: sign(payload, SECRETS.email, "24h") }),
    verifyEmailToken: (token) => verify(token, SECRETS.email),

    generatePasswordResetToken: (payload) => ({ token: sign(payload, SECRETS.reset, "1h") }),
    verifyPasswordResetToken: (token) => verify(token, SECRETS.reset)
};

// Add actual tests to prevent "must contain at least one test" error
describe("JWT Manager Tests", () => {
    test("Should generate and verify access token", () => {
        const payload = { userId: "123", role: "admin" };
        const { token } = JWTManager.generateAccessToken(payload);
        expect(token).toBeDefined();

        const result = JWTManager.verifyAccessToken(token);
        expect(result.valid).toBe(true);
        expect(result.decoded.userId).toBe("123");
    });

    test("Should generate and verify refresh token", () => {
        const payload = { userId: "123" };
        const { token } = JWTManager.generateRefreshToken(payload);
        expect(token).toBeDefined();

        const result = JWTManager.verifyRefreshToken(token);
        expect(result.valid).toBe(true);
    });

    test("Should generate and verify email token", () => {
        const payload = { userId: "123", email: "test@test.com" };
        const { token } = JWTManager.generateEmailToken(payload);
        expect(token).toBeDefined();

        const result = JWTManager.verifyEmailToken(token);
        expect(result.valid).toBe(true);
    });

    test("Should generate and verify password reset token", () => {
        const payload = { userId: "123" };
        const { token } = JWTManager.generatePasswordResetToken(payload);
        expect(token).toBeDefined();

        const result = JWTManager.verifyPasswordResetToken(token);
        expect(result.valid).toBe(true);
    });

    test("Should fail with invalid token", () => {
        const result = JWTManager.verifyAccessToken("invalid-token");
        expect(result.valid).toBe(false);
        expect(result.error).toBeDefined();
    });

    test("Should fail with token signed with wrong secret", () => {
        const wrongToken = jwt.sign({ userId: "123" }, "wrong-secret", { expiresIn: "15m" });
        const result = JWTManager.verifyAccessToken(wrongToken);
        expect(result.valid).toBe(false);
    });
});