import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { getMyOrders } from '../../api/orders';
import Navbar from '../../components/layout/Navbar/Navbar';
import Footer from '../../components/layout/Footer/Footer';
import { useAuth } from '../../context/AuthContext';
import {
    FiPackage, FiClock, FiTruck, FiCheckCircle, FiXCircle,
    FiShoppingBag, FiUser, FiSearch, FiChevronLeft, FiChevronRight,
    FiSettings
} from 'react-icons/fi';

/* ───────── status config ───────── */
const statusConfig = {
    pending: { label: 'Pending', color: '#f59e0b', bg: '#fef3c7' },
    processing: { label: 'Processing', color: '#3b82f6', bg: '#dbeafe' },
    shipped: { label: 'Shipped', color: '#8b5cf6', bg: '#ede9fe' },
    delivered: { label: 'Delivered', color: '#10b981', bg: '#d1fae5' },
    cancelled: { label: 'Cancelled', color: '#ef4444', bg: '#fee2e2' },
};

const STATUS_TABS = ['All', 'Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
const ORDERS_PER_PAGE = 10;

/* ───────── component ───────── */
function MyOrders() {
    const { user } = useAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const data = await getMyOrders();
                setOrders(data);
            } catch (err) {
                console.error('Failed to fetch orders:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    /* ── filtering ── */
    const filteredOrders = useMemo(() => {
        let result = orders;

        // status filter
        if (activeTab !== 'All') {
            result = result.filter(
                (o) => o.status?.toLowerCase() === activeTab.toLowerCase()
            );
        }

        // search filter
        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            result = result.filter((o) => {
                const idMatch = o._id?.toLowerCase().includes(q);
                const itemMatch = o.items?.some((item) =>
                    item.name?.toLowerCase().includes(q)
                );
                return idMatch || itemMatch;
            });
        }

        return result;
    }, [orders, activeTab, searchQuery]);

    /* ── pagination ── */
    const totalPages = Math.max(1, Math.ceil(filteredOrders.length / ORDERS_PER_PAGE));
    const paginatedOrders = filteredOrders.slice(
        (currentPage - 1) * ORDERS_PER_PAGE,
        currentPage * ORDERS_PER_PAGE
    );

    // reset page when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [activeTab, searchQuery]);

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

    const formatDate = (dateStr) =>
        new Date(dateStr).toLocaleDateString('en-US', {
            year: 'numeric', month: 'short', day: 'numeric',
        });

    /* ────────────────────── RENDER ────────────────────── */
    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#f5f5f5' }}>
            <Navbar />

            {/* spacer for fixed navbar */}
            <div style={{ height: 110 }} />

            {/* ───── main wrapper ───── */}
            <div className="myorders-wrapper" style={styles.mainWrapper}>
                {/* ───── SIDEBAR ───── */}
                <aside className="myorders-sidebar" style={styles.sidebar}>
                    {/* greeting */}
                    <div style={styles.sidebarGreeting}>
                        <div style={styles.avatarCircle}>
                            {user?.username?.charAt(0).toUpperCase() || 'U'}
                        </div>
                        <span style={styles.greetingText}>
                            Hello, {user?.username || 'User'}
                        </span>
                    </div>

                    {/* nav links */}
                    <div style={styles.sidebarSection}>
                        <h4 style={styles.sidebarHeading}>Manage My Account</h4>
                        <Link to="/my-orders" style={styles.sidebarLinkInactive}>
                            <FiUser size={15} />
                            My Profile
                        </Link>
                    </div>

                    <div style={styles.sidebarSection}>
                        <h4 style={{ ...styles.sidebarHeading, color: '#53C1CC' }}>My Orders</h4>
                        <Link to="/my-orders" style={styles.sidebarLinkActive}>
                            <FiShoppingBag size={15} />
                            My Orders
                        </Link>
                        <Link to="/my-orders" style={styles.sidebarLinkInactive}>
                            <FiXCircle size={15} />
                            My Returns
                        </Link>
                        <Link to="/my-orders" style={styles.sidebarLinkInactive}>
                            <FiXCircle size={15} />
                            My Cancellations
                        </Link>
                    </div>
                </aside>

                {/* ───── RIGHT CONTENT ───── */}
                <main style={styles.content}>
                    {/* title */}
                    <h1 style={styles.pageTitle}>My Orders</h1>

                    {/* tabs */}
                    <div className="myorders-tabs" style={styles.tabBar}>
                        {STATUS_TABS.map((tab) => {
                            const isActive = activeTab === tab;
                            const count =
                                tab === 'All'
                                    ? orders.length
                                    : orders.filter((o) => o.status?.toLowerCase() === tab.toLowerCase()).length;
                            return (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    style={{
                                        ...styles.tab,
                                        ...(isActive ? styles.tabActive : {}),
                                    }}
                                >
                                    {tab}
                                    {count > 0 && (
                                        <span style={{
                                            ...styles.tabCount,
                                            ...(isActive ? styles.tabCountActive : {}),
                                        }}>
                                            ({count})
                                        </span>
                                    )}
                                </button>
                            );
                        })}
                    </div>

                    {/* search */}
                    <div style={styles.searchWrap}>
                        <FiSearch style={styles.searchIcon} />
                        <input
                            type="text"
                            placeholder="Search by product name or order ID"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            style={styles.searchInput}
                        />
                    </div>

                    {/* ── loading ── */}
                    {loading && (
                        <div style={styles.centeredMsg}>
                            <div style={styles.spinner} />
                            <p style={{ color: '#6C757D', fontSize: 14 }}>Loading your orders…</p>
                        </div>
                    )}

                    {/* ── empty ── */}
                    {!loading && filteredOrders.length === 0 && (
                        <div style={styles.centeredMsg}>
                            <FiPackage size={48} color="#ccc" />
                            <p style={{ color: '#6C757D', fontSize: 15, marginTop: 12 }}>
                                {orders.length === 0 ? 'No orders yet' : 'No orders match your filters'}
                            </p>
                            {orders.length === 0 && (
                                <Link to="/shop" style={styles.shopBtn}>Shop Now</Link>
                            )}
                        </div>
                    )}

                    {/* ── orders list ── */}
                    {!loading && paginatedOrders.length > 0 && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                            {paginatedOrders.map((order) => {
                                const info = statusConfig[order.status] || statusConfig.pending;

                                return (
                                    <div key={order._id} style={styles.orderCard}>
                                        {/* order header */}
                                        <div style={styles.orderHeader}>
                                            <div style={styles.orderHeaderLeft}>
                                                <span style={styles.orderIdText}>
                                                    Order #{order._id.slice(-8).toUpperCase()}
                                                </span>
                                                <span style={styles.orderDate}>{formatDate(order.createdAt)}</span>
                                            </div>
                                            <span style={{
                                                ...styles.statusBadge,
                                                color: info.color,
                                                background: info.bg,
                                            }}>
                                                {info.label}
                                            </span>
                                        </div>

                                        {/* items */}
                                        {order.items.map((item, idx) => (
                                            <div key={idx} className="myorders-item-row" style={styles.itemRow}>
                                                {/* thumbnail */}
                                                <div style={styles.itemThumb}>
                                                    {item.image ? (
                                                        <img src={item.image} alt={item.name} style={styles.itemImg} />
                                                    ) : (
                                                        <FiPackage size={24} color="#ccc" />
                                                    )}
                                                </div>

                                                {/* name */}
                                                <div style={styles.itemInfo}>
                                                    <p style={styles.itemName}>{item.name}</p>
                                                    {item.variant && (
                                                        <p style={styles.itemVariant}>{item.variant}</p>
                                                    )}
                                                </div>

                                                {/* price */}
                                                <p style={styles.itemPrice}>Rs. {item.price?.toLocaleString()}</p>

                                                {/* qty */}
                                                <p style={styles.itemQty}>Qty: {item.quantity}</p>
                                            </div>
                                        ))}
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {/* ── PAGINATION ── */}
                    {!loading && filteredOrders.length > 0 && (
                        <div style={styles.pagination}>
                            <button
                                onClick={() => goToPage(currentPage - 1)}
                                disabled={currentPage === 1}
                                style={{
                                    ...styles.pageBtn,
                                    ...(currentPage === 1 ? styles.pageBtnDisabled : {}),
                                }}
                            >
                                <FiChevronLeft size={16} /> Previous
                            </button>

                            {pageNumbers.map((num) => (
                                <button
                                    key={num}
                                    onClick={() => goToPage(num)}
                                    style={{
                                        ...styles.pageNumBtn,
                                        ...(num === currentPage ? styles.pageNumBtnActive : {}),
                                    }}
                                >
                                    {num}
                                </button>
                            ))}

                            <button
                                onClick={() => goToPage(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                style={{
                                    ...styles.pageBtn,
                                    ...(currentPage === totalPages ? styles.pageBtnDisabled : {}),
                                }}
                            >
                                Next <FiChevronRight size={16} />
                            </button>
                        </div>
                    )}
                </main>
            </div>

            <Footer />
        </div>
    );
}

/* ════════════════════ STYLES ════════════════════ */
const styles = {
    /* layout */
    mainWrapper: {
        flex: 1,
        display: 'flex',
        maxWidth: 1200,
        width: '100%',
        margin: '0 auto',
        padding: '24px 16px 48px',
        gap: 28,
        alignItems: 'flex-start',
    },

    /* ── sidebar ── */
    sidebar: {
        width: 220,
        flexShrink: 0,
        background: '#fff',
        borderRadius: 12,
        padding: '20px 0',
        boxShadow: '0 1px 6px rgba(0,0,0,0.06)',
        position: 'sticky',
        top: 130,
    },
    sidebarGreeting: {
        display: 'flex', alignItems: 'center', gap: 10,
        padding: '0 20px 16px',
        borderBottom: '1px solid #eee',
    },
    avatarCircle: {
        width: 36, height: 36, borderRadius: '50%',
        background: '#53C1CC', color: '#fff',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontWeight: 700, fontSize: 15,
    },
    greetingText: {
        fontSize: 13, color: '#212529', fontWeight: 500,
    },
    sidebarSection: {
        padding: '14px 20px 0',
    },
    sidebarHeading: {
        fontSize: 13, fontWeight: 600, color: '#212529',
        margin: '0 0 8px',
    },
    sidebarLinkInactive: {
        display: 'flex', alignItems: 'center', gap: 8,
        fontSize: 13, color: '#6C757D',
        textDecoration: 'none', padding: '6px 0',
        transition: 'color .2s',
    },
    sidebarLinkActive: {
        display: 'flex', alignItems: 'center', gap: 8,
        fontSize: 13, color: '#53C1CC', fontWeight: 600,
        textDecoration: 'none', padding: '6px 0',
    },

    /* ── content ── */
    content: {
        flex: 1,
        minWidth: 0,
    },
    pageTitle: {
        fontSize: 22, fontWeight: 700, color: '#212529',
        margin: '0 0 16px',
    },

    /* tabs */
    tabBar: {
        display: 'flex', gap: 0,
        borderBottom: '2px solid #eee',
        marginBottom: 16,
        overflowX: 'auto',
    },
    tab: {
        padding: '10px 18px',
        fontSize: 13, fontWeight: 500,
        color: '#6C757D', cursor: 'pointer',
        background: 'none', border: 'none',
        borderBottom: '2px solid transparent',
        marginBottom: -2,
        whiteSpace: 'nowrap',
        transition: 'color .2s, border-color .2s',
    },
    tabActive: {
        color: '#53C1CC',
        borderBottomColor: '#53C1CC',
        fontWeight: 600,
    },
    tabCount: {
        marginLeft: 4, fontSize: 12, color: '#aaa',
    },
    tabCountActive: {
        color: '#53C1CC',
    },

    /* search */
    searchWrap: {
        position: 'relative',
        marginBottom: 20,
    },
    searchIcon: {
        position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)',
        color: '#999', fontSize: 16,
    },
    searchInput: {
        width: '100%', padding: '11px 14px 11px 40px',
        border: '1px solid #E1E1E1', borderRadius: 8,
        fontSize: 13, color: '#333', outline: 'none',
        background: '#fff',
        boxSizing: 'border-box',
    },

    /* centered messages */
    centeredMsg: {
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        justifyContent: 'center', padding: '60px 0',
    },
    spinner: {
        width: 36, height: 36, borderRadius: '50%',
        border: '4px solid #e5e5e5', borderTopColor: '#53C1CC',
        animation: 'spin 0.8s linear infinite',
        marginBottom: 12,
    },
    shopBtn: {
        marginTop: 16,
        padding: '10px 28px',
        background: '#53C1CC', color: '#fff',
        borderRadius: 24, fontWeight: 600, fontSize: 13,
        textDecoration: 'none',
        transition: 'background .2s',
    },

    /* order card */
    orderCard: {
        background: '#fff',
        borderRadius: 10,
        border: '1px solid #eee',
        marginBottom: 16,
        overflow: 'hidden',
        boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
    },
    orderHeader: {
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '12px 20px',
        borderBottom: '1px solid #f0f0f0',
        background: '#fafafa',
    },
    orderHeaderLeft: {
        display: 'flex', flexDirection: 'column', gap: 2,
    },
    orderIdText: {
        fontSize: 13, fontWeight: 600, color: '#212529',
    },
    orderDate: {
        fontSize: 11, color: '#999',
    },
    statusBadge: {
        fontSize: 12, fontWeight: 600,
        padding: '4px 14px',
        borderRadius: 20,
    },

    /* item row */
    itemRow: {
        display: 'flex', alignItems: 'center',
        padding: '14px 20px',
        gap: 16,
        borderBottom: '1px solid #f5f5f5',
    },
    itemThumb: {
        width: 60, height: 60, borderRadius: 8,
        background: '#f8f8fa', overflow: 'hidden', flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        border: '1px solid #eee',
    },
    itemImg: {
        width: '100%', height: '100%', objectFit: 'cover',
    },
    itemInfo: {
        flex: 1, minWidth: 0,
    },
    itemName: {
        fontSize: 13, fontWeight: 500, color: '#212529',
        margin: 0, overflow: 'hidden', textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
    },
    itemVariant: {
        fontSize: 11, color: '#999', margin: '2px 0 0',
    },
    itemPrice: {
        fontSize: 13, fontWeight: 600, color: '#212529',
        whiteSpace: 'nowrap', margin: 0,
    },
    itemQty: {
        fontSize: 12, color: '#6C757D', whiteSpace: 'nowrap', margin: 0,
    },

    /* pagination */
    pagination: {
        display: 'flex', justifyContent: 'center', alignItems: 'center',
        gap: 6, marginTop: 32,
    },
    pageBtn: {
        display: 'flex', alignItems: 'center', gap: 4,
        padding: '8px 16px', fontSize: 13, fontWeight: 500,
        color: '#53C1CC', background: '#fff',
        border: '1px solid #E1E1E1', borderRadius: 8,
        cursor: 'pointer', transition: 'all .2s',
    },
    pageBtnDisabled: {
        color: '#ccc', cursor: 'default', borderColor: '#eee',
    },
    pageNumBtn: {
        width: 36, height: 36,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 13, fontWeight: 500, color: '#555',
        background: '#fff', border: '1px solid #E1E1E1',
        borderRadius: 8, cursor: 'pointer',
        transition: 'all .2s',
    },
    pageNumBtnActive: {
        background: '#53C1CC', color: '#fff', borderColor: '#53C1CC',
    },
};

export default MyOrders;
