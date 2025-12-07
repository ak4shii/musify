import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { Navigate, useNavigate } from 'react-router-dom'
import apiClient from '../helpers/apiClient'
import toast from 'react-hot-toast'

import AdminTable from '../components/admin/AdminTable'
import ArtistFormModal from '../components/admin/ArtistFormModal'
import AlbumFormModal from '../components/admin/AlbumFormModal'
import TrackFormModal from '../components/admin/TrackFormModal'
import DeleteConfirmModal from '../components/admin/DeleteConfirmModal'
import UserManagement from '../components/admin/UserManagement'
import { getImageUrl } from '../helpers/apiClient'

const AdminPanel = () => {
  const { user, isAuthenticated, loading: authLoading, logout } = useAuth()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('artists')
  
  const [artists, setArtists] = useState([])
  const [albums, setAlbums] = useState([])
  const [tracks, setTracks] = useState([])
  
  const [showArtistModal, setShowArtistModal] = useState(false)
  const [showAlbumModal, setShowAlbumModal] = useState(false)
  const [showTrackModal, setShowTrackModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  
  const [editingArtist, setEditingArtist] = useState(null)
  const [editingAlbum, setEditingAlbum] = useState(null)
  const [editingTrack, setEditingTrack] = useState(null)
  const [deletingItem, setDeletingItem] = useState(null)
  
  const [loading, setLoading] = useState({
    artists: false,
    albums: false,
    tracks: false
  })

  const getToken = () => localStorage.getItem('token')

  const fetchArtists = async () => {
    try {
      setLoading(prev => ({ ...prev, artists: true }))
      const response = await apiClient.get('/admins/artists', {
        headers: getToken() ? { 'Authorization': `Bearer ${getToken()}` } : {}
      })
      setArtists(response.data || [])
    } catch (error) {
      console.error('Error fetching artists:', error)
      toast.error('Failed to load artists')
    } finally {
      setLoading(prev => ({ ...prev, artists: false }))
    }
  }

  const fetchAlbums = async () => {
    try {
      setLoading(prev => ({ ...prev, albums: true }))
      const response = await apiClient.get('/admins/albums', {
        headers: getToken() ? { 'Authorization': `Bearer ${getToken()}` } : {}
      })
      setAlbums(response.data || [])
    } catch (error) {
      console.error('Error fetching albums:', error)
      toast.error('Failed to load albums')
    } finally {
      setLoading(prev => ({ ...prev, albums: false }))
    }
  }

  const fetchTracks = async () => {
    try {
      setLoading(prev => ({ ...prev, tracks: true }))
      const response = await apiClient.get('/admins/tracks', {
        headers: getToken() ? { 'Authorization': `Bearer ${getToken()}` } : {}
      })
      setTracks(response.data || [])
    } catch (error) {
      console.error('Error fetching tracks:', error)
      toast.error('Failed to load tracks')
    } finally {
      setLoading(prev => ({ ...prev, tracks: false }))
    }
  }

  useEffect(() => {
    if (!authLoading && isAuthenticated && user?.role === 'ROLE_ADMIN') {
      if (activeTab === 'artists') {
        fetchArtists()
      } else if (activeTab === 'albums') {
        fetchAlbums()
      } else if (activeTab === 'tracks') {
        fetchTracks()
      }
    }
  }, [activeTab, authLoading, isAuthenticated, user?.role])

  if (authLoading) {
    return (
      <div className='min-h-screen bg-black text-white flex items-center justify-center'>
        <div className='text-center'>
          <p className='text-gray-400'>Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (user?.role !== 'ROLE_ADMIN') {
    return <Navigate to="/" replace />
  }

  const handleCreateArtist = async (formData) => {
    try {
      const formDataToSend = new FormData()
      formDataToSend.append('artistName', formData.artistName)
      formDataToSend.append('biography', formData.biography)
      if (formData.profileImage) {
        formDataToSend.append('profileImage', formData.profileImage)
      }

      await apiClient.post('/admins/artists', formDataToSend, {
        headers: {
          ...(getToken() ? { 'Authorization': `Bearer ${getToken()}` } : {}),
          'Content-Type': 'multipart/form-data'
        }
      })
      toast.success('Artist created successfully')
      fetchArtists()
    } catch (error) {
      console.error('Error creating artist:', error)
      toast.error(error.response?.data?.message || error.response?.data || 'Failed to create artist')
      throw error
    }
  }

  const handleUpdateArtist = async (formData) => {
    try {
      const formDataToSend = new FormData()
      if (formData.artistName) {
        formDataToSend.append('artistName', formData.artistName)
      }
      if (formData.biography) {
        formDataToSend.append('biography', formData.biography)
      }
      if (formData.profileImage) {
        formDataToSend.append('profileImage', formData.profileImage)
      }

      await apiClient.put(`/admins/artists/${editingArtist.artistId}`, formDataToSend, {
        headers: {
          ...(getToken() ? { 'Authorization': `Bearer ${getToken()}` } : {}),
          'Content-Type': 'multipart/form-data'
        }
      })
      toast.success('Artist updated successfully')
      fetchArtists()
    } catch (error) {
      console.error('Error updating artist:', error)
      toast.error(error.response?.data?.message || error.response?.data || 'Failed to update artist')
      throw error
    }
  }

  const handleDeleteArtist = async () => {
    try {
      await apiClient.delete(`/admins/artists/${deletingItem.artistId}`, {
        headers: getToken() ? { 'Authorization': `Bearer ${getToken()}` } : {}
      })
      toast.success('Artist deleted successfully')
      fetchArtists()
      setShowDeleteModal(false)
      setDeletingItem(null)
    } catch (error) {
      console.error('Error deleting artist:', error)
      toast.error('Failed to delete artist')
    }
  }

  const handleCreateAlbum = async (formData) => {
    try {
      const formDataToSend = new FormData()
      formDataToSend.append('title', formData.title)
      formDataToSend.append('releaseDate', formData.releaseDate)
      formData.artistIds.forEach(id => formDataToSend.append('artistIds', id))
      if (formData.coverImage) {
        formDataToSend.append('coverImage', formData.coverImage)
      }

      await apiClient.post('/admins/albums', formDataToSend, {
        headers: {
          ...(getToken() ? { 'Authorization': `Bearer ${getToken()}` } : {}),
          'Content-Type': 'multipart/form-data'
        }
      })
      toast.success('Album created successfully')
      fetchAlbums()
    } catch (error) {
      console.error('Error creating album:', error)
      toast.error(error.response?.data?.message || error.response?.data || 'Failed to create album')
      throw error
    }
  }

  const handleUpdateAlbum = async (formData) => {
    try {
      const formDataToSend = new FormData()
      if (formData.title) {
        formDataToSend.append('title', formData.title)
      }
      if (formData.releaseDate) {
        formDataToSend.append('releaseDate', formData.releaseDate)
      }
      if (formData.coverImage) {
        formDataToSend.append('coverImage', formData.coverImage)
      }

      await apiClient.put(`/admins/albums/${editingAlbum.albumId}`, formDataToSend, {
        headers: {
          ...(getToken() ? { 'Authorization': `Bearer ${getToken()}` } : {}),
          'Content-Type': 'multipart/form-data'
        }
      })
      toast.success('Album updated successfully')
      fetchAlbums()
    } catch (error) {
      console.error('Error updating album:', error)
      toast.error(error.response?.data?.message || error.response?.data || 'Failed to update album')
      throw error
    }
  }

  const handleDeleteAlbum = async () => {
    try {
      await apiClient.delete(`/admins/albums/${deletingItem.albumId}`, {
        headers: getToken() ? { 'Authorization': `Bearer ${getToken()}` } : {}
      })
      toast.success('Album deleted successfully')
      fetchAlbums()
      setShowDeleteModal(false)
      setDeletingItem(null)
    } catch (error) {
      console.error('Error deleting album:', error)
      toast.error('Failed to delete album')
    }
  }

  const handleCreateTrack = async (formData) => {
    try {
      const formDataToSend = new FormData()
      formDataToSend.append('albumId', formData.albumId)
      formDataToSend.append('title', formData.title)
      formDataToSend.append('genre', formData.genre)
      formDataToSend.append('duration', formData.duration)
      formData.artistIds.forEach(id => formDataToSend.append('artistIds', id))
      
      if (formData.file) {
        formDataToSend.append('file', formData.file)
      }

      await apiClient.post('/admins/tracks', formDataToSend, {
        headers: {
          ...(getToken() ? { 'Authorization': `Bearer ${getToken()}` } : {}),
          'Content-Type': 'multipart/form-data'
        }
      })
      toast.success('Track created successfully')
      fetchTracks()
    } catch (error) {
      console.error('Error creating track:', error)
      toast.error(error.response?.data?.message || error.response?.data || 'Failed to create track')
      throw error
    }
  }

  const handleUpdateTrack = async (formData) => {
    try {
      const { file, artistIds, ...updateData } = formData
      await apiClient.put(`/admins/tracks/${editingTrack.trackId}`, updateData, {
        headers: getToken() ? { 'Authorization': `Bearer ${getToken()}` } : {}
      })
      toast.success('Track updated successfully')
      fetchTracks()
    } catch (error) {
      console.error('Error updating track:', error)
      toast.error(error.response?.data?.message || 'Failed to update track')
      throw error
    }
  }

  const handleDeleteTrack = async () => {
    try {
      await apiClient.delete(`/admins/tracks/${deletingItem.trackId}`, {
        headers: getToken() ? { 'Authorization': `Bearer ${getToken()}` } : {}
      })
      toast.success('Track deleted successfully')
      fetchTracks()
      setShowDeleteModal(false)
      setDeletingItem(null)
    } catch (error) {
      console.error('Error deleting track:', error)
      toast.error('Failed to delete track')
    }
  }

  const artistColumns = [
    {
      header: 'ID',
      accessor: 'artistId'
    },
    {
      header: 'Name',
      accessor: 'artistName'
    },
    {
      header: 'Biography',
      accessor: 'biography',
      render: (artist) => (
        <span className='truncate max-w-xs block' title={artist.biography}>
          {artist.biography || '-'}
        </span>
      )
    }
  ]

  const albumColumns = [
    {
      header: 'ID',
      accessor: 'albumId'
    },
    {
      header: 'Title',
      accessor: 'title'
    },
    {
      header: 'Release Date',
      accessor: 'releaseDate',
      render: (album) => album.releaseDate ? new Date(album.releaseDate).toLocaleDateString() : '-'
    }
  ]

  const trackColumns = [
    {
      header: 'ID',
      accessor: 'trackId'
    },
    {
      header: 'Title',
      accessor: 'title'
    },
    {
      header: 'Genre',
      accessor: 'genre'
    },
    {
      header: 'Duration',
      accessor: 'duration'
    }
  ]

  const tabs = [
    { id: 'artists', label: 'Artists' },
    { id: 'albums', label: 'Albums' },
    { id: 'tracks', label: 'Tracks' },
    { id: 'users', label: 'Users' }
  ]

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className='min-h-screen bg-black text-white'>
      <div className='max-w-7xl mx-auto p-8'>
        <div className='flex justify-between items-center mb-8'>
          <h1 className='text-4xl font-bold'>Admin Panel</h1>
          <button
            onClick={handleLogout}
            className='px-6 py-2 rounded-full bg-transparent border border-white/20 text-white hover:bg-white/10 transition-colors font-semibold'
          >
            Log out
          </button>
        </div>
        
        <div className='flex gap-2 border-b border-white/10 mb-6'>
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 font-semibold transition-colors border-b-2 ${
                activeTab === tab.id
                  ? 'border-white text-white'
                  : 'border-transparent text-gray-400 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className='bg-[#121212] rounded-lg p-6'>
          {activeTab === 'artists' && (
            <div>
              <div className='flex justify-between items-center mb-6'>
                <h2 className='text-2xl font-bold'>Artists</h2>
                <button
                  onClick={() => {
                    setEditingArtist(null)
                    setShowArtistModal(true)
                  }}
                  className='px-4 py-2 rounded-full bg-white text-black font-semibold hover:bg-gray-200 transition-colors'
                >
                  + Create Artist
                </button>
              </div>
              
              {loading.artists ? (
                <div className='text-center py-12 text-gray-400'>Loading artists...</div>
              ) : (
                <AdminTable
                  columns={artistColumns}
                  data={artists}
                  onEdit={(artist) => {
                    setEditingArtist(artist)
                    setShowArtistModal(true)
                  }}
                  onDelete={(artist) => {
                    setDeletingItem(artist)
                    setShowDeleteModal(true)
                  }}
                  emptyMessage='No artists found'
                  getRowKey={(artist) => artist.artistId}
                />
              )}
            </div>
          )}

          {activeTab === 'albums' && (
            <div>
              <div className='flex justify-between items-center mb-6'>
                <h2 className='text-2xl font-bold'>Albums</h2>
                <button
                  onClick={() => {
                    setEditingAlbum(null)
                    setShowAlbumModal(true)
                  }}
                  className='px-4 py-2 rounded-full bg-white text-black font-semibold hover:bg-gray-200 transition-colors'
                >
                  + Create Album
                </button>
              </div>
              
              {loading.albums ? (
                <div className='text-center py-12 text-gray-400'>Loading albums...</div>
              ) : (
                <AdminTable
                  columns={albumColumns}
                  data={albums}
                  onEdit={(album) => {
                    setEditingAlbum(album)
                    setShowAlbumModal(true)
                  }}
                  onDelete={(album) => {
                    setDeletingItem(album)
                    setShowDeleteModal(true)
                  }}
                  emptyMessage='No albums found'
                  getRowKey={(album) => album.albumId}
                />
              )}
            </div>
          )}

          {activeTab === 'tracks' && (
            <div>
              <div className='flex justify-between items-center mb-6'>
                <h2 className='text-2xl font-bold'>Tracks</h2>
                <button
                  onClick={() => {
                    setEditingTrack(null)
                    setShowTrackModal(true)
                  }}
                  className='px-4 py-2 rounded-full bg-white text-black font-semibold hover:bg-gray-200 transition-colors'
                >
                  + Create Track
                </button>
              </div>
              
              {loading.tracks ? (
                <div className='text-center py-12 text-gray-400'>Loading tracks...</div>
              ) : (
                <AdminTable
                  columns={trackColumns}
                  data={tracks}
                  onEdit={(track) => {
                    setEditingTrack(track)
                    setShowTrackModal(true)
                  }}
                  onDelete={(track) => {
                    setDeletingItem(track)
                    setShowDeleteModal(true)
                  }}
                  emptyMessage='No tracks found'
                  getRowKey={(track) => track.trackId}
                />
              )}
            </div>
          )}

          {activeTab === 'users' && (
            <div>
              <h2 className='text-2xl font-bold mb-6'>Users</h2>
              <UserManagement />
            </div>
          )}
        </div>
      </div>

      <ArtistFormModal
        isOpen={showArtistModal}
        onClose={() => {
          setShowArtistModal(false)
          setEditingArtist(null)
        }}
        onSubmit={editingArtist ? handleUpdateArtist : handleCreateArtist}
        initialData={editingArtist}
      />

      <AlbumFormModal
        isOpen={showAlbumModal}
        onClose={() => {
          setShowAlbumModal(false)
          setEditingAlbum(null)
        }}
        onSubmit={editingAlbum ? handleUpdateAlbum : handleCreateAlbum}
        initialData={editingAlbum}
        artists={artists}
      />

      <TrackFormModal
        isOpen={showTrackModal}
        onClose={() => {
          setShowTrackModal(false)
          setEditingTrack(null)
        }}
        onSubmit={editingTrack ? handleUpdateTrack : handleCreateTrack}
        initialData={editingTrack}
        albums={albums}
        artists={artists}
      />

      <DeleteConfirmModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false)
          setDeletingItem(null)
        }}
        onConfirm={() => {
          if (activeTab === 'artists') {
            handleDeleteArtist()
          } else if (activeTab === 'albums') {
            handleDeleteAlbum()
          } else if (activeTab === 'tracks') {
            handleDeleteTrack()
          }
        }}
        title={`Delete ${activeTab === 'artists' ? 'Artist' : activeTab === 'albums' ? 'Album' : 'Track'}`}
        itemName={deletingItem?.artistName || deletingItem?.title || deletingItem?.trackId}
      />
    </div>
  )
}

export default AdminPanel
