import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react'
import apiClient from '../helpers/apiClient'

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
            setUser(null)
          }
        } else {
          setUser(null)
        }
      } catch (error) {
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

  const login = useCallback((userData) => {
    try {
      if (typeof userData === 'object') {
        localStorage.setItem('user', JSON.stringify(userData))
        setUser(userData)
      }
    } catch (error) {
    }
  }, [])

  const logout = useCallback(async () => {
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
  }, [])

  const isAuthenticated = useMemo(() => {
    return user !== null && (user.userName || user.email)
  }, [user])

  const value = useMemo(() => ({
    user,
    loading,
    login,
    logout,
    isAuthenticated
  }), [user, loading, login, logout, isAuthenticated])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

