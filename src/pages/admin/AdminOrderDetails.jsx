import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
    FiArrowLeft, FiPackage, FiTruck, FiCheckCircle,
    FiXCircle, FiClock, FiMapPin, FiUser,
    FiPhone, FiMail, FiCreditCard, FiActivity,
    FiChevronDown
} from 'react-icons/fi';
import { getOrderById, updateOrderStatus } from '../../api/orders';
import toast from 'react-hot-toast';

const AdminOrderDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [showStatusDropdown, setShowStatusDropdown] = useState(false);

    useEffect(() => {
        fetchOrderDetails();
    }, [id]);

    const fetchOrderDetails = async () => {
        try {
            setLoading(true);
            const data = await getOrderById(id);
            setOrder(data);
        } catch (error) {
            toast.error('Failed to fetch order details');
            navigate('/admin/orders');
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (newStatus) => {
        try {
            setUpdating(true);
            await updateOrderStatus(id, newStatus);
            toast.success(`Order status updated to ${newStatus}`);
            setShowStatusDropdown(false);
            fetchOrderDetails();
        } catch (error) {
            toast.error('Failed to update status');
        } finally {
            setUpdating(false);
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'pending': return <FiClock className="text-orange-500" />;
            case 'processing': return <FiActivity className="text-blue-500" />;
            case 'shipped': return <FiTruck className="text-purple-500" />;
            case 'delivered': return <FiCheckCircle className="text-teal-500" />;
            case 'cancelled': return <FiXCircle className="text-red-500" />;
            default: return <FiPackage className="text-gray-500" />;
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending': return 'text-orange-500 bg-orange-50 border-orange-100';
            case 'processing': return 'text-blue-500 bg-blue-50 border-blue-100';
            case 'shipped': return 'text-purple-500 bg-purple-50 border-purple-100';
            case 'delivered': return 'text-teal-500 bg-teal-50 border-teal-100';
            case 'cancelled': return 'text-red-500 bg-red-50 border-red-100';
            default: return 'text-gray-500 bg-gray-50 border-gray-100';
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="w-12 h-12 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!order) return null;

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate('/admin/orders')}
                        className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-gray-50 hover:bg-gray-50 transition-all group"
                    >
                        <FiArrowLeft className="group-hover:-translate-x-1 transition-transform" />
                    </button>
                    <div>
                        <div className="flex items-center gap-3">
                            <h2 className="text-2xl font-bold tracking-tight text-gray-900 uppercase">Order #{order._id.slice(-8)}</h2>
                            <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider border ${getStatusColor(order.status)}`}>
                                {order.status}
                            </span>
                        </div>
                        <p className="text-gray-400 text-sm mt-1">Placed on {new Date(order.createdAt).toLocaleString()}</p>
                    </div>
                </div>

                {/* Status Update Panel */}
                <div className="relative">
                    {/* Desktop View: Horizontal List */}
                    <div className="hidden md:flex bg-white p-3 rounded-[24px] shadow-sm border border-gray-100 items-center gap-3">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-2">Update Status:</span>
                        {['processing', 'shipped', 'delivered', 'cancelled'].map((status) => (
                            <button
                                key={status}
                                disabled={updating || order.status === status}
                                onClick={() => handleStatusUpdate(status)}
                                className={`px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap disabled:opacity-30 disabled:cursor-not-allowed shadow-sm hover:scale-105 active:scale-95 ${
                                    status === 'cancelled'
                                    ? 'bg-red-50 text-red-600 hover:bg-red-500 hover:text-white border border-red-100'
                                    : status === 'delivered'
                                        ? 'bg-teal-50 text-teal-600 hover:bg-teal-500 hover:text-white border border-teal-100'
                                        : status === 'shipped'
                                            ? 'bg-purple-50 text-purple-600 hover:bg-purple-500 hover:text-white border border-purple-100'
                                            : 'bg-cyan-50 text-cyan-600 hover:bg-cyan-500 hover:text-white border border-cyan-100'
                                }`}
                            >
                                {status === 'processing' && 'Start Processing'}
                                {status === 'shipped' && 'Ship Order'}
                                {status === 'delivered' && 'Mark Delivered'}
                                {status === 'cancelled' && 'Cancel Order'}
                            </button>
                        ))}
                    </div>

                    {/* Mobile View: Dropdown Menu */}
                    <div className="md:hidden w-full sm:w-auto">
                        <button
                            onClick={() => setShowStatusDropdown(!showStatusDropdown)}
                            className="flex items-center justify-between w-full px-6 py-4 bg-white rounded-2xl shadow-sm border border-gray-100 text-sm font-bold text-gray-900 group"
                        >
                            <span className="flex items-center gap-2">
                                <FiActivity className="text-cyan-500" />
                                Update Status
                            </span>
                            <FiChevronDown className={`transition-transform duration-300 ${showStatusDropdown ? 'rotate-180' : ''}`} />
                        </button>

                        {showStatusDropdown && (
                            <div className="absolute right-0 left-0 mt-2 bg-white rounded-2xl shadow-2xl border border-gray-50 p-2 z-50 animate-in fade-in zoom-in-95 duration-200">
                                {['processing', 'shipped', 'delivered', 'cancelled'].map((status) => (
                                    <button
                                        key={status}
                                        disabled={updating || order.status === status}
                                        onClick={() => handleStatusUpdate(status)}
                                        className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider mb-1 last:mb-0 transition-all ${
                                            order.status === status
                                            ? 'bg-gray-50 text-gray-400 cursor-not-allowed'
                                            : status === 'cancelled'
                                                ? 'text-red-600 hover:bg-red-50'
                                                : 'text-cyan-600 hover:bg-cyan-50'
                                        }`}
                                    >
                                        <span>
                                            {status === 'processing' && 'Start Processing'}
                                            {status === 'shipped' && 'Ship Order'}
                                            {status === 'delivered' && 'Mark Delivered'}
                                            {status === 'cancelled' && 'Cancel Order'}
                                        </span>
                                        {order.status === status && <FiCheckCircle size={14} />}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Order Items */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-50">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-xl font-bold text-gray-900">Order Items</h3>
                            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{order.items.length} Items</span>
                        </div>

                        <div className="divide-y divide-gray-50">
                            {order.items.map((item, idx) => (
                                <div key={idx} className="py-6 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 group">
                                    <div className="flex items-center gap-4 sm:gap-6 flex-1 min-w-0">
                                        <div className="w-20 h-20 bg-gray-50 rounded-2xl overflow-hidden border border-gray-100 flex-shrink-0">
                                            <img
                                                src={item.image || 'https://via.placeholder.com/150'}
                                                alt={item.name}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="text-sm font-bold text-gray-900 truncate uppercase tracking-tight">{item.name}</h4>
                                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">
                                                {item.variant || 'Standard'} • Quantity: {item.quantity}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-left sm:text-right pl-24 sm:pl-0">
                                        <p className="text-sm font-bold text-gray-900">Rs. {item.price.toLocaleString()}</p>
                                        <p className="text-[10px] text-teal-500 font-bold uppercase tracking-widest mt-1">
                                            Total: Rs. {(item.price * item.quantity).toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-8 pt-8 border-t border-gray-50 space-y-4">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-400 font-bold uppercase tracking-widest text-[11px]">Subtotal</span>
                                <span className="text-gray-900 font-bold">Rs. {order.totalAmount.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-400 font-bold uppercase tracking-widest text-[11px]">Shipping</span>
                                <span className="text-teal-500 font-bold uppercase tracking-widest text-[11px]">Free</span>
                            </div>
                            <div className="flex justify-between items-center pt-4">
                                <span className="text-gray-900 font-black uppercase tracking-widest text-sm">Total Amount</span>
                                <span className="text-2xl font-black text-gray-900 tracking-tight">Rs. {order.totalAmount.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>

                    {/* Order Timeline Placeholder */}
                    <div className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-50">
                        <h3 className="text-xl font-bold text-gray-900 mb-8">Order History</h3>
                        <div className="space-y-8">
                            <TimelineItem
                                icon={<FiCheckCircle className="text-white" />}
                                color="bg-teal-500"
                                title="Order Placed"
                                date={new Date(order.createdAt).toLocaleString()}
                                desc="Order was successfully placed by the customer."
                            />
                            {order.status !== 'pending' && (
                                <TimelineItem
                                    icon={getStatusIcon(order.status)}
                                    color={getStatusColor(order.status).split(' ')[1]}
                                    title={`Status Updated to ${order.status}`}
                                    date={new Date(order.updatedAt).toLocaleString()}
                                    desc={`Admin updated the order status to ${order.status}.`}
                                    isLast
                                />
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Column: Customer & Shipping */}
                <div className="space-y-8">
                    {/* Customer Info */}
                    <div className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-50">
                        <h3 className="text-xl font-bold text-gray-900 mb-8">Customer</h3>
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-14 h-14 bg-cyan-50 rounded-2xl flex items-center justify-center text-cyan-600 text-xl font-bold">
                                {order.shippingAddress.fullName[0]}
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-gray-900 leading-none mb-1">{order.shippingAddress.fullName}</h4>
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Customer ID: {order.user?._id?.slice(-6) || 'Guest'}</p>
                            </div>
                        </div>
                        <div className="space-y-6">
                            <InfoRow icon={<FiMail />} label="Email Address" value={order.user?.email || 'N/A'} />
                            <InfoRow icon={<FiPhone />} label="Phone Number" value={order.shippingAddress.phone} />
                        </div>
                    </div>

                    {/* Shipping Address */}
                    <div className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-50">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-xl font-bold text-gray-900">Shipping</h3>
                            <FiMapPin className="text-gray-400" />
                        </div>
                        <div className="space-y-2">
                            <p className="text-sm font-bold text-gray-900">{order.shippingAddress.fullName}</p>
                            <p className="text-sm text-gray-500 leading-relaxed">
                                {order.shippingAddress.address}<br />
                                {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}
                            </p>
                        </div>
                    </div>

                    {/* Payment Info */}
                    <div className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-50">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-xl font-bold text-gray-900">Payment</h3>
                            <FiCreditCard className="text-gray-400" />
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400">
                                <FiCreditCard size={20} />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-gray-900 uppercase tracking-tight">
                                    {order.paymentMethod === 'cod' ? 'Cash on Delivery' : order.paymentMethod}
                                </p>
                                <p className="text-[10px] text-teal-500 font-bold uppercase tracking-widest mt-0.5">Payment Pending</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const InfoRow = ({ icon, label, value }) => (
    <div className="flex items-center gap-4">
        <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400">
            {icon}
        </div>
        <div>
            <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-0.5">{label}</p>
            <p className="text-sm font-bold text-gray-900 break-all">{value}</p>
        </div>
    </div>
);

const TimelineItem = ({ icon, color, title, date, desc, isLast }) => (
    <div className="flex gap-6 relative">
        {!isLast && <div className="absolute left-6 top-12 bottom-0 w-px bg-gray-100"></div>}
        <div className={`w-12 h-12 rounded-2xl ${color} flex items-center justify-center shadow-lg relative z-10 shrink-0`}>
            {icon}
        </div>
        <div className="flex-1 pb-10">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2 gap-1 sm:gap-0">
                <h4 className="text-sm font-bold text-gray-900">{title}</h4>
                <span className="text-[10px] text-gray-300 font-bold">{date}</span>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed font-medium">{desc}</p>
        </div>
    </div>
);

export default AdminOrderDetails;
