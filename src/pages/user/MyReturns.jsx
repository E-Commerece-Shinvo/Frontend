import React, { useEffect, useState, useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import { getMyOrders } from '../../api/orders';
import Navbar from '../../components/layout/Navbar/Navbar';
import Footer from '../../components/layout/Footer/Footer';
import { useAuth } from '../../context/AuthContext';
import {
    FiPackage, FiClock, FiTruck, FiCheckCircle, FiXCircle,
    FiShoppingBag, FiUser, FiSearch, FiChevronLeft, FiChevronRight,
    FiRotateCcw, FiMoreVertical, FiHelpCircle
} from 'react-icons/fi';

/* ───────── status config ───────── */
const statusConfig = {
    returned: { label: 'Returned', color: '#ef4444', bg: '#fee2e2' },
    'return-pending': { label: 'Return Pending', color: '#f59e0b', bg: '#fef3c7' },
};

const RETURN_TABS = ['All Returns', 'Processing', 'Completed'];
const ORDERS_PER_PAGE = 10;

/* ───────── component ───────── */
function MyReturns() {
    const { user } = useAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('All Returns');
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
    const menuRef = useRef(null);

    // Close dropdown on click outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsAccountMenuOpen(false);
            }
        };
        if (isAccountMenuOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isAccountMenuOpen]);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const data = await getMyOrders();
                // Filter only returned or return-pending orders
                const returnOrders = data.filter(o =>
                    o.status?.toLowerCase().includes('return')
                );
                setOrders(returnOrders);
            } catch (err) {
                console.error('Failed to fetch return orders:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    /* ── filtering ── */
    const filteredOrders = useMemo(() => {
        let result = orders;

        // status filter
        if (activeTab !== 'All Returns') {
            if (activeTab === 'Processing') {
                result = result.filter(o => o.status?.toLowerCase() === 'return-pending');
            } else if (activeTab === 'Completed') {
                result = result.filter(o => o.status?.toLowerCase() === 'returned');
            }
        }

        // search filter
        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            result = result.filter((o) => {
                const idMatch = o._id?.toLowerCase().includes(q);
                const itemMatch = o.items?.some((item) =>
                    item.name?.toLowerCase().includes(q)
                );
                return idMatch || itemMatch;
            });
        }

        return result;
    }, [orders, activeTab, searchQuery]);

    /* ── pagination ── */
    const totalPages = Math.max(1, Math.ceil(filteredOrders.length / ORDERS_PER_PAGE));
    const paginatedOrders = filteredOrders.slice(
        (currentPage - 1) * ORDERS_PER_PAGE,
        currentPage * ORDERS_PER_PAGE
    );

    // reset page when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [activeTab, searchQuery]);

    const goToPage = (p) => {
        if (p >= 1 && p <= totalPages) setCurrentPage(p);
    };

    const pageNumbers = useMemo(() => {
        const pages = [];
        let start = Math.max(1, currentPage - 2);
        let end = Math.min(totalPages, start + 4);
        if (end - start < 4) start = Math.max(1, end - 4);
        for (let i = start; i <= end; i++) pages.push(i);
        return pages;
    }, [currentPage, totalPages]);

    const formatDate = (dateStr) =>
        new Date(dateStr).toLocaleDateString('en-US', {
            year: 'numeric', month: 'short', day: 'numeric',
        });

    return (
        <div className="min-h-screen flex flex-col bg-[#f5f5f5]">
            <Navbar />

            {/* spacer for fixed navbar */}
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
                        <h4 className="px-3 text-[11px] font-bold text-[#53C1CC] uppercase tracking-widest mb-2">Shopping Activity</h4>
                        <Link to="/my-orders" className="flex items-center gap-3 px-3 py-2.5 text-[14px] text-gray-600 font-medium rounded-xl hover:bg-gray-50 transition-all group">
                            <FiShoppingBag className="text-gray-400 group-hover:text-[#53C1CC]" size={18} />
                            My Orders
                        </Link>
                        <Link to="/my-returns" className="flex items-center gap-3 px-3 py-2.5 text-[14px] text-[#53C1CC] font-bold rounded-xl bg-[#53C1CC]/5 transition-all">
                            <FiRotateCcw size={18} />
                            My Returns
                        </Link>
                        <Link to="/my-orders?tab=cancelled" className="flex items-center gap-3 px-3 py-2.5 text-[14px] text-gray-600 font-medium rounded-xl hover:bg-gray-50 transition-all group">
                            <FiClock className="text-gray-400 group-hover:text-amber-400" size={18} />
                            Cancellations
                        </Link>
                    </div>

                    <div className="px-3 pt-6 flex flex-col gap-1">
                        <h4 className="px-3 text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2">Help & Support</h4>
                        <Link to="/support" className="flex items-center gap-3 px-3 py-2.5 text-[14px] text-gray-600 font-medium rounded-xl hover:bg-gray-50 transition-all group">
                            <FiHelpCircle className="text-gray-400 group-hover:text-[#53C1CC]" size={18} />
                            Customer Support
                        </Link>
                    </div>
                </aside>


                {/* ───── RIGHT CONTENT ───── */}
                <main className="flex-1 min-w-0 w-full">
                    {/* title */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 hidden md:flex">
                        <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">My Returns</h1>

                        {/* search */}
                        <div className="relative w-full md:w-[320px]">
                            <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="text"
                                placeholder="Search return orders..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-11 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-[14px] text-gray-800 outline-none focus:border-[#53C1CC] focus:ring-4 focus:ring-[#53C1CC]/10 transition-all placeholder:text-gray-400 shadow-sm"
                            />
                        </div>
                    </div>

                    {/* tabs */}
                    <div className="flex gap-2 border-b border-gray-200 mb-6 overflow-x-auto no-scrollbar pb-px">
                        {RETURN_TABS.map((tab) => {
                            const isActive = activeTab === tab;
                            return (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`
                                        px-5 py-3 text-[14px] font-bold whitespace-nowrap transition-all border-b-2 -mb-px flex items-center gap-2
                                        ${isActive
                                            ? 'text-[#53C1CC] border-[#53C1CC]'
                                            : 'text-gray-400 border-transparent hover:text-gray-600'}
                                    `}
                                >
                                    {tab}
                                </button>
                            );
                        })}
                    </div>

                    {/* ── loading ── */}
                    {loading && (
                        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
                            <div className="w-10 h-10 border-4 border-gray-100 border-t-[#53C1CC] rounded-full animate-spin mb-4" />
                            <p className="text-gray-500 font-medium">Fetching return history...</p>
                        </div>
                    )}

                    {/* ── empty ── */}
                    {!loading && filteredOrders.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm px-6 text-center">
                            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                                <FiRotateCcw size={40} className="text-gray-300" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 mb-2">No return orders</h3>
                            <p className="text-gray-500 text-[14px] max-w-[280px] mb-8">
                                You don't have any return requests in this category.
                            </p>
                            <Link to="/my-orders" className="px-8 py-3 bg-[#53C1CC] text-white rounded-xl font-bold text-[14px] hover:bg-[#43aab5] transition-all shadow-lg shadow-[#53C1CC]/20">
                                View Recent Orders
                            </Link>
                        </div>
                    )}

                    {/* ── orders list ── */}
                    {!loading && paginatedOrders.length > 0 && (
                        <div className="flex flex-col gap-4">
                            {paginatedOrders.map((order) => {
                                const info = statusConfig[order.status?.toLowerCase()] || statusConfig.returned;

                                return (
                                    <div key={order._id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-all">
                                        {/* header */}
                                        <div className="flex flex-wrap items-center justify-between px-5 md:px-6 py-4 bg-gray-50/50 border-b border-gray-100 gap-3">
                                            <div className="flex flex-col">
                                                <span className="text-[13px] font-bold text-gray-900 uppercase tracking-tight">
                                                    Order #{order._id.slice(-8).toUpperCase()}
                                                </span>
                                                <span className="text-[11px] font-medium text-gray-400 mt-0.5">
                                                    Returned on {formatDate(order.updatedAt || order.createdAt)}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <span className="px-4 py-1.5 rounded-full text-[12px] font-bold flex items-center gap-1.5" style={{
                                                    color: info.color,
                                                    background: info.bg,
                                                }}>
                                                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: info.color }} />
                                                    {info.label}
                                                </span>
                                            </div>
                                        </div>

                                        {/* items */}
                                        <div className="divide-y divide-gray-50">
                                            {order.items.map((item, idx) => (
                                                <div key={idx} className="flex flex-col sm:flex-row items-start sm:items-center p-5 md:p-6 gap-4 md:gap-6">
                                                    <div className="w-[80px] h-[80px] rounded-xl bg-gray-50 overflow-hidden flex-shrink-0 flex items-center justify-center border border-gray-100 p-1">
                                                        {item.image ? (
                                                            <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                                                        ) : (
                                                            <FiPackage size={30} className="text-gray-200" />
                                                        )}
                                                    </div>

                                                    <div className="flex-1 min-w-0 w-full">
                                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                                            <div className="flex-1">
                                                                <p className="text-[15px] font-bold text-gray-900 leading-tight mb-1 truncate">
                                                                    {item.name}
                                                                </p>
                                                                <p className="text-[12px] font-medium text-gray-400">
                                                                    Reason: Changed mind
                                                                </p>
                                                            </div>
                                                            <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-1 sm:gap-0">
                                                                <p className="text-[15px] font-extrabold text-gray-900">
                                                                    Rs. {item.price?.toLocaleString()}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {/* ── PAGINATION ── */}
                    {!loading && filteredOrders.length > 0 && (
                        <div className="flex flex-wrap justify-end items-center gap-2 mt-10">
                            <button
                                onClick={() => goToPage(currentPage - 1)}
                                disabled={currentPage === 1}
                                className="flex items-center gap-2 px-4 py-2.5 text-[14px] font-bold text-gray-500 bg-white border border-gray-200 rounded-xl hover:border-[#53C1CC] hover:text-[#53C1CC] disabled:opacity-50 transition-all"
                            >
                                <FiChevronLeft size={18} /> <span className="hidden sm:inline">Previous</span>
                            </button>

                            <div className="flex items-center gap-1.5">
                                {pageNumbers.map((num) => (
                                    <button
                                        key={num}
                                        onClick={() => goToPage(num)}
                                        className={`
                                            w-10 h-10 flex items-center justify-center text-[14px] font-bold rounded-xl transition-all
                                            ${num === currentPage
                                                ? 'bg-[#53C1CC] text-white shadow-lg shadow-[#53C1CC]/20'
                                                : 'bg-white text-gray-500 border border-gray-200 hover:border-[#53C1CC] hover:text-[#53C1CC]'}
                                        `}
                                    >
                                        {num}
                                    </button>
                                ))}
                            </div>

                            <button
                                onClick={() => goToPage(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className="flex items-center gap-2 px-4 py-2.5 text-[14px] font-bold text-gray-500 bg-white border border-gray-200 rounded-xl hover:border-[#53C1CC] hover:text-[#53C1CC] disabled:opacity-50 transition-all"
                            >
                                <span className="hidden sm:inline">Next</span> <FiChevronRight size={18} />
                            </button>
                        </div>
                    )}
                </main>
            </div>

            <Footer />
        </div>
    );
}

export default MyReturns;
