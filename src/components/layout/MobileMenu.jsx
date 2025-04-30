import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { FaTimes, FaHome, FaShoppingBag, FaUser, FaStore, FaShoppingCart, FaSignInAlt, FaUserPlus } from 'react-icons/fa'

function MobileMenu({ isOpen, setIsOpen }) {
  const { user, isAuthenticated, logout } = useAuth()
  const isSeller = user?.role === 'seller'
  
  if (!isOpen) return null
  
  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50">
      <div className="fixed right-0 top-0 h-full w-64 bg-white shadow-xl transform transition-all duration-300 animate-slide-up">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-semibold">Menu</h2>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <FaTimes className="text-gray-600" />
          </button>
        </div>
        
        <nav className="mt-4">
          <Link
            to="/"
            className="flex items-center p-4 text-gray-700 hover:bg-gray-100"
            onClick={() => setIsOpen(false)}
          >
            <FaHome className="mr-3" /> Home
          </Link>
          
          <Link
            to="/products"
            className="flex items-center p-4 text-gray-700 hover:bg-gray-100"
            onClick={() => setIsOpen(false)}
          >
            <FaShoppingBag className="mr-3" /> Products
          </Link>
          
          {isAuthenticated ? (
            <>
              <Link
                to="/profile"
                className="flex items-center p-4 text-gray-700 hover:bg-gray-100"
                onClick={() => setIsOpen(false)}
              >
                <FaUser className="mr-3" /> Profile
              </Link>
              
              <Link
                to="/cart"
                className="flex items-center p-4 text-gray-700 hover:bg-gray-100"
                onClick={() => setIsOpen(false)}
              >
                <FaShoppingCart className="mr-3" /> Cart
              </Link>
              
              {isSeller && (
                <Link
                  to="/seller/dashboard"
                  className="flex items-center p-4 text-gray-700 hover:bg-gray-100"
                  onClick={() => setIsOpen(false)}
                >
                  <FaStore className="mr-3" /> Seller Dashboard
                </Link>
              )}
              
              <button
                onClick={() => {
                  logout()
                  setIsOpen(false)
                }}
                className="flex items-center w-full p-4 text-gray-700 hover:bg-gray-100 text-left"
              >
                <FaSignInAlt className="mr-3" /> Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="flex items-center p-4 text-gray-700 hover:bg-gray-100"
                onClick={() => setIsOpen(false)}
              >
                <FaSignInAlt className="mr-3" /> Login
              </Link>
              
              <Link
                to="/register"
                className="flex items-center p-4 text-gray-700 hover:bg-gray-100"
                onClick={() => setIsOpen(false)}
              >
                <FaUserPlus className="mr-3" /> Register
              </Link>
            </>
          )}
        </nav>
      </div>
    </div>
  )
}

export default MobileMenu