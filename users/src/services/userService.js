import bcrypt from "bcrypt";
import { JWTManager } from "../config/jwt.js";
import User from "../models/userModel.js";
import Session from "../models/sessionModel.js";

const BCRYPT_ROUNDS = parseInt(process.env.BCRYPT_ROUNDS || "12", 10);

const userService = {
    //  Create new user
    async createUser({ username, email, password, role }) {
        const user = await User.create({
            username,
            email,
            password,
            role,
            emailVerified: true,
            status: "active"
        });

        return user._id;
    },

    // Find user by email 
    async findUserByEmail(email) {
        return User.findOne({ email }).select("+password");
    },

    // Validate password
    async validatePassword(password, hashed) {
        return bcrypt.compare(password, hashed);
    },

    // Generate tokens & store session
    async generateAndStoreTokens(user) {
        const { token: accessToken } = JWTManager.generateAccessToken({
            userId: user._id,
            role: user.role,
        });
        const { token: refreshToken } = JWTManager.generateRefreshToken({
            userId: user._id
        });

        await Session.createSession({
            userId: user._id,
            accessToken,
            refreshToken,
        });

        return { accessToken, refreshToken };
    },

    //  Set auth cookies
    setAuthCookies(res, accessToken, refreshToken) {
        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            sameSite: "strict",
            secure: process.env.NODE_ENV === "production",
            maxAge: 15 * 60 * 1000, // 15 minutes
        });
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            sameSite: "strict",
            secure: process.env.NODE_ENV === "production",
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });
    },
};

export default userService;