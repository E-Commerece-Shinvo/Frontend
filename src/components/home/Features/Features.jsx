import React from 'react';
import { FiShield, FiTruck, FiStar, FiTag } from "react-icons/fi";

const Features = () => {
    const features = [
        {
            id: 1,
            icon: <FiShield className="w-[40px] h-[40px] text-cta-cyan" />,
            title: "1-Year",
            subtitle: "Warranty"
        },
        {
            id: 2,
            icon: <FiTruck className="w-[40px] h-[40px] text-cta-cyan" />,
            title: "Fast, Reliable",
            subtitle: "Shipping"
        },
        {
            id: 3,
            icon: <FiStar className="w-[40px] h-[40px] text-cta-cyan" />,
            title: "10,000+ 5-Star",
            subtitle: "Reviews"
        },
        {
            id: 4,
            icon: <FiTag className="w-[40px] h-[40px] text-cta-cyan" />,
            title: "Genuine Products",
            subtitle: "Guaranteed"
        }
    ];

    return (
        <div className="w-full max-w-[1920px] mx-auto px-2 md:px-4 py-6 md:py-10">
            <div className="grid grid-cols-4 gap-2 md:gap-6">
                {features.map((feature) => (
                    <div key={feature.id} className="bg-white border border-gray-200 rounded-[10px] md:rounded-[20px] p-2 md:p-6 flex flex-col items-center justify-center text-center gap-2 md:gap-4 hover:shadow-lg transition-shadow cursor-pointer h-[100px] md:h-[150px]">
                        {React.cloneElement(feature.icon, { className: "w-[24px] h-[24px] md:w-[40px] md:h-[40px] text-cta-cyan" })}
                        <div className="flex flex-col items-center justify-center">
                            <h3 className="text-[10px] md:text-lg font-medium text-primary-text leading-tight">{feature.title}</h3>
                            <p className="text-[10px] md:text-lg font-medium text-primary-text leading-tight">{feature.subtitle}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Features;
