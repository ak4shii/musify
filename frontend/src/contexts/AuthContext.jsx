/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect, useMemo } from 'react'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadUser = () => {
      try {
        const userData = localStorage.getItem('user')
        if (userData) {
          try {
            const parsedUser = JSON.parse(userData)
            if (parsedUser && (parsedUser.userName || parsedUser.email)) {
              setUser(parsedUser)
            } else {
              setUser(null)
            }
          } catch (parseError) {
            console.error('Error parsing user data:', parseError)
            setUser(null)
          }
        } else {
          setUser(null)
        }
      } catch (error) {
        console.error('Error loading user from localStorage:', error)
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    loadUser()
    
    const handleStorageChange = (e) => {
      if (e.key === 'user') {
        loadUser()
      }
    }
    
    window.addEventListener('storage', handleStorageChange)
    
    return () => {
      window.removeEventListener('storage', handleStorageChange)
    }
  }, [])

  const login = (userData) => {
    try {
      if (typeof userData === 'object') {
        localStorage.setItem('user', JSON.stringify(userData))
        setUser(userData)
      }
    } catch (error) {
      console.error('Error storing user data:', error)
    }
  }

  const logout = () => {
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    localStorage.removeItem('userId')
    localStorage.removeItem('userName')
    localStorage.removeItem('email')
    localStorage.removeItem('profileUrl')
    localStorage.removeItem('dateOfBirth')
    localStorage.removeItem('role')
    localStorage.removeItem('enabled')
    setUser(null)
  }

  const isAuthenticated = useMemo(() => {
    return user !== null && (user.userName || user.email)
  }, [user])

  const value = useMemo(() => ({
    user,
    loading,
    login,
    logout,
    isAuthenticated
  }), [user, loading, isAuthenticated])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

