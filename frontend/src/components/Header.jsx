import React, { useState } from 'react'
import { Link, useNavigate } from "react-router-dom";

import { assets } from '../assets/assets'

const Header = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const navigate = useNavigate()

  const handleSearch = (e) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  return (
    <div className='w-full bg-[#0e0e0e] text-white'>
      <div className='max-w-[2000px] mx-auto px-6 py-3 grid grid-cols-3 items-center gap-4'>
        <div className='flex items-center gap-3'>
          <Link to="/">
            <img className='w-6 h-6 cursor-pointer' src={assets.home_icon} alt='Home' />
          </Link>
        </div>

        <div className='justify-self-center w-full max-w-[600px] hidden sm:flex items-center gap-2 bg-white/10 rounded-full px-4 py-2'>
          <img className='w-4 h-4 opacity-80' src={assets.search_icon} alt='Search' />
          <input
            type='text'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleSearch}
            placeholder='What do you want to play?'
            className='flex-1 bg-transparent outline-none text-sm text-white placeholder:text-[#b3b3b3]'
            aria-label='Search'
          />
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