import api from '../utils/api';

/**
 * Get all users (Admin only)
 */
export const getAllUsers = async () => {
    const response = await api.get('/users');
    return response.data;
};

/**
 * Get user by ID (Admin only)
 */
export const getUserById = async (id) => {
    const response = await api.get(`/users/${id}`);
    return response.data;
};

/**
 * Update user details (Admin only)
 * @param {String} id 
 * @param {Object} userData 
 */
export const updateUser = async (id, userData) => {
    const response = await api.put(`/users/${id}`, userData);
    return response.data;
};

/**
 * Toggle block status for a user (Admin only)
 * @param {String} id 
 */
export const toggleUserBlock = async (id) => {
    const response = await api.put(`/users/${id}/block`);
    return response.data;
};
