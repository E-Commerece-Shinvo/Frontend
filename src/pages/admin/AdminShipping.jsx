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
            <div className="bg-white p-6 md:p-8 rounded-[32px] shadow-sm border border-gray-50 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-3xl font-black tracking-tight text-gray-900">Logistics & Shipping</h1>
                    <p className="text-gray-400 text-sm font-medium mt-1 uppercase tracking-widest flex items-center gap-2">
                        Delivery Management <span className="w-1 h-1 bg-gray-300 rounded-full"></span> {filteredOrders.length} Active Shipments
                    </p>
                </div>
                <div className="relative w-full md:w-96 group">
                    <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-cyan-500 transition-colors" />
                    <input
                        type="text"
                        placeholder="Search by Order ID or Customer..."
                        className="w-full pl-12 pr-4 py-4 bg-gray-50 border-transparent focus:bg-white focus:border-cyan-200 rounded-[20px] text-sm font-medium transition-all outline-none"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
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
                    {/* Mobile View: Shipment Cards */}
                    <div className="lg:hidden divide-y divide-gray-50">
                        {loading ? (
                            <div className="py-20 text-center">
                                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-cyan-500 mx-auto"></div>
                            </div>
                        ) : paginatedOrders.length === 0 ? (
                            <div className="py-20 text-center text-gray-400 font-bold uppercase tracking-widest">
                                No active shipments found
                            </div>
                        ) : (
                            paginatedOrders.map((o) => (
                                <div key={o._id} className="p-6 space-y-4">
                                    <div className="flex justify-between items-start">
                                        <div className="flex flex-col">
                                            <span className="text-xs font-black text-gray-900 uppercase tracking-widest">#{o._id.slice(-6).toUpperCase()}</span>
                                            <span className="text-[10px] text-gray-400 font-bold mt-1 uppercase tracking-tighter">
                                                Rs. {o.totalAmount.toLocaleString()} • {o.items.length} Items
                                            </span>
                                        </div>
                                        <span className={`px-3 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest border flex items-center gap-1 ${o.status === 'delivered' ? 'bg-green-50 text-green-600 border-green-100' :
                                            o.status === 'shipped' ? 'bg-cyan-50 text-cyan-600 border-cyan-100' :
                                                'bg-orange-50 text-orange-600 border-orange-100'
                                            }`}>
                                            {o.status}
                                        </span>
                                    </div>

                                    <div className="flex items-start gap-3 bg-gray-50/50 p-3 rounded-2xl">
                                        <FiMapPin className="text-cyan-500 mt-0.5" />
                                        <div className="flex flex-col">
                                            <span className="text-xs font-bold text-gray-700">{o.shippingAddress.fullName}</span>
                                            <span className="text-[10px] text-gray-400 uppercase tracking-tight">
                                                {o.shippingAddress.city}, {o.shippingAddress.state}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between gap-3 pt-2">
                                        <div className="flex flex-col">
                                            <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Courier ID</span>
                                            <span className="text-[10px] font-bold text-cyan-600">{o._id.slice(0, 8).toUpperCase()}</span>
                                        </div>
                                        <div className="flex gap-2">
                                            {o.status === 'processing' && (
                                                <button
                                                    onClick={() => handleStatusUpdate(o._id, 'shipped')}
                                                    className="px-4 py-2 bg-[#001B1B] text-white text-[9px] font-black uppercase tracking-widest rounded-lg"
                                                >
                                                    Ship
                                                </button>
                                            )}
                                            {o.status === 'shipped' && (
                                                <button
                                                    onClick={() => handleStatusUpdate(o._id, 'delivered')}
                                                    className="px-4 py-2 bg-teal-500 text-white text-[9px] font-black uppercase tracking-widest rounded-lg"
                                                >
                                                    Deliver
                                                </button>
                                            )}
                                            <button className="p-2 bg-white border border-gray-100 rounded-lg text-gray-400 hover:text-cyan-500 transition-all">
                                                <FiExternalLink />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Desktop View: Full Table */}
                    <div className="hidden lg:block overflow-x-auto">
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
    <div className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-50 flex flex-col gap-6 group hover:shadow-xl transition-all">
        <div className="flex justify-between items-start">
            <div className={`w-14 h-14 rounded-2xl ${color} text-white flex items-center justify-center text-2xl shadow-xl transition-transform group-hover:scale-110`}>
                {icon}
            </div>
            <div className="w-2 h-2 bg-gray-100 rounded-full"></div>
        </div>
        <div>
            <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-1">{label}</p>
            <h4 className="text-3xl font-black text-gray-900 tracking-tight">{value}</h4>
            <p className="text-[10px] text-gray-400 mt-2 font-medium">{desc}</p>
        </div>
    </div>
);

export default AdminShipping;
