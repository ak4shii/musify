import React, { useState } from 'react'
import { Link, useNavigate } from "react-router-dom";
import apiClient from '../helpers/apiClient'
import { useAuth } from '../contexts/AuthContext'

const Login = () => {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    })
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const payload = {
        email: formData.email,
        password: formData.password
      }
      
      console.log('Sending login request with data:', payload)
      const response = await apiClient.post('/auth/login', payload)
      
      console.log('Login response:', response.data)
      console.log('Login response keys:', response.data ? Object.keys(response.data) : 'no data')
      
      if (response.data) {
        const token = response.data.token || 
                     response.data.jwt || 
                     response.data.accessToken || 
                     response.data.jwtToken ||
                     response.data.access_token;
        
        if (token) {
          localStorage.setItem('token', token)
          console.log('Token stored in localStorage:', token.substring(0, 20) + '...')
        } else {
          console.warn('No token found in response. Available fields:', Object.keys(response.data))
        }
        
        let userData = null
        
        if (response.data.user) {
          userData = response.data.user
        } else if (response.data.userName || response.data.email) {
          userData = response.data
        } else {
          userData = response.data
        }
        
        if (userData && (userData.userName || userData.email)) {
          console.log('Storing user data:', userData)
          localStorage.setItem('user', JSON.stringify(userData))
          login(userData)
        } else {
          console.warn('No valid user data found in response:', response.data)
        }
        
        navigate('/')
      }
    } catch (err) {
      console.error('Login error:', err)
      console.error('Error response:', err.response?.data)

      if (err.response?.status === 400) {
        const errorData = err.response.data
        if (errorData.errors && Array.isArray(errorData.errors)) {
          const errorMessages = errorData.errors.map(e => e.defaultMessage || e.message).join(', ')
          setError(errorMessages)
        } else if (errorData.message) {
          setError(errorData.message)
        } else {
          setError('Invalid login data. Please check your input.')
        }
      } else if (err.response?.status === 401) {
        setError('Invalid email or password. Please try again.')
      } else if (err.response?.data?.message) {
        setError(err.response.data.message)
      } else if (err.response?.data?.error) {
        setError(err.response.data.error)
      } else {
        setError('Login failed. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='min-h-screen bg-black text-white flex items-center justify-center'>
      <div className='w-full max-w-md px-8 py-12'>
        <div className='text-center mb-8'>
          <Link to="/" className='inline-block'>
            <img src="/logo.png" alt="Musify" className='w-16 h-16 mx-auto mb-4 cursor-pointer hover:opacity-80 transition-opacity' />
          </Link>
          <h1 className='text-3xl font-bold'>Musify</h1>
        </div>

        <div className='bg-[#121212] rounded-lg p-8'>
          <h2 className='text-2xl font-bold mb-6 text-center'>Log In to Musify</h2>
          
          {error && (
            <div className='mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-md text-red-300 text-sm'>
              {error}
            </div>
          )}

          <form className='space-y-4' onSubmit={handleSubmit}>
            <div>
              <label htmlFor='email' className='block text-sm font-medium mb-2'>
                Email Address
              </label>
              <input
                type='email'
                id='email'
                value={formData.email}
                onChange={handleChange}
                required
                className='w-full px-4 py-3 bg-[#1f1f1f] border border-white/20 rounded-md text-white placeholder-gray-400 focus:outline-none focus:border-white/40'
                placeholder='Enter your email'
              />
            </div>

            <div>
              <label htmlFor='password' className='block text-sm font-medium mb-2'>
                Password
              </label>
              <input
                type='password'
                id='password'
                value={formData.password}
                onChange={handleChange}
                required
                className='w-full px-4 py-3 bg-[#1f1f1f] border border-white/20 rounded-md text-white placeholder-gray-400 focus:outline-none focus:border-white/40'
                placeholder='Enter your password'
              />
            </div>

            <button
              type='submit'
              disabled={loading}
              className='w-full bg-white text-black font-semibold py-3 rounded-full hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
            >
              {loading ? 'Logging in...' : 'Log In'}
            </button>
          </form>

          <div className='mt-6 text-center'>
            <p className='text-sm text-gray-400'>
              Don't have an account?{' '}
              <Link to="/register" className="text-white hover:underline">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login