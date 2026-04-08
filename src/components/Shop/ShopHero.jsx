import React from 'react';
import productHeroBg from '../../assets/product_hero_bg.jpg';

const ShopHero = ({ 
    title = "Premium \n Mobile Cases", 
    description = "Protect Your Style. \n Explore Our New Collection.", 
    bgImage = productHeroBg 
}) => {
    return (
        <div className="w-full overflow-hidden flex items-center px-4 py-5 lg:py-10">
            {/* Main Hero Container */}
            <div className='relative w-full max-w-[1820px] h-[450px] md:h-[600px] mx-auto flex items-center justify-center rounded-[30px] md:rounded-[50px] overflow-hidden shadow-2xl group'>
                {/* Background Image Layer with Cinematic Tint */}
                <div className="absolute inset-0 z-0">
                    <img
                        src={bgImage}
                        alt={title}
                        className="w-full h-full object-cover object-center transition-transform duration-2000 group-hover:scale-105"
                    />
                    {/* READABILITY SHIELD: Uniform Dark Tint ensures white text pops on any image */}
                    <div className="absolute inset-0 bg-black/45 backdrop-blur-[1px]"></div>
                </div>

                {/* CENTERED CONTENT - High Visibility Typography */}
                <div className="relative z-10 w-full max-w-5xl px-6 flex flex-col items-center justify-center text-center">
                    <h1 className="text-3xl sm:text-5xl md:text-6xl xl:text-[85px] font-black mb-6 leading-none tracking-tighter uppercase text-white whitespace-pre-line drop-shadow-[0_5px_15px_rgba(0,0,0,0.8)]">
                        {title}
                    </h1>
                    
                    <div className="w-20 h-1.5 bg-cyan-400 mb-8 rounded-full shadow-[0_0_15px_rgba(34,211,238,0.8)]"></div>

                    <p className="text-gray-100 text-sm md:text-xl xl:text-3xl font-bold mb-10 leading-relaxed whitespace-pre-line opacity-100 max-w-3xl drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
                        {description}
                    </p>

                    <button className="group relative inline-flex items-center gap-4 px-12 py-4 bg-cyan-400 hover:bg-cyan-500 text-black font-black text-xs md:text-lg shadow-[0_0_30px_rgba(34,211,238,0.4)] transition-all duration-300 tracking-[0.2em] rounded-none md:rounded-xl overflow-hidden uppercase">
                        <span className="relative z-10">SHOP NOW</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ShopHero;
