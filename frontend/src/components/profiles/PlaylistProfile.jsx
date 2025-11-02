import React from 'react'

const PlaylistProfile = ({ playlist, index }) => {
  return (
    <div className='bg-[#181818] rounded p-4 min-w-[180px] snap-start group hover:bg-[#242424] transition-colors duration-200'>
      <div className='w-full aspect-square rounded bg-[#2a2a2a] mb-3'>
        {playlist?.image && (
          <img 
            src={playlist.image} 
            alt={playlist.name || `Playlist ${index + 1}`} 
            className="w-full h-full object-cover rounded"
            onError={(e) => {
              e.target.style.display = 'none'
            }}
          />
        )}
      </div>
      <p className='font-semibold text-sm mb-1'>{playlist?.name || `Playlist ${index + 1}`}</p>
      <p className='text-xs text-[#b3b3b3]'>{playlist?.creator || 'Creator'}</p>
    </div>
  )
}

export default PlaylistProfile













