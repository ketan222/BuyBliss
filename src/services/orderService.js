import axios from 'axios'
import { API_URL } from '../config/constants'

// Create an axios instance with base URL
const api = axios.create({
  baseURL: API_URL
})

// Add token to requests if available
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  error => Promise.reject(error)
)

// Mock orders for development
const mockOrders = [
  {
    _id: '101',
    userId: '1',
    items: [
      {
        product: {
          _id: '1',
          name: 'Wireless Bluetooth Headphones',
          price: 129.99,
          discountPrice: 99.99,
          images: ['https://images.pexels.com/photos/3394665/pexels-photo-3394665.jpeg']
        },
        quantity: 1,
        price: 99.99
      },
      {
        product: {
          _id: '3',
          name: 'Organic Cotton T-Shirt',
          price: 29.99,
          discountPrice: null,
          images: ['https://images.pexels.com/photos/5384423/pexels-photo-5384423.jpeg']
        },
        quantity: 2,
        price: 59.98
      }
    ],
    totalAmount: 159.97,
    status: 'delivered',
    shippingAddress: {
      street: '123 Main St',
      city: 'Anytown',
      state: 'CA',
      zipCode: '12345',
      country: 'USA'
    },
    paymentMethod: 'credit_card',
    createdAt: '2023-04-15T10:30:00.000Z'
  },
  {
    _id: '102',
    userId: '1',
    items: [
      {
        product: {
          _id: '4',
          name: 'Professional Blender',
          price: 89.99,
          discountPrice: 69.99,
          images: ['https://images.pexels.com/photos/4439724/pexels-photo-4439724.jpeg']
        },
        quantity: 1,
        price: 69.99
      }
    ],
    totalAmount: 69.99,
    status: 'shipped',
    shippingAddress: {
      street: '123 Main St',
      city: 'Anytown',
      state: 'CA',
      zipCode: '12345',
      country: 'USA'
    },
    paymentMethod: 'paypal',
    createdAt: '2023-05-20T14:45:00.000Z'
  }
]

const mockOrderService = {
  getOrders: async () => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800))
    
    return mockOrders
  },
  
  getOrderById: async (id) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500))
    
    const order = mockOrders.find(o => o._id === id)
    
    if (!order) {
      throw new Error('Order not found')
    }
    
    return order
  },
  
  createOrder: async (orderData) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1200))
    
    const newOrder = {
      _id: `order_${Date.now()}`,
      ...orderData,
      status: 'pending',
      createdAt: new Date().toISOString()
    }
    
    mockOrders.push(newOrder)
    
    return newOrder
  }
}

// Export service functions
export const orderService = {
  getOrders: async () => {
    try {
      // In dev mode, use mock service
      if (import.meta.env.DEV) {
        return await mockOrderService.getOrders()
      }
      
      // In production, use real API
      const response = await api.get('/orders')
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get orders')
    }
  },
  
  getOrderById: async (id) => {
    try {
      // In dev mode, use mock service
      if (import.meta.env.DEV) {
        return await mockOrderService.getOrderById(id)
      }
      
      // In production, use real API
      const response = await api.get(`/orders/${id}`)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get order')
    }
  },
  
  createOrder: async (orderData) => {
    try {
      // In dev mode, use mock service
      if (import.meta.env.DEV) {
        return await mockOrderService.createOrder(orderData)
      }
      
      // In production, use real API
      const response = await api.post('/orders', orderData)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to create order')
    }
  }
}