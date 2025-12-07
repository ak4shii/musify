import React, { createContext, useContext, useState, useCallback } from 'react'
import { useAuth } from './AuthContext'
import apiClient from '../helpers/apiClient'
import PlaylistFormModal from '../components/playlist/PlaylistFormModal'
import toast from 'react-hot-toast'

const PlaylistModalContext = createContext(null)

export const PlaylistModalProvider = ({ children }) => {
  const { user } = useAuth()
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [formData, setFormData] = useState({
    playlistName: '',
    isPublic: true,
    coverUrl: ''
  })

  const getUserId = () => {
    if (user?.userId != null) return user.userId
    if (user?.id != null) return user.id
    const fallback = localStorage.getItem('userId')
    return fallback ? Number(fallback) : null
  }

  const openCreateModal = () => {
    setFormData({ playlistName: '', isPublic: true, coverUrl: '' })
    setShowCreateModal(true)
  }

  const closeCreateModal = () => {
    setShowCreateModal(false)
    setFormData({ playlistName: '', isPublic: true, coverUrl: '' })
  }

  const handleCreate = useCallback(async (e) => {
    e.preventDefault()
    const userId = getUserId()
    if (!userId) {
      toast.error('User ID not found')
      return
    }

    try {
      const token = localStorage.getItem('token')
      await apiClient.post(
        `/users/${userId}/create-playlist`,
        {
          playlistName: formData.playlistName,
          isPublic: formData.isPublic,
          coverUrl: formData.coverUrl || null
        },
        {
          headers: token ? { 'Authorization': `Bearer ${token}` } : {}
        }
      )
      closeCreateModal()
      toast.success('Playlist created successfully')
      
      window.dispatchEvent(new CustomEvent('playlistCreated'))
    } catch (err) {
      console.error('Error creating playlist:', err)
      toast.error(err.response?.data?.message || 'Failed to create playlist')
    }
  }, [formData, user])

  return (
    <PlaylistModalContext.Provider
      value={{
        showCreateModal,
        openCreateModal,
        closeCreateModal
      }}
    >
      {children}
      <PlaylistFormModal
        isOpen={showCreateModal}
        onClose={closeCreateModal}
        onSubmit={handleCreate}
        formData={formData}
        setFormData={setFormData}
        title='Create New Playlist'
        submitLabel='Create'
      />
    </PlaylistModalContext.Provider>
  )
}

export const usePlaylistModal = () => {
  const context = useContext(PlaylistModalContext)
  if (!context) {
    throw new Error('usePlaylistModal must be used within a PlaylistModalProvider')
  }
  return context
}

