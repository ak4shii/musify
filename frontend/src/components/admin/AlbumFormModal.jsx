import React, { useState, useEffect } from 'react'
import toast from '../../helpers/singleToast'

const AlbumFormModal = ({ isOpen, onClose, onSubmit, initialData, artists = [] }) => {
  const [formData, setFormData] = useState({
    title: '',
    releaseDate: '',
    artistIds: [],
    coverImage: null
  })
  const [loading, setLoading] = useState(false)
  const [imagePreview, setImagePreview] = useState(null)
  const [artistSearch, setArtistSearch] = useState('')

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        releaseDate: initialData.releaseDate ? initialData.releaseDate.split('T')[0] : '',
        artistIds: initialData.artistIds || [],
        coverImage: null
      })
      setImagePreview(null)
    } else {
      setFormData({
        title: '',
        releaseDate: '',
        artistIds: [],
        coverImage: null
      })
      setImagePreview(null)
    }
  }, [initialData, isOpen])

  const handleChange = (e) => {
    const { name, value, files } = e.target
    if (name === 'coverImage' && files && files[0]) {
      const file = files[0]
      setFormData(prev => ({ ...prev, coverImage: file }))
      
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

  const handleArtistToggle = (artistId) => {
    setFormData(prev => ({
      ...prev,
      artistIds: prev.artistIds.includes(artistId)
        ? prev.artistIds.filter(id => id !== artistId)
        : [...prev.artistIds, artistId]
    }))
  }

  const filteredArtists = artists.filter((a) => {
    const q = artistSearch.trim().toLowerCase()
    if (!q) return true
    return String(a?.artistName ?? '').toLowerCase().includes(q)
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.title.trim()) {
      toast.error('Album title is required')
      return
    }
    if (!initialData && !formData.coverImage) {
      toast.error('Cover image is required')
      return
    }
    if (!formData.releaseDate) {
      toast.error('Release date is required')
      return
    }
    if (formData.artistIds.length === 0) {
      toast.error('At least one artist is required')
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
          {initialData ? 'Edit Album' : 'Create Album'}
        </h2>
        
        <form onSubmit={handleSubmit} className='space-y-4'>
          <div>
            <label className='block text-sm font-medium mb-2 text-white/90'>Album Title *</label>
            <input
              type='text'
              name='title'
              value={formData.title}
              onChange={handleChange}
              required
              maxLength={200}
              className='w-full px-4 py-3 rounded-lg bg-white/5 border border-white/20 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/40 transition-all'
            />
          </div>

          <div>
            <label className='block text-sm font-medium mb-2 text-white/90'>Cover Image *</label>
            {!initialData && (
              <input
                type='file'
                name='coverImage'
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
                  name='coverImage'
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
            <label className='block text-sm font-medium mb-2 text-white/90'>Release Date *</label>
            <input
              type='date'
              name='releaseDate'
              value={formData.releaseDate}
              onChange={handleChange}
              required
              className='w-full px-4 py-3 rounded-lg bg-white/5 border border-white/20 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/40 transition-all'
            />
          </div>

          <div>
            <label className='block text-sm font-medium mb-2 text-white/90'>Artists *</label>
            <div className='space-y-2'>
              <input
                type='text'
                value={artistSearch}
                onChange={(e) => setArtistSearch(e.target.value)}
                placeholder='Search artists...'
                className='w-full px-4 py-3 rounded-lg bg-white/5 border border-white/20 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/40 transition-all'
              />
              <div className='max-h-40 overflow-y-auto border border-white/20 rounded-lg p-3 bg-white/5'>
                {filteredArtists.length === 0 ? (
                  <p className='text-gray-400 text-sm'>No artists found</p>
                ) : (
                  <div className='space-y-2'>
                    {filteredArtists.map(artist => (
                      <label key={artist.artistId} className='flex items-center gap-2 cursor-pointer hover:bg-white/5 p-2 rounded'>
                        <input
                          type='checkbox'
                          checked={formData.artistIds.includes(artist.artistId)}
                          onChange={() => handleArtistToggle(artist.artistId)}
                          className='w-4 h-4'
                        />
                        <span className='text-sm'>{artist.artistName}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            </div>
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

export default AlbumFormModal

