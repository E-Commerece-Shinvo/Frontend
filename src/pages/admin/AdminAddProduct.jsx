import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiBold, FiItalic, FiLink, FiList, FiAlignLeft, FiInfo, FiUploadCloud, FiImage } from 'react-icons/fi';
import { getProductById, createProduct, updateProduct } from '../../api/products';
import { getCategories } from '../../api/categories';
import api from '../../utils/api';
import toast from 'react-hot-toast';

const AdminAddProduct = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditMode = Boolean(id);

    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

    const [formData, setFormData] = useState({
        title: '',
        brand: '',
        description: '',
        price: '',
        originalPrice: '',
        stock: 100,
        category: '',
        images: []
    });

    useEffect(() => {
        const init = async () => {
            setLoading(true);
            try {
                // Fetch categories
                const cats = await getCategories();
                setCategories(cats);
                
                // Fetch product if in edit mode
                if (isEditMode) {
                    const productData = await getProductById(id);
                    setFormData({
                        title: productData.title || '',
                        brand: productData.brand || '',
                        description: productData.description || '',
                        price: productData.price || '',
                        originalPrice: productData.originalPrice || '',
                        stock: productData.stock ?? 100,
                        category: productData.category?._id || productData.category || (cats.length > 0 ? cats[0]._id : ''),
                        images: productData.images?.length > 0 ? productData.images : (productData.image ? [productData.image] : [])
                    });
                } else {
                    if (cats.length > 0) {
                        setFormData(prev => ({ ...prev, category: cats[0]._id }));
                    }
                }
            } catch (error) {
                console.error("Failed to load data:", error);
                toast.error("Failed to load form data");
            } finally {
                setLoading(false);
            }
        };

        init();
    }, [id, isEditMode]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageUpload = async (e) => {
        const files = Array.from(e.target.files);
        if (files.length > 0) {
            if (formData.images.length + files.length > 5) {
                toast.error('You can only upload up to 5 images');
                return;
            }

            const validFiles = files.filter(f => f.size <= 5 * 1024 * 1024);
            if (validFiles.length !== files.length) {
                toast.error('Some images were skipped (Max 5MB)');
            }

            if (validFiles.length === 0) return;
            
            setIsUploading(true);
            try {
                const uploadData = new FormData();
                validFiles.forEach(file => {
                    uploadData.append('images', file);
                });
                
                const response = await api.post('/upload/multiple', uploadData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                
                const newImageUrls = response.data.images.map(img => img.url);
                setFormData(prev => ({ 
                    ...prev, 
                    images: [...prev.images, ...newImageUrls] 
                }));
                toast.success('Images uploaded successfully');
            } catch (error) {
                console.error("Upload error:", error);
                toast.error(error.response?.data?.message || 'Failed to upload images');
            } finally {
                setIsUploading(false);
            }
            // Reset input
            e.target.value = '';
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        try {
            const dataToSubmit = {
                ...formData,
                image: formData.images.length > 0 ? formData.images[0] : '', // Keep main image populated for fallback
                price: Number(formData.price),
                originalPrice: formData.originalPrice ? Number(formData.originalPrice) : null,
                stock: Number(formData.stock)
            };

            if (isEditMode) {
                await updateProduct(id, dataToSubmit);
                toast.success('Product updated successfully!');
            } else {
                await createProduct(dataToSubmit);
                toast.success('Product added successfully!');
            }
            navigate('/admin/products');
        } catch (error) {
            console.error("Failed to save product:", error);
            toast.error(error.response?.data?.message || 'Failed to save product');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center py-40">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500"></div>
            </div>
        );
    }

    return (
        <>
            <form onSubmit={handleSubmit} className="flex flex-col gap-6 max-w-[1400px] mx-auto w-full">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                    <div className="w-full md:w-auto">
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1 md:mb-2 leading-none tracking-tight">
                            {isEditMode ? 'Edit Product' : 'Add New Products'}
                        </h2>
                        <div className="text-[10px] md:text-[11px] font-bold flex flex-wrap gap-1 md:gap-2 tracking-[0.1em] md:tracking-widest uppercase">
                            <span className="text-cyan-400 cursor-pointer hover:underline" onClick={() => navigate('/admin/products')}>Products</span>
                            <span className="text-gray-400">›</span>
                            <span className="text-cyan-400 cursor-pointer hover:underline" onClick={() => navigate('/admin/products')}>Products List</span>
                            <span className="text-gray-400">›</span>
                            <span className="text-gray-400 mt-1 sm:mt-0">{isEditMode ? 'Edit Product' : 'Add New Products'}</span>
                        </div>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3 md:gap-4 w-full md:w-auto">
                        <button type="button" onClick={() => navigate('/admin/products')} className="w-full sm:w-auto justify-center px-6 md:px-8 py-2.5 rounded-xl border border-cyan-400 text-gray-700 font-bold text-sm hover:bg-gray-50 transition-colors bg-white">
                            Cancel
                        </button>
                        <button type="submit" disabled={isSubmitting} className="w-full sm:w-auto justify-center px-4 md:px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#001B1B] to-[#006060] text-white font-bold text-sm shadow-lg shadow-black/20 hover:from-[#002B2B] hover:to-[#008080] transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50">
                            {isSubmitting ? <span className="animate-spin h-4 w-4 border-2 border-white/30 border-t-white rounded-full"></span> : (isEditMode ? 'Update Product' : 'Publish Product')}
                            {!isSubmitting && !isEditMode && <span className="font-black text-lg leading-none">+</span>}
                        </button>
                    </div>
                </div>

                <div className="flex flex-col xl:flex-row gap-6 items-start">
                    {/* Left Column */}
                    <div className="flex w-full flex-col gap-6 xl:w-[65%] min-w-0">
                        {/* General Information */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-50">
                            <h3 className="text-lg font-bold text-gray-900 mb-6 font-sans">General Information</h3>

                            <div className="mb-6">
                                <label className="block text-sm font-bold text-gray-800 mb-2">Product Name</label>
                                <input required type="text" name="title" value={formData.title} onChange={handleInputChange} placeholder="Xiaomi Watch Pro" className="w-full min-w-0 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/10 transition-all text-sm text-gray-800 font-medium placeholder-gray-400" />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-800 mb-2">Description</label>
                                <div className="border border-gray-200 rounded-xl overflow-hidden focus-within:border-cyan-400 focus-within:ring-2 focus-within:ring-cyan-400/10 transition-all bg-white flex flex-col">
                                    <div className="bg-white border-b border-gray-100 px-3 md:px-4 py-2 flex flex-wrap gap-3 md:gap-4 text-gray-500 items-center overflow-x-auto">
                                        <button type="button" className="hover:text-black font-extrabold text-sm"><FiBold /></button>
                                        <button type="button" className="hover:text-black italic font-serif"><FiItalic /></button>
                                        <button type="button" className="hover:text-black"><FiLink /></button>
                                        <div className="w-px h-4 bg-gray-200"></div>
                                        <button type="button" className="hover:text-black"><FiList /></button>
                                        <button type="button" className="hover:text-black"><FiAlignLeft /></button>
                                    </div>
                                    <textarea name="description" value={formData.description} onChange={handleInputChange} className="w-full h-40 p-4 outline-none resize-none text-sm text-gray-800 font-medium bg-transparent" placeholder="Describe the product..."></textarea>
                                </div>
                            </div>
                        </div>

                        {/* Pricing */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-50">
                            <h3 className="text-lg font-bold text-gray-900 mb-6 font-sans">Pricing</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-bold text-gray-800 mb-2">Price (Rs.)</label>
                                    <input required type="number" min="0" name="price" value={formData.price} onChange={handleInputChange} className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/10 transition-all text-sm text-gray-800 font-medium" placeholder="5300" />
                                </div>
                                <div>
                                    <label className="flex items-center gap-2 text-sm font-bold text-gray-800 mb-2">Compare at Price <FiInfo className="text-gray-400 text-xs" title="Original price before discount" /></label>
                                    <input type="number" min="0" name="originalPrice" value={formData.originalPrice} onChange={handleInputChange} className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/10 transition-all text-sm text-gray-800 font-medium" placeholder="Optional" />
                                </div>
                            </div>
                        </div>

                        {/* Inventory */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-50">
                            <h3 className="text-lg font-bold text-gray-900 mb-6 font-sans">Inventory</h3>
                            <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
                                <div>
                                    <label className="block text-sm font-bold text-gray-800 mb-2">Quantity in Stock</label>
                                    <input required type="number" min="0" name="stock" value={formData.stock} onChange={handleInputChange} className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/10 transition-all text-sm text-gray-800 font-medium" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="flex flex-col gap-6 w-full xl:w-[35%]">
                        {/* Product Images */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-50">
                            <h3 className="text-lg font-bold text-gray-900 mb-6 font-sans">Product Images</h3>

                            <div className="relative border border-dashed border-gray-400/60 rounded-xl p-8 flex flex-col items-center justify-center text-center mb-4 bg-gray-50/50 hover:bg-gray-50 transition-colors cursor-pointer group overflow-hidden">
                                <input
                                    type="file"
                                    multiple
                                    accept="image/jpeg, image/png, image/webp"
                                    onChange={handleImageUpload}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                    title=""
                                    disabled={isUploading}
                                />
                                {isUploading ? (
                                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-50/90 z-20">
                                        <span className="animate-spin h-6 w-6 border-2 border-cyan-500 border-t-transparent rounded-full mb-2"></span>
                                        <span className="text-xs font-bold text-gray-500">Uploading...</span>
                                    </div>
                                ) : null}
                                <FiUploadCloud className="text-[32px] text-gray-400 mb-3 group-hover:text-cyan-400 transition-colors stroke-1 relative z-0" />
                                <p className="text-xs font-bold text-gray-900 mb-3 relative z-0">Drag & Drop Images</p>
                                <button type="button" className="px-4 py-2 border border-cyan-400 text-cyan-600 font-bold rounded-lg text-xs mb-3 hover:bg-cyan-50 transition-colors bg-white relative z-0 pointer-events-none">Browse Files</button>
                                <p className="text-[9px] text-gray-400 uppercase tracking-widest font-bold relative z-0 pointer-events-none">Supports JPG, PNG, Max 5MB (Up to 5).</p>
                            </div>

                            <div className="flex flex-wrap gap-3 mt-2">
                                {formData.images.map((imgUrl, idx) => (
                                    <div key={idx} className="relative w-[60px] h-[60px] border border-gray-200 rounded-xl flex items-center justify-center overflow-hidden p-[2px] group bg-white shadow-sm">
                                        <img src={imgUrl} alt={`Preview ${idx}`} className="w-full h-full object-cover rounded-lg" />
                                        <div 
                                            className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer z-20 rounded-lg"
                                            onClick={() => setFormData(prev => ({ 
                                                ...prev, 
                                                images: prev.images.filter((_, i) => i !== idx) 
                                            }))}
                                        >
                                            <span className="text-white text-xs font-bold">X</span>
                                        </div>
                                    </div>
                                ))}
                                
                                {Array.from({ length: Math.max(0, 5 - (formData.images?.length || 0)) }).map((_, idx) => (
                                    <div key={`empty-${idx}`} className="w-[60px] h-[60px] border border-dashed border-gray-300 rounded-xl flex items-center justify-center text-gray-400 overflow-hidden p-[2px] bg-gray-50/50">
                                        <FiImage className="text-xl opacity-40" />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Organization */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-50">
                            <h3 className="text-lg font-bold text-gray-900 mb-6 font-sans">Organization</h3>

                            <div className="mb-6">
                                <label className="block text-sm font-bold text-gray-800 mb-2">Category</label>
                                <select required name="category" value={formData.category} onChange={handleInputChange} className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/10 transition-all text-sm font-medium text-gray-800 appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23111%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[length:10px_10px] bg-[position:right_15px_center]">
                                    <option value="" disabled>Select category...</option>
                                    {categories.map(cat => (
                                        <option key={cat._id} value={cat._id}>{cat.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="mb-6">
                                <label className="block text-sm font-bold text-gray-800 mb-2">Brand</label>
                                <input required type="text" name="brand" value={formData.brand} onChange={handleInputChange} className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/10 transition-all text-sm font-medium text-gray-800" placeholder="e.g. Samsung" />
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </>
    );
};

export default AdminAddProduct;
