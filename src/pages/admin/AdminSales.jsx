import React, { useState, useEffect, useMemo } from 'react';
import { 
    FiTrendingUp, FiDollarSign, FiShoppingBag, 
    FiUserCheck, FiCalendar, FiArrowUpRight,
    FiArrowDownRight, FiPieChart, FiActivity,
    FiDownload, FiFilter
} from 'react-icons/fi';
import { getAllOrders } from '../../api/orders';
import toast from 'react-hot-toast';

const AdminSales = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [timeRange, setTimeRange] = useState('all'); // all, month, week

    useEffect(() => {
        fetchSalesData();
    }, []);

    const fetchSalesData = async () => {
        setLoading(true);
        try {
            const data = await getAllOrders();
            setOrders(data || []);
        } catch (error) {
            console.error("Failed to fetch sales data:", error);
            toast.error("Failed to load sales analytics");
        } finally {
            setLoading(false);
        }
    };

    // Calculate Sales Stats
    const salesStats = useMemo(() => {
        const completedOrders = orders.filter(o => o.status === 'delivered');
        const totalRevenue = completedOrders.reduce((sum, o) => sum + o.totalAmount, 0);
        const avgOrderValue = completedOrders.length > 0 ? totalRevenue / completedOrders.length : 0;
        
        // Mocking growth percentages for visual appeal
        return {
            revenue: totalRevenue,
            totalOrders: orders.length,
            completedOrders: completedOrders.length,
            aov: avgOrderValue,
            growth: 12.5,
            orderGrowth: 8.2
        };
    }, [orders]);

    // Grouping sales for a simple chart (Mocking 7 days trend)
    const trendData = [
        { day: 'Mon', value: 45000 },
        { day: 'Tue', value: 52000 },
        { day: 'Wed', value: 48000 },
        { day: 'Thu', value: 61000 },
        { day: 'Fri', value: 55000 },
        { day: 'Sat', value: 67000 },
        { day: 'Sun', value: 72000 },
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Header Section */}
            <div className="bg-white p-6 md:p-8 rounded-[32px] shadow-sm border border-gray-50 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-2xl md:text-3xl font-black tracking-tight text-gray-900">Sales Analytics</h1>
                    <p className="text-gray-400 text-[10px] md:text-sm font-medium mt-1 uppercase tracking-widest flex items-center gap-2">
                        Revenue & Growth <span className="w-1 h-1 bg-gray-300 rounded-full"></span> Real-time Data
                    </p>
                </div>
                <div className="flex items-center gap-3 w-full md:w-auto">
                    <div className="flex bg-gray-50 p-1.5 rounded-2xl">
                        {['all', 'month', 'week'].map((t) => (
                            <button
                                key={t}
                                onClick={() => setTimeRange(t)}
                                className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                                    timeRange === t 
                                    ? 'bg-[#001B1B] text-white shadow-lg' 
                                    : 'text-gray-400 hover:text-gray-600'
                                }`}
                            >
                                {t}
                            </button>
                        ))}
                    </div>
                    <button className="p-3.5 bg-white border border-gray-100 rounded-2xl text-gray-400 hover:text-gray-900 transition-all shadow-sm">
                        <FiDownload />
                    </button>
                </div>
            </div>

            {/* Primary Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <SalesCard 
                    label="Total Revenue" 
                    value={`Rs. ${salesStats.revenue.toLocaleString()}`} 
                    icon={<FiDollarSign />} 
                    color="bg-cyan-500"
                    trend="+12.5%"
                    isUp={true}
                />
                <SalesCard 
                    label="Total Orders" 
                    value={salesStats.totalOrders} 
                    icon={<FiShoppingBag />} 
                    color="bg-[#001B1B]"
                    trend="+8.2%"
                    isUp={true}
                />
                <SalesCard 
                    label="Avg. Order Value" 
                    value={`Rs. ${Math.round(salesStats.aov).toLocaleString()}`} 
                    icon={<FiActivity />} 
                    color="bg-teal-500"
                    trend="-2.1%"
                    isUp={false}
                />
                <SalesCard 
                    label="Conversion Rate" 
                    value="3.24%" 
                    icon={<FiTrendingUp />} 
                    color="bg-purple-500"
                    trend="+1.4%"
                    isUp={true}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Sales Chart Container */}
                <div className="lg:col-span-2 bg-white rounded-[40px] p-6 md:p-8 pb-12 shadow-sm border border-gray-50 flex flex-col gap-8">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                            <h3 className="text-xl font-bold text-gray-900">Revenue Performance</h3>
                            <p className="text-[10px] md:text-xs text-gray-400 font-medium uppercase tracking-widest mt-1">Daily sales trend this week</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="w-3 h-3 bg-cyan-500 rounded-full"></span>
                            <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Revenue</span>
                        </div>
                    </div>

                    {/* Custom SVG Line Chart */}
                    <div className="w-full relative group mt-4">
                        <div className="h-48 md:h-64 w-full">
                            <svg className="w-full h-full overflow-visible" viewBox="0 0 700 200" preserveAspectRatio="none">
                                {/* Grid Lines */}
                                {[0, 50, 100, 150, 200].map((y) => (
                                    <line key={y} x1="0" y1={y} x2="700" y2={y} stroke="#f3f4f6" strokeWidth="1" />
                                ))}
                                
                                {/* The Path */}
                                <path 
                                    d="M 0 150 C 100 130, 200 140, 300 80 S 500 100, 600 40 L 700 20" 
                                    fill="none" 
                                    stroke="#06b6d4" 
                                    strokeWidth="4" 
                                    strokeLinecap="round" 
                                    className="drop-shadow-lg"
                                />
                                
                                {/* Area Fill */}
                                <path 
                                    d="M 0 150 C 100 130, 200 140, 300 80 S 500 100, 600 40 L 700 20 V 200 H 0 Z" 
                                    fill="url(#salesGradient)" 
                                    opacity="0.1"
                                />
                                
                                <defs>
                                    <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#06b6d4" />
                                        <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
                                    </linearGradient>
                                </defs>
                            </svg>
                        </div>
                        
                        {/* X-Axis Labels */}
                        <div className="flex justify-between mt-8 px-1">
                            {trendData.map((d, i) => (
                                <span key={i} className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{d.day}</span>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Sales Breakdown / Top Categories */}
                <div className="bg-white rounded-[40px] p-6 md:p-8 shadow-sm border border-gray-50 flex flex-col gap-8">
                    <div>
                        <h3 className="text-xl font-bold text-gray-900">Category Sales</h3>
                        <p className="text-xs text-gray-400 font-medium uppercase tracking-widest mt-1">Revenue distribution</p>
                    </div>

                    <div className="space-y-6">
                        {[
                            { name: 'Face Care', value: 75, color: 'bg-cyan-500', amount: 'Rs. 124k' },
                            { name: 'Hair Care', value: 58, color: 'bg-[#001B1B]', amount: 'Rs. 89k' },
                            { name: 'Lipsticks', value: 42, color: 'bg-teal-500', amount: 'Rs. 45k' },
                            { name: 'Perfumes', value: 30, color: 'bg-purple-500', amount: 'Rs. 28k' },
                        ].map((cat, i) => (
                            <div key={i} className="space-y-3">
                                <div className="flex justify-between items-end">
                                    <span className="text-[11px] font-black text-gray-900 uppercase tracking-widest">{cat.name}</span>
                                    <span className="text-[10px] font-bold text-gray-400">{cat.amount}</span>
                                </div>
                                <div className="w-full h-2 bg-gray-50 rounded-full overflow-hidden">
                                    <div 
                                        className={`h-full rounded-full ${cat.color} transition-all duration-1000`} 
                                        style={{ width: `${cat.value}%` }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-auto p-6 bg-gray-50 rounded-3xl flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center text-cyan-500 shadow-sm">
                                <FiPieChart />
                            </div>
                            <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Total Share</span>
                        </div>
                        <span className="text-sm font-black text-gray-900">100%</span>
                    </div>
                </div>
            </div>

            {/* Recent High-Value Orders */}
            <div className="bg-white rounded-[40px] shadow-sm border border-gray-50 overflow-hidden">
                <div className="p-6 md:p-8 border-b border-gray-50 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-2 h-8 bg-cyan-500 rounded-full"></div>
                        <h3 className="text-lg md:text-xl font-bold text-gray-900">Latest Sales Performance</h3>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full min-w-[800px]">
                        <thead>
                            <tr className="bg-gray-50/50 text-[11px] text-gray-400 uppercase tracking-[0.2em] font-black">
                                <th className="px-8 py-5 text-left">Order ID</th>
                                <th className="px-8 py-5 text-left">Customer</th>
                                <th className="px-8 py-5 text-left">Date</th>
                                <th className="px-8 py-5 text-left">Amount</th>
                                <th className="px-8 py-5 text-center">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {orders.slice(0, 5).map((order) => (
                                <tr key={order._id} className="group hover:bg-gray-50/50 transition-all">
                                    <td className="px-8 py-6">
                                        <span className="text-sm font-black text-gray-900">#{order._id.slice(-6).toUpperCase()}</span>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-[10px] font-bold text-gray-400 uppercase">
                                                {order.shippingAddress.fullName.charAt(0)}
                                            </div>
                                            <span className="text-sm font-bold text-gray-700">{order.shippingAddress.fullName}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-sm text-gray-400 font-medium">
                                        {new Date(order.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className="text-sm font-black text-cyan-600">Rs. {order.totalAmount.toLocaleString()}</span>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex justify-center">
                                            <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-[0.1em] ${
                                                order.status === 'delivered' ? 'bg-green-50 text-green-600 border border-green-100' :
                                                order.status === 'cancelled' ? 'bg-red-50 text-red-600 border border-red-100' :
                                                'bg-cyan-50 text-cyan-600 border border-cyan-100'
                                            }`}>
                                                {order.status}
                                            </span>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

const SalesCard = ({ label, value, icon, color, trend, isUp }) => (
    <div className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-50 flex flex-col gap-6 group hover:shadow-xl transition-all">
        <div className="flex justify-between items-start">
            <div className={`w-14 h-14 rounded-2xl ${color} text-white flex items-center justify-center text-2xl shadow-xl transition-transform group-hover:scale-110`}>
                {icon}
            </div>
            <div className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-[10px] font-black ${isUp ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                {isUp ? <FiArrowUpRight /> : <FiArrowDownRight />} {trend}
            </div>
        </div>
        <div>
            <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-1">{label}</p>
            <h4 className="text-2xl font-black text-gray-900 tracking-tight">{value}</h4>
        </div>
    </div>
);

export default AdminSales;
