import React, { createContext, useState, useContext, useEffect } from 'react';
import { loginUser, registerUser as apiRegisterUser, getUserProfile } from '../api/auth';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [loading, setLoading] = useState(true);

    // Initial check for logged in user
    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const data = await getUserProfile();
                    setUser(data);
                    setIsLoggedIn(true);
                } catch (error) {
                    // Token invalid or expired
                    console.error("Auth check failed:", error);
                    localStorage.removeItem('token');
                    setUser(null);
                    setIsLoggedIn(false);
                }
            }
            setLoading(false);
        };
        checkAuth();
    }, []);

    const login = async (email, password) => {
        try {
            const data = await loginUser({ email, password });
            localStorage.setItem('token', data.token);
            setUser({
                _id: data._id,
                username: data.username,
                email: data.email,
                role: data.role,
            });
            setIsLoggedIn(true);
            return { success: true };
        } catch (error) {
            console.error("Login Error:", error.response?.data?.message || error.message);
            return { success: false, message: error.response?.data?.message || 'Login failed' };
        }
    };

    const registerUser = async (username, email, password) => {
        try {
            const data = await apiRegisterUser({ username, email, password });
            localStorage.setItem('token', data.token);
            setUser({
                _id: data._id,
                username: data.username,
                email: data.email,
                role: data.role,
            });
            setIsLoggedIn(true);
            return { success: true };
        } catch (error) {
            console.error("Register Error:", error.response?.data?.message || error.message);
            return { success: false, message: error.response?.data?.message || 'Registration failed' };
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
        setIsLoggedIn(false);
    };

    return (
        <AuthContext.Provider value={{ user, isLoggedIn, loading, login, register: registerUser, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
