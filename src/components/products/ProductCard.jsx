import { Link } from 'react-router-dom'
import { FaStar, FaShoppingCart } from 'react-icons/fa'
import { useCart } from '../../context/CartContext'

function ProductCard({ product }) {
  const { addToCart } = useCart()
  
  const {
    _id,
    name,
    price,
    discountPrice,
    images,
    rating,
    numReviews
  } = product
  
  const handleAddToCart = (e) => {
    e.preventDefault()
    e.stopPropagation()
    addToCart(product, 1)
  }
  
  const displayPrice = discountPrice || price
  const hasDiscount = discountPrice !== null && discountPrice < price
  const discountPercentage = hasDiscount ? Math.round((1 - discountPrice / price) * 100) : 0
  
  return (
    <Link 
      to={`/products/${_id}`}
      className="card group h-full flex flex-col transform hover:scale-[1.02] transition-all duration-300"
    >
      {/* Product Image */}
      <div className="relative overflow-hidden h-48 sm:h-56 md:h-64">
        <img 
          src={images[0]} 
          alt={name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-all duration-500"
        />
        
        {/* Discount Badge */}
        {hasDiscount && (
          <span className="absolute top-2 right-2 bg-accent-500 text-white text-sm font-bold px-2 py-1 rounded">
            -{discountPercentage}%
          </span>
        )}
      </div>
      
      {/* Product Details */}
      <div className="flex-1 p-4 flex flex-col">
        <div className="flex-1">
          <h3 className="text-md font-medium text-gray-800 mb-1 line-clamp-2">{name}</h3>
          
          {/* Rating */}
          <div className="flex items-center mb-2">
            <div className="flex items-center mr-2">
              <FaStar className="text-yellow-400 text-sm" />
              <span className="ml-1 text-sm text-gray-600">{rating.toFixed(1)}</span>
            </div>
            <span className="text-xs text-gray-500">({numReviews} reviews)</span>
          </div>
        </div>
        
        {/* Price and Add to Cart */}
        <div className="mt-auto">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <span className="text-lg font-semibold text-gray-900">${displayPrice.toFixed(2)}</span>
              {hasDiscount && (
                <span className="ml-2 text-sm text-gray-500 line-through">${price.toFixed(2)}</span>
              )}
            </div>
          </div>
          
          <button
            onClick={handleAddToCart}
            className="w-full flex items-center justify-center px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
          >
            <FaShoppingCart className="mr-2" />
            Add to Cart
          </button>
        </div>
      </div>
    </Link>
  )
}

export default ProductCard