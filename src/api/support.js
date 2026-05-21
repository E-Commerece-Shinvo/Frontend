import api from '../utils/api';

/**
 * Create a new support ticket (User)
 * @param {Object} ticketData { category, subject, message }
 */
export const createSupportTicket = async (ticketData) => {
    const response = await api.post('/support', ticketData);
    return response.data;
};

/**
 * Get all support tickets (Admin only)
 */
export const getAdminTickets = async () => {
    const response = await api.get('/support/admin');
    return response.data;
};

/**
 * Update a support ticket's status (Admin only)
 * @param {String} id
 * @param {String} status 'Open' | 'In Progress' | 'Resolved'
 */
export const updateAdminTicketStatus = async (id, status) => {
    const response = await api.put(`/support/admin/${id}/status`, { status });
    return response.data;
};

/**
 * Get all support tickets for the currently logged-in user
 */
export const getUserSupportTickets = async () => {
    const response = await api.get('/support');
    return response.data;
};

/**
 * Update user's own support ticket
 * @param {String} id
 * @param {Object} ticketData { category, subject, message }
 */
export const updateSupportTicket = async (id, ticketData) => {
    const response = await api.put(`/support/${id}`, ticketData);
    return response.data;
};

/**
 * Delete user's own support ticket
 * @param {String} id
 */
export const deleteSupportTicket = async (id) => {
    const response = await api.delete(`/support/${id}`);
    return response.data;
};
