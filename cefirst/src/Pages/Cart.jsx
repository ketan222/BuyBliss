import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Cart.css";

function CartPage() {
  const [cartItems, setCartItems] = useState([]);
  const [pinCode, setPinCode] = useState("");
  const [total, setTotal] = useState(0);
  const [deliveryMessage, setDeliveryMessage] = useState("");
  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [hasAddress, setHasAddress] = useState(false);
  const [customization, setCustomization] = useState(""); // State for customization text
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch the cart on initial load
    const fetchCart = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }
        
        const response = await axios.get("http://localhost:5000/api/v1/get-cart", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.data) {
          
          setCartItems(response.data.items); // Update cart items from the response
        }
      } catch (error) {
        console.error("Error fetching cart:", error);
      }
    };

    fetchCart();
  }, [navigate]);

  useEffect(() => {
    // Retrieve address from localStorage
    const savedAddress = localStorage.getItem("userAddress");
    if (savedAddress) {
      setAddress(JSON.parse(savedAddress));
    }
  }, []);

  const calculateTotal = () => {
    if (cartItems.length === 0) {
      setTotal(0);
      return;
    }

    let productTotal = cartItems.reduce((acc, item) => {
      const priceString = (typeof item.price === 'string' ? item.price : item.price.toString()).replace("₹", "").replace(",", "");
      const price = parseFloat(priceString);
      return isNaN(price) ? acc : acc + price * item.quantity;
    }, 0);

    const gst = productTotal * 0.05;
    const totalAmount = productTotal + gst;
    setTotal(totalAmount);
  };

  useEffect(() => {
    calculateTotal();
  }, [cartItems]);

  const handlePinCodeCheck = () => {
    if (pinCode.match(/^\d{6}$/)) {
      setDeliveryMessage("Delivery available at ${pinCode}. Estimated delivery: 3-5 days.");
    } else {
      setDeliveryMessage("Invalid Pin Code. Please enter a valid 6-digit code.");
    }
  };

  const handleAddressButtonClick = () => {
    navigate("/address", { state: { setAddress: "setAddress" } });
  };

  // const handlePlaceOrder = async () => {
  //   // Check if the cart is empty
  //   if (cartItems.length === 0) {
  //     alert("Your cart is empty. Please add items to the cart before placing the order.");
  //     return;
  //   }
  
  //   // Check if address is not set
  //   if (!address) {
  //     alert("Please add an address before placing the order.");
  //     navigate("/address");
  //     return;
  //   }
  
  //   // Check if payment method is selected
  //   if (!paymentMethod) {
  //     alert("Please select a payment method.");
  //     return;
  //   }
  
  //   // Retrieve email from localStorage as the user ID
  //   const email = localStorage.getItem("email");
  //   if (!email) {
  //     alert("You are not logged in. Please log in to place an order.");
  //     navigate("/login");
  //     return;
  //   }
  
  //   // Prepare order details for the API
  //   const orderDetails = {
  //     userId: email,
  //     address: address,
  //     items: cartItems.map((item) => ({
  //       productId: item.productId,
  //       quantity: item.quantity,
  //       price: item.price,
  //       customization: customization,
  //     })),
  //   };
  
  //   localStorage.setItem("orderDetails", JSON.stringify(orderDetails));
  
  //   try {
  //     const response = await axios.post("http://localhost:5000/api/v1/create-order", orderDetails, {
  //       headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  //     });
  
  //     if (response.status === 201) {
  //       alert("Order placed successfully!");
  //       // Remove items from localStorage and clear cartItems state
  //       localStorage.removeItem("cartItems"); // Remove cart items from localStorage
  //       setCartItems([]);
  //       navigate("/order-placed");
  //     } else {
  //       alert(response.data.message || "Failed to place the order. Please try again.");
  //     }
  //   } catch (error) {
  //     console.error("Error placing the order:", error);
  //     alert("An error occurred while placing the order. Please try again.");
  //   }
  // };
  
  const handleRazorpayPayment = async () => {
    if (cartItems.length === 0) {
      alert("Your cart is empty. Please add items to the cart before placing the order.");
      return;
    }
  
    // Check if address is not set
    if (!address) {
      alert("Please add an address before placing the order.");
      navigate("/address");
      return;
    }

    const email = localStorage.getItem("email");
              if (!email) {
                alert("You are not logged in. Please log in to place an order.");
                navigate("/login");
                return;
              }
            
  
    try {
      const { data } = await axios.post(
        "http://localhost:5000/api/v1/create-order-razorpay",
        { amount: total },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );

      const options = {
        key: "rzp_test_zbeQS0DKCjr4Vm",
        amount: data.amount,
        currency: "INR",
        name: "Your Store Name",
        description: "Thank you for shopping with us!",
        order_id: data.orderId,
        handler: async function (response) {
          try {
            const verifyResponse = await axios.post(
              "http://localhost:5000/api/v1/verify-payment",
              response,
              { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
            );

            if (verifyResponse.data.success) {
                        // Retrieve email from localStorage as the user ID
              // Prepare order details for the API
              const orderDetails = {
                userId: email, // Using email as userId
                address: address,
                items: cartItems.map((item) => ({
                  productId: item.productId,
                  quantity: item.quantity,
                  price: item.price,
                })),
                customization:customization
              };
            
              localStorage.setItem("orderDetails", JSON.stringify(orderDetails));
            
              try {
                const response = await axios.post("http://localhost:5000/api/v1/create-order", orderDetails, {
                  headers: { Authorization:`Bearer ${localStorage.getItem("token")}` },
                });
            
                if (response.status === 201) {
                  alert("Payment successful! Your order has been placed.");
                  // Remove items from localStorage and clear cartItems state
                  localStorage.removeItem("cartItems"); // Remove cart items from localStorage
                  for (const item of orderDetails.items) {
                    await removeFromCart(item.productId); // Call removeFromCart for each item
                  }                  navigate("/order-placed");
                } else {
                  alert(response.data.message || "Failed to place the order. Please try again.");
                }
              } catch (error) {
                console.error("Error placing the order:", error);
                alert("An error occurred while placing the order. Please try again.");
              } 
            
            } else {
              alert("Payment verification failed. Please try again.");
            }
          } catch (error) {
            console.error("Error verifying payment:", error);
          }
        },
        prefill: {
          name: "Keshav",
          email: "user@gmail.com",
          contact: "8452145965",
        },
        theme: {
          color: "#F37254",
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (error) {
      console.error("Error initiating Razorpay:", error);
    }
  };

  // Function to update the quantity in the cart
  const updateCartQuantity = async (productId, quantity) => {
    if (quantity === 0) {
      await removeFromCart(productId);
      return;
    }
    try {
      const response = await axios.post(
        "http://localhost:5000/api/v1/update-cart",
        { productId, quantity },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      if (response.data) {
        setCartItems(response.data.items); // Update cart items from the response
      }
    } catch (error) {
      console.error("Error updating cart:", error);
    }
  };

  // Function to remove an item from the cart
  const removeFromCart = async (productId) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/v1/remove-from-cart",
        { productId },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      if (response.data) {
        setCartItems(response.data.items); // Update cart items from the response
      }
    } catch (error) {
      console.error("Error removing item from cart:", error);
    }
  };

  return (
    // console.log("here")
    <div className="cart-container">
      <h2>Your Shopping Cart</h2>
      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div className="cart-items">
          {cartItems.map((item) => (
            <div key={item.productId} className="cart-item">
              <img
                src={`/assets/picc1.jpg`}
                alt={item.name}
                className="cart-item-image"/>
              <div className="cart-item-details">
                <h3>{item.name}</h3>
                <p>Price: ₹{item.price}</p>
                <p>Quantity:{item.quantity}</p>
                <div className="cart-item-actions">
                  <button
                    onClick={() => updateCartQuantity(item.productId, item.quantity + 1)}
                    className="cart-action-btn"
                  >
                    +
                  </button>
                  <button
                    onClick={() => updateCartQuantity(item.productId, item.quantity - 1)}
                    className="cart-action-btn"
                  >
                    -
                  </button>
                  <button
                    onClick={() => removeFromCart(item.productId)}
                    className="cart-action-btn"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delivery Check */}
      <div className="delivery-container">
        <label htmlFor="pinCode">Enter Pin Code for Delivery:</label>
        <input
          type="text"
          id="pinCode"
          value={pinCode}
          onChange={(e) => setPinCode(e.target.value)}
        />
        <button onClick={handlePinCodeCheck} className="pin-check-btn">
          Check
        </button>
        {deliveryMessage && <p className="delivery-message">{deliveryMessage}</p>}
      </div>
      <div className="customization-container">
        <label htmlFor="customization">Customization (if any):</label>
        <textarea
          id="customization"
          value={customization}
          onChange={(e) => setCustomization(e.target.value)}
          placeholder="Enter any customization request here..."
        />
      </div>
      {/* Cart Details */}
      <div className="cart-details">
        <h3>Cart Details</h3>
        <p>Total Items: {cartItems.reduce((acc, item) => acc + item.quantity, 0)}</p>
        <p>Total: ₹{total.toFixed(2)}</p>
      </div>

      {/* Payment Details */}
      <div className="payment-details">
        <h3>Payment Details</h3>
        <p>Product Total (Without Tax): ₹{(total / 1.05).toFixed(2)}</p>
        <p>GST (5%): ₹{(total * 0.05).toFixed(2)}</p>
        <p>Shipping Charge: Free</p>
        <p>Total Amount: ₹{total.toFixed(2)}</p>
        <p>
          Or 3 monthly payments of ₹{(total / 3).toFixed(2)}
        </p>
        <p>UPI & Cards Accepted, Online approval in 2 minutes</p>
      </div>

    
      {/* Address and Order Button */}
      <div className="address-container">
        {/* <button onClick={handleAddressButtonClick} className="add-address-btn">
          Add Address
        </button> */}
        {/* <button onClick={handleRazorpayPayment} className="place-order-btn">
          Pay with Razor Pay
        </button> */}
      </div>
    </div>
  );
}

export default CartPage;