import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaLock, FaCreditCard, FaTruck } from "react-icons/fa";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { orderService } from "../services/orderService";
import { paymentService } from "../services/paymentService";
import { PAYMENT_METHODS } from "../config/constants";

function CheckoutPage() {
  const { cartItems, getCartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    fullName: user?.name || "",
    email: user?.email || "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "India",
    paymentMethod: PAYMENT_METHODS.RAZORPAY,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const totalAmount = getCartTotal();

      if (formData.paymentMethod === PAYMENT_METHODS.RAZORPAY) {
        const paymentResponse = await paymentService.initializePayment(
          totalAmount
        );

        if (!paymentResponse.razorpay_payment_id) {
          throw new Error("Payment failed");
        }
      }

      // Prepare order data
      const orderData = {
        userId: user._id,
        items: cartItems.map((item) => ({
          product: item.product._id,
          quantity: item.quantity,
          price:
            (item.product.discountPrice || item.product.price) * item.quantity,
        })),
        totalAmount,
        shippingAddress: {
          street: formData.address,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
          country: formData.country,
        },
        paymentMethod: formData.paymentMethod,
      };

      // Create order
      await orderService.createOrder(orderData);

      // Clear cart
      await clearCart();

      // Redirect to success page
      navigate("/profile");
    } catch (err) {
      setError(
        err.message || "Failed to process your order. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    navigate("/cart");
    return null;
  }

  return (
    <div className="container-custom py-8 md:py-12">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
        Checkout
      </h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-2/3">
          <form onSubmit={handleSubmit}>
            {/* Contact Information */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">
                Contact Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="fullName"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Full Name
                  </label>
                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    value={formData.fullName}
                    onChange={handleChange}
                    className="input-field"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Email Address
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="input-field"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">Shipping Address</h2>
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="address"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Street Address
                  </label>
                  <input
                    id="address"
                    name="address"
                    type="text"
                    value={formData.address}
                    onChange={handleChange}
                    className="input-field"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label
                      htmlFor="city"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      City
                    </label>
                    <input
                      id="city"
                      name="city"
                      type="text"
                      value={formData.city}
                      onChange={handleChange}
                      className="input-field"
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="state"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      State
                    </label>
                    <input
                      id="state"
                      name="state"
                      type="text"
                      value={formData.state}
                      onChange={handleChange}
                      className="input-field"
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="zipCode"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      PIN Code
                    </label>
                    <input
                      id="zipCode"
                      name="zipCode"
                      type="text"
                      value={formData.zipCode}
                      onChange={handleChange}
                      className="input-field"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
              <div className="space-y-4">
                <div className="flex items-center">
                  <input
                    id="razorpay"
                    name="paymentMethod"
                    type="radio"
                    value={PAYMENT_METHODS.RAZORPAY}
                    checked={
                      formData.paymentMethod === PAYMENT_METHODS.RAZORPAY
                    }
                    onChange={handleChange}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                  />
                  <label htmlFor="razorpay" className="ml-3 flex items-center">
                    <FaCreditCard className="text-blue-500 mr-2" />
                    <span className="text-gray-700">Pay with Razorpay</span>
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    id="cod"
                    name="paymentMethod"
                    type="radio"
                    value={PAYMENT_METHODS.CASH_ON_DELIVERY}
                    checked={
                      formData.paymentMethod ===
                      PAYMENT_METHODS.CASH_ON_DELIVERY
                    }
                    onChange={handleChange}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                  />
                  <label htmlFor="cod" className="ml-3 flex items-center">
                    <FaTruck className="text-gray-500 mr-2" />
                    <span className="text-gray-700">Cash on Delivery</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="btn-primary py-3 px-8 flex items-center"
                disabled={loading}
              >
                <FaLock className="mr-2" />
                {loading ? "Processing..." : "Place Order"}
              </button>
            </div>
          </form>
        </div>

        {/* Order Summary */}
        <div className="lg:w-1/3">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

            <div className="divide-y divide-gray-200">
              {cartItems.map(({ product, quantity }) => (
                <div key={product._id} className="py-3 flex justify-between">
                  <div className="flex items-start">
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-12 h-12 object-cover rounded mr-3"
                    />
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {product.name}
                      </p>
                      <p className="text-sm text-gray-500">Qty: {quantity}</p>
                    </div>
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    ₹
                    {(
                      (product.discountPrice || product.price) * quantity
                    ).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-6 space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="text-gray-900">
                  ₹{getCartTotal().toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span className="text-gray-900">₹0.00</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tax</span>
                <span className="text-gray-900">₹0.00</span>
              </div>
              <div className="border-t pt-3 mt-3 border-gray-200">
                <div className="flex justify-between">
                  <span className="font-semibold text-gray-900">Total</span>
                  <span className="font-semibold text-gray-900">
                    ₹{getCartTotal().toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CheckoutPage;
