import React, { useState, useEffect, useMemo } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar/Navbar';
import Footer from '../../components/layout/Footer/Footer';
import { getProducts } from '../../api/products';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import {
    FiSearch, FiShoppingCart, FiChevronLeft, FiChevronRight,
    FiGrid, FiList, FiFilter, FiX, FiStar, FiPackage
} from 'react-icons/fi';
import toast from 'react-hot-toast';

const PRODUCTS_PER_PAGE = 12;

const SORT_OPTIONS = [
    { value: '', label: 'Relevance' },
    { value: 'price_asc', label: 'Price: Low to High' },
    { value: 'price_desc', label: 'Price: High to Low' },
    { value: 'rating', label: 'Top Rated' },
    { value: 'name', label: 'Name: A-Z' },
];

function SearchResults() {
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const { isLoggedIn } = useAuth();

    const query = searchParams.get('q') || '';
    const currentPage = parseInt(searchParams.get('page') || '1', 10);
    const currentSort = searchParams.get('sort') || '';
    const currentMinPrice = searchParams.get('minPrice') || '';
    const currentMaxPrice = searchParams.get('maxPrice') || '';

    const [products, setProducts] = useState([]);
    const [totalProducts, setTotalProducts] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'
    const [showMobileFilters, setShowMobileFilters] = useState(false);

    // Local filter inputs (committed on apply)
    const [localMinPrice, setLocalMinPrice] = useState(currentMinPrice);
    const [localMaxPrice, setLocalMaxPrice] = useState(currentMaxPrice);
    const [localSort, setLocalSort] = useState(currentSort);

    // Sync local state with URL params
    useEffect(() => {
        setLocalMinPrice(currentMinPrice);
        setLocalMaxPrice(currentMaxPrice);
        setLocalSort(currentSort);
    }, [currentMinPrice, currentMaxPrice, currentSort]);

    // Fetch products whenever search params change
    useEffect(() => {
        const fetchSearchResults = async () => {
            if (!query.trim()) {
                setProducts([]);
                setTotalProducts(0);
                setTotalPages(1);
                setLoading(false);
                return;
            }

            setLoading(true);
            try {
                const params = {
                    search: query.trim(),
                    page: currentPage,
                    limit: PRODUCTS_PER_PAGE,
                };
                if (currentSort) params.sort = currentSort;
                if (currentMinPrice) params.minPrice = currentMinPrice;
                if (currentMaxPrice) params.maxPrice = currentMaxPrice;

                const data = await getProducts(params);
                setProducts(data.products || []);
                setTotalProducts(data.total || 0);
                setTotalPages(data.totalPages || 1);
            } catch (error) {
                console.error('Search failed:', error);
                setProducts([]);
                setTotalProducts(0);
            } finally {
                setLoading(false);
            }
        };

        fetchSearchResults();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [query, currentPage, currentSort, currentMinPrice, currentMaxPrice]);

    const updateParams = (updates) => {
        const newParams = new URLSearchParams(searchParams);
        Object.entries(updates).forEach(([key, value]) => {
            if (value) {
                newParams.set(key, value);
            } else {
                newParams.delete(key);
            }
        });
        setSearchParams(newParams);
    };

    const handleSortChange = (sortValue) => {
        updateParams({ sort: sortValue, page: '1' });
    };

    const handleApplyPriceFilter = () => {
        updateParams({
            minPrice: localMinPrice,
            maxPrice: localMaxPrice,
            page: '1'
        });
        setShowMobileFilters(false);
    };

    const handleClearFilters = () => {
        setLocalMinPrice('');
        setLocalMaxPrice('');
        setLocalSort('');
        updateParams({
            sort: '',
            minPrice: '',
            maxPrice: '',
            page: '1'
        });
    };

    const goToPage = (page) => {
        if (page >= 1 && page <= totalPages) {
            updateParams({ page: String(page) });
        }
    };

    const pageNumbers = useMemo(() => {
        const pages = [];
        let start = Math.max(1, currentPage - 2);
        let end = Math.min(totalPages, start + 4);
        if (end - start < 4) start = Math.max(1, end - 4);
        for (let i = start; i <= end; i++) pages.push(i);
        return pages;
    }, [currentPage, totalPages]);

    const handleAddToCart = (product) => {
        if (!isLoggedIn) {
            navigate('/login');
            return;
        }
        addToCart({
            id: product._id,
            name: product.title,
            price: product.price,
            image: product.image || product.images?.[0] || '',
            variant: `Color: ${product.colors?.[0] || 'Default'}, Power: ${product.powerOptions?.[0] || 'Standard'}`
        });
        toast.success(`${product.title} added to cart!`);
    };

    const hasActiveFilters = currentSort || currentMinPrice || currentMaxPrice;

    return (
        <div className="min-h-screen flex flex-col bg-[#f5f5f5]">
            <Navbar />

            {/* Spacer for navbar */}
            <div className="h-[90px] md:h-[110px]" />

            {/* ── Search Header Strip ── */}
            <div className="bg-white border-b border-gray-100 shadow-sm">
                <div className="max-w-[1400px] mx-auto px-3 sm:px-4 py-3 sm:py-4 md:py-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 sm:gap-3">
                        <div>
                            {query ? (
                                <>
                                    <h1 className="text-base sm:text-xl md:text-2xl font-extrabold text-gray-900 tracking-tight">
                                        Search Results for "<span className="text-[#53C1CC]">{query}</span>"
                                    </h1>
                                    <p className="text-gray-500 text-[12px] sm:text-[13px] mt-0.5">
                                        {loading ? 'Searching...' : `${totalProducts} product${totalProducts !== 1 ? 's' : ''} found`}
                                    </p>
                                </>
                            ) : (
                                <h1 className="text-base sm:text-xl md:text-2xl font-extrabold text-gray-900 tracking-tight">
                                    Search Products
                                </h1>
                            )}
                        </div>

                        <div className="flex items-center gap-2 sm:gap-3">
                            {/* View Mode Toggle */}
                            <div className="hidden md:flex items-center bg-gray-100 rounded-xl p-1">
                                <button
                                    onClick={() => setViewMode('grid')}
                                    className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white shadow-sm text-[#53C1CC]' : 'text-gray-400 hover:text-gray-600'}`}
                                >
                                    <FiGrid size={18} />
                                </button>
                                <button
                                    onClick={() => setViewMode('list')}
                                    className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white shadow-sm text-[#53C1CC]' : 'text-gray-400 hover:text-gray-600'}`}
                                >
                                    <FiList size={18} />
                                </button>
                            </div>

                            {/* Sort Dropdown */}
                            <div className="relative flex-1 sm:flex-none">
                                <select
                                    value={currentSort}
                                    onChange={(e) => handleSortChange(e.target.value)}
                                    className="appearance-none w-full sm:w-auto bg-white border border-gray-200 rounded-xl px-3 sm:px-4 py-2 sm:py-2.5 pr-8 sm:pr-10 text-[12px] sm:text-[13px] font-medium text-gray-700 outline-none focus:border-[#53C1CC] focus:ring-2 focus:ring-[#53C1CC]/10 transition-all cursor-pointer"
                                >
                                    {SORT_OPTIONS.map((opt) => (
                                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                                    ))}
                                </select>
                                <div className="absolute right-2.5 sm:right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                    <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current" viewBox="0 0 20 20">
                                        <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                                    </svg>
                                </div>
                            </div>

                            {/* Mobile Filter Toggle */}
                            <button
                                onClick={() => setShowMobileFilters(!showMobileFilters)}
                                className="md:hidden flex items-center gap-1.5 px-3 py-2 bg-white border border-gray-200 rounded-xl text-[12px] sm:text-[13px] font-medium text-gray-700 hover:border-[#53C1CC] transition-all flex-shrink-0"
                            >
                                <FiFilter size={14} />
                                Filters
                            </button>
                        </div>
                    </div>

                    {/* Active Filters Strip */}
                    {hasActiveFilters && (
                        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mt-2 sm:mt-3 pt-2 sm:pt-3 border-t border-gray-100">
                            <span className="text-[10px] sm:text-[11px] font-bold text-gray-400 uppercase tracking-wider">Filters:</span>
                            {currentSort && (
                                <span className="inline-flex items-center gap-1 px-2 sm:px-3 py-0.5 sm:py-1 bg-[#53C1CC]/10 text-[#53C1CC] text-[11px] sm:text-[12px] font-bold rounded-full">
                                    {SORT_OPTIONS.find(o => o.value === currentSort)?.label}
                                    <FiX
                                        size={11}
                                        className="cursor-pointer hover:text-red-500"
                                        onClick={() => updateParams({ sort: '' })}
                                    />
                                </span>
                            )}
                            {(currentMinPrice || currentMaxPrice) && (
                                <span className="inline-flex items-center gap-1 px-2 sm:px-3 py-0.5 sm:py-1 bg-[#53C1CC]/10 text-[#53C1CC] text-[11px] sm:text-[12px] font-bold rounded-full">
                                    Rs. {currentMinPrice || '0'} – {currentMaxPrice || '∞'}
                                    <FiX
                                        size={11}
                                        className="cursor-pointer hover:text-red-500"
                                        onClick={() => {
                                            setLocalMinPrice('');
                                            setLocalMaxPrice('');
                                            updateParams({ minPrice: '', maxPrice: '' });
                                        }}
                                    />
                                </span>
                            )}
                            <button
                                onClick={handleClearFilters}
                                className="text-[11px] sm:text-[12px] font-bold text-red-500 hover:text-red-600 ml-1 hover:underline"
                            >
                                Clear All
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* ── Main Content ── */}
            <div className="flex-1 max-w-[1400px] w-full mx-auto px-3 sm:px-4 py-4 sm:py-6 md:py-8 flex gap-4 md:gap-6 items-start">

                {/* ── Desktop Sidebar Filters ── */}
                <aside className="hidden md:block w-[260px] flex-shrink-0 sticky top-[95px]">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <h3 className="text-sm font-bold text-gray-900 mb-5 flex items-center gap-2">
                            <span className="w-1.5 h-5 bg-[#53C1CC] rounded-full" />
                            Filters
                        </h3>

                        {/* Price Range */}
                        <div className="mb-6">
                            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-3 block">Price Range (Rs.)</label>
                            <div className="flex items-center gap-2">
                                <input
                                    type="number"
                                    placeholder="Min"
                                    value={localMinPrice}
                                    onChange={(e) => setLocalMinPrice(e.target.value)}
                                    className="w-full px-3 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl text-[13px] text-gray-900 outline-none focus:border-[#53C1CC] focus:ring-2 focus:ring-[#53C1CC]/10 transition-all"
                                />
                                <span className="text-gray-300 font-bold">–</span>
                                <input
                                    type="number"
                                    placeholder="Max"
                                    value={localMaxPrice}
                                    onChange={(e) => setLocalMaxPrice(e.target.value)}
                                    className="w-full px-3 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl text-[13px] text-gray-900 outline-none focus:border-[#53C1CC] focus:ring-2 focus:ring-[#53C1CC]/10 transition-all"
                                />
                            </div>
                            <button
                                onClick={handleApplyPriceFilter}
                                className="w-full mt-3 px-4 py-2.5 bg-[#53C1CC] text-white rounded-xl text-[13px] font-bold hover:bg-[#46869d] transition-all shadow-sm"
                            >
                                Apply
                            </button>
                        </div>

                        {/* Clear All Button */}
                        {hasActiveFilters && (
                            <button
                                onClick={handleClearFilters}
                                className="w-full px-4 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl text-[13px] font-bold hover:border-red-300 hover:text-red-500 transition-all"
                            >
                                Clear All Filters
                            </button>
                        )}
                    </div>
                </aside>

                {/* ── Mobile Filter Drawer ── */}
                {showMobileFilters && (
                    <div className="md:hidden fixed inset-0 z-[200] flex">
                        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowMobileFilters(false)} />
                        <div className="relative ml-auto w-[280px] sm:w-[300px] bg-white h-full shadow-2xl p-5 sm:p-6 overflow-y-auto">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-bold text-gray-900">Filters</h3>
                                <button onClick={() => setShowMobileFilters(false)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                                    <FiX size={20} />
                                </button>
                            </div>

                            {/* Price Range */}
                            <div className="mb-6">
                                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-3 block">Price Range (Rs.)</label>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="number"
                                        placeholder="Min"
                                        value={localMinPrice}
                                        onChange={(e) => setLocalMinPrice(e.target.value)}
                                        className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-[13px] outline-none focus:border-[#53C1CC] transition-all"
                                    />
                                    <span className="text-gray-300 font-bold">–</span>
                                    <input
                                        type="number"
                                        placeholder="Max"
                                        value={localMaxPrice}
                                        onChange={(e) => setLocalMaxPrice(e.target.value)}
                                        className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-[13px] outline-none focus:border-[#53C1CC] transition-all"
                                    />
                                </div>
                            </div>

                            <button
                                onClick={handleApplyPriceFilter}
                                className="w-full px-4 py-3 bg-[#53C1CC] text-white rounded-xl text-[14px] font-bold hover:bg-[#46869d] transition-all shadow-lg shadow-[#53C1CC]/20"
                            >
                                Apply Filters
                            </button>

                            {hasActiveFilters && (
                                <button
                                    onClick={() => { handleClearFilters(); setShowMobileFilters(false); }}
                                    className="w-full mt-3 px-4 py-3 bg-white border border-gray-200 text-gray-700 rounded-xl text-[14px] font-bold hover:text-red-500 transition-all"
                                >
                                    Clear All
                                </button>
                            )}
                        </div>
                    </div>
                )}

                {/* ── Products Grid / List ── */}
                <main className="flex-1 min-w-0">

                    {/* Loading State */}
                    {loading && (
                        <div className="flex flex-col items-center justify-center py-12 sm:py-20 bg-white rounded-2xl sm:rounded-3xl border border-gray-100 shadow-sm">
                            <div className="w-8 h-8 sm:w-10 sm:h-10 border-4 border-gray-100 border-t-[#53C1CC] rounded-full animate-spin mb-3 sm:mb-4" />
                            <p className="text-gray-500 font-medium text-sm sm:text-base">Searching products...</p>
                        </div>
                    )}

                    {/* Empty State */}
                    {!loading && query && products.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-12 sm:py-20 px-4 bg-white rounded-2xl sm:rounded-3xl border border-gray-100 shadow-sm">
                            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gray-100 flex items-center justify-center mb-4 sm:mb-6">
                                <FiSearch className="text-gray-300" size={28} />
                            </div>
                            <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 text-center">No products found</h2>
                            <p className="text-gray-500 text-[13px] sm:text-[14px] mb-5 sm:mb-6 text-center max-w-[400px]">
                                We couldn't find any products matching "<span className="font-bold text-gray-700">{query}</span>". Try a different search term.
                            </p>
                            <div className="flex gap-2 sm:gap-3">
                                <Link
                                    to="/shop"
                                    className="px-4 sm:px-6 py-2 sm:py-2.5 bg-[#53C1CC] text-white rounded-xl font-bold text-[13px] sm:text-[14px] hover:bg-[#46869d] transition-all shadow-lg shadow-[#53C1CC]/20"
                                >
                                    Browse Shop
                                </Link>
                                <Link
                                    to="/"
                                    className="px-4 sm:px-6 py-2 sm:py-2.5 bg-white text-gray-700 border border-gray-200 rounded-xl font-bold text-[13px] sm:text-[14px] hover:border-[#53C1CC] transition-all"
                                >
                                    Go Home
                                </Link>
                            </div>
                        </div>
                    )}

                    {/* No Query State */}
                    {!loading && !query && (
                        <div className="flex flex-col items-center justify-center py-12 sm:py-20 px-4 bg-white rounded-2xl sm:rounded-3xl border border-gray-100 shadow-sm">
                            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#53C1CC]/10 flex items-center justify-center mb-4 sm:mb-6">
                                <FiSearch className="text-[#53C1CC]" size={28} />
                            </div>
                            <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 text-center">What are you looking for?</h2>
                            <p className="text-gray-500 text-[13px] sm:text-[14px] text-center max-w-[400px]">
                                Use the search bar to find products by name, brand, or description.
                            </p>
                        </div>
                    )}

                    {/* Products Grid */}
                    {!loading && products.length > 0 && (
                        <>
                            <div className={
                                viewMode === 'grid'
                                    ? 'grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-3 md:gap-5'
                                    : 'flex flex-col gap-4'
                            }>
                                {products.map((product) => (
                                    viewMode === 'grid' ? (
                                        /* ── Grid Card ── */
                                        <div key={product._id} className="bg-white rounded-xl sm:rounded-2xl border border-gray-100 shadow-sm overflow-hidden group hover:shadow-lg hover:border-[#53C1CC]/30 transition-all duration-300">
                                            <Link to={`/product/${product._id}`} className="block">
                                                <div className="bg-gray-50 aspect-square flex items-center justify-center p-3 sm:p-6 relative overflow-hidden">
                                                    <img
                                                        src={product.image || product.images?.[0] || 'https://placehold.co/400x400/f0f0f0/999999?text=Product'}
                                                        alt={product.title}
                                                        className="w-[80%] h-[80%] object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-300"
                                                    />
                                                    {product.originalPrice && product.originalPrice > product.price && (
                                                        <span className="absolute top-2 left-2 sm:top-3 sm:left-3 bg-red-500 text-white text-[9px] sm:text-[10px] font-bold px-1.5 sm:px-2 py-0.5 rounded-md sm:rounded-lg">
                                                            -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                                                        </span>
                                                    )}
                                                </div>
                                            </Link>
                                            <div className="p-2.5 sm:p-4">
                                                <Link to={`/product/${product._id}`}>
                                                    <p className="text-[9px] sm:text-[11px] text-gray-400 font-medium mb-0.5 sm:mb-1 uppercase tracking-wider">{product.brand || 'Brand'}</p>
                                                    <h3 className="text-[12px] sm:text-[14px] font-bold text-gray-900 line-clamp-2 mb-1 sm:mb-2 leading-snug group-hover:text-[#53C1CC] transition-colors">
                                                        {product.title}
                                                    </h3>
                                                </Link>

                                                {/* Rating */}
                                                <div className="flex items-center gap-0.5 sm:gap-1 mb-1.5 sm:mb-3">
                                                    <div className="flex text-yellow-400 text-[9px] sm:text-[11px]">
                                                        {'★'.repeat(Math.round(product.rating || 0))}
                                                        {'☆'.repeat(5 - Math.round(product.rating || 0))}
                                                    </div>
                                                    <span className="text-[9px] sm:text-[11px] text-gray-400">({product.numReviews || 0})</span>
                                                </div>

                                                {/* Price */}
                                                <div className="flex flex-col sm:flex-row sm:items-center gap-0 sm:gap-2">
                                                    <span className="text-[14px] sm:text-lg font-extrabold text-gray-900">Rs. {product.price?.toLocaleString()}</span>
                                                    {product.originalPrice && product.originalPrice > product.price && (
                                                        <span className="text-[10px] sm:text-[12px] text-gray-400 line-through">Rs. {product.originalPrice?.toLocaleString()}</span>
                                                    )}
                                                </div>

                                                {/* Add to Cart */}
                                                <button
                                                    onClick={(e) => { e.preventDefault(); handleAddToCart(product); }}
                                                    className="w-full mt-2 sm:mt-3 flex items-center justify-center gap-1.5 sm:gap-2 px-2 sm:px-4 py-2 sm:py-2.5 bg-[#53C1CC]/10 text-[#53C1CC] rounded-lg sm:rounded-xl text-[11px] sm:text-[13px] font-bold hover:bg-[#53C1CC] hover:text-white transition-all active:scale-95"
                                                >
                                                    <FiShoppingCart size={12} className="sm:w-[14px] sm:h-[14px]" />
                                                    Add to Cart
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        /* ── List Card ── */
                                        <div key={product._id} className="bg-white rounded-xl sm:rounded-2xl border border-gray-100 shadow-sm overflow-hidden group hover:shadow-lg hover:border-[#53C1CC]/30 transition-all duration-300 flex flex-col sm:flex-row">
                                            <Link to={`/product/${product._id}`} className="w-full sm:w-[180px] md:w-[200px] flex-shrink-0 bg-gray-50 flex items-center justify-center p-4 sm:p-6 aspect-square sm:aspect-auto">
                                                <img
                                                    src={product.image || product.images?.[0] || 'https://placehold.co/400x400/f0f0f0/999999?text=Product'}
                                                    alt={product.title}
                                                    className="w-[60%] sm:w-[80%] h-[60%] sm:h-[80%] object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-300"
                                                />
                                            </Link>
                                            <div className="flex-1 p-3.5 sm:p-5 flex flex-col justify-between">
                                                <div>
                                                    <Link to={`/product/${product._id}`}>
                                                        <p className="text-[10px] sm:text-[11px] text-gray-400 font-medium mb-0.5 sm:mb-1 uppercase tracking-wider">{product.brand || 'Brand'}</p>
                                                        <h3 className="text-[14px] sm:text-[16px] font-bold text-gray-900 line-clamp-2 mb-1.5 sm:mb-2 group-hover:text-[#53C1CC] transition-colors">
                                                            {product.title}
                                                        </h3>
                                                    </Link>
                                                    <p className="text-[12px] sm:text-[13px] text-gray-500 line-clamp-2 mb-2 sm:mb-3 hidden sm:block">{product.description || ''}</p>

                                                    {/* Rating */}
                                                    <div className="flex items-center gap-1 mb-2 sm:mb-3">
                                                        <div className="flex text-yellow-400 text-[11px] sm:text-[12px]">
                                                            {'★'.repeat(Math.round(product.rating || 0))}
                                                            {'☆'.repeat(5 - Math.round(product.rating || 0))}
                                                        </div>
                                                        <span className="text-[11px] sm:text-[12px] text-gray-400">({product.numReviews || 0})</span>
                                                    </div>
                                                </div>

                                                <div className="flex items-center justify-between gap-2">
                                                    <div className="flex flex-col sm:flex-row sm:items-center gap-0 sm:gap-2">
                                                        <span className="text-base sm:text-xl font-extrabold text-gray-900">Rs. {product.price?.toLocaleString()}</span>
                                                        {product.originalPrice && product.originalPrice > product.price && (
                                                            <span className="text-[11px] sm:text-[13px] text-gray-400 line-through">Rs. {product.originalPrice?.toLocaleString()}</span>
                                                        )}
                                                    </div>
                                                    <button
                                                        onClick={() => handleAddToCart(product)}
                                                        className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-2 sm:py-2.5 bg-[#53C1CC] text-white rounded-lg sm:rounded-xl text-[12px] sm:text-[13px] font-bold hover:bg-[#46869d] transition-all shadow-sm active:scale-95 flex-shrink-0"
                                                    >
                                                        <FiShoppingCart size={13} />
                                                        <span className="hidden sm:inline">Add to Cart</span>
                                                        <span className="sm:hidden">Add</span>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                ))}
                            </div>

                            {/* ── Pagination ── */}
                            {totalPages > 1 && (
                                <div className="flex items-center justify-center gap-1.5 sm:gap-2 mt-6 sm:mt-8">
                                    <button
                                        onClick={() => goToPage(currentPage - 1)}
                                        disabled={currentPage === 1}
                                        className={`p-2 sm:p-2.5 rounded-lg sm:rounded-xl border transition-all ${currentPage === 1 ? 'border-gray-100 text-gray-300 cursor-not-allowed' : 'border-gray-200 text-gray-600 hover:border-[#53C1CC] hover:text-[#53C1CC]'}`}
                                    >
                                        <FiChevronLeft size={16} className="sm:w-[18px] sm:h-[18px]" />
                                    </button>

                                    {pageNumbers.map((page) => (
                                        <button
                                            key={page}
                                            onClick={() => goToPage(page)}
                                            className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl font-bold text-[12px] sm:text-[14px] transition-all ${page === currentPage
                                                    ? 'bg-[#53C1CC] text-white shadow-lg shadow-[#53C1CC]/20'
                                                    : 'bg-white border border-gray-200 text-gray-600 hover:border-[#53C1CC] hover:text-[#53C1CC]'
                                                }`}
                                        >
                                            {page}
                                        </button>
                                    ))}

                                    <button
                                        onClick={() => goToPage(currentPage + 1)}
                                        disabled={currentPage === totalPages}
                                        className={`p-2 sm:p-2.5 rounded-lg sm:rounded-xl border transition-all ${currentPage === totalPages ? 'border-gray-100 text-gray-300 cursor-not-allowed' : 'border-gray-200 text-gray-600 hover:border-[#53C1CC] hover:text-[#53C1CC]'}`}
                                    >
                                        <FiChevronRight size={16} className="sm:w-[18px] sm:h-[18px]" />
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </main>
            </div>

            <Footer />
        </div>
    );
}

export default SearchResults;
