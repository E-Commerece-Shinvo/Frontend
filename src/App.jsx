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
import CustomerSupport from './pages/user/CustomerSupport';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AdminAddProduct from './pages/admin/AdminAddProduct';
import AdminProfile from './pages/admin/AdminProfile';
import AdminCustomers from './pages/admin/AdminCustomers';
import AdminCustomerDetails from './pages/admin/AdminCustomerDetails';
import AdminOrders from './pages/admin/AdminOrders';
import AdminOrderDetails from './pages/admin/AdminOrderDetails';
import AdminInventory from './pages/admin/AdminInventory';
import AdminSupport from './pages/admin/AdminSupport';
import AdminCategories from './pages/admin/AdminCategories';
import AdminSales from './pages/admin/AdminSales';
import AdminShipping from './pages/admin/AdminShipping';
import AdminLayout from './components/admin/AdminLayout';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import CartDrawer from './components/ui/Cart/CartDrawer';
import AdminRoute from './components/layout/AdminRoute';
import UserRoute from './components/layout/UserRoute';
import PublicRoute from './components/layout/PublicRoute';
import { Toaster } from 'react-hot-toast';

function App() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  const hideNavbar = location.pathname === '/login' || location.pathname === '/register' || location.pathname === '/my-orders' || location.pathname === '/my-returns' || location.pathname === '/profile' || location.pathname === '/support' || isAdminRoute;

  return (
    <AuthProvider>
      <CartProvider>
        <div className="font-outfit text-black bg-white min-h-screen overflow-x-hidden w-full relative">
          <Toaster position="top-right" reverseOrder={false} />
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
              <Route path="/support" element={<CustomerSupport />} />
            </Route>

            {/* Admin Protected Routes */}
            <Route element={<AdminRoute />}>
              <Route element={<AdminLayout />}>
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                <Route path="/admin/products" element={<AdminProducts />} />
                <Route path="/admin/products/add" element={<AdminAddProduct />} />
                <Route path="/admin/customers" element={<AdminCustomers />} />
                <Route path="/admin/customers/:id" element={<AdminCustomerDetails />} />
                <Route path="/admin/orders" element={<AdminOrders />} />
                <Route path="/admin/orders/:id" element={<AdminOrderDetails />} />
                <Route path="/admin/inventory" element={<AdminInventory />} />
                <Route path="/admin/categories" element={<AdminCategories />} />
                <Route path="/admin/sales" element={<AdminSales />} />
                <Route path="/admin/shipping" element={<AdminShipping />} />
                <Route path="/admin/support" element={<AdminSupport />} />
                <Route path="/admin/profile" element={<AdminProfile />} />
              </Route>
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
