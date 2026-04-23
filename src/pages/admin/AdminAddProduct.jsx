import React, { useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { FiBold, FiItalic, FiLink, FiList, FiAlignLeft, FiImage, FiUploadCloud, FiInfo, FiPlus } from 'react-icons/fi';

const AdminAddProduct = () => {
    return (
        <AdminLayout>
            <div className="flex flex-col gap-6 max-w-[1400px] mx-auto w-full">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                    <div className="w-full md:w-auto">
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1 md:mb-2 leading-none tracking-tight">Add New Products</h2>
                        <div className="text-[10px] md:text-[11px] font-bold flex flex-wrap gap-1 md:gap-2 tracking-[0.1em] md:tracking-widest uppercase">
                            <span className="text-cyan-400">Products</span>
                            <span className="text-gray-400">›</span>
                            <span className="text-cyan-400">Products List</span>
                            <span className="text-gray-400">›</span>
                            <span className="text-gray-400 mt-1 sm:mt-0">Add New Products</span>
                        </div>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3 md:gap-4 w-full md:w-auto">
                        <button className="w-full sm:w-auto justify-center px-6 md:px-8 py-2.5 rounded-xl border border-cyan-400 text-gray-700 font-bold text-sm hover:bg-gray-50 transition-colors bg-white">Save</button>
                        <button className="w-full sm:w-auto justify-center px-4 md:px-6 py-2.5 rounded-xl bg-cyan-400 hover:bg-cyan-500 text-black font-bold text-sm shadow-md shadow-cyan-400/20 transition-all flex items-center justify-center gap-2">
                            Publish Product <span className="font-black text-lg leading-none">+</span>
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
                                <input type="text" placeholder="Xiaomi Watch Pro" className="w-full min-w-0 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/10 transition-all text-sm text-gray-800 font-medium placeholder-gray-400" />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-800 mb-2">Description</label>
                                <div className="border border-gray-200 rounded-xl overflow-hidden focus-within:border-cyan-400 focus-within:ring-2 focus-within:ring-cyan-400/10 transition-all bg-white flex flex-col">
                                    <div className="bg-white border-b border-gray-100 px-3 md:px-4 py-2 flex flex-wrap gap-3 md:gap-4 text-gray-500 items-center overflow-x-auto">
                                        <button className="hover:text-black font-extrabold text-sm"><FiBold /></button>
                                        <button className="hover:text-black italic font-serif"><FiItalic /></button>
                                        <button className="hover:text-black"><FiLink /></button>
                                        <div className="w-px h-4 bg-gray-200"></div>
                                        <button className="hover:text-black"><FiList /></button>
                                        <button className="hover:text-black"><FiAlignLeft /></button>
                                    </div>
                                    <textarea className="w-full h-40 p-4 outline-none resize-none text-sm text-gray-800 font-medium bg-transparent"></textarea>
                                </div>
                            </div>
                        </div>

                        {/* Pricing */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-50">
                            <h3 className="text-lg font-bold text-gray-900 mb-6 font-sans">Pricing</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-bold text-gray-800 mb-2">Price</label>
                                    <input type="text" className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/10 transition-all text-sm text-gray-800 font-medium" />
                                </div>
                                <div>
                                    <label className="flex items-center gap-2 text-sm font-bold text-gray-800 mb-2">Compare at Price <FiInfo className="text-gray-400 text-xs" /></label>
                                    <input type="text" className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/10 transition-all text-sm text-gray-800 font-medium" />
                                </div>
                            </div>
                        </div>

                        {/* Inventory */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-50">
                            <h3 className="text-lg font-bold text-gray-900 mb-6 font-sans">Inventory</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div>
                                    <label className="block text-sm font-bold text-gray-800 mb-2">SKU</label>
                                    <input type="text" className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/10 transition-all text-sm text-gray-800 font-medium" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-800 mb-2">Barcode</label>
                                    <input type="text" className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/10 transition-all text-sm text-gray-800 font-medium" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-800 mb-2">Quantity</label>
                                    <input type="text" className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/10 transition-all text-sm text-gray-800 font-medium" />
                                </div>
                            </div>
                        </div>

                        {/* Variants */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-50">
                            <h3 className="text-lg font-bold text-gray-900 mb-6 font-sans">Variants</h3>
                            <div className="flex items-center gap-3 mb-8">
                                <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-cyan-400 focus:ring-cyan-400/50 cursor-pointer" />
                                <label className="text-sm font-bold text-gray-800 cursor-pointer resize-none leading-relaxed">This product has options like color or size</label>
                            </div>
                            <div className="flex flex-col md:flex-row gap-4 md:items-end">
                                <div className="md:w-[30%]">
                                    <label className="block text-sm font-bold text-gray-800 mb-2">Variants type</label>
                                    <select className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/10 transition-all text-sm font-medium text-gray-800 appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23111%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[length:10px_10px] bg-[position:right_15px_center]">
                                        <option>Color</option>
                                        <option>Size</option>
                                    </select>
                                </div>
                                <div className="flex-1 w-full md:w-auto">
                                    <label className="block text-sm font-bold text-gray-800 mb-2">Values</label>
                                    <div className="flex gap-2">
                                        <div className="flex-1 w-full border border-gray-200 rounded-xl px-4 py-[9px] outline-none focus-within:border-cyan-400 focus-within:ring-2 focus-within:ring-cyan-400/10 transition-all text-sm flex flex-wrap gap-2 bg-white min-h-[46px] items-center min-w-0">
                                            <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-lg flex items-center justify-between gap-3 font-bold text-xs whitespace-nowrap">Black <span className="text-gray-400 hover:text-red-500 cursor-pointer leading-none text-base transition-colors shrink-0">&times;</span></span>
                                        </div>
                                        <button className="w-12 h-[46px] border border-gray-200 rounded-xl flex items-center justify-center hover:border-gray-300 hover:bg-gray-50 transition-colors text-gray-400 hover:text-gray-800 shrink-0">
                                            <FiPlus className="text-xl" />
                                        </button>
                                    </div>
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
                                    accept="image/jpeg, image/png"
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                    title=""
                                />
                                <FiUploadCloud className="text-[32px] text-gray-400 mb-3 group-hover:text-cyan-400 transition-colors stroke-1 relative z-0" />
                                <p className="text-xs font-bold text-gray-900 mb-3 relative z-0">Drag & Drop Images</p>
                                <button type="button" className="px-4 py-2 border border-cyan-400 text-cyan-600 font-bold rounded-lg text-xs mb-3 hover:bg-cyan-50 transition-colors bg-white relative z-0 pointer-events-none">Browse Files</button>
                                <p className="text-[9px] text-gray-400 uppercase tracking-widest font-bold relative z-0 pointer-events-none">Supports JPG, PNG, Max 5MB.</p>
                            </div>

                            <div className="flex flex-wrap gap-3">
                                <div className="w-[50px] h-[50px] border border-dashed border-gray-400/60 rounded-xl flex items-center justify-center text-gray-400 hover:bg-gray-50 cursor-pointer overflow-hidden p-[2px]">
                                    <FiImage className="text-xl opacity-50" />
                                </div>
                                <div className="w-[50px] h-[50px] border border-dashed border-gray-400/60 rounded-xl flex items-center justify-center text-gray-400 hover:bg-gray-50 cursor-pointer overflow-hidden p-[2px]">
                                    <FiImage className="text-xl opacity-50" />
                                </div>
                                <div className="w-[50px] h-[50px] border border-dashed border-gray-400/60 rounded-xl flex items-center justify-center text-gray-400 hover:bg-gray-50 cursor-pointer overflow-hidden p-[2px]">
                                    <FiImage className="text-xl opacity-50" />
                                </div>
                            </div>
                        </div>

                        {/* Organization */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-50">
                            <h3 className="text-lg font-bold text-gray-900 mb-6 font-sans">Organizaion</h3>

                            <div className="mb-6">
                                <label className="block text-sm font-bold text-gray-800 mb-2">Category</label>
                                <select className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/10 transition-all text-sm font-medium text-gray-800 appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23111%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[length:10px_10px] bg-[position:right_15px_center]">
                                    <option>Audio</option>
                                    <option>Electronics</option>
                                    <option>Wearables</option>
                                </select>
                            </div>

                            <div className="mb-6">
                                <label className="block text-sm font-bold text-gray-800 mb-2">Sub-Category</label>
                                <select className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/10 transition-all text-sm font-medium text-gray-800 appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23111%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[length:10px_10px] bg-[position:right_15px_center]">
                                    <option>Headphones</option>
                                    <option>Earbuds</option>
                                    <option>Speakers</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-800 mb-2">Brand</label>
                                <select className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/10 transition-all text-sm font-medium text-gray-800 appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23111%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[length:10px_10px] bg-[position:right_15px_center]">
                                    <option>Audio</option>
                                    <option>Sony</option>
                                    <option>Bose</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default AdminAddProduct;
