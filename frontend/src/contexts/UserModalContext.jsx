import React, { createContext, useContext, useState, useCallback } from 'react'
import { useAuth } from './AuthContext'
import apiClient from '../helpers/apiClient'
import UserFormModal from '../components/user/UserFormModal'
import toast from '../helpers/singleToast'

const UserModalContext = createContext(null)

export const UserModalProvider = ({ children }) => {
  const { user, login } = useAuth()
  const [showEditModal, setShowEditModal] = useState(false)
  const [formData, setFormData] = useState({
    userName: '',
    dateOfBirth: '',
    profileImage: null,
    profileUrl: '',
    existingProfileUrl: ''
  })

  const getUserId = () => {
    if (user?.userId != null) return user.userId
    if (user?.id != null) return user.id
    const fallback = localStorage.getItem('userId')
    return fallback ? Number(fallback) : null
  }

  const openEditModal = () => {
    const userId = getUserId()
    if (!userId || !user) {
      toast.error('User information not found')
      return
    }

    const dateOfBirth = user.dateOfBirth 
      ? (typeof user.dateOfBirth === 'string' ? user.dateOfBirth.split('T')[0] : user.dateOfBirth)
      : ''

    setFormData({
      userName: user.userName || '',
      dateOfBirth: dateOfBirth,
      profileImage: null,
      profileUrl: '',
      existingProfileUrl: user.profileUrl || ''
    })
    setShowEditModal(true)
  }

  const closeEditModal = () => {
    setShowEditModal(false)
    setFormData({
      userName: '',
      dateOfBirth: '',
      profileImage: null,
      profileUrl: '',
      existingProfileUrl: ''
    })
  }

  const handleUpdate = useCallback(async (e) => {
    e.preventDefault()
    const userId = getUserId()
    if (!userId) {
      toast.error('User ID not found')
      return
    }

    try {
      const token = localStorage.getItem('token')
      const formDataToSend = new FormData()
      
      if (formData.userName) {
        formDataToSend.append('userName', formData.userName)
      }
      
      if (formData.dateOfBirth) {
        formDataToSend.append('dateOfBirth', formData.dateOfBirth)
      }
      
      if (formData.profileImage && formData.profileImage instanceof File) {
        formDataToSend.append('profileImage', formData.profileImage)
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
      
      const response = await apiClient.put(
        `/users/${userId}`,
        formDataToSend,
        config
      )
      
      if (response.data) {
        const updatedUser = response.data
        login(updatedUser)
        closeEditModal()
        toast.success('Profile updated successfully')
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile')
    }
  }, [formData, user, login])

  return (
    <UserModalContext.Provider
      value={{
        showEditModal,
        openEditModal,
        closeEditModal
      }}
    >
      {children}
      <UserFormModal
        isOpen={showEditModal}
        onClose={closeEditModal}
        onSubmit={handleUpdate}
        formData={formData}
        setFormData={setFormData}
      />
    </UserModalContext.Provider>
  )
}

export const useUserModal = () => {
  const context = useContext(UserModalContext)
  if (!context) {
    throw new Error('useUserModal must be used within a UserModalProvider')
  }
  return context
}







