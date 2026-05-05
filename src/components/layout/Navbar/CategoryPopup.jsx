import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiX, FiChevronRight, FiChevronLeft } from 'react-icons/fi';

const CategoryPopup = ({ data, isOpen, onClose }) => {
    const [selectedCategory, setSelectedCategory] = useState(null);

    if (!isOpen) return null;

    const handleCategoryClick = (category) => {
        if (category.children && category.children.length > 0) {
            setSelectedCategory(category);
        } else {
            // If no subcategories, just navigate (or handle as needed)
            onClose();
        }
    };

    const handleBack = () => {
        setSelectedCategory(null);
    };

    return (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center px-4 py-6 sm:p-0">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity"
                onClick={onClose}
            ></div>

            {/* Modal Content */}
            <div className="relative w-full max-w-2xl bg-[#1A1A1A]/90 border border-white/10 rounded-[30px] shadow-2xl overflow-hidden animate-fade-in-up">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-white/10">
                    <div className="flex items-center gap-3">
                        {selectedCategory && (
                            <button
                                onClick={handleBack}
                                className="p-2 hover:bg-white/10 rounded-full transition-colors text-white"
                            >
                                <FiChevronLeft size={24} />
                            </button>
                        )}
                        <h2 className="text-2xl font-bold text-white tracking-tight">
                            {selectedCategory ? selectedCategory.name : 'All Categories'}
                        </h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/10 rounded-full transition-colors text-white/70 hover:text-white"
                    >
                        <FiX size={24} />
                    </button>
                </div>

                {/* Content Area */}
                <div className="p-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
                    {!selectedCategory ? (
                        /* Main Categories Grid */
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {data && data.map((niche) => (
                                <button
                                    key={niche._id}
                                    onClick={() => handleCategoryClick(niche)}
                                    className="flex items-center justify-between p-5 bg-white/5 hover:bg-white/10 border border-white/5 hover:border-[#02D5E0]/30 rounded-2xl transition-all group text-left"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-white/10 rounded-xl overflow-hidden flex items-center justify-center shrink-0 border border-white/5 group-hover:border-[#02D5E0]/50 transition-colors">
                                            {niche.image ? (
                                                <img src={niche.image} alt={niche.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full bg-gradient-to-br from-[#02D5E0]/20 to-transparent flex items-center justify-center text-[10px] font-bold text-white/40">
                                                    CAT
                                                </div>
                                            )}
                                        </div>
                                        <span className="text-lg font-medium text-white/90 group-hover:text-[#02D5E0] transition-colors uppercase tracking-wide">
                                            {niche.name}
                                        </span>
                                    </div>
                                    {niche.children && niche.children.length > 0 && (
                                        <FiChevronRight className="text-white/30 group-hover:text-[#02D5E0] transition-colors" size={20} />
                                    )}
                                </button>
                            ))}
                        </div>
                    ) : (
                        /* Subcategories List */
                        <div className="flex flex-col gap-6">
                            {selectedCategory.children.map((cat) => (
                                <div key={cat._id} className="space-y-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-white/5 rounded-lg overflow-hidden flex items-center justify-center shrink-0 border border-white/5">
                                            {cat.image ? (
                                                <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full bg-gradient-to-br from-[#02D5E0]/10 to-transparent flex items-center justify-center text-[8px] font-bold text-white/30">
                                                    SUB
                                                </div>
                                            )}
                                        </div>
                                        <Link
                                            to={`/category/${cat._id}`}
                                            onClick={onClose}
                                            className="text-[#02D5E0] font-bold text-lg hover:underline transition-all"
                                        >
                                            {cat.name}
                                        </Link>
                                    </div>

                                    {cat.children && cat.children.length > 0 && (
                                        <div className="flex flex-col gap-1 pl-4 border-l border-white/5">
                                            {cat.children.map((sub) => (
                                                <Link
                                                    key={sub._id}
                                                    to={`/shop?category=${sub._id}`}
                                                    onClick={onClose}
                                                    className="flex items-center gap-3 text-white/50 hover:text-[#02D5E0] text-sm py-2 border-b border-white/[0.03] last:border-0 transition-colors group/sub"
                                                >
                                                    <div className="w-6 h-6 bg-white/5 rounded overflow-hidden flex items-center justify-center shrink-0 border border-white/5 group-hover/sub:border-[#02D5E0]/30 transition-colors">
                                                        {sub.image ? (
                                                            <img src={sub.image} alt={sub.name} className="w-full h-full object-cover" />
                                                        ) : (
                                                            <div className="w-full h-full bg-gradient-to-br from-[#02D5E0]/5 to-transparent flex items-center justify-center text-[6px] font-bold text-white/20">
                                                                S
                                                            </div>
                                                        )}
                                                    </div>
                                                    {sub.name}
                                                </Link>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer / CTA */}
                <div className="p-6 bg-white/5 border-t border-white/10 flex justify-center">
                    <Link
                        to="/shop"
                        onClick={onClose}
                        className="text-white/50 hover:text-[#02D5E0] text-sm font-medium transition-colors"
                    >
                        View All Products
                    </Link>
                </div>
            </div>

            <style>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: rgba(255, 255, 255, 0.05);
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(2, 213, 224, 0.3);
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(2, 213, 224, 0.5);
                }
            `}</style>
        </div>
    );
};

export default CategoryPopup;
