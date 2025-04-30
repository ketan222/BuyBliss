import { useState, useEffect } from 'react'
import ProductCard from './ProductCard'

function ProductGrid({ products, loading }) {
  const [displayedProducts, setDisplayedProducts] = useState([])
  
  useEffect(() => {
    setDisplayedProducts(products)
  }, [products])
  
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {[...Array(8)].map((_, index) => (
          <div key={index} className="card animate-pulse">
            <div className="bg-gray-200 h-48 sm:h-56 md:h-64"></div>
            <div className="p-4">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
              <div className="h-5 bg-gray-200 rounded w-1/3 mb-4"></div>
              <div className="h-10 bg-gray-200 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    )
  }
  
  if (displayedProducts.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-medium text-gray-900 mb-2">No products found</h3>
        <p className="text-gray-600">Try adjusting your filters or search term</p>
      </div>
    )
  }
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {displayedProducts.map(product => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  )
}

export default ProductGrid