import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSearch, FiPlus, FiMoreVertical, FiChevronLeft, FiChevronRight, FiEdit, FiTrash2 } from 'react-icons/fi';
import { getProducts, deleteProduct } from '../../api/products';
import { getCategories } from '../../api/categories';
import toast from 'react-hot-toast';
import AdminPagination from '../../components/admin/AdminPagination';

const AdminProducts = () => {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalProducts, setTotalProducts] = useState(0);
    const limit = 5;

    // Action Dropdown State
    const [openDropdownId, setOpenDropdownId] = useState(null);

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

    useEffect(() => {
        fetchProducts(page);
    }, [page]);

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                await deleteProduct(id);
                toast.success('Product deleted successfully');
                fetchProducts(page);
                setOpenDropdownId(null);
            } catch (error) {
                console.error("Failed to delete product:", error);
                toast.error('Failed to delete product');
            }
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



    return (
        <>

            <div className="bg-white rounded-xl shadow-sm border border-gray-50 flex flex-col p-6 h-[850px]">
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
                            onClick={() => navigate('/admin/products/add')}
                            className="bg-gradient-to-r from-[#001B1B] to-[#006060] text-white w-11 h-11 md:w-auto md:h-auto md:px-5 md:py-2.5 rounded-lg flex items-center justify-center gap-2 font-bold text-sm transition-all shadow-lg shadow-black/20 hover:from-[#002B2B] hover:to-[#008080] active:scale-95 whitespace-nowrap shrink-0"
                            title="Add new Product"
                        >
                            <FiPlus className="text-xl shrink-0" />
                            <span className="hidden md:inline">Add new Product</span>
                        </button>
                    </div>
                </div>

                {/* Responsive Table Container */}
                <div className="w-full overflow-auto pb-4 custom-scrollbar flex-1">
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
                                            <div className="w-20 shrink-0 flex justify-center relative">
                                                <button 
                                                    onClick={() => setOpenDropdownId(openDropdownId === product._id ? null : product._id)}
                                                    className="p-2 hover:bg-gray-200 rounded-lg transition-colors text-gray-500"
                                                >
                                                    <FiMoreVertical className="text-xl" />
                                                </button>
                                                
                                                {/* Dropdown Menu */}
                                                {openDropdownId === product._id && (
                                                    <>
                                                        <div className="fixed inset-0 z-10" onClick={() => setOpenDropdownId(null)}></div>
                                                        <div className="absolute right-8 top-2 w-36 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-20 animate-in fade-in zoom-in-95 duration-200">
                                                            <button 
                                                                onClick={() => navigate(`/admin/products/edit/${product._id}`)}
                                                                className="w-full px-4 py-2.5 text-left text-sm font-bold text-gray-700 hover:bg-gray-50 hover:text-cyan-600 flex items-center gap-2 transition-colors"
                                                            >
                                                                <FiEdit className="text-base" />
                                                                Update
                                                            </button>
                                                            <button 
                                                                onClick={() => handleDelete(product._id)}
                                                                className="w-full px-4 py-2.5 text-left text-sm font-bold text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors"
                                                            >
                                                                <FiTrash2 className="text-base" />
                                                                Delete
                                                            </button>
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <AdminPagination 
                    currentPage={page}
                    totalPages={totalPages}
                    onPageChange={setPage}
                    totalItems={totalProducts}
                    itemsPerPage={limit}
                    itemName="products"
                />
            </div>
        </>
    );
};

export default AdminProducts;
