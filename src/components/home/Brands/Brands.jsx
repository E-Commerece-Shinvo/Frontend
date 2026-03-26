import React from 'react';
import { SiSamsung, SiApple, SiGoogle } from "react-icons/si";

const Brands = () => {
    const brands = [
        { id: 1, icon: <SiSamsung className="text-3xl md:text-4xl text-blue-700" size={100} />, name: "SAMSUNG" },
        { id: 2, icon: <SiGoogle className="text-3xl md:text-4xl text-red-500" />, name: "Pixel" },
        { id: 3, icon: <SiApple className="text-3xl md:text-4xl text-black" />, name: "Apple" },
        { id: 4, icon: <span className="text-2xl md:text-3xl font-bold text-green-600">UGREEN</span>, name: "UGREEN" },
        { id: 5, icon: <span className="text-2xl md:text-3xl font-bold text-black">soundcore</span>, name: "soundcore" },
        { id: 6, icon: <span className="text-2xl md:text-3xl font-bold text-black">JOYROOM</span>, name: "JOYROOM" },
        { id: 7, icon: <span className="text-2xl md:text-3xl font-bold text-black">baseus</span>, name: "baseus" },
        { id: 8, icon: <span className="text-3xl md:text-4xl font-bold text-blue-500">ANKER</span>, name: "ANKER" },
        { id: 9, icon: <span className="text-2xl md:text-3xl font-bold text-blue-400">SOUNDPEATS</span>, name: "SOUNDPEATS" },
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
