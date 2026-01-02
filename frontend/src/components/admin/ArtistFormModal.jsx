import React, { useState, useEffect } from 'react'
import toast from '../../helpers/singleToast'

const ArtistFormModal = ({ isOpen, onClose, onSubmit, initialData }) => {
  const [formData, setFormData] = useState({
    artistName: '',
    biography: '',
    profileImage: null
  })
  const [loading, setLoading] = useState(false)
  const [imagePreview, setImagePreview] = useState(null)

  useEffect(() => {
    if (initialData) {
      setFormData({
        artistName: initialData.artistName || '',
        biography: initialData.biography || '',
        profileImage: null
      })
      setImagePreview(null)
    } else {
      setFormData({
        artistName: '',
        biography: '',
        profileImage: null
      })
      setImagePreview(null)
    }
  }, [initialData, isOpen])

  const handleChange = (e) => {
    const { name, value, files } = e.target
    if (name === 'profileImage' && files && files[0]) {
      const file = files[0]
      setFormData(prev => ({ ...prev, profileImage: file }))
      
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
      }
      reader.readAsDataURL(file)
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.artistName.trim()) {
      toast.error('Artist name is required')
      return
    }
    if (!initialData && !formData.profileImage) {
      toast.error('Profile image is required')
      return
    }
    if (!formData.biography.trim()) {
      toast.error('Biography is required')
      return
    }

    setLoading(true)
    try {
      await onSubmit(formData)
      onClose()
    } catch (error) {
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className='fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4' onClick={onClose}>
      <div className='bg-[#282828] rounded-2xl p-6 max-w-md w-full shadow-2xl border border-white/10 max-h-[90vh] overflow-y-auto' onClick={(e) => e.stopPropagation()}>
        <h2 className='text-2xl font-bold mb-6'>
          {initialData ? 'Edit Artist' : 'Create Artist'}
        </h2>
        
        <form onSubmit={handleSubmit} className='space-y-4'>
          <div>
            <label className='block text-sm font-medium mb-2 text-white/90'>Artist Name *</label>
            <input
              type='text'
              name='artistName'
              value={formData.artistName}
              onChange={handleChange}
              required
              maxLength={150}
              className='w-full px-4 py-3 rounded-lg bg-white/5 border border-white/20 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/40 transition-all'
            />
          </div>

          <div>
            <label className='block text-sm font-medium mb-2 text-white/90'>Profile Image *</label>
            {!initialData && (
              <input
                type='file'
                name='profileImage'
                accept='image/*'
                onChange={handleChange}
                required={!initialData}
                className='w-full px-4 py-3 rounded-lg bg-white/5 border border-white/20 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/40 transition-all file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-white/10 file:text-white hover:file:bg-white/20 file:cursor-pointer custom-file-input-color'
              />
            )}
            {initialData && (
              <div className='space-y-2'>
                <input
                  type='file'
                  name='profileImage'
                  accept='image/*'
                  onChange={handleChange}
                  className='w-full px-4 py-3 rounded-lg bg-white/5 border border-white/20 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/40 transition-all file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-white/10 file:text-white hover:file:bg-white/20 file:cursor-pointer custom-file-input-color'
                />
                <p className='text-xs text-gray-500'>Leave empty to keep current image</p>
              </div>
            )}
            {imagePreview && (
              <div className='mt-2'>
                <img src={imagePreview} alt='Preview' className='w-32 h-32 object-cover rounded' />
              </div>
            )}
          </div>

          <div>
            <label className='block text-sm font-medium mb-2 text-white/90'>Biography *</label>
            <textarea
              name='biography'
              value={formData.biography}
              onChange={handleChange}
              required
              rows={4}
              className='w-full px-4 py-3 rounded-lg bg-white/5 border border-white/20 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/40 transition-all resize-none'
            />
          </div>

          <div className='flex gap-3 pt-4'>
            <button
              type='button'
              onClick={onClose}
              className='flex-1 px-4 py-3 rounded-full border border-white/20 text-white hover:bg-white/10 hover:border-white/30 transition-colors font-medium'
            >
              Cancel
            </button>
            <button
              type='submit'
              disabled={loading}
              className='flex-1 px-4 py-3 rounded-full bg-white text-black font-semibold hover:bg-gray-200 transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed'
            >
              {loading ? 'Saving...' : initialData ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ArtistFormModal

