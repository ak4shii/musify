import React from 'react'
import { Link } from 'react-router-dom'
import { getImageUrl } from '../../helpers/apiClient'

const AlbumProfile = ({ album, index }) => {
  const imagePath = album?.coverUrl || album?.cover_url || album?.imagePath || album?.image_path || album?.image;
  const imageUrl = imagePath ? getImageUrl(imagePath) : null;
  const albumId = album?.id || album?.albumId;
  
  if (!albumId) {
    return (
      <div className='bg-[#181818] rounded p-4 min-w-[180px] max-w-[180px] snap-start group hover:bg-[#242424] transition-colors duration-200'>
        <div className='w-full aspect-square rounded bg-[#2a2a2a] mb-3 flex items-center justify-center relative overflow-hidden'>
          {imageUrl ? (
            <img 
              src={imageUrl} 
              alt={album.title || `Album ${index + 1}`} 
              className="w-full h-full object-cover rounded transition-transform duration-300 hover:scale-110"
              crossOrigin="anonymous"
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
          <div className={`w-full h-full items-center justify-center text-gray-400 text-xs ${imageUrl ? 'hidden' : 'flex'}`}>
            💿
          </div>
        </div>
        <p className='font-semibold text-sm mb-1'>{album?.title || `Album ${index + 1}`}</p>
      </div>
    )
  }
  
  return (
    <Link to={`/albums/${albumId}`} className='bg-[#181818] rounded p-4 min-w-[180px] max-w-[180px] snap-start group hover:bg-[#242424] transition-colors duration-200 block'>
      <div className='w-full aspect-square rounded bg-[#2a2a2a] mb-3 flex items-center justify-center relative overflow-hidden'>
        {imageUrl ? (
          <img 
            src={imageUrl} 
            alt={album.title || `Album ${index + 1}`} 
            className="w-full h-full object-cover rounded transition-transform duration-300 hover:scale-110"
            crossOrigin="anonymous"
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
        <div className={`w-full h-full items-center justify-center text-gray-400 text-xs ${imageUrl ? 'hidden' : 'flex'}`}>
          💿
        </div>
      </div>
      <p className='font-semibold text-sm mb-1'>{album?.title || `Album ${index + 1}`}</p>
    </Link>
  )
}

export default AlbumProfile