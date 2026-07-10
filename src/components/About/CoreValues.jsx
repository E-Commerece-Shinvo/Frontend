import React from 'react';
import { FaCheckCircle, FaShieldAlt, FaTruck, FaHeadset } from 'react-icons/fa';

const CoreValues = () => {
    const values = [
        {
            id: 1,
            icon: <FaCheckCircle className="text-4xl text-cyan-400 group-hover:text-black" />,
            title: "100% Original Guarantee",
            description: "We source directly from authorized distributors. No fakes, no copies, no A-Grade replicas. Just the real deal.",
            bg: "bg-gray-100",
            textColor: "text-black",
        },
        {
            id: 2,
            icon: <FaShieldAlt className="text-4xl text-cyan-400 group-hover:text-black" />,
            title: "Tested for Quality",
            description: "Every product in our store is curated for durability and performance. We focus on gadgets that last.",
            bg: "bg-gray-100",
            textColor: "text-black"
        },
        {
            id: 3,
            icon: <FaTruck className="text-4xl text-cyan-400 group-hover:text-black" />,
            title: "Fast Nationwide Shipping",
            description: "Your tech needs are urgent. We ensure your order is packed securely and shipped quickly to your doorstep.",
            bg: "bg-gray-100",
            textColor: "text-black"
        },
        {
            id: 4,
            icon: <FaHeadset className="text-4xl text-cyan-400 group-hover:text-black" />,
            title: "Expert Support",
            description: "Not sure which charger fits your Pixel? Need a case for your iPhone? Our team is here to help you make the right choice.",
            bg: "bg-gray-100",
            textColor: "text-black"
        }
    ];

    return (
        <div className="w-full bg-white pt-20 pb-8 md:pb-20">
            <div className="max-w-7xl mx-auto px-6 text-center">
                <h2 className="text-4xl font-bold mb-4">Our Core Values</h2>
                <p className="text-gray-500 mb-16">Built on trust, curated for quality, and delivered with care.</p>

                <div className="flex overflow-x-auto pb-8 -mx-6 px-6 md:mx-0 md:px-0 md:overflow-visible md:pb-0 md:grid md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                    {values.map((value) => (
                        <div key={value.id} className={`min-w-[85vw] sm:min-w-[320px] md:min-w-0 w-full flex-shrink-0 snap-center ${value.bg} rounded-3xl p-8 shadow-lg hover:bg-cyan-400 transition-all duration-400 group flex flex-col items-center hover:shadow-2xl transition-shadow duration-300`}>
                            <div className="bg-white p-4 rounded-full shadow-md mb-6 relative">
                                {value.icon}
                            </div>
                            <h3 className={`text-xl font-bold mb-4 ${value.textColor}`}>{value.title}</h3>
                            <p className={`text-sm leading-relaxed ${value.textColor === 'text-white' ? 'text-gray-100' : 'text-gray-600'}`}>
                                {value.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CoreValues;
