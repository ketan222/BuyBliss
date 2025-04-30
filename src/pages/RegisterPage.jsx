import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { USER_ROLES } from '../config/constants'
import { FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash, FaStore, FaUserCheck } from 'react-icons/fa'

function RegisterPage() {
  const location = useLocation()
  const searchParams = new URLSearchParams(location.search)
  const defaultRole = searchParams.get('role') === 'seller' ? 'seller' : 'buyer'
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: defaultRole,
    storeName: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState(null)
  
  const { register, loading } = useAuth()
  const navigate = useNavigate()
  
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value
    })
  }
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    
    // Basic validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return
    }
    
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }
    
    if (formData.role === 'seller' && !formData.storeName) {
      setError('Store name is required for sellers')
      return
    }
    
    try {
      const userData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
        storeName: formData.role === 'seller' ? formData.storeName : undefined
      }
      
      await register(userData)
      navigate('/')
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.')
    }
  }
  
  return (
    <div className="container-custom py-12 md:py-20">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Create an Account</h1>
            <p className="text-gray-600">Join BuyBliss to start shopping or selling</p>
          </div>
          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Account Type Selection */}
            <div className="flex rounded-md overflow-hidden border">
              <button
                type="button"
                className={`flex-1 py-3 flex items-center justify-center ${
                  formData.role === USER_ROLES.BUYER
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700'
                }`}
                onClick={() => handleChange({ target: { name: 'role', value: USER_ROLES.BUYER } })}
              >
                <FaUserCheck className="mr-2" /> Buyer
              </button>
              <button
                type="button"
                className={`flex-1 py-3 flex items-center justify-center ${
                  formData.role === USER_ROLES.SELLER
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700'
                }`}
                onClick={() => handleChange({ target: { name: 'role', value: USER_ROLES.SELLER } })}
              >
                <FaStore className="mr-2" /> Seller
              </button>
            </div>
            
            {/* Full Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaUser className="text-gray-400" />
                </div>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  className="pl-10 input-field"
                  placeholder="Your full name"
                  required
                />
              </div>
            </div>
            
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaEnvelope className="text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="pl-10 input-field"
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>
            
            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleChange}
                  className="pl-10 pr-10 input-field"
                  placeholder="Create a password"
                  required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <FaEyeSlash className="text-gray-400" />
                  ) : (
                    <FaEye className="text-gray-400" />
                  )}
                </button>
              </div>
            </div>
            
            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="text-gray-400" />
                </div>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="pl-10 input-field"
                  placeholder="Confirm your password"
                  required
                />
              </div>
            </div>
            
            {/* Store Name (for Sellers only) */}
            {formData.role === USER_ROLES.SELLER && (
              <div>
                <label htmlFor="storeName" className="block text-sm font-medium text-gray-700 mb-1">
                  Store Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaStore className="text-gray-400" />
                  </div>
                  <input
                    id="storeName"
                    name="storeName"
                    type="text"
                    value={formData.storeName}
                    onChange={handleChange}
                    className="pl-10 input-field"
                    placeholder="Your store name"
                    required
                  />
                </div>
              </div>
            )}
            
            <button
              type="submit"
              className="w-full btn-primary py-3"
              disabled={loading}
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
            
            <div className="text-center text-sm">
              <span className="text-gray-600">Already have an account?</span>{' '}
              <Link to="/login" className="text-primary-600 hover:text-primary-700 font-medium">
                Sign In
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default RegisterPage