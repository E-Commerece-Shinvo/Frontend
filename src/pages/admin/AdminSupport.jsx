import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    FiSearch, FiFilter, FiMessageSquare, FiAlertCircle,
    FiCheckCircle, FiChevronLeft, FiChevronRight,
    FiEye, FiClock, FiUser, FiArrowLeft, FiX, FiFileText, FiMail
} from 'react-icons/fi';
import { getAdminTickets, updateAdminTicketStatus } from '../../api/support';
import toast from 'react-hot-toast';
import AdminPagination from '../../components/admin/AdminPagination';

const AdminSupport = () => {
    const navigate = useNavigate();
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all'); // all, Open, In Progress, Resolved
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;

    // View Modal State
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [updatingStatus, setUpdatingStatus] = useState(false);

    useEffect(() => {
        fetchTickets();
    }, []);

    const fetchTickets = async () => {
        setLoading(true);
        try {
            const data = await getAdminTickets();
            setTickets(data || []);
        } catch (error) {
            console.error("Failed to fetch support tickets:", error);
            toast.error("Failed to load support tickets");
        } finally {
            setLoading(false);
        }
    };

    const handleViewClick = (ticket) => {
        setSelectedTicket(ticket);
        setIsViewModalOpen(true);
    };

    const handleStatusChange = async (newStatus) => {
        if (!selectedTicket) return;
        setUpdatingStatus(true);
        const toastId = toast.loading(`Updating ticket status to ${newStatus}...`);
        try {
            const updated = await updateAdminTicketStatus(selectedTicket._id, newStatus);
            toast.success("Ticket status updated successfully!", { id: toastId });
            setSelectedTicket(updated);
            fetchTickets(); // Refresh list
        } catch (error) {
            console.error("Failed to update ticket status:", error);
            toast.error("Failed to update status", { id: toastId });
        } finally {
            setUpdatingStatus(false);
        }
    };

    // Calculate Stats
    const stats = useMemo(() => {
        const total = tickets.length;
        const open = tickets.filter(t => t.status === 'Open').length;
        const inProgress = tickets.filter(t => t.status === 'In Progress').length;
        const resolved = tickets.filter(t => t.status === 'Resolved').length;

        return { total, open, inProgress, resolved };
    }, [tickets]);

    // Filtering & Searching
    const filteredTickets = useMemo(() => {
        return tickets.filter(t => {
            const username = t.user?.username || '';
            const email = t.email || t.user?.email || '';
            const matchesSearch = t.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                email.toLowerCase().includes(searchTerm.toLowerCase());

            if (filterStatus === 'Open') return matchesSearch && t.status === 'Open';
            if (filterStatus === 'In Progress') return matchesSearch && t.status === 'In Progress';
            if (filterStatus === 'Resolved') return matchesSearch && t.status === 'Resolved';
            return matchesSearch;
        });
    }, [tickets, searchTerm, filterStatus]);

    const totalPages = Math.ceil(filteredTickets.length / itemsPerPage);
    const paginatedTickets = filteredTickets.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const getStatusStyle = (status) => {
        switch (status) {
            case 'Open':
                return { label: 'Open', color: 'text-blue-600 bg-blue-50 border-blue-100', icon: <FiAlertCircle size={12} /> };
            case 'In Progress':
                return { label: 'In Progress', color: 'text-amber-600 bg-amber-50 border-amber-100', icon: <FiClock size={12} /> };
            case 'Resolved':
                return { label: 'Resolved', color: 'text-teal-600 bg-teal-50 border-teal-100', icon: <FiCheckCircle size={12} /> };
            default:
                return { label: 'Unknown', color: 'text-gray-600 bg-gray-50 border-gray-100', icon: null };
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Header section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white p-8 rounded-[32px] shadow-sm border border-gray-50">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="w-12 h-12 flex items-center justify-center bg-gray-50 hover:bg-gray-100 rounded-2xl text-gray-400 hover:text-gray-900 transition-all group"
                    >
                        <FiArrowLeft className="group-hover:-translate-x-1 transition-transform" />
                    </button>
                    <div>
                        <h1 className="text-3xl font-black tracking-tight text-gray-900">Support Tickets</h1>
                        <p className="text-gray-400 text-sm font-medium mt-1 uppercase tracking-widest flex items-center gap-2">
                            Customer Helpline <span className="w-1 h-1 bg-gray-300 rounded-full"></span> {filteredTickets.length} Tickets
                        </p>
                    </div>
                </div>
                <div className="relative w-full md:w-96 group">
                    <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-cyan-500 transition-colors" />
                    <input
                        type="text"
                        placeholder="Search by subject, username or email..."
                        className="w-full pl-12 pr-4 py-4 bg-gray-50 border-transparent focus:bg-white focus:border-cyan-200 rounded-[20px] text-sm font-medium transition-all outline-none"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <SupportStatCard
                    label="Total Tickets"
                    value={stats.total}
                    icon={<FiMessageSquare />}
                    color="bg-[#001B1B]"
                    desc="Total queries submitted"
                />
                <SupportStatCard
                    label="Open"
                    value={stats.open}
                    icon={<FiAlertCircle />}
                    color="bg-blue-500"
                    desc="Awaiting support response"
                    pulse={stats.open > 0}
                />
                <SupportStatCard
                    label="In Progress"
                    value={stats.inProgress}
                    icon={<FiClock />}
                    color="bg-amber-500"
                    desc="Being handled currently"
                />
                <SupportStatCard
                    label="Resolved"
                    value={stats.resolved}
                    icon={<FiCheckCircle />}
                    color="bg-teal-500"
                    desc="Successfully closed issues"
                />
            </div>

            {/* Main Content Area */}
            <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden flex flex-col h-[750px]">
                <div className="p-8 border-b border-gray-50 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-3">
                        <div className="w-2 h-8 bg-cyan-500 rounded-full"></div>
                        <h3 className="text-xl font-bold text-gray-900">User Ticket Logs</h3>
                    </div>

                    {/* Filters */}
                    <div className="flex items-center gap-2 bg-gray-50 p-1.5 rounded-2xl">
                        {['all', 'Open', 'In Progress', 'Resolved'].map((s) => (
                            <button
                                key={s}
                                onClick={() => setFilterStatus(s)}
                                className={`px-5 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${filterStatus === s
                                    ? 'bg-white text-gray-900 shadow-sm'
                                    : 'text-gray-400 hover:text-gray-600'
                                    }`}
                            >
                                {s === 'all' ? 'All' : s}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="overflow-auto flex-1 custom-scrollbar">
                    {/* Mobile Card View */}
                    <div className="lg:hidden divide-y divide-gray-50">
                        {loading ? (
                            <div className="py-20 text-center">
                                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-cyan-500 mx-auto"></div>
                            </div>
                        ) : paginatedTickets.length === 0 ? (
                            <div className="py-20 text-center text-gray-400 font-bold uppercase tracking-widest">
                                No support tickets found
                            </div>
                        ) : (
                            paginatedTickets.map((t) => {
                                const status = getStatusStyle(t.status);
                                return (
                                    <div key={t._id} className="p-6 space-y-4">
                                        <div className="flex justify-between items-start gap-4">
                                            <div className="min-w-0">
                                                <h4 className="text-sm font-black text-gray-900 truncate uppercase tracking-tight">{t.subject}</h4>
                                                <p className="text-[10px] text-gray-400 font-bold uppercase mt-1 tracking-widest">
                                                    By: {t.user?.username || 'Guest'} ({t.email || t.user?.email || 'N/A'})
                                                </p>
                                            </div>
                                            <span className={`px-2 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest border shrink-0 flex items-center gap-1 ${status.color}`}>
                                                {status.icon} {status.label}
                                            </span>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4 bg-gray-50/50 p-4 rounded-2xl">
                                            <div className="flex flex-col">
                                                <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Category</span>
                                                <span className="text-xs font-bold text-gray-900">{t.category}</span>
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Created At</span>
                                                <span className="text-xs font-bold text-gray-700">
                                                    {new Date(t.createdAt).toLocaleDateString()}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex justify-end pt-2">
                                            <button
                                                onClick={() => handleViewClick(t)}
                                                className="px-5 py-2.5 bg-[#001B1B] text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 active:scale-95 transition-all"
                                            >
                                                <FiEye /> View Detail
                                            </button>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>

                    {/* Desktop Table View */}
                    <div className="hidden lg:block overflow-x-auto">
                        <table className="w-full min-w-[1000px]">
                            <thead>
                                <tr className="bg-gray-50/50 text-[11px] text-gray-400 uppercase tracking-[0.2em] font-black">
                                    <th className="px-8 py-5 text-left">User Details</th>
                                    <th className="px-8 py-5 text-left">Category</th>
                                    <th className="px-8 py-5 text-left">Subject</th>
                                    <th className="px-8 py-5 text-left">Date</th>
                                    <th className="px-8 py-5 text-left">Status</th>
                                    <th className="px-8 py-5 text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {loading ? (
                                    <tr>
                                        <td colSpan="6" className="py-20 text-center">
                                            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-cyan-500 mx-auto"></div>
                                        </td>
                                    </tr>
                                ) : paginatedTickets.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="py-20 text-center text-gray-400 font-bold uppercase tracking-widest">
                                            No support tickets found
                                        </td>
                                    </tr>
                                ) : (
                                    paginatedTickets.map((t) => {
                                        const status = getStatusStyle(t.status);
                                        return (
                                            <tr key={t._id} className="group hover:bg-gray-50/50 transition-all">
                                                <td className="px-8 py-6">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 bg-cyan-50 text-cyan-600 rounded-full flex items-center justify-center shrink-0 font-bold">
                                                            {t.user?.username?.charAt(0).toUpperCase() || 'U'}
                                                        </div>
                                                        <div>
                                                            <h4 className="text-sm font-bold text-gray-900 capitalize leading-snug">{t.user?.username || 'User'}</h4>
                                                            <p className="text-xs text-gray-400 font-medium leading-none mt-1">{t.email || t.user?.email || 'N/A'}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <span className="text-[11px] font-black uppercase text-gray-400 tracking-widest">
                                                        {t.category}
                                                    </span>
                                                </td>
                                                <td className="px-8 py-6 font-semibold text-gray-900 text-sm max-w-[200px] truncate">
                                                    {t.subject}
                                                </td>
                                                <td className="px-8 py-6 font-bold text-gray-700 text-xs">
                                                    {new Date(t.createdAt).toLocaleDateString()}
                                                </td>
                                                <td className="px-8 py-6">
                                                    <span className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest border flex items-center gap-2 w-fit ${status.color}`}>
                                                        {status.icon} {status.label}
                                                    </span>
                                                </td>
                                                <td className="px-8 py-6 text-center">
                                                    <button
                                                        onClick={() => handleViewClick(t)}
                                                        className="p-3 bg-white hover:bg-gray-900 text-gray-400 hover:text-white rounded-xl shadow-sm border border-gray-100 transition-all hover:scale-110 active:scale-95"
                                                        title="Read Ticket details"
                                                    >
                                                        <FiEye className="text-lg" />
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                <AdminPagination 
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                    totalItems={filteredTickets.length}
                    itemsPerPage={itemsPerPage}
                    itemName="tickets"
                />
            </div>

            {/* Ticket Details View Modal */}
            {isViewModalOpen && selectedTicket && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-[#001B1B]/40 backdrop-blur-md animate-in fade-in duration-300" onClick={() => !updatingStatus && setIsViewModalOpen(false)}></div>
                    <div className="bg-white w-full max-w-2xl rounded-[40px] shadow-2xl relative z-10 overflow-hidden animate-in zoom-in-95 duration-300">
                        {/* Modal Header */}
                        <div className="bg-[#001B1B] p-8 text-white">
                            <div className="flex justify-between items-start">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-xl text-cyan-400 shrink-0">
                                        <FiFileText />
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-black tracking-tight">{selectedTicket.category}</h3>
                                        <p className="text-cyan-400/80 text-[10px] font-bold uppercase tracking-[0.2em] mt-1">Ticket Details</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setIsViewModalOpen(false)}
                                    className="p-2 hover:bg-white/10 rounded-xl transition-all"
                                >
                                    <FiX className="text-xl" />
                                </button>
                            </div>
                        </div>

                        {/* Modal Body */}
                        <div className="p-8 space-y-6">
                            {/* User Header Details */}
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-5 p-5 bg-gray-50 rounded-3xl border border-gray-100">
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Submitted By</span>
                                    <span className="text-sm font-bold text-gray-900 mt-1 capitalize">{selectedTicket.user?.username || 'User'}</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Email</span>
                                    <span className="text-sm font-bold text-gray-900 mt-1">{selectedTicket.email || selectedTicket.user?.email || 'N/A'}</span>
                                </div>
                                <div className="flex flex-col col-span-2 md:col-span-1">
                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Date / Time</span>
                                    <span className="text-sm font-bold text-gray-900 mt-1">
                                        {new Date(selectedTicket.createdAt).toLocaleString()}
                                    </span>
                                </div>
                            </div>

                            {/* Subject and Message Detail */}
                            <div className="space-y-4">
                                <div>
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Subject</label>
                                    <h4 className="text-base font-extrabold text-gray-900 mt-1 px-1">{selectedTicket.subject}</h4>
                                </div>
                                <div>
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">User Message</label>
                                    <div className="w-full mt-2 p-5 bg-gray-50 border border-gray-200 rounded-[24px] text-sm text-gray-700 font-medium leading-relaxed max-h-[200px] overflow-y-auto custom-scrollbar">
                                        {selectedTicket.message}
                                    </div>
                                </div>
                            </div>

                            {/* Status Change Admin Panel */}
                            <div className="border-t border-gray-100 pt-6">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 block mb-3">Update Ticket Status</label>
                                <div className="flex flex-wrap gap-3">
                                    {['Open', 'In Progress', 'Resolved'].map((st) => {
                                        const isCurrent = selectedTicket.status === st;
                                        let btnClass = "";

                                        if (st === 'Open') btnClass = isCurrent ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20" : "bg-blue-50 text-blue-600 hover:bg-blue-100";
                                        if (st === 'In Progress') btnClass = isCurrent ? "bg-amber-500 text-white shadow-lg shadow-amber-500/20" : "bg-amber-50 text-amber-600 hover:bg-amber-100";
                                        if (st === 'Resolved') btnClass = isCurrent ? "bg-teal-600 text-white shadow-lg shadow-teal-500/20" : "bg-teal-50 text-teal-600 hover:bg-teal-100";

                                        return (
                                            <button
                                                key={st}
                                                type="button"
                                                disabled={updatingStatus}
                                                onClick={() => handleStatusChange(st)}
                                                className={`px-5 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all active:scale-95 ${btnClass} disabled:opacity-50`}
                                            >
                                                {st}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Footer actions */}
                            <div className="flex justify-end items-center gap-4 pt-4">
                                <a
                                    href={`mailto:${selectedTicket.email || selectedTicket.user?.email}?subject=Re: [Shinvo Support] ${selectedTicket.subject}`}
                                    className="px-6 py-3 bg-gradient-to-r from-teal-500 to-[#53C1CC] text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:opacity-90 active:scale-95 transition-all flex items-center gap-2 shadow-lg shadow-teal-500/10"
                                >
                                    <FiMail className="text-sm" /> Reply via Email
                                </a>
                                <button
                                    type="button"
                                    onClick={() => setIsViewModalOpen(false)}
                                    className="px-6 py-3 bg-[#001B1B] text-white rounded-2xl text-xs font-black uppercase tracking-widest transition-all active:scale-95"
                                >
                                    Close Details
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const SupportStatCard = ({ label, value, icon, color, desc, pulse }) => (
    <div className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-50 flex flex-col gap-6 group hover:shadow-xl hover:shadow-cyan-400/5 transition-all">
        <div className="flex items-center justify-between">
            <div className={`w-14 h-14 rounded-2xl ${color} text-white flex items-center justify-center text-2xl shadow-xl transition-transform group-hover:scale-110`}>
                {icon}
            </div>
            {pulse && <div className="px-3 py-1 bg-blue-600 text-white text-[9px] font-black uppercase tracking-widest rounded-full animate-pulse">New Queries</div>}
        </div>
        <div>
            <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-1">{label}</p>
            <h4 className="text-3xl font-black text-gray-900 tracking-tight">{value}</h4>
            <p className="text-[10px] text-gray-400 mt-2 font-medium">{desc}</p>
        </div>
    </div>
);

export default AdminSupport;
