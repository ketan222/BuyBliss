import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { productService } from '../services/productService'
import ProductGrid from '../components/products/ProductGrid'
import ProductFilter from '../components/products/ProductFilter'

function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  // Parse search parameters
  const initialFilters = {
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    sort: searchParams.get('sort') || 'newest'
  }
  
  // Fetch products based on filters
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        const fetchedProducts = await productService.getProducts(initialFilters)
        setProducts(fetchedProducts)
        setError(null)
      } catch (err) {
        console.error('Error fetching products:', err)
        setError('Failed to load products. Please try again.')
      } finally {
        setLoading(false)
      }
    }
    
    fetchProducts()
  }, [searchParams])
  
  // Handle filter changes
  const handleFilterChange = (filters) => {
    const newSearchParams = {}
    
    // Only add non-empty filters to URL
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        newSearchParams[key] = value
      }
    })
    
    setSearchParams(newSearchParams)
  }
  
  return (
    <div className="container-custom py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">All Products</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}
      
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Filters */}
        <div className="w-full md:w-64 lg:w-72 flex-shrink-0">
          <ProductFilter onFilter={handleFilterChange} />
        </div>
        
        {/* Product Grid */}
        <div className="flex-grow">
          <ProductGrid products={products} loading={loading} />
        </div>
      </div>
    </div>
  )
}

export default ProductsPage