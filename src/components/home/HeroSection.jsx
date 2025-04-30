import { Link } from 'react-router-dom'
import { FaArrowRight } from 'react-icons/fa'

function HeroSection() {
  return (
    <section className="relative bg-primary-600 text-white overflow-hidden">
      <div className="container-custom py-16 md:py-24 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="animate-fade-in">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Shop Smarter, <br />
              <span className="text-accent-300">Live Better</span>
            </h1>
            <p className="text-lg md:text-xl mb-8 text-primary-100 max-w-lg">
              Discover amazing products at unbeatable prices. 
              From gadgets to fashion, we've got you covered.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link 
                to="/products" 
                className="btn bg-white text-primary-600 hover:bg-primary-50 px-6 py-3 shadow-lg"
              >
                Shop Now
              </Link>
              <Link 
                to="/register?role=seller" 
                className="btn bg-transparent border-2 border-white text-white hover:bg-white hover:text-primary-600 px-6 py-3 flex items-center"
              >
                Become a Seller <FaArrowRight className="ml-2" />
              </Link>
            </div>
          </div>
          
          <div className="hidden md:block relative animate-slide-up">
            <img 
              src="https://images.pexels.com/photos/5926463/pexels-photo-5926463.jpeg" 
              alt="Shopping" 
              className="rounded-lg shadow-xl transform -rotate-3"
            />
            <div className="absolute -bottom-8 -left-8 bg-accent-500 p-4 rounded-lg shadow-lg transform rotate-6">
              <div className="text-2xl font-bold">50% OFF</div>
              <div className="text-sm">Selected Items</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Background decorations */}
      <div className="absolute top-0 right-0 w-full h-full overflow-hidden z-0">
        <div className="absolute top-0 right-0 bg-primary-400 opacity-20 rounded-full w-96 h-96 transform translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-0 bg-primary-800 opacity-30 rounded-full w-64 h-64 transform -translate-x-1/2 translate-y-1/2"></div>
      </div>
    </section>
  )
}

export default HeroSection