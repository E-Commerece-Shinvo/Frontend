import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiUser, FiLock, FiMail, FiArrowLeft, FiEye, FiEyeOff } from 'react-icons/fi';

const Register = () => {
    const [showPassword, setShowPassword] = useState(false);
    return (
        <div className="h-screen bg-[#1c1c1c] text-white flex items-center justify-center 2xl:p-4 overflow-hidden relative font-sans">

            {/* Main Container */}
            <div className="relative w-full max-w-[1820px] h-full min-h-[890px] bg-[#1a1a1a] 2xl:rounded-[20px] shadow-2xl flex border overflow-hidden border-gray-800">

                {/* Back Button */}
                <Link to="/" className="absolute top-8 left-8 text-gray-400 hover:text-white transition-colors z-20">
                    <FiArrowLeft size={24} />
                </Link>

                {/* Left Side - Visual Overlay (Gradient on Left) */}
                <div className="absolute top-[-200px] left-[-600px] lg:top-[-400px] xl:left-[-600px] w-[950px] h-[850px] lg:h-[1000px] xl:h-[1200px] xl:w-[1200px] bg-gradient-to-tr from-[#02D5E0] to-[#00000]/40 rotate-45 rounded-[40px] shadow-[0_0_100px_rgba(0,255,255,0.3)] z-0 hidden md:block">
                    <div className="absolute top-[25%] right-[10%] transform -rotate-45 text-white text-right">
                        <h1 className="text-5xl font-bold ">
                            WELCOME
                        </h1>
                    </div>
                </div>

                {/* Right Side - Form */}
                <div className="w-full absolute md:top-[150px] lg:top-0 xl:top-[100px] 2xl:top-0 md:w-[60%] ml-auto p-12 flex flex-col justify-center relative z-10">
                    <div className="max-w-sm mx-auto w-full">
                        <h2 className="text-4xl font-bold mb-12 text-center tracking-wide">Register</h2>

                        <form className="space-y-6">
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                                    <FiUser />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Username"
                                    className="w-full bg-transparent border border-gray-600 text-white text-sm rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:border-cyan-400 transition-colors placeholder-gray-500"
                                />
                            </div>

                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                                    <FiMail />
                                </div>
                                <input
                                    type="email"
                                    placeholder="Email"
                                    className="w-full bg-transparent border border-gray-600 text-white text-sm rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:border-cyan-400 transition-colors placeholder-gray-500"
                                />
                            </div>

                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                                    <FiLock />
                                </div>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Password"
                                    className="w-full bg-transparent border border-gray-600 text-white text-sm rounded-lg pl-10 pr-10 py-3 focus:outline-none focus:border-cyan-400 transition-colors placeholder-gray-500"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-white focus:outline-none"
                                >
                                    {showPassword ? <FiEyeOff /> : <FiEye />}
                                </button>
                            </div>

                            <div className="pt-4">
                                <button type="submit" className="w-full bg-black hover:bg-gray-900 border border-gray-700 text-white font-bold py-3 px-4 rounded-lg transition-colors shadow-lg">
                                    Register
                                </button>
                            </div>
                        </form>

                        <div className="mt-8 text-center text-xs text-gray-400">
                            <p>
                                Already have an account?{' '}
                                <Link to="/login" className="text-cyan-400 hover:text-cyan-300 font-bold ml-1">
                                    Sign in
                                </Link>
                            </p>

                            <div className="mt-8 flex justify-center gap-4 text-[10px] text-gray-600 uppercase tracking-widest">
                                <span>Privacy Policy</span>
                                <span>|</span>
                                <span>Terms & Conditions</span>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Register;
