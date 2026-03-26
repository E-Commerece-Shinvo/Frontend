import React from 'react';
import Navbar from '../../components/layout/Navbar/Navbar';
import Footer from '../../components/layout/Footer/Footer';
import ShopHero from '../../components/shop/ShopHero';
import ChooseDevice from '../../components/shop/ChooseDevice';
import ShopSections from '../../components/shop/ShopSections';
import AccessoryPromos from '../../components/shop/AccessoryPromos';
import Categories from '../../components/home/Categories/Categories';
import Bestsellers from '../../components/home/Bestsellers/Bestsellers';

const ProductPage = () => {
    return (
        <div className="w-full overflow-x-hidden">
            <Navbar />
            <div className="mt-[100px]"> {/* Add margin to account for fixed navbar */}
                <ShopHero />
                <ChooseDevice />
                <ShopSections />
                <AccessoryPromos />
                {/* <div className="py-10">
                    <Categories />
                </div> */}
                {/* <Bestsellers /> */}
            </div>
            <Footer />
        </div>
    );
};

export default ProductPage;
