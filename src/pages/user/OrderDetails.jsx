import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getOrderById, cancelOrder, updateOrderAddress, requestRefund } from '../../api/orders';
import Navbar from '../../components/layout/Navbar/Navbar';
import Footer from '../../components/layout/Footer/Footer';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import {
    FiPackage, FiClock, FiTruck, FiCheckCircle, FiXCircle,
    FiShoppingBag, FiUser, FiArrowLeft, FiMapPin,
    FiCreditCard, FiActivity, FiRotateCcw, FiHelpCircle, FiFileText, FiEdit, FiCheck
} from 'react-icons/fi';
import toast from 'react-hot-toast';

/* ───────── status config ───────── */
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

const TimelineItem = ({ icon, color, title, date, desc, isLast, isCompleted = true, isNextCompleted = false }) => (
    <div className={`flex gap-6 relative ${!isCompleted ? 'opacity-60' : ''}`}>
        {!isLast && (
            <div className={`absolute left-[23px] top-12 bottom-0 w-0.5 ${isNextCompleted ? 'bg-[#53C1CC]' : 'bg-gray-100'}`}></div>
        )}
        <div className={`w-12 h-12 rounded-2xl ${color} flex items-center justify-center shadow-sm relative z-10 shrink-0 ${!isCompleted ? 'grayscale' : ''}`}>
            {icon}
        </div>
        <div className="flex-1 pb-10">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2 gap-1 sm:gap-0">
                <h4 className={`text-sm font-bold ${!isCompleted ? 'text-gray-400' : 'text-gray-900'}`}>{title}</h4>
                <span className={`text-[10px] font-bold ${!isCompleted ? 'text-gray-300' : 'text-gray-400'}`}>{date}</span>
            </div>
            <p className={`text-xs leading-relaxed font-medium ${!isCompleted ? 'text-gray-300' : 'text-gray-500'}`}>{desc}</p>
        </div>
    </div>
);

function OrderDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const { addToCart } = useCart();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [cancelling, setCancelling] = useState(false);
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [showRefundModal, setShowRefundModal] = useState(false);
    const [cancelReasons, setCancelReasons] = useState([]);
    const [showAddressModal, setShowAddressModal] = useState(false);
    const [updatingAddress, setUpdatingAddress] = useState(false);
    const [activeSlot, setActiveSlot] = useState(null);
    const [addressForm, setAddressForm] = useState({
        fullName: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        postalCode: ''
    });

    const openAddressModal = () => {
        setAddressForm({
            fullName: order?.shippingAddress?.fullName || '',
            phone: order?.shippingAddress?.phone || '',
            address: order?.shippingAddress?.address || '',
            city: order?.shippingAddress?.city || '',
            state: order?.shippingAddress?.state || '',
            postalCode: order?.shippingAddress?.postalCode || ''
        });
        setActiveSlot(null);
        setShowAddressModal(true);
    };

    const handleSelectSavedAddress = (addr) => {
        setAddressForm({
            fullName: `${addr.firstName} ${addr.lastName}`.trim(),
            phone: addr.phone || '',
            address: addr.address || '',
            city: addr.city || '',
            state: addr.state || '',
            postalCode: addr.postalCode || ''
        });
    };

    const handleAddressSubmit = async (e) => {
        e.preventDefault();
        try {
            setUpdatingAddress(true);
            const updatedOrder = await updateOrderAddress(id, addressForm);
            setOrder(updatedOrder);
            setShowAddressModal(false);
            toast.success('Shipping address updated successfully.');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to update address.');
        } finally {
            setUpdatingAddress(false);
        }
    };

    const handleBuyAgain = () => {
        if (!order || !order.items) return;

        order.items.forEach(item => {
            for (let i = 0; i < item.quantity; i++) {
                addToCart({
                    id: item.product,
                    name: item.name,
                    price: item.price,
                    image: item.image,
                    variant: item.variant
                });
            }
        });
        toast.success('Items added to cart!');
    };

    const handleCancelOrderClick = () => {
        setCancelReasons([]);
        setShowCancelModal(true);
    };

    const confirmCancelOrder = async () => {
        setShowCancelModal(false);

        try {
            setCancelling(true);
            // Optionally, pass cancelReason to backend if supported: await cancelOrder(id, { reason: cancelReason });
            const updatedOrder = await cancelOrder(id);
            setOrder(updatedOrder);
            toast.success('Order cancelled successfully.');
        } catch (err) {
            console.error('Failed to cancel order:', err);
            toast.error(err.response?.data?.message || 'Failed to cancel order.');
        } finally {
            setCancelling(false);
        }
    };

    const handleRefundRequest = async () => {
        try {
            setCancelling(true); // Reusing cancelling state for the button loading
            const updatedOrder = await requestRefund(id);
            setOrder(updatedOrder);
            toast.success('Refund requested successfully.');
            setShowRefundModal(false);
            navigate('/my-returns');
        } catch (err) {
            console.error('Failed to request refund:', err);
            toast.error(err.response?.data?.message || 'Failed to request refund.');
        } finally {
            setCancelling(false);
        }
    };

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const data = await getOrderById(id);
                setOrder(data);
            } catch (err) {
                console.error('Failed to fetch order details:', err);
                toast.error('Could not load order details.');
                navigate('/my-orders');
            } finally {
                setLoading(false);
            }
        };
        fetchOrder();
    }, [id, navigate]);

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
                        <Link to="/my-orders" className="flex items-center gap-3 px-3 py-2.5 text-[14px] text-[#53C1CC] font-bold rounded-xl bg-[#53C1CC]/5 transition-all">
                            <FiShoppingBag size={18} />
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
                        <h4 className="px-3 text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2">Help & Support</h4>
                        <Link to="/support" className="flex items-center gap-3 px-3 py-2.5 text-[14px] text-gray-600 font-medium rounded-xl hover:bg-gray-50 transition-all group">
                            <FiHelpCircle className="text-gray-400 group-hover:text-[#53C1CC]" size={18} />
                            Customer Support
                        </Link>
                        <Link to="/my-complaints" className="flex items-center gap-3 px-3 py-2.5 text-[14px] text-gray-600 font-medium rounded-xl hover:bg-gray-50 transition-all group">
                            <FiFileText className="text-gray-400 group-hover:text-[#53C1CC]" size={18} />
                            My Complaints
                        </Link>
                    </div>
                </aside>


                {/* ───── RIGHT CONTENT ───── */}
                <main className="flex-1 min-w-0 w-full animate-in fade-in slide-in-from-bottom-4 duration-500">

                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
                            <div className="w-10 h-10 border-4 border-gray-100 border-t-[#53C1CC] rounded-full animate-spin mb-4" />
                            <p className="text-gray-500 font-medium">Fetching order details...</p>
                        </div>
                    ) : !order ? (
                        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
                            <p className="text-gray-500 font-medium">Order not found.</p>
                        </div>
                    ) : (
                        <div className="space-y-6 md:space-y-8">
                            {/* Header */}
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div className="flex items-center gap-4">
                                    <button
                                        onClick={() => navigate('/my-orders')}
                                        className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-gray-50 hover:bg-gray-50 transition-all group"
                                    >
                                        <FiArrowLeft className="text-gray-600 group-hover:-translate-x-1 transition-transform" />
                                    </button>
                                    <div>
                                        <div className="flex items-center gap-3">
                                            <h2 className="text-xl md:text-2xl font-extrabold tracking-tight text-gray-900 uppercase">Order #{order._id.slice(-8)}</h2>
                                            <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider border ${getStatusColor(order.status)}`}>
                                                {order.status}
                                            </span>
                                        </div>
                                        <p className="text-gray-400 text-xs md:text-sm mt-1 font-medium">Placed on {new Date(order.createdAt).toLocaleString()}</p>
                                    </div>
                                </div>
                                <div className="mt-4 md:mt-0 flex flex-wrap items-center gap-3">
                                    {order.status === 'cancelled' && (
                                        <button
                                            onClick={handleBuyAgain}
                                            className="px-6 py-2.5 bg-[#53C1CC] text-white hover:bg-[#3fb0ba] font-bold rounded-xl text-sm transition-all shadow-sm flex items-center justify-center gap-2"
                                        >
                                            <FiRotateCcw size={16} />
                                            Buy Again
                                        </button>
                                    )}
                                    {order.status === 'cancelled' && order.refundStatus === 'none' ? (
                                        <button
                                            onClick={() => setShowRefundModal(true)}
                                            className="px-6 py-2.5 font-bold rounded-xl text-sm transition-all shadow-sm border flex items-center justify-center gap-2 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 hover:text-indigo-700 border-indigo-100"
                                        >
                                            <FiRotateCcw size={16} />
                                            Refund
                                        </button>
                                    ) : order.refundStatus !== 'none' ? (
                                        <div className="px-6 py-2.5 font-bold rounded-xl text-sm border flex items-center justify-center gap-2 bg-indigo-50 text-indigo-600 border-indigo-100 cursor-default">
                                            <FiCheckCircle size={16} />
                                            Refund {order.refundStatus === 'requested' ? 'Requested' : 'Processed'}
                                        </div>
                                    ) : (
                                        <button
                                            onClick={handleCancelOrderClick}
                                            disabled={cancelling || order.status !== 'pending'}
                                            className={`px-6 py-2.5 font-bold rounded-xl text-sm transition-all shadow-sm border flex items-center justify-center gap-2 ${order.status === 'pending'
                                                ? 'bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 border-red-100'
                                                : 'bg-gray-50 text-gray-400 border-gray-100 cursor-not-allowed opacity-75'
                                                }`}
                                        >
                                            {cancelling ? (
                                                <>
                                                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                                                    Cancelling...
                                                </>
                                            ) : (
                                                <>
                                                    <FiXCircle size={16} />
                                                    Cancel Order
                                                </>
                                            )}
                                        </button>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 md:gap-8">
                                {/* Left Column: Order Items & Timeline */}
                                <div className="xl:col-span-2 space-y-6 md:space-y-8">
                                    {/* Order Timeline */}
                                    <div className="bg-white rounded-[24px] md:rounded-[32px] p-6 md:p-8 shadow-sm border border-gray-50">
                                        <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-8">Order Tracking</h3>
                                        <div className="space-y-8">
                                            {order.status === 'cancelled' ? (
                                                (order.history || []).map((hist, idx) => (
                                                    <TimelineItem
                                                        key={idx}
                                                        icon={getStatusIcon(hist.status)}
                                                        color={getStatusColor(hist.status).split(' ')[1] || 'bg-gray-50'}
                                                        title={hist.status === 'pending' ? 'Order Placed' : `Status Updated to ${hist.status}`}
                                                        date={new Date(hist.timestamp).toLocaleString()}
                                                        desc={hist.message || `Order status updated to ${hist.status}.`}
                                                        isLast={idx === (order.history || []).length - 1}
                                                        isCompleted={true}
                                                        isNextCompleted={true}
                                                    />
                                                ))
                                            ) : (
                                                [
                                                    { id: 'pending', label: 'Order Placed', desc: 'Your order was successfully placed.' },
                                                    { id: 'processing', label: 'Processing', desc: 'We are currently preparing your order.' },
                                                    { id: 'shipped', label: 'Shipped', desc: 'Your order has been shipped and is on its way.' },
                                                    { id: 'delivered', label: 'Delivered', desc: 'Your order has been successfully delivered.' }
                                                ].map((step, idx, arr) => {
                                                    const hist = (order.history || []).find(h => h.status === step.id);
                                                    const isCompleted = !!hist;
                                                    const nextStep = arr[idx + 1];
                                                    const isNextCompleted = nextStep ? !!(order.history || []).find(h => h.status === nextStep.id) : false;

                                                    return (
                                                        <TimelineItem
                                                            key={step.id}
                                                            icon={getStatusIcon(step.id)}
                                                            color={isCompleted ? getStatusColor(step.id).split(' ')[1] : 'bg-gray-50'}
                                                            title={step.label}
                                                            date={isCompleted ? new Date(hist.timestamp).toLocaleString() : '---'}
                                                            desc={isCompleted ? (hist.message || step.desc) : step.desc}
                                                            isLast={idx === arr.length - 1}
                                                            isCompleted={isCompleted}
                                                            isNextCompleted={isNextCompleted}
                                                        />
                                                    );
                                                })
                                            )}
                                        </div>
                                    </div>

                                    <div className="bg-white rounded-[24px] md:rounded-[32px] p-6 md:p-8 shadow-sm border border-gray-50">
                                        <div className="flex items-center justify-between mb-8">
                                            <h3 className="text-lg md:text-xl font-bold text-gray-900">Items Ordered</h3>
                                            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{order.items.length} Items</span>
                                        </div>

                                        <div className="divide-y divide-gray-50">
                                            {order.items.map((item, idx) => (
                                                <div key={idx} className="py-6 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 group">
                                                    <div className="flex items-center gap-4 sm:gap-6 flex-1 min-w-0">
                                                        <div className="w-20 h-20 bg-gray-50 rounded-2xl overflow-hidden border border-gray-100 flex-shrink-0 p-1">
                                                            {item.image ? (
                                                                <img
                                                                    src={item.image}
                                                                    alt={item.name}
                                                                    className="w-full h-full object-contain group-hover:scale-110 transition-transform"
                                                                />
                                                            ) : (
                                                                <div className="w-full h-full flex items-center justify-center">
                                                                    <FiPackage size={24} className="text-gray-300" />
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <h4 className="text-sm md:text-[15px] font-bold text-gray-900 truncate">{item.name}</h4>
                                                            <p className="text-[11px] text-gray-400 font-bold uppercase tracking-widest mt-1">
                                                                {item.variant || 'Standard'} • Qty: {item.quantity}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="text-left sm:text-right pl-24 sm:pl-0">
                                                        <p className="text-[15px] font-extrabold text-gray-900">Rs. {item.price.toLocaleString()}</p>
                                                        <p className="text-[11px] text-[#53C1CC] font-bold uppercase tracking-widest mt-1">
                                                            Total: Rs. {(item.price * item.quantity).toLocaleString()}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="mt-6 pt-6 border-t border-gray-50 space-y-4">
                                            <div className="flex justify-between items-center text-sm">
                                                <span className="text-gray-400 font-bold uppercase tracking-widest text-[11px]">Subtotal</span>
                                                <span className="text-gray-900 font-bold">Rs. {order.totalAmount.toLocaleString()}</span>
                                            </div>
                                            <div className="flex justify-between items-center text-sm">
                                                <span className="text-gray-400 font-bold uppercase tracking-widest text-[11px]">Shipping</span>
                                                <span className="text-[#53C1CC] font-bold uppercase tracking-widest text-[11px]">Free</span>
                                            </div>
                                            <div className="flex justify-between items-center pt-4 border-t border-gray-50">
                                                <span className="text-gray-900 font-black uppercase tracking-widest text-sm">Total Amount</span>
                                                <span className="text-xl md:text-2xl font-black text-gray-900 tracking-tight">Rs. {order.totalAmount.toLocaleString()}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Right Column: Shipping & Payment */}
                                <div className="space-y-6 md:space-y-8">
                                    {/* Shipping Address */}
                                    <div className="bg-white rounded-[24px] md:rounded-[32px] p-6 md:p-8 shadow-sm border border-gray-50">
                                        <div className="flex items-center justify-between mb-6">
                                            <h3 className="text-lg md:text-xl font-bold text-gray-900">Shipping Info</h3>
                                            <div className="flex items-center gap-2">
                                                {order.status === 'pending' && (
                                                    <button
                                                        onClick={openAddressModal}
                                                        className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-500 hover:text-[#53C1CC] hover:bg-[#53C1CC]/10 transition-all"
                                                        title="Edit Shipping Address"
                                                    >
                                                        <FiEdit size={14} />
                                                    </button>
                                                )}
                                                <FiMapPin className="text-gray-400" />
                                            </div>
                                        </div>
                                        <div className="space-y-4">
                                            <div>
                                                <p className="text-[11px] text-gray-400 font-bold uppercase tracking-widest mb-1">Recipient</p>
                                                <p className="text-sm font-bold text-gray-900">{order.shippingAddress.fullName}</p>
                                            </div>
                                            <div>
                                                <p className="text-[11px] text-gray-400 font-bold uppercase tracking-widest mb-1">Phone</p>
                                                <p className="text-sm font-bold text-gray-900">{order.shippingAddress.phone}</p>
                                            </div>
                                            <div>
                                                <p className="text-[11px] text-gray-400 font-bold uppercase tracking-widest mb-1">Delivery Address</p>
                                                <p className="text-sm text-gray-600 leading-relaxed font-medium">
                                                    {order.shippingAddress.address}<br />
                                                    {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Payment Info */}
                                    <div className="bg-white rounded-[24px] md:rounded-[32px] p-6 md:p-8 shadow-sm border border-gray-50">
                                        <div className="flex items-center justify-between mb-6">
                                            <h3 className="text-lg md:text-xl font-bold text-gray-900">Payment Info</h3>
                                            <FiCreditCard className="text-gray-400" />
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 border border-gray-100">
                                                <FiCreditCard size={20} />
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-gray-900 uppercase tracking-tight">
                                                    {order.paymentMethod === 'cod' ? 'Cash on Delivery' : order.paymentMethod}
                                                </p>
                                                <p className="text-[10px] text-[#53C1CC] font-bold uppercase tracking-widest mt-1">Payment Pending</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </main>
            </div>

            {/* Cancel Confirmation Modal */}
            {showCancelModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto">
                    <div className="bg-white rounded-[32px] p-6 md:p-8 max-w-md w-full shadow-2xl animate-in zoom-in-95 duration-200 my-8">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-red-50 rounded-full flex items-center justify-center">
                                    <FiXCircle className="text-red-500 w-5 h-5" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900">Cancel Order</h3>
                            </div>
                            <button
                                onClick={() => setShowCancelModal(false)}
                                className="w-8 h-8 flex items-center justify-center bg-gray-50 rounded-full text-gray-500 hover:bg-gray-100 transition-all"
                            >
                                <FiXCircle size={20} />
                            </button>
                        </div>
                        
                        <p className="text-gray-500 text-sm font-medium mb-6">
                            Please select a reason for cancelling your order. This helps us improve our service.
                        </p>

                        <div className="space-y-2 mb-8 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
                            {[
                                "Found a better price elsewhere",
                                "Ordered by mistake",
                                "Shipping time is too long",
                                "Changed my mind",
                                "Want to change shipping address",
                                "Product is no longer needed",
                                "Other reasons"
                            ].map((reason, idx) => {
                                const isSelected = cancelReasons.includes(reason);
                                return (
                                    <label 
                                        key={idx} 
                                        onClick={() => {
                                            if (isSelected) {
                                                setCancelReasons(cancelReasons.filter(r => r !== reason));
                                            } else {
                                                setCancelReasons([...cancelReasons, reason]);
                                            }
                                        }}
                                        className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                                            isSelected 
                                                ? 'bg-red-50/50 border-red-200' 
                                                : 'border-gray-100 hover:bg-gray-50'
                                        }`}
                                    >
                                        <div className={`w-5 h-5 rounded-[6px] border flex items-center justify-center transition-all ${
                                            isSelected 
                                                ? 'border-red-500 bg-red-500 text-white' 
                                                : 'border-gray-300 bg-white'
                                        }`}>
                                            {isSelected && <FiCheck size={14} strokeWidth={3} />}
                                        </div>
                                        <span className={`text-sm font-medium ${isSelected ? 'text-red-900' : 'text-gray-700'}`}>
                                            {reason}
                                        </span>
                                    </label>
                                );
                            })}
                        </div>

                        <div className="flex gap-3 pt-2 border-t border-gray-50">
                            <button
                                onClick={() => setShowCancelModal(false)}
                                className="flex-1 py-3.5 px-4 bg-gray-50 text-gray-700 font-bold rounded-xl hover:bg-gray-100 transition-all text-sm"
                            >
                                No, keep it
                            </button>
                            <button
                                onClick={confirmCancelOrder}
                                disabled={cancelReasons.length === 0 || cancelling}
                                className={`flex-1 py-3.5 px-4 font-bold rounded-xl transition-all text-sm shadow-sm ${
                                    cancelReasons.length === 0 
                                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                                        : 'bg-red-500 text-white hover:bg-red-600'
                                }`}
                            >
                                {cancelling ? 'Cancelling...' : 'Yes, cancel'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Refund Confirmation Modal */}
            {showRefundModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-[32px] p-6 md:p-8 max-w-sm w-full shadow-2xl animate-in zoom-in-95 duration-200">
                        <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <FiRotateCcw className="text-indigo-500 w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 text-center mb-2">Initiate Refund</h3>
                        <p className="text-gray-500 text-center text-[15px] font-medium mb-8">
                            Do you want to initiate a refund for this cancelled order?
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowRefundModal(false)}
                                className="flex-1 py-3.5 px-4 bg-gray-50 text-gray-700 font-bold rounded-xl hover:bg-gray-100 transition-all text-sm"
                            >
                                No, Cancel
                            </button>
                            <button
                                onClick={handleRefundRequest}
                                disabled={cancelling}
                                className={`flex-1 py-3.5 px-4 font-bold rounded-xl transition-all text-sm shadow-sm ${
                                    cancelling 
                                        ? 'bg-indigo-300 text-white cursor-not-allowed' 
                                        : 'bg-indigo-500 text-white hover:bg-indigo-600'
                                }`}
                            >
                                {cancelling ? 'Initiating...' : 'Yes, Initiate'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Address Edit Modal */}
            {showAddressModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto">
                    <div className="bg-white rounded-[32px] p-6 md:p-8 max-w-lg w-full shadow-2xl my-8">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold text-gray-900">Edit Shipping Address</h3>
                            <button
                                onClick={() => setShowAddressModal(false)}
                                className="w-8 h-8 flex items-center justify-center bg-gray-50 rounded-full text-gray-500 hover:bg-gray-100 transition-all"
                            >
                                <FiXCircle size={20} />
                            </button>
                        </div>

                        <div className="mb-6">
                            <p className="text-sm font-bold text-gray-900 mb-3">Saved Addresses</p>
                            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                                {[...Array(5)].map((_, idx) => {
                                    const rawAddr = user?.addresses?.[idx] || {};
                                    const isEmpty = !rawAddr.address && !rawAddr.firstName && !rawAddr.phone;
                                    
                                    return (
                                        <button
                                            key={idx}
                                            type="button"
                                            onClick={() => {
                                                setActiveSlot(idx);
                                                setAddressForm({
                                                    fullName: isEmpty ? '' : `${rawAddr.firstName || ''} ${rawAddr.lastName || ''}`.trim(),
                                                    phone: rawAddr.phone || '',
                                                    address: rawAddr.address || '',
                                                    city: rawAddr.city || '',
                                                    state: rawAddr.state || '',
                                                    postalCode: rawAddr.postalCode || ''
                                                });
                                            }}
                                            className={`flex-shrink-0 w-[200px] text-left p-4 rounded-xl border transition-all relative flex flex-col justify-center min-h-[80px] group
                                                ${activeSlot === idx 
                                                    ? 'bg-[#53C1CC]/10 border-[#53C1CC] shadow-sm' 
                                                    : 'bg-white border-gray-100 hover:border-gray-300 hover:bg-gray-50'}`}
                                        >
                                            <div className="flex items-center justify-between mb-1.5">
                                                <span className={`text-[10px] font-black uppercase tracking-widest ${activeSlot === idx ? 'text-[#53C1CC]' : 'text-gray-400'}`}>
                                                    Slot {idx + 1}
                                                </span>
                                            </div>
                                            {!isEmpty ? (
                                                <>
                                                    <p className={`text-sm font-bold truncate ${activeSlot === idx ? 'text-gray-900' : 'text-gray-700'}`}>
                                                        {rawAddr.firstName || rawAddr.lastName ? `${rawAddr.firstName || ''} ${rawAddr.lastName || ''}`.trim() : `Slot ${idx + 1}`}
                                                    </p>
                                                    <p className="text-[11px] font-medium text-gray-500 truncate mt-0.5">{rawAddr.address}</p>
                                                </>
                                            ) : (
                                                <p className="text-sm font-bold text-gray-400">Empty</p>
                                            )}

                                            {activeSlot === idx && (
                                                <div className="absolute top-0 right-0 w-6 h-6 bg-[#53C1CC] text-white flex items-center justify-center rounded-bl-xl rounded-tr-xl scale-90 -mr-px -mt-px">
                                                    <div className="w-1 h-1 rounded-full bg-white animate-pulse" />
                                                </div>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        <form onSubmit={handleAddressSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1">Full Name</label>
                                    <input
                                        type="text"
                                        required
                                        value={addressForm.fullName}
                                        onChange={(e) => setAddressForm({ ...addressForm, fullName: e.target.value })}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#53C1CC]/20 focus:border-[#53C1CC] outline-none transition-all text-sm font-medium"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1">Phone Number</label>
                                    <input
                                        type="tel"
                                        required
                                        value={addressForm.phone}
                                        onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#53C1CC]/20 focus:border-[#53C1CC] outline-none transition-all text-sm font-medium"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1">Street Address</label>
                                <input
                                    type="text"
                                    required
                                    value={addressForm.address}
                                    onChange={(e) => setAddressForm({ ...addressForm, address: e.target.value })}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#53C1CC]/20 focus:border-[#53C1CC] outline-none transition-all text-sm font-medium"
                                />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1">City</label>
                                    <input
                                        type="text"
                                        required
                                        value={addressForm.city}
                                        onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#53C1CC]/20 focus:border-[#53C1CC] outline-none transition-all text-sm font-medium"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1">State</label>
                                    <input
                                        type="text"
                                        value={addressForm.state}
                                        onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#53C1CC]/20 focus:border-[#53C1CC] outline-none transition-all text-sm font-medium"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1">Zip Code</label>
                                    <input
                                        type="text"
                                        required
                                        value={addressForm.postalCode}
                                        onChange={(e) => setAddressForm({ ...addressForm, postalCode: e.target.value })}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#53C1CC]/20 focus:border-[#53C1CC] outline-none transition-all text-sm font-medium"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={updatingAddress}
                                className="w-full mt-6 py-3.5 px-4 bg-[#53C1CC] text-white font-bold rounded-xl hover:bg-[#3fb0ba] transition-all text-sm shadow-sm flex items-center justify-center gap-2"
                            >
                                {updatingAddress ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                                        Saving...
                                    </>
                                ) : 'Save Address'}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            <Footer />
        </div>
    );
}

export default OrderDetails;
