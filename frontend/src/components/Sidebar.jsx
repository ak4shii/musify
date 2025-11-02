import React from 'react'
import { assets } from '../assets/assets'
import { useAuth } from '../contexts/AuthContext'
import toast from 'react-hot-toast'

const Sidebar = () => {
  const { isAuthenticated } = useAuth()

  const handleCreatePlaylist = () => {
    if (!isAuthenticated) {
      toast.error('Please log in to create playlist')
      return
    }
  }

  const handlePlusIconClick = () => {
    if (!isAuthenticated) {
      toast.error('Please log in to create playlist')
      return
    }
  }

  const handleBrowsePodcasts = () => {
    if (!isAuthenticated) {
      toast.error('Please log in to browse podcasts')
      return
    }
  }

  return (
    <div className='w-[300px] h-[94.75%] flex-col gap-0 text-white hidden lg:flex sticky overflow-hidden'>
      <div className='bg-[#121212] rounded mt-2 flex-1 flex flex-col'>
        <div className='flex items-center justify-between px-6 py-4'>
          <div className='flex items-center gap-3'>
            <img className='w-6 h-6' src={assets.stack_icon} alt='Your Library' />
            <p className='font-semibold'>Your Library</p>
          </div>
          <button onClick={handlePlusIconClick} className='cursor-pointer hover:opacity-70 transition-opacity'>
            <img className='w-5 h-5 opacity-80' src={assets.plus_icon} alt='Add' />
          </button>
        </div>

        <div className='px-4 pb-24 flex flex-col gap-3 overflow-y-auto'>
          <div className='bg-[#1f1f1f] rounded p-4'>
            <p className='text-sm font-semibold mb-1'>Create your first playlist</p>
            <p className='text-xs text-[#b3b3b3] mb-3'>It's easy, we'll help you</p>
            <button 
              onClick={handleCreatePlaylist}
              className='inline-block bg-white text-black text-sm font-semibold px-3 py-1.5 rounded-full hover:bg-gray-200 transition-colors'
            >
              Create Playlist
            </button>
          </div>
          <div className='bg-[#1f1f1f] rounded p-4'>
            <p className='text-sm font-semibold mb-1'>Let's find some postcasts to follow</p>
            <p className='text-xs text-[#b3b3b3] mb-3'>We'll keep you updated on new episodes</p>
            <button 
              onClick={handleBrowsePodcasts}
              className='inline-block bg-white text-black text-sm font-semibold px-3 py-1.5 rounded-full hover:bg-gray-200 transition-colors'
            >
              Browse Podcasts
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Sidebar