import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { productService } from '../services/productService'
import ProductCard from '../components/products/ProductCard'
import HeroSection from '../components/home/HeroSection'
import FeaturedCategories from '../components/home/FeaturedCategories'

function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState([])
  const [newArrivals, setNewArrivals] = useState([])
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        
        // Get featured products
        const featured = await productService.getProducts({ featured: true })
        setFeaturedProducts(featured)
        
        // Get newest products
        const newest = await productService.getProducts({ sort: 'newest' })
        setNewArrivals(newest.slice(0, 4))
        
        setLoading(false)
      } catch (error) {
        console.error('Failed to fetch products:', error)
        setLoading(false)
      }
    }
    
    fetchProducts()
  }, [])
  
  return (
    <div>
      <HeroSection />
      
      <section className="container-custom my-16">
        <FeaturedCategories />
      </section>
      
      {/* Featured Products */}
      <section className="container-custom my-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Featured Products</h2>
          <Link to="/products" className="text-primary-600 hover:text-primary-700 font-medium flex items-center">
            View All
          </Link>
        </div>
        
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="card animate-pulse">
                <div className="bg-gray-200 h-48 sm:h-56 md:h-64"></div>
                <div className="p-4">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                  <div className="h-5 bg-gray-200 rounded w-1/3 mb-4"></div>
                  <div className="h-10 bg-gray-200 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {featuredProducts.slice(0, 4).map(product => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </section>
      
      {/* Promotion Banner */}
      <section className="bg-primary-50 py-16 my-16">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Summer Sale!
              </h2>
              <p className="text-lg text-gray-700 mb-6">
                Enjoy up to 50% off on selected items. Limited time offer.
              </p>
              <Link to="/products" className="btn-accent">
                Shop Now
              </Link>
            </div>
            <div className="hidden md:block">
              <img 
                src="https://images.pexels.com/photos/5650026/pexels-photo-5650026.jpeg" 
                alt="Summer sale" 
                className="rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>
      
      {/* New Arrivals */}
      <section className="container-custom my-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">New Arrivals</h2>
          <Link to="/products?sort=newest" className="text-primary-600 hover:text-primary-700 font-medium flex items-center">
            View All
          </Link>
        </div>
        
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="card animate-pulse">
                <div className="bg-gray-200 h-48 sm:h-56 md:h-64"></div>
                <div className="p-4">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                  <div className="h-5 bg-gray-200 rounded w-1/3 mb-4"></div>
                  <div className="h-10 bg-gray-200 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {newArrivals.map(product => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </section>
      
      {/* Testimonials */}
      <section className="container-custom my-16">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 text-center">
          What Our Customers Say
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              name: "Sarah Johnson",
              comment: "Great selection and fast delivery. The quality of the products exceeded my expectations!",
              rating: 5,
              image: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg"
            },
            {
              name: "Michael Chen",
              comment: "The customer service is outstanding. They helped me resolve an issue quickly and efficiently.",
              rating: 5,
              image: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg"
            },
            {
              name: "Emma Rodriguez",
              comment: "BuyBliss has become my go-to online shop. Competitive prices and reliable shipping every time.",
              rating: 4,
              image: "https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg"
            }
          ].map((testimonial, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-md flex flex-col">
              <div className="flex items-center mb-4">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover mr-4"
                />
                <div>
                  <h4 className="font-medium text-gray-900">{testimonial.name}</h4>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={`w-4 h-4 ${
                          i < testimonial.rating ? "text-yellow-400" : "text-gray-300"
                        }`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-gray-700 flex-grow">{testimonial.comment}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

export default HomePage