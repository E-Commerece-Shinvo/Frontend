import api from '../utils/api';

/**
 * Get the logged-in user's order history
 */
export const getMyOrders = async () => {
    const response = await api.get('/orders/my-orders');
    return response.data;
};

/**
 * Create a new order
 * @param {Object} orderData - { items, totalAmount, shippingAddress, paymentMethod }
 */
export const createOrder = async (orderData) => {
    const response = await api.post('/orders', orderData);
    return response.data;
};
