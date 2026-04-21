import React, { useState } from 'react';
import { FiArrowLeft, FiShoppingCart, FiMinus, FiPlus, FiTrash2, FiInfo, FiX } from 'react-icons/fi';
import { SiMastercard, SiVisa, SiPaypal } from 'react-icons/si';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';

const PaymentModal = ({ isOpen, onClose }) => {
    const [cardData, setCardData] = useState({
        nameOnCard: '',
        cardNumber: '',
        expiryDate: '',
        cvc: ''
    });

    const [showError, setShowError] = useState(false);

    React.useEffect(() => {
        if (isOpen) {
            setCardData({
                nameOnCard: '',
                cardNumber: '',
                expiryDate: '',
                cvc: ''
            });
            setShowError(false);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        // CVC Validation: only digits, max 4 chars
        if (name === 'cvc') {
            const numericValue = value.replace(/\D/g, '');
            if (numericValue.length > 4) return;
            setCardData(prev => ({ ...prev, [name]: numericValue }));
        } else if (name === 'cardNumber') {
            // Optional: limit card number to digits only
            const numericValue = value.replace(/\D/g, '');
            setCardData(prev => ({ ...prev, [name]: numericValue }));
        } else {
            setCardData(prev => ({ ...prev, [name]: value }));
        }

        if (showError) setShowError(false);
    };

    const isFormValid = Object.values(cardData).every(val => val.trim() !== '');

    const handlePayNow = () => {
        if (!isFormValid) {
            setShowError(true);
            return;
        }
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
            <div className="bg-white rounded-[32px] w-full max-w-[500px] p-8 md:p-10 relative z-[1001] shadow-2xl animate-in fade-in zoom-in duration-300">
                <button
                    onClick={onClose}
                    className="absolute right-6 top-6 p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                    <FiX className="text-xl" />
                </button>

                <h2 className="text-2xl md:text-3xl font-bold mb-8">Card Details</h2>

                <div className="flex gap-4 mb-10">
                    <div className="flex-1 h-14 border border-gray-200 rounded-xl flex flex-col items-center justify-center p-2 hover:border-black transition-colors bg-white shadow-sm">
                        <svg className="w-10 h-6" viewBox="0 0 100 60">
                            <circle cx="40" cy="30" r="25" fill="#EB001B" />
                            <circle cx="60" cy="30" r="25" fill="#F79E1B" fillOpacity="0.8" />
                        </svg>
                        <span className="text-[6px] font-bold tracking-tight mt-1 uppercase text-gray-400">mastercard</span>
                    </div>
                    <div className="flex-1 h-14 border border-gray-200 rounded-xl flex items-center justify-center p-2 hover:border-black transition-colors bg-white shadow-sm">
                        <SiVisa className="w-16 h-10 text-[#1A1F71]" />
                    </div>
                    <div className="flex-1 h-14 border border-gray-200 rounded-xl flex items-center justify-center p-2 hover:border-black transition-colors bg-white shadow-sm">
                        <svg className="w-12 h-10" viewBox="0 0 100 100">
                            <path d="M35 15h30c15 0 25 10 25 25s-10 25-25 25H45l-5 30H15l15-80z" fill="#003087" />
                            <path d="M25 25h30c15 0 25 10 25 25s-10 25-25 25H35l-5 30H5l15-80z" fill="#009CDE" className="mix-blend-multiply opacity-90" />
                        </svg>
                    </div>
                </div>

                <div className="space-y-6">
                    {showError && (
                        <p className="text-red-500 text-sm font-bold animate-pulse">
                            * Please fill all card detail fields
                        </p>
                    )}
                    <div className="space-y-2">
                        <input
                            type="text"
                            name="nameOnCard"
                            value={cardData.nameOnCard}
                            onChange={handleInputChange}
                            placeholder="Name on card"
                            className={`w-full px-5 py-4 border rounded-xl outline-none transition-colors placeholder:text-gray-400 text-sm md:text-base ${showError && !cardData.nameOnCard ? 'border-red-500' : 'border-gray-200 focus:border-black'}`}
                        />
                    </div>
                    <div className="space-y-2">
                        <input
                            type="text"
                            name="cardNumber"
                            value={cardData.cardNumber}
                            onChange={handleInputChange}
                            placeholder="Card Number"
                            maxLength={16}
                            className={`w-full px-5 py-4 border rounded-xl outline-none transition-colors placeholder:text-gray-400 text-sm md:text-base ${showError && !cardData.cardNumber ? 'border-red-500' : 'border-gray-200 focus:border-black'}`}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <input
                            type="text"
                            name="expiryDate"
                            value={cardData.expiryDate}
                            onChange={handleInputChange}
                            placeholder="Expiration Date ( MM / YY )"
                            maxLength={7}
                            className={`w-full px-3 py-4 border rounded-xl outline-none transition-colors placeholder:text-[9px] sm:placeholder:text-[10px] md:placeholder:text-xs text-sm md:text-base ${showError && !cardData.expiryDate ? 'border-red-500' : 'border-gray-200 focus:border-black'}`}
                        />
                        <input
                            type="text"
                            name="cvc"
                            value={cardData.cvc}
                            onChange={handleInputChange}
                            placeholder="CVC"
                            maxLength={4}
                            className={`w-full px-5 py-4 border rounded-xl outline-none transition-colors placeholder:text-gray-400 text-sm md:text-base ${showError && !cardData.cvc ? 'border-red-500' : 'border-gray-200 focus:border-black'}`}
                        />
                    </div>
                </div>

                <button
                    onClick={handlePayNow}
                    className="w-full py-4 bg-black text-white rounded-2xl font-bold uppercase tracking-widest text-sm mt-10 transition-all shadow-xl active:scale-[0.98] hover:bg-gray-900"
                >
                    PAY NOW
                </button>
            </div>
        </div>
    );
};

const Checkout = () => {
    const navigate = useNavigate();
    const { cartItems, updateQuantity, removeFromCart, cartSubtotal } = useCart();
    const [isCardModalOpen, setIsCardModalOpen] = useState(false);

    const shippingFee = 0; // Assuming standard for now
    const total = cartSubtotal + shippingFee;

    return (
        <div className="min-h-screen bg-white overflow-x-hidden pt-24 md:pt-32">
            <PaymentModal isOpen={isCardModalOpen} onClose={() => setIsCardModalOpen(false)} />

            <div className="max-w-[1400px] mx-auto flex flex-col lg:flex-row">

                {/* Left Side - Checkout Form */}
                <div className="w-full lg:w-[60%] p-6 md:p-10 lg:p-16 border-b lg:border-b-0 lg:border-r border-gray-200">
                    {/* Header */}
                    <div className="flex items-center gap-3 md:gap-4 mb-8 md:mb-12">
                        <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                            <FiArrowLeft className="text-xl md:text-2xl" />
                        </button>
                        <h1 className="text-3xl md:text-4xl font-bold">Checkout</h1>
                    </div>

                    <form className="space-y-10 md:space-y-12" onSubmit={(e) => e.preventDefault()}>
                        {/* 1. Contact Information */}
                        <section>
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-bold">1. Contact Information</h2>
                                <button type="button" className="text-sm underline font-medium">Sign in</button>
                            </div>
                            <div className="space-y-4">
                                <div className="relative">
                                    <input
                                        type="email"
                                        placeholder="Email"
                                        className="w-full px-4 py-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all placeholder:text-gray-400 text-sm md:text-base"
                                    />
                                </div>
                                <label className="flex items-center gap-3 cursor-pointer group">
                                    <div className="relative flex items-center justify-center shrink-0">
                                        <input type="checkbox" className="peer appearance-none w-5 h-5 border-2 border-gray-300 rounded-md checked:bg-black checked:border-black transition-all" />
                                        <div className="absolute opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none">
                                            <svg className="w-3 h-3 text-white fill-current" viewBox="0 0 20 20">
                                                <path d="M0 11l2-2 5 5L18 3l2 2L7 18z" />
                                            </svg>
                                        </div>
                                    </div>
                                    <span className="text-xs md:text-sm text-gray-700 group-hover:text-black transition-colors">Email me with news and offers</span>
                                </label>
                            </div>
                        </section>

                        {/* 2. Shipping Address */}
                        <section>
                            <h2 className="text-xl font-bold mb-6">2. Shipping Address</h2>
                            <div className="space-y-4">
                                <div className="space-y-1">
                                    <label className="text-[10px] text-gray-400 font-bold uppercase ml-4">Country / Region</label>
                                    <select className="w-full px-4 py-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black outline-none appearance-none bg-white text-sm md:text-base">
                                        <option>Pakistan</option>
                                    </select>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <input type="text" placeholder="First Name" className="px-4 py-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black outline-none text-sm md:text-base" />
                                    <input type="text" placeholder="Last Name" className="px-4 py-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black outline-none text-sm md:text-base" />
                                </div>

                                <input type="text" placeholder="Company (Optional)" className="w-full px-4 py-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black outline-none text-sm md:text-base" />

                                <input type="text" placeholder="Address (35 Character Limit)" className="w-full px-4 py-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black outline-none text-sm md:text-base" />

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <input type="text" placeholder="City" className="px-4 py-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black outline-none text-sm md:text-base" />
                                    <input type="text" placeholder="Postal Code (Optional)" className="px-4 py-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black outline-none text-sm md:text-base" />
                                </div>

                                <div className="relative">
                                    <input type="text" placeholder="Phone" className="w-full px-4 py-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black outline-none pr-10 text-sm md:text-base" />
                                    <FiInfo className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 cursor-help" />
                                </div>

                                <label className="flex items-center gap-3 cursor-pointer group">
                                    <div className="relative flex items-center justify-center shrink-0">
                                        <input type="checkbox" className="peer appearance-none w-5 h-5 border-2 border-gray-300 rounded-md checked:bg-black checked:border-black transition-all" />
                                        <div className="absolute opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none">
                                            <svg className="w-3 h-3 text-white fill-current" viewBox="0 0 20 20">
                                                <path d="M0 11l2-2 5 5L18 3l2 2L7 18z" />
                                            </svg>
                                        </div>
                                    </div>
                                    <span className="text-xs md:text-sm text-gray-700 group-hover:text-black transition-colors">Text me with news and offers</span>
                                </label>
                            </div>
                        </section>

                        {/* 3. Shipping Method */}
                        <section>
                            <h2 className="text-xl font-bold mb-6">3. Shipping Method</h2>
                            <div className="space-y-4">
                                <label className="flex items-center justify-between p-4 border-2 border-teal-500 bg-teal-50/10 rounded-xl cursor-pointer transition-all">
                                    <div className="flex items-center gap-3 md:gap-4">
                                        <div className="w-5 h-5 rounded-full border-2 border-teal-500 flex items-center justify-center shrink-0">
                                            <div className="w-2.5 h-2.5 rounded-full bg-teal-500"></div>
                                        </div>
                                        <div>
                                            <p className="font-bold text-sm">Standard</p>
                                            <p className="text-[10px] md:text-xs text-gray-500">Delivered in 3-4 days</p>
                                        </div>
                                    </div>
                                    <span className="font-bold text-sm">Free</span>
                                    <input type="radio" name="shipping" className="hidden" defaultChecked />
                                </label>

                                <label className="flex items-center justify-between p-4 border border-gray-300 rounded-xl cursor-pointer hover:border-black transition-all">
                                    <div className="flex items-center gap-3 md:gap-4">
                                        <div className="w-5 h-5 rounded-full border-2 border-gray-300 shrink-0"></div>
                                        <div>
                                            <p className="font-bold text-sm">Urgent Delivery</p>
                                            <p className="text-[10px] md:text-xs text-gray-500">Delivered in 1-2 days</p>
                                        </div>
                                    </div>
                                    <span className="font-bold text-sm">Rs. 300</span>
                                    <input type="radio" name="shipping" className="hidden" />
                                </label>
                            </div>
                        </section>

                        {/* 4. Payment */}
                        <section>
                            <h2 className="text-xl font-bold mb-3">4. Payment</h2>
                            <p className="text-xs md:text-sm text-gray-500 mb-6">All transactions are secure and encrypted.</p>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <label
                                    onClick={() => setIsCardModalOpen(true)}
                                    className="flex items-center gap-3 md:gap-4 p-4 border border-gray-300 rounded-xl cursor-pointer hover:border-black transition-all"
                                >
                                    <div className="w-5 h-5 rounded-full border-2 border-gray-300 shrink-0"></div>
                                    <span className="font-bold text-xs md:text-sm">Credit or Debit Card</span>
                                    <input type="radio" name="payment" className="hidden" />
                                </label>

                                <label className="flex items-center gap-3 md:gap-4 p-4 border border-gray-300 rounded-xl cursor-pointer hover:border-black transition-all">
                                    <div className="w-5 h-5 rounded-full border-2 border-gray-300 shrink-0"></div>
                                    <span className="font-bold text-xs md:text-sm">Cash on Delivery</span>
                                    <input type="radio" name="payment" className="hidden" />
                                </label>
                            </div>
                        </section>

                        <button
                            type="submit"
                            className="w-full bg-black text-white py-4 rounded-xl font-bold uppercase tracking-widest text-sm hover:bg-gray-900 transition-all shadow-xl active:scale-[0.98]"
                        >
                            COMPLETE ORDER
                        </button>
                    </form>
                </div>

                {/* Right Side - Summary */}
                <div className="w-full lg:w-[40%] bg-gray-50 p-6 md:p-10 lg:p-16">
                    <div className="flex justify-between items-center mb-10 md:mb-12">
                        <h2 className="text-3xl md:text-4xl font-extrabold tracking-tighter">LOGO</h2>
                        <FiShoppingCart className="text-xl md:text-2xl" />
                    </div>

                    <div className="space-y-6 md:space-y-8 mb-10 md:mb-12 max-h-[400px] lg:max-h-[500px] overflow-y-auto pr-2 md:pr-4 custom-scrollbar">
                        {cartItems.map((item) => (
                            <div key={item.id} className="flex gap-4 md:gap-6">
                                <div className="w-20 h-20 md:w-24 md:h-24 bg-white rounded-2xl p-1 md:p-2 border border-gray-200 flex items-center justify-center shrink-0">
                                    <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-start mb-1 gap-2">
                                        <h3 className="font-bold text-xs md:text-sm leading-tight truncate-2-lines">{item.name}</h3>
                                        <div className="text-right shrink-0">
                                            <p className="font-bold text-xs md:text-sm shrink-0 whitespace-nowrap text-right">Rs. {item.price}</p>
                                            {item.originalPrice && (
                                                <p className="text-[10px] md:text-xs text-gray-400 line-through whitespace-nowrap text-right">Rs. {item.originalPrice}</p>
                                            )}
                                        </div>
                                    </div>
                                    <p className="text-[10px] md:text-xs text-gray-400 mb-3 md:mb-4">Color: {item.color || 'Black'}</p>

                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center border border-gray-200 rounded-lg bg-white overflow-hidden shrink-0">
                                            <button
                                                onClick={() => updateQuantity(item.id, -1)}
                                                className="px-2 md:px-3 py-1 md:py-1.5 hover:bg-gray-50 transition-colors border-r border-gray-200"
                                            >
                                                <FiMinus size={10} />
                                            </button>
                                            <span className="w-6 md:w-8 text-center text-[10px] md:text-xs font-bold">{item.quantity}</span>
                                            <button
                                                onClick={() => updateQuantity(item.id, 1)}
                                                className="px-2 md:px-3 py-1 md:py-1.5 hover:bg-gray-50 transition-colors border-l border-gray-200"
                                            >
                                                <FiPlus size={10} />
                                            </button>
                                        </div>
                                        <button
                                            onClick={() => removeFromCart(item.id)}
                                            className="text-gray-400 hover:text-red-500 transition-colors"
                                        >
                                            <FiTrash2 size={14} md:size={16} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 md:gap-4 mb-10 md:mb-12">
                        <input
                            type="text"
                            placeholder="Discount code or gift card"
                            className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black outline-none bg-white text-sm"
                        />
                        <button className="whitespace-nowrap px-6 py-3 bg-gray-200 text-gray-800 rounded-xl font-bold text-sm hover:bg-gray-300 transition-all">
                            Apply
                        </button>
                    </div>

                    <div className="space-y-4 border-b border-gray-200 pb-8 mb-8">
                        <div className="flex justify-between items-center text-sm">
                            <span className="font-bold text-gray-700">Subtotal:</span>
                            <span className="font-bold whitespace-nowrap">Rs: {cartSubtotal}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                            <span className="font-bold text-gray-700">Shipping :</span>
                            <span className="text-gray-500 whitespace-nowrap">{shippingFee === 0 ? 'Free' : `Rs. ${shippingFee}`}</span>
                        </div>
                    </div>

                    <div className="flex justify-between items-center mb-10 md:mb-12">
                        <span className="text-lg md:text-xl font-bold">Total :</span>
                        <span className="text-xl md:text-2xl font-black whitespace-nowrap">Rs . {total}</span>
                    </div>

                    <div className="text-center">
                        <button className="text-xs md:text-sm font-medium underline text-gray-600 hover:text-black">Return Policy</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
