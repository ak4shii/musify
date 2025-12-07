import React, { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import apiClient from '../../helpers/apiClient'
import toast from 'react-hot-toast'

const PlaylistSelectionModal = ({ isOpen, onClose, track }) => {
  const { user } = useAuth()
  const [playlists, setPlaylists] = useState([])
  const [loading, setLoading] = useState(false)

  const getUserId = () => {
    if (user?.userId != null) return user.userId
    if (user?.id != null) return user.id
    const fallback = localStorage.getItem('userId')
    return fallback ? Number(fallback) : null
  }

  const fetchPlaylists = async () => {
    const userId = getUserId()
    if (!userId) return

    try {
      setLoading(true)
      const token = localStorage.getItem('token')
      const response = await apiClient.get(`/users/${userId}/playlists`, {
        headers: token ? { 'Authorization': `Bearer ${token}` } : {}
      })
      setPlaylists(response.data || [])
    } catch (err) {
      console.error('Error fetching playlists:', err)
      toast.error('Failed to load playlists')
    } finally {
      setLoading(false)
    }
  }

  const handleAddToPlaylist = async (playlistId) => {
    const userId = getUserId()
    const trackId = track?.trackId || track?.id
    if (!userId || !trackId) {
      toast.error('Missing required information')
      return
    }

    try {
      const token = localStorage.getItem('token')
      await apiClient.post(
        `/users/${userId}/playlists/${playlistId}/add-track/${trackId}`,
        {},
        {
          headers: token ? { 'Authorization': `Bearer ${token}` } : {}
        }
      )
      toast.success('Track added to playlist')
      onClose()
    } catch (err) {
      console.error('Error adding track to playlist:', err)
      toast.error(err.response?.data?.message || 'Failed to add track to playlist')
    }
  }

  useEffect(() => {
    if (isOpen) {
      fetchPlaylists()
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className='fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4' onClick={onClose}>
      <div className='bg-[#181818] rounded-2xl p-6 max-w-md w-full' onClick={(e) => e.stopPropagation()}>
        <h2 className='text-2xl font-bold mb-4'>Add to Playlist</h2>
        <p className='text-sm text-white/70 mb-4'>
          Select a playlist to add &quot;{track?.title || track?.trackName || 'this track'}&quot;
        </p>
        
        {loading ? (
          <div className='flex items-center justify-center py-8'>
            <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-white'></div>
          </div>
        ) : playlists.length === 0 ? (
          <div className='text-center py-8'>
            <p className='text-white/60 text-sm mb-4'>You have no playlists yet</p>
            <button
              onClick={() => {
                onClose()
                window.location.href = '/playlists'
              }}
              className='px-4 py-2 rounded-full bg-white text-black font-semibold hover:bg-gray-200 transition-colors text-sm'
            >
              Create Playlist
            </button>
          </div>
        ) : (
          <div className='max-h-96 overflow-y-auto custom-scrollbar space-y-1'>
            {playlists.map((playlist) => (
              <button
                key={playlist.playlistId}
                onClick={() => handleAddToPlaylist(playlist.playlistId)}
                className='w-full px-4 py-3 rounded-lg hover:bg-white/10 transition-colors text-left flex items-center gap-3'
              >
                <div className='w-10 h-10 rounded bg-gradient-to-br from-[#8B5CF6] to-[#3B82F6] flex items-center justify-center flex-shrink-0'>
                  <svg className='w-5 h-5 text-white opacity-80' fill='currentColor' viewBox='0 0 24 24'>
                    <path d='M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-1 9H9V9h10v2zm-4 4H9v-2h6v2zm4-8H9V5h10v2z' />
                  </svg>
                </div>
                <div className='flex-1 min-w-0'>
                  <p className='font-medium text-sm truncate'>{playlist.playlistName}</p>
                  <p className='text-xs text-white/60'>{playlist.isPublic ? 'Public' : 'Private'}</p>
                </div>
              </button>
            ))}
          </div>
        )}

        <div className='mt-6 pt-4 border-t border-white/10'>
          <button
            onClick={onClose}
            className='w-full px-4 py-2 rounded-full border border-white/30 hover:bg-white/10 transition-colors'
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}

export default PlaylistSelectionModal




