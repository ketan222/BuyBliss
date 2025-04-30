import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { 
  FaPlus, 
  FaEdit, 
  FaEye, 
  FaTrash, 
  FaSearch,
  FaSort,
  FaFilter
} from 'react-icons/fa'
import { useAuth } from '../../context/AuthContext'
import { productService } from '../../services/productService'

function ProductsPage() {
  const { user } = useAuth()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('newest')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(null)
  const [error, setError] = useState(null)
  
  useEffect(() => {
    fetchProducts()
  }, [sortBy, selectedCategory])
  
  const fetchProducts = async () => {
    try {
      setLoading(true)
      setError(null)
      const sellerProducts = await productService.getProducts({ 
        sellerId: user._id,
        sort: sortBy,
        category: selectedCategory
      })
      setProducts(sellerProducts)
    } catch (error) {
      console.error('Failed to fetch seller products:', error)
      setError('Failed to load products. Please try again.')
    } finally {
      setLoading(false)
    }
  }
  
  const handleSearch = (e) => {
    e.preventDefault()
    fetchProducts()
  }
  
  const handleDelete = async (productId) => {
    try {
      await productService.deleteProduct(productId)
      setProducts(products.filter(p => p._id !== productId))
      setConfirmDelete(null)
    } catch (error) {
      console.error('Failed to delete product:', error)
      setError('Failed to delete product. Please try again.')
    }
  }
  
  const filteredProducts = searchTerm 
    ? products.filter(product => 
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : products
  
  return (
    <div className="container-custom py-8">
      <div className="flex flex-col md:flex-row items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">My Products</h1>
          <p className="text-gray-600">Manage your inventory, prices, and product information</p>
        </div>
        <div className="mt-4 md:mt-0">
          <Link
            to="/seller/products/add"
            className="btn-primary flex items-center"
          >
            <FaPlus className="mr-2" /> Add New Product
          </Link>
        </div>
      </div>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}
      
      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <form onSubmit={handleSearch} className="relative flex-grow max-w-md mb-4 md:mb-0">
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full py-2 pl-10 pr-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </form>
          
          <div className="flex items-center">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="mr-4 flex items-center text-gray-600 hover:text-primary-600"
            >
              <FaFilter className="mr-1" />
              <span className="text-sm">Filters</span>
            </button>
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none bg-transparent pl-6 pr-8 py-1 border-gray-300 border rounded focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
              >
                <option value="newest">Newest</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
              <FaSort className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>
        
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">All Categories</option>
                  <option value="Electronics">Electronics</option>
                  <option value="Clothing">Clothing</option>
                  <option value="Kitchen">Kitchen</option>
                  <option value="Home & Garden">Home & Garden</option>
                  <option value="Beauty & Health">Beauty & Health</option>
                  <option value="Sports & Outdoors">Sports & Outdoors</option>
                  <option value="Toys & Games">Toys & Games</option>
                  <option value="Books">Books</option>
                  <option value="Accessories">Accessories</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Products Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {loading ? (
          <div className="p-6">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
              <div className="h-64 bg-gray-200 rounded mb-6"></div>
            </div>
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stock
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rating
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredProducts.map(product => (
                  <tr key={product._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-md overflow-hidden flex-shrink-0">
                          <img src={product.images[0]} alt={product.name} className="h-full w-full object-cover" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{product.name}</div>
                          <div className="text-xs text-gray-500 truncate max-w-xs">{product.description.substring(0, 60)}...</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                        {product.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        ${(product.discountPrice || product.price).toFixed(2)}
                      </div>
                      {product.discountPrice && (
                        <div className="text-xs text-gray-500 line-through">
                          ${product.price.toFixed(2)}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`text-sm ${product.stock < 10 ? 'text-orange-600 font-medium' : 'text-gray-900'}`}>
                        {product.stock} units
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className="text-sm text-gray-900">{product.rating.toFixed(1)}</span>
                        <span className="text-xs text-gray-500 ml-1">({product.numReviews})</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-3">
                        <Link to={`/products/${product._id}`} className="text-gray-600 hover:text-gray-900" title="View">
                          <FaEye />
                        </Link>
                        <Link to={`/seller/products/edit/${product._id}`} className="text-primary-600 hover:text-primary-900" title="Edit">
                          <FaEdit />
                        </Link>
                        <button
                          onClick={() => setConfirmDelete(product._id)}
                          className="text-red-600 hover:text-red-900"
                          title="Delete"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-6 text-center">
            <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
            {searchTerm ? (
              <p className="text-gray-600 mb-4">No products match your search criteria</p>
            ) : (
              <p className="text-gray-600 mb-4">You haven't created any products yet</p>
            )}
            <Link to="/seller/products/add" className="btn-primary inline-flex items-center">
              <FaPlus className="mr-2" /> Add Your First Product
            </Link>
          </div>
        )}
      </div>
      
      {/* Delete Confirmation Modal */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Confirm Delete</h3>
            <p className="text-gray-600 mb-4">
              Are you sure you want to delete this product? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setConfirmDelete(null)}
                className="btn-outline"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(confirmDelete)}
                className="btn bg-red-600 text-white hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ProductsPage