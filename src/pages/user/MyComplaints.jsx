import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar/Navbar';
import Footer from '../../components/layout/Footer/Footer';
import { useAuth } from '../../context/AuthContext';
import { getUserSupportTickets, updateSupportTicket, deleteSupportTicket } from '../../api/support';
import {
    FiUser, FiShoppingBag, FiRotateCcw, FiClock, FiHelpCircle,
    FiFileText, FiEdit2, FiTrash2, FiPlus, FiAlertTriangle,
    FiXCircle, FiCheck, FiSend, FiFile
} from 'react-icons/fi';
import toast from 'react-hot-toast';

function MyComplaints() {
    const { user } = useAuth();
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Modal state for editing
    const [editingTicket, setEditingTicket] = useState(null);
    const [editForm, setEditForm] = useState({
        category: 'Order Query',
        subject: '',
        message: ''
    });
    const [isUpdating, setIsUpdating] = useState(false);

    // Fetch user support tickets on mount
    useEffect(() => {
        fetchTickets();
    }, []);

    const fetchTickets = async () => {
        try {
            setLoading(true);
            const data = await getUserSupportTickets();
            setTickets(data);
        } catch (err) {
            console.error('Failed to fetch tickets:', err);
            toast.error(err.response?.data?.message || 'Failed to fetch complaints.');
        } finally {
            setLoading(false);
        }
    };

    // Delete handler
    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this complaint? This action cannot be undone.")) {
            return;
        }

        const toastId = toast.loading("Deleting complaint...");
        try {
            await deleteSupportTicket(id);
            setTickets(prev => prev.filter(t => t._id !== id));
            toast.success("Complaint deleted successfully!", { id: toastId });
        } catch (err) {
            console.error('Failed to delete complaint:', err);
            toast.error(err.response?.data?.message || 'Failed to delete complaint.', { id: toastId });
        }
    };

    // Open Edit modal
    const openEditModal = (ticket) => {
        if (ticket.status !== 'Open') {
            toast.error("Only Pending/Open complaints can be edited.");
            return;
        }
        setEditingTicket(ticket);
        setEditForm({
            category: ticket.category || 'Order Query',
            subject: ticket.subject || '',
            message: ticket.message || ''
        });
    };

    // Submit Edit handler
    const handleEditSubmit = async (e) => {
        e.preventDefault();
        if (!editForm.subject.trim() || !editForm.message.trim()) {
            toast.error("Please fill in all fields.");
            return;
        }

        setIsUpdating(true);
        const toastId = toast.loading("Updating complaint...");
        try {
            const updated = await updateSupportTicket(editingTicket._id, editForm);
            setTickets(prev => prev.map(t => t._id === updated._id ? { ...t, ...updated } : t));
            toast.success("Complaint updated successfully!", { id: toastId });
            setEditingTicket(null);
        } catch (err) {
            console.error('Failed to update complaint:', err);
            toast.error(err.response?.data?.message || 'Failed to update complaint.', { id: toastId });
        } finally {
            setIsUpdating(false);
        }
    };

    // Format Date
    const formatDate = (dateStr) =>
        new Date(dateStr).toLocaleDateString('en-US', {
            year: 'numeric', month: 'short', day: 'numeric',
            hour: '2-digit', minute: '2-digit'
        });

    // Helper — Map internal status to presentation status
    const getStatusConfig = (status) => {
        switch (status) {
            case 'Resolved':
                return { label: 'Resolved', color: '#10b981', bg: '#e6fcf5', text: '#0ca678' };
            case 'In Progress':
                return { label: 'Processing', color: '#3b82f6', bg: '#e7f5ff', text: '#1c7ed6' };
            default:
                return { label: 'Pending', color: '#f59e0b', bg: '#fff9db', text: '#f59f00' };
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-[#f5f5f5]">
            <Navbar />

            {/* Spacer for fixed navbar */}
            <div className="h-[90px] md:h-[110px]" />

            {/* ───── main wrapper ───── */}
            <div className="flex-1 flex flex-col lg:flex-row max-w-[1200px] w-full mx-auto px-4 py-6 md:py-10 gap-6 lg:gap-8 items-start">

                {/* ───── SIDEBAR (Desktop) ───── */}
                <aside className="hidden lg:block w-[260px] flex-shrink-0 bg-white rounded-2xl py-6 shadow-sm border border-gray-100 sticky top-[95px]">
                    {/* greeting */}
                    <div className="flex items-center gap-3 px-6 pb-5 border-b border-gray-100">
                        <div className="w-10 h-10 rounded-full bg-[#53C1CC] text-white flex items-center justify-center font-bold text-base shadow-sm overflow-hidden">
                            {user?.profileImage ? (
                                <img src={user.profileImage} alt="Avatar" className="w-full h-full object-cover" />
                            ) : (
                                user?.username?.charAt(0).toUpperCase() || 'U'
                            )}
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[11px] text-gray-400 uppercase tracking-wider font-semibold">Welcome back</span>
                            <span className="text-[15px] text-gray-900 font-bold truncate max-w-[150px]">
                                {user?.username || 'User'}
                            </span>
                        </div>
                    </div>

                    {/* nav links */}
                    <div className="px-3 pt-5 flex flex-col gap-1">
                        <h4 className="px-3 text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2">Account Settings</h4>
                        <Link to="/profile" className="flex items-center gap-3 px-3 py-2.5 text-[14px] text-gray-600 font-medium rounded-xl hover:bg-gray-50 transition-all group">
                            <FiUser className="text-gray-400 group-hover:text-[#53C1CC]" size={18} />
                            My Profile
                        </Link>
                    </div>

                    <div className="px-3 pt-6 flex flex-col gap-1">
                        <h4 className="px-3 text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2">Shopping Activity</h4>
                        <Link to="/my-orders" className="flex items-center gap-3 px-3 py-2.5 text-[14px] text-gray-600 font-medium rounded-xl hover:bg-gray-50 transition-all group">
                            <FiShoppingBag className="text-gray-400 group-hover:text-[#53C1CC]" size={18} />
                            My Orders
                        </Link>
                        <Link to="/my-returns" className="flex items-center gap-3 px-3 py-2.5 text-[14px] text-gray-600 font-medium rounded-xl hover:bg-gray-50 transition-all group">
                            <FiRotateCcw className="text-gray-400 group-hover:text-[#53C1CC]" size={18} />
                            My Returns
                        </Link>
                        <Link to="/my-orders?tab=cancelled" className="flex items-center gap-3 px-3 py-2.5 text-[14px] text-gray-600 font-medium rounded-xl hover:bg-gray-50 transition-all group">
                            <FiClock className="text-gray-400 group-hover:text-amber-400" size={18} />
                            Cancellations
                        </Link>
                    </div>

                    <div className="px-3 pt-6 flex flex-col gap-1">
                        <h4 className="px-3 text-[11px] font-bold text-[#53C1CC] uppercase tracking-widest mb-2">Help & Support</h4>
                        <Link to="/support" className="flex items-center gap-3 px-3 py-2.5 text-[14px] text-gray-600 font-medium rounded-xl hover:bg-gray-50 transition-all group">
                            <FiHelpCircle className="text-gray-400 group-hover:text-[#53C1CC]" size={18} />
                            Customer Support
                        </Link>
                        <Link to="/my-complaints" className="flex items-center gap-3 px-3 py-2.5 text-[14px] text-[#53C1CC] font-bold rounded-xl bg-[#53C1CC]/5 transition-all">
                            <FiFileText size={18} />
                            My Complaints
                        </Link>
                    </div>
                </aside>

                {/* ───── RIGHT CONTENT ───── */}
                <main className="flex-1 min-w-0 w-full pt-6 md:pt-10">

                    {/* Page Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                        <div>
                            <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight mb-2">My Complaints</h1>
                            <p className="text-gray-500 text-[14px]">View status, edit, or delete your submitted complaints & feedback.</p>
                        </div>
                        <Link
                            to="/support"
                            className="flex items-center justify-center gap-2 bg-[#53C1CC] hover:bg-[#46869d] text-white px-5 py-3 rounded-xl text-xs font-black uppercase tracking-widest shadow-md hover:shadow-lg transition-all active:scale-95 shrink-0"
                        >
                            <FiPlus size={16} /> File New Complaint
                        </Link>
                    </div>

                    {/* Loading State */}
                    {loading && (
                        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
                            <div className="w-10 h-10 border-4 border-gray-100 border-t-[#53C1CC] rounded-full animate-spin mb-4" />
                            <p className="text-gray-500 font-medium">Fetching complaints history...</p>
                        </div>
                    )}

                    {/* Empty State */}
                    {!loading && tickets.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm px-6 text-center">
                            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                                <FiFile size={40} className="text-gray-300" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 mb-2">No complaints filed</h3>
                            <p className="text-gray-500 text-[14px] max-w-[340px] mb-8">
                                If you have any inquiries, payment problems, or return issues, file a complaint ticket and our team will get back to you!
                            </p>
                            <Link to="/support" className="px-8 py-3 bg-[#53C1CC] text-white rounded-xl font-bold text-[14px] hover:bg-[#43aab5] transition-all shadow-lg shadow-[#53C1CC]/20 active:scale-95">
                                Contact Customer Support
                            </Link>
                        </div>
                    )}

                    {/* Complaints List */}
                    {!loading && tickets.length > 0 && (
                        <div className="flex flex-col gap-5">
                            {tickets.map((ticket) => {
                                const status = getStatusConfig(ticket.status);
                                return (
                                    <div key={ticket._id} className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row md:items-start justify-between gap-6 relative overflow-hidden">
                                        
                                        {/* Status indicator border (left) */}
                                        <div className="absolute left-0 top-0 bottom-0 w-1.5" style={{ backgroundColor: status.color }} />

                                        <div className="flex-1 pl-2">
                                            <div className="flex flex-wrap items-center gap-3 mb-3">
                                                <span className="px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest text-[#53C1CC] bg-[#53C1CC]/10">
                                                    {ticket.category}
                                                </span>
                                                <span className="text-xs text-gray-400 font-semibold">
                                                    Filed on {formatDate(ticket.createdAt)}
                                                </span>
                                            </div>

                                            <h3 className="text-base md:text-lg font-black text-gray-900 mb-2 leading-snug">
                                                {ticket.subject}
                                            </h3>

                                            <p className="text-[13px] md:text-[14px] text-gray-500 font-medium leading-relaxed bg-gray-50/50 p-4 rounded-xl border border-gray-50/80">
                                                {ticket.message}
                                            </p>
                                        </div>

                                        <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-start gap-4 shrink-0 border-t md:border-0 pt-4 md:pt-0 border-gray-50">
                                            {/* Status Badge */}
                                            <span 
                                                className="px-4 py-1.5 rounded-full text-[11px] font-black uppercase tracking-[0.1em] flex items-center gap-1.5"
                                                style={{ backgroundColor: status.bg, color: status.text }}
                                            >
                                                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: status.color }} />
                                                {status.label}
                                            </span>

                                            {/* Action Buttons */}
                                            <div className="flex items-center gap-2">
                                                {/* Edit Button */}
                                                <button
                                                    onClick={() => openEditModal(ticket)}
                                                    disabled={ticket.status !== 'Open'}
                                                    className="p-2.5 rounded-xl border border-gray-100 hover:border-cyan-200 text-gray-600 hover:text-cyan-600 hover:bg-cyan-50/30 transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
                                                    title={ticket.status === 'Open' ? "Edit Complaint" : "Cannot edit processing/resolved tickets"}
                                                >
                                                    <FiEdit2 size={16} />
                                                </button>

                                                {/* Delete Button */}
                                                <button
                                                    onClick={() => handleDelete(ticket._id)}
                                                    className="p-2.5 rounded-xl border border-gray-100 hover:border-red-200 text-gray-600 hover:text-red-600 hover:bg-red-50/30 transition-all active:scale-95"
                                                    title="Delete Complaint"
                                                >
                                                    <FiTrash2 size={16} />
                                                </button>
                                            </div>
                                        </div>

                                    </div>
                                );
                            })}
                        </div>
                    )}

                </main>
            </div>

            {/* ───── Edit Complaint Modal ───── */}
            {editingTicket && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
                    <div
                        className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-fade-in"
                        onClick={() => setEditingTicket(null)}
                    />
                    <div className="bg-white w-full max-w-[600px] rounded-[32px] shadow-2xl relative z-10 overflow-hidden animate-in zoom-in-95 duration-200">
                        {/* Modal Header */}
                        <div className="bg-gradient-to-r from-[#001B1B] to-[#006060] px-8 py-6 flex items-center justify-between relative overflow-hidden">
                            <div className="flex items-center gap-3 relative z-10">
                                <div className="p-2.5 bg-white/10 rounded-xl backdrop-blur-md border border-white/10">
                                    <FiFileText className="text-white" size={20} />
                                </div>
                                <h3 className="text-xl font-bold text-white">Edit Support Complaint</h3>
                            </div>
                            <button
                                onClick={() => setEditingTicket(null)}
                                className="p-2 text-white/80 hover:text-white hover:bg-white/20 rounded-lg transition-all relative z-10"
                            >
                                <FiXCircle size={24} />
                            </button>
                        </div>

                        {/* Modal Form */}
                        <form onSubmit={handleEditSubmit} className="p-8">
                            <div className="flex flex-col gap-6">
                                {/* Category Dropdown */}
                                <div className="flex flex-col gap-2">
                                    <label className="text-[12px] font-bold text-gray-400 uppercase tracking-wider ml-1">Complaint Category</label>
                                    <select
                                        value={editForm.category}
                                        onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                                        className="w-full px-4 py-3.5 bg-gray-50/50 border border-gray-200 rounded-2xl text-[14px] text-gray-900 outline-none focus:border-[#53C1CC] focus:ring-4 focus:ring-[#53C1CC]/10 transition-all font-medium appearance-none cursor-pointer"
                                    >
                                        <option value="Order Query">Order Query</option>
                                        <option value="Payment Issue">Payment Issue</option>
                                        <option value="Product Info">Product Info</option>
                                        <option value="Return & Refund">Return & Refund</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>

                                {/* Subject */}
                                <div className="flex flex-col gap-2">
                                    <label className="text-[12px] font-bold text-gray-400 uppercase tracking-wider ml-1">Subject</label>
                                    <input
                                        type="text"
                                        required
                                        value={editForm.subject}
                                        onChange={(e) => setEditForm({ ...editForm, subject: e.target.value })}
                                        placeholder="Complaint subject"
                                        className="w-full px-4 py-3.5 bg-gray-50/50 border border-gray-200 rounded-2xl text-[14px] outline-none focus:border-[#53C1CC] focus:ring-4 focus:ring-[#53C1CC]/10 transition-all font-medium"
                                    />
                                </div>

                                {/* Message */}
                                <div className="flex flex-col gap-2">
                                    <label className="text-[12px] font-bold text-gray-400 uppercase tracking-wider ml-1">Complaint Details</label>
                                    <textarea
                                        required
                                        rows="5"
                                        value={editForm.message}
                                        onChange={(e) => setEditForm({ ...editForm, message: e.target.value })}
                                        placeholder="Explain your problem here..."
                                        className="w-full px-4 py-3.5 bg-gray-50/50 border border-gray-200 rounded-2xl text-[14px] outline-none focus:border-[#53C1CC] focus:ring-4 focus:ring-[#53C1CC]/10 transition-all font-medium resize-none"
                                    />
                                </div>
                            </div>

                            <div className="mt-8 flex flex-col sm:flex-row justify-end gap-3 border-t border-gray-50 pt-5">
                                <button
                                    type="button"
                                    onClick={() => setEditingTicket(null)}
                                    className="px-6 py-3 bg-white text-gray-500 rounded-xl font-bold text-[14px] hover:text-gray-700 transition-all text-center"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isUpdating}
                                    className="px-8 py-3 bg-[#53C1CC] hover:bg-[#43aab5] text-white rounded-xl font-bold text-[14px] transition-all shadow-xl shadow-[#53C1CC]/10 active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-75"
                                >
                                    {isUpdating ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                            Saving Changes...
                                        </>
                                    ) : (
                                        <>
                                            <FiSend /> Save Changes
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <Footer />
        </div>
    );
}

export default MyComplaints;
