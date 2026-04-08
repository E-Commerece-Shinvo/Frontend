import api from '../utils/api';

/**
 * Get paginated list of products with optional filters
 * @param {Object} params - { search, category, brand, minPrice, maxPrice, sort, page, limit }
 */
export const getProducts = async (params = {}) => {
    const response = await api.get('/products', { params });
    return response.data;
};

/**
 * Get a single product by ID
 * @param {String} id
 */
export const getProductById = async (id) => {
    const response = await api.get(`/products/${id}`);
    return response.data;
};

/**
 * Get bestseller products
 */
export const getBestsellers = async () => {
    const response = await api.get('/products/bestsellers');
    return response.data;
};

/**
 * Get new arrivals products
 */
export const getNewArrivals = async () => {
    const response = await api.get('/products/new-arrivals');
    return response.data;
};
