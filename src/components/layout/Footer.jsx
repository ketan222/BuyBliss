import { Link } from 'react-router-dom'
import { 
  FaFacebook, 
  FaTwitter, 
  FaInstagram, 
  FaPinterest,
  FaCreditCard,
  FaPaypal,
  FaApplePay,
  FaGooglePay
} from 'react-icons/fa'

function Footer() {
  const currentYear = new Date().getFullYear()
  
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Column 1 - About */}
          <div>
            <h3 className="text-lg font-semibold mb-4">BuyBliss</h3>
            <p className="text-gray-400 mb-4">
              Discover the joy of shopping with BuyBliss. Quality products, great prices, and exceptional service.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <FaFacebook />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <FaTwitter />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <FaInstagram />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <FaPinterest />
              </a>
            </div>
          </div>
          
          {/* Column 2 - Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-400 hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/products" className="text-gray-400 hover:text-white transition-colors">
                  Shop All
                </Link>
              </li>
              <li>
                <Link to="/profile" className="text-gray-400 hover:text-white transition-colors">
                  My Account
                </Link>
              </li>
              <li>
                <Link to="/cart" className="text-gray-400 hover:text-white transition-colors">
                  Cart
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Column 3 - Customer Service */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Customer Service</h3>
            <ul className="space-y-2">
              <li>
                <Link to="#" className="text-gray-400 hover:text-white transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="#" className="text-gray-400 hover:text-white transition-colors">
                  FAQs
                </Link>
              </li>
              <li>
                <Link to="#" className="text-gray-400 hover:text-white transition-colors">
                  Shipping Policy
                </Link>
              </li>
              <li>
                <Link to="#" className="text-gray-400 hover:text-white transition-colors">
                  Returns & Refunds
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Column 4 - Newsletter */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Newsletter</h3>
            <p className="text-gray-400 mb-4">
              Subscribe to receive updates, access to exclusive deals, and more.
            </p>
            <form className="flex">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="flex-grow px-4 py-2 rounded-l-md text-gray-900 focus:outline-none"
              />
              <button 
                type="submit" 
                className="bg-primary-600 hover:bg-primary-700 px-4 py-2 rounded-r-md transition-colors"
              >
                Subscribe
              </button>
            </form>
            <div className="mt-4">
              <p className="text-sm text-gray-400 mb-2">We accept:</p>
              <div className="flex space-x-3">
                <FaCreditCard className="text-gray-400 text-xl" />
                <FaPaypal className="text-gray-400 text-xl" />
                <FaApplePay className="text-gray-400 text-xl" />
                <FaGooglePay className="text-gray-400 text-xl" />
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400 text-sm">
          <p>© {currentYear} BuyBliss. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer