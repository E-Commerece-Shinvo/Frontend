import React, { useState } from 'react';
import { FiSearch, FiBell, FiMessageSquare, FiMenu } from 'react-icons/fi';
import AdminSidebar from './AdminSidebar';

const AdminLayout = ({ children }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="flex h-screen bg-gray-50 overflow-hidden font-outfit w-full">
            <AdminSidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto overflow-x-hidden bg-gray-50/50 w-full relative">
                <header className="bg-white/80 backdrop-blur-md sticky top-0 z-30 border-b border-gray-100 flex items-center justify-between p-4 md:p-8 transition-all w-full">
                    <div className="flex items-center gap-2 md:gap-4 flex-1 min-w-0">
                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                setIsSidebarOpen(true);
                            }}
                            className="lg:hidden p-2 hover:bg-gray-100 rounded-xl transition-colors flex-shrink-0 relative z-50 cursor-pointer"
                        >
                            <FiMenu className="text-xl text-gray-700 pointer-events-none" />
                        </button>
                        <div className="relative flex-1 min-w-0 max-w-[600px] lg:ml-4">
                            <div className="flex items-center bg-white rounded-xl border border-gray-200 px-3 md:px-4 py-2 md:py-2.5 shadow-[0px_1px_3px_rgba(0,0,0,0.05)] w-full hover:border-gray-300 focus-within:border-gray-400 focus-within:ring-2 focus-within:ring-cyan-500/10 transition-all">
                                <input
                                    type="text"
                                    placeholder="Search"
                                    className="w-full min-w-0 bg-transparent border-none outline-none text-sm text-gray-700 placeholder-gray-500 font-medium"
                                />
                                <FiSearch className="text-gray-500 text-lg ml-2 shrink-0 cursor-pointer hover:text-cyan-500 transition-colors" />
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 md:gap-6 ml-2 md:ml-4 shrink-0">
                        <div className="hidden sm:flex items-center gap-4">
                            <button className="p-3 text-gray-400 hover:text-cyan-400 hover:bg-cyan-50 rounded-2xl transition-all relative">
                                <FiBell className="text-xl" />
                                <span className="absolute top-3 right-3 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                            </button>
                            <button className="p-3 text-gray-400 hover:text-cyan-400 hover:bg-cyan-50 rounded-2xl transition-all">
                                <FiMessageSquare className="text-xl" />
                            </button>
                        </div>
                        <div className="flex items-center gap-3 pl-2 sm:pl-6 border-l border-gray-100">
                            <div className="text-right hidden lg:block">
                                <p className="text-sm font-bold text-gray-900 leading-none mb-1 uppercase tracking-tight">Shinvo Admin</p>
                                <p className="text-[10px] text-teal-500 font-bold uppercase tracking-widest leading-none">Super Admin</p>
                            </div>
                            <div className="w-10 h-10 md:w-12 md:h-12 bg-gray-100 rounded-2xl overflow-hidden cursor-pointer ring-2 ring-transparent hover:ring-cyan-400 transition-all">
                                <img
                                    src="https://ui-avatars.com/api/?name=Shinvo+Admin&background=008080&color=fff"
                                    alt="Admin"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </div>
                    </div>
                </header>

                <div className="p-4 md:p-12 w-full overflow-x-hidden">
                    <div className="max-w-[1600px] mx-auto w-full">
                        {children}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;
