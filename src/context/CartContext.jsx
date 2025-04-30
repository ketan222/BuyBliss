import { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { cartService } from "../services/cartService";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { isAuthenticated, user } = useAuth();

  // Fetch cart from local storage or API
  useEffect(() => {
    const loadCart = async () => {
      try {
        let savedCart = [];

        if (isAuthenticated) {
          // Fetch from API if authenticated
          setLoading(true);
          savedCart = await cartService.getCart();
          setLoading(false);
        } else {
          // Get from localStorage if not authenticated
          const localCart = localStorage.getItem("cart");
          savedCart = localCart ? JSON.parse(localCart) : [];
        }

        setCartItems(savedCart);
      } catch (err) {
        setError("Failed to load cart");
        console.error(err);
        setLoading(false);
      }
    };

    loadCart();
  }, [isAuthenticated, user?.id]);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (!isAuthenticated) {
      localStorage.setItem("cart", JSON.stringify(cartItems));
    }
  }, [cartItems, isAuthenticated]);

  // Add item to cart
  const addToCart = async (product, quantity = 1) => {
    try {
      const existingItemIndex = cartItems.findIndex(
        (item) => item.product._id === product._id
      );

      if (existingItemIndex !== -1) {
        // Item already in cart, update quantity
        const updatedCart = [...cartItems];
        updatedCart[existingItemIndex] = {
          ...updatedCart[existingItemIndex],
          quantity: updatedCart[existingItemIndex].quantity + quantity,
        };

        if (isAuthenticated) {
          await cartService.updateCartItem(
            product._id,
            updatedCart[existingItemIndex].quantity
          );
        }

        setCartItems(updatedCart);
      } else {
        // New item, add to cart
        const newItem = { product, quantity };

        if (isAuthenticated) {
          await cartService.addToCart(product._id, quantity);
        }

        setCartItems((prevItems) => [...prevItems, newItem]);
      }
    } catch (err) {
      setError("Failed to add item to cart");
      console.error(err);
    }
  };

  // Update cart item quantity
  const updateQuantity = async (productId, quantity) => {
    try {
      if (quantity <= 0) {
        return removeFromCart(productId);
      }

      const updatedCart = cartItems.map((item) =>
        item.product._id === productId ? { ...item, quantity } : item
      );

      if (isAuthenticated) {
        await cartService.updateCartItem(productId, quantity);
      }

      setCartItems(updatedCart);
    } catch (err) {
      setError("Failed to update cart");
      console.error(err);
    }
  };

  // Remove item from cart
  const removeFromCart = async (productId) => {
    try {
      const updatedCart = cartItems.filter(
        (item) => item.product._id !== productId
      );

      if (isAuthenticated) {
        await cartService.removeFromCart(productId);
      }

      setCartItems(updatedCart);
    } catch (err) {
      setError("Failed to remove item from cart");
      console.error(err);
    }
  };

  // Clear cart
  const clearCart = async () => {
    try {
      if (isAuthenticated) {
        await cartService.clearCart();
      }

      setCartItems([]);
    } catch (err) {
      setError("Failed to clear cart");
      console.error(err);
    }
  };

  // Calculate cart totals
  const getCartTotal = () => {
    return cartItems.reduce((total, item) => {
      const price =
        (item.product.discountPrice || item.product.price) * item.quantity;
      return total + price;
    }, 0);
  };

  const itemCount = cartItems.reduce((count, item) => count + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        loading,
        error,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        getCartTotal,
        itemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
