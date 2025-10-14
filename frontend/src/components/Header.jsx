import React from 'react'
import { Link } from "react-router-dom";

import { assets } from '../assets/assets'

const Header = () => {
  return (
    <div className='w-full bg-[#0e0e0e] text-white'>
      <div className='max-w-[2000px] mx-auto px-6 py-3 grid grid-cols-3 items-center gap-4'>
        <div className='flex items-center gap-3'>
          <img className='w-6 h-6' src={assets.home_icon} alt='Home' />
        </div>

        <div className='justify-self-center w-full max-w-[600px] hidden sm:flex items-center gap-2 bg-white/10 rounded-full px-4 py-2'>
          <img className='w-4 h-4 opacity-80' src={assets.search_icon} alt='Search' />
          <p className='text-sm text-[#b3b3b3]'>What do you want to play?</p>
        </div>

        <div className='flex items-center gap-4 justify-self-end'>
          <Link to="/support" className='text-sm text-[#b3b3b3] hover:text-white'>
            Support
          </Link>
          <div className='flex items-center gap-2'>
            <Link to="/login" className='px-4 py-1.5 rounded-full bg-transparent border border-white/30 text-sm'>Log in</Link>
            <Link to="/register" className='px-4 py-1.5 rounded-full bg-white text-black text-sm font-semibold'>Sign up</Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Header