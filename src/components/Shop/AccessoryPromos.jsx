import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getCategories } from '../../api/categories';
import screenProtectorFallback from '../../assets/productpage/bottom/scree_protector.png';
import lensProtectorFallback from '../../assets/productpage/bottom/lens.png';
import mobileHolderFallback from '../../assets/productpage/bottom/mobile_holder.png';

const fallbackPromos = [
    { title: "Screen Protector", image: screenProtectorFallback },
    { title: "Lens Protector", image: lensProtectorFallback },
    { title: "Mobile Holder", image: mobileHolderFallback }
];

const AccessoryPromos = ({ excludeId = null }) => {
    const [promos, setPromos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAndRandomize = async () => {
            try {
                const data = await getCategories();
                
                // Helper to flatten the category tree
                const flatten = (items) => {
                    return items.reduce((acc, item) => {
                        acc.push(item);
                        if (item.children && item.children.length > 0) {
                            acc.push(...flatten(item.children));
                        }
                        return acc;
                    }, []);
                };

                const allCategories = flatten(data);
                
                // Filter out current category and those without images if possible
                // but keep enough to show 3.
                const pool = allCategories.filter(cat => cat._id !== excludeId);
                
                // Shuffle logic
                const shuffled = pool.sort(() => 0.5 - Math.random());
                
                // Take top 3 and map to expected promo format
                const selected = shuffled.slice(0, 3).map((cat, idx) => ({
                    _id: cat._id,
                    title: cat.name,
                    image: cat.image || fallbackPromos[idx % 3].image,
                    link: `/category/${cat._id}`
                }));

                setPromos(selected);
            } catch (error) {
                console.error("Failed to fetch random promos:", error);
                // Fallback to defaults on error
                setPromos(fallbackPromos.map(p => ({ ...p, link: '/categories' })));
            } finally {
                setLoading(false);
            }
        };

        fetchAndRandomize();
    }, [excludeId]);

    if (loading) return null; // Or skeleton

    return (
        <div className="w-full max-w-[1820px] mx-auto px-6 py-10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
                {promos.map((promo, index) => (
                    <Link
                        key={promo._id || index}
                        to={promo.link}
                        className="group relative h-[250px] md:h-[320px] rounded-[30px] overflow-hidden cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-500 block"
                    >
                        {/* Background Image */}
                        <div className="absolute inset-0">
                            <img
                                src={promo.image}
                                alt={promo.title}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                            {/* Dark Overlay/Gradient */}
                            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors duration-500"></div>
                            {/* Radial gradient for more depth */}
                            <div className="absolute inset-0 bg-radial-from-b from-black/80 to-transparent opacity-80"></div>
                        </div>

                        {/* Content */}
                        <div className="absolute inset-0 flex items-center justify-center z-10 p-6">
                            <h3 className="text-white text-2xl md:text-3xl font-black tracking-wide drop-shadow-md text-center uppercase">
                                {promo.title}
                            </h3>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default AccessoryPromos;
