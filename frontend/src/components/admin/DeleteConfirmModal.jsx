import React from 'react'

const DeleteConfirmModal = ({ isOpen, onClose, onConfirm, title, message, itemName }) => {
  if (!isOpen) return null

  return (
    <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50' onClick={onClose}>
      <div className='bg-[#282828] rounded-lg p-6 max-w-md w-full mx-4' onClick={(e) => e.stopPropagation()}>
        <h2 className='text-2xl font-bold mb-4'>{title || 'Confirm Delete'}</h2>
        <p className='text-gray-300 mb-6'>
          {message || `Are you sure you want to delete ${itemName ? `"${itemName}"` : 'this item'}? This action cannot be undone.`}
        </p>
        <div className='flex gap-3 justify-end'>
          <button
            onClick={onClose}
            className='px-6 py-2 rounded-full bg-transparent border border-white/20 text-white hover:bg-white/10 transition-colors'
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className='px-6 py-2 rounded-full bg-red-600 text-white hover:bg-red-700 transition-colors'
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}

export default DeleteConfirmModal




