import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { 
  FaBox, 
  FaTag, 
  FaShoppingCart, 
  FaDollarSign, 
  FaChartLine,
  FaPlus
} from 'react-icons/fa'
import { useAuth } from '../../context/AuthContext'
import { productService } from '../../services/productService'
import DashboardCard from '../../components/seller/DashboardCard'

function DashboardPage() {
  const { user } = useAuth()
  const [products, setProducts] = useState([])
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 15, // Mock data
    totalRevenue: 1250.75, // Mock data
    lowStock: 0
  })
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        const sellerProducts = await productService.getProducts({ sellerId: user._id })
        setProducts(sellerProducts)
        
        const lowStockCount = sellerProducts.filter(p => p.stock < 10).length
        
        setStats({
          ...stats,
          totalProducts: sellerProducts.length,
          lowStock: lowStockCount
        })
      } catch (error) {
        console.error('Failed to fetch seller products:', error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchProducts()
  }, [user._id])
  
  // Recent products to display
  const recentProducts = products.slice(0, 5)
  
  return (
    <div className="container-custom py-8">
      <div className="flex flex-col md:flex-row items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Seller Dashboard</h1>
          <p className="text-gray-600">Welcome back, {user?.name}!</p>
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
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <DashboardCard 
          title="Total Products" 
          value={stats.totalProducts.toString()}
          icon={<FaBox className="text-blue-500" />}
          change="+3 this week"
          loading={loading}
        />
        <DashboardCard 
          title="Total Orders" 
          value={stats.totalOrders.toString()}
          icon={<FaShoppingCart className="text-green-500" />}
          change="+5 this week"
          loading={loading}
        />
        <DashboardCard 
          title="Total Revenue" 
          value={`$${stats.totalRevenue.toFixed(2)}`}
          icon={<FaDollarSign className="text-purple-500" />}
          change="+12% this month"
          loading={loading}
        />
        <DashboardCard 
          title="Low Stock Items" 
          value={stats.lowStock.toString()}
          icon={<FaTag className="text-orange-500" />}
          change="Action needed"
          isWarning={stats.lowStock > 0}
          loading={loading}
        />
      </div>
      
      {/* Recent Products */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
        <div className="p-6 bg-white border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-900">Recent Products</h2>
          <Link to="/seller/products" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
            View All
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stock
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 bg-gray-200 rounded"></div>
                        <div className="ml-4">
                          <div className="h-4 bg-gray-200 rounded w-24"></div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="h-4 bg-gray-200 rounded w-16"></div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="h-4 bg-gray-200 rounded w-10"></div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="h-4 bg-gray-200 rounded w-20"></div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="h-4 bg-gray-200 rounded w-16 ml-auto"></div>
                    </td>
                  </tr>
                ))
              ) : recentProducts.length > 0 ? (
                recentProducts.map(product => (
                  <tr key={product._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-md overflow-hidden flex-shrink-0">
                          <img src={product.images[0]} alt={product.name} className="h-full w-full object-cover" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{product.name}</div>
                          <div className="text-sm text-gray-500">{product.category}</div>
                        </div>
                      </div>
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
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        product.stock > 0
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link to={`/seller/products/edit/${product._id}`} className="text-primary-600 hover:text-primary-900 mr-4">
                        Edit
                      </Link>
                      <Link to={`/products/${product._id}`} className="text-gray-600 hover:text-gray-900">
                        View
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                    No products found. <Link to="/seller/products/add" className="text-primary-600 hover:text-primary-700">Add your first product</Link>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Sales Overview */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Sales Overview</h2>
          <div className="text-primary-600 flex items-center">
            <FaChartLine className="mr-1" />
            <span className="text-sm font-medium">+12% from last month</span>
          </div>
        </div>
        
        <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg border border-gray-200">
          <div className="text-center">
            <FaChartLine className="text-4xl text-gray-300 mx-auto mb-2" />
            <p className="text-gray-500">Sales chart will be displayed here</p>
          </div>
        </div>
        
        <div className="mt-6">
          <p className="text-gray-600 text-sm">
            Note: This is a demo dashboard with mock data. In a real implementation, 
            this would display your actual sales data and analytics.
          </p>
        </div>
      </div>
    </div>
  )
}

export default DashboardPage