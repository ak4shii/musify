import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const AdminRoute = ({ children }) => {
  const { user, isAuthenticated, loading } = useAuth()

  if (loading) {
    return (
      <div className='min-h-screen bg-black text-white flex items-center justify-center'>
        <div className='text-center'>
          <p className='text-gray-400'>Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (user?.role !== 'ROLE_ADMIN') {
    return <Navigate to="/" replace />
  }

  return children
}

export default AdminRoute


