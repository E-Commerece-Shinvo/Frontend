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

/**
 * Get all orders (admin only)
 */
export const getAllOrders = async () => {
    const response = await api.get('/orders');
    return response.data;
};

/**
 * Get orders by specific user ID (admin only)
 */
export const getOrdersByUserId = async (userId) => {
    const response = await api.get(`/orders/user/${userId}`);
    return response.data;
};

/**
 * Get order by ID
 */
export const getOrderById = async (id) => {
    const response = await api.get(`/orders/${id}`);
    return response.data;
};

/**
 * Cancel order (user)
 */
export const cancelOrder = async (id) => {
    const response = await api.put(`/orders/${id}/cancel`);
    return response.data;
};

/**
 * Update order shipping address (user)
 */
export const updateOrderAddress = async (id, shippingAddress) => {
    const response = await api.put(`/orders/${id}/address`, { shippingAddress });
    return response.data;
};

/**
 * Request a refund (user)
 */
export const requestRefund = async (id) => {
    const response = await api.put(`/orders/${id}/refund`);
    return response.data;
};

/**
 * Process a refund (admin)
 */
export const processRefund = async (id) => {
    const response = await api.put(`/orders/${id}/process-refund`);
    return response.data;
};
/**
 * Update order status (admin only)
 */
export const updateOrderStatus = async (id, status) => {
    const response = await api.put(`/orders/${id}/status`, { status });
    return response.data;
};

/**
 * Get dashboard statistics (admin only)
 */
export const getDashboardStats = async () => {
    const response = await api.get('/orders/admin/stats');
    return response.data;
};

/**
 * Get recent activity (admin only)
 */
export const getRecentActivity = async () => {
    const response = await api.get('/orders/admin/recent');
    return response.data;
};
