import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useCart } from '../../../context/CartContext';
import { FiSearch, FiUser, FiShoppingCart, FiMenu, FiX, FiChevronDown, FiChevronUp } from "react-icons/fi";
import { Link } from 'react-router-dom';
import UpperNavbar from './UpperNavbar';
import CategoryDropdown from './CategoryDropdown';
import { getCategories } from '../../../api/categories';

function Navbar() {
  const { isLoggedIn, user, logout } = useAuth();
  const { cartCount, setIsCartOpen } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [mobileCategoryOpen, setMobileCategoryOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const profileDropdownRef = useRef(null);

  // Close profile dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(e.target)) {
        setProfileDropdownOpen(false);
      }
    };
    if (profileDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [profileDropdownOpen]);

  // Fetch categories from Backend
  React.useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        setCategories(data);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };
    fetchCategories();
  }, []);

  // Toggle Dropdown
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <div className="top-0 left-0 z-50 absolute w-full px-4">
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
            <div className="flex items-center gap-3 md:hidden">
              {isLoggedIn && (
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="text-white hover:text-[#53C1CC] transition-colors"
                >
                  <FiUser className="text-2xl" />
                </button>
              )}
              <button onClick={() => setIsCartOpen(true)}>
                <FiShoppingCart className="text-2xl" color='white' />
              </button>
            </div>
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

            <div className="flex items-center gap-3 border-l border-white/20 pl-4 relative" ref={profileDropdownRef}>
              {isLoggedIn ? (
                <>
                  <button
                    onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                    className="flex items-center gap-2 text-white hover:text-[#53C1CC] transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full bg-[#53C1CC] flex items-center justify-center font-bold text-sm">
                      {user?.username?.charAt(0).toUpperCase() || 'U'}
                    </div>
                  </button>

                  {profileDropdownOpen && (
                    <div className="absolute top-[120%] right-0 w-48 bg-white rounded-xl shadow-xl overflow-hidden z-50 animate-fade-in border border-gray-100">
                      <Link
                        to="/my-orders"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors border-b border-gray-100"
                      >
                        <FiShoppingCart className="text-[#53C1CC]" />
                        My Orders
                      </Link>
                      <button
                        onClick={() => { logout(); setProfileDropdownOpen(false); }}
                        className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        Logout
                      </button>
                    </div>
                  )}

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
            data={categories}
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
                    {categories.map((niche) => (
                      <div key={niche._id}>
                        <h4 className="text-[#53C1CC] font-bold mb-2 uppercase text-sm">{niche.name}</h4>
                        <div className="flex flex-col gap-2 pl-2 border-l border-white/10">
                          {niche.children && niche.children.map(cat => (
                            <div key={cat._id} className="flex flex-col gap-1">
                              <Link
                                to="/shop"
                                className="text-gray-300 text-sm font-medium hover:text-white"
                                onClick={() => setIsOpen(false)}
                              >
                                {cat.name}
                              </Link>
                              {/* Sub-subcategories for mobile if needed */}
                              {cat.children && cat.children.length > 0 && (
                                <div className="flex flex-col gap-1 pl-3 border-l border-white/5 opacity-80">
                                  {cat.children.map(sub => (
                                    <Link
                                      key={sub._id}
                                      to="/shop"
                                      className="text-gray-400 text-xs hover:text-white"
                                      onClick={() => setIsOpen(false)}
                                    >
                                      {sub.name}
                                    </Link>
                                  ))}
                                </div>
                              )}
                            </div>
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

            {/* Mobile Auth — only show login/signup if not logged in */}
            {!isLoggedIn && (
              <div className="flex flex-col w-full gap-3 px-4 border-t border-white/10 pt-6">
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
        )}

      </div>
    </div>
  )
}

export default Navbar