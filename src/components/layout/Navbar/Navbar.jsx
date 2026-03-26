import React, { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useCart } from '../../../context/CartContext';
import { FiSearch, FiUser, FiShoppingCart, FiMenu, FiX, FiChevronDown, FiChevronUp } from "react-icons/fi";
import { Link } from 'react-router-dom';
import UpperNavbar from './UpperNavbar';
import CategoryDropdown from './CategoryDropdown';
import { categoryData } from './categoryData';

function Navbar() {
  const { isLoggedIn } = useAuth();
  const { cartCount, setIsCartOpen } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [mobileCategoryOpen, setMobileCategoryOpen] = useState(false);

  // Toggle Dropdown
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <div className="top-0 left-0 z-50 fixed w-full px-4">
      <UpperNavbar />

      {/* Main Container */}
      <div className="max-w-[1820px] mx-auto mt-2 relative rounded-[30px] gradient-border-nav">

        {/* Inner Nav Content (Glassmorphism) */}
        <nav className="w-full bg-white/10 backdrop-blur-md rounded-[30px] px-6 py-3 flex flex-col md:flex-row justify-between items-center shadow-lg nav-content relative z-50">

          <div className="w-full md:w-auto flex justify-between items-center">
            <button
              className="md:hidden text-white text-2xl focus:outline-none"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <FiX /> : <FiMenu />}
            </button>
            {/* LEFT: Logo */}
            <div className="flex-shrink-0">
              <Link to="/" className="text-2xl font-bold text-white tracking-wider hover:text-[#53C1CC] transition-colors">
                LOGO
              </Link>
            </div>

            {/* Mobile Icons */}
            <button onClick={() => setIsCartOpen(true)} className="md:hidden">
              <FiShoppingCart className="text-2xl" color='white' />
            </button>
          </div>

          {/* CENTER: Navigation (Desktop) */}
          <div className="hidden md:flex items-center gap-8 text-[18px] font-[400] relative">
            <Link to="/" className="text-white/90 hover:text-[#53C1CC] transition-colors">Home</Link>
            <Link to="/about" className="text-white/90 hover:text-[#53C1CC] transition-colors">About Us</Link>

            {/* Categories Dropdown Trigger */}
            <button
              onClick={toggleDropdown}
              className={`text-white/90 hover:text-[#53C1CC] transition-colors flex items-center gap-1 focus:outline-none ${isDropdownOpen ? 'text-[#53C1CC]' : ''} `}
            >
              Categories <FiChevronDown className={`transition - transform duration - 300 ${isDropdownOpen ? 'rotate-180' : ''} `} />
            </button>
          </div>

          {/* RIGHT: Search + Icons (Desktop) */}
          <div className="hidden md:flex items-center gap-4">
            <div className="hidden lg:flex items-center bg-white/20 rounded-full px-4 py-1.5 w-[300px] xl:w-[555px] h-[55px] border border-white/10 focus-within:bg-white/30 focus-within:border-[#53C1CC] transition-all">
              <input type="text" placeholder="Search" className="bg-transparent border-none outline-none text-sm text-white placeholder-gray-300 w-full" />
              <FiSearch className="text-white/70 w-[24px] h-[24px] text-lg cursor-pointer hover:text-white" />
            </div>

            <div className="flex items-center gap-3 border-l border-white/20 pl-4">
              {isLoggedIn ? (
                <>
                  <button className="text-white hover:text-[#53C1CC] transition-transform hover:scale-110">
                    <FiUser className="text-xl w-[32px] h-[32px]" />
                  </button>
                  <button
                    onClick={() => setIsCartOpen(true)}
                    className="relative text-white hover:text-[#53C1CC] transition-transform hover:scale-110"
                  >
                    <FiShoppingCart className="text-xl w-[32px] h-[32px]" />
                    {cartCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-[#53C1CC] text-white text-[9px] font-bold w-3 h-3 flex items-center justify-center rounded-full">
                        {cartCount}
                      </span>
                    )}
                  </button>
                </>
              ) : (
                <div className="flex items-center gap-4">
                  <Link to="/login" className="text-white hover:text-[#53C1CC] font-medium transition-colors">
                    Login
                  </Link>
                  <Link to="/register" className="bg-[#53C1CC] hover:bg-[#43aab5] text-white px-5 py-2 rounded-full font-medium transition-colors">
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>

        </nav>

        {/* Desktop Dropdown Component */}
        <div className="hidden md:block">
          <CategoryDropdown
            data={categoryData}
            isOpen={isDropdownOpen}
            onClose={() => setIsDropdownOpen(false)}
          />
        </div>

        {/* Mobile Menu (Dropdown) */}
        {isOpen && (
          <div className="md:hidden absolute top-full left-0 w-full mt-2 bg-black/90 backdrop-blur-xl rounded-[20px] p-6 flex flex-col gap-6 border border-white/10 shadow-2xl z-40 animate-fade-in max-h-[80vh] overflow-y-auto">

            {/* Mobile Links */}
            <div className="flex flex-col gap-4 text-center text-lg text-white">
              <Link to="/" className="hover:text-[#53C1CC] transition-colors border-b border-white/10 pb-2" onClick={() => setIsOpen(false)}>Home</Link>
              <Link to="/about" className="hover:text-[#53C1CC] transition-colors border-b border-white/10 pb-2" onClick={() => setIsOpen(false)}>About Us</Link>

              {/* Mobile Categories Accordion */}
              <div>
                <button
                  onClick={() => setMobileCategoryOpen(!mobileCategoryOpen)}
                  className="w-full flex items-center justify-center gap-2 hover:text-[#53C1CC] transition-colors pb-2"
                >
                  Categories <FiChevronDown className={`transition-transform duration-300 ${mobileCategoryOpen ? 'rotate-180' : ''}`} />
                </button>

                {mobileCategoryOpen && (
                  <div className="bg-white/5 rounded-xl p-4 mt-2 flex flex-col gap-4 text-left text-base">
                    {Object.entries(categoryData).map(([category, items]) => (
                      <div key={category}>
                        <h4 className="text-[#53C1CC] font-bold mb-2 uppercase text-sm">{category}</h4>
                        <div className="flex flex-col gap-2 pl-2 border-l border-white/10">
                          {items.map(item => (
                            <Link
                              key={item}
                              to="/shop"
                              className="text-gray-300 text-sm hover:text-white"
                              onClick={() => setIsOpen(false)}
                            >
                              {item}
                            </Link>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Mobile Search */}
            <div className="flex items-center bg-white/20 rounded-full px-4 py-3 w-full border border-white/10">
              <input type="text" placeholder="Search" className="bg-transparent border-none outline-none text-sm text-white placeholder-gray-300 w-full" />
              <FiSearch className="text-white/70 text-lg" />
            </div>

            {/* Mobile Icons */}
            {/* Mobile Auth / Icons */}
            <div className="flex justify-center gap-8 border-t border-white/10 pt-6">
              {isLoggedIn ? (
                <>
                  <button className="text-white hover:text-[#53C1CC] transition-transform hover:scale-110">
                    <FiUser className="text-2xl" />
                  </button>
                  <button
                    onClick={() => setIsCartOpen(true)}
                    className="relative text-white hover:text-[#53C1CC] transition-transform hover:scale-110"
                  >
                    <span className="absolute -top-1 -right-2 bg-[#53C1CC] text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                      {cartCount}
                    </span>
                    <FiShoppingCart className="text-2xl" />
                  </button>
                </>
              ) : (
                <div className="flex flex-col w-full gap-3 px-4">
                  <Link
                    to="/login"
                    className="w-full text-center text-white border border-white/20 py-2 rounded-full hover:border-[#53C1CC] hover:text-[#53C1CC] transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="w-full text-center bg-[#53C1CC] text-white py-2 rounded-full hover:bg-[#43aab5] transition-colors font-medium"
                    onClick={() => setIsOpen(false)}
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>

          </div>
        )}

      </div>
    </div>
  )
}

export default Navbar