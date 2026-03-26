import React from 'react';
import { FaFacebookF, FaInstagram, FaTwitter, FaPaperPlane } from 'react-icons/fa';

const Footer = () => {
    return (
        <footer className="w-full bg-[#1a1a1a] text-white pt-16 pb-0">
            <div className="max-w-[1920px] mx-auto px-6 mb-12">

                {/* Logo */}
                <div className="mb-12">
                    <h1 className="text-5xl font-bold">LOGO</h1>
                </div>

                {/* Grid Layout */}
                <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12 lg:gap-8">

                    {/* Shop Column */}
                    <div className="flex flex-col gap-4">
                        <h3 className="text-xl font-bold border-b-2 border-cyan-400 w-fit pb-1 mb-2">Shop</h3>
                        <ul className="flex flex-col gap-2 text-gray-400">
                            <li><a href="#" className="hover:text-cyan-400 transition-colors">Power</a></li>
                            <li><a href="#" className="hover:text-cyan-400 transition-colors">Audio</a></li>
                            <li><a href="#" className="hover:text-cyan-400 transition-colors">Protection</a></li>
                            <li><a href="#" className="hover:text-cyan-400 transition-colors">Accessories</a></li>
                            <li><a href="#" className="hover:text-cyan-400 transition-colors">Shop by Brand</a></li>
                        </ul>
                    </div>

                    {/* Help Column */}
                    <div className="flex flex-col gap-4">
                        <h3 className="text-xl font-bold border-b-2 border-cyan-400 w-fit pb-1 mb-2">Help</h3>
                        <ul className="flex flex-col gap-2 text-gray-400">
                            <li><a href="#" className="hover:text-cyan-400 transition-colors">Contact Us</a></li>
                            <li><a href="#" className="hover:text-cyan-400 transition-colors">FAQs</a></li>
                            <li><a href="#" className="hover:text-cyan-400 transition-colors">Track Your Order</a></li>
                            <li><a href="#" className="hover:text-cyan-400 transition-colors">Shipping & Returns</a></li>
                            <li><a href="#" className="hover:text-cyan-400 transition-colors">Warranty</a></li>
                        </ul>
                    </div>

                    {/* Company Column */}
                    <div className="flex flex-col gap-4">
                        <h3 className="text-xl font-bold border-b-2 border-cyan-400 w-fit pb-1 mb-2">Company</h3>
                        <ul className="flex flex-col gap-2 text-gray-400">
                            <li><a href="#" className="hover:text-cyan-400 transition-colors">About Us</a></li>
                            <li><a href="#" className="hover:text-cyan-400 transition-colors">Blog</a></li>
                            <li><a href="#" className="hover:text-cyan-400 transition-colors">Privacy Policy</a></li>
                            <li><a href="#" className="hover:text-cyan-400 transition-colors">Terms of Service</a></li>
                        </ul>
                    </div>

                    {/* Newsletter Column */}
                    <div className="flex flex-col gap-6 col-span-2 md:col-span-1 lg:col-span-1">
                        <h3 className="text-2xl font-bold">
                            <span className="border-b-2 border-cyan-400 pb-1">Newsletter</span> SignUp
                        </h3>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            Be the first to know about new arrivals and exclusive deals
                        </p>

                        {/* Input Form */}
                        <div className="flex bg-gray-300 h-12 w-full max-w-xs">
                            <input
                                type="email"
                                placeholder="Email Address"
                                className="bg-transparent px-4 text-gray-800 placeholder-gray-600 outline-none w-full h-full"
                            />
                            <button className="bg-cyan-400 h-full w-14 flex items-center justify-center text-black hover:bg-[#046E73] transition-colors group">
                                <FaPaperPlane className="transform -rotate-12 group-hover:text-white" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Social Icons */}
                <div className="flex gap-6 mt-16 mb-8 items-center">
                    <h3 className="text-xl font-bold mr-4">Follow Us</h3>
                    <a href="#" className="bg-white text-black w-10 h-10 rounded-full flex items-center justify-center hover:bg-cyan-400 transition-colors">
                        <FaFacebookF />
                    </a>
                    <a href="#" className="bg-white text-black w-10 h-10 rounded-full flex items-center justify-center hover:bg-cyan-400 transition-colors">
                        <FaInstagram />
                    </a>
                    <a href="#" className="bg-white text-black w-10 h-10 rounded-full flex items-center justify-center hover:bg-cyan-400 transition-colors">
                        <FaTwitter />
                    </a>
                </div>

            </div>

            {/* Copyright Bar */}
            <div className="bg-gray-700 w-full py-6">
                <div className="max-w-[1920px] mx-auto px-6 flex flex-col md:flex-row justify-between items-center text-gray-300 text-sm">
                    <p>&copy; 2025 [Your Store Name]. All Rights Reserved.</p>
                    <div className="flex gap-8 mt-4 md:mt-0">
                        <a href="#" className="hover:text-white transition-colors">Home</a>
                        <a href="#" className="hover:text-white transition-colors">About Us</a>
                        <a href="#" className="hover:text-white transition-colors">Categories</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
