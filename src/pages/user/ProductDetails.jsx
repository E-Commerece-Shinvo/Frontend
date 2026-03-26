import React, { useState, useRef } from 'react';
import { FiMinus, FiPlus, FiShoppingCart, FiUser, FiChevronDown } from 'react-icons/fi';
import { useCart } from '../../context/CartContext';
import img from "../../assets/productpage/product_details/1.png"
import img2 from "../../assets/productpage/product_details/2.png"
import img3 from "../../assets/productpage/product_details/3.png"
import img4 from "../../assets/productpage/product_details/4.png"
import img5 from "../../assets/productpage/product_details/5.png"
import featureDark from "../../assets/productpage/product_details/feature_dark.png"
import featureLight from "../../assets/productpage/product_details/feature_light.png"
import { FaShieldAlt, FaShippingFast, FaCheckCircle, FaPlus, FaTimes } from "react-icons/fa";
import Footer from '../../components/layout/Footer/Footer';

const ProductDetails = () => {
    const product = {
        id: 'samsung-45w-adapter',
        title: "Samsung 45W Travel Adapter (Super Fast Charging 2.0)",
        price: "Rs. 6,500",
        rating: 4.8,
        reviews: 120,
        features: [
            "Support fast protocols (PD, QC)",
            "Super Fast Charging 2.0 (45W)",
            "Supports PD (Power Delivery) & QC Protocols",
            "USB-C Interface",
            "Official Samsung Product"
        ],
        colors: ["Black", "White"], // Represented as hex or names
        powerOptions: ["25W", "45W", "65W"],
        images: [
            img, // Main placeholder
            img3,
            img4,
            img5,
            img2,
        ]
    };

    const overviewRef = useRef(null);
    const infoRef = useRef(null);
    const faqRef = useRef(null);
    const reviewsRef = useRef(null);

    const reviewsData = [
        {
            id: 1,
            name: "Person Name",
            avatar: "https://i.pravatar.cc/150?img=11",
            date: "1 month ago",
            title: "Absolutely love this product !",
            text: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.",
            rating: 4.8,
            images: [img4, img2]
        },
        {
            id: 2,
            name: "Person Name",
            avatar: "https://i.pravatar.cc/150?img=5",
            date: "2 month ago",
            title: "Absolutely love this product !",
            text: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.",
            rating: 4.0,
            images: [img5, img3]
        },
        {
            id: 3,
            name: "Person Name",
            avatar: "https://i.pravatar.cc/150?img=8",
            date: "2 month ago",
            title: "Absolutely love this product !",
            text: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.",
            rating: 4.2,
            images: [img]
        },
        {
            id: 4,
            name: "Alice Smith",
            avatar: "https://i.pravatar.cc/150?img=9",
            date: "3 months ago",
            title: "Great quality!",
            text: "The build quality is amazing. It charges my phone super fast. Highly recommended!",
            rating: 5.0,
            images: []
        },
        {
            id: 5,
            name: "John Doe",
            avatar: "https://i.pravatar.cc/150?img=12",
            date: "3 months ago",
            title: "Worth the price",
            text: "A bit expensive but definitely worth it for the speed. Genuine Samsung product.",
            rating: 4.5,
            images: [img2]
        },
        {
            id: 6,
            name: "Emily Davis",
            avatar: "https://i.pravatar.cc/150?img=20",
            date: "4 months ago",
            title: "Good backup charger",
            text: "I keep this one in my office. Works perfectly for my S23 Ultra and laptop.",
            rating: 4.7,
            images: [img3, img5]
        },
        {
            id: 7,
            name: "Michael Brown",
            avatar: "https://i.pravatar.cc/150?img=33",
            date: "5 months ago",
            title: "Fast delivery",
            text: "Received it the next day. Packaging was good and the product is authentic.",
            rating: 5.0,
            images: []
        },
        {
            id: 8,
            name: "Sarah Wilson",
            avatar: "https://i.pravatar.cc/150?img=41",
            date: "6 months ago",
            title: "Compact and powerful",
            text: "Love how small it is for a 45W charger. Great for travel.",
            rating: 4.9,
            images: [img4]
        }
    ];

    const [selectedColor, setSelectedColor] = useState('Black');
    const [selectedPower, setSelectedPower] = useState('25W');
    const [quantity, setQuantity] = useState(1);
    const [activeImage, setActiveImage] = useState(0);
    const [activeAccordion, setActiveAccordion] = useState(null); // 'info' | 'faq' | null
    const [activeTab, setActiveTab] = useState('overview');
    const [visibleReviews, setVisibleReviews] = useState(3);
    const { addToCart } = useCart();

    const handleAddToCart = () => {
        addToCart({
            id: product.id,
            name: product.title,
            price: 6500, // Numeric for calculation
            image: product.images[0],
            variant: `Color: ${selectedColor}, Power: ${selectedPower}`
        });
    };

    const handleShowMoreReviews = () => {
        setVisibleReviews(prev => prev + 3);
    };

    const toggleAccordion = (section) => {
        setActiveAccordion(prev => prev === section ? null : section);
    };

    const scrollToSection = (section) => {
        setActiveTab(section);
        if (section === 'overview' && overviewRef.current) {
            overviewRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else if (section === 'info' && infoRef.current) {
            infoRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
            setActiveAccordion('info');
        } else if (section === 'faq' && faqRef.current) {
            faqRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
            setActiveAccordion('faq');
        } else if (section === 'reviews' && reviewsRef.current) {
            reviewsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    const handleQuantityChange = (type) => {
        if (type === 'dec' && quantity > 1) setQuantity(quantity - 1);
        if (type === 'inc') setQuantity(quantity + 1);
    };

    return (
        <div className="bg-[#f8f9fa] min-h-screen pt-[120px] lg:mt-10 font-sans text-gray-800">
            <div className="max-w-[1920px] mx-auto px-4 lg:px-8">

                {/* Product Detail Top Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 text-black items-stretch mb-20">
                    {/* Left Column: Image Gallery */}
                    <div className="flex flex-col gap-2 lg:gap-6 h-full">
                        {/* Main Image */}
                        <div className="bg-gray-50 rounded-[20px] p-8 flex items-center justify-center relative overflow-hidden group grow min-h-[500px]">
                            <img
                                src={product.images[activeImage]}
                                alt={product.title}
                                className="object-contain max-h-full max-w-full transition-transform duration-300 group-hover:scale-105"
                            />
                            <div className="absolute top-4 left-4 bg-gray-100 text-xs px-2 py-1 rounded">25W PD Adapter</div>
                        </div>

                        {/* Thumbnails */}
                        <div className="flex gap-4 overflow-x-auto pb-2">
                            {product.images.map((img, index) => (
                                <button
                                    key={index}
                                    onClick={() => setActiveImage(index)}
                                    className={`w-[80px] h-[80px] rounded-[15px] border-2 shrink-0 flex items-center justify-center p-2 bg-white transition-all
                                        ${activeImage === index ? 'border-cyan-400' : 'border-gray-200 hover:border-gray-300'}
                                    `}
                                >
                                    <img src={img} alt={`Thumb ${index}`} className="w-full h-full object-contain" />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Right Column: Product Details */}
                    <div className="bg-white flex flex-col gap-6 p-8 rounded-[30px] shadow-md h-full">
                        <div>
                            <p className="text-gray-500 text-sm mb-1">Brand: Samsung (Clickable Link)</p>
                            <div className="flex items-center gap-2 mb-3">
                                <div className="flex text-yellow-400 text-sm">
                                    {'★'.repeat(5)} {/* Simplified star rendering */}
                                </div>
                                <span className="text-sm text-gray-500">({product.rating}) | {product.reviews} Reviews</span>
                            </div>

                            <h1 className="text-3xl font-bold mb-4 leading-tight">{product.title}</h1>
                            <p className="text-3xl font-bold mb-6">{product.price}</p>

                            <ul className="space-y-2 mb-8">
                                {product.features.map((feature, i) => (
                                    <li key={i} className="text-gray-600 text-sm flex items-start gap-2">
                                        <span className="mt-1.5 w-1 h-1 bg-gray-400 rounded-full shrink-0"></span>
                                        {feature}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Color Selector */}
                        <div>
                            <p className="font-bold mb-3 text-sm">Color: <span className="font-normal text-gray-600">{selectedColor}</span></p>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setSelectedColor('Black')}
                                    className={`w-8 h-8 rounded-full bg-black border-2 transition-all ${selectedColor === 'Black' ? 'ring-2 ring-cyan-400 ring-offset-2' : ''}`}
                                ></button>
                                <button
                                    onClick={() => setSelectedColor('White')}
                                    className={`w-8 h-8 rounded-full bg-white border border-gray-300 transition-all ${selectedColor === 'White' ? 'ring-2 ring-cyan-400 ring-offset-2' : ''}`}
                                ></button>
                            </div>
                        </div>

                        {/* Power Output Selector */}
                        <div>
                            <p className="font-bold mb-3 text-sm">Power Output</p>
                            <div className="flex gap-3">
                                {product.powerOptions.map(opt => (
                                    <button
                                        key={opt}
                                        onClick={() => setSelectedPower(opt)}
                                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all
                                            ${selectedPower === opt
                                                ? 'bg-[#008f9d] text-white shadow-lg'
                                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}
                                        `}
                                    >
                                        {opt}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Quantity */}
                        <div className="mt-4">
                            <div className="flex items-center gap-4">
                                <div className="flex items-center bg-gray-100 rounded-lg">
                                    <button
                                        onClick={() => handleQuantityChange('dec')}
                                        className="w-10 h-10 flex items-center justify-center text-gray-500 hover:text-black"
                                    >
                                        <FiMinus size={14} />
                                    </button>
                                    <span className="w-8 text-center font-medium text-sm">{quantity}</span>
                                    <button
                                        onClick={() => handleQuantityChange('inc')}
                                        className="w-10 h-10 flex items-center justify-center text-gray-500 hover:text-black"
                                    >
                                        <FiPlus size={14} />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col gap-3 mt-4">
                            <button
                                onClick={handleAddToCart}
                                className="w-full bg-[#02D5E0] hover:bg-[#02b5be] text-black font-bold py-4 rounded-xl transition-all shadow-lg hover:shadow-cyan-400/30 text-lg"
                            >
                                Add to Cart
                            </button>
                            <button
                                onClick={handleAddToCart}
                                className="w-full bg-black hover:bg-gray-900 text-white font-bold py-4 rounded-xl transition-all shadow-lg text-lg"
                            >
                                Buy it Now
                            </button>
                        </div>

                    </div>
                </div>

                {/* Features Section Container */}
                <div className="flex flex-col gap-6 items-center w-full" ref={overviewRef}>

                    {/* Navigation Tabs */}
                    <div className="bg-gray-100 p-1 flex gap-2 rounded-full inline-flex mb-8 shadow-sm border border-gray-200 group">
                        <button
                            onClick={() => scrollToSection('overview')}
                            className={`px-6 py-2 rounded-full text-sm transition-all hover:bg-white hover:shadow-sm hover:text-black hover:font-bold ${activeTab === 'overview'
                                ? 'bg-white shadow-sm text-black font-bold'
                                : 'text-gray-600 font-medium hover:text-black'
                                }`}
                        >
                            Overview
                        </button>
                        <button
                            onClick={() => scrollToSection('info')}
                            className={`px-6 py-2 rounded-full text-sm transition-all hover:bg-white hover:shadow-sm hover:text-black hover:font-bold ${activeTab === 'info'
                                ? 'bg-white shadow-sm text-black font-bold'
                                : 'text-gray-600 font-medium hover:text-black'
                                }`}
                        >
                            Info
                        </button>
                        <button
                            onClick={() => scrollToSection('faq')}
                            className={`px-6 py-2 rounded-full text-sm transition-all hover:bg-white hover:shadow-sm hover:text-black hover:font-bold ${activeTab === 'faq'
                                ? 'bg-white shadow-sm text-black font-bold'
                                : 'text-gray-600 font-medium hover:text-black'
                                }`}
                        >
                            FAQ
                        </button>
                        <button
                            onClick={() => scrollToSection('reviews')}
                            className={`px-6 py-2 rounded-full text-sm transition-all hover:bg-white hover:shadow-sm hover:text-black hover:font-bold ${activeTab === 'reviews'
                                ? 'bg-white shadow-sm text-black font-bold'
                                : 'text-gray-600 font-medium hover:text-black'
                                }`}
                        >
                            Reviews
                        </button>
                    </div>

                    {/* Dark Section: Experience Super Fast Charging */}
                    <div className="w-full bg-[#1c1c1c] text-white rounded-[40px] p-8 md:p-16 flex flex-col md:flex-row items-center justify-between overflow-hidden shadow-2xl relative mb-12 min-h-[500px]">
                        {/* Image Left */}
                        <div className="w-full md:w-1/2 flex justify-center z-10">
                            <img src={featureDark} alt="Super Charging" className="max-w-[80%] md:max-w-[400px] object-contain drop-shadow-2xl" />
                        </div>

                        {/* Text Right */}
                        <div className="w-full md:w-1/2 mt-8 md:mt-0 text-left z-10 pl-0 md:pl-12">
                            <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">Experience Super <br /> Fast Charging 2.0</h2>
                            <p className="text-gray-400 text-sm md:text-base leading-relaxed max-w-md">
                                Unlock the full potential of your device with the Samsung 45W Travel Adapter.
                                Designed specifically for the Galaxy S-Series, this adapter takes your battery
                                from 0% to 65% in just 30 minutes. It uses advanced GaN (Gallium Nitride)
                                technology to keep the charger compact and cool while delivering maximum power.
                            </p>
                        </div>
                    </div>

                    {/* Light Section: Why Choose This Charger? */}
                    <div className="w-full bg-white border border-gray-200 rounded-[40px] p-8 md:p-16 flex flex-col md:flex-row-reverse items-center justify-between shadow-lg mb-16 min-h-[500px]">
                        {/* Image Right */}
                        <div className="w-full md:w-1/2 flex justify-center items-center">
                            <img src={featureLight} alt="Why Choose" className="max-w-[80%] md:max-w-[450px] object-contain" />
                        </div>

                        {/* Text Left */}
                        <div className="w-full md:w-1/2 mt-8 md:mt-0 text-left">
                            <h2 className="text-3xl md:text-4xl font-bold mb-8 text-black">Why Choose This <br /> Charger?</h2>
                            <div className="space-y-6">
                                <div>
                                    <h4 className="font-bold text-lg mb-1">Super Fast Charging 2.0:</h4>
                                    <p className="text-gray-600 text-sm">Delivers the full 45W required for S24 Ultra and S23 Ultra.</p>
                                </div>
                                <div>
                                    <h4 className="font-bold text-lg mb-1">Universal Support:</h4>
                                    <p className="text-gray-600 text-sm">Supports PD (Power Delivery) & QC protocols, making it safe for other devices.</p>
                                </div>
                                <div>
                                    <h4 className="font-bold text-lg mb-1">100% Official Product:</h4>
                                    <p className="text-gray-600 text-sm">Comes in original Samsung retail packaging.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Info Cards */}
                    <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Card 1 */}
                        <div className="bg-[#1c1c1c] text-white rounded-[20px] p-8 flex flex-col items-center justify-center text-center gap-4 shadow-lg h-[200px]">
                            <FaShieldAlt className="text-4xl text-white/90" />
                            <h3 className="font-medium text-sm w-3/4">7 days Replacement Warranty</h3>
                        </div>

                        {/* Card 2 */}
                        <div className="bg-[#1c1c1c] text-white rounded-[20px] p-8 flex flex-col items-center justify-center text-center gap-4 shadow-lg h-[200px]">
                            <FaShippingFast className="text-4xl text-white/90" />
                            <h3 className="font-medium text-sm w-3/4">Fast, Reliable Shipping</h3>
                        </div>

                        {/* Card 3 */}
                        <div className="bg-[#1c1c1c] text-white rounded-[20px] p-8 flex flex-col items-center justify-center text-center gap-4 shadow-lg h-[200px]">
                            <FaCheckCircle className="text-4xl text-white/90" />
                            <h3 className="font-medium text-sm w-3/4">Genuine Products Guaranteed</h3>
                        </div>
                    </div>

                    {/* Accordions */}
                    <div className="w-full flex flex-col gap-6 mb-12">
                        {/* Info Accordion */}
                        <div
                            ref={infoRef}
                            className={`w-full transition-all duration-300 overflow-hidden shadow-lg ${activeAccordion === 'info' ? 'ring-4 ring-[#02D5E0] bg-[#f8f9fa] rounded-[30px] shadow-lg' : 'bg-gray-200 hover:bg-gray-300 rounded-[20px]'}`}
                        >
                            <button
                                onClick={() => toggleAccordion('info')}
                                className="w-full flex items-center justify-between p-6 px-8 md:px-12 cursor-pointer focus:outline-none"
                            >
                                <span className="text-xl font-bold text-black">Info</span>
                                {activeAccordion === 'info' ? <FaTimes className="text-xl" /> : <FaPlus className="text-xl" />}
                            </button>

                            {activeAccordion === 'info' && (
                                <div className="px-6 md:px-12 pb-12 pt-2 animate-fade-in-down">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                        {/* Specifications */}
                                        <div>
                                            <h3 className="font-bold text-2xl mb-6">Specifications</h3>
                                            <div className="space-y-4 text-sm">
                                                <div className="grid grid-cols-2">
                                                    <span className="font-bold">Brand</span>
                                                    <span className="text-gray-600">Samsung</span>
                                                </div>
                                                <div className="grid grid-cols-2">
                                                    <span className="font-bold">Model</span>
                                                    <span className="text-gray-600">EP-T4510</span>
                                                </div>
                                                <div className="grid grid-cols-2">
                                                    <span className="font-bold">Max Output</span>
                                                    <span className="text-gray-600">45 Watts</span>
                                                </div>
                                                <div className="grid grid-cols-2">
                                                    <span className="font-bold">Interface</span>
                                                    <span className="text-gray-600">USB Type-C</span>
                                                </div>
                                                <div className="grid grid-cols-2">
                                                    <span className="font-bold">Input Voltage</span>
                                                    <span className="text-gray-600">100-240V (Global Support)</span>
                                                </div>
                                                <div className="grid grid-cols-2">
                                                    <span className="font-bold">Charging Standards</span>
                                                    <span className="text-gray-600">PD 3.0 (PPS), Quick Charge 2.0</span>
                                                </div>
                                                <div className="grid grid-cols-2">
                                                    <span className="font-bold">Color</span>
                                                    <span className="text-gray-600">Black / White</span>
                                                </div>
                                                <div className="grid grid-cols-2">
                                                    <span className="font-bold">In the Box</span>
                                                    <span className="text-gray-600">45W Adapter + 5A C-to-C Cable (1m)</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Compatibility */}
                                        <div>
                                            <h3 className="font-bold text-2xl mb-6">Compatibility</h3>
                                            <h4 className="font-bold text-sm mb-2">Supported Device List</h4>
                                            <p className="text-sm text-gray-600 mb-4">This charger is optimized for the following devices:</p>
                                            <ul className="list-disc pl-5 space-y-2 text-sm text-gray-600">
                                                <li><span className="font-bold text-black">Samsung S-Series:</span> Galaxy S24 Ultra, S23 Ultra, S22 Ultra (Supports 45W Max).</li>
                                                <li><span className="font-bold text-black">Samsung Note Series:</span> Note 10+, Note 20 Ultra.</li>
                                                <li><span className="font-bold text-black">Samsung Tablets:</span> Galaxy Tab S9, S8 Series.</li>
                                                <li><span className="font-bold text-black">Apple Devices:</span> iPhone 15 & 16 Series (Charges at approx 20W-27W).</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* FAQ Accordion */}
                        <div
                            ref={faqRef}
                            className={`w-full transition-all duration-300 overflow-hidden shadow-lg ${activeAccordion === 'faq' ? 'ring-4 ring-[#02D5E0] bg-[#f8f9fa] rounded-[30px] shadow-lg' : 'bg-gray-200 hover:bg-gray-300 rounded-[20px]'}`}
                        >
                            <button
                                onClick={() => toggleAccordion('faq')}
                                className="w-full flex items-center justify-between p-6 px-8 md:px-12 cursor-pointer focus:outline-none"
                            >
                                <span className="text-xl font-bold text-black">FAQ</span>
                                {activeAccordion === 'faq' ? <FaTimes className="text-xl" /> : <FaPlus className="text-xl" />}
                            </button>

                            {activeAccordion === 'faq' && (
                                <div className="px-6 md:px-12 pt-2 pb-12 animate-fade-in-down">
                                    <div className="space-y-6">
                                        <div>
                                            <h4 className="font-bold mb-1">Q: Does this come with a cable?</h4>
                                            <p className="text-sm text-gray-600">Yes, the box includes a specialized 5A USB-C to USB-C cable. This is important because standard cables cannot handle 45W speeds.</p>
                                        </div>
                                        <div>
                                            <h4 className="font-bold mb-1">Q: Is this product original?</h4>
                                            <p className="text-sm text-gray-600">Yes, we guarantee 100% authenticity. This product is sourced directly from authorized distributors and comes with a 7-day money-back guarantee if proven otherwise.</p>
                                        </div>
                                        <div>
                                            <h4 className="font-bold mb-1">Q: Can I use this with other phones?</h4>
                                            <p className="text-sm text-gray-600">Yes, because it supports PD (Power Delivery) technology, it can safely charge iPhones, Pixels, and other USB-C devices at their maximum supported speeds.</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Reviews List Section */}
                    <div ref={reviewsRef} className="w-full bg-white rounded-[40px] shadow-lg p-8 md:p-16 mb-20">
                        <div className="mb-12">
                            <h2 className="text-4xl font-bold mb-2">Reviews List</h2>
                            <p className="text-gray-500">Showing <span className="font-bold text-black">{visibleReviews}</span> of {reviewsData.length} results</p>
                        </div>

                        <div className="space-y-12">
                            {reviewsData.slice(0, visibleReviews).map((review) => (
                                <div key={review.id} className="border-b border-gray-100 last:border-0 pb-12 last:pb-0">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200">
                                                <img src={review.avatar} alt={review.name} className="w-full h-full object-cover" />
                                            </div>
                                            <span className="font-bold text-lg">{review.name}</span>
                                        </div>
                                        <span className="text-sm text-gray-500">{review.date}</span>
                                    </div>

                                    <h3 className="font-bold text-lg mb-2">{review.title}</h3>
                                    <p className="text-gray-600 text-sm mb-4 leading-relaxed">{review.text}</p>

                                    <div className="flex items-center gap-1 mb-6">
                                        <div className="flex text-yellow-400 text-sm">
                                            {'★'.repeat(Math.floor(review.rating))}
                                            {/* Logic for half star if needed, currently just full stars */}
                                        </div>
                                        <span className="text-xs font-bold ml-1">{review.rating}</span>
                                    </div>

                                    <div className="flex gap-4">
                                        {review.images.map((imgSrc, idx) => (
                                            <div key={idx} className="w-20 h-24 bg-gray-100 rounded-xl overflow-hidden border border-gray-200">
                                                <img src={imgSrc} alt={`Review `} className="w-full h-full object-cover" />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {visibleReviews < reviewsData.length && (
                            <div className="mt-12">
                                <button
                                    onClick={handleShowMoreReviews}
                                    className="flex items-center gap-2 px-6 py-3 rounded-full border border-gray-300 text-sm font-bold hover:bg-gray-50 transition-all"
                                >
                                    Show more <FiChevronDown />
                                </button>
                            </div>
                        )}
                    </div>

                </div>
            </div>


            <Footer />
        </div >
    );
};

export default ProductDetails;
