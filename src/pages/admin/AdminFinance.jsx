import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
    FiSearch, FiEye, FiDollarSign, FiCheckCircle, FiRefreshCw
} from 'react-icons/fi';
import { getAllOrders, processRefund } from '../../api/orders';
import toast from 'react-hot-toast';
import AdminPagination from '../../components/admin/AdminPagination';

const ORDERS_PER_PAGE = 10;

const AdminFinance = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        fetchOrders(true);
        const interval = setInterval(() => fetchOrders(false), 30000);
        return () => clearInterval(interval);
    }, []);

    const fetchOrders = async (showLoading = true) => {
        try {
            if (showLoading) setLoading(true);
            const data = await getAllOrders();
            // Only keep orders that have a refund request or completed refund
            const refundOrders = data.filter(order => order.refundStatus && order.refundStatus !== 'none');
            setOrders(refundOrders);
        } catch (error) {
            console.error('Failed to fetch finance orders:', error);
            if (showLoading) toast.error('Failed to fetch finance data');
        } finally {
            if (showLoading) setLoading(false);
        }
    };

    const filteredOrders = useMemo(() => {
        return orders.filter(order => {
            return order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                order.shippingAddress.fullName.toLowerCase().includes(searchTerm.toLowerCase());
        });
    }, [orders, searchTerm]);

    /* ── pagination ── */
    const totalPages = Math.max(1, Math.ceil(filteredOrders.length / ORDERS_PER_PAGE));
    const paginatedOrders = filteredOrders.slice(
        (currentPage - 1) * ORDERS_PER_PAGE,
        currentPage * ORDERS_PER_PAGE
    );

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);

    const goToPage = (p) => {
        if (p >= 1 && p <= totalPages) setCurrentPage(p);
    };

    const stats = {
        totalRequests: orders.length,
        totalValue: orders.reduce((sum, order) => sum + order.totalAmount, 0),
        processed: orders.filter(o => o.refundStatus === 'completed').length,
    };

    const handleProcessRefund = async (orderId) => {
        try {
            await processRefund(orderId);
            toast.success(`Refund processed for order #${orderId.slice(-6)}`);
            fetchOrders(false); // Refresh silently
        } catch (error) {
            console.error('Failed to process refund:', error);
            toast.error(error.response?.data?.message || 'Failed to process refund');
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
        <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-500 px-2 sm:px-0">
            {/* Header */}
            <div className="flex justify-between items-center gap-2 sm:gap-6 bg-white p-4 sm:p-8 rounded-[32px] shadow-sm border border-gray-50">
                <div className="flex items-center gap-3 sm:gap-4">
                    <div>
                        <h2 className="text-base sm:text-3xl font-black tracking-tight text-gray-900">Finance & Refunds</h2>
                        <p className="hidden sm:flex text-gray-400 text-sm font-medium mt-1 uppercase tracking-widest items-center gap-2">
                            Manage refunded orders and payouts
                        </p>
                    </div>
                </div>
                <div className="relative group z-10 shrink-0">
                    <FiSearch className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 z-10 text-gray-400 group-focus-within:text-cyan-500 transition-colors pointer-events-none" />
                    <input
                        type="text"
                        placeholder="Search Order ID or Customer..."
                        className="w-10 h-10 sm:h-auto sm:w-96 pl-10 sm:pl-12 pr-4 sm:py-4 bg-gray-50 border-transparent focus:bg-white focus:border-cyan-200 rounded-full sm:rounded-[20px] text-sm font-medium transition-all duration-300 outline-none focus:w-48 sm:focus:w-96 focus:shadow-xl sm:focus:shadow-none placeholder:opacity-0 focus:placeholder:opacity-100 sm:placeholder:opacity-100 cursor-pointer focus:cursor-text shadow-sm sm:shadow-none"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-3 gap-3 md:gap-4">
                <StatCard label="Total Refund Requests" value={stats.totalRequests} icon={<FiRefreshCw />} color="bg-orange-500" />
                <StatCard label="Total Refund Value" value={`Rs. ${stats.totalValue.toLocaleString()}`} icon={<FiDollarSign />} color="bg-gray-900" />
                <StatCard label="Processed Refunds" value={stats.processed} icon={<FiCheckCircle />} color="bg-teal-500" />
            </div>

            {/* Filters & Table */}
            <div className="bg-white rounded-3xl sm:rounded-[32px] p-4 sm:p-8 shadow-sm border border-gray-50 min-h-[500px] lg:h-[850px] flex flex-col">
                <div className="overflow-auto flex-1 custom-scrollbar">
                    <table className="w-full min-w-[1000px]">
                        <thead>
                            <tr className="border-b border-gray-50 text-[11px] text-gray-400 uppercase tracking-[0.2em] font-bold">
                                <th className="pb-6 text-left">Order ID</th>
                                <th className="pb-6 text-left">Customer</th>
                                <th className="pb-6 text-left">Cancel Date</th>
                                <th className="pb-6 text-left">Refund Amount</th>
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
                                                    {new Date(order.updatedAt || order.createdAt).toLocaleDateString()}
                                                </span>
                                                <span className="text-[10px] text-gray-400 font-medium">
                                                    {new Date(order.updatedAt || order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="py-6">
                                            <span className="text-sm font-bold text-gray-900">
                                                Rs. {order.totalAmount.toLocaleString()}
                                            </span>
                                        </td>
                                        <td className="py-6">
                                            {order.refundStatus === 'completed' ? (
                                                <span className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider text-teal-500 bg-teal-50`}>
                                                    Refunded
                                                </span>
                                            ) : (
                                                <span className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider text-orange-500 bg-orange-50`}>
                                                    Pending Refund
                                                </span>
                                            )}
                                        </td>
                                        <td className="py-6 text-right pr-4">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link
                                                    to={`/admin/orders/${order._id}`}
                                                    className="inline-flex items-center justify-center w-10 h-10 bg-gray-50 text-gray-500 rounded-full hover:bg-gray-100 hover:text-cyan-600 transition-colors"
                                                    title="View Order"
                                                >
                                                    <FiEye size={16} />
                                                </Link>
                                                {order.refundStatus !== 'completed' && (
                                                    <button
                                                        onClick={() => handleProcessRefund(order._id)}
                                                        className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white text-[10px] font-black uppercase tracking-widest rounded-full hover:from-indigo-600 hover:to-indigo-700 transition-all shadow-lg shadow-indigo-500/30 active:scale-95"
                                                    >
                                                        Process Refund
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="py-20 text-center">
                                        <div className="flex flex-col items-center gap-4">
                                            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-300">
                                                <FiDollarSign size={32} />
                                            </div>
                                            <p className="text-gray-400 font-medium">No pending refund requests found</p>
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
                    itemName="refund requests"
                />
            </div>
        </div>
    );
};

const StatCard = ({ label, value, icon, color }) => (
    <div 
        tabIndex="0"
        className="bg-white rounded-2xl sm:rounded-3xl p-3 sm:p-4 lg:p-6 shadow-sm border border-gray-50 flex flex-col items-center sm:items-start group hover:shadow-xl hover:shadow-cyan-400/5 transition-all relative cursor-pointer outline-none focus:bg-gray-50 active:bg-gray-50"
    >
        <div className="flex flex-col sm:flex-row items-center justify-between w-full gap-2 sm:gap-0">
            <div className={`w-10 h-10 lg:w-12 lg:h-12 mx-auto sm:mx-0 rounded-xl sm:rounded-2xl ${color} text-white flex items-center justify-center text-lg lg:text-xl shadow-lg shadow-${color.split('-')[1]}-400/20 shrink-0 transition-transform group-hover:scale-110 group-focus:scale-110`}>
                {icon}
            </div>
        </div>
        <div className="text-center sm:text-left mt-1 sm:mt-4 w-full">
            <p className="hidden sm:block text-[9px] lg:text-[10px] text-gray-400 uppercase tracking-tight lg:tracking-widest font-bold mb-0.5 leading-tight">{label}</p>
            <h4 className="text-[11px] sm:text-base lg:text-xl font-bold text-gray-900 pointer-events-none truncate">{value}</h4>
        </div>

        {/* Tooltip on Mobile (Shows on Hover/Focus/Active) */}
        <div className="sm:hidden absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] font-bold tracking-wider uppercase px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 group-focus:opacity-100 group-active:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-[100] shadow-xl">
            {label}
            <div className="absolute top-full left-1/2 -translate-x-1/2 border-[5px] border-transparent border-t-gray-900"></div>
        </div>
    </div>
);

export default AdminFinance;
