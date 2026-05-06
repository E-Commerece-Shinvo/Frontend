import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSearch, FiFilter, FiMoreVertical, FiEye, FiUserX, FiMail, FiPhone, FiMapPin, FiCalendar, FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const USERS_PER_PAGE = 10;

const AdminCustomers = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    // Mock data for customers
    const customers = [
        {
            id: 1,
            name: 'Muzamil Hussain',
            email: 'muzamil@example.com',
            phone: '+92 300 1234567',
            status: 'Active',
            joinedDate: '2024-01-15',
            orders: 12,
            spent: 'Rs. 45,000',
            avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=100'
        },
        {
            id: 2,
            name: 'Sarah Khan',
            email: 'sarah@example.com',
            phone: '+92 321 9876543',
            status: 'Inactive',
            joinedDate: '2023-11-20',
            orders: 5,
            spent: 'Rs. 18,500',
            avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100'
        },
        {
            id: 3,
            name: 'Ali Ahmed',
            email: 'ali@example.com',
            phone: '+92 333 4567890',
            status: 'Active',
            joinedDate: '2024-02-01',
            orders: 2,
            spent: 'Rs. 7,200',
            avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100'
        },
        {
            id: 4,
            name: 'Zainab Bibi',
            email: 'zainab@example.com',
            phone: '+92 345 6789012',
            status: 'Blocked',
            joinedDate: '2023-09-10',
            orders: 25,
            spent: 'Rs. 120,000',
            avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=100'
        },
        {
            id: 5,
            name: 'Usman Raza',
            email: 'usman@example.com',
            phone: '+92 312 3456789',
            status: 'Active',
            joinedDate: '2024-03-12',
            orders: 8,
            spent: 'Rs. 32,400',
            avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=100'
        },
        // Adding more mock data to test pagination
        ...Array.from({ length: 15 }, (_, i) => ({
            id: i + 6,
            name: `User ${i + 6}`,
            email: `user${i + 6}@example.com`,
            phone: `+92 300 ${1000000 + i}`,
            status: i % 3 === 0 ? 'Active' : 'Inactive',
            joinedDate: '2024-02-15',
            orders: i + 2,
            spent: `Rs. ${1000 * (i + 1)}`,
            avatar: `https://ui-avatars.com/api/?name=User+${i + 6}&background=random`
        }))
    ];

    const filteredCustomers = useMemo(() => {
        return customers.filter(customer =>
            customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            customer.email.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [searchTerm, customers]);

    /* ── pagination ── */
    const totalPages = Math.max(1, Math.ceil(filteredCustomers.length / USERS_PER_PAGE));
    const paginatedCustomers = filteredCustomers.slice(
        (currentPage - 1) * USERS_PER_PAGE,
        currentPage * USERS_PER_PAGE
    );

    // reset page when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);

    const goToPage = (p) => {
        if (p >= 1 && p <= totalPages) setCurrentPage(p);
    };

    /* helper — page buttons (show max 5) */
    const pageNumbers = useMemo(() => {
        const pages = [];
        let start = Math.max(1, currentPage - 2);
        let end = Math.min(totalPages, start + 4);
        if (end - start < 4) start = Math.max(1, end - 4);
        for (let i = start; i <= end; i++) pages.push(i);
        return pages;
    }, [currentPage, totalPages]);

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Customers</h1>
                    <p className="text-gray-500 mt-1">Manage and view all your registered customers</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 bg-white border border-gray-200 px-4 py-2.5 rounded-xl text-sm font-bold text-gray-700 hover:bg-gray-50 transition-all shadow-sm">
                        <FiFilter />
                        Filters
                    </button>
                    <button className="bg-black text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-gray-800 transition-all shadow-lg shadow-black/10">
                        Export List
                    </button>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: 'Total Customers', value: '1,284', change: '+12%', icon: <FiSearch />, color: 'bg-blue-500' },
                    { label: 'Active Now', value: '342', change: '+5%', icon: <FiSearch />, color: 'bg-green-500' },
                    { label: 'New This Month', value: '89', change: '+18%', icon: <FiSearch />, color: 'bg-purple-500' },
                    { label: 'Returning', value: '76%', change: '+2%', icon: <FiSearch />, color: 'bg-amber-500' },
                ].map((stat, i) => (
                    <div key={i} className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-2xl ${stat.color} bg-opacity-10 flex items-center justify-center text-xl`} style={{ color: stat.color.replace('bg-', '') }}>
                            {/* Just using placeholders for now as icons are not dynamic in this loop */}
                            <FiSearch />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{stat.label}</p>
                            <div className="flex items-baseline gap-2">
                                <h3 className="text-xl font-bold text-gray-900">{stat.value}</h3>
                                <span className="text-[10px] font-bold text-green-500">{stat.change}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Main Content - Table */}
            <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden">
                {/* Table Header / Toolbar */}
                <div className="p-6 border-b border-gray-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="relative flex-1 max-w-md">
                        <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search customers by name or email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:border-cyan-500 focus:bg-white transition-all text-sm"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500 mr-2 font-medium">Show:</span>
                        <select className="bg-gray-50 border border-gray-100 rounded-xl px-3 py-2 text-sm font-bold focus:outline-none focus:border-cyan-500">
                            <option>Last 30 Days</option>
                            <option>Last 6 Months</option>
                            <option>Year to Date</option>
                        </select>
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/50">
                                <th className="px-8 py-4 text-xs font-black text-gray-400 uppercase tracking-widest border-b border-gray-100">Customer</th>
                                <th className="px-8 py-4 text-xs font-black text-gray-400 uppercase tracking-widest border-b border-gray-100">Status</th>
                                <th className="px-8 py-4 text-xs font-black text-gray-400 uppercase tracking-widest border-b border-gray-100">Orders</th>
                                <th className="px-8 py-4 text-xs font-black text-gray-400 uppercase tracking-widest border-b border-gray-100">Total Spent</th>
                                <th className="px-8 py-4 text-xs font-black text-gray-400 uppercase tracking-widest border-b border-gray-100">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {paginatedCustomers.map((customer) => (
                                <tr key={customer.id} className="hover:bg-gray-50/50 transition-colors group">
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-2xl overflow-hidden shadow-sm border border-gray-100">
                                                <img src={customer.avatar} alt={customer.name} className="w-full h-full object-cover" />
                                            </div>
                                            <div>
                                                <p className="font-bold text-gray-900 group-hover:text-cyan-600 transition-colors">{customer.name}</p>
                                                <p className="text-xs text-gray-400 font-medium">{customer.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5">
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${customer.status === 'Active' ? 'bg-green-50 text-green-600 border border-green-100' :
                                            customer.status === 'Inactive' ? 'bg-amber-50 text-amber-600 border border-amber-100' :
                                                'bg-red-50 text-red-600 border border-red-100'
                                            }`}>
                                            {customer.status}
                                        </span>
                                    </td>
                                    <td className="px-8 py-5">
                                        <p className="text-sm font-bold text-gray-700">{customer.orders} Orders</p>
                                        <p className="text-[10px] text-gray-400 font-medium uppercase tracking-tighter">Last: {customer.joinedDate}</p>
                                    </td>
                                    <td className="px-8 py-5">
                                        <p className="text-sm font-black text-gray-900">{customer.spent}</p>
                                    </td>
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-2">
                                            <button 
                                                onClick={() => navigate(`/admin/customers/${customer.id}`)}
                                                className="bg-gradient-to-r from-[#001B1B] to-[#006060] text-white px-8 py-3 rounded-full text-xs font-black uppercase tracking-widest hover:from-[#002B2B] hover:to-[#008080] transition-all shadow-xl shadow-black/20 border border-white/5 hover:border-cyan-500/30 hover:scale-105 active:scale-95"
                                            >
                                                View Profile
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="p-6 border-t border-gray-50 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-sm text-gray-500 font-medium">
                        Showing <span className="font-bold text-gray-900">{(currentPage - 1) * USERS_PER_PAGE + 1}</span> to <span className="font-bold text-gray-900">{Math.min(currentPage * USERS_PER_PAGE, filteredCustomers.length)}</span> of <span className="font-bold text-gray-900">{filteredCustomers.length}</span> results
                    </p>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => goToPage(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="flex items-center gap-2 px-4 py-2 text-[13px] font-bold text-gray-500 bg-white border border-gray-200 rounded-xl hover:border-cyan-500 hover:text-cyan-600 disabled:opacity-50 disabled:hover:text-gray-500 disabled:hover:border-gray-200 transition-all shadow-sm"
                        >
                            <FiChevronLeft size={16} /> Previous
                        </button>

                        <div className="flex items-center gap-1.5">
                            {pageNumbers.map((num) => (
                                <button
                                    key={num}
                                    onClick={() => goToPage(num)}
                                    className={`
                                        w-9 h-9 flex items-center justify-center text-[13px] font-bold rounded-xl transition-all
                                        ${num === currentPage
                                            ? 'bg-gradient-to-r from-[#001B1B] to-[#006060] text-white shadow-lg shadow-black/20'
                                            : 'bg-white text-gray-500 border border-gray-200 hover:border-[#006060] hover:text-[#006060] shadow-sm'}
                                    `}
                                >
                                    {num}
                                </button>
                            ))}
                        </div>

                        <button
                            onClick={() => goToPage(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="flex items-center gap-2 px-4 py-2 text-[13px] font-bold text-gray-500 bg-white border border-gray-200 rounded-xl hover:border-cyan-500 hover:text-cyan-600 disabled:opacity-50 disabled:hover:text-gray-500 disabled:hover:border-gray-200 transition-all shadow-sm"
                        >
                            Next <FiChevronRight size={16} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminCustomers;
