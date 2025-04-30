import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { FaStar, FaShoppingCart, FaBolt, FaArrowLeft } from 'react-icons/fa'
import { productService } from '../services/productService'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'

function ProductDetailsPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addToCart } = useCart()
  const { isAuthenticated } = useAuth()
  
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [activeImage, setActiveImage] = useState(0)
  
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true)
        const data = await productService.getProductById(id)
        setProduct(data)
        setError(null)
      } catch (err) {
        console.error('Error fetching product:', err)
        setError('Failed to load product. Please try again.')
      } finally {
        setLoading(false)
      }
    }
    
    fetchProduct()
  }, [id])
  
  const handleAddToCart = () => {
    addToCart(product, quantity)
  }
  
  const handleBuyNow = () => {
    if (!isAuthenticated) {
      navigate('/login?redirect=checkout')
      return
    }
    
    addToCart(product, quantity)
    navigate('/checkout')
  }
  
  const increaseQuantity = () => {
    if (quantity < product.stock) {
      setQuantity(quantity + 1)
    }
  }
  
  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1)
    }
  }
  
  if (loading) {
    return (
      <div className="container-custom py-16 flex justify-center">
        <div className="animate-pulse space-y-8 w-full max-w-6xl">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="w-full md:w-1/2">
              <div className="bg-gray-200 rounded-lg aspect-square"></div>
            </div>
            <div className="w-full md:w-1/2 space-y-4">
              <div className="h-8 bg-gray-200 rounded w-3/4"></div>
              <div className="h-6 bg-gray-200 rounded w-1/2"></div>
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-10 bg-gray-200 rounded w-full"></div>
              <div className="h-12 bg-gray-200 rounded w-full"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }
  
  if (error) {
    return (
      <div className="container-custom py-16">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
        <Link to="/products" className="btn-primary inline-flex items-center">
          <FaArrowLeft className="mr-2" /> Back to Products
        </Link>
      </div>
    )
  }
  
  if (!product) {
    return null
  }
  
  const {
    name,
    description,
    price,
    discountPrice,
    stock,
    category,
    images,
    rating,
    numReviews
  } = product
  
  const displayPrice = discountPrice || price
  const hasDiscount = discountPrice !== null && discountPrice < price
  const discountPercentage = hasDiscount ? Math.round((1 - discountPrice / price) * 100) : 0
  
  return (
    <div className="container-custom py-8 md:py-16">
      <Link to="/products" className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-6">
        <FaArrowLeft className="mr-2" /> Back to Products
      </Link>
      
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-4 md:p-8">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square overflow-hidden rounded-lg bg-gray-100">
              <img 
                src={images[activeImage]} 
                alt={name}
                className="w-full h-full object-contain"
              />
            </div>
            
            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex space-x-2 overflow-x-auto">
                {images.map((image, index) => (
                  <div 
                    key={index}
                    className={`w-16 h-16 rounded-md overflow-hidden cursor-pointer border-2 ${
                      activeImage === index ? 'border-primary-500' : 'border-transparent'
                    }`}
                    onClick={() => setActiveImage(index)}
                  >
                    <img 
                      src={image} 
                      alt={`${name} - view ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{name}</h1>
              <div className="flex items-center mt-2">
                <div className="flex items-center">
                  <FaStar className="text-yellow-400" />
                  <span className="ml-1 text-gray-700">{rating.toFixed(1)}</span>
                </div>
                <span className="mx-2 text-gray-400">|</span>
                <span className="text-gray-600">{numReviews} reviews</span>
                <span className="mx-2 text-gray-400">|</span>
                <span className="text-gray-600">{category}</span>
              </div>
            </div>
            
            <div className="border-t border-b py-4">
              <div className="flex items-center">
                <span className="text-3xl font-bold text-gray-900">${displayPrice.toFixed(2)}</span>
                {hasDiscount && (
                  <>
                    <span className="ml-2 text-lg text-gray-500 line-through">${price.toFixed(2)}</span>
                    <span className="ml-2 px-2 py-1 bg-accent-500 text-white text-sm font-medium rounded">
                      Save {discountPercentage}%
                    </span>
                  </>
                )}
              </div>
              
              <div className="mt-2 text-sm">
                {stock > 0 ? (
                  <span className="text-success-500">In Stock ({stock} available)</span>
                ) : (
                  <span className="text-red-500">Out of Stock</span>
                )}
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Description</h3>
              <p className="text-gray-700">{description}</p>
            </div>
            
            {stock > 0 && (
              <div className="space-y-4">
                {/* Quantity Selector */}
                <div className="flex items-center">
                  <label className="mr-4 text-gray-700 font-medium">Quantity:</label>
                  <div className="flex items-center border rounded-md">
                    <button 
                      onClick={decreaseQuantity}
                      className="px-3 py-1 border-r hover:bg-gray-100 disabled:opacity-50"
                      disabled={quantity <= 1}
                    >
                      -
                    </button>
                    <input 
                      type="number" 
                      value={quantity}
                      onChange={(e) => {
                        const val = parseInt(e.target.value)
                        if (!isNaN(val) && val >= 1 && val <= stock) {
                          setQuantity(val)
                        }
                      }}
                      className="w-16 text-center py-1 border-0 focus:ring-0"
                      min="1"
                      max={stock}
                    />
                    <button 
                      onClick={increaseQuantity}
                      className="px-3 py-1 border-l hover:bg-gray-100 disabled:opacity-50"
                      disabled={quantity >= stock}
                    >
                      +
                    </button>
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <button 
                    onClick={handleAddToCart}
                    className="btn-primary flex-1 py-3 flex items-center justify-center"
                  >
                    <FaShoppingCart className="mr-2" /> Add to Cart
                  </button>
                  <button 
                    onClick={handleBuyNow}
                    className="btn-accent flex-1 py-3 flex items-center justify-center"
                  >
                    <FaBolt className="mr-2" /> Buy Now
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetailsPage