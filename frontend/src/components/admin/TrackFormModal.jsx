import React, { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import apiClient from '../../helpers/apiClient'

const TrackFormModal = ({ isOpen, onClose, onSubmit, initialData, albums = [], artists = [] }) => {
  const [formData, setFormData] = useState({
    albumId: '',
    title: '',
    genre: '',
    artistIds: [],
    file: null
  })
  const [loading, setLoading] = useState(false)
  const [filePreview, setFilePreview] = useState(null)

  useEffect(() => {
    if (initialData) {
      setFormData({
        albumId: initialData.albumId || '',
        title: initialData.title || '',
        genre: initialData.genre || '',
        artistIds: initialData.artistIds || [],
        file: null
      })
    } else {
      setFormData({
        albumId: '',
        title: '',
        genre: '',
        artistIds: [],
        file: null
      })
    }
    setFilePreview(null)
  }, [initialData, isOpen])

  const handleChange = (e) => {
    const { name, value, files } = e.target
    if (name === 'file' && files && files[0]) {
      setFormData(prev => ({ ...prev, file: files[0] }))
      setFilePreview(files[0].name)
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: name === 'albumId' ? (parseInt(value) || '') : value
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

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.albumId) {
      toast.error('Album is required')
      return
    }
    if (!formData.title.trim()) {
      toast.error('Track title is required')
      return
    }
    if (!formData.genre.trim()) {
      toast.error('Genre is required')
      return
    }
    if (formData.artistIds.length === 0) {
      toast.error('At least one artist is required')
      return
    }
    if (!initialData && !formData.file) {
      toast.error('Audio file is required for new tracks')
      return
    }
    
    if (initialData && !formData.file) {
      delete formData.file
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
          {initialData ? 'Edit Track' : 'Create Track'}
        </h2>
        
        <form onSubmit={handleSubmit} className='space-y-4'>
          <div>
            <label className='block text-sm font-medium mb-2'>Album *</label>
            <select
              name='albumId'
              value={formData.albumId}
              onChange={handleChange}
              required
              className='w-full px-4 py-2 bg-[#1a1a1a] border border-white/20 rounded text-white focus:outline-none focus:border-white/40'
            >
              <option value=''>Select an album</option>
              {albums.map(album => (
                <option key={album.albumId} value={album.albumId}>
                  {album.title}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className='block text-sm font-medium mb-2'>Track Title *</label>
            <input
              type='text'
              name='title'
              value={formData.title}
              onChange={handleChange}
              required
              maxLength={200}
              className='w-full px-4 py-2 bg-[#1a1a1a] border border-white/20 rounded text-white focus:outline-none focus:border-white/40'
            />
          </div>

          <div>
            <label className='block text-sm font-medium mb-2'>Genre *</label>
            <input
              type='text'
              name='genre'
              value={formData.genre}
              onChange={handleChange}
              required
              maxLength={100}
              className='w-full px-4 py-2 bg-[#1a1a1a] border border-white/20 rounded text-white focus:outline-none focus:border-white/40'
            />
          </div>

          {!initialData && (
            <div>
              <label className='block text-sm font-medium mb-2'>Audio File *</label>
              <input
                type='file'
                name='file'
                accept='audio/mpeg,audio/mp3,.mp3'
                onChange={handleChange}
                required={!initialData}
                className='w-full px-4 py-2 bg-[#1a1a1a] border border-white/20 rounded text-white focus:outline-none focus:border-white/40'
              />
              {filePreview && (
                <p className='text-sm text-gray-400 mt-1'>Selected: {filePreview}</p>
              )}
            </div>
          )}

          <div>
            <label className='block text-sm font-medium mb-2'>Artists *</label>
            <div className='max-h-40 overflow-y-auto border border-white/20 rounded p-3 bg-[#1a1a1a]'>
              {artists.length === 0 ? (
                <p className='text-gray-400 text-sm'>No artists available</p>
              ) : (
                <div className='space-y-2'>
                  {artists.map(artist => (
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

export default TrackFormModal

