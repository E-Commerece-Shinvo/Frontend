import React from 'react';
import homeHeroBg from '../../assets/home_hero_bg.png';
import homeHeroProducts from '../../assets/home_hero_product_composition.png';
import { FaArrowRight } from 'react-icons/fa';
import Navbar from '../layout/Navbar/Navbar';

const AboutHero = () => {
    return (
        <div className="relative w-full min-h-[600px] lg:h-[800px] overflow-hidden flex items-center bg-black">
            <Navbar />
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
                <img
                    src={homeHeroBg}
                    alt="Digital Background"
                    className="w-full h-full object-cover opacity-80"
                />
                {/* Gradient Overlay for text readability */}
                {/* <div className="absolute inset-0 bg-linear-to-r from-black/60 via-black/40 to-transparent"></div> */}
            </div>

            <div className="max-w-7xl mx-auto px-6 relative z-10 w-full flex flex-col-reverse lg:flex-row items-center justify-between">

                {/* Product Composition (Left Side) */}
                <div className="w-full lg:w-1/2 flex justify-center lg:justify-start mt-10 lg:mt-0 bg-red-500">
                    <img
                        src={homeHeroProducts}
                        alt="Premium Mobile Accessories"
                        className="w-full max-w-[500px] object-contain drop-shadow-2xl animate-fade-in-up"
                    />
                </div>

                {/* Text Content (Right Side) */}
                <div className="w-full lg:w-1/2 text-center text-white bg-blue-500 relative">
                    <h2 className="text-xl md:text-2xl font-light mb-2 text-cyan-400 uppercase">
                        Empowering Your
                    </h2>
                    <h1 className="text-6xl md:text-[150px] font-black text-transparent bg-clip-text bg-linear-to-b from-[#14d3dc] to-[#124349] mb-2 leading-tight tracking-tighter drop-shadow-[10px_10px_10px_rgba(0,0,0,0.5)]">
                        DIGITAL
                    </h1>
                    <h1 className="text-6xl md:text-7xl font-black text-white mb-6 leading-tight tracking-tighter absolute top-[150px] left-[50%] translate-x-[-50%] drop-shadow-[5px_5px_5px_rgba(0,0,0,0.5)]">
                        LIFE
                    </h1>
                    <p className="text-gray-300 text-lg md:text-xl font-light max-w-xl mx-auto lg:ml-auto lg:mr-0 mb-8">
                        The destination for premium, authentic mobile accessories in Pakistan.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AboutHero;
