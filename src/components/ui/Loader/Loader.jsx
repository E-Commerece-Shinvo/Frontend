import React from 'react';

const Loader = () => {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white ">
            <div className="relative flex flex-col items-center justify-center gap-8">

                {/* Modern Spinner Container */}
                <div className="relative flex items-center justify-center w-24 h-24">
                    {/* Outer Ring */}
                    <div className="absolute inset-0 w-full h-full rounded-full border-4 border-gray-100"></div>

                    {/* Animated Arc */}
                    <div className="absolute inset-0 w-full h-full rounded-full border-4 border-transparent border-t-cta-cyan animate-spin"></div>

                    {/* Inner Pulsing Dot */}
                    <div className="w-3 h-3 rounded-full bg-cta-cyan animate-pulse shadow-[0_0_15px_rgba(2,213,224,0.6)]"></div>
                </div>

                {/* Typography & Branding */}
                <div className="flex flex-col items-center gap-3">
                    <span className="text-3xl font-display font-bold tracking-[0.2em] text-charcoal">
                        SHINVO
                    </span>

                    {/* Subtle Loading Text */}
                    <span className="text-xs font-medium tracking-[0.3em] text-medium-gray animate-pulse">
                        LOADING
                    </span>
                </div>
            </div>
        </div>
    );
};

export default Loader;
