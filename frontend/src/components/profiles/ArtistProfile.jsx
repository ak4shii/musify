import React from 'react'
import { Link } from 'react-router-dom'
import { getImageUrl } from '../../helpers/apiClient'

const ArtistProfile = ({ artist, index }) => {
  const imagePath = artist?.profileUrl || artist?.profile_url || artist?.imagePath || artist?.image_path || artist?.image;
  const imageUrl = imagePath ? getImageUrl(imagePath) : null;
  const artistId = artist?.id || artist?.artistId;
  
  if (!artistId) {
    return (
      <div className='bg-black rounded p-2 min-w-[160px] max-w-[160px] snap-start group transition-colors duration-200'>
        <div className='w-full aspect-square rounded-full mb-2 flex items-center justify-center relative overflow-hidden bg-transparent'>
          {imageUrl ? (
            <img 
              src={imageUrl} 
              alt={artist.artistName || `Artist ${index + 1}`} 
              className="w-full h-full object-cover rounded-full transition-transform duration-300 hover:scale-110"
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
            👤
          </div>
        </div>
        <p className='text-sm font-semibold text-center leading-tight mb-1'
           style={{
             wordBreak: 'break-word',
             overflowWrap: 'break-word',
             whiteSpace: 'normal',
             lineHeight: '1.2'
           }}
           title={artist?.artistName || `Artist ${index + 1}`}>
          {artist?.artistName || `Artist ${index + 1}`}
        </p>
      </div>
    )
  }
  
  return (
    <Link to={`/artists/${artistId}`} className='bg-black rounded p-2 min-w-[160px] max-w-[160px] snap-start group transition-colors duration-200 block'>
      <div className='w-full aspect-square rounded-full mb-2 flex items-center justify-center relative overflow-hidden bg-transparent'>
        {imageUrl ? (
          <img 
            src={imageUrl} 
            alt={artist.artistName || `Artist ${index + 1}`} 
            className="w-full h-full object-cover rounded-full transition-transform duration-300 hover:scale-110"
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
          👤
        </div>
      </div>
      <p className='text-sm font-semibold text-center leading-tight mb-1'
         style={{
           wordBreak: 'break-word',
           overflowWrap: 'break-word',
           whiteSpace: 'normal',
           lineHeight: '1.2'
         }}
         title={artist?.artistName || `Artist ${index + 1}`}>
        {artist?.artistName || `Artist ${index + 1}`}
      </p>
    </Link>
  )
}

export default ArtistProfile