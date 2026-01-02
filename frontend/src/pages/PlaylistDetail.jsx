import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import apiClient, { getImageUrl } from '../helpers/apiClient'
import Header from '../components/Header'
import Sidebar from '../components/Sidebar'
import Player from '../components/Player'
import PlaylistTrackItem from '../components/playlist/PlaylistTrackItem'
import AddTrackModal from '../components/playlist/AddTrackModal'
import toast from '../helpers/singleToast'

const PlaylistDetail = () => {
  const { playlistId } = useParams()
  const navigate = useNavigate()
  const { user, isAuthenticated } = useAuth()
  const [playlist, setPlaylist] = useState(null)
  const [tracks, setTracks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showAddTrackModal, setShowAddTrackModal] = useState(false)
  const [availableTracks, setAvailableTracks] = useState([])
  const [searchQuery, setSearchQuery] = useState('')

  const getUserId = () => {
    if (user?.userId != null) return user.userId
    if (user?.id != null) return user.id
    const fallback = localStorage.getItem('userId')
    return fallback ? Number(fallback) : null
  }

  const fetchPlaylistDetails = async () => {
    if (!playlistId) return

    try {
      setLoading(true)
      setError(null)
      const token = localStorage.getItem('token')
      const response = await apiClient.get(`/playlists/${playlistId}/tracks`, {
        headers: token ? { 'Authorization': `Bearer ${token}` } : {}
      })
      setPlaylist(response.data?.playlist || null)
      setTracks(response.data?.tracks || [])
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load playlist details')
    } finally {
      setLoading(false)
    }
  }

  const fetchAvailableTracks = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await apiClient.get('/', {
        headers: token ? { 'Authorization': `Bearer ${token}` } : {}
      })
      setAvailableTracks(response.data?.tracks || [])
    } catch (err) {
      toast.error('Failed to load tracks')
    }
  }

  const handleAddTrack = async (trackId) => {
    const userId = getUserId()
    if (!userId) {
      toast.error('User ID not found')
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
      setShowAddTrackModal(false)
      setSearchQuery('')
      fetchPlaylistDetails()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add track')
    }
  }

  const handleRemoveTrack = async (trackId) => {
    const userId = getUserId()
    if (!userId) {
      toast.error('User ID not found')
      return
    }

    try {
      const token = localStorage.getItem('token')
      await apiClient.delete(
        `/users/${userId}/playlists/${playlistId}/remove-track/${trackId}`,
        {
          headers: token ? { 'Authorization': `Bearer ${token}` } : {}
        }
      )
      toast.success('Track removed from playlist')
      fetchPlaylistDetails()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to remove track')
    }
  }

  const existingTrackIds = new Set(tracks.map(t => t.trackId || t.id))
  const tracksToShow = availableTracks.filter(track => {
    const trackId = track.trackId || track.id
    return !existingTrackIds.has(trackId)
  })

  useEffect(() => {
    if (isAuthenticated && playlistId) {
      fetchPlaylistDetails()
    } else {
      setLoading(false)
    }
  }, [isAuthenticated, playlistId])

  useEffect(() => {
    if (showAddTrackModal) {
      fetchAvailableTracks()
    }
  }, [showAddTrackModal])

  if (!isAuthenticated) {
    return (
      <div className='h-screen bg-black text-white'>
        <Header />
        <div className='h-[88%] flex px-2 pb-1.5 pt-1'>
          <Sidebar />
          <div className='flex-1 overflow-y-auto custom-scrollbar flex items-center justify-center'>
            <div className='bg-[#121212] border border-white/10 rounded-2xl p-10 text-center space-y-4 max-w-2xl'>
              <p className='text-lg font-semibold'>Log in to view playlist</p>
              <p className='text-sm text-white/70'>
                You need to be logged in to view and manage playlist tracks.
              </p>
            </div>
          </div>
        </div>
        <Player />
      </div>
    )
  }

  if (loading) {
    return (
      <div className='h-screen bg-black text-white'>
        <Header />
        <div className='h-[88%] flex px-2 pb-1.5 pt-1'>
          <Sidebar />
          <div className='flex-1 overflow-y-auto custom-scrollbar flex items-center justify-center'>
            <div className='text-center'>
              <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4'></div>
              <p className='text-white/80'>Loading playlist...</p>
            </div>
          </div>
        </div>
        <Player />
      </div>
    )
  }

  if (error || !playlist) {
    return (
      <div className='h-screen bg-black text-white'>
        <Header />
        <div className='h-[88%] flex px-2 pb-1.5 pt-1'>
          <Sidebar />
          <div className='flex-1 overflow-y-auto custom-scrollbar flex items-center justify-center'>
            <div className='bg-red-500/20 border border-red-500/50 rounded-lg p-4 text-center max-w-md'>
              <p className='text-red-400'>{error || 'Playlist not found'}</p>
            </div>
          </div>
        </div>
        <Player />
      </div>
    )
  }

  return (
    <div className='h-screen bg-black text-white'>
      <Header />
      <div className='h-[88%] flex px-2 pb-1.5 pt-1'>
        <Sidebar />
        <div className='flex-1 overflow-y-auto custom-scrollbar'>
          <div className='px-6 py-6 space-y-6'>
            <div className='flex flex-col md:flex-row md:items-end gap-6'>
              <div className='w-40 h-40 md:w-52 md:h-52 rounded-lg bg-gradient-to-br from-[#8B5CF6] to-[#3B82F6] flex-shrink-0 overflow-hidden'>
                {playlist.coverUrl ? (
                  <img
                    src={getImageUrl(playlist.coverUrl)}
                    alt={playlist.playlistName}
                    className='w-full h-full object-cover'
                    onError={(e) => {
                      e.target.style.display = 'none'
                    }}
                  />
                ) : (
                  <div className='w-full h-full flex items-center justify-center'>
                    <svg className='w-12 h-12 text-white opacity-80' fill='currentColor' viewBox='0 0 24 24'>
                      <path d='M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-1 9H9V9h10v2zm-4 4H9v-2h6v2zm4-8H9V5h10v2z' />
                    </svg>
                  </div>
                )}
              </div>
              <div className='flex-1'>
                <p className='text-xs uppercase tracking-[0.3em] text-gray-300 mb-2'>Playlist</p>
                <h1 className='text-4xl md:text-6xl font-extrabold mb-4'>{playlist.playlistName}</h1>
                <div className='flex flex-wrap items-center gap-4 text-sm text-gray-300'>
                  <span>{tracks.length} {tracks.length === 1 ? 'track' : 'tracks'}</span>
                  <span>•</span>
                  <span>{playlist.isPublic ? 'Public' : 'Private'}</span>
                </div>
              </div>
            </div>

            <section className='space-y-2'>
              <h2 className='text-2xl font-bold mb-4'>Tracks</h2>
              {tracks.length > 0 ? (
                <div className='space-y-1'>
                  {tracks.map((track, index) => (
                    <PlaylistTrackItem
                      key={track.trackId || track.id || index}
                      track={track}
                      onRemove={handleRemoveTrack}
                    />
                  ))}
                </div>
              ) : (
                <div className='bg-[#121212] border border-white/10 rounded-2xl p-10 text-center space-y-4'>
                  <p className='text-lg font-semibold'>No tracks in this playlist yet</p>
                  <p className='text-sm text-white/70 max-w-2xl mx-auto'>
                    Add tracks to start building your playlist.
                  </p>
                </div>
              )}
            </section>
          </div>
        </div>
      </div>
      <Player />

      <AddTrackModal
        isOpen={showAddTrackModal}
        onClose={() => {
          setShowAddTrackModal(false)
          setSearchQuery('')
        }}
        tracks={tracksToShow}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onAddTrack={handleAddTrack}
      />
    </div>
  )
}

export default PlaylistDetail
