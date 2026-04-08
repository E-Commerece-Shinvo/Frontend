import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getCategories } from '../../../api/categories';

const Categories = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const data = await getCategories();
                
                // Extract all subcategories (level 1) from the niches
                let subcategories = [];
                data.forEach(niche => {
                    if (niche.children && niche.children.length > 0) {
                        subcategories = [...subcategories, ...niche.children];
                    }
                });

                // Sort subcategories by createdAt descending and take only latest 4
                const latestFour = subcategories
                    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                    .slice(0, 4);
                
                setCategories(latestFour);
            } catch (error) {
                console.error("Failed to fetch categories:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchCategories();
    }, []);

    if (loading) return null;

    return (
        <div className="w-full bg-white py-10">
            <div className="max-w-[1920px] mx-auto px-6 flex flex-col items-center gap-10">

                <div className="text-center">
                    <h2 className="text-3xl sm:text-4xl md:text-5xl xl:text-6xl font-bold text-gray-900 leading-tight mb-0 sm:mb-10">
                        Find Accessories<br />For Your Device
                    </h2>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 w-full">
                    {categories.map((cat) => (
                        <div key={cat._id} className="relative h-full w-full sm:h-[80%] sm:w-[98%] aspect-square rounded-[30px] sm:rounded-[60px] md:rounded-[90px] lg:rounded-[60px] 2xl:rounded-[100px] overflow-hidden group cursor-pointer shadow-lg hover:shadow-xl transition-shadow duration-300 shadow-black">
                            <Link to={`/category/${cat._id}`}>
                                <div
                                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                                    style={{ backgroundImage: `url(${cat.image})` }}
                                ></div>

                                <div className="absolute inset-x-0 bottom-0 h-full bg-linear-to-t from-black to-transparent"></div>

                                <div className="absolute bottom-6 left-0 w-full text-center z-10">
                                    <h3 className="text-white text-[16px] sm:text-xl md:text-2xl font-bold tracking-wide">{cat.name}</h3>
                                </div>
                            </Link>
                        </div>
                    ))}
                </div>

                <Link
                    to="/shop"
                    className="flex btn-primary items-center gap-3 text-black px-3 py-2 sm:px-8 sm:py-3 lg:px-6 lg:py-5 lg:text-lg rounded-full font-bold transition-colors shadow-lg hover:shadow-cyan-400/50"
                >
                    View All Products
                </Link>

            </div>
        </div>
    );
};

export default Categories;
