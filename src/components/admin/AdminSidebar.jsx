import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiGrid, FiPackage, FiUsers, FiShoppingCart, FiArchive, FiPieChart, FiTruck, FiLifeBuoy, FiMoreVertical, FiX, FiUser, FiLogOut } from 'react-icons/fi';

const AdminSidebar = ({ isSidebarOpen, setIsSidebarOpen }) => {
    const location = useLocation();
    const [showAdminMenu, setShowAdminMenu] = useState(false);
    const adminMenuRef = React.useRef(null);

    React.useEffect(() => {
        const handleClickOutside = (event) => {
            if (adminMenuRef.current && !adminMenuRef.current.contains(event.target)) {
                setShowAdminMenu(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <>
            {/* Sidebar Overlay (Mobile) */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm transition-all"
                    onClick={() => setIsSidebarOpen(false)}
                ></div>
            )}

            {/* Sidebar */}
            <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-[#001B1B] text-white flex flex-col transition-transform duration-300 transform lg:relative lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                {/* Background Gradient Orbs */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none"></div>

                {/* Logo & Mobile Close Button */}
                <div className="p-8 pb-4 flex items-center justify-between relative z-10">
                    <div className="flex items-center gap-3">
                        <h1 className="text-2xl font-black tracking-tighter text-white uppercase">Logo</h1>
                    </div>
                    <button
                        type="button"
                        onClick={() => setIsSidebarOpen(false)}
                        className="lg:hidden p-2 hover:bg-white/10 rounded-xl transition-colors cursor-pointer"
                    >
                        <FiX className="text-xl text-white pointer-events-none" />
                    </button>
                </div>

                {/* Main Menu */}
                <nav className="flex-1 px-4 py-8 relative z-10 overflow-y-auto custom-scrollbar">
                    <p className="text-[10px] text-white/40 uppercase tracking-[0.2em] font-bold px-4 mb-6">Main Menu</p>
                    <ul className="space-y-2">
                        <MenuItem icon={<FiGrid />} label="Dashboard" to="/admin/dashboard" active={location.pathname === '/admin/dashboard'} setIsSidebarOpen={setIsSidebarOpen} />
                        <MenuItem
                            icon={<FiPackage />}
                            label="Products"
                            to="/admin/products"
                            active={location.pathname.startsWith('/admin/products') || location.pathname.startsWith('/admin/categories')}
                            hasSubmenu
                            subMenus={[
                                { label: 'Product List', to: '/admin/products' },
                                { label: 'Add New Product', to: '/admin/products/add' },
                                { label: 'Categories', to: '/admin/categories' }
                            ]}
                            setIsSidebarOpen={setIsSidebarOpen}
                        />
                        <MenuItem 
                            icon={<FiUsers />} 
                            label="Customers" 
                            to="/admin/customers" 
                            active={location.pathname.startsWith('/admin/customers')}
                            setIsSidebarOpen={setIsSidebarOpen} 
                        />
                        <MenuItem icon={<FiShoppingCart />} label="Orders" to="/admin/orders" active={location.pathname.startsWith('/admin/orders')} setIsSidebarOpen={setIsSidebarOpen} />
                        <MenuItem icon={<FiArchive />} label="Inventory" to="/admin/inventory" active={location.pathname.startsWith('/admin/inventory')} setIsSidebarOpen={setIsSidebarOpen} />
                        <MenuItem icon={<FiPieChart />} label="Sales" to="/admin/sales" active={location.pathname.startsWith('/admin/sales')} setIsSidebarOpen={setIsSidebarOpen} />
                        <MenuItem icon={<FiTruck />} label="Shipping" to="/admin/shipping" active={location.pathname.startsWith('/admin/shipping')} setIsSidebarOpen={setIsSidebarOpen} />
                        <MenuItem icon={<FiLifeBuoy />} label="Support" to="/admin/support" active={location.pathname.startsWith('/admin/support')} setIsSidebarOpen={setIsSidebarOpen} />
                    </ul>
                </nav>

                {/* Admin Profile Footer */}
                <div className="p-4 border-t border-white/5 relative z-10 mt-auto">
                    <div ref={adminMenuRef} className="bg-white/5 p-3 rounded-2xl flex items-center gap-3 relative">
                        <img
                            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=100"
                            alt="Admin"
                            className="w-10 h-10 rounded-full object-cover border border-white/10"
                        />
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold truncate">Admin Name</p>
                            <p className="text-[10px] text-white/40 truncate">admin@shinvo.com</p>
                        </div>
                        <button
                            onClick={() => setShowAdminMenu(!showAdminMenu)}
                            className="p-2 hover:bg-white/10 rounded-lg transition-colors cursor-pointer text-white/40 hover:text-white"
                        >
                            <FiMoreVertical />
                        </button>

                        {/* Admin Menu Dropup */}
                        {showAdminMenu && (
                            <div className="absolute bottom-full left-0 w-full mb-2 bg-[#002B2B] border border-white/10 rounded-xl overflow-hidden shadow-2xl z-[100] animate-in fade-in slide-in-from-bottom-2 duration-200">
                                <Link
                                    to="/admin/profile"
                                    onClick={() => setShowAdminMenu(false)}
                                    className={`flex items-center gap-3 w-full px-4 py-3 text-left text-sm transition-colors cursor-pointer ${location.pathname === '/admin/profile' ? 'bg-white/10 text-white font-bold' : 'text-white/70 hover:text-white hover:bg-white/5'}`}
                                >
                                    <FiUser className="text-cyan-400" />
                                    My Profile
                                </Link>
                                <button
                                    onClick={() => {
                                        localStorage.removeItem('token');
                                        window.location.href = '/login';
                                    }}
                                    className="flex items-center gap-3 w-full px-4 py-3 text-left text-sm text-red-400 hover:bg-red-500/10 font-bold transition-colors cursor-pointer border-t border-white/5"
                                >
                                    <FiLogOut className="text-red-500" />
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </aside>
        </>
    );
};

const MenuItem = ({ icon, label, active = false, hasSubmenu = false, to, subMenus = [], setIsSidebarOpen }) => {
    const [isOpen, setIsOpen] = useState(active);
    const location = useLocation();

    // Sync isOpen with active state (e.g. when navigating via browser back/forward or direct link)
    React.useEffect(() => {
        if (active) setIsOpen(true);
    }, [active]);

    if (hasSubmenu) {
        return (
            <li className="mb-2">
                <div
                    onClick={() => setIsOpen(!isOpen)}
                    className={`flex items-center justify-between px-4 py-3.5 rounded-2xl cursor-pointer transition-all ${active || isOpen ? 'bg-white/10 text-white font-bold' : 'text-white/50 hover:text-white hover:bg-white/5'}`}
                >
                    <div className="flex items-center gap-4">
                        <span className="text-xl">{icon}</span>
                        <span className="text-sm tracking-wide">{label}</span>
                    </div>
                    <svg className={`w-3 h-3 text-white/50 transition-transform ${isOpen ? 'rotate-180 text-white' : ''}`} viewBox="0 0 10 6" fill="none"><path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </div>
                {isOpen && subMenus.length > 0 && (
                    <ul className="mt-2 space-y-1 pl-12 pr-4">
                        {subMenus.map((sub, idx) => (
                            <li key={idx}>
                                <Link
                                    to={sub.to}
                                    onClick={() => setIsSidebarOpen(false)}
                                    className={`block py-2.5 px-4 text-sm rounded-xl transition-all ${location.pathname === sub.to || (sub.to !== '/admin/products' && location.pathname.startsWith(sub.to)) ? 'bg-cyan-500/20 text-cyan-400 font-bold border border-cyan-500/20 shadow-[0_0_10px_rgba(34,211,238,0.1)]' : 'text-white/50 hover:text-white hover:bg-white/5'}`}
                                >
                                    {sub.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                )}
            </li>
        );
    }

    return (
        <li className="mb-1">
            <Link
                to={to}
                onClick={() => setIsSidebarOpen(false)}
                className={`flex items-center justify-between px-4 py-3.5 rounded-2xl cursor-pointer transition-all ${active ? 'bg-white/10 text-white font-bold' : 'text-white/50 hover:text-white hover:bg-white/5'}`}
            >
                <div className="flex items-center gap-4">
                    <span className="text-xl">{icon}</span>
                    <span className="text-sm tracking-wide">{label}</span>
                </div>
            </Link>
        </li>
    );
};

export default AdminSidebar;
