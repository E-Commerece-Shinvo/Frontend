
const ShopBanner = ({ imgageShop, title }) => {
    return (
        <div className="w-full mx-auto px-4 py-2 flex justify-center">
            <div
                className="relative w-full max-w-[1920px] h-[200px] lg:h-[300px] xl:h-[400px] rounded-[30px] overflow-hidden shadow-lg group"
            >
                {/* Background Image */}
                <img
                    src={imgageShop}
                    alt="Shop Pixel Cases"
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-black/40 transition-opacity group-hover:bg-black/30"></div>

                {/* Content */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                    <h2 className="text-2xl lg:text-5xl font-semibold lg:font-bold text-white mb-2 drop-shadow-md">
                        {title}
                    </h2>
                    {/* Optional google logo or subtitle if needed, keeping it simple for now as per design */}
                    {/* <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mt-4 backdrop-blur-sm">
                        <span className="text-white text-2xl font-bold">G</span>
                    </div> */}
                </div>
            </div>
        </div>
    );
};

export default ShopBanner;
