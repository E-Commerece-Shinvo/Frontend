import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    FiSearch, FiFilter, FiArchive, FiAlertTriangle,
    FiCheckCircle, FiChevronLeft, FiChevronRight,
    FiEdit3, FiTrendingDown, FiBox, FiArrowLeft
} from 'react-icons/fi';
import { getProducts, updateProduct } from '../../api/products';
import toast from 'react-hot-toast';
import { FiX } from 'react-icons/fi';
import AdminPagination from '../../components/admin/AdminPagination';

const AdminInventory = () => {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all'); // all, low, out
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;

    // Edit Modal State
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [newStock, setNewStock] = useState(0);
    const [updating, setUpdating] = useState(false);

    useEffect(() => {
        fetchInventory();
    }, []);

    const fetchInventory = async () => {
        setLoading(true);
        try {
            // Fetch all products for inventory management
            const data = await getProducts({ limit: 1000 }); // Get many to calculate stats accurately
            setProducts(data.products || []);
        } catch (error) {
            console.error("Failed to fetch inventory:", error);
            toast.error("Failed to load inventory data");
        } finally {
            setLoading(false);
        }
    };

    const handleEditClick = (product) => {
        setSelectedProduct(product);
        setNewStock(product.stock);
        setIsEditModalOpen(true);
    };

    const handleUpdateStock = async (e) => {
        e.preventDefault();
        setUpdating(true);
        try {
            await updateProduct(selectedProduct._id, { stock: Number(newStock) });
            toast.success("Stock updated successfully!");
            setIsEditModalOpen(false);
            fetchInventory();
        } catch (error) {
            console.error("Failed to update stock:", error);
            toast.error(error.response?.data?.message || "Failed to update stock");
        } finally {
            setUpdating(false);
        }
    };

    // Calculate Stats
    const stats = useMemo(() => {
        const total = products.length;
        const lowStock = products.filter(p => p.stock > 0 && p.stock <= 10).length;
        const outOfStock = products.filter(p => p.stock === 0).length;
        const totalValue = products.reduce((acc, p) => acc + (p.price * p.stock), 0);

        return { total, lowStock, outOfStock, totalValue };
    }, [products]);

    // Filtering & Searching
    const filteredProducts = useMemo(() => {
        return products.filter(p => {
            const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                p.brand.toLowerCase().includes(searchTerm.toLowerCase());

            if (filterStatus === 'low') return matchesSearch && p.stock > 0 && p.stock <= 10;
            if (filterStatus === 'out') return matchesSearch && p.stock === 0;
            return matchesSearch;
        });
    }, [products, searchTerm, filterStatus]);

    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
    const paginatedProducts = filteredProducts.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );



    const getStockStatus = (stock) => {
        if (stock === 0) return { label: 'Out of Stock', color: 'text-red-600 bg-red-50 border-red-100', icon: <FiXCircle className="text-[10px]" /> };
        if (stock <= 10) return { label: 'Low Stock', color: 'text-orange-600 bg-orange-50 border-orange-100', icon: <FiAlertTriangle className="text-[10px]" /> };
        return { label: 'In Stock', color: 'text-teal-600 bg-teal-50 border-teal-100', icon: <FiCheckCircle className="text-[10px]" /> };
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Header section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white p-8 rounded-[32px] shadow-sm border border-gray-50">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="w-12 h-12 flex items-center justify-center bg-gray-50 hover:bg-gray-100 rounded-2xl text-gray-400 hover:text-gray-900 transition-all group"
                    >
                        <FiArrowLeft className="group-hover:-translate-x-1 transition-transform" />
                    </button>
                    <div>
                        <h1 className="text-3xl font-black tracking-tight text-gray-900">Inventory Management</h1>
                        <p className="text-gray-400 text-sm font-medium mt-1 uppercase tracking-widest flex items-center gap-2">
                            Stock & Logistics <span className="w-1 h-1 bg-gray-300 rounded-full"></span> {filteredProducts.length} Items
                        </p>
                    </div>
                </div>
                <div className="relative w-full md:w-96 group">
                    <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-cyan-500 transition-colors" />
                    <input
                        type="text"
                        placeholder="Search products, SKU or brand..."
                        className="w-full pl-12 pr-4 py-4 bg-gray-50 border-transparent focus:bg-white focus:border-cyan-200 rounded-[20px] text-sm font-medium transition-all outline-none"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <InventoryStatCard
                    label="Total Products"
                    value={stats.total}
                    icon={<FiBox />}
                    color="bg-[#001B1B]"
                    desc="Total unique products in catalog"
                />
                <InventoryStatCard
                    label="Low Stock Alert"
                    value={stats.lowStock}
                    icon={<FiTrendingDown />}
                    color="bg-orange-500"
                    desc="Products with less than 10 units"
                    warning={stats.lowStock > 0}
                />
                <InventoryStatCard
                    label="Out of Stock"
                    value={stats.outOfStock}
                    icon={<FiAlertTriangle />}
                    color="bg-red-500"
                    desc="Products currently unavailable"
                    danger={stats.outOfStock > 0}
                />
                <InventoryStatCard
                    label="Stock Value"
                    value={`Rs. ${stats.totalValue.toLocaleString()}`}
                    icon={<FiArchive />}
                    color="bg-cyan-500"
                    desc="Total approximate value of stock"
                />
            </div>

            {/* Main Content Area */}
            <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden flex flex-col h-[850px]">
                <div className="p-8 border-b border-gray-50 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-3">
                        <div className="w-2 h-8 bg-cyan-500 rounded-full"></div>
                        <h3 className="text-xl font-bold text-gray-900">Product Stock List</h3>
                    </div>

                    {/* Filters */}
                    <div className="flex items-center gap-2 bg-gray-50 p-1.5 rounded-2xl">
                        {['all', 'low', 'out'].map((s) => (
                            <button
                                key={s}
                                onClick={() => setFilterStatus(s)}
                                className={`px-5 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${filterStatus === s
                                    ? 'bg-white text-gray-900 shadow-sm'
                                    : 'text-gray-400 hover:text-gray-600'
                                    }`}
                            >
                                {s === 'all' ? 'All Items' : s === 'low' ? 'Low Stock' : 'Out of Stock'}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="overflow-auto flex-1 custom-scrollbar">
                    {/* Mobile/Tablet View: Product Cards */}
                    <div className="lg:hidden divide-y divide-gray-50">
                        {loading ? (
                            <div className="py-20 text-center">
                                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-cyan-500 mx-auto"></div>
                            </div>
                        ) : paginatedProducts.length === 0 ? (
                            <div className="py-20 text-center text-gray-400 font-bold uppercase tracking-widest">
                                No products match your criteria
                            </div>
                        ) : (
                            paginatedProducts.map((p) => {
                                const status = getStockStatus(p.stock);
                                return (
                                    <div key={p._id} className="p-6 space-y-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-16 h-16 bg-white border border-gray-100 rounded-2xl p-2 flex items-center justify-center shrink-0">
                                                <img
                                                    src={p.image || p.images?.[0] || 'https://via.placeholder.com/60'}
                                                    alt={p.title}
                                                    className="w-full h-full object-contain"
                                                />
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <h4 className="text-sm font-black text-gray-900 truncate uppercase tracking-tight">{p.title}</h4>
                                                <p className="text-[10px] text-gray-400 font-bold uppercase mt-1 tracking-widest">{p.brand}</p>
                                            </div>
                                            <span className={`px-2 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest border shrink-0 ${status.color}`}>
                                                {status.label}
                                            </span>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4 bg-gray-50/50 p-4 rounded-2xl">
                                            <div className="flex flex-col">
                                                <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Price</span>
                                                <span className="text-xs font-bold text-gray-900">Rs. {p.price.toLocaleString()}</span>
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Category</span>
                                                <span className="text-xs font-bold text-gray-700 truncate">
                                                    {typeof p.category === 'object' ? p.category?.name : 'General'}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between gap-6 pt-2">
                                            <div className="flex-1 space-y-2">
                                                <div className="flex justify-between items-end">
                                                    <span className={`text-base font-black ${p.stock <= 10 ? 'text-orange-500' : 'text-gray-900'}`}>
                                                        {p.stock} Units
                                                    </span>
                                                </div>
                                                <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                                    <div
                                                        className={`h-full rounded-full ${p.stock === 0 ? 'bg-red-500' : p.stock <= 10 ? 'bg-orange-500' : 'bg-cyan-500'}`}
                                                        style={{ width: `${Math.min(p.stock, 100)}%` }}
                                                    ></div>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => handleEditClick(p)}
                                                className="p-4 bg-[#001B1B] text-white rounded-2xl shadow-xl shadow-black/10 transition-all active:scale-95"
                                            >
                                                <FiEdit3 className="text-lg" />
                                            </button>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>

                    {/* Desktop View: Full Table */}
                    <div className="hidden lg:block overflow-x-auto">
                        <table className="w-full min-w-[1000px]">
                            <thead>
                                <tr className="bg-gray-50/50 text-[11px] text-gray-400 uppercase tracking-[0.2em] font-black">
                                    <th className="px-8 py-5 text-left">Product Details</th>
                                    <th className="px-8 py-5 text-left">Category</th>
                                    <th className="px-8 py-5 text-left">Price</th>
                                    <th className="px-8 py-5 text-left">Current Stock</th>
                                    <th className="px-8 py-5 text-left">Status</th>
                                    <th className="px-8 py-5 text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {loading ? (
                                    <tr>
                                        <td colSpan="6" className="py-20 text-center">
                                            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-cyan-500 mx-auto"></div>
                                        </td>
                                    </tr>
                                ) : paginatedProducts.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="py-20 text-center text-gray-400 font-bold uppercase tracking-widest">
                                            No products match your criteria
                                        </td>
                                    </tr>
                                ) : (
                                    paginatedProducts.map((p) => {
                                        const status = getStockStatus(p.stock);
                                        return (
                                            <tr key={p._id} className="group hover:bg-gray-50/50 transition-all">
                                                <td className="px-8 py-6">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-16 h-16 bg-white border border-gray-100 rounded-2xl p-2 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                                                            <img
                                                                src={p.image || p.images?.[0] || 'https://via.placeholder.com/60'}
                                                                alt={p.title}
                                                                className="w-full h-full object-contain"
                                                            />
                                                        </div>
                                                        <div className="min-w-0">
                                                            <h4 className="text-sm font-bold text-gray-900 truncate uppercase tracking-tight">{p.title}</h4>
                                                            <p className="text-[10px] text-gray-400 font-bold uppercase mt-1 tracking-widest">{p.brand}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <span className="text-[11px] font-black uppercase text-gray-400 tracking-widest">
                                                        {typeof p.category === 'object' ? p.category?.name : 'General'}
                                                    </span>
                                                </td>
                                                <td className="px-8 py-6 font-black text-gray-900 text-sm">
                                                    Rs. {p.price.toLocaleString()}
                                                </td>
                                                <td className="px-8 py-6">
                                                    <div className="space-y-2">
                                                        <div className="flex justify-between items-end">
                                                            <span className={`text-lg font-black ${p.stock <= 10 ? 'text-orange-500' : 'text-gray-900'}`}>
                                                                {p.stock}
                                                            </span>
                                                            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">Units</span>
                                                        </div>
                                                        <div className="w-24 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                                            <div
                                                                className={`h-full rounded-full ${p.stock === 0 ? 'bg-red-500' : p.stock <= 10 ? 'bg-orange-500' : 'bg-cyan-500'}`}
                                                                style={{ width: `${Math.min(p.stock, 100)}%` }}
                                                            ></div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <span className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest border flex items-center gap-2 w-fit ${status.color}`}>
                                                        {status.icon} {status.label}
                                                    </span>
                                                </td>
                                                <td className="px-8 py-6 text-center">
                                                    <button
                                                        onClick={() => handleEditClick(p)}
                                                        className="p-3 bg-white hover:bg-gray-900 text-gray-400 hover:text-white rounded-xl shadow-sm border border-gray-100 transition-all hover:scale-110 active:scale-95"
                                                        title="Quick Edit Stock"
                                                    >
                                                        <FiEdit3 className="text-lg" />
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                <AdminPagination 
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                    totalItems={filteredProducts.length}
                    itemsPerPage={itemsPerPage}
                    itemName="products"
                />
            </div>

            {/* Edit Stock Modal */}
            {isEditModalOpen && selectedProduct && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-[#001B1B]/40 backdrop-blur-md animate-in fade-in duration-300" onClick={() => !updating && setIsEditModalOpen(false)}></div>
                    <div className="bg-white w-full max-w-md rounded-[40px] shadow-2xl relative z-10 overflow-hidden animate-in zoom-in-95 duration-300">
                        {/* Modal Header */}
                        <div className="bg-[#001B1B] p-8 text-white">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="text-2xl font-black tracking-tight">Update Stock</h3>
                                    <p className="text-cyan-400/80 text-[10px] font-bold uppercase tracking-[0.2em] mt-1">Quick Inventory Adjustment</p>
                                </div>
                                <button
                                    onClick={() => setIsEditModalOpen(false)}
                                    className="p-2 hover:bg-white/10 rounded-xl transition-all"
                                >
                                    <FiX className="text-xl" />
                                </button>
                            </div>
                        </div>

                        {/* Modal Body */}
                        <form onSubmit={handleUpdateStock} className="p-8 space-y-8">
                            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-3xl border border-gray-100">
                                <div className="w-16 h-16 bg-white rounded-2xl p-2 flex items-center justify-center shrink-0 shadow-sm">
                                    <img
                                        src={selectedProduct.image || selectedProduct.images?.[0] || 'https://via.placeholder.com/60'}
                                        alt={selectedProduct.title}
                                        className="w-full h-full object-contain"
                                    />
                                </div>
                                <div className="min-w-0">
                                    <h4 className="text-sm font-black text-gray-900 truncate uppercase tracking-tight">{selectedProduct.title}</h4>
                                    <p className="text-[10px] text-gray-400 font-bold uppercase mt-1 tracking-widest">{selectedProduct.brand}</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Quantity in Stock</label>
                                <div className="relative group">
                                    <FiBox className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-cyan-500 transition-colors text-xl" />
                                    <input
                                        type="number"
                                        required
                                        min="0"
                                        className="w-full pl-14 pr-6 py-5 bg-gray-50 border-2 border-transparent focus:bg-white focus:border-cyan-100 rounded-[24px] text-lg font-black transition-all outline-none"
                                        value={newStock}
                                        onChange={(e) => setNewStock(e.target.value)}
                                        placeholder="Enter new quantity..."
                                        autoFocus
                                    />
                                </div>
                                <div className="flex items-center gap-2 px-2">
                                    <FiAlertTriangle className={`text-xs ${newStock <= 10 ? 'text-orange-500' : 'text-gray-300'}`} />
                                    <p className="text-[10px] text-gray-400 font-medium">
                                        {newStock <= 0 ? 'This will mark the product as OUT OF STOCK' :
                                            newStock <= 10 ? 'Low stock alert will be triggered' :
                                                'Product will be marked as IN STOCK'}
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-4 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setIsEditModalOpen(false)}
                                    className="flex-1 py-5 rounded-[24px] text-xs font-black uppercase tracking-widest text-gray-400 hover:text-gray-900 hover:bg-gray-50 transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={updating}
                                    className="flex-1 py-5 bg-gradient-to-r from-[#001B1B] to-[#006060] text-white rounded-[24px] text-xs font-black uppercase tracking-widest shadow-xl shadow-black/20 transition-all hover:from-[#002B2B] hover:to-[#008080] active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3"
                                >
                                    {updating ? (
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    ) : 'Update Stock'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

const InventoryStatCard = ({ label, value, icon, color, desc, warning, danger }) => (
    <div className={`bg-white rounded-[32px] p-8 shadow-sm border ${danger ? 'border-red-100 bg-red-50/20' : warning ? 'border-orange-100 bg-orange-50/20' : 'border-gray-50'} flex flex-col gap-6 group hover:shadow-xl hover:shadow-cyan-400/5 transition-all`}>
        <div className="flex items-center justify-between">
            <div className={`w-14 h-14 rounded-2xl ${color} text-white flex items-center justify-center text-2xl shadow-xl transition-transform group-hover:scale-110`}>
                {icon}
            </div>
            {danger && <div className="px-3 py-1 bg-red-500 text-white text-[9px] font-black uppercase tracking-widest rounded-full animate-pulse">Critical</div>}
            {warning && !danger && <div className="px-3 py-1 bg-orange-500 text-white text-[9px] font-black uppercase tracking-widest rounded-full animate-pulse">Attention</div>}
        </div>
        <div>
            <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-1">{label}</p>
            <h4 className="text-3xl font-black text-gray-900 tracking-tight">{value}</h4>
            <p className="text-[10px] text-gray-400 mt-2 font-medium">{desc}</p>
        </div>
    </div>
);

const FiXCircle = ({ className }) => (
    <svg className={className} stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="15" y1="9" x2="9" y2="15"></line>
        <line x1="9" y1="9" x2="15" y2="15"></line>
    </svg>
);

export default AdminInventory;
