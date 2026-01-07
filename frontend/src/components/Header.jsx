import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from '../contexts/AuthContext';
import { usePlayer } from '../contexts/PlayerContext';
import { useUserModal } from '../contexts/UserModalContext';
import { getImageUrl } from '../helpers/apiClient';

import { assets } from '../assets/assets'

const Header = () => {
  const { user, isAuthenticated, logout } = useAuth()
  const { stopAndReset } = usePlayer()
  const { openEditModal } = useUserModal()
  const [searchQuery, setSearchQuery] = useState('')
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = async () => {
    stopAndReset()
    await logout()
    navigate('/')
  }

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const q = params.get('q') || ''
    setSearchQuery(q)
  }, [location.search])

  useEffect(() => {
    if (location.pathname === '/search') {
      const currentQuery = new URLSearchParams(location.search).get('q') || ''
      const trimmedQuery = searchQuery.trim()

      if (currentQuery !== trimmedQuery) {
        const timer = setTimeout(() => {
          if (trimmedQuery) {
            navigate(`/search?q=${encodeURIComponent(trimmedQuery)}`, { replace: true })
          } else {
            navigate('/search', { replace: true })
          }
        }, 300)

        return () => clearTimeout(timer)
      }
    }
  }, [searchQuery, location.pathname, location.search, navigate])

  const handleSearch = (e) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  return (
    <div className='w-full bg-[#0e0e0e] text-white'>
      <div className='max-w-[2000px] mx-auto px-6 py-3 grid grid-cols-3 items-center gap-4'>
        <div className='flex items-center gap-3'>
          <Link to="/" className='hover:opacity-60 transition-opacity'>
            <img className='w-6 h-6 cursor-pointer' src={assets.home_icon} alt='Home' />
          </Link>
        </div>

        <div className='justify-self-center w-full max-w-[600px] hidden sm:flex items-center gap-3'>
          <div className='flex-1 flex items-center gap-2 bg-white/10 rounded-full px-4 py-2'>
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
          {isAuthenticated && (
            <Link to="/followed-artists" className='hover:opacity-60 transition-opacity'>
              <svg className='w-6 h-6 cursor-pointer' fill='none' stroke='currentColor' strokeWidth='2' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'>
                <path strokeLinecap='round' strokeLinejoin='round' d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' />
              </svg>
            </Link>
          )}
        </div>

        <div className='flex items-center gap-4 justify-self-end'>
          <Link to="/support" className='text-sm text-[#b3b3b3] hover:text-white'>
            Support
          </Link>
          {isAuthenticated ? (
            <div className='flex items-center gap-3'>
              {user?.profileUrl ? (
                <img
                  src={getImageUrl(user.profileUrl)}
                  alt={user.userName || user.email}
                  onClick={openEditModal}
                  className='w-8 h-8 rounded-full object-cover cursor-pointer hover:opacity-80 transition-opacity'
                />
              ) : (
                <span
                  onClick={openEditModal}
                  className='text-sm text-white cursor-pointer hover:text-white/80 transition-colors'
                >
                  {user?.userName || user?.email}
                </span>
              )}
              <button
                onClick={handleLogout}
                className='px-4 py-1.5 rounded-full bg-transparent border border-white/30 text-sm hover:bg-white/10 transition-colors'
              >
                Log out
              </button>
            </div>
          ) : (
            <div className='flex items-center gap-2'>
              <Link to="/login" className='px-4 py-1.5 rounded-full bg-transparent border border-white/30 text-sm'>Log in</Link>
              <Link to="/register" className='px-4 py-1.5 rounded-full bg-white text-black text-sm font-semibold'>Sign up</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Header