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
