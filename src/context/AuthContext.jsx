import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { authService } from '../services/authService'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  // Check if user is already logged in (from localStorage)
  const checkAuth = useCallback(async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem('token')
      if (token) {
        const userData = await authService.getUserData()
        setUser(userData)
      }
    } catch (err) {
      console.error('Auth check failed:', err)
      localStorage.removeItem('token')
      setUser(null)
    } finally {
      setLoading(false)
    }
  }, [])
  
  useEffect(() => {
    checkAuth()
  }, [checkAuth])
  
  // Login function
  const login = async (email, password) => {
    setLoading(true)
    setError(null)
    
    try {
      const { token, user } = await authService.login(email, password)
      localStorage.setItem('token', token)
      setUser(user)
      return user
    } catch (err) {
      setError(err.message || 'Login failed')
      throw err
    } finally {
      setLoading(false)
    }
  }
  
  // Register function
  const register = async (userData) => {
    setLoading(true)
    setError(null)
    
    try {
      const { token, user } = await authService.register(userData)
      localStorage.setItem('token', token)
      setUser(user)
      return user
    } catch (err) {
      setError(err.message || 'Registration failed')
      throw err
    } finally {
      setLoading(false)
    }
  }
  
  // Logout function
  const logout = () => {
    localStorage.removeItem('token')
    setUser(null)
  }
  
  // Update user profile
  const updateProfile = async (userData) => {
    setLoading(true)
    setError(null)
    
    try {
      const updatedUser = await authService.updateProfile(userData)
      setUser(updatedUser)
      return updatedUser
    } catch (err) {
      setError(err.message || 'Profile update failed')
      throw err
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <AuthContext.Provider 
      value={{
        user,
        loading,
        error,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        updateProfile,
        checkAuth
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)