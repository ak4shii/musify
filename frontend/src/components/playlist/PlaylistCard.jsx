import React from 'react'
import { Link } from 'react-router-dom'
import { getImageUrl } from '../../helpers/apiClient'

const PlaylistCard = ({ playlist, onEdit, onDelete }) => {
  return (
    <div className='bg-[#181818] rounded-lg p-4 hover:bg-[#242424] transition-colors duration-200 group relative'>
      <Link to={`/playlists/${playlist.playlistId}`} className='block'>
        <div className='w-full aspect-square rounded-lg bg-gradient-to-br from-[#8B5CF6] to-[#3B82F6] mb-3 relative overflow-hidden'>
          {playlist.coverUrl ? (
            <img
              src={getImageUrl(playlist.coverUrl)}
              alt={playlist.playlistName}
              className='w-full h-full object-cover'
              onError={(e) => {
                e.target.style.display = 'none'
              }}
            />
          ) : (
            <div className='w-full h-full flex items-center justify-center'>
              <svg className='w-12 h-12 text-white opacity-80' fill='currentColor' viewBox='0 0 24 24'>
                <path d='M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-1 9H9V9h10v2zm-4 4H9v-2h6v2zm4-8H9V5h10v2z' />
              </svg>
            </div>
          )}
        </div>
        <p className='font-semibold text-sm mb-1 line-clamp-1'>{playlist.playlistName}</p>
        <div className='flex items-center gap-2 text-xs text-[#b3b3b3]'>
          <span>{playlist.isPublic ? 'Public' : 'Private'}</span>
        </div>
      </Link>
      <div className='absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2'>
        <button
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            onEdit(playlist)
          }}
          className='p-2 bg-black/60 hover:bg-black/80 rounded-full backdrop-blur-sm transition-colors'
          title='Edit playlist'
        >
          <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z' />
          </svg>
        </button>
        <button
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            onDelete(playlist)
          }}
          className='p-2 bg-black/60 hover:bg-black/80 rounded-full backdrop-blur-sm transition-colors'
          title='Delete playlist'
        >
          <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16' />
          </svg>
        </button>
      </div>
    </div>
  )
}

export default PlaylistCard





