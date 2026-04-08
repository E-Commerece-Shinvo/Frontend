import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiUser, FiLock, FiArrowLeft, FiEye, FiEyeOff } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);

    // Form state
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        const result = await login(email, password);
        if (result.success) {
            navigate('/');
        } else {
            setError(result.message);
        }
        setLoading(false);
    };

    return (
        <div className="h-screen  bg-[#1c1c1c] text-white flex items-center justify-center 2xl:p-4 overflow-hidden relative font-sans">
            {/* Main Container */}
            <div className="relative w-full max-w-[1820px] h-full min-h-[890px] bg-[#1a1a1a] 2xl:rounded-[20px] shadow-2xl flex border overflow-hidden border-gray-800">

                {/* Back Button */}
                <Link to="/" className="absolute top-8 left-8 text-gray-400 hover:text-white transition-colors z-20">
                    <FiArrowLeft size={24} />
                </Link>

                {/* Left Side - Form */}
                <div className="w-full md:w-[60%] p-12 flex flex-col justify-center relative z-10">
                    <div className="max-w-sm mx-auto w-full">
                        <h2 className="text-4xl font-bold mb-12 text-center tracking-wide">Login</h2>

                        {error && (
                            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-500 text-sm text-center">
                                {error}
                            </div>
                        )}

                        <form className="space-y-6" onSubmit={handleSubmit}>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                                    <FiUser />
                                </div>
                                <input
                                    type="email"
                                    placeholder="Email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
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
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
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
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-black hover:bg-gray-900 border border-gray-700 text-white font-bold py-3 px-4 rounded-lg transition-colors shadow-lg disabled:opacity-50"
                                >
                                    {loading ? 'Logging in...' : 'Login'}
                                </button>
                            </div>
                        </form>

                        <div className="mt-8 text-center text-xs text-gray-400">
                            <p>
                                Don't have an account?{' '}
                                <Link to="/register" className="text-cyan-400 hover:text-cyan-300 font-bold ml-1">
                                    Sign up
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

                {/* Right Side - Visual Overlay */}
                {/* This creates the rotated gradient shape */}
                <div className="absolute top-[-100px] right-[-500px] lg:top-[-400px] xl:right-[-600px] w-[950px] h-[650px] lg:h-[1000px] xl:h-[1200px] xl:w-[1200px] bg-linear-to-tr from-[#000000]/40 to-[#02D5E0] rotate-45 rounded-[40px] shadow-[0_0_100px_rgba(0,255,255,0.3)] z-0 hidden md:block">
                    <div className="absolute bottom-[25%] left-[20%] transform -rotate-45 text-white text-left">
                        <h1 className="text-5xl font-bold leading-tight lg:mr-[200px]">
                            WELCOME <br /> BACK !
                        </h1>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
