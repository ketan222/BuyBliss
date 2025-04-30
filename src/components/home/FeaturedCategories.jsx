import { Link } from 'react-router-dom'
import { FaLaptop, FaTshirt, FaBlender, FaHome, FaSprayCan } from 'react-icons/fa'

function FeaturedCategories() {
  const categories = [
    {
      name: 'Electronics',
      icon: <FaLaptop className="text-3xl" />,
      color: 'bg-blue-500',
      image: 'https://images.pexels.com/photos/356056/pexels-photo-356056.jpeg'
    },
    {
      name: 'Clothing',
      icon: <FaTshirt className="text-3xl" />,
      color: 'bg-purple-500',
      image: 'https://images.pexels.com/photos/934070/pexels-photo-934070.jpeg'
    },
    {
      name: 'Kitchen',
      icon: <FaBlender className="text-3xl" />,
      color: 'bg-green-500',
      image: 'https://images.pexels.com/photos/1358900/pexels-photo-1358900.jpeg'
    },
    {
      name: 'Home & Garden',
      icon: <FaHome className="text-3xl" />,
      color: 'bg-amber-500',
      image: 'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg'
    },
    {
      name: 'Beauty & Health',
      icon: <FaSprayCan className="text-3xl" />,
      color: 'bg-pink-500',
      image: 'https://images.pexels.com/photos/3373739/pexels-photo-3373739.jpeg'
    }
  ]
  
  return (
    <div>
      <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">Shop by Category</h2>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 md:gap-6">
        {categories.map((category, index) => (
          <Link 
            key={index}
            to={`/products?category=${category.name}`}
            className="group"
          >
            <div className="relative overflow-hidden rounded-lg shadow-md aspect-square hover:shadow-lg transition-all duration-300">
              {/* Background Image */}
              <img 
                src={category.image} 
                alt={category.name}
                className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-110"
              />
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-30 transition-all duration-300"></div>
              
              {/* Content */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-4">
                <div className={`${category.color} p-3 rounded-full mb-3 group-hover:scale-110 transition-transform duration-300`}>
                  {category.icon}
                </div>
                <h3 className="text-center font-medium text-lg">
                  {category.name}
                </h3>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default FeaturedCategories