import React, { useState, useEffect, useMemo } from 'react';
import {
    FiTruck, FiPackage, FiCheckCircle, FiMapPin,
    FiSearch, FiFilter, FiExternalLink, FiClock,
    FiChevronLeft, FiChevronRight, FiMoreVertical,
    FiEdit, FiAlertCircle
} from 'react-icons/fi';
import { getAllOrders, updateOrderStatus } from '../../api/orders';
import toast from 'react-hot-toast';
import AdminPagination from '../../components/admin/AdminPagination';

const AdminShipping = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all'); // all, processing, shipped, delivered
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 4;

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const data = await getAllOrders();
            // We only care about orders that are being handled for shipping
            const shippingOrders = data.filter(o => ['processing', 'shipped', 'delivered'].includes(o.status));
            setOrders(shippingOrders || []);
        } catch (error) {
            console.error("Failed to fetch shipping orders:", error);
            toast.error("Failed to load logistics data");
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (id, newStatus) => {
        try {
            await updateOrderStatus(id, newStatus);
            toast.success(`Order marked as ${newStatus}`);
            fetchOrders();
        } catch (error) {
            toast.error("Failed to update shipping status");
        }
    };

    // Stats calculation
    const stats = useMemo(() => {
        const pending = orders.filter(o => o.status === 'processing').length;
        const inTransit = orders.filter(o => o.status === 'shipped').length;
        const delivered = orders.filter(o => o.status === 'delivered').length;
        return { pending, inTransit, delivered };
    }, [orders]);

    // Filtering
    const filteredOrders = useMemo(() => {
        return orders.filter(o => {
            const matchesSearch = o.shippingAddress.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                o._id.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesStatus = filterStatus === 'all' || o.status === filterStatus;
            return matchesSearch && matchesStatus;
        });
    }, [orders, searchTerm, filterStatus]);

    // Pagination
    const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
    const paginatedOrders = filteredOrders.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );



    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Header Section */}
            <div className="flex justify-between items-center gap-2 sm:gap-6 bg-white p-4 sm:p-8 rounded-[32px] shadow-sm border border-gray-50">
                <div className="flex items-center gap-3 sm:gap-4">
                    <div>
                        <h1 className="text-base sm:text-3xl font-black tracking-tight text-gray-900">Logistics & Shipping</h1>
                        <p className="hidden sm:flex text-gray-400 text-sm font-medium mt-1 uppercase tracking-widest items-center gap-2">
                            Delivery Management <span className="w-1 h-1 bg-gray-300 rounded-full"></span> {filteredOrders.length} Active Shipments
                        </p>
                    </div>
                </div>
                <div className="relative group z-10 shrink-0">
                    <FiSearch className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 z-10 text-gray-400 group-focus-within:text-cyan-500 transition-colors pointer-events-none" />
                    <input
                        type="text"
                        placeholder="Search by Order ID or Customer..."
                        className="w-10 h-10 sm:h-auto sm:w-96 pl-10 sm:pl-12 pr-4 sm:py-4 bg-gray-50 border-transparent focus:bg-white focus:border-cyan-200 rounded-full sm:rounded-[20px] text-sm font-medium transition-all duration-300 outline-none focus:w-48 sm:focus:w-96 focus:shadow-xl sm:focus:shadow-none placeholder:opacity-0 focus:placeholder:opacity-100 sm:placeholder:opacity-100 cursor-pointer focus:cursor-text shadow-sm sm:shadow-none"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-3 sm:gap-6">
                <ShippingStatCard
                    label="Pending Pickup"
                    value={stats.pending}
                    icon={<FiPackage />}
                    color="bg-orange-500"
                    desc="Ready for courier"
                />
                <ShippingStatCard
                    label="In Transit"
                    value={stats.inTransit}
                    icon={<FiTruck />}
                    color="bg-cyan-500"
                    desc="Currently with courier"
                />
                <ShippingStatCard
                    label="Delivered"
                    value={stats.delivered}
                    icon={<FiCheckCircle />}
                    color="bg-teal-500"
                    desc="Successfully completed"
                />
            </div>

            {/* Shipping List Table */}
            <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden flex flex-col h-[850px]">
                <div className="p-8 border-b border-gray-50 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-3">
                        <div className="w-2 h-8 bg-cyan-500 rounded-full"></div>
                        <h3 className="text-xl font-bold text-gray-900">Live Shipments</h3>
                    </div>

                    {/* Status Tabs */}
                    <div className="flex items-center gap-2 bg-gray-50 p-1.5 rounded-2xl overflow-x-auto no-scrollbar">
                        {['all', 'processing', 'shipped', 'delivered'].map((s) => (
                            <button
                                key={s}
                                onClick={() => setFilterStatus(s)}
                                className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${filterStatus === s
                                    ? 'bg-white text-gray-900 shadow-sm border border-gray-100'
                                    : 'text-gray-400 hover:text-gray-600'
                                    }`}
                            >
                                {s === 'all' ? 'All' : s === 'processing' ? 'Pending' : s === 'shipped' ? 'In Transit' : 'Delivered'}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex-1 overflow-auto custom-scrollbar">
                    {/* Universal Table View with Horizontal Scroll */}
                    <div className="overflow-x-auto custom-scrollbar w-full">
                        <table className="w-full min-w-[1000px]">
                            <thead>
                                <tr className="bg-gray-50/50 text-[11px] text-gray-400 uppercase tracking-[0.2em] font-black">
                                    <th className="px-8 py-5 text-left">Shipment Detail</th>
                                    <th className="px-8 py-5 text-left">Destination</th>
                                    <th className="px-8 py-5 text-left">Carrier / ID</th>
                                    <th className="px-8 py-5 text-left">Status</th>
                                    <th className="px-8 py-5 text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {loading ? (
                                    <tr>
                                        <td colSpan="5" className="py-20 text-center">
                                            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-cyan-500 mx-auto"></div>
                                        </td>
                                    </tr>
                                ) : paginatedOrders.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="py-20 text-center text-gray-400 font-bold uppercase tracking-widest">
                                            No active shipments found
                                        </td>
                                    </tr>
                                ) : (
                                    paginatedOrders.map((o) => (
                                        <tr key={o._id} className="group hover:bg-gray-50/50 transition-all">
                                            <td className="px-8 py-6">
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-black text-gray-900">#{o._id.slice(-6).toUpperCase()}</span>
                                                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter mt-1">
                                                        {o.items.length} Items • Rs. {o.totalAmount.toLocaleString()}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex items-start gap-3">
                                                    <FiMapPin className="text-cyan-500 mt-1" />
                                                    <div className="flex flex-col">
                                                        <span className="text-sm font-bold text-gray-700">{o.shippingAddress.fullName}</span>
                                                        <span className="text-[10px] text-gray-400 font-medium uppercase tracking-tight">
                                                            {o.shippingAddress.city}, {o.shippingAddress.state}
                                                        </span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex flex-col">
                                                    <span className="text-xs font-black text-gray-600 uppercase tracking-widest">
                                                        Standard Shipping
                                                    </span>
                                                    <span className="text-[10px] text-cyan-600 font-bold mt-1">
                                                        ID: {o._id.slice(0, 8).toUpperCase()}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <span className={`px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border flex items-center gap-2 w-fit ${o.status === 'delivered' ? 'bg-green-50 text-green-600 border-green-100' :
                                                    o.status === 'shipped' ? 'bg-cyan-50 text-cyan-600 border-cyan-100' :
                                                        'bg-orange-50 text-orange-600 border-orange-100'
                                                    }`}>
                                                    {o.status === 'delivered' ? <FiCheckCircle /> : o.status === 'shipped' ? <FiTruck /> : <FiClock />}
                                                    {o.status}
                                                </span>
                                            </td>
                                            <td className="px-8 py-6 text-center">
                                                <div className="flex items-center justify-center gap-2">
                                                    {o.status === 'processing' && (
                                                        <button
                                                            onClick={() => handleStatusUpdate(o._id, 'shipped')}
                                                            className="px-4 py-2 bg-gradient-to-r from-[#001B1B] to-[#006060] text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:from-[#002B2B] hover:to-[#008080] active:scale-95 transition-all shadow-lg shadow-black/20"
                                                        >
                                                            Ship Order
                                                        </button>
                                                    )}
                                                    {o.status === 'shipped' && (
                                                        <button
                                                            onClick={() => handleStatusUpdate(o._id, 'delivered')}
                                                            className="px-4 py-2 bg-teal-500 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-teal-600 transition-all shadow-lg shadow-teal-500/20"
                                                        >
                                                            Mark Delivered
                                                        </button>
                                                    )}
                                                    <button className="p-3 bg-white border border-gray-100 rounded-xl text-gray-400 hover:text-cyan-500 transition-all shadow-sm">
                                                        <FiExternalLink />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                <AdminPagination 
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                    totalItems={filteredOrders.length}
                    itemsPerPage={itemsPerPage}
                    itemName="orders"
                />
            </div>
        </div>
    );
};

const ShippingStatCard = ({ label, value, icon, color, desc }) => (
    <div 
        tabIndex="0"
        className="bg-white rounded-2xl sm:rounded-[32px] p-3 sm:p-8 shadow-sm border border-gray-50 flex flex-col items-center sm:items-start group hover:shadow-xl hover:shadow-cyan-400/5 transition-all relative cursor-pointer outline-none focus:bg-gray-50 active:bg-gray-50"
    >
        <div className="flex items-center justify-between w-full">
            <div className={`w-10 h-10 sm:w-14 sm:h-14 mx-auto sm:mx-0 rounded-xl sm:rounded-2xl ${color} text-white flex items-center justify-center text-lg sm:text-2xl shadow-xl transition-transform group-hover:scale-110 group-focus:scale-110`}>
                {icon}
            </div>
            <div className="hidden sm:block w-2 h-2 bg-gray-100 rounded-full"></div>
        </div>
        
        <div className="text-center sm:text-left mt-1 sm:mt-6 w-full">
            <p className="hidden sm:block text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-1">{label}</p>
            <h4 className="text-sm sm:text-3xl font-black text-gray-900 tracking-tight leading-none pointer-events-none truncate">{value}</h4>
            <p className="hidden sm:block text-[10px] text-gray-400 mt-2 font-medium">{desc}</p>
        </div>

        {/* Tooltip on Mobile (Shows on Hover/Focus/Active) */}
        <div className="sm:hidden absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] font-bold tracking-wider uppercase px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 group-focus:opacity-100 group-active:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-[100] shadow-xl">
            {label}
            <div className="absolute top-full left-1/2 -translate-x-1/2 border-[5px] border-transparent border-t-gray-900"></div>
        </div>
    </div>
);

export default AdminShipping;
