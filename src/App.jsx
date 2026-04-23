import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/layout/Navbar/Navbar';
import Home from './pages/user/Home';
import About from './pages/user/About';
import ProductPage from './pages/user/ProductPage';
import Login from './pages/user/Login';
import Register from './pages/user/Register';
import NotFound from "./pages/NotFound";
import CategoryPage from './pages/user/CategoryPage';
import ProductDetails from './pages/user/ProductDetails';
import Checkout from './pages/user/Checkout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AdminAddProduct from './pages/admin/AdminAddProduct';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import CartDrawer from './components/ui/Cart/CartDrawer';

function App() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  const hideNavbar = location.pathname === '/login' || location.pathname === '/register' || isAdminRoute;

  return (
    <AuthProvider>
      <CartProvider>
        <div className="font-outfit text-black bg-white min-h-screen overflow-x-hidden w-full relative">
          {!hideNavbar && <Navbar />}
          {!isAdminRoute && <CartDrawer />}
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/shop" element={<ProductPage />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/category/:id" element={<CategoryPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/checkout" element={<Checkout />} />

            {/* Admin Routes */}
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/products" element={<AdminProducts />} />
            <Route path="/admin/products/add" element={<AdminAddProduct />} />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
