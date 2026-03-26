import React from 'react';
import { Link } from 'react-router-dom';
import smartwatchImg from '../../../assets/images/watch_cat.gif';

const CategoryDropdown = ({ data, isOpen, onClose }) => {
    if (!isOpen) return null;

    // Split data into columns
    // We want: Col 1 (Charger, Audio), Col 2 (Protection, Accessories), Col 3 (Brands), Col 4 (Image)
    // Adjusting based on design image which shows 3 cols of text + 1 image col

    return (
        <div
            className="absolute top-[80px] lg:top-[120px] left-[5%] w-[90%] bg-white text-black shadow-2xl rounded-[30px] p-10 z-50 animate-fade-in-up"
            onMouseLeave={onClose} // Optional: close on mouse leave for better UX, though user asked for click
        >
            <div className="max-w-7xl mx-auto flex flex-wrap justify-between gap-8">

                {/* Column 1 */}
                <div className="flex flex-col gap-8 w-[18%]">
                    <div>
                        <h3 className="font-bold text-lg mb-4 uppercase tracking-wider">Charger & Adapter</h3>
                        <ul className="flex flex-col gap-2 text-gray-600">
                            {data["Charger & Adapter"].map((item) => (
                                <li key={item}><Link to="/shop" className="hover:text-[#02D5E0] transition-colors">{item}</Link></li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-bold text-lg mb-4 uppercase tracking-wider">Audio & Wearables</h3>
                        <ul className="flex flex-col gap-2 text-gray-600">
                            {data["Audio & Wearables"].map((item) => (
                                <li key={item}><Link to="/shop" className="hover:text-[#02D5E0] transition-colors">{item}</Link></li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Column 2 */}
                <div className="flex flex-col gap-8 w-[17%]">
                    <div>
                        <h3 className="font-bold text-lg mb-4 uppercase tracking-wider">Protection</h3>
                        <ul className="flex flex-col gap-2 text-gray-600">
                            {data["Protection"].map((item) => (
                                <li key={item}><Link to="/shop" className="hover:text-[#02D5E0] transition-colors">{item}</Link></li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-bold text-lg mb-4 uppercase tracking-wider">Accessories</h3>
                        <ul className="flex flex-col gap-2 text-gray-600">
                            {data["Accessories"].map((item) => (
                                <li key={item}><Link to="/shop" className="hover:text-[#02D5E0] transition-colors">{item}</Link></li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Column 3 - Brands */}
                <div className="w-[30%] xl:w-[20%]">
                    <h3 className="font-bold text-lg mb-4 uppercase tracking-wider">Shop By Brands</h3>
                    <ul className="flex flex-col gap-2 text-gray-600">
                        {data["Shop By Brands"].map((item) => (
                            <li key={item}><Link to="/shop" className="hover:text-[#02D5E0] transition-colors">{item}</Link></li>
                        ))}
                    </ul>
                </div>

                {/* Column 4 - Image Card */}
                {/* <div className="w-full xl:w-[35%] rounded-[30px] relative group cursor-pointer"> */}
                {/* <div className="absolute inset-0 bg-white p-6 w-[70%] h-full rounded-r-[30%] z-0"></div> */}
                {/* <div className="absolute top-1/2 right-10 transform -translate-y-1/2 z-10 w-[180px]">
                        <img src={smartwatchImg} alt="Smart Watch" className="w-full object-contain drop-shadow-2xl group-hover:scale-110 transition-transform duration-500" />
                    </div> */}
                {/* <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-20 text-gray-800 font-medium">
                        Shop Now
                    </div> */}
                {/* Recreating the specific card look from image: White box on left, Black on right with Watch */}
                {/* <div className="absolute top-0 right-0 w-[40%] h-full bg-black z-0"></div> */}
                {/* <div className="absolute top-0 left-0 w-[60%] h-full bg-white rounded-r-[50px] z-0"></div> */}
                <div className="w-[40%] mx-auto xl:mx-0 flex flex-col gap-5 xl:w-[35%] object-contain cursor-pointer rounded-[30px] drop-shadow-2xl drop-shadow-[0_0_10px_rgba(0,0,0,0.7)]">
                    <img
                        src={smartwatchImg}
                        alt="Smartwatch"
                        className="w-full object-contain cursor-pointer rounded-[30px]"
                    />
                    <span className="text-center text-gray-400 font-medium hover:text-cyan-500">Shop Now</span>
                </div>

                {/* <div className="absolute bottom-8 left-10 z-10">
                        <span className="text-gray-400 text-sm block mb-1">New Arrival</span>
                        <span className="text-black font-bold text-xl">Smart Watch</span>
                    </div> */}
            </div>
            {/* </div> */}
        </div >
    );
};

export default CategoryDropdown;
