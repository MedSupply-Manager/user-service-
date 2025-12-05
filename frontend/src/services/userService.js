import api from './api';

const userService = {
    // Get all users (Admin only)
    getAllUsers: async () => {
        try {
            const response = await api.get('/users');
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Failed to fetch users' };
        }
    },

    // Get single user by ID (Admin only)
    getUserById: async (userId) => {
        try {
            const response = await api.get(`/users/${userId}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Failed to fetch user' };
        }
    },

    // Update user (Admin only)
    updateUser: async (userId, userData) => {
        try {
            const response = await api.put(`/users/${userId}`, userData);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Failed to update user' };
        }
    },

    // Delete user (Admin only)
    deleteUser: async (userId) => {
        try {
            const response = await api.delete(`/users/${userId}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Failed to delete user' };
        }
    },

    // Get user profile
    getProfile: async () => {
        try {
            const response = await api.get('/users/profile');
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Failed to fetch profile' };
        }
    },

    // Get admin dashboard stats
    getAdminDashboard: async () => {
        try {
            const response = await api.get('/users/admin/dashboard');
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Failed to fetch dashboard' };
        }
    },
};

export default userService;