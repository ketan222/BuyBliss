import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";  // Import axios for API calls
import "./OrderPlacedPage.css";

function OrderPlacedPage() {
  const orderDetails = localStorage.getItem("orderDetails");

  // Check if the value in localStorage is a valid JSON string, and only parse it if necessary
  let parsedOrderDetails = null;
  try {
    parsedOrderDetails = orderDetails ? JSON.parse(orderDetails) : null;
  } catch (error) {
    console.error("Failed to parse order details from localStorage", error);
  }

  const navigate = useNavigate();

  if (!parsedOrderDetails) {
    return <p>No order details found or failed to parse order details.</p>;
  }

  useEffect(() => {
    const clearCartBackend = async () => {
      const token = localStorage.getItem("authToken");
      if (!token) {
        console.error("No token found in localStorage");
        return;
      }
  
      try {
        const response = await axios.delete("http://localhost:5000/api/v1/clear-cart", {
          headers: { Authorization: `Bearer ${token}` },
        });
  
        if (response.status === 200) {
          console.log("Cart cleared successfully in backend.");
        } else {
          console.error("Failed to clear the cart in backend.");
        }
      } catch (error) {
        console.error("Error clearing cart in backend:", error);
      }
    };
  
    clearCartBackend();
  }, []);
  

  const handleBackToHome = () => {
    navigate("/");
    window.location.reload();  // Reload the page to reset any other state
  };

  // Calculate the total dynamically based on the items
  const total = parsedOrderDetails.items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  // Accessing individual parts of the address
  const {
    fullName,
    mobileNumber,
    pinCode,
    flat,
    area,
    landmark,
    city,
    state,
    deliveryInstructions,
  } = parsedOrderDetails.address;

  return (
    <div className="order-placed-container">
      <h2>Order Placed Successfully!</h2>
      <h3>Shipping Address</h3>
      <p>{fullName}</p>
      <p>{mobileNumber}</p>
      <p>
        {flat}, {area}
      </p>
      <p>{landmark}</p>
      <p>
        {city}, {state}, {pinCode}
      </p>
      <p>Delivery Instructions: {deliveryInstructions}</p>
      <p>Total: ₹{total.toFixed(2)}</p> {/* Calculate total dynamically */}
      <button onClick={handleBackToHome}>Back to Home</button>
    </div>
  );
}

export default OrderPlacedPage;
