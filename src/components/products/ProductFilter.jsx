import { useState } from 'react'
import { FaFilter, FaTimes } from 'react-icons/fa'
import { PRODUCT_CATEGORIES } from '../../config/constants'

function ProductFilter({ onFilter }) {
  const [filterOpen, setFilterOpen] = useState(false)
  const [filters, setFilters] = useState({
    category: '',
    minPrice: '',
    maxPrice: '',
    sort: 'newest'
  })
  
  const handleChange = (e) => {
    const { name, value } = e.target
    setFilters({
      ...filters,
      [name]: value
    })
  }
  
  const handleSubmit = (e) => {
    e.preventDefault()
    onFilter(filters)
    if (window.innerWidth < 768) {
      setFilterOpen(false)
    }
  }
  
  const handleReset = () => {
    setFilters({
      category: '',
      minPrice: '',
      maxPrice: '',
      sort: 'newest'
    })
    onFilter({
      category: '',
      minPrice: '',
      maxPrice: '',
      sort: 'newest'
    })
  }
  
  return (
    <div className="mb-8">
      {/* Mobile Toggle Button */}
      <button
        className="md:hidden w-full flex items-center justify-between bg-white p-4 rounded-lg shadow mb-4"
        onClick={() => setFilterOpen(!filterOpen)}
      >
        <div className="flex items-center">
          <FaFilter className="mr-2 text-gray-600" />
          <span className="font-medium">Filter Products</span>
        </div>
        <span>{filterOpen ? <FaTimes /> : '+'}</span>
      </button>
      
      {/* Filter Form */}
      <div className={`bg-white rounded-lg shadow p-6 ${filterOpen ? 'block' : 'hidden md:block'}`}>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              id="category"
              name="category"
              value={filters.category}
              onChange={handleChange}
              className="input-field"
            >
              <option value="">All Categories</option>
              {PRODUCT_CATEGORIES.map(category => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Price Range
            </label>
            <div className="flex space-x-2">
              <input
                type="number"
                name="minPrice"
                placeholder="Min"
                value={filters.minPrice}
                onChange={handleChange}
                className="input-field"
                min="0"
              />
              <input
                type="number"
                name="maxPrice"
                placeholder="Max"
                value={filters.maxPrice}
                onChange={handleChange}
                className="input-field"
                min="0"
              />
            </div>
          </div>
          
          <div className="mb-6">
            <label htmlFor="sort" className="block text-sm font-medium text-gray-700 mb-1">
              Sort By
            </label>
            <select
              id="sort"
              name="sort"
              value={filters.sort}
              onChange={handleChange}
              className="input-field"
            >
              <option value="newest">Newest</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>
          
          <div className="flex space-x-4">
            <button
              type="submit"
              className="w-full btn-primary"
            >
              Apply Filters
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="btn-outline"
            >
              Reset
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ProductFilter