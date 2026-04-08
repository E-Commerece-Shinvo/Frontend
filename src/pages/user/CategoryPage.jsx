import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar/Navbar';
import Footer from '../../components/layout/Footer/Footer';
import ShopHero from '../../components/shop/ShopHero';
import ChooseDevice from '../../components/shop/ChooseDevice';
import ShopSections from '../../components/shop/ShopSections';
import AccessoryPromos from '../../components/shop/AccessoryPromos';
import { getCategoryById } from '../../api/categories';
import { getProducts } from '../../api/products';

const CategoryPage = () => {
    const { id } = useParams();
    const [category, setCategory] = useState(null);
    const [subCategories, setSubCategories] = useState([]);
    const [sections, setSections] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCategoryContent = async () => {
            setLoading(true);
            try {
                // 1. Fetch category and its children
                const catData = await getCategoryById(id);
                setCategory(catData);
                const children = catData.children || [];
                setSubCategories(children);

                // 2. Fetch products for each sub-category to build the sections
                if (children.length > 0) {
                    const sectionData = await Promise.all(children.map(async (sub) => {
                        const productResult = await getProducts({ category: sub._id, limit: 12 });
                        return {
                            name: sub.name,
                            products: productResult.products || [],
                            _id: sub._id
                        };
                    }));
                    setSections(sectionData);
                } else {
                    // Leaf category - just one section with its own products
                    const productResult = await getProducts({ category: id });
                    setSections([{
                        name: `${catData.name} Collection`,
                        products: productResult.products || [],
                        _id: id
                    }]);
                }

                window.scrollTo(0, 0);
            } catch (error) {
                console.error("Error loading category page:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCategoryContent();
    }, [id]);

    // Handle Loading State
    if (loading && !category) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
            </div>
        );
    }

    return (
        <div className="w-full overflow-x-hidden">
            <Navbar />
            <div className="mt-[100px]">
                {/* Hero Section using Category Data */}
                <ShopHero 
                    title={category?.name ? `PREMIUM \n ${category.name}` : "Loading..."}
                    description={`Protect Your Style. \n Explore Our New ${category?.name || 'Category'} Collection.`}
                    bgImage={category?.image}
                />

                {/* Sub-category Navigator */}
                {subCategories.length > 0 && (
                    <ChooseDevice items={subCategories} />
                )}

                {/* Product Sections */}
                <ShopSections 
                    sections={sections}
                    loading={loading}
                />

                {/* Bottom Accessories Tiles */}
                <AccessoryPromos excludeId={id} />
            </div>
            <Footer />
        </div>
    );
};

export default CategoryPage;
