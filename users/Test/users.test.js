// ============================================================================
// CRITICAL: Set environment variables FIRST before any imports
// ============================================================================
process.env.NODE_ENV = 'test';
process.env.MONGO_URI = 'mongodb://localhost:27017/users_test_db';
process.env.JWT_ACCESS_SECRET = 'test_access_secret_key_12345678901234567890';
process.env.JWT_REFRESH_SECRET = 'test_refresh_secret_key_12345678901234567890';
process.env.JWT_EMAIL_SECRET = 'test_email_secret_key_12345678901234567890';
process.env.JWT_PASSWORD_RESET_SECRET = 'test_reset_secret_key_12345678901234567890';
process.env.BCRYPT_ROUNDS = '10';
process.env.FRONTEND_URL = 'http://localhost:5173';
process.env.SMTP_HOST = 'sandbox.smtp.mailtrap.io';
process.env.SMTP_PORT = '587';
process.env.SMTP_USER = 'test_user';
process.env.SMTP_PASS = 'test_pass';
process.env.EMAIL_FROM = 'Test <test@test.com>';

// Now safe to import everything else
import request from "supertest";
import app from "../src/server.js";
import { connectDB, disconnectDB } from "../src/config/db.js";
import User from "../src/models/userModel.js";
import Session from "../src/models/sessionModel.js";
import { JWTManager } from "../src/config/jwt.js";

console.log('=== Test Environment Configuration ===');
console.log('JWT_ACCESS_SECRET:', process.env.JWT_ACCESS_SECRET ? 'LOADED ✓' : 'MISSING ✗');
console.log('JWT_REFRESH_SECRET:', process.env.JWT_REFRESH_SECRET ? 'LOADED ✓' : 'MISSING ✗');
console.log('JWT_EMAIL_SECRET:', process.env.JWT_EMAIL_SECRET ? 'LOADED ✓' : 'MISSING ✗');
console.log('JWT_PASSWORD_RESET_SECRET:', process.env.JWT_PASSWORD_RESET_SECRET ? 'LOADED ✓' : 'MISSING ✗');
console.log('MONGO_URI:', process.env.MONGO_URI);
console.log('Environment:', process.env.NODE_ENV);
console.log('======================================\n');

const uniqueId = () => {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 100000);
    return `${timestamp}x${random}`;
};

// Setup and teardown
beforeAll(async () => {
    await connectDB();
}, 30000); // 30 second timeout

afterAll(async () => {
    await disconnectDB();
}, 30000); // 30 second timeout

beforeEach(async () => {
    await User.deleteMany({});
    await Session.deleteMany({});
    // Small delay to avoid race conditions
    await new Promise(resolve => setTimeout(resolve, 100));
});

// Helper function to create and login a user
const createAndLoginUser = async (userData = {}) => {
    const uid = uniqueId();
    const defaultUser = {
        username: "user" + uid,
        email: "test" + uid + "@example.com",
        password: "Test123!",
        role: "admin",
        ...userData
    };

    // Register user
    const regRes = await request(app)
        .post("/api/users/register")
        .send(defaultUser);

    if (regRes.status !== 201 || !regRes.body.userId) {
        console.error('Registration failed:', regRes.body);
        throw new Error("Failed to register user: " + JSON.stringify(regRes.body));
    }

    // Activate user directly in database
    await User.findByIdAndUpdate(
        regRes.body.userId,
        {
            emailVerified: true,
            status: "active"
        },
        { new: true }
    );

    // Wait before login to avoid rate limit
    await new Promise(resolve => setTimeout(resolve, 500));

    // Login
    const loginRes = await request(app)
        .post("/api/users/login")
        .send({
            email: defaultUser.email,
            password: defaultUser.password
        });

    if (loginRes.status !== 200) {
        console.error('Login failed:', loginRes.body);
        throw new Error("Failed to login: " + JSON.stringify(loginRes.body));
    }

    return {
        user: loginRes.body.user,
        cookies: loginRes.headers['set-cookie'] || [],
        email: defaultUser.email,
        password: defaultUser.password,
        userId: regRes.body.userId
    };
};

describe("Users Microservice - Complete Test Suite", () => {

    describe("POST /api/users/register", () => {
        test("Should register a new user successfully", async () => {
            const uid = uniqueId();
            const res = await request(app)
                .post("/api/users/register")
                .send({
                    username: "newuser" + uid,
                    email: "newuser" + uid + "@example.com",
                    password: "Test123!",
                    role: "admin"
                });

            expect(res.status).toBe(201);
            expect(res.body.success).toBe(true);
            expect(res.body.userId).toBeDefined();

            const user = await User.findById(res.body.userId);
            expect(user).toBeTruthy();
            expect(user.emailVerified).toBe(false);
        });

        test("Should fail with duplicate email", async () => {
            const uid = uniqueId();
            const email = "duplicate" + uid + "@test.com";

            await request(app)
                .post("/api/users/register")
                .send({
                    username: "user1" + uid,
                    email: email,
                    password: "Test123!",
                    role: "admin"
                });

            await new Promise(resolve => setTimeout(resolve, 500));

            const res = await request(app)
                .post("/api/users/register")
                .send({
                    username: "user2" + uid,
                    email: email,
                    password: "Test123!",
                    role: "admin"
                });

            expect(res.status).toBe(500);
            expect(res.body.success).toBe(false);
        });

        test("Should fail with invalid email format", async () => {
            const uid = uniqueId();
            const res = await request(app)
                .post("/api/users/register")
                .send({
                    username: "testuser" + uid,
                    email: "invalid-email",
                    password: "Test123!",
                    role: "admin"
                });

            expect(res.status).toBe(500);
            expect(res.body.success).toBe(false);
        });
    });

    describe("POST /api/users/login", () => {
        test("Should login with valid credentials", async () => {
            const uid = uniqueId();
            const uniqueEmail = "login" + uid + "@test.com";

            const regRes = await request(app)
                .post("/api/users/register")
                .send({
                    username: "loginuser" + uid,
                    email: uniqueEmail,
                    password: "Test123!",
                    role: "admin"
                });

            await User.findByIdAndUpdate(regRes.body.userId, {
                emailVerified: true,
                status: "active"
            });

            await new Promise(resolve => setTimeout(resolve, 500));

            const res = await request(app)
                .post("/api/users/login")
                .send({
                    email: uniqueEmail,
                    password: "Test123!"
                });

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.user.email).toBe(uniqueEmail);
            expect(res.headers['set-cookie']).toBeDefined();
        });

        test("Should fail with invalid password", async () => {
            const uid = uniqueId();
            const uniqueEmail = "faillogin" + uid + "@test.com";

            const regRes = await request(app)
                .post("/api/users/register")
                .send({
                    username: "loginuser" + uid,
                    email: uniqueEmail,
                    password: "Test123!",
                    role: "admin"
                });

            await User.findByIdAndUpdate(regRes.body.userId, {
                emailVerified: true,
                status: "active"
            });

            await new Promise(resolve => setTimeout(resolve, 500));

            const res = await request(app)
                .post("/api/users/login")
                .send({
                    email: uniqueEmail,
                    password: "WrongPassword!"
                });

            expect(res.status).toBe(401);
            expect(res.body.success).toBe(false);
            expect(res.body.message).toBe("Invalid credentials");
        });

        test("Should fail with non-existent email", async () => {
            const uid = uniqueId();
            const res = await request(app)
                .post("/api/users/login")
                .send({
                    email: "nonexistent" + uid + "@test.com",
                    password: "Test123!"
                });

            expect(res.status).toBe(401);
            expect(res.body.success).toBe(false);
        });
    });

    describe("GET /api/users/verify-email/:token", () => {
        test("Should verify email with valid token", async () => {
            const uid = uniqueId();
            const uniqueEmail = "verify" + uid + "@test.com";

            const regRes = await request(app)
                .post("/api/users/register")
                .send({
                    username: "verifyuser" + uid,
                    email: uniqueEmail,
                    password: "Test123!",
                    role: "admin"
                });

            expect(regRes.status).toBe(201);
            expect(regRes.body.userId).toBeDefined();

            const user = await User.findById(regRes.body.userId);
            expect(user).toBeTruthy();

            const { token } = JWTManager.generateEmailToken({
                userId: user._id.toString(),
                email: user.email
            });

            const res = await request(app)
                .get(`/api/users/verify-email/${token}`);

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.email).toBe(uniqueEmail);

            const updatedUser = await User.findById(user._id);
            expect(updatedUser.emailVerified).toBe(true);
            expect(updatedUser.status).toBe("active");
        });

        test("Should fail with invalid token", async () => {
            const res = await request(app)
                .get("/api/users/verify-email/invalid-token");

            expect(res.status).toBe(500);
            expect(res.body.success).toBe(false);
        });
    });

    describe("POST /api/users/forgot-password", () => {
        test("Should send password reset email for existing user", async () => {
            const uid = uniqueId();
            const uniqueEmail = "reset" + uid + "@test.com";

            const regRes = await request(app)
                .post("/api/users/register")
                .send({
                    username: "resetuser" + uid,
                    email: uniqueEmail,
                    password: "Test123!",
                    role: "admin"
                });

            expect(regRes.status).toBe(201);

            await User.findByIdAndUpdate(regRes.body.userId, {
                emailVerified: true,
                status: "active"
            });

            const res = await request(app)
                .post("/api/users/forgot-password")
                .send({
                    email: uniqueEmail
                });

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.message).toBe("Password reset email sent");
        });

        test("Should fail for non-existent user", async () => {
            const uid = uniqueId();
            const res = await request(app)
                .post("/api/users/forgot-password")
                .send({
                    email: "nonexistent" + uid + "@test.com"
                });

            expect(res.status).toBe(404);
            expect(res.body.success).toBe(false);
        });
    });

    describe("POST /api/users/reset-password", () => {
        test("Should reset password with valid token", async () => {
            const uid = uniqueId();
            const uniqueEmail = "resetpwd" + uid + "@test.com";

            const regRes = await request(app)
                .post("/api/users/register")
                .send({
                    username: "resetuser" + uid,
                    email: uniqueEmail,
                    password: "OldPassword123!",
                    role: "admin"
                });

            expect(regRes.status).toBe(201);

            const user = await User.findById(regRes.body.userId);
            expect(user).toBeTruthy();

            const { token } = JWTManager.generatePasswordResetToken({
                userId: user._id.toString()
            });

            await User.findByIdAndUpdate(user._id, {
                passwordResetToken: token,
                passwordResetExpires: new Date(Date.now() + 3600000)
            });

            const res = await request(app)
                .post("/api/users/reset-password")
                .send({
                    token: token,
                    password: "NewPassword123!"
                });

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.message).toBe("Password updated successfully");
        });

        test("Should fail with invalid token", async () => {
            const res = await request(app)
                .post("/api/users/reset-password")
                .send({
                    token: "invalid-token",
                    password: "NewPassword123!"
                });

            expect(res.status).toBe(500);
            expect(res.body.success).toBe(false);
        });
    });

    describe("POST /api/users/refresh-token", () => {
        test("Should refresh access token with valid refresh token", async () => {
            const { cookies } = await createAndLoginUser();

            const refreshTokenCookie = cookies.find(c => c.startsWith('refreshToken='));
            expect(refreshTokenCookie).toBeDefined();

            await new Promise(resolve => setTimeout(resolve, 500));

            const res = await request(app)
                .post("/api/users/refresh-token")
                .set('Cookie', refreshTokenCookie);

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.accessToken).toBeDefined();
        });

        test("Should fail without refresh token", async () => {
            const res = await request(app)
                .post("/api/users/refresh-token");

            expect(res.status).toBe(401);
            expect(res.body.success).toBe(false);
        });
    });

    describe("GET /api/users/verify-token", () => {
        test("Should verify valid access token", async () => {
            const { cookies } = await createAndLoginUser();

            const res = await request(app)
                .get("/api/users/verify-token")
                .set('Cookie', cookies);

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.valid).toBe(true);
            expect(res.body.user).toBeDefined();
        });

        test("Should fail without token", async () => {
            const res = await request(app)
                .get("/api/users/verify-token");

            expect(res.status).toBe(401);
            expect(res.body.success).toBe(false);
        });
    });

    describe("POST /api/users/logout", () => {
        test("Should logout successfully with valid session", async () => {
            const { cookies } = await createAndLoginUser();
            expect(cookies.length).toBeGreaterThan(0);

            const res = await request(app)
                .post("/api/users/logout")
                .set('Cookie', cookies);

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.message).toBe("Logged out successfully");
        });

        test("Should fail without refresh token", async () => {
            const { cookies } = await createAndLoginUser();
            const accessTokenOnly = cookies.filter(c => c.startsWith('accessToken='));

            const res = await request(app)
                .post("/api/users/logout")
                .set('Cookie', accessTokenOnly);

            expect(res.status).toBe(400);
            expect(res.body.success).toBe(false);
        });
    });

    describe("GET /api/users/profile", () => {
        test("Should get user profile with valid token", async () => {
            const { cookies, user } = await createAndLoginUser();

            const res = await request(app)
                .get("/api/users/profile")
                .set('Cookie', cookies);

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.user.email).toBe(user.email);
        });

        test("Should fail without authentication", async () => {
            const res = await request(app)
                .get("/api/users/profile");

            expect(res.status).toBe(401);
            expect(res.body.success).toBe(false);
        });
    });

    describe("GET /api/users", () => {
        test("Should get all users as admin", async () => {
            const { cookies } = await createAndLoginUser({ role: "admin" });

            const uid = uniqueId();
            await User.create({
                username: "user2" + uid,
                email: "user2" + uid + "@test.com",
                password: "Test123!",
                role: "admin",
                emailVerified: true,
                status: "active"
            });

            const res = await request(app)
                .get("/api/users")
                .set('Cookie', cookies);

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.users).toBeDefined();
            expect(res.body.count).toBeGreaterThanOrEqual(2);
        });

        test("Should fail without admin role", async () => {
            const { cookies } = await createAndLoginUser({ role: "pharmacie_standard" });

            const res = await request(app)
                .get("/api/users")
                .set('Cookie', cookies);

            expect(res.status).toBe(403);
            expect(res.body.success).toBe(false);
        });
    });

    describe("GET /api/users/:id", () => {
        test("Should get single user by ID as admin", async () => {
            const { cookies } = await createAndLoginUser({ role: "admin" });

            const uid = uniqueId();
            const targetUser = await User.create({
                username: "targetuser" + uid,
                email: "target" + uid + "@test.com",
                password: "Test123!",
                role: "admin",
                emailVerified: true,
                status: "active"
            });

            const res = await request(app)
                .get(`/api/users/${targetUser._id}`)
                .set('Cookie', cookies);

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.user._id).toBe(targetUser._id.toString());
        });

        test("Should fail for non-existent user", async () => {
            const { cookies } = await createAndLoginUser({ role: "admin" });
            const fakeId = "507f1f77bcf86cd799439011";

            const res = await request(app)
                .get(`/api/users/${fakeId}`)
                .set('Cookie', cookies);

            expect(res.status).toBe(404);
            expect(res.body.success).toBe(false);
        });
    });

    describe("PUT /api/users/:id", () => {
        test("Should update user as admin", async () => {
            const { cookies } = await createAndLoginUser({ role: "admin" });

            const uid = uniqueId();
            const targetUser = await User.create({
                username: "updateuser" + uid,
                email: "update" + uid + "@test.com",
                password: "Test123!",
                role: "admin",
                emailVerified: true,
                status: "active"
            });

            const res = await request(app)
                .put(`/api/users/${targetUser._id}`)
                .set('Cookie', cookies)
                .send({
                    username: "updateduser" + uid,
                    role: "admin"
                });

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
        });

        test("Should not allow password update through this endpoint", async () => {
            const { cookies } = await createAndLoginUser({ role: "admin" });

            const uid = uniqueId();
            const targetUser = await User.create({
                username: "user" + uid,
                email: "user" + uid + "@test.com",
                password: "Test123!",
                role: "admin",
                emailVerified: true,
                status: "active"
            });

            const res = await request(app)
                .put(`/api/users/${targetUser._id}`)
                .set('Cookie', cookies)
                .send({
                    password: "NewPassword123!"
                });

            expect(res.status).toBe(400);
            expect(res.body.success).toBe(false);
        });
    });

    describe("DELETE /api/users/:id", () => {
        test("Should deactivate user as admin", async () => {
            const { cookies } = await createAndLoginUser({ role: "admin" });

            const uid = uniqueId();
            const targetUser = await User.create({
                username: "deleteuser" + uid,
                email: "delete" + uid + "@test.com",
                password: "Test123!",
                role: "admin",
                emailVerified: true,
                status: "active"
            });

            const res = await request(app)
                .delete(`/api/users/${targetUser._id}`)
                .set('Cookie', cookies);

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.message).toBe("User deactivated successfully");

            const updatedUser = await User.findById(targetUser._id);
            expect(updatedUser.status).toBe("inactive");
        });

        test("Should not allow deleting own account", async () => {
            const { cookies, user } = await createAndLoginUser({ role: "admin" });

            const res = await request(app)
                .delete(`/api/users/${user.id}`)
                .set('Cookie', cookies);

            expect(res.status).toBe(400);
            expect(res.body.success).toBe(false);
            expect(res.body.message).toBe("Cannot delete your own account");
        });
    });

    describe("GET /api/users/admin/dashboard", () => {
        test("Should access admin dashboard with admin role", async () => {
            const { cookies } = await createAndLoginUser({ role: "admin" });

            const res = await request(app)
                .get("/api/users/admin/dashboard")
                .set('Cookie', cookies);

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.message).toBe("Welcome to Admin Dashboard!");
        });

        test("Should deny access without admin role", async () => {
            const { cookies } = await createAndLoginUser({ role: "pharmacie_standard" });

            const res = await request(app)
                .get("/api/users/admin/dashboard")
                .set('Cookie', cookies);

            expect(res.status).toBe(403);
            expect(res.body.success).toBe(false);
        });
    });

    describe("GET /api/users/health", () => {
        test("Should return service health status", async () => {
            const res = await request(app)
                .get("/api/users/health");

            expect(res.status).toBe(200);
            expect(res.body.status).toBe("UP");
            expect(res.body.service).toBe("users-service");
            expect(res.body.timestamp).toBeDefined();
        });
    });
});