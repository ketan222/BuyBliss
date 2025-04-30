import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

function SellerRoute() {
  const { user, isAuthenticated, loading } = useAuth()
  
  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }
  
  if (user.role !== 'seller') {
    return <Navigate to="/" replace />
  }
  
  return <Outlet />
}

export default SellerRoute