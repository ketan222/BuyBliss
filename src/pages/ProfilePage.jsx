import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FaUser, FaEdit, FaBox } from 'react-icons/fa'
import { useAuth } from '../context/AuthContext'
import { orderService } from '../services/orderService'

function ProfilePage() {
  const { user, updateProfile } = useAuth()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [profileFormData, setProfileFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    address: user?.address || '',
    phone: user?.phone || ''
  })
  const [isEditing, setIsEditing] = useState(false)
  const [activeTab, setActiveTab] = useState('orders')
  
  // Fetch user orders
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true)
        const data = await orderService.getOrders()
        setOrders(data)
      } catch (error) {
        console.error('Failed to fetch orders:', error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchOrders()
  }, [])
  
  const handleProfileChange = (e) => {
    const { name, value } = e.target
    setProfileFormData({
      ...profileFormData,
      [name]: value
    })
  }
  
  const handleProfileSubmit = async (e) => {
    e.preventDefault()
    try {
      await updateProfile({
        ...profileFormData,
        _id: user._id
      })
      setIsEditing(false)
    } catch (error) {
      console.error('Failed to update profile:', error)
    }
  }
  
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }
  
  // Render orders tab
  const renderOrders = () => {
    if (loading) {
      return (
        <div className="animate-pulse space-y-4">
          {[1, 2].map((_, index) => (
            <div key={index} className="bg-white p-4 rounded-lg shadow">
              <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/4 mb-3"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      )
    }
    
    if (orders.length === 0) {
      return (
        <div className="bg-white p-6 rounded-lg shadow text-center">
          <FaBox className="text-4xl text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-gray-900 mb-2">No orders yet</h3>
          <p className="text-gray-600 mb-4">You haven't placed any orders yet.</p>
          <Link to="/products" className="btn-primary">
            Start Shopping
          </Link>
        </div>
      )
    }
    
    return (
      <div className="space-y-6">
        {orders.map(order => (
          <div key={order._id} className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-4 bg-gray-50 border-b flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-500">Order #{order._id}</p>
                <p className="font-medium">{formatDate(order.createdAt)}</p>
              </div>
              <div className="mt-2 sm:mt-0">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                  order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                  order.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </span>
              </div>
            </div>
            
            <div className="p-4">
              <div className="divide-y divide-gray-200">
                {order.items.map(item => (
                  <div key={item.product._id} className="py-3 flex items-center">
                    <img 
                      src={item.product.images[0]} 
                      alt={item.product.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div className="ml-4 flex-1">
                      <h4 className="text-sm font-medium text-gray-900">{item.product.name}</h4>
                      <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">${item.price.toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-4 pt-4 border-t flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-500">Payment Method</p>
                  <p className="font-medium">{order.paymentMethod === 'credit_card' ? 'Credit Card' : 'PayPal'}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Total Amount</p>
                  <p className="text-lg font-bold">${order.totalAmount.toFixed(2)}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }
  
  // Render profile tab
  const renderProfile = () => {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold">Profile Information</h3>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="flex items-center text-primary-600 hover:text-primary-700"
          >
            <FaEdit className="mr-1" /> {isEditing ? 'Cancel' : 'Edit'}
          </button>
        </div>
        
        {isEditing ? (
          <form onSubmit={handleProfileSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={profileFormData.name}
                  onChange={handleProfileChange}
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={profileFormData.email}
                  onChange={handleProfileChange}
                  className="input-field"
                  required
                  disabled
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address
                </label>
                <input
                  type="text"
                  name="address"
                  value={profileFormData.address}
                  onChange={handleProfileChange}
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="text"
                  name="phone"
                  value={profileFormData.phone}
                  onChange={handleProfileChange}
                  className="input-field"
                />
              </div>
            </div>
            
            <div className="flex justify-end">
              <button type="submit" className="btn-primary">
                Save Changes
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Full Name</p>
                <p className="mt-1">{user?.name}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Email Address</p>
                <p className="mt-1">{user?.email}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Address</p>
                <p className="mt-1">{user?.address || 'Not provided'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Phone Number</p>
                <p className="mt-1">{user?.phone || 'Not provided'}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }
  
  return (
    <div className="container-custom py-8 md:py-12">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">My Account</h1>
      
      <div className="bg-white rounded-lg shadow-md mb-8">
        <div className="flex border-b">
          <button
            className={`px-6 py-3 text-sm font-medium ${
              activeTab === 'orders'
                ? 'border-b-2 border-primary-500 text-primary-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('orders')}
          >
            Orders
          </button>
          <button
            className={`px-6 py-3 text-sm font-medium ${
              activeTab === 'profile'
                ? 'border-b-2 border-primary-500 text-primary-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('profile')}
          >
            Profile
          </button>
        </div>
      </div>
      
      <div className="mt-6">
        {activeTab === 'orders' && renderOrders()}
        {activeTab === 'profile' && renderProfile()}
      </div>
    </div>
  )
}

export default ProfilePage