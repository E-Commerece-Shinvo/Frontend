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

/**
 * Update current logged in user profile
 * @param {Object} profileData - { username, email, phone, gender, permanentAddress, profileImage, addresses }
 */
export const updateUserProfile = async (profileData) => {
    const response = await api.put('/auth/profile', profileData);
    return response.data;
};

/**
 * Upload an image file to Cloudinary
 * @param {File} file - The image file to upload
 */
export const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append('image', file);
    const response = await api.post('/upload', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
    return response.data;
};
