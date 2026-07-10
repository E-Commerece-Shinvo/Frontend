import React from 'react';
import {
    FiGrid, FiPackage, FiUsers, FiShoppingCart, FiArchive,
    FiPieChart, FiTruck, FiLifeBuoy, FiSearch, FiBell,
    FiMessageSquare, FiCalendar, FiDownload, FiArrowUpRight,
    FiMoreVertical, FiCheck, FiTrendingUp, FiAlertTriangle,
    FiMenu, FiX
} from 'react-icons/fi';
import { getDashboardStats, getRecentActivity } from '../../api/orders';
import { useAuth } from '../../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [stats, setStats] = React.useState(null);
    const [activity, setActivity] = React.useState(null);
    const [loading, setLoading] = React.useState(true);
    const [isDateDropdownOpen, setIsDateDropdownOpen] = React.useState(false);

    // Date Selection State
    const [currentMonth, setCurrentMonth] = React.useState(new Date().getMonth());
    const [currentYear, setCurrentYear] = React.useState(new Date().getFullYear());
    const [startDate, setStartDate] = React.useState({ day: 1, month: new Date().getMonth(), year: new Date().getFullYear() });
    const [endDate, setEndDate] = React.useState({ day: 31, month: new Date().getMonth(), year: new Date().getFullYear() });
    const [selecting, setSelecting] = React.useState('start'); // 'start' or 'end'

    const datePickerRef = React.useRef(null);

    const fetchData = async () => {
        try {
            const [statsData, activityData] = await Promise.all([
                getDashboardStats(),
                getRecentActivity()
            ]);
            setStats(statsData);
            setActivity(activityData);
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    React.useEffect(() => {
        fetchData();
        // Polling every 30 seconds
        const interval = setInterval(fetchData, 30000);
        return () => clearInterval(interval);
    }, []);

    React.useEffect(() => {
        const handleClickOutside = (event) => {
            if (datePickerRef.current && !datePickerRef.current.contains(event.target)) {
                setIsDateDropdownOpen(false);
            }
        };

        if (isDateDropdownOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isDateDropdownOpen]);

    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const getDaysInMonth = (month, year) => new Date(year, month + 1, 0).getDate();
    const getFirstDayOfMonth = (month, year) => new Date(year, month, 1).getDay();

    const isSameDate = (d1, d2) => d1 && d2 && d1.day === d2.day && d1.month === d2.month && d1.year === d2.year;

    const isAfter = (d1, d2) => {
        if (!d1 || !d2) return false;
        if (d1.year !== d2.year) return d1.year > d2.year;
        if (d1.month !== d2.month) return d1.month > d2.month;
        return d1.day > d2.day;
    };

    const isBetween = (day, month, year) => {
        if (!startDate || !endDate) return false;
        const current = { day, month, year };
        return isAfter(current, startDate) && isAfter(endDate, current);
    };

    const handleDateClick = (day) => {
        const clickedDate = { day, month: currentMonth, year: currentYear };

        if (selecting === 'start') {
            setStartDate(clickedDate);
            setEndDate(null);
            setSelecting('end');
        } else {
            if (isAfter(startDate, clickedDate)) {
                setStartDate(clickedDate);
                setEndDate(null);
                setSelecting('end');
            } else {
                setEndDate(clickedDate);
                setSelecting('start');
            }
        }
    };

    const dateRange = !endDate
        ? `${months[startDate.month]} ${startDate.day}`
        : startDate.month === endDate.month
            ? `${months[startDate.month]} ${startDate.day} - ${months[endDate.month]} ${endDate.day}`
            : `${months[startDate.month]} ${startDate.day} - ${months[endDate.month]} ${endDate.day}`;

    const dateOptions = [
        'Last 7 Days',
        'This Month',
    ];

    const prevMonth = () => {
        if (currentMonth === 0) {
            setCurrentMonth(11);
            setCurrentYear(currentYear - 1);
        } else {
            setCurrentMonth(currentMonth - 1);
        }
    };

    const nextMonth = () => {
        if (currentMonth === 11) {
            setCurrentMonth(0);
            setCurrentYear(currentYear + 1);
        } else {
            setCurrentMonth(currentMonth + 1);
        }
    };


    if (loading || !stats || !activity) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-400"></div>
            </div>
        );
    }

    return (
        <>
            {/* Dashboard Title Card */}
            <div className="bg-white rounded-xl py-4 px-4 md:px-8 shadow-sm border border-gray-50 mb-6 md:mb-12 min-h-[80px] md:min-h-[100px] flex items-center">
                <h2 className="text-2xl md:text-4xl font-bold tracking-tight text-gray-900">Dashboard</h2>
            </div>

            {/* Welcome Back Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                <div>
                    <h3 className="text-xl md:text-3xl font-bold mb-1 text-gray-900 capitalize">Welcome back, {user?.username || 'Admin'}</h3>
                    <p className="text-gray-400 text-sm">Here's what is going on in your store today</p>
                </div>
                <div ref={datePickerRef} className="flex items-center gap-3 relative">
                    {/* Date Picker Button */}
                    <div
                        onClick={() => setIsDateDropdownOpen(!isDateDropdownOpen)}
                        className="bg-white border-2 border-cyan-400 px-3 py-2 xl:px-4 xl:py-2.5 rounded-xl flex items-center gap-2 xl:gap-3 shadow-sm text-xs xl:text-sm font-medium text-gray-700 cursor-pointer hover:bg-gray-50 transition-all select-none"
                    >
                        <FiCalendar className="text-gray-700 text-base xl:text-lg" />
                        <span className="font-bold">{dateRange}</span>
                        <div className={`w-4 h-4 text-gray-800 flex items-center justify-center pt-1 transition-transform ${isDateDropdownOpen ? 'rotate-180' : ''}`}>
                            <svg width="10" height="6" viewBox="0 0 10 6" fill="none"><path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                        </div>
                    </div>

                    {/* Date Dropdown Menu */}
                    {isDateDropdownOpen && (
                        <div className="absolute top-full right-0 mt-2 w-72 bg-white border border-gray-100 rounded-2xl shadow-2xl z-50 p-4 animate-in fade-in slide-in-from-top-2 duration-200">
                            <div className="flex items-center justify-between mb-4">
                                <h5 className="font-bold text-sm">{months[currentMonth]} {currentYear}</h5>
                                <div className="flex gap-2">
                                    <button
                                        onClick={(e) => { e.stopPropagation(); prevMonth(); }}
                                        className="p-1 hover:bg-gray-100 rounded-md transition-colors"
                                    >
                                        <svg width="12" height="12" viewBox="0 0 12 12"><path d="M8 2L4 6L8 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                    </button>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); nextMonth(); }}
                                        className="p-1 hover:bg-gray-100 rounded-md transition-colors"
                                    >
                                        <svg width="12" height="12" viewBox="0 0 12 12"><path d="M4 2L8 6L4 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                    </button>
                                </div>
                            </div>

                            {/* Simple Calendar Grid */}
                            <div className="grid grid-cols-7 gap-1 mb-4">
                                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => (
                                    <div key={d} className="text-[10px] font-bold text-gray-400 text-center py-1">{d}</div>
                                ))}
                                {/* Empty cells for padding */}
                                {Array.from({ length: getFirstDayOfMonth(currentMonth, currentYear) }).map((_, i) => (
                                    <div key={`empty-${i}`} className="h-8"></div>
                                ))}
                                {Array.from({ length: getDaysInMonth(currentMonth, currentYear) }).map((_, i) => {
                                    const day = i + 1;
                                    const isSelected = isSameDate({ day, month: currentMonth, year: currentYear }, startDate) ||
                                        isSameDate({ day, month: currentMonth, year: currentYear }, endDate);
                                    const isInRange = isBetween(day, currentMonth, currentYear);

                                    return (
                                        <button
                                            key={day}
                                            onClick={(e) => { e.stopPropagation(); handleDateClick(day); }}
                                            className={`text-[11px] font-bold h-8 w-full rounded-lg transition-all relative ${isSelected ? 'bg-cyan-400 text-black z-10' :
                                                isInRange ? 'bg-cyan-50 text-teal-600' :
                                                    'hover:bg-gray-50 text-gray-600'
                                                }`}
                                        >
                                            {day}
                                        </button>
                                    );
                                })}
                            </div>

                            <div className="border-t border-gray-50 pt-3 flex flex-col gap-1">
                                {dateOptions.map((option) => (
                                    <button
                                        key={option}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            if (option === 'This Month') {
                                                setStartDate({ day: 1, month: currentMonth, year: currentYear });
                                                setEndDate({ day: getDaysInMonth(currentMonth, currentYear), month: currentMonth, year: currentYear });
                                            } else if (option === 'Last 7 Days') {
                                                const today = new Date();
                                                const sevenDaysAgo = new Date();
                                                sevenDaysAgo.setDate(today.getDate() - 7);
                                                setStartDate({ day: sevenDaysAgo.getDate(), month: sevenDaysAgo.getMonth(), year: sevenDaysAgo.getFullYear() });
                                                setEndDate({ day: today.getDate(), month: today.getMonth(), year: today.getFullYear() });
                                            }
                                            setIsDateDropdownOpen(false);
                                        }}
                                        className={`w-full px-3 py-2 text-left text-[11px] hover:bg-cyan-50 rounded-lg transition-colors ${dateRange.includes(option) ? 'text-teal-600 font-bold bg-cyan-50' : 'text-gray-500 font-medium'}`}
                                    >
                                        {option}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    <button className="bg-gradient-to-r from-[#001B1B] to-[#006060] text-white px-4 py-2 xl:px-6 xl:py-2.5 rounded-xl flex items-center gap-2 xl:gap-3 font-bold text-xs xl:text-sm shadow-lg shadow-black/20 transition-all hover:from-[#002B2B] hover:to-[#008080] active:scale-95">
                        <span>Download Report</span>
                        <div className="w-5 h-5 xl:w-6 xl:h-6 rounded-full border-2 border-white flex items-center justify-center">
                            <svg width="10" height="10" viewBox="0 0 10 10" fill="none" className="rotate-0"><path d="M5 1V9M5 9L1 5M5 9L9 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                        </div>
                    </button>
                </div>
            </div>

            {/* Summary Cards Grid */}
            <div className="grid grid-cols-4 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-12">
                <SummaryCard
                    icon={<FiTrendingUp className="text-orange-600 text-xl sm:text-2xl" />}
                    bgColor="bg-orange-100"
                    label="TODAY'S SALES"
                    value={`Rs. ${stats.todaySales.toLocaleString()}`}
                    trend="+ 7 %"
                    trendText="Higher than yesterday"
                    chartType="up"
                    link="View Sales Report"
                />
                <SummaryCard
                    icon={<FiPackage className="text-orange-700 text-xl sm:text-2xl" />}
                    bgColor="bg-orange-200"
                    label="ORDERS TO FULFILL"
                    value={stats.pendingOrders}
                    status="Action Required"
                    statusText="Pack and ship"
                    link="Manage Orders"
                    path="/admin/orders"
                />
                <SummaryCard
                    icon={<FiUsers className="text-purple-600 text-xl sm:text-2xl" />}
                    bgColor="bg-purple-100"
                    label="TOTAL REVENUE"
                    value={`Rs. ${stats.totalRevenue.toLocaleString()}`}
                    trend="+ 15 %"
                    trendText="from last month"
                    chartType="up"
                    link="View Live Traffic"
                />
                <SummaryCard
                    icon={<FiAlertTriangle className="text-yellow-400 text-xl sm:text-2xl" />}
                    bgColor="bg-black"
                    label="LOW STOCK ALERTS"
                    value={`${stats.lowStockItems}`}
                    status={stats.lowStockItems > 0 ? "Action Required" : "All Good"}
                    statusText={stats.lowStockItems > 0 ? "Restock Soon" : "Stock Levels Healthy"}
                    link="View Inventory"
                    path="/admin/inventory"
                />
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mb-12">
                {/* Sales Overview Chart */}
                <div className="xl:col-span-2 bg-white rounded-[32px] p-5 md:p-8 shadow-sm border border-gray-50 flex flex-col">
                    <div className="flex items-center justify-between mb-6 md:mb-10">
                        <h4 className="text-xl font-bold text-gray-900 font-sans">Sales Overview (7 Days)</h4>
                        <div className="flex items-center gap-6 text-xs font-medium text-gray-400">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 bg-gradient-to-t from-teal-500 to-cyan-400 rounded-sm"></div>
                                <span className="font-bold">Last 7 Days</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex-1 overflow-x-auto pb-4 custom-scrollbar">
                        <div className="min-w-[400px] md:min-w-[500px] h-full flex items-end justify-between gap-2 relative pt-6 md:pt-12">
                            {/* Simple Bar Chart Implementation with Tooltips */}
                            {stats.salesChart.map((d, i) => {
                                // Calculate height percentage relative to max sales in the week
                                const maxSales = Math.max(...stats.salesChart.map(x => x.sales)) || 1;
                                const heightPercent = (d.sales / maxSales) * 100;

                                return (
                                    <div key={i} className="flex-1 flex flex-col items-center gap-2 md:gap-4 group relative">
                                        <div className="w-full flex justify-center gap-1.5 items-end h-[150px] md:h-[250px]">
                                            <div
                                                className="w-8 md:w-12 bg-gradient-to-t from-teal-500 to-cyan-400 rounded-md md:rounded-lg group-hover:from-teal-600 group-hover:to-cyan-500 transition-all cursor-pointer relative"
                                                style={{ height: `${Math.max(heightPercent, 5)}%` }}
                                            >
                                                {/* Value Label on Top */}
                                                <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20">
                                                    Rs. {d.sales.toLocaleString()}
                                                </div>
                                            </div>
                                        </div>
                                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{d.day}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Top Selling Products */}
                <div className="bg-white rounded-[32px] p-5 md:p-8 shadow-sm border border-gray-50">
                    <div className="flex items-center justify-between mb-6 md:mb-8 gap-2">
                        <h4 className="text-lg xl:text-base 2xl:text-xl font-bold text-gray-900 truncate">Low Stock Products</h4>
                        <div className="flex items-center gap-1 2xl:gap-2 text-[9px] 2xl:text-[10px] text-gray-400 font-bold tracking-widest uppercase flex-shrink-0">
                            <span>Alerts</span>
                            <svg width="8" height="5" viewBox="0 0 8 5" fill="none"><path d="M1 1L4 4L7 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                        </div>
                    </div>
                    <div className="overflow-x-auto custom-scrollbar">
                        <div className="space-y-6 min-w-[220px] 2xl:min-w-[280px]">
                            {activity.lowStockProducts.length === 0 ? (
                                <p className="text-center py-10 text-gray-400 font-bold uppercase tracking-widest text-[10px]">All products well stocked</p>
                            ) : (
                                activity.lowStockProducts.map((product, i) => (
                                    <ProductItem 
                                        key={i} 
                                        name={product.title} 
                                        price={`Rs. ${product.price.toLocaleString()}`} 
                                        sold={`${product.stock} left`} 
                                        image={product.image}
                                    />
                                ))
                            )}
                        </div>
                    </div>
                    <Link to="/admin/inventory" className="mt-8 text-[11px] font-bold text-teal-600 uppercase tracking-widest flex items-center gap-2 hover:gap-3 transition-all leading-none">
                        View full Inventory Report <FiArrowUpRight />
                    </Link>
                </div>
            </div>

            {/* Bottom Row: Recent Orders and Activity */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* Recent Orders Table */}
                <div className="xl:col-span-2 bg-white rounded-[32px] p-8 shadow-sm border border-gray-50">
                    <div className="flex items-center justify-between mb-8">
                        <h4 className="text-xl font-bold text-gray-900">Recent Orders</h4>
                        <Link to="/admin/orders" className="text-[11px] font-bold text-teal-600 uppercase tracking-widest flex items-center gap-2 hover:gap-3 transition-all leading-none">
                            View All Orders <FiArrowUpRight />
                        </Link>
                    </div>
                    <div className="overflow-x-auto custom-scrollbar">
                        <table className="w-full min-w-[600px]">
                            <thead>
                                <tr className="border-b border-gray-50 text-[11px] text-gray-400 uppercase tracking-[0.2em] font-bold">
                                    <th className="pb-6 text-left font-bold">ID</th>
                                    <th className="pb-6 text-left font-bold">Customer Name</th>
                                    <th className="pb-6 text-left font-bold">Items</th>
                                    <th className="pb-6 text-left font-bold">Price</th>
                                    <th className="pb-6 text-left font-bold text-right pr-4">Order Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {activity.recentOrders.map((order) => (
                                    <OrderRow 
                                        key={order._id}
                                        id={`#${order._id.slice(-4)}`} 
                                        name={order.shippingAddress.fullName} 
                                        items={order.items.reduce((acc, item) => acc + item.quantity, 0)} 
                                        price={`Rs. ${order.totalAmount.toLocaleString()}`} 
                                        status={order.status.charAt(0).toUpperCase() + order.status.slice(1)} 
                                        onClick={() => navigate(`/admin/orders/${order._id}`)}
                                    />
                                ))}
                                {activity.recentOrders.length === 0 && (
                                    <tr>
                                        <td colSpan="5" className="py-10 text-center text-gray-400 font-bold uppercase tracking-widest text-[10px]">No orders found</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-50">
                    <div className="flex items-center justify-between mb-8">
                        <h4 className="text-xl font-bold text-gray-900">Recent Activity</h4>
                        <button className="text-[10px] font-bold text-teal-600 uppercase tracking-widest flex items-center gap-1 leading-none">
                            Mark all read <FiCheck />
                        </button>
                    </div>
                    <div className="space-y-8">
                        {activity.recentOrders.slice(0, 5).map((order, i) => (
                            <ActivityItem
                                key={i}
                                color={order.status === 'pending' ? 'bg-orange-500' : 'bg-teal-500'}
                                title={order.status === 'pending' ? `New Order #${order._id.slice(-4)}` : `Order #${order._id.slice(-4)} ${order.status}`}
                                desc={`${order.shippingAddress.fullName} placed an order for Rs. ${order.totalAmount.toLocaleString()}.`}
                                time={new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            />
                        ))}
                    </div>
                    <Link to="/admin/inventory" className="mt-8 text-[11px] font-bold text-teal-600 uppercase tracking-widest flex items-center gap-2 hover:gap-3 transition-all leading-none">
                        View Inventory <FiArrowUpRight />
                    </Link>
                </div>
            </div>
        </>
    );
};

/* Helper Components */



const SummaryCard = ({ icon, label, value, trend, trendText, status, statusText, link, chartType, path, bgColor = 'bg-gray-50' }) => (
    <div 
        tabIndex="0"
        className="bg-white rounded-2xl sm:rounded-[32px] p-3 sm:p-8 shadow-sm border border-gray-50 flex flex-col items-center sm:items-start group hover:shadow-xl hover:shadow-cyan-400/5 transition-all relative cursor-pointer outline-none focus:bg-gray-50 active:bg-gray-50"
    >
        <div className="flex items-center justify-between w-full">
            <div className={`w-10 h-10 sm:w-14 sm:h-14 mx-auto sm:mx-0 rounded-xl sm:rounded-2xl ${bgColor} flex items-center justify-center transition-transform shadow-xl group-hover:scale-110 group-focus:scale-110`}>
                {icon}
            </div>
        </div>
        
        <div className="text-center sm:text-left mt-1 sm:mt-6 w-full">
            <p className="hidden sm:block text-[10px] text-gray-400 uppercase tracking-[0.2em] font-bold mb-2">{label}</p>
            
            <div className="flex items-center justify-center sm:justify-between mb-0 sm:mb-4 gap-1 2xl:gap-2">
                <h4 className="text-[11px] sm:text-xl xl:text-lg 2xl:text-2xl font-bold text-gray-900 tracking-tight leading-none pointer-events-none truncate">{value}</h4>
                {chartType === 'up' && (
                    <div className="hidden sm:flex w-12 2xl:w-16 h-6 2xl:h-8 overflow-hidden items-end shrink-0">
                        <svg viewBox="0 0 100 40" className="w-full h-full text-cyan-400 opacity-60">
                            <path d="M0,35 Q20,30 40,32 T80,10 T100,5" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                        </svg>
                    </div>
                )}
            </div>

            <div className="hidden sm:flex flex-1 flex-col justify-end mt-4">
                {trend && (
                    <p className="text-[10px] 2xl:text-[11px] mb-4 leading-tight flex flex-wrap gap-1">
                        <span className="text-teal-500 font-bold whitespace-nowrap">{trend}</span>
                        <span className="text-gray-400">{trendText}</span>
                    </p>
                )}
                {status && (
                    <div className="mb-4 flex flex-col items-start gap-1.5 xl:flex-row xl:items-center xl:gap-2 leading-tight">
                        <span className="bg-orange-500/10 text-orange-600 px-2 py-0.5 rounded-full font-bold text-[8px] 2xl:text-[9px] uppercase whitespace-nowrap">{status}</span>
                        <span className="text-gray-400 text-[10px] 2xl:text-[11px] leading-snug">{statusText}</span>
                    </div>
                )}
                {path ? (
                    <Link to={path} className="text-[9px] 2xl:text-[10px] font-bold text-teal-600 uppercase tracking-widest flex items-center gap-1 group/link transition-all whitespace-nowrap">
                        {link} <FiArrowUpRight className="group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
                    </Link>
                ) : (
                    <button className="text-[9px] 2xl:text-[10px] font-bold text-teal-600 uppercase tracking-widest flex items-center gap-1 group/link transition-all text-left whitespace-nowrap">
                        {link} <FiArrowUpRight className="group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
                    </button>
                )}
            </div>
        </div>

        {/* Tooltip on Mobile (Shows on Hover/Focus/Active) */}
        <div className="sm:hidden absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] font-bold tracking-wider uppercase px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 group-focus:opacity-100 group-active:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-[100] shadow-xl">
            {label}
            <div className="absolute top-full left-1/2 -translate-x-1/2 border-[5px] border-transparent border-t-gray-900"></div>
        </div>
    </div>
);

const ProductItem = ({ name, price, sold, image }) => (
    <div className="flex items-center gap-3 2xl:gap-4 group cursor-pointer">
        <div className="w-10 h-10 2xl:w-16 2xl:h-16 bg-gray-50 rounded-lg 2xl:rounded-2xl overflow-hidden border border-gray-100 p-1 2xl:p-2 flex items-center justify-center flex-shrink-0">
            <img
                src={image || "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?q=80&w=100"}
                alt={name}
                className="w-full h-full object-contain group-hover:scale-110 transition-transform"
            />
        </div>
        <div className="flex-1 min-w-0 pr-1 2xl:pr-2">
            <h5 className="text-[11px] 2xl:text-sm font-bold truncate group-hover:text-teal-600 transition-colors uppercase tracking-tight">{name}</h5>
            <p className="text-[8px] 2xl:text-[10px] text-gray-400 font-bold uppercase tracking-widest">Best Seller</p>
        </div>
        <div className="text-right flex-shrink-0 whitespace-nowrap">
            <p className="text-[11px] 2xl:text-sm font-bold">{price}</p>
            <p className="text-[8px] 2xl:text-[9px] text-teal-500 font-bold uppercase tracking-widest">{sold}</p>
        </div>
    </div>
);

const OrderRow = ({ id, name, items, price, status, onClick }) => {
    const statusColors = {
        'Pending': 'text-orange-600',
        'Processing': 'text-blue-500',
        'Delivered': 'text-teal-500',
        'Shipped': 'text-purple-500',
        'Cancelled': 'text-red-500'
    };
    return (
        <tr 
            onClick={onClick}
            className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors cursor-pointer group"
        >
            <td className="py-6 text-sm font-bold text-gray-400 group-hover:text-black transition-colors">{id}</td>
            <td className="py-6 text-sm font-bold">{name}</td>
            <td className="py-6 text-sm font-bold text-gray-500">{items}</td>
            <td className="py-6 text-sm font-bold text-gray-900">{price}</td>
            <td className="py-6 text-sm font-bold text-right pr-4 font-sans">
                <span className={statusColors[status] || 'text-gray-500'}>{status}</span>
            </td>
        </tr>
    );
};

const ActivityItem = ({ color, title, desc, time }) => (
    <div className="flex gap-4 relative">
        <div className="flex flex-col items-center">
            <div className={`w-3.5 h-3.5 rounded-full ${color} relative z-10`}></div>
            <div className="w-px h-full bg-gray-100 -mt-1"></div>
        </div>
        <div className="flex-1 pb-6">
            <div className="flex items-center justify-between mb-1">
                <h5 className="text-sm font-bold">{title}</h5>
                <span className="text-[10px] text-gray-300 font-medium">{time}</span>
            </div>
            <p className="text-[11px] text-gray-400 leading-normal">{desc}</p>
        </div>
    </div>
);

export default AdminDashboard;
