import React, { useEffect, useState, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { assets } from '../assets/assets'
import { useAuth } from '../contexts/AuthContext'
import { usePlaylistModal } from '../contexts/PlaylistModalContext'
import toast from '../helpers/singleToast'
import apiClient, { getImageUrl } from '../helpers/apiClient'
import FavoritesPanel from './FavoritesPanel'

const Sidebar = () => {
  const navigate = useNavigate()
  const { isAuthenticated, user } = useAuth()
  const { openCreateModal } = usePlaylistModal()
  const [playlists, setPlaylists] = useState([])
  const [loadingPlaylists, setLoadingPlaylists] = useState(false)

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

  const fetchPlaylists = useCallback(async () => {
    if (!isAuthenticated) {
      setPlaylists([])
      return
    }
    const userId = user?.userId ?? user?.id ?? Number(localStorage.getItem('userId'))
    if (!userId) return
    try {
      setLoadingPlaylists(true)
      const token = localStorage.getItem('token')
      const { data } = await apiClient.get(`/users/${userId}/playlists`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      })
      setPlaylists(data || [])
    } catch (err) {
      setPlaylists([])
    } finally {
      setLoadingPlaylists(false)
    }
  }, [isAuthenticated, user])

  useEffect(() => {
    fetchPlaylists()

    const handlePlaylistCreated = () => {
      fetchPlaylists()
    }

    const handlePlaylistDeleted = () => {
      fetchPlaylists()
    }

    window.addEventListener('playlistCreated', handlePlaylistCreated)
    window.addEventListener('playlistDeleted', handlePlaylistDeleted)
    return () => {
      window.removeEventListener('playlistCreated', handlePlaylistCreated)
      window.removeEventListener('playlistDeleted', handlePlaylistDeleted)
    }
  }, [fetchPlaylists])

  return (
    <div className='w-[300px] min-w-[300px] shrink-0 h-[94.75%] flex-col gap-0 text-white hidden lg:flex sticky overflow-hidden'>
      <div className='bg-[#121212] rounded mt-2 flex-1 flex flex-col'>
        <div className='flex items-center justify-between px-6 py-4'>
          <div className='flex items-center gap-3'>
            <button
              type="button"
              className='hover:opacity-70 transition-opacity'
              onClick={() => {
                if (!isAuthenticated) {
                  toast.error('Please log in to see your playlist')
                  return
                }
                navigate('/playlists')
              }}
            >
              <img className='w-6 h-6' src={assets.stack_icon} alt='Your Library' />
            </button>
            <p className='font-semibold'>Your Library</p>
          </div>
          <button onClick={handlePlusIconClick} className='cursor-pointer hover:opacity-70 transition-opacity'>
            <img className='w-5 h-5 opacity-80' src={assets.plus_icon} alt='Add' />
          </button>
        </div>

        <div className='px-4 pb-24 flex flex-col gap-1 overflow-y-auto'>
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
          {isAuthenticated && playlists.length > 0 && (
            <div className='flex flex-col gap-1'>
              {playlists.map((pl) => (
                <Link
                  key={pl.playlistId}
                  to={`/playlists/${pl.playlistId}`}
                  className='flex items-center gap-3 hover:bg-white/5 rounded px-2 py-2 transition-colors'
                >
                  <div className='w-10 h-10 rounded bg-gradient-to-br from-[#8B5CF6] to-[#3B82F6] overflow-hidden flex-shrink-0'>
                    {pl.coverUrl ? (
                      <img
                        src={getImageUrl(pl.coverUrl)}
                        alt={pl.playlistName}
                        className='w-full h-full object-cover'
                        onError={(e) => { e.target.style.display = 'none' }}
                      />
                    ) : null}
                  </div>
                  <div className='min-w-0'>
                    <p className='text-sm font-medium truncate'>{pl.playlistName}</p>
                    <p className='text-[11px] text-white/60'>{pl.isPublic ? 'Public' : 'Private'}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Sidebar