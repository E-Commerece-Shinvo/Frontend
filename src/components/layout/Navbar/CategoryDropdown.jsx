import React from 'react';
import { Link } from 'react-router-dom';
import smartwatchImg from '../../../assets/images/watch_cat.gif';

const CategoryDropdown = ({ data, isOpen, onClose }) => {
    if (!isOpen || !data || data.length === 0) return null;

    // We have 5 niches:
    // data[0]: Charger & Adapter
    // data[1]: Protection
    // data[2]: Audio & Wearables
    // data[3]: Accessories
    // data[4]: Shop By Brands

    return (
        <div
            className="absolute top-[80px] lg:top-[120px] left-[5%] w-[90%] bg-white text-black shadow-2xl rounded-[30px] p-10 z-50 animate-fade-in-up"
            onMouseLeave={onClose}
        >
            <div className="max-w-[1720px] mx-auto flex flex-wrap justify-between gap-8">

                {/* Column 1 - Charger & Audio */}
                <div className="flex flex-col gap-10 w-[22%]">
                    {data[0] && (
                        <div>
                            <h3 className="font-bold text-lg mb-4 uppercase tracking-wider">{data[0].name}</h3>
                            <ul className="flex flex-col gap-2 text-gray-600">
                                {data[0].children?.map((cat) => (
                                    <li key={cat._id}>
                                        <Link to={`/category/${cat._id}`} className="hover:text-[#02D5E0] transition-colors">{cat.name}</Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                    {data[2] && (
                        <div>
                            <h3 className="font-bold text-lg mb-4 uppercase tracking-wider">{data[2].name}</h3>
                            <ul className="flex flex-col gap-2 text-gray-600">
                                {data[2].children?.map((cat) => (
                                    <li key={cat._id}>
                                        <Link to={`/category/${cat._id}`} className="hover:text-[#02D5E0] transition-colors">{cat.name}</Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>

                {/* Column 2 - Protection & Accessories */}
                <div className="flex flex-col gap-10 w-[22%]">
                    {data[1] && (
                        <div>
                            <h3 className="font-bold text-lg mb-4 uppercase tracking-wider">{data[1].name}</h3>
                            <ul className="flex flex-col gap-2 text-gray-600">
                                {data[1].children?.map((cat) => (
                                    <li key={cat._id}>
                                        <Link to={`/category/${cat._id}`} className="hover:text-[#02D5E0] transition-colors">{cat.name}</Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                    {data[3] && (
                        <div>
                            <h3 className="font-bold text-lg mb-4 uppercase tracking-wider">{data[3].name}</h3>
                            <ul className="flex flex-col gap-2 text-gray-600">
                                {data[3].children?.map((cat) => (
                                    <li key={cat._id}>
                                        <Link to={`/category/${cat._id}`} className="hover:text-[#02D5E0] transition-colors">{cat.name}</Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>

                {/* Column 3 - Brands */}
                <div className="w-[18%]">
                    {data[4] && (
                        <>
                            <h3 className="font-bold text-lg mb-4 uppercase tracking-wider">{data[4].name}</h3>
                            <ul className="flex flex-col gap-2 text-gray-600">
                                {data[4].children?.map((cat) => (
                                    <li key={cat._id}>
                                        <Link to={`/shop?brand=${cat.name}`} className="hover:text-[#02D5E0] transition-colors">{cat.name}</Link>
                                    </li>
                                ))}
                            </ul>
                        </>
                    )}
                </div>

                {/* Column 4 - Image Card */}
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
        </div>
    );
};

export default CategoryDropdown;
