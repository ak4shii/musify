import React from 'react'
import { getImageUrl } from '../../helpers/apiClient'

const ArtistProfile = ({ artist, index }) => {
  return (
    <div className='flex flex-col items-center text-center min-w-[110px] max-w-[120px] snap-start'>
      <div className='w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-[#2a2a2a] mb-3 flex items-center justify-center'>
        {artist?.profileUrl ? (
          <img 
            src={getImageUrl(artist.profileUrl)} 
            alt={artist.artistName || `Artist ${index + 1}`} 
            className="w-full h-full object-cover rounded-full"
            onError={(e) => {
              e.target.style.display = 'none'
              e.target.nextSibling.style.display = 'flex'
            }}
          />
        ) : null}
        <div className="hidden w-full h-full items-center justify-center text-gray-400 text-xs">
          👤
        </div>
      </div>
      <div className='min-h-[2rem] max-h-[4rem] flex items-center justify-center px-1 w-full'>
        <p className='text-sm font-semibold text-center leading-tight' 
           style={{ 
             wordBreak: 'break-word',
             overflowWrap: 'break-word',
             whiteSpace: 'normal',
             maxWidth: '100px',
             lineHeight: '1.2'
           }}
           title={artist?.artistName || `Artist ${index + 1}`}>
          {artist?.artistName || `Artist ${index + 1}`}
        </p>
      </div>
    </div>
  )
}

export default ArtistProfile