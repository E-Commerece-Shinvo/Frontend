import React, { useState, useEffect, useMemo } from 'react';
import {
    FiTrendingUp, FiDollarSign, FiShoppingBag,
    FiUserCheck, FiCalendar, FiArrowUpRight,
    FiArrowDownRight, FiPieChart, FiActivity,
    FiDownload, FiFilter
} from 'react-icons/fi';
import { getAllOrders } from '../../api/orders';
import { getAllUsers } from '../../api/users';
import toast from 'react-hot-toast';

const AdminSales = () => {
    const [orders, setOrders] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [timeRange, setTimeRange] = useState('all'); // all, month, week

    useEffect(() => {
        fetchSalesData();
    }, []);

    const fetchSalesData = async () => {
        setLoading(true);
        try {
            const [ordersData, usersData] = await Promise.all([
                getAllOrders(),
                getAllUsers()
            ]);
            setOrders(ordersData || []);
            setUsers(usersData || []);
        } catch (error) {
            console.error("Failed to fetch sales data:", error);
            toast.error("Failed to load sales analytics");
        } finally {
            setLoading(false);
        }
    };

    // Calculate Sales Stats
    const salesStats = useMemo(() => {
        const now = new Date();
        let currentOrders = [];
        let prevOrders = [];

        if (timeRange === 'week') {
            const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            const fourteenDaysAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

            currentOrders = orders.filter(o => new Date(o.createdAt) >= sevenDaysAgo);
            prevOrders = orders.filter(o => {
                const d = new Date(o.createdAt);
                return d >= fourteenDaysAgo && d < sevenDaysAgo;
            });
        } else if (timeRange === 'month') {
            const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
            const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);

            currentOrders = orders.filter(o => new Date(o.createdAt) >= thirtyDaysAgo);
            prevOrders = orders.filter(o => {
                const d = new Date(o.createdAt);
                return d >= sixtyDaysAgo && d < thirtyDaysAgo;
            });
        } else {
            // 'all'
            const sorted = [...orders].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
            const mid = Math.floor(sorted.length / 2);
            prevOrders = sorted.slice(0, mid);
            currentOrders = sorted.slice(mid);
        }

        const currentCompleted = currentOrders.filter(o => o.status === 'delivered');
        const prevCompleted = prevOrders.filter(o => o.status === 'delivered');

        const currentRevenue = currentCompleted.reduce((sum, o) => sum + o.totalAmount, 0);
        const prevRevenue = prevCompleted.reduce((sum, o) => sum + o.totalAmount, 0);

        const currentAOV = currentCompleted.length > 0 ? currentRevenue / currentCompleted.length : 0;
        const prevAOV = prevCompleted.length > 0 ? prevRevenue / prevCompleted.length : 0;

        const totalUsers = Math.max(users.length, 1);
        const currentConv = (currentOrders.length / totalUsers) * 100;
        const prevConv = (prevOrders.length / totalUsers) * 100;

        const revenueGrowth = prevRevenue > 0 ? ((currentRevenue - prevRevenue) / prevRevenue) * 100 : (currentRevenue > 0 ? 100 : 0);
        const ordersGrowth = prevOrders.length > 0 ? ((currentOrders.length - prevOrders.length) / prevOrders.length) * 100 : (currentOrders.length > 0 ? 100 : 0);
        const aovGrowth = prevAOV > 0 ? ((currentAOV - prevAOV) / prevAOV) * 100 : (currentAOV > 0 ? 100 : 0);
        const convGrowth = prevConv > 0 ? ((currentConv - prevConv) / prevConv) * 100 : (currentConv > 0 ? 100 : 0);

        return {
            revenue: currentRevenue,
            totalOrders: currentOrders.length,
            completedOrders: currentCompleted.length,
            aov: currentAOV,
            conversionRate: currentConv,
            revenueGrowth,
            ordersGrowth,
            aovGrowth,
            convGrowth
        };
    }, [orders, users, timeRange]);

    // Grouping sales for a simple chart
    const trendData = useMemo(() => {
        const result = [];
        const now = new Date();

        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(now.getDate() - i);
            d.setHours(0, 0, 0, 0);

            const nextDay = new Date(d);
            nextDay.setDate(d.getDate() + 1);

            const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });

            const dayOrders = orders.filter(o => {
                const orderDate = new Date(o.createdAt);
                return orderDate >= d && orderDate < nextDay && o.status === 'delivered';
            });
            const totalSales = dayOrders.reduce((sum, o) => sum + o.totalAmount, 0);
            result.push({ day: dayName, value: totalSales });
        }
        return result;
    }, [orders]);

    // Generate smooth SVG path coordinates
    const chartPaths = useMemo(() => {
        const maxSales = Math.max(...trendData.map(d => d.value)) || 1;
        const points = trendData.map((d, i) => {
            const x = i * (700 / 6);
            // Height is 200, so let's bound y between 20 (max sales) and 170 (0 sales)
            const y = 170 - (d.value / maxSales) * 140;
            return { x, y };
        });

        let pathD = "";
        if (points.length > 0) {
            pathD = `M ${points[0].x} ${points[0].y}`;
            for (let i = 1; i < points.length; i++) {
                const cpX1 = points[i-1].x + (points[i].x - points[i-1].x) / 3;
                const cpY1 = points[i-1].y;
                const cpX2 = points[i-1].x + 2 * (points[i].x - points[i-1].x) / 3;
                const cpY2 = points[i].y;
                pathD += ` C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${points[i].x} ${points[i].y}`;
            }
        }
        const areaD = pathD ? `${pathD} V 200 H 0 Z` : "";
        return { pathD, areaD };
    }, [trendData]);

    // Real Category Sales Breakdown
    const categorySales = useMemo(() => {
        const completedOrders = orders.filter(o => o.status === 'delivered');
        const totalRevenue = completedOrders.reduce((sum, o) => sum + o.totalAmount, 0);

        const salesMap = {};
        completedOrders.forEach(order => {
            order.items.forEach(item => {
                const catName = item.product?.category?.name || 'Uncategorized';
                const itemSales = item.price * item.quantity;
                salesMap[catName] = (salesMap[catName] || 0) + itemSales;
            });
        });

        const sorted = Object.entries(salesMap)
            .map(([name, amount]) => ({
                name,
                amount,
                percent: totalRevenue > 0 ? (amount / totalRevenue) * 100 : 0
            }))
            .sort((a, b) => b.amount - a.amount);

        const colors = ['bg-cyan-500', 'bg-[#001B1B]', 'bg-teal-500', 'bg-purple-500'];

        const result = sorted.map((cat, idx) => ({
            ...cat,
            color: colors[idx % colors.length]
        }));

        if (result.length === 0) {
            return [
                { name: 'Face Care', percent: 0, amount: 0, color: 'bg-cyan-500' },
                { name: 'Hair Care', percent: 0, amount: 0, color: 'bg-[#001B1B]' },
                { name: 'Lipsticks', percent: 0, amount: 0, color: 'bg-teal-500' },
                { name: 'Perfumes', percent: 0, amount: 0, color: 'bg-purple-500' }
            ];
        }
        return result.slice(0, 4);
    }, [orders]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="w-12 h-12 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

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
                                className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${timeRange === t
                                        ? 'bg-gradient-to-r from-[#001B1B] to-[#006060] text-white shadow-lg shadow-black/20'
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
                    trend={`${salesStats.revenueGrowth >= 0 ? '+' : ''}${salesStats.revenueGrowth.toFixed(1)}%`}
                    isUp={salesStats.revenueGrowth >= 0}
                />
                <SalesCard
                    label="Total Orders"
                    value={salesStats.totalOrders}
                    icon={<FiShoppingBag />}
                    color="bg-[#001B1B]"
                    trend={`${salesStats.ordersGrowth >= 0 ? '+' : ''}${salesStats.ordersGrowth.toFixed(1)}%`}
                    isUp={salesStats.ordersGrowth >= 0}
                />
                <SalesCard
                    label="Avg. Order Value"
                    value={`Rs. ${Math.round(salesStats.aov).toLocaleString()}`}
                    icon={<FiActivity />}
                    color="bg-teal-500"
                    trend={`${salesStats.aovGrowth >= 0 ? '+' : ''}${salesStats.aovGrowth.toFixed(1)}%`}
                    isUp={salesStats.aovGrowth >= 0}
                />
                <SalesCard
                    label="Conversion Rate"
                    value={`${salesStats.conversionRate.toFixed(2)}%`}
                    icon={<FiTrendingUp />}
                    color="bg-purple-500"
                    trend={`${salesStats.convGrowth >= 0 ? '+' : ''}${salesStats.convGrowth.toFixed(1)}%`}
                    isUp={salesStats.convGrowth >= 0}
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
                                {chartPaths.pathD && (
                                    <path
                                        d={chartPaths.pathD}
                                        fill="none"
                                        stroke="#06b6d4"
                                        strokeWidth="4"
                                        strokeLinecap="round"
                                        className="drop-shadow-lg"
                                    />
                                )}

                                {/* Area Fill */}
                                {chartPaths.areaD && (
                                    <path
                                        d={chartPaths.areaD}
                                        fill="url(#salesGradient)"
                                        opacity="0.1"
                                    />
                                )}

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
                        {categorySales.map((cat, i) => (
                            <div key={i} className="space-y-3">
                                <div className="flex justify-between items-end">
                                    <span className="text-[11px] font-black text-gray-900 uppercase tracking-widest">{cat.name}</span>
                                    <span className="text-[10px] font-bold text-gray-400">Rs. {Math.round(cat.amount).toLocaleString()}</span>
                                </div>
                                <div className="w-full h-2 bg-gray-50 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full rounded-full ${cat.color} transition-all duration-1000`}
                                        style={{ width: `${cat.percent}%` }}
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
                                            <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-[0.1em] ${order.status === 'delivered' ? 'bg-green-50 text-green-600 border border-green-100' :
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
