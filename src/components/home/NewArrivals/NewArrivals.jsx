import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getNewArrivals } from '../../../api/products';
import smartwatchImg from '../../../assets/smartwatch.png'; // Fallback

const NewArrivals = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchArrivals = async () => {
            try {
                const data = await getNewArrivals();
                const mappedProducts = data.map(item => ({
                    id: item._id,
                    name: item.title,
                    brand: item.brand || 'Shinvo',
                    price: `$${item.price.toFixed(2)}`,
                    image: item.image || smartwatchImg,
                    isNew: true,
                }));
                setProducts(mappedProducts);
            } catch (error) {
                console.error("Failed to fetch new arrivals:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchArrivals();
    }, []);

    return (
        <div className="w-full py-10 flex flex-col items-center gap-12 bg-white">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900">New Arrivals</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 px-4 max-w-[1920px] mx-auto">
                {products.length === 0 && !loading && <p className="col-span-1 sm:col-span-2 lg:col-span-4 text-center">No new arrivals found.</p>}
                {products.length === 0 && loading && <p className="col-span-1 sm:col-span-2 lg:col-span-4 text-center">Loading...</p>}
                {products.map((product) => (
                    <Link
                        to={`/product/${product.id}`}
                        key={product.id}
                        className="group relative bg-gray-50 rounded-3xl p-3 shadow-sm hover:shadow-xl transition-shadow duration-300 flex flex-col border border-gray-100"
                    >
                        {/* New Badge */}
                        {product.isNew && (
                            <span className="absolute top-6 right-6 bg-cyan-400 text-white text-xs font-bold px-3 py-1 rounded-full z-10 box-decoration-clone">
                                NEW
                            </span>
                        )}

                        {/* Image Container */}
                        <div className="w-full aspect-square flex items-center justify-center mb-6 bg-[#C6C7C8] rounded-2xl overflow-hidden relative">
                            <img
                                src={product.image}
                                alt={product.name}
                                className="w-[80%] h-[80%] object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-300"
                            />
                        </div>

                        {/* Content */}
                        <div className="flex flex-col gap-2">
                            <span className="text-gray-400 text-xs font-medium uppercase tracking-wider">{product.brand}</span>
                            <h3 className="text-lg font-bold text-gray-900 leading-tight group-hover:text-cyan-600 transition-colors">
                                {product.name}
                            </h3>
                            <span className="text-black font-bold text-lg">{product.price}</span>
                        </div>
                    </Link>
                ))}
            </div>

            <button className="btn-primary text-black px-10 py-3 rounded-full font-bold hover:scale-105 transition-transform shadow-md">
                View All
            </button>
        </div>
    );
};

export default NewArrivals;
