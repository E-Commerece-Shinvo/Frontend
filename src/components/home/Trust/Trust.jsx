import React from 'react';
import { FaQuoteLeft, FaQuoteRight } from 'react-icons/fa';

const Trust = () => {
    return (
        <div className="w-full py-15 bg-white flex flex-col items-center justify-center px-4">
            {/* Heading */}
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 text-center mb-16 leading-tight max-w-[1920px]">
                Premium Mobile Accessories <br className='hidden md:block' /> You Can <span className="text-cyan-400">Trust</span>
            </h2>

            {/* Quote Section */}
            <div className="relative max-w-2xl lg:max-w-4xl text-center px-8 md:px-0 mx-auto mt-8 md:mt-0">
                <FaQuoteLeft className="text-cyan-400 text-3xl md:text-5xl lg:text-6xl absolute -top-8 -left-4 md:-left-12 lg:-left-20" />

                <p className="text-gray-600 text-sm md:text-lg leading-relaxed font-medium">
                    At <span className="font-bold text-gray-800">[Your Store Name]</span>, we believe your device deserves the best. We are your one-stop destination for 100% original chargers, durable data cables, and premium protection for iPhone, Samsung, Pixel, and Xiaomi. Whether you need a fast-charging Anker power bank or the latest Soundcore earbuds, we guarantee quality, authenticity, and exceptional customer service. Upgrade your mobile experience today.
                </p>

                <FaQuoteRight className="text-cyan-400 text-3xl md:text-5xl lg:text-6xl absolute -bottom-8 -right-4 md:-right-12 lg:-right-16" />
            </div>
        </div>
    );
};

export default Trust;
