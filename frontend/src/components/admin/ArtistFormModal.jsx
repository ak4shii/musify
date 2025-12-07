import React, { useState, useEffect } from 'react'
import toast from 'react-hot-toast'

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
      console.error('Error submitting form:', error)
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50' onClick={onClose}>
      <div className='bg-[#282828] rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto' onClick={(e) => e.stopPropagation()}>
        <h2 className='text-2xl font-bold mb-6'>
          {initialData ? 'Edit Artist' : 'Create Artist'}
        </h2>
        
        <form onSubmit={handleSubmit} className='space-y-4'>
          <div>
            <label className='block text-sm font-medium mb-2'>Artist Name *</label>
            <input
              type='text'
              name='artistName'
              value={formData.artistName}
              onChange={handleChange}
              required
              maxLength={150}
              className='w-full px-4 py-2 bg-[#1a1a1a] border border-white/20 rounded text-white focus:outline-none focus:border-white/40'
            />
          </div>

          <div>
            <label className='block text-sm font-medium mb-2'>Profile Image *</label>
            {!initialData && (
              <input
                type='file'
                name='profileImage'
                accept='image/*'
                onChange={handleChange}
                required={!initialData}
                className='w-full px-4 py-2 bg-[#1a1a1a] border border-white/20 rounded text-white focus:outline-none focus:border-white/40'
              />
            )}
            {initialData && (
              <div className='space-y-2'>
                <input
                  type='file'
                  name='profileImage'
                  accept='image/*'
                  onChange={handleChange}
                  className='w-full px-4 py-2 bg-[#1a1a1a] border border-white/20 rounded text-white focus:outline-none focus:border-white/40'
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
            <label className='block text-sm font-medium mb-2'>Biography *</label>
            <textarea
              name='biography'
              value={formData.biography}
              onChange={handleChange}
              required
              rows={4}
              className='w-full px-4 py-2 bg-[#1a1a1a] border border-white/20 rounded text-white focus:outline-none focus:border-white/40 resize-none'
            />
          </div>

          <div className='flex gap-3 justify-end pt-4'>
            <button
              type='button'
              onClick={onClose}
              className='px-6 py-2 rounded-full bg-transparent border border-white/20 text-white hover:bg-white/10 transition-colors'
            >
              Cancel
            </button>
            <button
              type='submit'
              disabled={loading}
              className='px-6 py-2 rounded-full bg-white text-black hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
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

