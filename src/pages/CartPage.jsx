import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FaTrash, FaArrowLeft, FaArrowRight, FaShoppingCart } from 'react-icons/fa'
import { useCart } from '../context/CartContext'

function CartPage() {
  const { cartItems, updateQuantity, removeFromCart, getCartTotal } = useCart()
  const navigate = useNavigate()
  const [isUpdating, setIsUpdating] = useState(false)
  
  const handleQuantityChange = async (productId, newQuantity) => {
    setIsUpdating(true)
    await updateQuantity(productId, parseInt(newQuantity))
    setIsUpdating(false)
  }
  
  const handleRemoveItem = async (productId) => {
    setIsUpdating(true)
    await removeFromCart(productId)
    setIsUpdating(false)
  }
  
  const handleProceedToCheckout = () => {
    navigate('/checkout')
  }
  
  return (
    <div className="container-custom py-8 md:py-12">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">Your Shopping Cart</h1>
      
      {cartItems.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <div className="flex justify-center mb-4">
            <FaShoppingCart className="text-5xl text-gray-300" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Your cart is empty</h2>
          <p className="text-gray-600 mb-6">Looks like you haven't added any products to your cart yet.</p>
          <Link to="/products" className="btn-primary">
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="hidden md:grid md:grid-cols-6 bg-gray-50 py-4 px-6">
                <div className="col-span-3 font-medium text-gray-600">Product</div>
                <div className="text-center font-medium text-gray-600">Price</div>
                <div className="text-center font-medium text-gray-600">Quantity</div>
                <div className="text-right font-medium text-gray-600">Total</div>
              </div>
              
              <div className="divide-y divide-gray-200">
                {cartItems.map(({ product, quantity }) => (
                  <div key={product._id} className="py-4 px-6">
                    <div className="md:grid md:grid-cols-6 flex flex-col space-y-4 md:space-y-0 items-start md:items-center">
                      {/* Product */}
                      <div className="col-span-3 flex items-center space-x-4">
                        <img 
                          src={product.images[0]} 
                          alt={product.name}
                          className="w-16 h-16 object-cover rounded"
                        />
                        <div>
                          <Link 
                            to={`/products/${product._id}`}
                            className="text-gray-900 font-medium hover:text-primary-600"
                          >
                            {product.name}
                          </Link>
                        </div>
                      </div>
                      
                      {/* Price */}
                      <div className="md:text-center">
                        <div className="md:hidden text-sm text-gray-500 mb-1">Price:</div>
                        <span className="text-gray-900">
                          ${(product.discountPrice || product.price).toFixed(2)}
                        </span>
                      </div>
                      
                      {/* Quantity */}
                      <div className="flex items-center">
                        <div className="md:hidden text-sm text-gray-500 mr-2">Quantity:</div>
                        <div className="flex items-center border rounded">
                          <button 
                            onClick={() => handleQuantityChange(product._id, quantity - 1)}
                            className="px-2 py-1 border-r hover:bg-gray-100"
                            disabled={quantity <= 1 || isUpdating}
                          >
                            -
                          </button>
                          <input 
                            type="number" 
                            min="1"
                            value={quantity}
                            onChange={(e) => handleQuantityChange(product._id, e.target.value)}
                            className="w-12 text-center py-1 border-0 focus:ring-0"
                          />
                          <button 
                            onClick={() => handleQuantityChange(product._id, quantity + 1)}
                            className="px-2 py-1 border-l hover:bg-gray-100"
                            disabled={isUpdating}
                          >
                            +
                          </button>
                        </div>
                      </div>
                      
                      {/* Total */}
                      <div className="flex items-center justify-between w-full md:w-auto md:ml-auto">
                        <div className="md:hidden text-sm text-gray-500">Total:</div>
                        <div className="flex items-center space-x-2">
                          <span className="text-gray-900 font-medium md:mr-4">
                            ${((product.discountPrice || product.price) * quantity).toFixed(2)}
                          </span>
                          <button
                            onClick={() => handleRemoveItem(product._id)}
                            className="text-red-500 hover:text-red-700"
                            disabled={isUpdating}
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="mt-6">
              <Link to="/products" className="text-primary-600 hover:text-primary-700 flex items-center">
                <FaArrowLeft className="mr-2" /> Continue Shopping
              </Link>
            </div>
          </div>
          
          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Order Summary</h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="text-gray-900">${getCartTotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="text-gray-900">Calculated at checkout</span>
                </div>
                <div className="border-t pt-3 mt-3 border-gray-200">
                  <div className="flex justify-between">
                    <span className="font-semibold text-gray-900">Estimated Total</span>
                    <span className="font-semibold text-gray-900">${getCartTotal().toFixed(2)}</span>
                  </div>
                </div>
              </div>
              
              <button
                onClick={handleProceedToCheckout}
                className="w-full btn-primary py-3 flex items-center justify-center"
                disabled={isUpdating}
              >
                Proceed to Checkout <FaArrowRight className="ml-2" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default CartPage