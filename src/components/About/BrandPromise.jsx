import React from 'react';
import { FaArrowRight } from 'react-icons/fa';

const BrandPromise = () => {
    return (
        <div className="w-full bg-gray-50 py-24 text-center">
            <div className="max-w-4xl mx-auto px-6">
                <h2 className="text-4xl md:text-5xl font-bold mb-12">The Brand Promise</h2>

                <blockquote className="text-xl md:text-2xl text-gray-700 italic leading-relaxed mb-12 font-medium">
                    "We believe technology should make your life easier, not harder. That's why we stand behind every product with a comprehensive warranty and a hassle-free return policy. Shop with confidence."
                </blockquote>

                <a href="#" className="inline-flex items-center gap-3 bg-cyan-400 text-black hover:text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-[#216e73] transition-colors shadow-lg hover:shadow-cyan-400/50">
                    Explore Our Collection
                    <div className="bg-white p-1 rounded-full">
                        <FaArrowRight className="text-sm -rotate-45 text-black" />
                    </div>
                </a>
            </div>
        </div>
    );
};

export default BrandPromise;
