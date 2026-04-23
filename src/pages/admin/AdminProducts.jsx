import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';
import { FiSearch, FiPlus, FiMoreVertical, FiChevronLeft, FiChevronRight, FiX, FiSave } from 'react-icons/fi';
import { getProducts, createProduct } from '../../api/products';
import { getCategories } from '../../api/categories';

const AdminProducts = () => {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalProducts, setTotalProducts] = useState(0);
    const limit = 5;

    // Modal State
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [categories, setCategories] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        brand: '',
        price: '',
        stock: 100,
        category: '',
        image: ''
    });

    const fetchProducts = async (currentPage) => {
        setLoading(true);
        try {
            const data = await getProducts({ page: currentPage, limit });
            setProducts(data.products || []);
            setTotalPages(data.totalPages || 1);
            setTotalProducts(data.total || 0);
        } catch (error) {
            console.error("Failed to get products:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const cats = await getCategories();
            setCategories(cats);
            if (cats.length > 0) {
                setFormData(prev => ({ ...prev, category: cats[0]._id }));
            }
        } catch (error) {
            console.error("Failed to load categories:", error);
        }
    };

    useEffect(() => {
        fetchProducts(page);
    }, [page]);

    // Open Modal and load categories lazily
    const handleOpenModal = () => {
        setIsAddModalOpen(true);
        if (categories.length === 0) {
            fetchCategories();
        }
    };

    const handleModalInput = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleAddProduct = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await createProduct({
                ...formData,
                price: Number(formData.price),
                stock: Number(formData.stock)
            });
            setIsAddModalOpen(false);
            setFormData({ title: '', brand: '', price: '', stock: 100, category: categories[0]?._id || '', image: '' });
            fetchProducts(page); // refresh list
        } catch (error) {
            console.error("Failed to add product:", error);
            alert("Error adding product");
        } finally {
            setIsSubmitting(false);
        }
    };

    const getStockBadge = (stock) => {
        if (stock > 5) {
            return (
                <div className="bg-green-100 text-green-600 font-bold px-4 py-1.5 rounded-full text-xs whitespace-nowrap">
                    {stock} in Stock
                </div>
            );
        }
        return (
            <div className="bg-yellow-100 text-yellow-600 font-bold px-4 py-1.5 rounded-full text-xs whitespace-nowrap">
                {stock} Low Stock
            </div>
        );
    };

    const getPageNumbers = () => {
        let pages = [];
        if (totalPages <= 5) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            if (page <= 3) {
                pages = [1, 2, 3, 4, '...', totalPages];
            } else if (page >= totalPages - 2) {
                pages = [1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
            } else {
                pages = [1, '...', page - 1, page, page + 1, '...', totalPages];
            }
        }
        return pages;
    };

    return (
        <AdminLayout>
            {/* Add Product Modal */}
            {isAddModalOpen && (
                <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm transition-all">
                    <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                        <div className="flex justify-between items-center p-6 border-b border-gray-100">
                            <h2 className="text-2xl font-bold text-gray-900">Add New Product</h2>
                            <button onClick={() => setIsAddModalOpen(false)} className="p-2 text-gray-400 hover:text-gray-900 bg-gray-50 hover:bg-gray-100 rounded-full transition-colors">
                                <FiX className="text-xl" />
                            </button>
                        </div>

                        <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
                            <form id="add-product-form" onSubmit={handleAddProduct} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2 md:col-span-2">
                                    <label className="text-sm font-bold text-gray-700">Product Title</label>
                                    <input required type="text" name="title" value={formData.title} onChange={handleModalInput} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-cyan-400 outline-none transition-all placeholder-gray-400" placeholder="Enter full product name" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700">Brand</label>
                                    <input required type="text" name="brand" value={formData.brand} onChange={handleModalInput} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-cyan-400 outline-none transition-all placeholder-gray-400" placeholder="e.g. Samsung" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700">Price (Rs.)</label>
                                    <input required type="number" min="0" name="price" value={formData.price} onChange={handleModalInput} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-cyan-400 outline-none transition-all placeholder-gray-400" placeholder="e.g. 5300" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700">Category</label>
                                    <select required name="category" value={formData.category} onChange={handleModalInput} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-cyan-400 outline-none transition-all">
                                        <option value="" disabled>Select category...</option>
                                        {categories.map(cat => (
                                            <option key={cat._id} value={cat._id}>{cat.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700">Initial Stock</label>
                                    <input required type="number" min="0" name="stock" value={formData.stock} onChange={handleModalInput} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-cyan-400 outline-none transition-all placeholder-gray-400" placeholder="Available units" />
                                </div>
                                <div className="space-y-2 md:col-span-2">
                                    <label className="text-sm font-bold text-gray-700">Image URL</label>
                                    <input type="url" name="image" value={formData.image} onChange={handleModalInput} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-cyan-400 outline-none transition-all placeholder-gray-400" placeholder="https://example.com/image.jpg" />
                                </div>
                            </form>
                        </div>

                        <div className="bg-gray-50 p-6 border-t border-gray-100 flex justify-end gap-3 rounded-b-2xl">
                            <button onClick={() => setIsAddModalOpen(false)} className="px-6 py-2.5 rounded-xl font-bold text-sm text-gray-600 hover:bg-gray-200 transition-colors">
                                Cancel
                            </button>
                            <button type="submit" form="add-product-form" disabled={isSubmitting} className="bg-cyan-500 hover:bg-cyan-600 text-white font-bold px-6 py-2.5 rounded-xl flex items-center gap-2 transition-colors text-sm shadow-sm disabled:opacity-50">
                                {isSubmitting ? <span className="animate-spin h-4 w-4 border-2 border-white/30 border-t-white rounded-full"></span> : <FiSave />}
                                {isSubmitting ? 'Saving...' : 'Save Product'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="bg-white rounded-xl shadow-sm border border-gray-50 flex flex-col p-6 min-h-[calc(100vh-160px)]">
                {/* Header Area */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight text-gray-900 mb-1">Products List</h2>
                        <div className="text-xs font-medium text-gray-400">
                            <span className="text-cyan-500 cursor-pointer hover:underline" onClick={() => navigate('/admin/dashboard')}>Dashboard</span>
                            <span className="mx-2">&gt;</span>
                            <span>Products List</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 w-full md:w-auto">
                        <div className="relative flex-1 md:w-80">
                            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
                            <input
                                type="text"
                                placeholder="Search products by name or SKU"
                                className="w-full bg-gray-100 border-0 rounded-lg py-2.5 pl-12 pr-4 text-sm focus:ring-2 focus:ring-cyan-400 transition-all outline-none font-medium text-gray-700 placeholder-gray-400"
                            />
                        </div>
                        <button
                            onClick={handleOpenModal}
                            className="border-2 border-cyan-400 text-cyan-500 hover:bg-cyan-50 w-11 h-11 md:w-auto md:h-auto md:px-5 md:py-2 rounded-lg flex items-center justify-center gap-2 font-bold text-sm transition-all whitespace-nowrap shrink-0"
                            title="Add new Product"
                        >
                            <FiPlus className="text-xl shrink-0" />
                            <span className="hidden md:inline">Add new Product</span>
                        </button>
                    </div>
                </div>

                {/* Responsive Table Container */}
                <div className="w-full overflow-x-auto pb-4 custom-scrollbar">
                    <div className="min-w-[850px]">
                        {/* Table Header */}
                        <div className="bg-gray-100 rounded-xl px-6 py-4 flex items-center mb-4">
                            <div className="w-12 shrink-0">
                                <input type="checkbox" className="w-5 h-5 rounded border-gray-300 text-cyan-500 focus:ring-cyan-500" />
                            </div>
                            <div className="flex-1 min-w-[200px] font-bold text-gray-900 text-sm">Product</div>
                            <div className="w-40 shrink-0 font-bold text-gray-900 text-sm">Category</div>
                            <div className="w-32 shrink-0 font-bold text-gray-900 text-sm">Price</div>
                            <div className="w-40 shrink-0 font-bold text-gray-900 text-sm">Stock Status</div>
                            <div className="w-20 shrink-0 font-bold text-gray-900 text-sm text-center">Action</div>
                        </div>

                        {/* Table Body */}
                        <div className="flex-1">
                            {loading ? (
                                <div className="flex justify-center items-center py-20">
                                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500"></div>
                                </div>
                            ) : products.length === 0 ? (
                                <div className="text-center py-10 text-gray-500 font-medium">No products found.</div>
                            ) : (
                                <div className="space-y-4">
                                    {products.map((product) => (
                                        <div key={product._id} className="border-b border-gray-100 pb-4 last:border-0 flex items-center px-6 py-2 group hover:bg-gray-50 rounded-xl transition-colors">
                                            <div className="w-12 shrink-0">
                                                <input type="checkbox" className="w-5 h-5 rounded border-gray-300 text-cyan-500 focus:ring-cyan-500" />
                                            </div>
                                            <div className="flex-1 min-w-[200px] flex items-center gap-4">
                                                <div className="w-16 h-16 bg-gray-100 rounded-xl overflow-hidden border border-gray-200 flex items-center justify-center p-1 shrink-0">
                                                    {product.image || product.images?.[0] ? (
                                                        <img src={product.image || product.images?.[0]} alt={product.title} className="w-full h-full object-cover rounded-lg" />
                                                    ) : (
                                                        <span className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">No Img</span>
                                                    )}
                                                </div>
                                                <div className="font-bold text-sm text-gray-900 max-w-[250px] leading-snug">
                                                    {product.title}
                                                </div>
                                            </div>
                                            <div className="w-40 shrink-0 text-sm text-gray-600 font-medium whitespace-nowrap overflow-hidden text-ellipsis">
                                                {typeof product.category === 'object' ? product.category?.name || 'Uncategorized' : 'Uncategorized'}
                                            </div>
                                            <div className="w-32 shrink-0 font-bold text-sm text-gray-900 whitespace-nowrap">
                                                Rs. {product.price}
                                            </div>
                                            <div className="w-40 shrink-0 flex items-center">
                                                {getStockBadge(product.stock)}
                                            </div>
                                            <div className="w-20 shrink-0 flex justify-center">
                                                <button className="p-2 hover:bg-gray-200 rounded-lg transition-colors text-gray-500">
                                                    <FiMoreVertical className="text-xl" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Pagination */}
                <div className="mt-8 flex flex-col sm:flex-row justify-between items-center gap-4 pt-6 border-t border-gray-100">
                    <div className="text-xs font-medium text-gray-500">
                        Showing {Math.min((page - 1) * limit + 1, totalProducts || 0)} to {Math.min(page * limit, totalProducts || 0)} of {totalProducts || 0} products
                    </div>
                    {totalPages > 1 && (
                        <div className="flex flex-nowrap items-center justify-center gap-1 md:gap-1.5 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0 custom-scrollbar">
                            <button
                                disabled={page === 1}
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                className="p-1 text-gray-400 hover:text-gray-900 transition-colors disabled:opacity-50 shrink-0"
                            >
                                <FiChevronLeft className="text-lg" />
                            </button>

                            {getPageNumbers().map((num, idx) => {
                                if (num === '...') {
                                    return <span key={`ellipsis-${idx}`} className="text-gray-400 text-xs tracking-wider mx-0.5 md:mx-1 shrink-0">...</span>;
                                }
                                return (
                                    <button
                                        key={num}
                                        onClick={() => setPage(num)}
                                        className={`w-7 h-7 md:w-8 md:h-8 flex items-center justify-center rounded-full font-bold text-[10px] md:text-xs transition-colors shrink-0 ${page === num ? 'border border-gray-300 text-gray-900 bg-white shadow-sm' : 'text-gray-500 hover:bg-gray-100'}`}
                                    >
                                        {num}
                                    </button>
                                );
                            })}

                            <button
                                disabled={page === totalPages}
                                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                className="p-1 text-gray-400 hover:text-gray-900 transition-colors disabled:opacity-50 shrink-0"
                            >
                                <FiChevronRight className="text-lg" />
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
};

export default AdminProducts;
