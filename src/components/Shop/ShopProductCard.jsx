import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const ShopProductCard = ({ product }) => {
    // Default fallback image if none provided
    const defaultImage = "https://placehold.co/400x400/202020/FFFFFF?text=Product";
    const displayImage = product?.image || defaultImage;

    return (
        <Link to={`/product/${product?._id || 1}`} className="block w-full group">
            <div className="bg-white rounded-3xl p-4 shadow hover:shadow-lg transition-shadow duration-300 w-full h-full flex flex-col">
                {/* Image Placeholder */}
                <div className="bg-gray-100 rounded-2xl w-full aspect-square mb-4 overflow-hidden relative flex items-center justify-center">
                    <img
                        src={displayImage}
                        alt={product?.title || "Product"}
                        className="w-[80%] h-[80%] object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-300"
                    />
                </div>

                {/* Content */}
                <div className="text-left flex flex-col flex-grow justify-between">
                    <div>
                        <h3 className="font-bold text-gray-900 text-lg uppercase tracking-wide line-clamp-1">
                            {product?.title || "PHONE CASE"}
                        </h3>
                        <p className="text-gray-500 text-xs mb-3">
                            {product?.brand || "Brand"}
                        </p>
                    </div>

                    <div className="flex justify-between items-center mt-2">
                        <span className="font-bold text-lg text-cyan-600">
                            ${product?.price?.toFixed(2) || "0.00"}
                        </span>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default ShopProductCard;
