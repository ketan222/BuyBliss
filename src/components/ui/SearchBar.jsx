import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FaSearch } from 'react-icons/fa'

function SearchBar() {
  const [searchTerm, setSearchTerm] = useState('')
  const navigate = useNavigate()
  
  const handleSearch = (e) => {
    e.preventDefault()
    if (searchTerm.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchTerm.trim())}`)
      setSearchTerm('')
    }
  }
  
  return (
    <form onSubmit={handleSearch} className="relative">
      <input
        type="text"
        placeholder="Search products..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full py-2 pl-10 pr-4 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-500"
      />
      <button
        type="submit"
        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
      >
        <FaSearch />
      </button>
    </form>
  )
}

export default SearchBar