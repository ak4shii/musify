import React from 'react'
import { Link } from "react-router-dom";

import { assets } from '../assets/assets'

const Login = () => {
  return (
    <div className='min-h-screen bg-black text-white flex items-center justify-center'>
      <div className='w-full max-w-md px-8 py-12'>
        {/* Logo */}
        <div className='text-center mb-8'>
          <img src="/logo.png" alt="Musify" className='w-16 h-16 mx-auto mb-4' />
          <h1 className='text-3xl font-bold'>Musify</h1>
        </div>

        {/* Login Form */}
        <div className='bg-[#121212] rounded-lg p-8'>
          <h2 className='text-2xl font-bold mb-6 text-center'>Log In to Musify</h2>
          
          <form className='space-y-4'>
            <div>
              <label htmlFor='email' className='block text-sm font-medium mb-2'>
                Email address
              </label>
              <input
                type='email'
                id='email'
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
                className='w-full px-4 py-3 bg-[#1f1f1f] border border-white/20 rounded-md text-white placeholder-gray-400 focus:outline-none focus:border-white/40'
                placeholder='Enter your password'
              />
            </div>

            <div className='flex items-center justify-between'>
              <label className='flex items-center'>
                <input type='checkbox' className='mr-2' />
                <span className='text-sm'>Remember me</span>
              </label>
              <a href='#' className='text-sm text-green-400 hover:text-green-300'>
                Forgot password?
              </a>
            </div>

            <button
              type='submit'
              className='w-full bg-white text-black font-semibold py-3 rounded-full hover:bg-gray-200 transition-colors'
            >
              Log In
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