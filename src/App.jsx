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
import MyOrders from './pages/user/MyOrders';
import MyReturns from './pages/user/MyReturns';
import Profile from './pages/user/Profile';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AdminAddProduct from './pages/admin/AdminAddProduct';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import CartDrawer from './components/ui/Cart/CartDrawer';
import AdminRoute from './components/layout/AdminRoute';
import UserRoute from './components/layout/UserRoute';
import PublicRoute from './components/layout/PublicRoute';

function App() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  const hideNavbar = location.pathname === '/login' || location.pathname === '/register' || location.pathname === '/my-orders' || location.pathname === '/my-returns' || location.pathname === '/profile' || isAdminRoute;

  return (
    <AuthProvider>
      <CartProvider>
        <div className="font-outfit text-black bg-white min-h-screen overflow-x-hidden w-full relative">
          {!hideNavbar && <Navbar />}
          {!isAdminRoute && <CartDrawer />}
          <Routes>
            {/* Public Access Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/shop" element={<ProductPage />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/category/:id" element={<CategoryPage />} />

            {/* Auth Routes - Only for non-logged-in users */}
            <Route element={<PublicRoute />}>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
            </Route>

            {/* User Protected Routes */}
            <Route element={<UserRoute />}>
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/my-orders" element={<MyOrders />} />
              <Route path="/my-returns" element={<MyReturns />} />
              <Route path="/profile" element={<Profile />} />
            </Route>

            {/* Admin Protected Routes */}
            <Route element={<AdminRoute />}>
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/products" element={<AdminProducts />} />
              <Route path="/admin/products/add" element={<AdminAddProduct />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
