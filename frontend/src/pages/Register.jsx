import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from "react-router-dom";
import apiClient from '../helpers/apiClient'
import { useAuth } from '../contexts/AuthContext'

const Register = () => {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  const [formData, setFormData] = useState({
    displayName: '',
    email: '',
    password: '',
    confirmPassword: '',
    month: 'Month',
    day: 'Day',
    year: 'Year'
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/')
    }
  }, [isAuthenticated, navigate])

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    })
    setError('')
  }

  const formatDateOfBirth = () => {
    if (formData.month === 'Month' || formData.day === 'Day' || formData.year === 'Year') {
      return null
    }
    
    const monthIndex = months.indexOf(formData.month)
    if (monthIndex === -1) return null
    
    const day = parseInt(formData.day)
    const year = parseInt(formData.year)
    
    const monthStr = String(monthIndex + 1).padStart(2, '0')
    const dayStr = String(day).padStart(2, '0')
    return `${year}-${monthStr}-${dayStr}`
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    
    if (formData.displayName.length < 8 || formData.displayName.length > 50) {
      setError('Display name must be between 8 and 50 characters')
      return
    }
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return
    }
    
    if (formData.password.length < 8 || formData.password.length > 20) {
      setError('Password must be between 8 and 20 characters')
      return
    }
    
    const dateOfBirth = formatDateOfBirth()
    if (!dateOfBirth) {
      setError('Please select a valid date of birth')
      return
    }

    setLoading(true)

    try {
      const payload = {
        userName: formData.displayName,
        email: formData.email,
        password: formData.password,
        dateOfBirth: dateOfBirth
      }
      
      const response = await apiClient.post('/auth/register', payload)
      
      if (response.data) {
        navigate('/login')
      }
    } catch (err) {
      
      if (err.response?.status === 400) {
        const errorData = err.response.data
        if (errorData && typeof errorData === 'object') {
          const message = Object.values(errorData)[0]
          setError(message)
        } else {
          setError('Invalid registration data. Please check your input.')
        }
      } else if (err.response?.data?.message) {
        setError(err.response.data.message)
      } else if (err.response?.data?.error) {
        setError(err.response.data.error)
      } else {
        setError('Registration failed. Please try again.')
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
          <h2 className='text-2xl font-bold mb-6 text-center'>Sign Up for Musify</h2>
          
          {error && (
            <div className='mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-md text-red-300 text-sm'>
              {error}
            </div>
          )}

          <form className='space-y-4' onSubmit={handleSubmit}>
            <div>
              <label htmlFor='displayName' className='block text-sm font-medium mb-2'>
                Display Name
              </label>
              <input
                type='text'
                id='displayName'
                value={formData.displayName}
                onChange={handleChange}
                required
                minLength={8}
                maxLength={50}
                className='w-full px-4 py-3 bg-[#1f1f1f] border border-white/20 rounded-md text-white placeholder-gray-400 focus:outline-none focus:border-white/40'
                placeholder='Enter your display name'
              />
            </div>

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
                minLength={8}
                maxLength={20}
                className='w-full px-4 py-3 bg-[#1f1f1f] border border-white/20 rounded-md text-white placeholder-gray-400 focus:outline-none focus:border-white/40'
                placeholder='Create a password'
              />
            </div>

            <div>
              <label htmlFor='confirmPassword' className='block text-sm font-medium mb-2'>
                Confirm Password
              </label>
              <input
                type='password'
                id='confirmPassword'
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className='w-full px-4 py-3 bg-[#1f1f1f] border border-white/20 rounded-md text-white placeholder-gray-400 focus:outline-none focus:border-white/40'
                placeholder='Confirm your password'
              />
            </div>

            <div>
              <label htmlFor='birthDate' className='block text-sm font-medium mb-2'>
                Date of Birth
              </label>
              <div className="flex gap-2 items-start">
                <select 
                  id="month"
                  value={formData.month}
                  onChange={handleChange}
                  required
                  className="flex-[2] pl-2 pr-3 py-3 bg-[#1f1f1f] border border-white/20 rounded-md text-white text-left focus:outline-none focus:border-white/40"
                >
                  <option>Month</option>
                  {months.map(month => (
                    <option key={month} value={month}>{month}</option>
                  ))}
                </select>

                <select 
                  id="day"
                  value={formData.day}
                  onChange={handleChange}
                  required
                  className="flex-[1] pl-2 pr-3 py-3 bg-[#1f1f1f] border border-white/20 rounded-md text-white text-left focus:outline-none focus:border-white/40"
                >
                  <option>Day</option>
                  {Array.from({ length: 31 }, (_, i) => (
                    <option key={i + 1} value={i + 1}>{i + 1}</option>
                  ))}
                </select>

                <select 
                  id="year"
                  value={formData.year}
                  onChange={handleChange}
                  required
                  className="w-[100px] pl-2 pr-3 py-3 bg-[#1f1f1f] border border-white/20 rounded-md text-white text-left focus:outline-none focus:border-white/40"
                >
                  <option>Year</option>
                  {Array.from({ length: 100 }, (_, i) => (
                    <option key={2024 - i} value={2024 - i}>{2024 - i}</option>
                  ))}
                </select>
              </div>
            </div>

            <button
              type='submit'
              disabled={loading}
              className='w-full bg-white text-black font-semibold py-3 rounded-full hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
            >
              {loading ? 'Signing up...' : 'Sign Up'}
            </button>
          </form>

          <div className='mt-6 text-center'>
            <p className='text-sm text-gray-400'>
              Already have an account?{' '}
              <Link to="/login" className="text-white hover:underline">
                Log in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register