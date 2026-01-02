import React, { useState, useEffect } from 'react'
import toast from '../../helpers/singleToast'

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
  const [albumSearch, setAlbumSearch] = useState('')
  const [artistSearch, setArtistSearch] = useState('')

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

  const filteredAlbums = albums.filter((a) => {
    const q = albumSearch.trim().toLowerCase()
    if (!q) return true
    return String(a?.title ?? '').toLowerCase().includes(q)
  })

  const filteredArtists = artists.filter((a) => {
    const q = artistSearch.trim().toLowerCase()
    if (!q) return true
    return String(a?.artistName ?? '').toLowerCase().includes(q)
  })

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
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className='fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4' onClick={onClose}>
      <div className='bg-[#282828] rounded-2xl p-6 max-w-md w-full shadow-2xl border border-white/10 max-h-[90vh] overflow-y-auto' onClick={(e) => e.stopPropagation()}>
        <h2 className='text-2xl font-bold mb-6'>
          {initialData ? 'Edit Track' : 'Create Track'}
        </h2>
        
        <form onSubmit={handleSubmit} className='space-y-4'>
          <div>
            <label className='block text-sm font-medium mb-2 text-white/90'>Album *</label>
            <div className='space-y-2'>
              <input
                type='text'
                value={albumSearch}
                onChange={(e) => setAlbumSearch(e.target.value)}
                placeholder='Search albums...'
                className='w-full px-4 py-3 rounded-lg bg-white/5 border border-white/20 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/40 transition-all'
              />
              <div className='max-h-40 overflow-y-auto border border-white/20 rounded-lg p-3 bg-white/5'>
                {filteredAlbums.length === 0 ? (
                  <p className='text-gray-400 text-sm'>No albums found</p>
                ) : (
                  <div className='space-y-2'>
                    {filteredAlbums.map(album => (
                      <label key={album.albumId} className='flex items-center gap-2 cursor-pointer hover:bg-white/5 p-2 rounded'>
                        <input
                          type='radio'
                          name='albumId'
                          value={album.albumId}
                          checked={formData.albumId === album.albumId}
                          onChange={handleChange}
                          className='w-4 h-4'
                        />
                        <span className='text-sm'>{album.title}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div>
            <label className='block text-sm font-medium mb-2 text-white/90'>Track Title *</label>
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
            <label className='block text-sm font-medium mb-2 text-white/90'>Genre *</label>
            <input
              type='text'
              name='genre'
              value={formData.genre}
              onChange={handleChange}
              required
              maxLength={100}
              className='w-full px-4 py-3 rounded-lg bg-white/5 border border-white/20 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/40 transition-all'
            />
          </div>

          {!initialData && (
            <div>
              <label className='block text-sm font-medium mb-2 text-white/90'>Audio File *</label>
              <input
                type='file'
                name='file'
                accept='audio/mpeg,audio/mp3,.mp3'
                onChange={handleChange}
                required={!initialData}
                className='w-full px-4 py-3 rounded-lg bg-white/5 border border-white/20 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/40 transition-all file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-white/10 file:text-white hover:file:bg-white/20 file:cursor-pointer custom-file-input-color'
              />
              {filePreview && (
                <p className='text-sm text-gray-400 mt-1'>Selected: {filePreview}</p>
              )}
            </div>
          )}

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

export default TrackFormModal

