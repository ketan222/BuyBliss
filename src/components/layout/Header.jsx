import { Link, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useCart } from '../../context/CartContext'
import SearchBar from '../ui/SearchBar'
import { 
  FaShoppingCart, 
  FaUserCircle, 
  FaBars, 
  FaSignOutAlt,
  FaStore
} from 'react-icons/fa'

function Header({ isScrolled, toggleMobileMenu }) {
  const { user, logout, isAuthenticated } = useAuth()
  const { cartItems } = useCart()
  const navigate = useNavigate()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  
  const isSeller = user?.role === 'seller'
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownOpen && !event.target.closest('.user-dropdown')) {
        setDropdownOpen(false)
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [dropdownOpen])
  
  const handleLogout = () => {
    logout()
    navigate('/')
    setDropdownOpen(false)
  }
  
  return (
    <header 
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-md py-2' : 'bg-transparent py-4'
      }`}
    >
      <div className="container-custom">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-primary-600">
              Buy<span className="text-accent-500">Bliss</span>
            </span>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="nav-link text-gray-700 hover:text-primary-600">
              Home
            </Link>
            <Link to="/products" className="nav-link text-gray-700 hover:text-primary-600">
              Products
            </Link>
            {isSeller && (
              <Link to="/seller/dashboard" className="nav-link text-gray-700 hover:text-primary-600">
                Seller Dashboard
              </Link>
            )}
          </nav>
          
          {/* Search Bar - Desktop */}
          <div className="hidden lg:block w-1/3">
            <SearchBar />
          </div>
          
          {/* Right Actions */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <Link to="/cart" className="relative">
                  <FaShoppingCart className="text-xl text-gray-700 hover:text-primary-600" />
                  {cartItems.length > 0 && (
                    <span className="absolute -top-2 -right-2 bg-accent-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                      {cartItems.length}
                    </span>
                  )}
                </Link>
                
                <div className="relative user-dropdown">
                  <button 
                    className="flex items-center space-x-1"
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                  >
                    <FaUserCircle className="text-xl text-gray-700" />
                    <span className="hidden md:inline-block text-sm font-medium">
                      {user?.name || 'Account'}
                    </span>
                  </button>
                  
                  {/* User Dropdown */}
                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 animate-fade-in">
                      <Link 
                        to="/profile"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setDropdownOpen(false)}
                      >
                        Profile
                      </Link>
                      
                      {isSeller && (
                        <Link 
                          to="/seller/dashboard"
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setDropdownOpen(false)}
                        >
                          <FaStore className="mr-2" /> Seller Dashboard
                        </Link>
                      )}
                      
                      <button 
                        onClick={handleLogout}
                        className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <FaSignOutAlt className="mr-2" /> Sign out
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login" className="text-sm font-medium text-gray-700 hover:text-primary-600">
                  Login
                </Link>
                <Link to="/register" className="btn-primary">
                  Sign Up
                </Link>
              </div>
            )}
            
            {/* Mobile Menu Button */}
            <button 
              className="md:hidden"
              onClick={toggleMobileMenu}
              aria-label="Open mobile menu"
            >
              <FaBars className="text-xl text-gray-700" />
            </button>
          </div>
        </div>
        
        {/* Search Bar - Mobile */}
        <div className="mt-4 lg:hidden">
          <SearchBar />
        </div>
      </div>
    </header>
  )
}

export default Header