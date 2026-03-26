import React from 'react';
import { FaArrowRight } from 'react-icons/fa6';
import powerbankImg from '../../../assets/images/rec1.png';
import earbudsImg from '../../../assets/images/rec2.png';

const PowerYourLife = () => {
    return (
        <div className="w-full py-15 flex flex-col items-center gap-12 px-4 mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900">Power Your Life</h2>

            {/* Power Bank Card */}
            <div className="w-full max-w-[1920px] bg-gray-200 rounded-3xl overflow-hidden flex flex-col md:flex-row h-[600px] shadow-[0_20px_50px_-12px_rgba(0,0,0,0.5)]">
                {/* Image Section (Left) */}
                <div className="w-full md:w-1/2 h-1/2 md:h-full relative">
                    <img
                        src={powerbankImg}
                        alt="Power bank charging phone"
                        className="absolute inset-0 w-full h-full object-cover"
                    />
                    {/* Gradient Overlay for better integration */}
                    {/* Gradient Overlay for better integration */}
                    {/* <div className="absolute inset-0 bg-gradient-to-t from-[#02D5E0]/70 to-transparent mix-blend-multiply"></div> */}
                </div>

                {/* Text Section (Right) */}
                <div className="w-full md:w-1/2 h-1/2 md:h-full flex flex-col justify-center items-center p-8 md:pl-16 text-center md:text-left bg-gray-200">
                    <h3 className="text-4xl font-bold text-gray-900 mb-4">On-The-Go Power</h3>
                    <p className="text-gray-600 font-medium mb-8">Stay charged all day, every day.</p>
                    <button className="btn-primary text-black px-8 py-3 rounded-full font-bold flex items-center gap-2 active:bg-white active:text-cyan-500 transition-colors shadow-md">
                        Shop Power Banks
                        <div className="bg-white rounded-full p-1 ml-1 w-6 h-6 flex items-center justify-center">
                            <FaArrowRight className="text-xs text-black -rotate-45" />
                        </div>
                    </button>
                </div>
            </div>

            {/* Earbuds Card */}
            <div className="w-full max-w-[1920px] bg-gray-200 rounded-3xl overflow-hidden flex flex-col md:flex-row h-[600px] shadow-[0_20px_50px_-12px_rgba(0,0,0,0.5)]">
                {/* Text Section (Left) */}
                <div className="w-full md:w-1/2 h-1/2 md:h-full flex flex-col justify-center items-center p-8 md:pr-16 text-center md:text-right bg-gray-200 order-2 md:order-1">
                    <h3 className="text-4xl font-bold text-gray-900 mb-4">Immersive Sound</h3>
                    <p className="text-gray-600 font-medium mb-8">All-day comfort for calls, podcasts, and more.</p>
                    <button className="btn-primary text-black px-8 py-3 rounded-full font-bold flex items-center gap-2  active:bg-white active:text-cyan-500 transition-colors shadow-md flex-row-reverse md:flex-row">
                        Shop Earbuds
                        <div className="bg-white rounded-full p-1 ml-1 w-6 h-6 flex items-center justify-center">
                            <FaArrowRight className="text-xs text-black -rotate-45" />
                        </div>
                    </button>
                </div>

                {/* Image Section (Right) */}
                <div className="w-full md:w-1/2 h-1/2 md:h-full relative order-1 md:order-2">
                    <img
                        src={earbudsImg}
                        alt="Earbuds"
                        className="absolute inset-0 w-full h-full object-cover"
                    />
                    {/* Gradient Overlay */}
                    {/* <div className="absolute inset-0 bg-gradient-to-l from-transparent to-gray-200/50 md:bg-gradient-to-l md:from-transparent md:to-gray-200"></div> */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#02D5E0]/70 to-transparent mix-blend-multiply"></div>
                </div>
            </div>
        </div>
    );
};

export default PowerYourLife;
