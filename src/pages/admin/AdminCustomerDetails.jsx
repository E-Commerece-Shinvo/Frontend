import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
    FiArrowLeft, FiMail, FiPhone, FiMapPin, FiCalendar, 
    FiShoppingBag, FiDollarSign, FiClock, FiShield, FiUser,
    FiEdit, FiTrash2, FiSlash, FiCheckCircle
} from 'react-icons/fi';

const AdminCustomerDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    // Mock data for the specific customer
    const customer = {
        id: id,
        name: 'Muzamil Hussain',
        email: 'muzamil@example.com',
        phone: '+92 300 1234567',
        status: 'Active',
        joinedDate: 'January 15, 2024',
        lastLogin: '2 hours ago',
        totalOrders: 12,
        totalSpent: 'Rs. 45,000',
        avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=200',
        address: {
            street: '123 Tech Avenue, Phase 5',
            city: 'Lahore',
            state: 'Punjab',
            country: 'Pakistan',
            postalCode: '54000'
        },
        orderHistory: [
            { id: 'ORD-8821', date: '2024-03-10', amount: 'Rs. 12,500', status: 'Delivered' },
            { id: 'ORD-7742', date: '2024-02-25', amount: 'Rs. 8,200', status: 'Shipped' },
            { id: 'ORD-6631', date: '2024-02-10', amount: 'Rs. 5,000', status: 'Delivered' },
            { id: 'ORD-5520', date: '2024-01-20', amount: 'Rs. 19,300', status: 'Cancelled' }
        ]
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-12">
            {/* Header / Back Button */}
            <div className="flex items-center justify-between">
                <button 
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-gray-500 hover:text-cyan-600 font-bold transition-colors group"
                >
                    <div className="p-2 rounded-xl bg-white border border-gray-100 shadow-sm group-hover:border-cyan-200 transition-all">
                        <FiArrowLeft />
                    </div>
                    Back to Customers
                </button>
                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 bg-white border border-gray-200 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest text-gray-600 hover:bg-gray-50 transition-all shadow-sm">
                        <FiEdit /> Edit
                    </button>
                    <button className="flex items-center gap-2 bg-red-50 border border-red-100 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest text-red-600 hover:bg-red-100 transition-all shadow-sm">
                        <FiSlash /> Block User
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column - Profile Card */}
                <div className="lg:col-span-1 space-y-8">
                    <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden">
                        <div className="h-32 bg-gradient-to-r from-cyan-400 to-blue-500" />
                        <div className="px-8 pb-8">
                            <div className="relative -mt-16 mb-6">
                                <div className="w-32 h-32 rounded-[40px] bg-white p-2 shadow-xl border border-gray-100 overflow-hidden">
                                    <img src={customer.avatar} alt={customer.name} className="w-full h-full object-cover rounded-[32px]" />
                                </div>
                                <div className="absolute bottom-2 right-0 w-8 h-8 bg-green-500 border-4 border-white rounded-full" />
                            </div>
                            
                            <h2 className="text-2xl font-black text-gray-900 leading-tight">{customer.name}</h2>
                            <p className="text-gray-400 font-medium mb-6">Customer ID: #{customer.id}</p>
                            
                            <div className="space-y-4">
                                <div className="flex items-center gap-3 p-3 rounded-2xl bg-gray-50 border border-gray-100">
                                    <div className="w-10 h-10 rounded-xl bg-cyan-100 text-cyan-600 flex items-center justify-center">
                                        <FiMail />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Email Address</p>
                                        <p className="text-sm font-bold text-gray-800 truncate">{customer.email}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 p-3 rounded-2xl bg-gray-50 border border-gray-100">
                                    <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
                                        <FiPhone />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Phone Number</p>
                                        <p className="text-sm font-bold text-gray-800">{customer.phone}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm p-8 space-y-6">
                        <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                            <span className="w-1 h-4 bg-cyan-400 rounded-full" />
                            Engagement Summary
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 rounded-3xl bg-cyan-50 border border-cyan-100">
                                <p className="text-[10px] font-black text-cyan-600 uppercase tracking-widest mb-1">Total Orders</p>
                                <p className="text-xl font-black text-gray-900">{customer.totalOrders}</p>
                            </div>
                            <div className="p-4 rounded-3xl bg-blue-50 border border-blue-100">
                                <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-1">Total Spent</p>
                                <p className="text-xl font-black text-gray-900">{customer.totalSpent.split(' ')[1]}</p>
                            </div>
                        </div>
                        <div className="space-y-4 pt-4 border-t border-gray-50">
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-500 font-bold">Joined On:</span>
                                <span className="text-sm text-gray-900 font-black">{customer.joinedDate}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-500 font-bold">Account Status:</span>
                                <span className="px-3 py-1 bg-green-50 text-green-600 text-[10px] font-black rounded-full uppercase tracking-widest border border-green-100">
                                    {customer.status}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column - Address & Orders */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Shipping Address */}
                    <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm p-8">
                        <h3 className="text-lg font-black text-gray-900 mb-6 flex items-center gap-2">
                            <FiMapPin className="text-cyan-500" />
                            Primary Shipping Address
                        </h3>
                        <div className="p-6 rounded-[24px] bg-gray-50 border border-gray-100 flex items-start gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-white border border-gray-200 flex items-center justify-center text-gray-400">
                                <FiMapPin size={24} />
                            </div>
                            <div>
                                <p className="text-lg font-bold text-gray-900">{customer.address.street}</p>
                                <p className="text-gray-500 font-medium">
                                    {customer.address.city}, {customer.address.state} {customer.address.postalCode}
                                </p>
                                <p className="text-gray-500 font-medium">{customer.address.country}</p>
                            </div>
                        </div>
                    </div>

                    {/* Recent Orders */}
                    <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden">
                        <div className="p-8 border-b border-gray-50 flex items-center justify-between">
                            <h3 className="text-lg font-black text-gray-900 flex items-center gap-2">
                                <FiShoppingBag className="text-cyan-500" />
                                Order History
                            </h3>
                            <button className="text-sm font-bold text-cyan-600 hover:underline">View All Orders</button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-gray-50/50">
                                        <th className="px-8 py-4 text-[11px] font-black text-gray-400 uppercase tracking-widest">Order ID</th>
                                        <th className="px-8 py-4 text-[11px] font-black text-gray-400 uppercase tracking-widest">Date</th>
                                        <th className="px-8 py-4 text-[11px] font-black text-gray-400 uppercase tracking-widest">Amount</th>
                                        <th className="px-8 py-4 text-[11px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {customer.orderHistory.map((order) => (
                                        <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-8 py-5 font-black text-gray-900">{order.id}</td>
                                            <td className="px-8 py-5 text-sm text-gray-500 font-bold">{order.date}</td>
                                            <td className="px-8 py-5 text-sm text-gray-900 font-black">{order.amount}</td>
                                            <td className="px-8 py-5">
                                                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                                                    order.status === 'Delivered' ? 'bg-green-50 text-green-600' :
                                                    order.status === 'Cancelled' ? 'bg-red-50 text-red-600' :
                                                    'bg-blue-50 text-blue-600'
                                                }`}>
                                                    {order.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminCustomerDetails;
