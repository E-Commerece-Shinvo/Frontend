import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiUser, FiLock, FiArrowLeft, FiEye, FiEyeOff } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const Login = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [showBlockedModal, setShowBlockedModal] = useState(false);

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
            toast.success('Login successful!');
            if (result.role === 'admin') {
                navigate('/admin/dashboard', { replace: true });
            } else {
                navigate('/', { replace: true });
            }
        } else {
            if (result.isBlocked) {
                setShowBlockedModal(true);
            } else {
                toast.error(result.message || 'Login failed');
                setError(result.message);
            }
        }
        setLoading(false);
    };

    return (
        <div className="h-screen  bg-[#1c1c1c] text-white flex items-center justify-center 2xl:p-4 overflow-hidden relative font-sans">
            {/* Blocked Modal */}
            {showBlockedModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setShowBlockedModal(false)}></div>
                    <div className="relative bg-[#1a1a1a] border border-red-500/30 w-full max-w-md rounded-[32px] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
                        <div className="h-2 bg-red-500"></div>
                        <div className="p-8 text-center">
                            <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                                <FiLock className="text-red-500" size={40} />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-4 uppercase tracking-wider">Account Blocked</h3>
                            <p className="text-gray-400 mb-8 leading-relaxed font-medium">
                                Apka account block kr dia gya hai. Meharbani kr k customer support sy rabta krein dobara login krny k lye.
                            </p>
                            <button 
                                onClick={() => setShowBlockedModal(false)}
                                className="w-full bg-red-500 hover:bg-red-600 text-white font-black py-4 rounded-2xl transition-all shadow-lg shadow-red-500/20 uppercase tracking-widest text-sm"
                            >
                                Samjh gya
                            </button>
                        </div>
                    </div>
                </div>
            )}

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
