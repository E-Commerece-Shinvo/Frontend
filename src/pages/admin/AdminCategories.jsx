import React, { useState, useEffect, useMemo } from 'react';
import {
    FiSearch, FiPlus, FiGrid, FiFolder,
    FiEdit3, FiTrash2, FiX, FiCheck,
    FiChevronLeft, FiChevronRight, FiImage,
    FiArrowRight, FiInfo
} from 'react-icons/fi';
import { getCategories, createCategory, updateCategory, deleteCategory } from '../../api/categories';
import toast from 'react-hot-toast';
import AdminPagination from '../../components/admin/AdminPagination';

const AdminCategories = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;

    const [formData, setFormData] = useState({
        name: '',
        image: '',
        parentCategory: '',
        level: 0
    });

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        setLoading(true);
        try {
            const data = await getCategories();
            setCategories(data || []);
        } catch (error) {
            console.error("Failed to fetch categories:", error);
            toast.error("Failed to load categories");
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (category = null) => {
        if (category) {
            setIsEditing(true);
            setSelectedCategory(category);
            setFormData({
                name: category.name,
                image: category.image || '',
                parentCategory: category.parentCategory || '',
                level: category.level || 0
            });
        } else {
            setIsEditing(false);
            setSelectedCategory(null);
            setFormData({
                name: '',
                image: '',
                parentCategory: '',
                level: 0
            });
        }
        setIsModalOpen(true);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name === 'parentCategory') {
            const parent = categories.find(c => c._id === value);
            setFormData(prev => ({
                ...prev,
                parentCategory: value,
                level: parent ? parent.level + 1 : 0
            }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isEditing) {
                await updateCategory(selectedCategory._id, formData);
                toast.success("Category updated successfully");
            } else {
                await createCategory(formData);
                toast.success("Category created successfully");
            }
            setIsModalOpen(false);
            fetchCategories();
        } catch (error) {
            const message = error.response?.data?.message || "Operation failed";
            toast.error(message);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this category?")) {
            try {
                await deleteCategory(id);
                toast.success("Category deleted");
                fetchCategories();
            } catch (error) {
                toast.error("Failed to delete category");
            }
        }
    };

    // Stats
    const stats = useMemo(() => {
        const total = categories.length;
        const niches = categories.filter(c => c.level === 0).length;
        const subcats = total - niches;
        return { total, niches, subcats };
    }, [categories]);

    // Filtering
    const filteredCategories = useMemo(() => {
        return categories.filter(c =>
            c.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [categories, searchTerm]);

    // Pagination
    const totalPages = Math.ceil(filteredCategories.length / itemsPerPage);
    const paginatedItems = filteredCategories.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );



    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Header Section */}
            <div className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-50 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-3xl font-black tracking-tight text-gray-900">Category Management</h1>
                    <p className="text-gray-400 text-sm font-medium mt-1 uppercase tracking-widest flex items-center gap-2">
                        Organization System <span className="w-1 h-1 bg-gray-300 rounded-full"></span> {categories.length} Total
                    </p>
                </div>
                <div className="flex items-center gap-4 w-full md:w-auto">
                    <div className="relative flex-1 md:w-64 group">
                        <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-cyan-500 transition-colors" />
                        <input
                            type="text"
                            placeholder="Search categories..."
                            className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border-transparent focus:bg-white focus:border-cyan-200 rounded-2xl text-sm font-medium transition-all outline-none"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button
                        onClick={() => handleOpenModal()}
                        className="bg-gradient-to-r from-[#001B1B] to-[#006060] text-white px-6 py-3.5 rounded-2xl font-bold text-sm flex items-center gap-3 transition-all shadow-xl shadow-black/20 hover:from-[#002B2B] hover:to-[#008080] active:scale-95"
                    >
                        <FiPlus /> Add Category
                    </button>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-3 gap-3 sm:gap-6">
                <StatCard label="Total Categories" value={stats.total} icon={<FiGrid />} color="bg-cyan-500" />
                <StatCard label="Niches (Level 0)" value={`${stats.niches}/5`} icon={<FiFolder />} color="bg-[#001B1B]" warning={stats.niches >= 5} />
                <StatCard label="Subcategories" value={stats.subcats} icon={<FiArrowRight />} color="bg-teal-500" />
            </div>

            {/* Categories Table */}
            <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden flex flex-col h-[850px]">
                <div className="p-8 border-b border-gray-50 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-2 h-8 bg-cyan-500 rounded-full"></div>
                        <h3 className="text-xl font-bold text-gray-900">Category Structure</h3>
                    </div>
                </div>

                <div className="overflow-auto flex-1 custom-scrollbar">
                    <table className="w-full min-w-[800px]">
                        <thead>
                            <tr className="bg-gray-50/50 text-[11px] text-gray-400 uppercase tracking-[0.2em] font-black">
                                <th className="px-8 py-5 text-left">Category Details</th>
                                <th className="px-8 py-5 text-left">Type</th>
                                <th className="px-8 py-5 text-left">Parent Category</th>
                                <th className="px-8 py-5 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {loading ? (
                                <tr>
                                    <td colSpan="4" className="py-20 text-center">
                                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-cyan-500 mx-auto"></div>
                                    </td>
                                </tr>
                            ) : paginatedItems.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="py-20 text-center text-gray-400 font-bold uppercase tracking-widest">
                                        No categories found
                                    </td>
                                </tr>
                            ) : (
                                paginatedItems.map((c) => (
                                    <tr key={c._id} className="group hover:bg-gray-50/50 transition-all">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-14 h-14 bg-white border border-gray-100 rounded-2xl p-2 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform overflow-hidden shadow-sm">
                                                    {c.image ? (
                                                        <img src={c.image} alt={c.name} className="w-full h-full object-contain" />
                                                    ) : (
                                                        <FiImage className="text-gray-300 text-xl" />
                                                    )}
                                                </div>
                                                <div className="min-w-0">
                                                    <h4 className="text-sm font-bold text-gray-900 truncate uppercase tracking-tight">{c.name}</h4>
                                                    <p className="text-[10px] text-gray-400 font-bold uppercase mt-1 tracking-widest">ID: {c._id.slice(-6)}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border ${c.level === 0
                                                ? 'bg-cyan-50 text-cyan-600 border-cyan-100'
                                                : 'bg-gray-50 text-gray-600 border-gray-100'
                                                }`}>
                                                {c.level === 0 ? 'Niche' : `Subcategory (L${c.level})`}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6">
                                            {c.parentCategory ? (
                                                <div className="flex items-center gap-2">
                                                    <FiFolder className="text-gray-300" />
                                                    <span className="text-sm font-bold text-gray-600">
                                                        {categories.find(cat => cat._id === (typeof c.parentCategory === 'object' ? c.parentCategory._id : c.parentCategory))?.name || 'Unknown'}
                                                    </span>
                                                </div>
                                            ) : (
                                                <span className="text-xs text-gray-300 font-bold uppercase tracking-widest">Root</span>
                                            )}
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center justify-center gap-2">
                                                <button
                                                    onClick={() => handleOpenModal(c)}
                                                    className="p-3 bg-white hover:bg-cyan-500 text-gray-400 hover:text-white rounded-xl shadow-sm border border-gray-100 transition-all hover:scale-110"
                                                >
                                                    <FiEdit3 className="text-lg" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(c._id)}
                                                    className="p-3 bg-white hover:bg-red-500 text-gray-400 hover:text-white rounded-xl shadow-sm border border-gray-100 transition-all hover:scale-110"
                                                >
                                                    <FiTrash2 className="text-lg" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                <AdminPagination 
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                    totalItems={filteredCategories.length}
                    itemsPerPage={itemsPerPage}
                    itemName="categories"
                />
            </div>

            {/* Add/Edit Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
                    <div className="bg-white w-full max-w-lg rounded-[40px] shadow-2xl relative z-10 overflow-hidden animate-in zoom-in-95 duration-300">
                        <div className="p-8 border-b border-gray-50 flex justify-between items-center bg-[#001B1B] text-white">
                            <div>
                                <h2 className="text-2xl font-black tracking-tight">{isEditing ? 'Edit Category' : 'Add New Category'}</h2>
                                <p className="text-white/40 text-[10px] font-bold uppercase tracking-[0.2em] mt-1">Classification Details</p>
                            </div>
                            <button onClick={() => setIsModalOpen(false)} className="p-3 bg-white/10 hover:bg-white/20 rounded-2xl transition-all">
                                <FiX className="text-xl" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-8 space-y-6">
                            <div className="space-y-2">
                                <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest px-1">Category Name</label>
                                <input
                                    required
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    placeholder="e.g. Headphones"
                                    className="w-full bg-gray-50 border-2 border-transparent focus:border-cyan-200 focus:bg-white rounded-2xl px-6 py-4 text-sm font-bold transition-all outline-none"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest px-1">Parent Category</label>
                                <select
                                    name="parentCategory"
                                    value={formData.parentCategory}
                                    onChange={handleInputChange}
                                    className="w-full bg-gray-50 border-2 border-transparent focus:border-cyan-200 focus:bg-white rounded-2xl px-6 py-4 text-sm font-bold transition-all outline-none appearance-none"
                                >
                                    <option value="">None (Top Level Niche)</option>
                                    {categories.filter(c => c.level === 0 && (!isEditing || c._id !== selectedCategory?._id)).map(cat => (
                                        <option key={cat._id} value={cat._id}>{cat.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest px-1">Image URL</label>
                                <input
                                    type="url"
                                    name="image"
                                    value={formData.image}
                                    onChange={handleInputChange}
                                    placeholder="https://example.com/category-thumb.jpg"
                                    className="w-full bg-gray-50 border-2 border-transparent focus:border-cyan-200 focus:bg-white rounded-2xl px-6 py-4 text-sm font-bold transition-all outline-none"
                                />
                            </div>

                            {!formData.parentCategory && stats.niches >= 5 && !isEditing && (
                                <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-start gap-3">
                                    <FiInfo className="text-red-500 mt-0.5 shrink-0" />
                                    <p className="text-[10px] text-red-600 font-bold uppercase leading-relaxed">
                                        Limit Reached: A maximum of 5 top-level categories is allowed. Please select a parent to create a subcategory.
                                    </p>
                                </div>
                            )}

                            <div className="pt-4 flex gap-4">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1 px-8 py-4 bg-gray-50 hover:bg-gray-100 text-gray-400 hover:text-gray-900 rounded-2xl font-bold transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={!formData.parentCategory && stats.niches >= 5 && !isEditing}
                                    className="flex-1 px-8 py-4 bg-gradient-to-r from-[#001B1B] to-[#006060] text-white rounded-2xl font-black uppercase tracking-widest text-[11px] transition-all shadow-xl shadow-black/20 hover:from-[#002B2B] hover:to-[#008080] active:scale-95 disabled:opacity-50 disabled:shadow-none"
                                >
                                    {isEditing ? 'Update Category' : 'Create Category'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

const StatCard = ({ label, value, icon, color, warning }) => (
    <div 
        tabIndex="0"
        className={`bg-white rounded-2xl sm:rounded-[32px] p-3 sm:p-8 shadow-sm border ${warning ? 'border-orange-100 bg-orange-50/20' : 'border-gray-50'} flex flex-col items-center sm:items-start group hover:shadow-xl hover:shadow-cyan-400/5 transition-all relative cursor-pointer outline-none focus:bg-gray-50 active:bg-gray-50`}
    >
        <div className="flex items-center justify-between w-full">
            <div className={`w-10 h-10 sm:w-14 sm:h-14 mx-auto sm:mx-0 rounded-xl sm:rounded-2xl ${color} text-white flex items-center justify-center text-lg sm:text-2xl shadow-xl transition-transform group-hover:scale-110 group-focus:scale-110`}>
                {icon}
            </div>
        </div>
        
        <div className="text-center sm:text-left mt-1 sm:mt-6 w-full">
            <p className="hidden sm:block text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-1">{label}</p>
            <h4 className="text-sm sm:text-3xl font-black text-gray-900 tracking-tight leading-none pointer-events-none truncate">{value}</h4>
        </div>

        {/* Tooltip on Mobile (Shows on Hover/Focus/Active) */}
        <div className="sm:hidden absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] font-bold tracking-wider uppercase px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 group-focus:opacity-100 group-active:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-[100] shadow-xl">
            {label}
            <div className="absolute top-full left-1/2 -translate-x-1/2 border-[5px] border-transparent border-t-gray-900"></div>
        </div>
    </div>
);

export default AdminCategories;
