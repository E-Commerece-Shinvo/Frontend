import api from '../utils/api';

/**
 * Register a new user
 * @param {Object} userData - { username, email, password }
 */
export const registerUser = async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
};

/**
 * Login a user
 * @param {Object} credentials - { email, password }
 */
export const loginUser = async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
};

/**
 * Get current logged in user profile
 */
export const getUserProfile = async () => {
    const response = await api.get('/auth/profile');
    return response.data;
};
