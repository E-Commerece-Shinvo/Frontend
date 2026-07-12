import axios from 'axios';

const api = axios.create({
    // baseURL: "https://shinvo.duckdns.org/api",
    baseURL: 'https://3bf1-2400-adc7-2918-d000-2094-2fdd-d2bd-ff60.ngrok-free.app/api',
    headers: {
        'Content-Type': 'application/json'
    }
});

// Request interceptor to attach token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor to handle token expiration/401s
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            // We could optionally redirect to login here: window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default api;
