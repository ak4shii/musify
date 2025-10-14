import React from 'react'
import { Link } from "react-router-dom";

import { assets } from '../assets/assets'

const Register = () => {
  return (
    <div className='min-h-screen bg-black text-white flex items-center justify-center'>
      <div className='w-full max-w-md px-8 py-12'>
        <div className='text-center mb-8'>
          <img src="/logo.png" alt="Musify" className='w-16 h-16 mx-auto mb-4' />
          <h1 className='text-3xl font-bold'>Musify</h1>
        </div>

        <div className='bg-[#121212] rounded-lg p-8'>
          <h2 className='text-2xl font-bold mb-6 text-center'>Sign Up for Musify</h2>
          
          <form className='space-y-4'>
            <div>
              <label htmlFor='displayName' className='block text-sm font-medium mb-2'>
                Display name
              </label>
              <input
                type='text'
                id='displayName'
                className='w-full px-4 py-3 bg-[#1f1f1f] border border-white/20 rounded-md text-white placeholder-gray-400 focus:outline-none focus:border-white/40'
                placeholder='Enter your display name'
              />
            </div>

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
                placeholder='Create a password'
              />
            </div>

            <div>
              <label htmlFor='confirmPassword' className='block text-sm font-medium mb-2'>
                Confirm password
              </label>
              <input
                type='password'
                id='confirmPassword'
                className='w-full px-4 py-3 bg-[#1f1f1f] border border-white/20 rounded-md text-white placeholder-gray-400 focus:outline-none focus:border-white/40'
                placeholder='Confirm your password'
              />
            </div>

            <div>
              <label htmlFor='birthDate' className='block text-sm font-medium mb-2'>
                Date of birth
              </label>
              <div className="flex gap-2 items-start">
                <select className="flex-[2] pl-2 pr-3 py-3 bg-[#1f1f1f] border border-white/20 rounded-md text-white text-left focus:outline-none focus:border-white/40">
                  <option>Month</option>
                  <option>January</option>
                  <option>February</option>
                  <option>March</option>
                  <option>April</option>
                  <option>May</option>
                  <option>June</option>
                  <option>July</option>
                  <option>August</option>
                  <option>September</option>
                  <option>October</option>
                  <option>November</option>
                  <option>December</option>
                </select>

                <select className="flex-[1] pl-2 pr-3 py-3 bg-[#1f1f1f] border border-white/20 rounded-md text-white text-left focus:outline-none focus:border-white/40">
                  <option>Day</option>
                  {Array.from({ length: 31 }, (_, i) => (
                    <option key={i + 1}>{i + 1}</option>
                  ))}
                </select>

                <select className="w-[100px] pl-2 pr-3 py-3 bg-[#1f1f1f] border border-white/20 rounded-md text-white text-left focus:outline-none focus:border-white/40">
                  <option>Year</option>
                  {Array.from({ length: 100 }, (_, i) => (
                    <option key={2024 - i}>{2024 - i}</option>
                  ))}
                </select>
              </div>
            </div>

            <button
              type='submit'
              className='w-full bg-white text-black font-semibold py-3 rounded-full hover:bg-gray-200 transition-colors'
            >
              Sign Up
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