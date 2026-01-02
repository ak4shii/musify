import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { usePlaylistModal } from '../contexts/PlaylistModalContext'
import apiClient, { getImageUrl } from '../helpers/apiClient'
import Header from '../components/Header'
import Sidebar from '../components/Sidebar'
import Player from '../components/Player'
import PlaylistCard from '../components/playlist/PlaylistCard'
import PlaylistFormModal from '../components/playlist/PlaylistFormModal'
import DeleteConfirmModal from '../components/playlist/DeleteConfirmModal'
import toast from '../helpers/singleToast'

const Playlist = () => {
  const { user, isAuthenticated } = useAuth()
  const { openCreateModal } = usePlaylistModal()
  const [playlists, setPlaylists] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [selectedPlaylist, setSelectedPlaylist] = useState(null)
  
  const [formData, setFormData] = useState({
    playlistName: '',
    isPublic: true,
    coverImage: null,
    coverUrl: ''
  })

  const getUserId = () => {
    if (user?.userId != null) return user.userId
    if (user?.id != null) return user.id
    const fallback = localStorage.getItem('userId')
    return fallback ? Number(fallback) : null
  }

  const fetchPlaylists = async () => {
    const userId = getUserId()
    if (!userId) {
      setError('User ID not found')
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)
      const token = localStorage.getItem('token')
      const response = await apiClient.get(`/users/${userId}/playlists`, {
        headers: token ? { 'Authorization': `Bearer ${token}` } : {}
      })
      setPlaylists(response.data || [])
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load playlists')
    } finally {
      setLoading(false)
    }
  }


  const handleUpdate = async (e) => {
    e.preventDefault()
    const userId = getUserId()
    if (!userId || !selectedPlaylist) {
      toast.error('Missing required information')
      return
    }

    try {
      const token = localStorage.getItem('token')
      const formDataToSend = new FormData()
      
      if (formData.playlistName) {
        formDataToSend.append('playlistName', formData.playlistName)
      }
      formDataToSend.append('isPublic', formData.isPublic ? 'true' : 'false')
      
      if (formData.coverImage && formData.coverImage instanceof File) {
        formDataToSend.append('coverImage', formData.coverImage)
      }
      
      const config = {
        headers: {
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        transformRequest: [(data, headers) => {
          if (data instanceof FormData) {
            delete headers['Content-Type']
          }
          return data
        }]
      }
      
      await apiClient.put(
        `/users/${userId}/update-playlists/${selectedPlaylist.playlistId}`,
        formDataToSend,
        config
      )
      setShowEditModal(false)
      setSelectedPlaylist(null)
      setFormData({ playlistName: '', isPublic: true, coverImage: null, coverUrl: '' })
      toast.success('Playlist updated successfully')
      fetchPlaylists()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update playlist')
    }
  }

  const handleDelete = async () => {
    const userId = getUserId()
    if (!userId || !selectedPlaylist) {
      toast.error('Missing required information')
      return
    }

    try {
      const token = localStorage.getItem('token')
      await apiClient.delete(
        `/users/${userId}/delete-playlists/${selectedPlaylist.playlistId}`,
        {
          headers: token ? { 'Authorization': `Bearer ${token}` } : {}
        }
      )
      setShowDeleteConfirm(false)
      setSelectedPlaylist(null)
      toast.success('Playlist deleted successfully')
      fetchPlaylists()
      window.dispatchEvent(new CustomEvent('playlistDeleted'))
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete playlist')
    }
  }

  const openEditModal = (playlist) => {
    setSelectedPlaylist(playlist)
    const coverUrl = playlist.coverUrl ? getImageUrl(playlist.coverUrl) : ''
    setFormData({
      playlistName: playlist.playlistName || '',
      isPublic: playlist.isPublic !== undefined ? playlist.isPublic : true,
      coverImage: null,
      coverUrl: coverUrl
    })
    setShowEditModal(true)
  }

  useEffect(() => {
    if (isAuthenticated) {
      fetchPlaylists()
    } else {
      setLoading(false)
    }
  }, [isAuthenticated, user])

  useEffect(() => {
    const handlePlaylistCreated = () => {
      fetchPlaylists()
    }
    window.addEventListener('playlistCreated', handlePlaylistCreated)
    return () => {
      window.removeEventListener('playlistCreated', handlePlaylistCreated)
    }
  }, [])

  if (!isAuthenticated) {
    return (
      <div className='h-screen bg-black text-white'>
        <Header />
        <div className='h-[88%] flex px-2 pb-1.5 pt-1'>
          <Sidebar />
          <div className='flex-1 overflow-y-auto custom-scrollbar flex items-center justify-center'>
            <div className='bg-[#121212] border border-white/10 rounded-2xl p-10 text-center space-y-4 max-w-2xl'>
              <p className='text-lg font-semibold'>Log in to manage your playlists</p>
              <p className='text-sm text-white/70'>
                You need to be logged in to create, view, and manage your playlists.
              </p>
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
            <div>
              <p className='text-xs uppercase tracking-[0.3em] text-gray-300 mb-2'>Collection</p>
              <h1 className='text-4xl md:text-6xl font-extrabold mb-4'>Your Playlists</h1>
            </div>

            {loading && (
              <div className='flex items-center justify-center py-12'>
                <div className='text-center'>
                  <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4'></div>
                  <p className='text-white/80'>Loading playlists...</p>
                </div>
              </div>
            )}

            {error && !loading && (
              <div className='bg-red-500/20 border border-red-500/50 rounded-lg p-4 text-center'>
                <p className='text-red-400'>{error}</p>
                <button
                  onClick={fetchPlaylists}
                  className='mt-2 px-4 py-2 rounded-full bg-red-500/20 hover:bg-red-500/30 transition-colors text-sm'
                >
                  Retry
                </button>
              </div>
            )}

            {!loading && !error && playlists.length === 0 && (
              <div className='bg-[#121212] border border-white/10 rounded-2xl p-10 text-center space-y-4'>
                <p className='text-lg font-semibold'>You have no playlist yet</p>
                <p className='text-sm text-white/70 max-w-2xl mx-auto'>
                  Create your first playlist to organize your favorite songs.
                </p>
                <button
                  onClick={openCreateModal}
                  className='inline-block px-6 py-2 rounded-full bg-white text-black font-semibold hover:bg-gray-200 transition-colors'
                >
                  Create Playlist
                </button>
              </div>
            )}

            {!loading && !error && playlists.length > 0 && (
              <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4'>
                {playlists.map((playlist) => (
                  <PlaylistCard
                    key={playlist.playlistId}
                    playlist={playlist}
                    onEdit={openEditModal}
                    onDelete={(playlist) => {
                      setSelectedPlaylist(playlist)
                      setShowDeleteConfirm(true)
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      <Player />

      <PlaylistFormModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false)
          setSelectedPlaylist(null)
        }}
        onSubmit={handleUpdate}
        formData={formData}
        setFormData={setFormData}
        title='Edit Playlist'
        submitLabel='Update'
      />

      <DeleteConfirmModal
        isOpen={showDeleteConfirm}
        onClose={() => {
          setShowDeleteConfirm(false)
          setSelectedPlaylist(null)
        }}
        onConfirm={handleDelete}
        playlistName={selectedPlaylist?.playlistName || ''}
      />
    </div>
  )
}

export default Playlist
