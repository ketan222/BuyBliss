import { useState, useEffect } from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

import Home from "./Pages/Home";
import About from "./Pages/About";
import Blog from "./Pages/Blog";
import Contact from "./Pages/Contact";
import Shop from "./Pages/Shop";
import Services from "./Pages/Services";
import Navbar from "./Components/Navbar";
import Signup from "./Pages/Signup";
import Login from "./Pages/Login";
import CartPage from "./Pages/Cart";
import AddressPage from "./Pages/AddressPage";
import OrderPlacedPage from "./Pages/OrderPlacedPage";
import OtpVerification from "./Pages/OtpVerification";

function ProtectedRoute({ isLoggesIn, children }) {
  return isLoggesIn ? children : <Navigate to="/login" replace />;
}

function RedirectLoggedIn({ isLoggesIn, children }) {
  return isLoggesIn ? <Navigate to="/" replace /> : children;
}

function App() {
  const [isLoggesIn, setIsloggesIn] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [hasLoggedIn, setHasLoggedIn] = useState(false);

  // Check authentication status on page load
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios
        .get("http://localhost:5000/api/v1/validate-token", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then(() => {
          setIsloggesIn(true);
          setHasLoggedIn(true);
          // Fetch cart from backend after authentication
          fetchCart();
        })
        .catch(() => {
          localStorage.removeItem("token");
          setIsloggesIn(false);
          setHasLoggedIn(false);
          toast.error("Session expired. Please log in again.");
        })
        .finally(() => setAuthChecked(true));
    } else {
      setIsloggesIn(false);
      setHasLoggedIn(false);
      setAuthChecked(true);
    }
  }, []);

  // Fetch cart from the backend
  const fetchCart = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/v1/get-cart", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setCartItems(response.data.items || []);
    } catch (error) {
      console.error("Failed to fetch cart", error);
    }
  };

  // // Add item to the cart
  const addToCart = async (product) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/v1/add-to-cart",
        { productId: product.id, quantity: 1 , price :product.price , img:product.image },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      setCartItems(response.data.items);
    } catch (error) {
      toast.error("Failed to add item to cart");
      console.error(error);
    }
  };

  // Update cart item quantity
  const updateCartQuantity = async (productId, quantity) => {
    if (quantity === 0) {
      // Call the remove function if quantity becomes 0
      await removeFromCart(productId);
      return;
    }
    try {
      const response = await axios.post(
        "http://localhost:5000/api/v1/update-cart",
        { productId, quantity },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      setCartItems(response.data.items);
    } catch (error) {
      toast.error("Failed to update cart");
      console.error(error);
    }
  };

  // Remove item from the cart
  const removeFromCart = async (productId) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/v1/remove-from-cart",
        { productId },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      setCartItems(response.data.items);
    } catch (error) {
      toast.error("Failed to remove item from cart");
      console.error(error);
    }
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsloggesIn(false);
    setHasLoggedIn(false);
    setCartItems([]);
  };

  const location = useLocation();

  if (!authChecked) return <div>Loading...</div>;

  return (
    <>
      {location.pathname !== "/otp-verification" && (
        <Navbar isLoggesIn={isLoggesIn} setIsloggesIn={setIsloggesIn} handleLogout={handleLogout} />
      )}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/services" element={<Services />} />
        <Route
          path="/shop"
          element={<Shop addToCart={addToCart} cartItems={cartItems} setCartItems={setCartItems}/>}
        />
        <Route
          path="/cart"
          element={
            <ProtectedRoute isLoggesIn={isLoggesIn && hasLoggedIn}>
              <CartPage/>
            </ProtectedRoute>
          }
        />
        <Route path="/address" element={<AddressPage />} />
        <Route path="/order-placed" element={<OrderPlacedPage />} />
        <Route
          path="/signup"
          element={
            <RedirectLoggedIn isLoggesIn={isLoggesIn}>
              <Signup setIsloggesIn={setIsloggesIn} />
            </RedirectLoggedIn>
          }
        />
        <Route
          path="/login"
          element={
            <RedirectLoggedIn isLoggesIn={isLoggesIn}>
              <Login
                setIsloggesIn={setIsloggesIn}
                onLoginSuccess={() => setHasLoggedIn(true)}
              />
            </RedirectLoggedIn>
          }
        />
        <Route path="/otp-verification" element={<OtpVerification setIsloggesIn={setIsloggesIn} />} />
      </Routes>
      <ToastContainer />
    </>
  );
}

export default App;
