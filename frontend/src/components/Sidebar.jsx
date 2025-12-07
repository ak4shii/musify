import React from 'react'
import { Link } from 'react-router-dom'
import { assets } from '../assets/assets'
import { useAuth } from '../contexts/AuthContext'
import { usePlaylistModal } from '../contexts/PlaylistModalContext'
import toast from 'react-hot-toast'
import FavoritesPanel from './FavoritesPanel'

const Sidebar = () => {
  const { isAuthenticated } = useAuth()
  const { openCreateModal } = usePlaylistModal()

  const handleCreatePlaylist = () => {
    if (!isAuthenticated) {
      toast.error('Please log in to create playlist')
      return
    }
    openCreateModal()
  }

  const handlePlusIconClick = () => {
    if (!isAuthenticated) {
      toast.error('Please log in to create playlist')
      return
    }
    openCreateModal()
  }

  return (
    <div className='w-[300px] min-w-[300px] shrink-0 h-[94.75%] flex-col gap-0 text-white hidden lg:flex sticky overflow-hidden'>
      <div className='bg-[#121212] rounded mt-2 flex-1 flex flex-col'>
        <div className='flex items-center justify-between px-6 py-4'>
          <div className='flex items-center gap-3'>
            <Link to="/playlists" className='hover:opacity-70 transition-opacity'>
              <img className='w-6 h-6' src={assets.stack_icon} alt='Your Library' />
            </Link>
            <p className='font-semibold'>Your Library</p>
          </div>
          <button onClick={handlePlusIconClick} className='cursor-pointer hover:opacity-70 transition-opacity'>
            <img className='w-5 h-5 opacity-80' src={assets.plus_icon} alt='Add' />
          </button>
        </div>

        <div className='px-4 pb-24 flex flex-col gap-3 overflow-y-auto'>
          {!isAuthenticated && (
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
          )}
          <FavoritesPanel />
        </div>
      </div>
    </div>
  )
}

export default Sidebar