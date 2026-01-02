import React, { useRef, useEffect } from 'react'
import { getImageUrl } from '../../helpers/apiClient'

const UserFormModal = ({ isOpen, onClose, onSubmit, formData, setFormData }) => {
  const fileInputRef = useRef(null)
  
  useEffect(() => {
    if (!isOpen && formData.profileUrl && formData.profileUrl.startsWith('blob:')) {
      URL.revokeObjectURL(formData.profileUrl)
    }
  }, [isOpen, formData.profileUrl])
  
  if (!isOpen) return null

  return (
    <div className='fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4' onClick={onClose}>
      <div className='bg-[#282828] rounded-2xl p-6 max-w-md w-full shadow-2xl border border-white/10' onClick={(e) => e.stopPropagation()}>
        <h2 className='text-2xl font-bold mb-6 text-white'>Edit Profile</h2>
        <form onSubmit={onSubmit} className='space-y-5'>
          <div>
            <label className='block text-sm font-medium mb-2 text-white/90'>Username</label>
            <input
              type='text'
              maxLength={100}
              value={formData.userName || ''}
              onChange={(e) => setFormData({ ...formData, userName: e.target.value })}
              className='w-full px-4 py-3 rounded-lg bg-white/5 border border-white/20 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/40 transition-all'
              placeholder='Enter user name'
            />
          </div>
          <div>
            <label className='block text-sm font-medium mb-2 text-white/90'>Date of Birth</label>
            <input
              type='date'
              value={formData.dateOfBirth || ''}
              onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
              className='w-full px-4 py-3 rounded-lg bg-white/5 border border-white/20 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/40 transition-all'
            />
          </div>
          <div>
            <label className='block text-sm font-medium mb-2 text-white/90'>Profile Image (optional)</label>
            <input
              ref={fileInputRef}
              key={isOpen ? 'open' : 'closed'}
              type='file'
              accept='image/*'
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) {
                  if (formData.profileUrl && formData.profileUrl.startsWith('blob:')) {
                    URL.revokeObjectURL(formData.profileUrl)
                  }
                  setFormData({ ...formData, profileImage: file, profileUrl: URL.createObjectURL(file) })
                }
              }}
              className='w-full px-4 py-3 rounded-lg bg-white/5 border border-white/20 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/40 transition-all file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-white/10 file:text-white hover:file:bg-white/20 file:cursor-pointer custom-file-input-color'
            />
            {(formData.profileUrl || formData.existingProfileUrl) && (
              <div className='mt-3'>
                <img 
                  src={formData.profileUrl || getImageUrl(formData.existingProfileUrl)} 
                  alt='Profile preview' 
                  className='w-32 h-32 object-cover rounded-lg border border-white/20'
                />
                <button
                  type='button'
                  onClick={() => {
                    if (formData.profileUrl && formData.profileUrl.startsWith('blob:')) {
                      URL.revokeObjectURL(formData.profileUrl)
                    }
                    if (fileInputRef.current) {
                      fileInputRef.current.value = ''
                    }
                    setFormData({ ...formData, profileImage: null, profileUrl: formData.existingProfileUrl || '' })
                  }}
                  className='mt-2 text-xs text-red-400 hover:text-red-300'
                >
                  Remove image
                </button>
              </div>
            )}
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
              className='flex-1 px-4 py-3 rounded-full bg-white text-black font-semibold hover:bg-gray-200 transition-colors shadow-lg'
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default UserFormModal







