import api from '../utils/api';

/**
 * Get all categories
 */
export const getCategories = async () => {
    const response = await api.get('/categories');
    return response.data;
};

/**
 * Get a single category by ID
 * @param {String} id
 */
export const getCategoryById = async (id) => {
    const response = await api.get(`/categories/${id}`);
    return response.data;
};
