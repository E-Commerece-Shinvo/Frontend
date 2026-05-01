import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar/Navbar';
import Footer from '../../components/layout/Footer/Footer';
import { useAuth } from '../../context/AuthContext';
import {
    FiUser, FiShoppingBag, FiXCircle, FiClock, FiMoreVertical,
    FiEdit2, FiMail, FiPhone, FiMapPin, FiCamera, FiLock, FiCheckCircle, FiRotateCcw
} from 'react-icons/fi';

const Profile = () => {
    const { user } = useAuth();
    const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
    const menuRef = useRef(null);
    const fileInputRef = useRef(null);
    const [previewImage, setPreviewImage] = useState(null);

    // Password change state
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    // Form state (mocking some fields since they might not be in backend yet)
    const [profileData, setProfileData] = useState({
        username: user?.username || 'User',
        email: user?.email || 'user@example.com',
        phone: '+92 300 1234567',
        gender: 'Male',
        permanentAddress: '', // New field
        fullName: user?.username || 'Full Name',
        // Location fields (current active)
        country: 'Pakistan',
        addressFirstName: '',
        addressLastName: '',
        state: '',
        city: '',
        postalCode: '',
        address: '123 Street Name, Lahore, Pakistan',
        addressPhone: ''
    });

    const [activeLocationSlot, setActiveLocationSlot] = useState(1);
    const [savedLocations, setSavedLocations] = useState(
        Array.from({ length: 5 }, (_, i) => ({
            id: i + 1,
            country: 'Pakistan',
            addressFirstName: '',
            addressLastName: '',
            state: '',
            city: '',
            postalCode: '',
            address: i === 0 ? '123 Street Name, Lahore, Pakistan' : '',
            addressPhone: ''
        }))
    );
    const [showAllAddresses, setShowAllAddresses] = useState(false);
    const handleSwitchSlot = (slotId) => {
        // Save current form data to the current slot first
        const currentData = {
            country: profileData.country,
            addressFirstName: profileData.addressFirstName,
            addressLastName: profileData.addressLastName,
            state: profileData.state,
            city: profileData.city,
            postalCode: profileData.postalCode,
            address: profileData.address,
            addressPhone: profileData.addressPhone,
        };

        const updatedSaved = savedLocations.map(loc =>
            loc.id === activeLocationSlot ? { ...loc, ...currentData } : loc
        );
        setSavedLocations(updatedSaved);

        // Switch to new slot
        const nextLoc = updatedSaved.find(loc => loc.id === slotId);
        setActiveLocationSlot(slotId);
        setProfileData(prev => ({
            ...prev,
            ...nextLoc
        }));
    };

    // Close dropdown on click outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsAccountMenuOpen(false);
            }
        };
        if (isAccountMenuOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isAccountMenuOpen]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = (e) => {
        e.preventDefault();

        // Update the current slot in savedLocations
        const currentData = {
            country: profileData.country,
            addressFirstName: profileData.addressFirstName,
            addressLastName: profileData.addressLastName,
            state: profileData.state,
            city: profileData.city,
            postalCode: profileData.postalCode,
            address: profileData.address,
            addressPhone: profileData.addressPhone,
        };

        const updatedSaved = savedLocations.map(loc =>
            loc.id === activeLocationSlot ? { ...loc, ...currentData } : loc
        );
        setSavedLocations(updatedSaved);

        alert(`Changes saved to Address Slot ${activeLocationSlot}!`);
    };

    const handlePasswordUpdate = (e) => {
        e.preventDefault();
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            alert("New passwords do not match!");
            return;
        }
        // Mock API call
        alert("Password updated successfully!");
        setIsPasswordModalOpen(false);
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    };

    return (
        <div className="min-h-screen flex flex-col bg-[#f5f5f5]">
            <Navbar />

            {/* Hidden File Input */}
            <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleImageChange}
            />

            {/* spacer for fixed navbar */}
            <div className="h-[90px] md:h-[110px]" />

            {/* ───── main wrapper ───── */}
            <div className="flex-1 flex flex-col lg:flex-row max-w-[1200px] w-full mx-auto px-4 pb-6 md:pb-10 gap-6 lg:gap-8 lg:items-start relative z-10 overflow-x-hidden">

                {/* ───── SIDEBAR (Desktop) ───── */}
                <aside className="hidden lg:block w-[260px] flex-shrink-0 bg-white rounded-2xl py-6 shadow-sm border border-gray-100 sticky top-[30px] mt-[-20px]">
                    {/* greeting */}
                    <div className="flex items-center gap-3 px-6 pb-5 border-b border-gray-100">
                        <div className="w-10 h-10 rounded-full bg-[#53C1CC] text-white flex items-center justify-center font-bold text-base shadow-sm overflow-hidden">
                            {previewImage ? (
                                <img src={previewImage} alt="Avatar" className="w-full h-full object-cover" />
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
                        <h4 className="px-3 text-[11px] font-bold text-[#53C1CC] uppercase tracking-widest mb-2">Account Settings</h4>
                        <Link to="/profile" className="flex items-center gap-3 px-3 py-2.5 text-[14px] text-[#53C1CC] font-bold rounded-xl bg-[#53C1CC]/5 transition-all">
                            <FiUser size={18} />
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
                </aside>


                {/* ───── RIGHT CONTENT ───── */}



                <main className="flex-1 min-w-0 w-full pt-6 md:pt-10">
                    {/* title */}
                    <div className="mb-8 hidden md:block">
                        <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight mb-2">My Profile</h1>
                        <p className="text-gray-500 text-[14px]">Manage your account settings and personal information</p>
                    </div>
                    <div className="flex flex-col gap-8">

                        {/* Profile Card */}
                        <div className="w-full bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                            <div className="h-32 bg-img-custom bg-[url('../assets/images/bg.jpg')] bg-cover bg-center relative">
                                <div className="absolute inset-0 bg-black/10" /> {/* subtle overlay */}
                                <div className="absolute -bottom-12 left-8 group">
                                    <div className="relative">
                                        <div className="w-24 h-24 rounded-full bg-white p-1.5 shadow-lg border border-gray-100 overflow-hidden">
                                            <div className="w-full h-full rounded-full bg-[#53C1CC] text-white flex items-center justify-center font-bold text-3xl overflow-hidden">
                                                {previewImage ? (
                                                    <img src={previewImage} alt="Profile" className="w-full h-full object-cover" />
                                                ) : (
                                                    user?.username?.charAt(0).toUpperCase() || 'U'
                                                )}
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => fileInputRef.current.click()}
                                            className="absolute bottom-0 right-0 p-2 bg-white text-[#53C1CC] rounded-full shadow-md border border-gray-100 hover:bg-gray-50 transition-all transform hover:scale-110 active:scale-95"
                                        >
                                            <FiCamera size={16} />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-16 px-6 md:px-8 pb-8">
                                <div className="flex flex-row justify-between items-start gap-4 text-left">
                                    <div className="flex flex-col items-start min-w-0">
                                        <h2 className="text-2xl font-bold text-gray-900 truncate">{profileData.fullName}</h2>
                                        <p className="text-gray-500 text-[14px] truncate">{profileData.email}</p>
                                    </div>
                                    <button className="flex-shrink-0 flex items-center justify-center gap-2 px-3 md:px-5 py-2 md:py-2.5 bg-white text-gray-700 text-[14px] font-bold rounded-xl border border-gray-100 hover:border-[#53C1CC] hover:bg-[#53C1CC]/5 transition-all shadow-sm group">
                                        <div className="p-2 rounded-lg bg-[#53C1CC] text-white shadow-sm transition-all group-hover:scale-110">
                                            <FiEdit2 size={14} />
                                        </div>
                                        <span className="hidden md:inline whitespace-nowrap">Edit Profile</span>
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Profile Form */}
                        <form onSubmit={handleSave} className="flex flex-col gap-8">
                            {/* Personal Information Form */}
                            <div className="w-full bg-white rounded-3xl border border-gray-100 shadow-sm p-6 md:p-8">
                                <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                                    <span className="w-1.5 h-6 bg-[#53C1CC] rounded-full" />
                                    Personal Information
                                </h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="flex flex-col gap-2">
                                        <label className="text-[12px] font-bold text-gray-400 uppercase tracking-wider ml-1">Full Name</label>
                                        <div className="relative group">
                                            <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#53C1CC] transition-colors" />
                                            <input
                                                type="text"
                                                value={profileData.fullName}
                                                onChange={(e) => setProfileData({ ...profileData, fullName: e.target.value })}
                                                className="w-full pl-11 pr-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl text-[14px] text-gray-900 outline-none focus:border-[#53C1CC] focus:ring-4 focus:ring-[#53C1CC]/10 transition-all"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <label className="text-[12px] font-bold text-gray-400 uppercase tracking-wider ml-1">Email Address</label>
                                        <div className="relative group">
                                            <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#53C1CC] transition-colors" />
                                            <input
                                                type="email"
                                                value={profileData.email}
                                                onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                                                className="w-full pl-11 pr-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl text-[14px] text-gray-900 outline-none focus:border-[#53C1CC] focus:ring-4 focus:ring-[#53C1CC]/10 transition-all"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <label className="text-[12px] font-bold text-gray-400 uppercase tracking-wider ml-1">Phone Number</label>
                                        <div className="relative group">
                                            <FiPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#53C1CC] transition-colors" />
                                            <input
                                                type="text"
                                                value={profileData.phone}
                                                onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                                                className="w-full pl-11 pr-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl text-[14px] text-gray-900 outline-none focus:border-[#53C1CC] focus:ring-4 focus:ring-[#53C1CC]/10 transition-all"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <label className="text-[12px] font-bold text-gray-400 uppercase tracking-wider ml-1">Gender</label>
                                        <div className="relative group">
                                            <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#53C1CC] transition-colors" />
                                            <select
                                                value={profileData.gender}
                                                onChange={(e) => setProfileData({ ...profileData, gender: e.target.value })}
                                                className="w-full pl-11 pr-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl text-[14px] text-gray-900 outline-none focus:border-[#53C1CC] focus:ring-4 focus:ring-[#53C1CC]/10 transition-all appearance-none cursor-pointer"
                                            >
                                                <option value="Male">Male</option>
                                                <option value="Female">Female</option>
                                                <option value="Other">Other</option>
                                            </select>
                                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 group-focus-within:text-[#53C1CC]">
                                                <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                                                    <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" fillRule="evenodd"></path>
                                                </svg>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="md:col-span-2 flex flex-col gap-2">
                                        <label className="text-[12px] font-bold text-gray-400 uppercase tracking-wider ml-1">Permanent Address</label>
                                        <div className="relative group">
                                            <FiMapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#53C1CC] transition-colors" />
                                            <input
                                                type="text"
                                                value={profileData.permanentAddress}
                                                onChange={(e) => setProfileData({ ...profileData, permanentAddress: e.target.value })}
                                                placeholder="Enter your permanent address"
                                                className="w-full pl-11 pr-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl text-[14px] text-gray-900 outline-none focus:border-[#53C1CC] focus:ring-4 focus:ring-[#53C1CC]/10 transition-all"
                                            />
                                        </div>
                                    </div>

                                </div>

                                <div className="flex justify-end mt-8 border-t border-gray-50 pt-6">
                                    <button
                                        type="submit"
                                        className="px-8 py-2.5 bg-[#53C1CC] text-white rounded-xl font-bold text-[14px] hover:bg-[#46869d] transition-all shadow-lg shadow-[#53C1CC]/20 active:scale-95"
                                    >
                                        Save
                                    </button>
                                </div>
                            </div>


                            {/* Location Card */}
                            <div className="w-full bg-white rounded-3xl border border-gray-100 shadow-sm p-6 md:p-8">
                                <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                                    <span className="w-1.5 h-6 bg-[#53C1CC] rounded-full" />
                                    Shipping address
                                </h3>

                                {/* Saved Addresses Box */}
                                <div className="mb-10 p-5 bg-gray-50/50 rounded-3xl border border-gray-100">
                                    <div className="flex justify-between items-center mb-4">
                                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider ml-1 block">Select Saved Address</label>
                                        <button
                                            type="button"
                                            onClick={() => setShowAllAddresses(!showAllAddresses)}
                                            className="lg:hidden text-[11px] font-bold text-[#53C1CC] hover:text-[#46869d] transition-colors px-2 py-1 rounded-lg hover:bg-[#53C1CC]/5"
                                        >
                                            {showAllAddresses ? 'Show Less' : 'View All'}
                                        </button>
                                    </div>
                                    <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
                                        {savedLocations.map((loc, index) => (
                                            <div
                                                key={loc.id}
                                                onClick={() => handleSwitchSlot(loc.id)}
                                                className={`p-4 rounded-2xl border cursor-pointer transition-all relative flex flex-col gap-2 min-h-[100px] group
                                                    ${index >= 2 && !showAllAddresses ? 'hidden lg:flex' : 'flex'}
                                                    ${activeLocationSlot === loc.id
                                                        ? 'bg-[#53C1CC]/10 border-[#53C1CC] shadow-lg shadow-[#53C1CC]/10 scale-[1.02]'
                                                        : 'bg-white border-gray-100 hover:border-gray-300 hover:bg-gray-50/50'}`}
                                            >
                                                <div className="flex items-center justify-between">
                                                    <div className={`p-1.5 rounded-lg transition-colors ${activeLocationSlot === loc.id ? 'bg-[#53C1CC] text-white' : 'bg-gray-100 text-gray-400'}`}>
                                                        <FiMapPin size={12} />
                                                    </div>
                                                    <span className={`text-[10px] font-bold transition-colors ${activeLocationSlot === loc.id ? 'text-[#53C1CC]' : 'text-gray-300'}`}>
                                                        #{loc.id}
                                                    </span>
                                                </div>

                                                <div className="flex flex-col gap-0.5 overflow-hidden">
                                                    <h4 className={`text-[13px] font-bold truncate ${activeLocationSlot === loc.id ? 'text-gray-900' : 'text-gray-500'}`}>
                                                        {loc.addressFirstName || loc.addressLastName ? `${loc.addressFirstName} ${loc.addressLastName}` : `Slot ${loc.id}`}
                                                    </h4>
                                                    <p className="text-[11px] text-gray-400 truncate">
                                                        {loc.address || 'Empty'}
                                                    </p>
                                                </div>

                                                {activeLocationSlot === loc.id && (
                                                    <div className="absolute top-0 right-0 w-6 h-6 bg-[#53C1CC] text-white flex items-center justify-center rounded-bl-xl rounded-tr-2xl scale-90 -mr-0.5 -mt-0.5">
                                                        <div className="w-1 h-1 rounded-full bg-white animate-pulse" />
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>

                                </div>

                                <div className="grid grid-cols-1 gap-6">
                                    <div className="flex flex-col gap-2">
                                        <label className="text-[12px] font-bold text-gray-400 uppercase tracking-wider ml-1">Country / Region</label>
                                        <div className="relative group">
                                            <FiMapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#53C1CC] transition-colors" />
                                            <select
                                                value={profileData.country}
                                                onChange={(e) => setProfileData({ ...profileData, country: e.target.value })}
                                                className="w-full pl-11 pr-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl text-[14px] text-gray-900 outline-none focus:border-[#53C1CC] focus:ring-4 focus:ring-[#53C1CC]/10 transition-all appearance-none cursor-pointer"
                                            >
                                                <option value="Pakistan">Pakistan</option>
                                                <option value="India">India</option>
                                                <option value="USA">USA</option>
                                                <option value="UK">UK</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="flex flex-col gap-2">
                                            <label className="text-[12px] font-bold text-gray-400 uppercase tracking-wider ml-1">First Name</label>
                                            <div className="relative group">
                                                <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#53C1CC] transition-colors" />
                                                <input
                                                    type="text"
                                                    value={profileData.addressFirstName}
                                                    onChange={(e) => setProfileData({ ...profileData, addressFirstName: e.target.value })}
                                                    placeholder="First Name"
                                                    className="w-full pl-11 pr-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl text-[14px] text-gray-900 outline-none focus:border-[#53C1CC] focus:ring-4 focus:ring-[#53C1CC]/10 transition-all"
                                                />
                                            </div>
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <label className="text-[12px] font-bold text-gray-400 uppercase tracking-wider ml-1">Last Name</label>
                                            <div className="relative group">
                                                <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#53C1CC] transition-colors" />
                                                <input
                                                    type="text"
                                                    value={profileData.addressLastName}
                                                    onChange={(e) => setProfileData({ ...profileData, addressLastName: e.target.value })}
                                                    placeholder="Last Name"
                                                    className="w-full pl-11 pr-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl text-[14px] text-gray-900 outline-none focus:border-[#53C1CC] focus:ring-4 focus:ring-[#53C1CC]/10 transition-all"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <label className="text-[12px] font-bold text-gray-400 uppercase tracking-wider ml-1">State</label>
                                        <div className="relative group">
                                            <FiMapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#53C1CC] transition-colors" />
                                            <input
                                                type="text"
                                                value={profileData.state}
                                                onChange={(e) => setProfileData({ ...profileData, state: e.target.value })}
                                                placeholder="State"
                                                className="w-full pl-11 pr-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl text-[14px] text-gray-900 outline-none focus:border-[#53C1CC] focus:ring-4 focus:ring-[#53C1CC]/10 transition-all"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <label className="text-[12px] font-bold text-gray-400 uppercase tracking-wider ml-1">Address</label>
                                        <div className="relative group">
                                            <FiMapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#53C1CC] transition-colors" />
                                            <input
                                                type="text"
                                                value={profileData.address}
                                                onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
                                                placeholder="Address (35 Character Limit)"
                                                className="w-full pl-11 pr-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl text-[14px] text-gray-900 outline-none focus:border-[#53C1CC] focus:ring-4 focus:ring-[#53C1CC]/10 transition-all"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="flex flex-col gap-2">
                                            <label className="text-[12px] font-bold text-gray-400 uppercase tracking-wider ml-1">City</label>
                                            <div className="relative group">
                                                <FiMapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#53C1CC] transition-colors" />
                                                <input
                                                    type="text"
                                                    value={profileData.city}
                                                    onChange={(e) => setProfileData({ ...profileData, city: e.target.value })}
                                                    placeholder="City"
                                                    className="w-full pl-11 pr-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl text-[14px] text-gray-900 outline-none focus:border-[#53C1CC] focus:ring-4 focus:ring-[#53C1CC]/10 transition-all"
                                                />
                                            </div>
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <label className="text-[12px] font-bold text-gray-400 uppercase tracking-wider ml-1">Postal Code</label>
                                            <div className="relative group">
                                                <FiMapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#53C1CC] transition-colors" />
                                                <input
                                                    type="text"
                                                    value={profileData.postalCode}
                                                    onChange={(e) => setProfileData({ ...profileData, postalCode: e.target.value })}
                                                    placeholder="Postal Code (Optional)"
                                                    className="w-full pl-11 pr-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl text-[14px] text-gray-900 outline-none focus:border-[#53C1CC] focus:ring-4 focus:ring-[#53C1CC]/10 transition-all"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <label className="text-[12px] font-bold text-gray-400 uppercase tracking-wider ml-1">Phone</label>
                                        <div className="relative group">
                                            <FiPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#53C1CC] transition-colors" />
                                            <input
                                                type="text"
                                                value={profileData.addressPhone}
                                                onChange={(e) => setProfileData({ ...profileData, addressPhone: e.target.value })}
                                                placeholder="Phone"
                                                className="w-full pl-11 pr-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl text-[14px] text-gray-900 outline-none focus:border-[#53C1CC] focus:ring-4 focus:ring-[#53C1CC]/10 transition-all"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Save Changes button moved inside the card */}
                                <div className="flex justify-end mt-8 border-t border-gray-50 pt-6">
                                    <button
                                        type="submit"
                                        className="px-10 py-3 bg-[#53C1CC] text-white rounded-xl font-bold text-[14px] hover:bg-[#46869d] transition-all shadow-lg shadow-[#53C1CC]/20 active:scale-95"
                                    >
                                        Save Changes
                                    </button>
                                </div>
                            </div>
                        </form>

                        {/* Security Section */}
                        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 md:p-8 mb-12">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center shadow-sm">
                                        <FiLock size={28} />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-900">Security & Password</h3>
                                        <p className="text-gray-500 text-[14px]">Update your password and secure your account</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setIsPasswordModalOpen(true)}
                                    className="px-8 py-3 bg-white text-gray-700 text-[14px] font-bold rounded-xl border border-gray-200 hover:border-[#53C1CC] hover:text-[#53C1CC] hover:bg-[#53C1CC]/5 transition-all shadow-sm flex items-center justify-center gap-2"
                                >
                                    <FiEdit2 size={16} />
                                    Change Password
                                </button>
                            </div>
                        </div>
                    </div>
                </main>
            </div>

            {/* ───── Change Password Modal ───── */}
            {isPasswordModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
                    <div
                        className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-fade-in"
                        onClick={() => setIsPasswordModalOpen(false)}
                    />
                    <div className="bg-white w-full max-w-[500px] rounded-[32px] shadow-2xl relative z-10 overflow-hidden animate-in zoom-in-95 duration-200">
                        {/* Header */}
                        <div className="bg-img-custom bg-[url('../assets/images/bg.jpg')] bg-cover bg-center px-8 py-6 flex items-center justify-between relative overflow-hidden">
                            <div className="absolute inset-0 bg-black/20" /> {/* subtle overlay */}
                            <div className="flex items-center gap-3 relative z-10">
                                <div className="p-2.5 bg-white/20 rounded-xl backdrop-blur-md border border-white/10">
                                    <FiLock className="text-white" size={20} />
                                </div>
                                <h3 className="text-xl font-bold text-white">Change Password</h3>
                            </div>
                            <button
                                onClick={() => setIsPasswordModalOpen(false)}
                                className="p-2 text-white/80 hover:text-white hover:bg-white/20 rounded-lg transition-all relative z-10"
                            >
                                <FiXCircle size={24} />
                            </button>
                        </div>

                        <form onSubmit={handlePasswordUpdate} className="p-8">
                            <div className="flex flex-col gap-6">
                                {/* Current Password */}
                                <div className="flex flex-col gap-2">
                                    <label className="text-[12px] font-bold text-gray-400 uppercase tracking-wider ml-1">Current Password</label>
                                    <div className="relative group">
                                        <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#53C1CC] transition-colors" />
                                        <input
                                            type="password"
                                            required
                                            value={passwordData.currentPassword}
                                            onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                                            placeholder="••••••••"
                                            className="w-full pl-11 pr-4 py-3.5 bg-gray-50/50 border border-gray-200 rounded-2xl text-[14px] outline-none focus:border-[#53C1CC] focus:ring-4 focus:ring-[#53C1CC]/10 transition-all"
                                        />
                                    </div>
                                </div>

                                {/* New Password */}
                                <div className="flex flex-col gap-2">
                                    <label className="text-[12px] font-bold text-gray-400 uppercase tracking-wider ml-1">New Password</label>
                                    <div className="relative group">
                                        <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#53C1CC] transition-colors" />
                                        <input
                                            type="password"
                                            required
                                            value={passwordData.newPassword}
                                            onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                            placeholder="••••••••"
                                            className="w-full pl-11 pr-4 py-3.5 bg-gray-50/50 border border-gray-200 rounded-2xl text-[14px] outline-none focus:border-[#53C1CC] focus:ring-4 focus:ring-[#53C1CC]/10 transition-all"
                                        />
                                    </div>
                                </div>

                                {/* Confirm New Password */}
                                <div className="flex flex-col gap-2">
                                    <label className="text-[12px] font-bold text-gray-400 uppercase tracking-wider ml-1">Confirm New Password</label>
                                    <div className="relative group">
                                        <FiCheckCircle className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#53C1CC] transition-colors" />
                                        <input
                                            type="password"
                                            required
                                            value={passwordData.confirmPassword}
                                            onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                            placeholder="••••••••"
                                            className="w-full pl-11 pr-4 py-3.5 bg-gray-50/50 border border-gray-200 rounded-2xl text-[14px] outline-none focus:border-[#53C1CC] focus:ring-4 focus:ring-[#53C1CC]/10 transition-all"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="mt-10 flex flex-col gap-3">
                                <button
                                    type="submit"
                                    className="w-full py-4 bg-[#53C1CC] text-white rounded-2xl font-bold text-[15px] hover:bg-[#43aab5] transition-all shadow-xl shadow-[#53C1CC]/20 active:scale-[0.98]"
                                >
                                    Save Password
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setIsPasswordModalOpen(false)}
                                    className="w-full py-3 bg-white text-gray-500 font-bold text-[14px] hover:text-gray-700 transition-all"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <Footer />
        </div>
    );
};

export default Profile;
