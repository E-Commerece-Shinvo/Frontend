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

/**
 * Create a new category (Admin)
 */
export const createCategory = async (categoryData) => {
    const response = await api.post('/categories', categoryData);
    return response.data;
};

/**
 * Update a category (Admin)
 */
export const updateCategory = async (id, categoryData) => {
    const response = await api.put(`/categories/${id}`, categoryData);
    return response.data;
};

/**
 * Delete a category (Admin)
 */
export const deleteCategory = async (id) => {
    const response = await api.delete(`/categories/${id}`);
    return response.data;
};
