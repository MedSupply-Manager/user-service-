import userService from "../services/userService.js";

//  REGISTER 
export const register = async (req, res, next) => {
    try {
        const { username, email, password, role } = req.body;

        const userId = await userService.createUser({
            username,
            email,
            password,
            role,
        });

        res.status(201).json({
            success: true,
            message: "User registered successfully",
            userId,
        });
    } catch (err) {
        next(err);
    }
};

//  LOGIN 
export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const user = await userService.findUserByEmail(email);
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials"
            });
        }

        const validPassword = await userService.validatePassword(password, user.password);
        if (!validPassword) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials"
            });
        }

        const { accessToken, refreshToken } = await userService.generateAndStoreTokens(user);
        userService.setAuthCookies(res, accessToken, refreshToken);

        res.json({
            success: true,
            message: "Login successful",
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role
            },
        });
    } catch (err) {
        next(err);
    }
};