import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar/Navbar';
import Footer from '../../components/layout/Footer/Footer';
import { useAuth } from '../../context/AuthContext';
import { createSupportTicket } from '../../api/support';
import {
    FiUser, FiShoppingBag, FiClock, FiRotateCcw,
    FiMail, FiPhone, FiHelpCircle, FiChevronDown,
    FiMessageSquare, FiSend, FiFileText
} from 'react-icons/fi';
import toast from 'react-hot-toast';

function CustomerSupport() {
    const { user } = useAuth();
    const [faqOpenIndex, setFaqOpenIndex] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Ticket form state
    const [ticketData, setTicketData] = useState({
        category: 'Order Query',
        email: '',
        subject: '',
        message: ''
    });

    useEffect(() => {
        if (user?.email) {
            setTicketData(prev => ({ ...prev, email: user.email }));
        }
    }, [user]);

    const toggleFaq = (index) => {
        setFaqOpenIndex(faqOpenIndex === index ? null : index);
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();

        if (!ticketData.email.trim() || !ticketData.subject.trim() || !ticketData.message.trim()) {
            toast.error("Please fill in all fields.");
            return;
        }

        setIsSubmitting(true);
        const toastId = toast.loading("Submitting support ticket...");

        try {
            await createSupportTicket(ticketData);
            toast.success("Support ticket submitted successfully! Our support team will contact you within 24 hours.", { id: toastId });
            setTicketData({
                category: 'Order Query',
                email: user?.email || '',
                subject: '',
                message: ''
            });
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to submit support ticket. Please try again.", { id: toastId });
        } finally {
            setIsSubmitting(false);
        }
    };

    const faqs = [
        {
            q: "How can I track my order?",
            a: "You can track your order status by navigating to 'My Orders' in the profile dropdown menu. Each order displays its current status (Pending, Processing, Shipped, or Delivered) along with real-time tracking updates."
        },
        {
            q: "What is your return policy?",
            a: "We offer a 30-day return policy for all unused products in their original packaging. You can initiate a return by going to the 'My Returns' page and submitting a return request."
        },
        {
            q: "How long does shipping and delivery take?",
            a: "Delivery typically takes 3 to 5 business days for standard shipping depending on your city. Express delivery options (1-2 business days) are available during checkout for select regions."
        },
        {
            q: "Can I change my delivery address after placing an order?",
            a: "If your order has not entered the 'Processing' or 'Shipped' stage yet, we can update your delivery details. Please contact our support hotline immediately or submit an urgent request using the form below."
        },
        {
            q: "What payment methods do you accept?",
            a: "We accept Cash on Delivery (COD), Credit/Debit Cards (Visa, MasterCard), and major mobile wallets. All transactions are securely processed and encrypted."
        }
    ];

    return (
        <div className="min-h-screen flex flex-col bg-[#f5f5f5]">
            <Navbar />

            {/* Spacer for fixed navbar */}
            <div className="h-[40px] md:h-[110px]" />

            {/* ───── main wrapper ───── */}
            <div className="flex-1 flex flex-col lg:flex-row max-w-[1200px] w-full mx-auto px-4 py-6 md:py-10 gap-6 lg:gap-8 items-start">

                {/* ───── SIDEBAR (Desktop) ───── */}
                <aside className="hidden lg:block w-[260px] flex-shrink-0 bg-white rounded-2xl py-6 shadow-sm border border-gray-100 sticky top-[95px]">
                    {/* greeting */}
                    <div className="flex items-center gap-3 px-6 pb-5 border-b border-gray-100">
                        <div className="w-10 h-10 rounded-full bg-[#53C1CC] text-white flex items-center justify-center font-bold text-base shadow-sm overflow-hidden">
                            {user?.profileImage ? (
                                <img src={user.profileImage} alt="Avatar" className="w-full h-full object-cover" />
                            ) : (
                                user?.username?.charAt(0).toUpperCase() || 'U'
                            )}
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[11px] text-gray-400 uppercase tracking-wider font-semibold">Welcome back</span>
                            <span className="text-[15px] text-gray-900 font-bold truncate max-w-[150px]">
                                {user?.username || 'User'}
                            </span>
                        </div>
                    </div>

                    {/* nav links */}
                    <div className="px-3 pt-5 flex flex-col gap-1">
                        <h4 className="px-3 text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2">Account Settings</h4>
                        <Link to="/profile" className="flex items-center gap-3 px-3 py-2.5 text-[14px] text-gray-600 font-medium rounded-xl hover:bg-gray-50 transition-all group">
                            <FiUser className="text-gray-400 group-hover:text-[#53C1CC]" size={18} />
                            My Profile
                        </Link>
                    </div>

                    <div className="px-3 pt-6 flex flex-col gap-1">
                        <h4 className="px-3 text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2">Shopping Activity</h4>
                        <Link to="/my-orders" className="flex items-center gap-3 px-3 py-2.5 text-[14px] text-gray-600 font-medium rounded-xl hover:bg-gray-50 transition-all group">
                            <FiShoppingBag className="text-gray-400 group-hover:text-[#53C1CC]" size={18} />
                            My Orders
                        </Link>
                        <Link to="/my-returns" className="flex items-center gap-3 px-3 py-2.5 text-[14px] text-gray-600 font-medium rounded-xl hover:bg-gray-50 transition-all group">
                            <FiRotateCcw className="text-gray-400 group-hover:text-[#53C1CC]" size={18} />
                            My Returns
                        </Link>
                        <Link to="/my-orders?tab=cancelled" className="flex items-center gap-3 px-3 py-2.5 text-[14px] text-gray-600 font-medium rounded-xl hover:bg-gray-50 transition-all group">
                            <FiClock className="text-gray-400 group-hover:text-amber-400" size={18} />
                            Cancellations
                        </Link>
                    </div>

                    <div className="px-3 pt-6 flex flex-col gap-1">
                        <h4 className="px-3 text-[11px] font-bold text-[#53C1CC] uppercase tracking-widest mb-2">Help & Support</h4>
                        <Link to="/support" className="flex items-center gap-3 px-3 py-2.5 text-[14px] text-[#53C1CC] font-bold rounded-xl bg-[#53C1CC]/5 transition-all">
                            <FiHelpCircle size={18} />
                            Customer Support
                        </Link>
                        <Link to="/my-complaints" className="flex items-center gap-3 px-3 py-2.5 text-[14px] text-gray-600 font-medium rounded-xl hover:bg-gray-50 transition-all group">
                            <FiFileText className="text-gray-400 group-hover:text-[#53C1CC]" size={18} />
                            My Complaints
                        </Link>
                    </div>
                </aside>

                {/* ───── RIGHT CONTENT ───── */}
                <main className="flex-1 min-w-0 w-full pt-6 md:pt-10">

                    {/* Page Header */}
                    <div className="mb-8">
                        <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight mb-2">Customer Support</h1>
                        <p className="text-gray-500 text-[14px]">How can we help you today? Contact us or browse frequently asked questions.</p>
                    </div>

                    <div className="flex flex-col gap-8">

                        {/* ───── 1. Quick Contact Cards ───── */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                            {/* Card 1: Email */}
                            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col items-center text-center group hover:shadow-md transition-all">
                                <div className="w-12 h-12 rounded-xl bg-[#53C1CC]/10 text-[#53C1CC] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                    <FiMail size={24} />
                                </div>
                                <h3 className="text-base font-bold text-gray-900 mb-1">Email Us</h3>
                                <p className="text-xs text-gray-400 mb-3">Response within 24 hours</p>
                                <a href="mailto:support@ecommerce.com" className="text-sm font-bold text-[#53C1CC] hover:underline">
                                    support@ecommerce.com
                                </a>
                            </div>

                            {/* Card 2: Hotline */}
                            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col items-center text-center group hover:shadow-md transition-all">
                                <div className="w-12 h-12 rounded-xl bg-[#53C1CC]/10 text-[#53C1CC] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                    <FiPhone size={24} />
                                </div>
                                <h3 className="text-base font-bold text-gray-900 mb-1">Call Hotline</h3>
                                <p className="text-xs text-gray-400 mb-3">Mon-Sat, 9AM - 6PM</p>
                                <a href="tel:+923001234567" className="text-sm font-bold text-[#53C1CC] hover:underline">
                                    +92 300 1234567
                                </a>
                            </div>

                            {/* Card 3: WhatsApp Support */}
                            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col items-center text-center group hover:shadow-md transition-all">
                                <div className="w-12 h-12 rounded-xl bg-[#53C1CC]/10 text-[#53C1CC] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                    <FiMessageSquare size={24} />
                                </div>
                                <h3 className="text-base font-bold text-gray-900 mb-1">Live Chat</h3>
                                <p className="text-xs text-gray-400 mb-3">WhatsApp support chat</p>
                                <a href="https://wa.me/923001234567" target="_blank" rel="noopener noreferrer" className="text-sm font-bold text-[#53C1CC] hover:underline">
                                    Start Chat
                                </a>
                            </div>
                        </div>

                        {/* ───── 2. Ticket / Query Form ───── */}
                        <div className="w-full bg-white rounded-3xl border border-gray-100 shadow-sm p-6 md:p-8">
                            <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                                <span className="w-1.5 h-6 bg-[#53C1CC] rounded-full" />
                                Submit a Support Ticket
                            </h3>

                            <form onSubmit={handleFormSubmit} className="flex flex-col gap-5">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    {/* Category Field */}
                                    <div className="flex flex-col gap-2">
                                        <label className="text-[12px] font-bold text-gray-400 uppercase tracking-wider ml-1">Inquiry Category</label>
                                        <div className="relative group">
                                            <FiFileText className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#53C1CC] transition-colors" />
                                            <select
                                                value={ticketData.category}
                                                onChange={(e) => setTicketData({ ...ticketData, category: e.target.value })}
                                                className="w-full pl-11 pr-10 py-3.5 bg-gray-50/50 border border-gray-200 rounded-xl text-[14px] text-gray-900 outline-none focus:border-[#53C1CC] focus:ring-4 focus:ring-[#53C1CC]/10 transition-all appearance-none cursor-pointer font-medium"
                                            >
                                                <option value="Order Query">Order Query</option>
                                                <option value="Payment Issue">Payment Issue</option>
                                                <option value="Product Info">Product Info</option>
                                                <option value="Return & Refund">Return & Refund</option>
                                                <option value="Other">Other</option>
                                            </select>
                                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 group-focus-within:text-[#53C1CC]">
                                                <FiChevronDown size={18} />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Email Field */}
                                    <div className="flex flex-col gap-2">
                                        <label className="text-[12px] font-bold text-gray-400 uppercase tracking-wider ml-1">Email Address</label>
                                        <div className="relative group">
                                            <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#53C1CC] transition-colors" />
                                            <input
                                                type="email"
                                                required
                                                value={ticketData.email}
                                                onChange={(e) => setTicketData({ ...ticketData, email: e.target.value })}
                                                placeholder="Enter your email address"
                                                className="w-full pl-11 pr-4 py-3.5 bg-gray-50/50 border border-gray-200 rounded-xl text-[14px] text-gray-900 outline-none focus:border-[#53C1CC] focus:ring-4 focus:ring-[#53C1CC]/10 transition-all font-medium"
                                            />
                                        </div>
                                    </div>

                                    {/* Subject Field */}
                                    <div className="flex flex-col gap-2 md:col-span-2">
                                        <label className="text-[12px] font-bold text-gray-400 uppercase tracking-wider ml-1">Subject</label>
                                        <div className="relative group">
                                            <FiHelpCircle className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#53C1CC] transition-colors" />
                                            <input
                                                type="text"
                                                required
                                                value={ticketData.subject}
                                                onChange={(e) => setTicketData({ ...ticketData, subject: e.target.value })}
                                                placeholder="Brief summary of your query"
                                                className="w-full pl-11 pr-4 py-3.5 bg-gray-50/50 border border-gray-200 rounded-xl text-[14px] text-gray-900 outline-none focus:border-[#53C1CC] focus:ring-4 focus:ring-[#53C1CC]/10 transition-all font-medium"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Message Field */}
                                <div className="flex flex-col gap-2">
                                    <label className="text-[12px] font-bold text-gray-400 uppercase tracking-wider ml-1">Describe Your Issue</label>
                                    <div className="relative group">
                                        <textarea
                                            required
                                            rows="5"
                                            value={ticketData.message}
                                            onChange={(e) => setTicketData({ ...ticketData, message: e.target.value })}
                                            placeholder="Write details of your problem here..."
                                            className="w-full px-4 py-3.5 bg-gray-50/50 border border-gray-200 rounded-xl text-[14px] text-gray-900 outline-none focus:border-[#53C1CC] focus:ring-4 focus:ring-[#53C1CC]/10 transition-all font-medium resize-none"
                                        />
                                    </div>
                                </div>

                                {/* Submit Button */}
                                <div className="flex justify-end border-t border-gray-50 pt-5 mt-2">
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="px-8 py-3 bg-[#53C1CC] text-white rounded-xl font-bold text-[14px] hover:bg-[#46869d] transition-all shadow-lg shadow-[#53C1CC]/20 active:scale-95 flex items-center gap-2 disabled:opacity-75 disabled:cursor-not-allowed"
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                                Submitting...
                                            </>
                                        ) : (
                                            <>
                                                <FiSend />
                                                Submit Ticket
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>

                        {/* ───── 3. FAQ Accordion ───── */}
                        <div className="w-full bg-white rounded-3xl border border-gray-100 shadow-sm p-6 md:p-8 mb-6">
                            <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                                <span className="w-1.5 h-6 bg-[#53C1CC] rounded-full" />
                                Frequently Asked Questions
                            </h3>

                            <div className="flex flex-col gap-3">
                                {faqs.map((faq, index) => {
                                    const isOpen = faqOpenIndex === index;
                                    return (
                                        <div
                                            key={index}
                                            className={`border rounded-2xl transition-all duration-300 ${isOpen ? 'border-[#53C1CC] bg-[#53C1CC]/5 shadow-sm' : 'border-gray-100 bg-white hover:border-gray-200'
                                                }`}
                                        >
                                            <button
                                                onClick={() => toggleFaq(index)}
                                                className="w-full flex justify-between items-center px-5 py-4 text-left focus:outline-none"
                                            >
                                                <span className="text-[14px] md:text-[15px] font-bold text-gray-900">
                                                    {faq.q}
                                                </span>
                                                <span className={`text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180 text-[#53C1CC]' : ''}`}>
                                                    <FiChevronDown size={20} />
                                                </span>
                                            </button>

                                            <div
                                                className={`transition-all duration-300 overflow-hidden ${isOpen ? 'max-h-[200px] border-t border-[#53C1CC]/10' : 'max-h-0'
                                                    }`}
                                            >
                                                <p className="px-5 py-4 text-[13px] md:text-[14px] text-gray-500 font-medium leading-relaxed">
                                                    {faq.a}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                    </div>
                </main>
            </div>

            <Footer />
        </div>
    );
}

export default CustomerSupport;
