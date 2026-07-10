import React from 'react';
import { Link } from 'react-router-dom';
import smartwatchImg from '../../../assets/images/watch_cat.gif';

const CategoryDropdown = ({ data, isOpen, onClose, className }) => {
    if (!isOpen || !data || data.length === 0) return null;

    const getCategoryByName = (name) => data.find(c => c.name.toLowerCase() === name.toLowerCase());

    const accessories = getCategoryByName('Accessories');
    const audio = getCategoryByName('Audio & Wearables');
    const brands = getCategoryByName('Shop By Brands');
    const charger = getCategoryByName('Charger & Adapter');
    const protection = getCategoryByName('Protection');

    // Filter out the 5 default categories to capture any new parent categories
    const others = data.filter(c => 
        !['accessories', 'charger & adapter', 'audio & wearables', 'protection', 'shop by brands']
        .includes(c.name.toLowerCase())
    );

    // Build the ordered array of categories to fit exactly into a 3-column grid row-by-row
    const orderedCategories = [];
    if (accessories) orderedCategories.push(accessories);
    if (audio) orderedCategories.push(audio);
    if (brands) orderedCategories.push(brands);
    if (charger) orderedCategories.push(charger);
    if (protection) orderedCategories.push(protection);
    orderedCategories.push(...others);

    return (
        <div
            className={className || "absolute top-[80px] lg:top-[120px] left-[5%] w-[90%] bg-white text-black shadow-2xl rounded-[30px] p-10 z-50 animate-fade-in-up"}
            onMouseLeave={onClose}
        >
            <div className="max-w-[1720px] mx-auto flex flex-wrap justify-between gap-8">

                {/* 3-Column Grid for Categories */}
                <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-y-12 gap-x-10 max-h-[480px] overflow-y-auto custom-scrollbar pr-4">
                    {orderedCategories.map((parentCat) => (
                        <div key={parentCat._id} className="flex flex-col">
                            <h3 className="font-bold text-lg mb-4 uppercase tracking-wider">{parentCat.name}</h3>
                            <ul className="flex flex-col gap-2 text-gray-600">
                                {parentCat.children?.map((cat) => (
                                    <li key={cat._id} className="flex items-center gap-2 group">
                                        <div className="w-8 h-8 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center shrink-0 border border-gray-200 group-hover:border-[#02D5E0]/30 transition-colors">
                                            {cat.image ? (
                                                <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full bg-gradient-to-br from-[#02D5E0]/10 to-transparent flex items-center justify-center text-[8px] font-bold text-gray-400">
                                                    C
                                                </div>
                                            )}
                                        </div>
                                        <Link to={`/category/${cat._id}`} className="hover:text-[#02D5E0] transition-colors">{cat.name}</Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Column 4 - Promo Card */}
                <div className="w-[30%] flex flex-col gap-5 object-contain cursor-pointer rounded-[30px] drop-shadow-2xl">
                    <div className="bg-black/5 rounded-[40px] p-2 flex flex-col items-center">
                        <img
                            src={smartwatchImg}
                            alt="Recommended"
                            className="w-full max-h-[300px] object-contain cursor-pointer rounded-[30px] hover:scale-105 transition-transform duration-500"
                        />
                        <span className="text-center text-gray-400 font-medium hover:text-cyan-500 mt-4 pb-4">
                            Shop Now
                        </span>
                    </div>
                </div>
            </div>

            <style>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(0, 0, 0, 0.15);
                    border-radius: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(0, 0, 0, 0.3);
                }
            `}</style>
        </div>
    );
};

export default CategoryDropdown;
