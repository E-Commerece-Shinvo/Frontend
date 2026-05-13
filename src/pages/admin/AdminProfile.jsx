import React, { useState, useRef } from 'react';
import { FiUser, FiMail, FiLock, FiSave, FiCamera, FiPhone, FiMapPin } from 'react-icons/fi';
import toast from 'react-hot-toast';

const AdminProfile = () => {
    const fileInputRef = useRef(null);
    const [profile, setProfile] = useState({
        username: 'Admin Name',
        email: 'admin@shinvo.com',
        phone: '+92 300 1234567',
        address: '123 Main Street, Lahore, Pakistan',
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200'
    });

    const [isSaving, setIsSaving] = useState(false);

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfile({ ...profile, avatar: reader.result });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSaving(true);
        // Simulate API call
        setTimeout(() => {
            toast.success('Profile updated successfully!');
            setIsSaving(false);
        }, 1500);
    };

    return (
        <div className="p-8 max-w-5xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
                <p className="text-gray-500 mt-2">Manage your account settings, contact details and security</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Side - Profile Info */}
                <div className="lg:col-span-1">
                    <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm flex flex-col items-center text-center sticky top-24">
                        <div className="relative group">
                            <div className="w-40 h-40 rounded-full p-1 border-2 border-cyan-500/20">
                                <img
                                    src={profile.avatar}
                                    alt="Admin Avatar"
                                    className="w-full h-full rounded-full object-cover border-4 border-white shadow-lg"
                                />
                            </div>
                            <button 
                                onClick={() => fileInputRef.current.click()}
                                className="absolute bottom-2 right-2 p-3 bg-black text-white rounded-full shadow-xl hover:bg-gray-800 transition-all transform hover:scale-110"
                            >
                                <FiCamera size={18} />
                            </button>
                            <input 
                                type="file" 
                                ref={fileInputRef} 
                                onChange={handleAvatarChange} 
                                className="hidden" 
                                accept="image/*"
                            />
                        </div>
                        <h2 className="mt-6 text-2xl font-bold text-gray-900">{profile.username}</h2>
                        <p className="text-sm text-gray-400 font-medium mb-4">{profile.email}</p>
                        <div className="px-4 py-1.5 bg-cyan-50 text-cyan-600 text-[10px] font-black rounded-full uppercase tracking-widest border border-cyan-100">
                            Super Administrator
                        </div>

                        <div className="mt-8 pt-8 border-t border-gray-50 w-full grid grid-cols-1 gap-4">
                            <div className="flex items-center gap-3 text-left">
                                <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400">
                                    <FiPhone size={14} />
                                </div>
                                <div>
                                    <p className="text-[10px] text-gray-400 font-bold uppercase">Phone</p>
                                    <p className="text-xs font-bold text-gray-700">{profile.phone}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 text-left">
                                <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400">
                                    <FiMapPin size={14} />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-[10px] text-gray-400 font-bold uppercase">Address</p>
                                    <p className="text-xs font-bold text-gray-700 truncate">{profile.address}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side - Form */}
                <div className="lg:col-span-2">
                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* Personal Details */}
                        <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm">
                            <h3 className="text-lg font-bold text-gray-900 mb-8 flex items-center gap-3">
                                <span className="w-2 h-6 bg-cyan-500 rounded-full"></span>
                                Personal Details
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest px-1">Full Name</label>
                                    <div className="relative group">
                                        <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-cyan-500 transition-colors" />
                                        <input
                                            type="text"
                                            value={profile.username}
                                            onChange={(e) => setProfile({...profile, username: e.target.value})}
                                            className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:border-cyan-500 focus:bg-white focus:ring-4 focus:ring-cyan-500/5 transition-all text-sm font-medium"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest px-1">Email Address</label>
                                    <div className="relative group">
                                        <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-cyan-500 transition-colors" />
                                        <input
                                            type="email"
                                            value={profile.email}
                                            onChange={(e) => setProfile({...profile, email: e.target.value})}
                                            className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:border-cyan-500 focus:bg-white focus:ring-4 focus:ring-cyan-500/5 transition-all text-sm font-medium"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest px-1">Phone Number</label>
                                    <div className="relative group">
                                        <FiPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-cyan-500 transition-colors" />
                                        <input
                                            type="text"
                                            value={profile.phone}
                                            onChange={(e) => setProfile({...profile, phone: e.target.value})}
                                            placeholder="+92 300 1234567"
                                            className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:border-cyan-500 focus:bg-white focus:ring-4 focus:ring-cyan-500/5 transition-all text-sm font-medium"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2 md:col-span-2">
                                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest px-1">Permanent Address</label>
                                    <div className="relative group">
                                        <FiMapPin className="absolute left-4 top-4 text-gray-400 group-focus-within:text-cyan-500 transition-colors" />
                                        <textarea
                                            rows="3"
                                            value={profile.address}
                                            onChange={(e) => setProfile({...profile, address: e.target.value})}
                                            placeholder="Enter your full permanent address"
                                            className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:border-cyan-500 focus:bg-white focus:ring-4 focus:ring-cyan-500/5 transition-all text-sm font-medium resize-none"
                                        ></textarea>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Security */}
                        <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm">
                            <h3 className="text-lg font-bold text-gray-900 mb-8 flex items-center gap-3">
                                <span className="w-2 h-6 bg-red-500 rounded-full"></span>
                                Account Security
                            </h3>
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest px-1">Current Password</label>
                                    <div className="relative group">
                                        <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-cyan-500 transition-colors" />
                                        <input
                                            type="password"
                                            placeholder="Enter current password"
                                            className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:border-cyan-500 focus:bg-white focus:ring-4 focus:ring-cyan-500/5 transition-all text-sm font-medium"
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest px-1">New Password</label>
                                        <div className="relative group">
                                            <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-cyan-500 transition-colors" />
                                            <input
                                                type="password"
                                                placeholder="New password"
                                                className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:border-cyan-500 focus:bg-white focus:ring-4 focus:ring-cyan-500/5 transition-all text-sm font-medium"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest px-1">Confirm Password</label>
                                        <div className="relative group">
                                            <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-cyan-500 transition-colors" />
                                            <input
                                                type="password"
                                                placeholder="Confirm new password"
                                                className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:border-cyan-500 focus:bg-white focus:ring-4 focus:ring-cyan-500/5 transition-all text-sm font-medium"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end pt-4">
                            <button
                                type="submit"
                                disabled={isSaving}
                                className="flex items-center gap-3 bg-gradient-to-r from-[#001B1B] to-[#006060] text-white px-12 py-4 rounded-2xl font-bold hover:from-[#002B2B] hover:to-[#008080] transition-all shadow-xl shadow-black/20 disabled:opacity-50 transform hover:-translate-y-1 active:scale-95"
                            >
                                <FiSave className="text-xl" />
                                {isSaving ? 'Updating Profile...' : 'Save All Changes'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AdminProfile;
