import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AnimatePresence } from "framer-motion";

/* ===== Layout ===== */
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

/* ===== Public Pages ===== */
import Home from "./pages/Home";
import ProductList from "./pages/ProductList";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Wishlist from "./pages/Wishlist";
import Register from "./pages/Register";
import WomenCollection from "./pages/WomenCollection";
import MenCollection from "./pages/MenCollection";
import About from "./pages/about";

/* ===== User Pages ===== */
import Orders from "./pages/Order";
import OrderSuccess from "./pages/OrderSuccess";
import Checkout from "./pages/Checkout";

/* ===== Admin Pages ===== */
import AdminLogin from "./Admin/pages/AdminLogin";
import AdminLayout from "./Admin/layout/AdminLayout";
import Products from "./Admin/pages/Products";
import AdminDashboard from "./Admin/pages/AdminDashboard";
import AddProduct from "./Admin/pages/AddProduct";
import EditProduct from "./Admin/pages/EditProduct";
import Users from "./Admin/pages/Users";
import AdminOrders from "./Admin/pages/AdminOrders";

/* ===== Route Protection ===== */
import UserProtectedRoute from "./components/UserProtectedRoute";
import AdminPrivateRoute from "./routes/AdminPrivateRoute";

/* ===== Context ===== */
import { AuthProvider } from "./context/AuthContext";

function App() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <AuthProvider>
      <ToastContainer position="top-right" autoClose={3000} />

      {!isAdminRoute && <Navbar />}

      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          {/* ================= PUBLIC ROUTES ================= */}
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<ProductList />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/register" element={<Register />} />

          {/* Men / Women Collection */}
          <Route path="/mens-collection" element={<MenCollection />} /> 
          <Route path="/women-collection" element={<WomenCollection />} /> 

          {/* Redirect old /womens-collection URL */}
          <Route path="/womens-collection" element={<Navigate to="/women-collection" replace />} />

          <Route path="/about" element={<About />} />

          {/* ================= USER PROTECTED ROUTES ================= */}
          <Route
            path="/checkout"
            element={
              <UserProtectedRoute>
                <Checkout />
              </UserProtectedRoute>
            }
          />
          <Route
            path="/orders"
            element={
              <UserProtectedRoute>
                <Orders />
              </UserProtectedRoute>
            }
          />
          <Route
            path="/order-success"
            element={
              <UserProtectedRoute>
                <OrderSuccess />
              </UserProtectedRoute>
            }
          />

          {/* ================= ADMIN ROUTES ================= */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            path="/admin"
            element={
              <AdminPrivateRoute>
                <AdminLayout />
              </AdminPrivateRoute>
            }
          >
            {/* Use relative paths for nested admin routes */}
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="products" element={<Products />} />
            <Route path="add-product" element={<AddProduct />} />
            <Route path="edit-product/:id" element={<EditProduct />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="users" element={<Users />} />
          </Route>
        </Routes>
      </AnimatePresence>

      {!isAdminRoute && <Footer />}
    </AuthProvider>
  );
}

export default App;