import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { 
    FiSearch, FiFilter, FiMoreVertical, FiEye, FiUserX, 
    FiMail, FiPhone, FiMapPin, FiCalendar, FiChevronLeft, 
    FiChevronRight, FiX, FiSlash, FiCheckCircle, FiAlertTriangle,
    FiRefreshCw, FiInfo, FiExternalLink
} from 'react-icons/fi';
import AdminPagination from '../../components/admin/AdminPagination';
import { getAllUsers, toggleUserBlock } from '../../api/users';

const USERS_PER_PAGE = 5;

const AdminCustomers = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    useEffect(() => {
        fetchCustomers();
    }, []);

    const fetchCustomers = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await getAllUsers();
            
            if (data && Array.isArray(data)) {
                const onlyCustomers = data.filter(user => user.role !== 'admin');
                setCustomers(onlyCustomers.map(user => ({
                    id: user._id,
                    name: user.username || 'Unknown',
                    email: user.email || 'No Email',
                    phone: user.phone || 'N/A',
                    status: user.isBlocked ? 'Blocked' : 'Active',
                    isBlocked: !!user.isBlocked,
                    joinedDate: user.createdAt ? new Date(user.createdAt).toISOString().split('T')[0] : 'N/A',
                    orders: user.orders?.length || 0,
                    spent: `Rs. ${user.totalSpent || 0}`,
                    avatar: `https://ui-avatars.com/api/?name=${user.username || 'User'}&background=random`
                })));
            } else {
                setCustomers([]);
                setError("Received invalid data format from server.");
            }
        } catch (err) {
            console.error('AdminCustomers: Fetch error:', err);
            const msg = err.response?.data?.message || err.message || 'Failed to connect to server';
            setError(msg);
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    const filteredCustomers = useMemo(() => {
        return customers.filter(customer =>
            customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            customer.email.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [searchTerm, customers]);

    const totalPages = Math.max(1, Math.ceil(filteredCustomers.length / USERS_PER_PAGE));
    const paginatedCustomers = filteredCustomers.slice((currentPage - 1) * USERS_PER_PAGE, currentPage * USERS_PER_PAGE);

    const goToPage = (p) => { if (p >= 1 && p <= totalPages) setCurrentPage(p); };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-400"></div>
                <p className="text-gray-500 font-bold animate-pulse">Loading Customers...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Error State */}
            {error && (
                <div className="bg-red-50 border border-red-100 p-6 rounded-[24px] flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center shrink-0">
                        <FiAlertTriangle size={24} />
                    </div>
                    <div className="flex-1">
                        <h4 className="font-black text-red-900 uppercase tracking-tight">Fetch Error</h4>
                        <p className="text-red-600 font-medium text-sm">{error}</p>
                    </div>
                    <button onClick={fetchCustomers} className="px-6 py-3 bg-red-600 text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-red-700 transition-all">
                        Retry
                    </button>
                </div>
            )}

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Customers</h1>
                    <p className="text-gray-500 mt-1">Manage and view all your registered customers ({customers.length})</p>
                </div>
                <div className="flex items-center gap-3">
                    <button onClick={fetchCustomers} className="flex items-center gap-2 bg-white border border-gray-200 px-5 py-3 rounded-2xl text-xs font-black text-gray-700 hover:bg-gray-50 transition-all shadow-sm uppercase tracking-widest">
                        <FiRefreshCw className={loading ? 'animate-spin' : ''} /> Refresh
                    </button>
                    <button className="bg-gradient-to-r from-[#001B1B] to-[#006060] text-white px-6 py-3 rounded-2xl text-xs font-black hover:from-[#002B2B] hover:to-[#008080] transition-all shadow-lg uppercase tracking-widest">
                        Export
                    </button>
                </div>
            </div>

            {/* Table Container */}
            <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden flex flex-col h-[750px]">
                <div className="p-8 border-b border-gray-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="relative max-w-md w-full">
                        <FiSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by name or email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-14 pr-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:border-cyan-500 transition-all font-medium text-sm"
                        />
                    </div>
                </div>

                <div className="overflow-auto flex-1 custom-scrollbar">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/50">
                                <th className="px-10 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100">Customer Details</th>
                                <th className="px-10 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100">Status</th>
                                <th className="px-10 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100">Orders</th>
                                <th className="px-10 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100">Total Spent</th>
                                <th className="px-10 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {paginatedCustomers.map((customer) => (
                                <tr key={customer.id} className="hover:bg-gray-50/50 transition-colors cursor-pointer group" onClick={() => navigate(`/admin/customers/${customer.id}`)}>
                                    <td className="px-10 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-2xl overflow-hidden shadow-sm border border-gray-100">
                                                <img src={customer.avatar} className="w-full h-full object-cover" />
                                            </div>
                                            <div>
                                                <p className="font-black text-gray-900 group-hover:text-cyan-600 transition-colors">{customer.name}</p>
                                                <p className="text-xs text-gray-400 font-bold">{customer.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-10 py-6">
                                        <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.1em] border ${customer.isBlocked ? 'bg-red-50 text-red-600 border-red-100' : 'bg-green-50 text-green-600 border-green-100'}`}>
                                            {customer.status}
                                        </span>
                                    </td>
                                    <td className="px-10 py-6 text-sm font-bold text-gray-700">{customer.orders} Orders</td>
                                    <td className="px-10 py-6 text-sm font-black text-gray-900">{customer.spent}</td>
                                    <td className="px-10 py-6">
                                        <button 
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                navigate(`/admin/customers/${customer.id}`);
                                            }}
                                            className="px-6 py-2.5 rounded-full bg-gradient-to-r from-[#001B1B] to-[#006060] text-white text-[11px] font-black uppercase tracking-[0.1em] hover:shadow-xl hover:shadow-cyan-900/30 transition-all border border-white/5 flex items-center justify-center gap-2 group/btn active:scale-95"
                                        >
                                            View Profile
                                            <FiExternalLink className="group-hover/btn:translate-x-0.5 transition-transform" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {paginatedCustomers.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="px-10 py-20 text-center">
                                        <div className="flex flex-col items-center gap-2 text-gray-400">
                                            <FiInfo size={40} className="mb-2 opacity-20" />
                                            <p className="font-black uppercase tracking-widest text-xs">No customers found</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <AdminPagination currentPage={currentPage} totalPages={totalPages} onPageChange={goToPage} totalItems={customers.length} itemsPerPage={USERS_PER_PAGE} itemName="customers" />
            </div>
        </div>
    );
};

export default AdminCustomers;
