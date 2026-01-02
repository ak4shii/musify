import React from 'react'
import { Link } from 'react-router-dom'
import { getImageUrl } from '../../helpers/apiClient'

const PlaylistSearchProfile = ({ playlist }) => {
  const imagePath = playlist?.image || playlist?.coverUrl || playlist?.cover_url || playlist?.imagePath || playlist?.image_path;
  const imageUrl = imagePath ? getImageUrl(imagePath) : null;
  const playlistId = playlist?.id || playlist?.playlistId;

  if (!playlistId) {
    return (
      <div className='bg-[#181818] rounded p-4 min-w-[180px] max-w-[180px] snap-start group hover:bg-[#242424] transition-colors duration-200'>
        <div className='w-full aspect-square rounded bg-[#2a2a2a] mb-3 flex items-center justify-center relative overflow-hidden'>
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={playlist.title || playlist.playlistName || 'Playlist'}
              className='w-full h-full object-cover rounded transition-transform duration-300 group-hover:scale-110'
              crossOrigin='anonymous'
              onError={(e) => {
                e.target.style.display = 'none'
                const fallback = e.target.nextSibling
                if (fallback) {
                  fallback.style.display = 'flex'
                  fallback.classList.remove('hidden')
                }
              }}
            />
          ) : null}
          <div className={`w-full h-full items-center justify-center text-gray-400 text-3xl ${imageUrl ? 'hidden' : 'flex'}`}>
            🎵
          </div>
        </div>
        <p className='font-semibold text-sm mb-1 truncate'>{playlist.title || playlist.playlistName || 'Playlist'}</p>
        {playlist.owner || playlist.userName || playlist.creator ? (
          <p className='text-xs text-gray-400 truncate'>By {playlist.owner || playlist.userName || playlist.creator}</p>
        ) : null}
      </div>
    )
  }

  return (
    <Link
      to={`/playlists/${playlistId}`}
      className='bg-[#181818] rounded p-4 min-w-[180px] max-w-[180px] snap-start group hover:bg-[#242424] transition-colors duration-200 block'
    >
      <div className='w-full aspect-square rounded bg-[#2a2a2a] mb-3 flex items-center justify-center relative overflow-hidden'>
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={playlist.title || playlist.playlistName || 'Playlist'}
            className='w-full h-full object-cover rounded transition-transform duration-300 group-hover:scale-110'
            crossOrigin='anonymous'
            onError={(e) => {
              e.target.style.display = 'none'
              const fallback = e.target.nextSibling
              if (fallback) {
                fallback.style.display = 'flex'
                fallback.classList.remove('hidden')
              }
            }}
          />
        ) : null}
        <div className={`w-full h-full items-center justify-center text-gray-400 text-3xl ${imageUrl ? 'hidden' : 'flex'}`}>
          🎵
        </div>
      </div>
      <p className='font-semibold text-sm mb-1 truncate'>{playlist.title || playlist.playlistName || 'Playlist'}</p>
      {playlist.owner || playlist.userName || playlist.creator ? (
        <p className='text-xs text-gray-400 truncate'>By {playlist.owner || playlist.userName || playlist.creator}</p>
      ) : null}
    </Link>
  )
}

export default PlaylistSearchProfile
