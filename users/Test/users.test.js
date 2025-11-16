// Load environment variables FIRST (before any imports!)
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from users folder
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// CRITICAL: Set JWT secrets before importing anything else
process.env.JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || 'sdjcjvjdvjkjd1256cchjjdvjdfvd23v5r8ffZJJCHJV14255V55SCFEFJRV2588zjkkkjb';
process.env.JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'aylwnd2255dkjdh26402shleifjnfkkvlfv1025520663cdjkvfjfvhhksqllmkv0125l';
process.env.BCRYPT_ROUNDS = process.env.BCRYPT_ROUNDS || '12';
process.env.MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/users_test_db';

console.log('✅ JWT_ACCESS_SECRET loaded:', process.env.JWT_ACCESS_SECRET ? 'YES' : 'NO');
console.log('✅ JWT_REFRESH_SECRET loaded:', process.env.JWT_REFRESH_SECRET ? 'YES' : 'NO');

// Now import everything else
import request from "supertest";
import app from "../src/server.js";
import { connectDB, disconnectDB } from "../src/config/db.js";
import User from "../src/models/userModel.js";
import Session from "../src/models/sessionModel.js";

// Setup and teardown
beforeAll(async () => {
    await connectDB();
});

afterAll(async () => {
    await disconnectDB();
});

beforeEach(async () => {
    await User.deleteMany({});
    await Session.deleteMany({});
});

// ========================================
// SIMPLE TEST SUITE - SPRINT 1
// ========================================
describe("Users Microservice - Sprint 1", () => {

    // Test 1: User Registration
    test("Should register a new user successfully", async () => {
        const res = await request(app)
            .post("/api/users/register")
            .send({
                username: "testuser",
                email: "test@example.com",
                password: "Test123!",
                role: "admin"
            });

        expect(res.status).toBe(201);
        expect(res.body.success).toBe(true);
        expect(res.body.userId).toBeDefined();

        // Verify user exists in database
        const user = await User.findById(res.body.userId);
        expect(user).toBeTruthy();
        expect(user.email).toBe("test@example.com");
    });

    // Test 2: User Login
    test("Should login with valid credentials", async () => {
        // First register a user
        await request(app).post("/api/users/register").send({
            username: "loginuser",
            email: "login@test.com",
            password: "Test123!",
            role: "admin"
        });

        // Then login
        const res = await request(app)
            .post("/api/users/login")
            .send({
                email: "login@test.com",
                password: "Test123!"
            });

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.user).toBeDefined();
        expect(res.body.user.email).toBe("login@test.com");
    });
});