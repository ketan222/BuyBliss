import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { FaSave, FaTimes, FaPlus, FaTrash } from 'react-icons/fa'
import { useAuth } from '../../context/AuthContext'
import { productService } from '../../services/productService'
import { PRODUCT_CATEGORIES } from '../../config/constants'

function EditProductPage() {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    discountPrice: '',
    stock: '',
    category: '',
    images: [''],
    featured: false
  })
  
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)
  
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true)
        const product = await productService.getProductById(id)
        
        // Check if the logged-in seller owns this product
        if (product.sellerId !== user._id) {
          setError('You do not have permission to edit this product')
          return
        }
        
        setFormData({
          name: product.name,
          description: product.description,
          price: product.price.toString(),
          discountPrice: product.discountPrice ? product.discountPrice.toString() : '',
          stock: product.stock.toString(),
          category: product.category,
          images: product.images.length ? product.images : [''],
          featured: product.featured || false
        })
        
        setError(null)
      } catch (err) {
        console.error('Failed to fetch product:', err)
        setError('Failed to load product data. Please try again.')
      } finally {
        setLoading(false)
      }
    }
    
    fetchProduct()
  }, [id, user._id])
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    })
  }
  
  const handleImageChange = (index, value) => {
    const newImages = [...formData.images]
    newImages[index] = value
    setFormData({
      ...formData,
      images: newImages
    })
  }
  
  const addImageField = () => {
    setFormData({
      ...formData,
      images: [...formData.images, '']
    })
  }
  
  const removeImageField = (index) => {
    const newImages = formData.images.filter((_, i) => i !== index)
    setFormData({
      ...formData,
      images: newImages.length ? newImages : ['']
    })
  }
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    
    try {
      // Validate form data
      if (!formData.name.trim()) throw new Error('Product name is required')
      if (!formData.description.trim()) throw new Error('Description is required')
      if (!formData.price || isNaN(formData.price) || formData.price <= 0) throw new Error('Valid price is required')
      if (!formData.stock || isNaN(formData.stock) || formData.stock < 0) throw new Error('Valid stock quantity is required')
      if (!formData.category) throw new Error('Category is required')
      if (formData.images.some(url => !url.trim())) throw new Error('All image URLs must be valid')
      
      // Convert numeric strings to numbers
      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        discountPrice: formData.discountPrice ? parseFloat(formData.discountPrice) : null
      }
      
      await productService.updateProduct(id, productData)
      navigate('/seller/products')
    } catch (err) {
      setError(err.message || 'Failed to update product. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }
  
  if (loading) {
    return (
      <div className="container-custom py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
          <div className="h-64 bg-gray-200 rounded mb-6"></div>
        </div>
      </div>
    )
  }
  
  if (error && !formData.name) {
    return (
      <div className="container-custom py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
        <button
          onClick={() => navigate('/seller/products')}
          className="btn-primary"
        >
          Back to Products
        </button>
      </div>
    )
  }
  
  return (
    <div className="container-custom py-8">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Edit Product</h1>
        <p className="text-gray-600">Update your product information</p>
      </div>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Information */}
            <div className="md:col-span-2">
              <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Product Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="input-field"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                  Category *
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="input-field"
                  required
                >
                  <option value="">Select Category</option>
                  {PRODUCT_CATEGORIES.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                  Price ($) *
                </label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  min="0.01"
                  step="0.01"
                  className="input-field"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="discountPrice" className="block text-sm font-medium text-gray-700 mb-1">
                  Discount Price ($)
                </label>
                <input
                  type="number"
                  id="discountPrice"
                  name="discountPrice"
                  value={formData.discountPrice}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  placeholder="Leave empty for no discount"
                  className="input-field"
                />
              </div>
              
              <div>
                <label htmlFor="stock" className="block text-sm font-medium text-gray-700 mb-1">
                  Stock Quantity *
                </label>
                <input
                  type="number"
                  id="stock"
                  name="stock"
                  value={formData.stock}
                  onChange={handleChange}
                  min="0"
                  className="input-field"
                  required
                />
              </div>
              
              <div className="flex items-center mt-4">
                <input
                  type="checkbox"
                  id="featured"
                  name="featured"
                  checked={formData.featured}
                  onChange={handleChange}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label htmlFor="featured" className="ml-2 block text-sm text-gray-700">
                  Feature this product on the homepage
                </label>
              </div>
            </div>
            
            <div>
              <div className="mb-4">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Product Description *
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows="8"
                  value={formData.description}
                  onChange={handleChange}
                  className="input-field"
                  required
                />
                <p className="mt-1 text-sm text-gray-500">
                  Provide a detailed description of your product including features, materials, and use cases.
                </p>
              </div>
            </div>
            
            {/* Product Images */}
            <div className="md:col-span-2 mt-6">
              <h2 className="text-xl font-semibold mb-4">Product Images</h2>
              <p className="text-sm text-gray-500 mb-4">
                Add image URLs for your product. The first image will be used as the main product image.
              </p>
              
              {formData.images.map((url, index) => (
                <div key={index} className="flex mb-3">
                  <input
                    type="text"
                    value={url}
                    onChange={(e) => handleImageChange(index, e.target.value)}
                    placeholder="Enter image URL"
                    className="input-field flex-1"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => removeImageField(index)}
                    className="ml-2 text-red-600 hover:text-red-800"
                    disabled={formData.images.length === 1}
                  >
                    <FaTrash />
                  </button>
                </div>
              ))}
              
              <button
                type="button"
                onClick={addImageField}
                className="text-primary-600 hover:text-primary-800 flex items-center text-sm mt-2"
              >
                <FaPlus className="mr-1" /> Add Another Image URL
              </button>
            </div>
          </div>
          
          <div className="mt-8 pt-6 border-t border-gray-200 flex justify-end">
            <button
              type="button"
              onClick={() => navigate('/seller/products')}
              className="btn-outline mr-4"
            >
              <FaTimes className="mr-2" /> Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={submitting}
            >
              <FaSave className="mr-2" /> {submitting ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditProductPage