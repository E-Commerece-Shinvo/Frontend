import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaChevronLeft, FaChevronRight, FaLock, FaShoppingBag } from 'react-icons/fa';
import { getBestsellers } from '../../../api/products';
// We still need a fallback for thumbnails since the DB might not have the array yet based on the schema
import placeholderImg from '../../../assets/bestsellers/charger.png';

const Bestsellers = () => {
    const [activeIndex, setActiveIndex] = useState(1);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBestsellers = async () => {
            try {
                const data = await getBestsellers();
                // Map API response to match UI expectations
                const mappedProducts = data.map(item => ({
                    id: item._id,
                    name: item.brand || item.title.split(' ')[0],
                    description: item.title,
                    image: item.image || placeholderImg,
                    thumbnails: [item.image || placeholderImg, item.image || placeholderImg],
                }));
                setProducts(mappedProducts);
            } catch (error) {
                console.error("Failed to fetch bestsellers:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchBestsellers();
    }, []);

    const nextSlide = () => {
        if (products.length === 0) return;
        setActiveIndex((prev) => (prev === products.length - 1 ? 0 : prev + 1));
    };

    const prevSlide = () => {
        if (products.length === 0) return;
        setActiveIndex((prev) => (prev === 0 ? products.length - 1 : prev - 1));
    };

    // Helper to determine position relative to active index
    const getPosition = (index) => {
        if (index === activeIndex) return 'center';
        if (index === (activeIndex - 1 + products.length) % products.length) return 'left';
        if (index === (activeIndex + 1) % products.length) return 'right';
        return 'hidden';
    };

    return (
        <div className="w-full max-w-[1920px] mx-auto pb-10 flex flex-col items-center bg-white overflow-hidden">
            <h2 className="text-4xl font-bold text-gray-900 mb-12">Our Bestsellers</h2>

            <div className="relative w-full max-w-[1920px] h-[500px] min-[1300px]:h-[700px] flex items-center justify-center">

                {products.map((product, index) => {
                    const position = getPosition(index);
                    const isCenter = position === 'center';
                    const isLeft = position === 'left';
                    const isRight = position === 'right';

                    // Base classes for transition
                    let className = "absolute transition-all duration-500 ease-in-out flex flex-col items-center rounded-3xl p-6 shadow-xl ";

                    if (isCenter) {
                        className += "z-20 w-[300px] min-[370px]:w-[320px] min-[430px]:w-[400px] min-[1300px]:w-[600px] h-[500px] min-[1300px]:h-[700px] bg-gradient-to-b from-cyan-100 to-cyan-400 scale-100 opacity-100";
                    } else if (isLeft) {
                        className += "z-10 w-[300px] min-[370px]:w-[350px] h-[400px] min-[1300px]:h-[550px] bg-cyan-50 min-[1300px]:w-[600px] -translate-x-[250px] sm:-translate-x-[350px] min-[1300px]:-translate-x-[500px] scale-90 opacity-80 blur-[1px]";
                    } else if (isRight) {
                        className += "z-10 w-[300px] min-[370px]:w-[350px] h-[400px] min-[1300px]:h-[550px] bg-cyan-50 min-[1300px]:w-[600px] translate-x-[250px] sm:translate-x-[350px] min-[1300px]:translate-x-[500px] scale-90 opacity-80 blur-[1px]";
                    } else {
                        className += "hidden";
                    }

                    return (
                        <div key={product.id} className={className}>
                            {/* Card Content */}
                            <div className="text-center mb-4">
                                <h3 className="text-2xl font-bold text-gray-800">{product.name}</h3>
                                <p className="text-gray-600 font-medium">{product.description}</p>
                            </div>

                            {/* Main Image */}
                            <div className="relative flex-grow flex items-center justify-center w-full">
                                {/* Decorative Circle for center card */}
                                {isCenter && <div className="absolute w-48 h-48 bg-white/30 rounded-full blur-xl"></div>}
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className={`relative object-contain transition-all duration-500 ${isCenter ? 'h-64 min-[1300px]:h-96 drop-shadow-2xl' : 'h-40 min-[1300px]:h-60 grayscale-[0.3]'}`}
                                />
                            </div>

                            {/* Thumbnails (Only Show on Center) */}
                            <div className={`flex gap-3 mt-4 h-16 transition-opacity duration-300 ${isCenter ? 'opacity-100' : 'opacity-0'}`}>
                                {product.thumbnails.map((thumb, i) => (
                                    <div key={i} className="w-14 h-14 bg-white rounded-xl p-1 shadow-sm border border-gray-100">
                                        <img src={thumb} className="w-full h-full object-contain" alt="thumb" />
                                    </div>
                                ))}
                            </div>

                            {/* Side Actions (Only visible on side cards - mocked based on design) */}
                            {!isCenter && (
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 flex flex-col gap-3">
                                    <div className="w-8 h-8 rounded-full bg-black"></div>
                                    <div className="w-8 h-8 rounded-full bg-white border flex items-center justify-center">
                                        <FaLock className="text-gray-400 text-xs" />
                                    </div>
                                </div>
                            )}

                            {/* View Details Button (Only on Center) */}
                            {isCenter && (
                                <div className=" w-full flex justify-between px-4 items-center gap-4 z-40">
                                    {/* Prev Button */}
                                    <button
                                        onClick={(e) => { e.stopPropagation(); prevSlide(); }}
                                        className="bg-white p-4 absolute bottom-[45%] left-[-20px] rounded-full shadow-lg text-cyan-500 hover:bg-[#046E73] hover:text-white transition-all transform hover:scale-110"
                                    >
                                        <FaChevronLeft size={20} />
                                    </button>

                                    <Link to={`/product/${product.id}`} className="bg-black hover:bg-white relative bottom-[-40px] left-1/2 -translate-x-1/2 text-white hover:text-cyan-500 px-6 py-3 rounded-full font-medium shadow-lg hover:scale-105 transition-transform flex items-center gap-2 text-sm sm:text-base whitespace-nowrap">
                                        View details
                                    </Link>

                                    {/* Next Button */}
                                    <button
                                        onClick={(e) => { e.stopPropagation(); nextSlide(); }}
                                        className="bg-white p-4 absolute bottom-[45%] right-[-20px] rounded-full shadow-lg text-cyan-500 hover:bg-[#046E73] hover:text-white transition-all transform hover:scale-110"
                                    >
                                        <FaChevronRight size={20} />
                                    </button>
                                </div>
                            )}
                        </div>
                    );
                })}

            </div>

        </div>
    );
};

export default Bestsellers;
