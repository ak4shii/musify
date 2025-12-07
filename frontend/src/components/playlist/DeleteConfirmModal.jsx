import React from 'react'

const DeleteConfirmModal = ({ isOpen, onClose, onConfirm, playlistName }) => {
  if (!isOpen) return null

  return (
    <div className='fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4' onClick={onClose}>
      <div className='bg-[#181818] rounded-2xl p-6 max-w-md w-full' onClick={(e) => e.stopPropagation()}>
        <h2 className='text-2xl font-bold mb-4'>Delete Playlist</h2>
        <p className='text-white/70 mb-6'>
          Are you sure you want to delete &quot;{playlistName}&quot;? This action cannot be undone.
        </p>
        <div className='flex gap-3'>
          <button
            type='button'
            onClick={onClose}
            className='flex-1 px-4 py-2 rounded-full border border-white/30 hover:bg-white/10 transition-colors'
          >
            Cancel
          </button>
          <button
            type='button'
            onClick={onConfirm}
            className='flex-1 px-4 py-2 rounded-full bg-red-600 text-white font-semibold hover:bg-red-700 transition-colors'
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}

export default DeleteConfirmModal




