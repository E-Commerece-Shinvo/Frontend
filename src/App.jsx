import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/layout/Navbar/Navbar';
import Home from './pages/user/Home';
import About from './pages/user/About';
import ProductPage from './pages/user/ProductPage';
import Login from './pages/user/Login';
import Register from './pages/user/Register';
import NotFound from "./pages/NotFound";
import ProductDetails from './pages/user/ProductDetails';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import CartDrawer from './components/ui/Cart/CartDrawer';


function App() {
  const location = useLocation();
  const hideNavbar = location.pathname === '/login' || location.pathname === '/register';

  return (
    <AuthProvider>
      <CartProvider>
        <div className="font-outfit">
          {!hideNavbar && <Navbar />}
          <CartDrawer />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/shop" element={<ProductPage />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
