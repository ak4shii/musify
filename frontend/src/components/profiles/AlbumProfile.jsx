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
        <p className='font-semibold text-sm mb-1 truncate'>{album?.title || `Album ${index + 1}`}</p>
        {(() => {
          const artistLabel = album?.primaryArtistName 
            || (album?.artistNames && album.artistNames.length > 0 ? album.artistNames[0] : null)
            || album?.artistName
            || album?.artist
            || '';
          const artistId = album?.primaryArtistId;
          
        if (artistId && artistLabel) {
          return (
            <Link 
              to={`/artists/${artistId}`}
              onClick={(e) => e.stopPropagation()}
              className='text-xs text-gray-400 truncate hover:text-white hover:underline underline-offset-1 transition-colors inline-block max-w-full cursor-pointer'
            >
              {artistLabel}
            </Link>
          );
        }
          return (
            <p className='text-xs text-gray-400 truncate'>
              {artistLabel}
            </p>
          );
        })()}
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
      <p className='font-semibold text-sm mb-1 truncate'>{album?.title || `Album ${index + 1}`}</p>
      {(() => {
        const artistLabel = album?.primaryArtistName 
          || (album?.artistNames && album.artistNames.length > 0 ? album.artistNames[0] : null)
          || album?.artistName
          || album?.artist
          || '';
        const artistId = album?.primaryArtistId;
        
        if (artistId && artistLabel) {
          return (
            <Link 
              to={`/artists/${artistId}`}
              onClick={(e) => e.stopPropagation()}
              className='text-xs text-gray-400 truncate hover:text-white hover:underline underline-offset-1 transition-colors inline-block max-w-full cursor-pointer'
            >
              {artistLabel}
            </Link>
          );
        }
        return (
          <p className='text-xs text-gray-400 truncate'>
            {artistLabel}
          </p>
        );
      })()}
    </Link>
  )
}

export default AlbumProfile