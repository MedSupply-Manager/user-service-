import api from './api';

const authService = {
    // Register new user
    register: async (userData) => {
        try {
            const response = await api.post('/users/register', userData);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Registration failed' };
        }
    },

    // Login
    login: async (credentials) => {
        try {
            const response = await api.post('/users/login', credentials);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Login failed' };
        }
    },

    // Logout
    logout: async () => {
        try {
            const response = await api.post('/users/logout');
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Logout failed' };
        }
    },

    // Get current user
    getCurrentUser: async () => {
        try {
            const response = await api.get('/users/verify-token');
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Failed to get user' };
        }
    },

    // Verify email
    verifyEmail: async (token) => {
        try {
            const response = await api.get(`/users/verify-email/${token}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Email verification failed' };
        }
    },

    // Resend verification email
    resendVerification: async (email) => {
        try {
            const response = await api.post('/users/resend-verification', { email });
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Failed to resend verification' };
        }
    },

    // Forgot password
    forgotPassword: async (email) => {
        try {
            const response = await api.post('/users/forgot-password', { email });
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Failed to send reset email' };
        }
    },

    // Reset password
    resetPassword: async (token, password) => {
        try {
            const response = await api.post('/users/reset-password', {
                token,
                password
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Password reset failed' };
        }
    },

    // Refresh token
    refreshToken: async () => {
        try {
            const response = await api.post('/users/refresh-token');
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Token refresh failed' };
        }
    },
};

export default authService;