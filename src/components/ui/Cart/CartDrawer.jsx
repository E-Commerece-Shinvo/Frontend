import React from 'react';
import { FiX, FiMinus, FiPlus, FiTrash2, FiShoppingCart, FiLock } from 'react-icons/fi';
import { useCart } from '../../../context/CartContext';

const CartDrawer = () => {
    const { isCartOpen, setIsCartOpen, cartItems, removeFromCart, updateQuantity, cartCount, cartSubtotal } = useCart();

    const freeShippingThreshold = 9000;
    const amountToFreeShipping = Math.max(0, freeShippingThreshold - cartSubtotal);
    const shippingPercentage = Math.min(100, (cartSubtotal / freeShippingThreshold) * 100);

    if (!isCartOpen) return null;

    return (
        <div className="fixed inset-0 z-999 overflow-hidden">
            {/* Overlay */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
                onClick={() => setIsCartOpen(false)}
            />

            {/* Drawer */}
            <div className="absolute inset-y-0 right-0 max-w-full flex">
                <div
                    className={`w-full md:w-screen md:max-w-2xl bg-white shadow-2xl flex flex-col transform transition-transform duration-500 ease-in-out ${isCartOpen ? 'translate-x-0' : 'translate-x-full'}`}
                >
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b border-gray-100">
                        <div className="flex items-center gap-3">
                            <FiShoppingCart className="text-xl" />
                            <h2 className="text-lg font-bold">Shopping Cart ({cartCount})</h2>
                        </div>
                        <button
                            onClick={() => setIsCartOpen(false)}
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                        >
                            <FiX className="text-xl" />
                        </button>
                    </div>

                    {/* Shipping Progress */}
                    <div className="p-6 bg-gray-50/50">
                        <p className="text-sm font-medium mb-3 text-center">
                            {amountToFreeShipping > 0
                                ? `You are Rs. ${amountToFreeShipping} away from Free Shipping!`
                                : "Congratulations! You've earned Free Shipping!"}
                        </p>
                        <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-black transition-all duration-500 ease-out"
                                style={{ width: `${shippingPercentage}%` }}
                            />
                        </div>
                    </div>

                    {/* Cart Items */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-8">
                        {cartItems.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center gap-6">
                                <h3 className="text-xl font-bold">Your cart is empty.</h3>
                                <button
                                    onClick={() => setIsCartOpen(false)}
                                    className="bg-black text-white px-12 py-3 rounded-xl font-bold hover:bg-gray-900 transition-all shadow-lg text-sm"
                                >
                                    Start Shopping
                                </button>
                            </div>
                        ) : (
                            cartItems.map((item) => (
                                <div key={item.id} className="flex gap-4">
                                    <div className="w-24 h-24 bg-gray-50 rounded-xl overflow-hidden shrink-0 flex items-center justify-center p-2 border border-gray-100">
                                        <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between mb-1">
                                            <h3 className="font-bold text-sm leading-tight max-w-[180px]">{item.name}</h3>
                                            <div className="text-right flex flex-col">
                                                <span className="font-bold text-sm">Rs. {item.price}</span>
                                                {item.originalPrice && (
                                                    <span className="text-xs text-gray-400 line-through">Rs. {item.originalPrice}</span>
                                                )}
                                            </div>
                                        </div>
                                        <p className="text-xs text-gray-400 mb-4">{item.variant || 'Color: Black'}</p>

                                        <div className="flex items-center gap-4">
                                            <div className="flex items-center border border-gray-200 rounded-lg">
                                                <button
                                                    onClick={() => updateQuantity(item.id, -1)}
                                                    className="p-1.5 hover:bg-gray-50 transition-colors"
                                                >
                                                    <FiMinus size={14} />
                                                </button>
                                                <span className="w-8 text-center text-sm font-bold">{item.quantity}</span>
                                                <button
                                                    onClick={() => updateQuantity(item.id, 1)}
                                                    className="p-1.5 hover:bg-gray-50 transition-colors"
                                                >
                                                    <FiPlus size={14} />
                                                </button>
                                            </div>
                                            <button
                                                onClick={() => removeFromCart(item.id)}
                                                className="text-gray-400 hover:text-red-500 transition-colors"
                                            >
                                                <FiTrash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Footer */}
                    {cartItems.length > 0 && (
                        <div className="p-6 border-t border-gray-100 bg-white">
                            <div className="flex justify-between items-center mb-6">
                                <span className="text-gray-400 font-medium">Subtotal:</span>
                                <span className="font-bold">Rs: {cartSubtotal}</span>
                            </div>
                            <button className="w-full bg-black text-white py-4 rounded-xl flex items-center justify-center gap-3 hover:bg-gray-900 transition-all font-bold uppercase text-sm tracking-widest shadow-xl active:scale-[0.98]">
                                <FiLock />
                                CHECKOUT . Rs: {cartSubtotal} PKR
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CartDrawer;
