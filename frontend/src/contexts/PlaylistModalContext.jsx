import React, { createContext, useContext, useState, useCallback } from 'react'
import { useAuth } from './AuthContext'
import apiClient from '../helpers/apiClient'
import PlaylistFormModal from '../components/playlist/PlaylistFormModal'
import toast from '../helpers/singleToast'

const PlaylistModalContext = createContext(null)

export const PlaylistModalProvider = ({ children }) => {
  const { user } = useAuth()
  const [showCreateModal, setShowCreateModal] = useState(false)
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

  const openCreateModal = () => {
    setFormData({ playlistName: '', isPublic: true, coverImage: null, coverUrl: '' })
    setShowCreateModal(true)
  }

  const closeCreateModal = () => {
    setShowCreateModal(false)
    setFormData({ playlistName: '', isPublic: true, coverImage: null, coverUrl: '' })
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
      const formDataToSend = new FormData()
      formDataToSend.append('playlistName', formData.playlistName)
      formDataToSend.append('isPublic', formData.isPublic ? 'true' : 'false')
      
      if (formData.coverImage && formData.coverImage instanceof File) {
        formDataToSend.append('coverImage', formData.coverImage)
      }
      
      const config = {
        headers: {
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        transformRequest: [(data, headers) => {
          // Remove Content-Type to let axios automatically set multipart/form-data with boundary for FormData
          if (data instanceof FormData) {
            delete headers['Content-Type']
          }
          return data
        }]
      }
      
      const response = await apiClient.post(
        `/users/${userId}/create-playlist`,
        formDataToSend,
        config
      )
      
      if (response.status === 201 || response.status === 200) {
        closeCreateModal()
        toast.success('Playlist created successfully')
        window.dispatchEvent(new CustomEvent('playlistCreated'))
      } else {
        throw new Error(`Unexpected status: ${response.status}`)
      }
    } catch (err) {
      if (err.code === 'ECONNABORTED') {
        toast.error('Request timeout - backend may not be responding')
      } else if (err.code === 'ERR_NETWORK') {
        toast.error('Network error - check if backend is running')
      } else if (err.response) {
        toast.error(err.response?.data?.message || `Error: ${err.response.status}`)
      } else {
        toast.error('Failed to create playlist - no response from server')
      }
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

