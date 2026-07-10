import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    FiArrowLeft, FiMail, FiPhone, FiMapPin, FiCalendar,
    FiShoppingBag, FiDollarSign, FiClock, FiShield, FiUser,
    FiEdit, FiTrash2, FiSlash, FiCheckCircle, FiAlertTriangle, FiX, FiSave,
    FiExternalLink, FiPackage, FiTruck, FiInfo, FiCamera, FiMoreVertical
} from 'react-icons/fi';
import { toggleUserBlock, getUserById, updateUser } from '../../api/users';
import { getOrdersByUserId } from '../../api/orders';
import { uploadImage } from '../../api/auth';
import toast from 'react-hot-toast';

const AdminCustomerDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [customer, setCustomer] = useState(null);
    const [orders, setOrders] = useState([]);
    const [isBlocked, setIsBlocked] = useState(false);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);

    // Address Management State
    const [activeAddressSlot, setActiveAddressSlot] = useState(1);
    const [savedAddresses, setSavedAddresses] = useState(
        Array.from({ length: 5 }, (_, i) => ({
            id: i + 1,
            firstName: '',
            lastName: '',
            country: 'Pakistan',
            state: '',
            city: '',
            postalCode: '',
            address: '',
            phone: '',
            isDefault: i === 0
        }))
    );

    // Modals
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showMobileMenu, setShowMobileMenu] = useState(false);

    // Edit Form State (Main Profile)
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        phone: '',
        role: 'user',
        profileImage: ''
    });

    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef(null);

    useEffect(() => {
        fetchData();
    }, [id]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [userData, userOrders] = await Promise.all([
                getUserById(id),
                getOrdersByUserId(id)
            ]);

            setCustomer({
                ...userData,
                joinedDate: new Date(userData.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
                totalSpent: userOrders.reduce((acc, o) => o.status !== 'cancelled' ? acc + o.totalAmount : acc, 0),
                totalOrders: userOrders.length,
                avatar: userData.profileImage || `https://ui-avatars.com/api/?name=${userData.username}&background=random`
            });

            setOrders(userOrders);
            setIsBlocked(userData.isBlocked);

            setFormData({
                username: userData.username,
                email: userData.email,
                phone: userData.phone || '',
                role: userData.role || 'user',
                profileImage: userData.profileImage || ''
            });

            // Map saved addresses from backend if they exist
            if (userData.addresses && userData.addresses.length > 0) {
                const mapped = Array.from({ length: 5 }, (_, i) => {
                    const existing = userData.addresses[i];
                    return {
                        id: i + 1,
                        firstName: existing?.firstName || '',
                        lastName: existing?.lastName || '',
                        country: existing?.country || 'Pakistan',
                        state: existing?.state || '',
                        city: existing?.city || '',
                        postalCode: existing?.postalCode || '',
                        address: existing?.address || '',
                        phone: existing?.phone || '',
                        isDefault: existing?.isDefault || (i === 0)
                    };
                });
                setSavedAddresses(mapped);
            }
        } catch (error) {
            toast.error('Failed to fetch customer data');
            navigate('/admin/customers');
        } finally {
            setLoading(false);
        }
    };

    const handleSwitchAddress = (slotId) => {
        setActiveAddressSlot(slotId);
    };

    const handleAddressFieldChange = (field, value) => {
        setSavedAddresses(prev => prev.map(addr =>
            addr.id === activeAddressSlot ? { ...addr, [field]: value } : addr
        ));
    };

    const handleSaveAddresses = async (e) => {
        e.preventDefault();
        try {
            setActionLoading(true);
            // Filter out completely empty slots if desired, but here we save all 5
            await updateUser(id, { addresses: savedAddresses });
            toast.success(`Addresses updated for ${customer.username}`);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to save addresses');
        } finally {
            setActionLoading(false);
        }
    };

    const handleToggleBlock = async () => {
        try {
            setActionLoading(true);
            const response = await toggleUserBlock(id);
            setIsBlocked(response.isBlocked);
            toast.success(response.message);
            setShowConfirmModal(false);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update block status');
        } finally {
            setActionLoading(false);
        }
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        try {
            setActionLoading(true);
            const updated = await updateUser(id, formData);
            setCustomer(prev => ({
                ...prev,
                ...updated,
                avatar: updated.profileImage || `https://ui-avatars.com/api/?name=${updated.username}&background=random`
            }));
            toast.success('Profile updated successfully!');
            setShowEditModal(false);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update profile');
        } finally {
            setActionLoading(false);
        }
    };

    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            const uploadToastId = toast.loading('Uploading profile picture...');
            setIsUploading(true);
            try {
                const uploadData = await uploadImage(file);
                const imageUrl = uploadData.url;
                setFormData(prev => ({ ...prev, profileImage: imageUrl }));
                toast.success('Image uploaded successfully! Remember to save profile info.', { id: uploadToastId });
            } catch (err) {
                console.error('Image Upload Error:', err);
                toast.error(err.response?.data?.message || 'Failed to upload image', { id: uploadToastId });
            } finally {
                setIsUploading(false);
            }
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-400"></div>
                <p className="text-gray-500 font-bold">Synchronizing Customer Data...</p>
            </div>
        );
    }

    const currentAddr = savedAddresses.find(a => a.id === activeAddressSlot);

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-20">
            {/* Edit Profile Modal */}
            {showEditModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowEditModal(false)}></div>
                    <div className="relative bg-white w-full max-w-xl rounded-[32px] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
                        <div className="p-8">
                            <div className="flex justify-between items-center mb-8">
                                <h3 className="text-2xl font-black text-gray-900 uppercase tracking-tight">Edit Basic Info</h3>
                                <button onClick={() => setShowEditModal(false)} className="p-2 hover:bg-gray-50 rounded-xl transition-colors">
                                    <FiX className="text-gray-400" size={24} />
                                </button>
                            </div>

                            <form onSubmit={handleUpdateProfile} className="space-y-6">
                                <div className="flex flex-col items-center justify-center mb-6">
                                    <div className="relative group">
                                        <div className="w-24 h-24 rounded-[28px] bg-white p-1.5 shadow-md border border-gray-100 overflow-hidden">
                                            <img
                                                src={formData.profileImage || `https://ui-avatars.com/api/?name=${formData.username}&background=random`}
                                                alt="Customer Profile"
                                                className="w-full h-full object-cover rounded-[22px]"
                                            />
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => fileInputRef.current.click()}
                                            className="absolute -bottom-2 -right-2 p-2 bg-white text-[#006060] rounded-xl shadow-md border border-gray-100 hover:bg-gray-50 transition-all transform hover:scale-110 active:scale-95"
                                        >
                                            <FiCamera size={16} />
                                        </button>
                                    </div>
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        onChange={handleImageChange}
                                        accept="image/*"
                                        className="hidden"
                                    />
                                    {isUploading && (
                                        <span className="text-[10px] text-cyan-600 font-bold mt-2 animate-pulse">Uploading Image...</span>
                                    )}
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Username</label>
                                        <input type="text" value={formData.username} onChange={(e) => setFormData({ ...formData, username: e.target.value })} className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:border-cyan-500 font-bold" required />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Email</label>
                                        <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:border-cyan-500 font-bold" required />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Phone</label>
                                        <input type="text" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:border-cyan-500 font-bold" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Role</label>
                                        <select value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })} className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:border-cyan-500 font-bold appearance-none">
                                            <option value="user">User</option>
                                            <option value="admin">Admin</option>
                                        </select>
                                    </div>
                                </div>
                                <button type="submit" disabled={actionLoading} className="w-full py-5 bg-gradient-to-r from-[#001B1B] to-[#006060] text-white font-black rounded-[24px] uppercase tracking-widest text-sm shadow-xl active:scale-95 transition-all flex items-center justify-center gap-2">
                                    {actionLoading ? 'Saving...' : <><FiSave /> Save Profile Info</>}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Block Confirmation Modal */}
            {showConfirmModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowConfirmModal(false)}></div>
                    <div className="relative bg-white w-full max-w-md rounded-[32px] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
                        <div className="p-8 text-center">
                            <div className={`w-16 h-16 rounded-3xl mx-auto flex items-center justify-center mb-6 ${isBlocked ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                                {isBlocked ? <FiCheckCircle size={32} /> : <FiAlertTriangle size={32} />}
                            </div>
                            <h3 className="text-2xl font-black text-gray-900 mb-2 uppercase tracking-tight">{isBlocked ? 'Unblock User?' : 'Block User?'}</h3>
                            <p className="text-gray-500 font-medium mb-8 leading-relaxed">Are you sure you want to {isBlocked ? 'unblock' : 'block'} this customer? This action will affect their ability to log in.</p>
                            <div className="flex gap-3">
                                <button onClick={() => setShowConfirmModal(false)} className="flex-1 py-4 bg-gray-50 text-gray-600 font-black rounded-2xl uppercase tracking-widest text-[10px]">Cancel</button>
                                <button onClick={handleToggleBlock} disabled={actionLoading} className={`flex-1 py-4 text-white font-black rounded-2xl uppercase tracking-widest text-[10px] ${isBlocked ? 'bg-green-600' : 'bg-red-600'}`}>
                                    {isBlocked ? 'Unblock' : 'Block'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Top Navigation */}
            <div className="flex items-center justify-between relative">
                <button onClick={() => navigate(-1)} className="flex items-center gap-3 px-4 py-2.5 bg-white border border-gray-200 hover:border-cyan-400 text-gray-600 hover:text-cyan-600 rounded-xl font-black uppercase tracking-widest text-[10px] sm:text-xs shadow-sm hover:shadow-md transition-all active:scale-95">
                    <FiArrowLeft className="text-sm sm:text-base" />
                    <span>Back to Customers</span>
                </button>

                {/* Desktop Buttons */}
                <div className="hidden sm:flex items-center gap-3">
                    <button onClick={() => setShowEditModal(true)} className="flex items-center justify-center gap-2 bg-[#004d4d] text-white px-6 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg active:scale-95 transition-all hover:bg-[#003333]">
                        <FiEdit className="text-sm" /> <span>Edit Profile</span>
                    </button>
                    <button onClick={() => setShowConfirmModal(true)} className={`flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-sm transition-all border ${isBlocked ? 'bg-green-50 text-green-600 border-green-100' : 'bg-red-50 text-red-600 border-red-100'}`}>
                        {isBlocked ? <><FiCheckCircle className="text-sm" /> <span>Unblock</span></> : <><FiSlash className="text-sm" /> <span>Block</span></>}
                    </button>
                </div>

                {/* Mobile Dropdown */}
                <div className="sm:hidden relative">
                    <button
                        onClick={() => setShowMobileMenu(!showMobileMenu)}
                        className="p-3 bg-white border border-gray-100 rounded-xl shadow-sm hover:bg-gray-50 transition-colors"
                    >
                        <FiMoreVertical className="text-gray-600 text-lg" />
                    </button>

                    {showMobileMenu && (
                        <>
                            <div className="fixed inset-0 z-40" onClick={() => setShowMobileMenu(false)}></div>
                            <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                                <button
                                    onClick={() => { setShowEditModal(true); setShowMobileMenu(false); }}
                                    className="w-full flex items-center gap-3 px-4 py-4 text-left text-xs font-black text-gray-700 hover:bg-gray-50 transition-colors uppercase tracking-widest border-b border-gray-50"
                                >
                                    <FiEdit className="text-cyan-600 text-sm" /> Edit Profile
                                </button>
                                <button
                                    onClick={() => { setShowConfirmModal(true); setShowMobileMenu(false); }}
                                    className="w-full flex items-center gap-3 px-4 py-4 text-left text-xs font-black transition-colors uppercase tracking-widest hover:bg-gray-50"
                                >
                                    {isBlocked ? (
                                        <><FiCheckCircle className="text-green-500 text-sm" /> <span className="text-green-600">Unblock User</span></>
                                    ) : (
                                        <><FiSlash className="text-red-500 text-sm" /> <span className="text-red-600">Block User</span></>
                                    )}
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left: Profile Card */}
                <div className="lg:col-span-1 space-y-8">
                    <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden">
                        <div className="h-32 bg-gradient-to-br from-[#001B1B] via-[#004D4D] to-[#006060]" />
                        <div className="px-8 pb-10">
                            <div className="relative -mt-16 mb-6">
                                <div className="w-32 h-32 rounded-[40px] bg-white p-2 shadow-xl border border-gray-100">
                                    <img src={customer.avatar} className="w-full h-full object-cover rounded-[32px]" />
                                </div>
                                <div className={`absolute bottom-2 right-2 w-6 h-6 border-4 border-white rounded-full ${isBlocked ? 'bg-red-500' : 'bg-green-500'}`} />
                            </div>
                            <h2 className="text-2xl font-black text-gray-900 tracking-tight">{customer.username}</h2>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6">ID: #{id.slice(-6)}</p>

                            <div className="space-y-4">
                                <div className="p-4 rounded-3xl bg-gray-50 border border-gray-100 flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-2xl bg-white shadow-sm flex items-center justify-center text-cyan-600"><FiMail /></div>
                                    <div className="min-w-0">
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Email</p>
                                        <p className="text-sm font-bold text-gray-800 truncate">{customer.email}</p>
                                    </div>
                                </div>
                                <div className="p-4 rounded-3xl bg-gray-50 border border-gray-100 flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-2xl bg-white shadow-sm flex items-center justify-center text-blue-600"><FiPhone /></div>
                                    <div>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Phone</p>
                                        <p className="text-sm font-bold text-gray-800">{customer.phone || 'N/A'}</p>
                                    </div>
                                </div>
                                <div className="p-4 rounded-3xl bg-gray-50 border border-gray-100 flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-2xl bg-white shadow-sm flex items-center justify-center text-purple-600"><FiCalendar /></div>
                                    <div>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Member Since</p>
                                        <p className="text-sm font-bold text-gray-800">{customer.joinedDate}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm p-8 space-y-6">
                        <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest flex items-center gap-2"><FiInfo className="text-cyan-500" /> Summary</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-6 rounded-[32px] bg-cyan-50/50 border border-cyan-100">
                                <p className="text-[9px] font-black text-cyan-600 uppercase tracking-[0.2em] mb-2">Orders</p>
                                <p className="text-2xl font-black text-gray-900">{customer.totalOrders}</p>
                            </div>
                            <div className="p-6 rounded-[32px] bg-blue-50/50 border border-blue-100">
                                <p className="text-[9px] font-black text-blue-600 uppercase tracking-[0.2em] mb-2">Spent</p>
                                <p className="text-2xl font-black text-gray-900">Rs. {customer.totalSpent}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right: Order History & Address Management */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Order History */}
                    <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm p-8">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-lg font-black text-gray-900 uppercase tracking-tight flex items-center gap-3">
                                <div className="w-10 h-10 rounded-2xl bg-cyan-50 text-cyan-600 flex items-center justify-center"><FiShoppingBag /></div>
                                Recent Orders
                            </h3>
                            <button className="text-[10px] font-black text-cyan-600 uppercase tracking-widest hover:underline">View All</button>
                        </div>

                        {orders.length > 0 ? (
                            <div className="space-y-4">
                                {orders.slice(0, 3).map((order) => (
                                    <div key={order._id} className="flex items-center justify-between p-5 rounded-[28px] bg-gray-50 border border-gray-100 hover:border-cyan-200 transition-colors group">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-2xl bg-white border border-gray-200 flex items-center justify-center text-gray-400 group-hover:text-cyan-500 transition-colors">
                                                <FiPackage size={24} />
                                            </div>
                                            <div>
                                                <p className="text-sm font-black text-gray-900 uppercase tracking-tight">#{order._id.slice(-8).toUpperCase()}</p>
                                                <p className="text-[10px] text-gray-400 font-bold">{new Date(order.createdAt).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-black text-gray-900">Rs. {order.totalAmount}</p>
                                            <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${order.status === 'delivered' ? 'bg-green-50 text-green-600' :
                                                order.status === 'pending' ? 'bg-amber-50 text-amber-600' : 'bg-blue-50 text-blue-600'
                                                }`}>
                                                {order.status}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="py-12 text-center bg-gray-50 rounded-[32px] border border-dashed border-gray-200">
                                <FiShoppingBag className="mx-auto text-gray-300 mb-4" size={40} />
                                <p className="text-gray-400 font-bold text-sm uppercase tracking-widest">No orders found yet</p>
                            </div>
                        )}
                    </div>

                    {/* Address Management */}
                    <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm p-8">
                        <div className="flex flex-row items-center justify-between gap-2 sm:gap-4 mb-6 sm:mb-8">
                            <h3 className="text-sm sm:text-lg font-black text-gray-900 uppercase tracking-tight flex items-center gap-2 sm:gap-3 min-w-0">
                                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0"><FiMapPin className="text-xs sm:text-base" /></div>
                                <span className="truncate">Multi-Address Management</span>
                            </h3>
                            <button onClick={handleSaveAddresses} disabled={actionLoading} className="px-3 py-2 sm:px-8 sm:py-3.5 bg-gradient-to-r from-[#001B1B] to-[#006060] text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl hover:shadow-cyan-900/20 transition-all flex items-center justify-center gap-1.5 sm:gap-2 active:scale-95 shrink-0 whitespace-nowrap">
                                <FiSave className="text-sm sm:text-base shrink-0" /> <span className="hidden sm:inline">{actionLoading ? 'Saving...' : 'Save Changes'}</span><span className="sm:hidden">{actionLoading ? 'Saving...' : 'Save'}</span>
                            </button>
                        </div>

                        {/* Slot Selector (Similar to Profile.jsx) */}
                        <div className="grid grid-cols-5 gap-3 mb-10">
                            {savedAddresses.map((addr) => (
                                <button
                                    key={addr.id}
                                    onClick={() => handleSwitchAddress(addr.id)}
                                    className={`p-4 rounded-[24px] border transition-all flex flex-col items-center gap-2 group ${activeAddressSlot === addr.id
                                        ? 'bg-cyan-50 border-cyan-400 shadow-lg shadow-cyan-100'
                                        : 'bg-white border-gray-100 hover:border-gray-200'
                                        }`}
                                >
                                    <div className={`p-2 rounded-xl ${activeAddressSlot === addr.id ? 'bg-cyan-500 text-white' : 'bg-gray-50 text-gray-400 group-hover:text-cyan-500'}`}>
                                        <FiMapPin size={16} />
                                    </div>
                                    <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${activeAddressSlot === addr.id ? 'text-cyan-700' : 'text-gray-400'}`}>Slot {addr.id}</span>
                                    {addr.address && <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse" />}
                                </button>
                            ))}
                        </div>

                        {/* Address Form (Same as udr) */}
                        <div className="p-8 rounded-[32px] bg-gray-50/50 border border-gray-100 animate-in fade-in duration-300">
                            <div className="grid grid-cols-2 gap-6 mb-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">First Name</label>
                                    <input type="text" value={currentAddr.firstName} onChange={(e) => handleAddressFieldChange('firstName', e.target.value)} placeholder="Recipient First Name" className="w-full px-5 py-4 bg-white border border-gray-100 rounded-2xl focus:border-cyan-500 font-bold" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Last Name</label>
                                    <input type="text" value={currentAddr.lastName} onChange={(e) => handleAddressFieldChange('lastName', e.target.value)} placeholder="Recipient Last Name" className="w-full px-5 py-4 bg-white border border-gray-100 rounded-2xl focus:border-cyan-500 font-bold" />
                                </div>
                            </div>
                            <div className="space-y-2 mb-6">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Full Address</label>
                                <input type="text" value={currentAddr.address} onChange={(e) => handleAddressFieldChange('address', e.target.value)} placeholder="House #, Street, Area..." className="w-full px-5 py-4 bg-white border border-gray-100 rounded-2xl focus:border-cyan-500 font-bold" />
                            </div>
                            <div className="grid grid-cols-3 gap-6 mb-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">City</label>
                                    <input type="text" value={currentAddr.city} onChange={(e) => handleAddressFieldChange('city', e.target.value)} placeholder="City" className="w-full px-5 py-4 bg-white border border-gray-100 rounded-2xl focus:border-cyan-500 font-bold" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">State</label>
                                    <input type="text" value={currentAddr.state} onChange={(e) => handleAddressFieldChange('state', e.target.value)} placeholder="Province/State" className="w-full px-5 py-4 bg-white border border-gray-100 rounded-2xl focus:border-cyan-500 font-bold" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Zip Code</label>
                                    <input type="text" value={currentAddr.postalCode} onChange={(e) => handleAddressFieldChange('postalCode', e.target.value)} placeholder="Optional" className="w-full px-5 py-4 bg-white border border-gray-100 rounded-2xl focus:border-cyan-500 font-bold" />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Phone</label>
                                    <input type="text" value={currentAddr.phone} onChange={(e) => handleAddressFieldChange('phone', e.target.value)} placeholder="+92 ..." className="w-full px-5 py-4 bg-white border border-gray-100 rounded-2xl focus:border-cyan-500 font-bold" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Set Default</label>
                                    <button
                                        type="button"
                                        onClick={() => handleAddressFieldChange('isDefault', !currentAddr.isDefault)}
                                        className={`w-full py-4 rounded-2xl border font-black text-[10px] uppercase tracking-widest transition-all shadow-md active:scale-95 ${currentAddr.isDefault
                                            ? 'bg-gradient-to-r from-[#001B1B] to-[#006060] text-white border-transparent shadow-cyan-900/20'
                                            : 'bg-white text-gray-400 border-gray-100 hover:border-cyan-200'
                                            }`}
                                    >
                                        {currentAddr.isDefault ? 'Default Address' : 'Set as Default'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminCustomerDetails;
