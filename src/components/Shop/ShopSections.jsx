import React, { useState, useEffect } from 'react';
import ShopProductCard from './ShopProductCard';
import { getProducts } from '../../api/products';

const ShopSections = ({ sections = null, loading: externalLoading = false }) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Only fetch if sections are not passed externally
        if (!sections) {
            const fetchAllProducts = async () => {
                try {
                    const data = await getProducts();
                    const productList = Array.isArray(data) ? data : (data.products || []);
                    setProducts(productList);
                } catch (error) {
                    console.error("Failed to fetch products:", error);
                } finally {
                    setLoading(false);
                }
            };
            fetchAllProducts();
        } else {
            setLoading(externalLoading);
        }
    }, [sections, externalLoading]);

    if (loading) {
        return (
            <div className="w-full flex justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
            </div>
        );
    }

    // Determine what to map: either external sections or dynamic categorization of internal products
    let itemsToRender = [];
    if (sections) {
        itemsToRender = sections;
    } else {
        const getCategoryName = (cat) => {
            if (!cat) return 'Accessories';
            if (typeof cat === 'string') return cat;
            return cat.name || 'Accessories';
        };
        const uniqueCatNames = [...new Set(products.map(p => getCategoryName(p.category)))];
        itemsToRender = uniqueCatNames.map(name => ({
            name,
            products: products.filter(p => getCategoryName(p.category) === name)
        }));
    }

    if (itemsToRender.length === 0) {
        return <div className="text-center py-20 text-xl font-bold text-gray-400 italic">No Collections Found</div>;
    }

    return (
        <div className="w-full max-w-[1820px] mx-auto px-6 pb-20">
            {itemsToRender.map((section, idx) => (
                <div key={idx} id={section._id} className="mb-24 scroll-mt-[120px]">
                    <h2 className="text-center text-3xl md:text-4xl font-extrabold mb-10 capitalize text-black tracking-tight uppercase">
                        {section.name}
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-10 max-w-[1700px] mx-auto">
                        {(section.products || []).map((product) => (
                            <ShopProductCard
                                key={product._id}
                                product={product}
                            />
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ShopSections;
