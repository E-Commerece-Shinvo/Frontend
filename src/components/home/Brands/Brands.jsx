import React from 'react';
import { 
    SiSamsung, 
    SiApple, 
    SiVivo, 
    SiOppo, 
    SiXiaomi, 
    SiSony, 
    SiHuawei, 
    SiLenovo, 
    SiAsus, 
    SiLg 
} from "react-icons/si";

const Brands = () => {
    const iconClass = "text-5xl md:text-7xl text-gray-500 hover:text-gray-900 transition-colors duration-300";
    
    const brands = [
        { id: 1, icon: <SiApple className={`${iconClass} hover:text-black`} />, name: "Apple" },
        { id: 2, icon: <SiSamsung className={`${iconClass} hover:text-[#1428A0]`} />, name: "Samsung" },
        { id: 3, icon: <SiVivo className={`${iconClass} hover:text-[#415FFF]`} />, name: "Vivo" },
        { id: 4, icon: <SiOppo className={`${iconClass} hover:text-[#006835]`} />, name: "Oppo" },
        { id: 5, icon: <SiXiaomi className={`${iconClass} hover:text-[#FF6900]`} />, name: "Xiaomi" },
        { id: 6, icon: <SiSony className={`${iconClass} hover:text-black`} />, name: "Sony" },
        { id: 7, icon: <SiHuawei className={`${iconClass} hover:text-[#FF0000]`} />, name: "Huawei" },
        { id: 8, icon: <SiLenovo className={`${iconClass} hover:text-[#E2231A]`} />, name: "Lenovo" },
        { id: 9, icon: <SiAsus className={`${iconClass} hover:text-[#00539B]`} />, name: "Asus" },
        { id: 10, icon: <SiLg className={`${iconClass} hover:text-[#A50034]`} />, name: "LG" },
    ];

    return (
        <div className="w-full bg-gray-100 py-12 overflow-hidden border-t border-b border-gray-200">
            {/* 
                Wrapper must be wide enough. 
                If we use a fixed width percentage like 200%, it implies the content exactly fills 100% twice.
                Better approach with Tailwind arbitrary values if needed, or stick to the double-render logic.
             */}
            <div className="flex w-max animate-marquee hover:[animation-play-state:paused] items-center">
                {/* First Set of Brands */}
                <div className="flex items-center gap-16 md:gap-24 px-8 md:px-12 shrink-0">
                    {brands.map((brand) => (
                        <div key={brand.id} className="flex items-center justify-center cursor-pointer">
                            {brand.icon}
                        </div>
                    ))}
                </div>

                {/* Second Set of Brands (Duplicate for Loop) */}
                <div className="flex items-center gap-16 md:gap-24 px-8 md:px-12 shrink-0">
                    {brands.map((brand) => (
                        <div key={`dup-${brand.id}`} className="flex items-center justify-center cursor-pointer">
                            {brand.icon}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Brands;
