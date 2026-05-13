import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
    FiShoppingCart, FiSearch, FiFilter, FiEye,
    FiClock, FiTruck, FiCheckCircle, FiXCircle,
    FiArrowUpRight, FiMoreVertical, FiCalendar,
    FiChevronLeft, FiChevronRight, FiChevronDown
} from 'react-icons/fi';
import { getAllOrders } from '../../api/orders';
import toast from 'react-hot-toast';
import AdminPagination from '../../components/admin/AdminPagination';

const ORDERS_PER_PAGE = 10;

const AdminOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const [showFilterDropdown, setShowFilterDropdown] = useState(false);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const data = await getAllOrders();
            setOrders(data);
        } catch (error) {
            toast.error('Failed to fetch orders');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const filteredOrders = useMemo(() => {
        return orders.filter(order => {
            const matchesSearch =
                order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                order.shippingAddress.fullName.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesFilter = filterStatus === 'all' || order.status === filterStatus;

            return matchesSearch && matchesFilter;
        });
    }, [orders, searchTerm, filterStatus]);

    /* ── pagination ── */
    const totalPages = Math.max(1, Math.ceil(filteredOrders.length / ORDERS_PER_PAGE));
    const paginatedOrders = filteredOrders.slice(
        (currentPage - 1) * ORDERS_PER_PAGE,
        currentPage * ORDERS_PER_PAGE
    );

    // reset page when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, filterStatus]);

    const goToPage = (p) => {
        if (p >= 1 && p <= totalPages) setCurrentPage(p);
    };



    const stats = {
        total: orders.length,
        pending: orders.filter(o => o.status === 'pending').length,
        processing: orders.filter(o => o.status === 'processing').length,
        shipped: orders.filter(o => o.status === 'shipped').length,
        delivered: orders.filter(o => o.status === 'delivered').length,
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending': return 'text-orange-500 bg-orange-50';
            case 'processing': return 'text-blue-500 bg-blue-50';
            case 'shipped': return 'text-purple-500 bg-purple-50';
            case 'delivered': return 'text-teal-500 bg-teal-50';
            case 'cancelled': return 'text-red-500 bg-red-50';
            default: return 'text-gray-500 bg-gray-50';
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="w-12 h-12 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="bg-white rounded-[32px] py-6 px-8 shadow-sm border border-gray-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900">Orders Management</h2>
                    <p className="text-gray-400 text-sm mt-1">Manage and track all customer orders</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search Order ID or Customer..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/20 w-full md:w-64 transition-all"
                        />
                        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    </div>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="hidden md:grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                <StatCard label="Total Orders" value={stats.total} icon={<FiShoppingCart />} color="bg-gray-900" />
                <StatCard label="Pending" value={stats.pending} icon={<FiClock />} color="bg-orange-500" />
                <StatCard label="Processing" value={stats.processing} icon={<FiRefreshCw className="animate-spin-slow" />} color="bg-blue-500" />
                <StatCard label="Shipped" value={stats.shipped} icon={<FiTruck />} color="bg-purple-500" />
                <StatCard label="Delivered" value={stats.delivered} icon={<FiCheckCircle />} color="bg-teal-500" />
            </div>

            {/* Mobile Only Stats Display */}
            <div className="md:hidden bg-white p-6 rounded-[32px] shadow-sm border border-gray-50">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-gray-900 text-white flex items-center justify-center text-xl shadow-lg shadow-gray-900/20">
                        <FiShoppingCart />
                    </div>
                    <div>
                        <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-0.5">Total Orders</p>
                        <h4 className="text-2xl font-bold text-gray-900">{stats.total}</h4>
                    </div>
                </div>
            </div>

            {/* Filters & Table */}
            <div className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-50 h-[850px] flex flex-col">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                    {/* Desktop Filters */}
                    <div className="hidden md:flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 custom-scrollbar">
                        {['all', 'pending', 'processing', 'shipped', 'delivered', 'cancelled'].map((status) => (
                            <button
                                key={status}
                                onClick={() => setFilterStatus(status)}
                                className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all whitespace-nowrap ${filterStatus === status
                                    ? 'bg-cyan-400 text-black shadow-lg shadow-cyan-400/20'
                                    : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
                                    }`}
                            >
                                {status}
                            </button>
                        ))}
                    </div>

                    {/* Mobile Filters Dropdown */}
                    <div className="md:hidden relative w-full">
                        <button
                            onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                            className="flex items-center justify-between w-full px-6 py-4 bg-gray-50 rounded-2xl border border-gray-100 text-sm font-bold text-gray-900"
                        >
                            <span className="flex items-center gap-2">
                                <FiFilter className="text-cyan-500" />
                                Filter: <span className="uppercase text-cyan-600">{filterStatus}</span>
                            </span>
                            <FiChevronDown className={`transition-transform duration-300 ${showFilterDropdown ? 'rotate-180' : ''}`} />
                        </button>

                        {showFilterDropdown && (
                            <div className="absolute right-0 left-0 mt-2 bg-white rounded-2xl shadow-2xl border border-gray-50 p-2 z-50 animate-in fade-in zoom-in-95 duration-200">
                                {['all', 'pending', 'processing', 'shipped', 'delivered', 'cancelled'].map((status) => (
                                    <button
                                        key={status}
                                        onClick={() => {
                                            setFilterStatus(status);
                                            setShowFilterDropdown(false);
                                        }}
                                        className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider mb-1 last:mb-0 transition-all ${filterStatus === status
                                            ? 'bg-cyan-50 text-cyan-600'
                                            : 'text-gray-500 hover:bg-gray-50'
                                            }`}
                                    >
                                        {status}
                                        {filterStatus === status && <FiCheckCircle size={14} />}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <div className="overflow-auto flex-1 custom-scrollbar">
                    <table className="w-full min-w-[1000px]">
                        <thead>
                            <tr className="border-b border-gray-50 text-[11px] text-gray-400 uppercase tracking-[0.2em] font-bold">
                                <th className="pb-6 text-left">Order ID</th>
                                <th className="pb-6 text-left">Customer</th>
                                <th className="pb-6 text-left">Date</th>
                                <th className="pb-6 text-left">Items</th>
                                <th className="pb-6 text-left">Total</th>
                                <th className="pb-6 text-left">Status</th>
                                <th className="pb-6 text-right pr-4">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {paginatedOrders.length > 0 ? (
                                paginatedOrders.map((order) => (
                                    <tr key={order._id} className="hover:bg-gray-50/50 transition-colors group">
                                        <td className="py-6">
                                            <span className="text-sm font-bold text-gray-400 group-hover:text-black transition-colors uppercase">
                                                #{order._id.slice(-6)}
                                            </span>
                                        </td>
                                        <td className="py-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-cyan-50 flex items-center justify-center text-cyan-600 text-[10px] font-bold">
                                                    {order.shippingAddress.fullName.split(' ').map(n => n[0]).join('')}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-bold text-gray-900 leading-none mb-1">
                                                        {order.shippingAddress.fullName}
                                                    </span>
                                                    <span className="text-[10px] text-gray-400 font-medium">
                                                        {order.user?.email || 'Guest'}
                                                    </span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-6">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-bold text-gray-900 leading-none mb-1">
                                                    {new Date(order.createdAt).toLocaleDateString()}
                                                </span>
                                                <span className="text-[10px] text-gray-400 font-medium">
                                                    {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="py-6">
                                            <span className="text-sm font-bold text-gray-600">
                                                {order.items.reduce((acc, item) => acc + item.quantity, 0)} Items
                                            </span>
                                        </td>
                                        <td className="py-6">
                                            <span className="text-sm font-bold text-gray-900">
                                                Rs. {order.totalAmount.toLocaleString()}
                                            </span>
                                        </td>
                                        <td className="py-6">
                                            <span className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider ${getStatusColor(order.status)}`}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="py-6 text-right pr-4">
                                            <Link
                                                to={`/admin/orders/${order._id}`}
                                                className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-[#001B1B] to-[#006060] text-white text-[10px] font-black uppercase tracking-widest rounded-full hover:from-[#002B2B] hover:to-[#008080] transition-all shadow-xl shadow-black/20 border border-white/5 hover:border-cyan-500/30 hover:scale-105 active:scale-95 group/btn"
                                            >
                                                View <FiEye className="group-hover/btn:scale-110 transition-transform" />
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7" className="py-20 text-center">
                                        <div className="flex flex-col items-center gap-4">
                                            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-300">
                                                <FiShoppingCart size={32} />
                                            </div>
                                            <p className="text-gray-400 font-medium">No orders found matching your criteria</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <AdminPagination 
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={goToPage}
                    totalItems={filteredOrders.length}
                    itemsPerPage={ORDERS_PER_PAGE}
                    itemName="orders"
                />
            </div>
        </div>
    );
};

const StatCard = ({ label, value, icon, color }) => (
    <div className="bg-white rounded-3xl p-4 lg:p-6 shadow-sm border border-gray-50 flex items-center gap-3 lg:gap-4 group hover:shadow-xl hover:shadow-cyan-400/5 transition-all">
        <div className={`w-10 h-10 lg:w-12 lg:h-12 rounded-2xl ${color} text-white flex items-center justify-center text-lg lg:text-xl shadow-lg shadow-${color.split('-')[1]}-400/20 shrink-0`}>
            {icon}
        </div>
        <div className="min-w-0">
            <p className="text-[9px] lg:text-[10px] text-gray-400 uppercase tracking-tight lg:tracking-widest font-bold mb-0.5 leading-tight">{label}</p>
            <h4 className="text-base lg:text-xl font-bold text-gray-900">{value}</h4>
        </div>
    </div>
);

const FiRefreshCw = ({ className }) => (
    <svg className={className} stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
        <polyline points="23 4 23 10 17 10"></polyline>
        <polyline points="1 20 1 14 7 14"></polyline>
        <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
    </svg>
);

export default AdminOrders;
