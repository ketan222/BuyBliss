import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa'

function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState(null)
  
  const { login, loading } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  
  // Get the redirect path from URL query or default to home
  const searchParams = new URLSearchParams(location.search)
  const redirect = searchParams.get('redirect') || '/'
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    
    try {
      await login(email, password)
      navigate(redirect)
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.')
    }
  }
  
  // For demo, set credentials to buyer@example.com / password
  const setDemoCredentials = (e) => {
    e.preventDefault()
    setEmail('buyer@example.com')
    setPassword('password')
  }
  
  // For demo, set credentials to seller@example.com / password
  const setSellerDemoCredentials = (e) => {
    e.preventDefault()
    setEmail('seller@example.com')
    setPassword('password')
  }
  
  return (
    <div className="container-custom py-12 md:py-20">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome Back</h1>
            <p className="text-gray-600">Sign in to your BuyBliss account</p>
          </div>
          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
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
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 input-field"
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>
            
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
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10 input-field"
                  placeholder="Enter your password"
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
            
            <button
              type="submit"
              className="w-full btn-primary py-3"
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
            
            <div className="text-center text-sm">
              <span className="text-gray-600">Don't have an account?</span>{' '}
              <Link to="/register" className="text-primary-600 hover:text-primary-700 font-medium">
                Sign Up
              </Link>
            </div>
          </form>
          
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-center text-gray-600 mb-4">For demo purposes:</p>
            <div className="flex flex-col space-y-2">
              <button 
                onClick={setDemoCredentials}
                className="btn-outline text-sm"
              >
                Use Demo Buyer Account
              </button>
              <button 
                onClick={setSellerDemoCredentials}
                className="btn-outline text-sm"
              >
                Use Demo Seller Account
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage