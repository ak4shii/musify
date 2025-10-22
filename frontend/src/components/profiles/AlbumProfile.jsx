import React from 'react'
import { getImageUrl } from '../../helpers/apiClient'

const AlbumProfile = ({ album, index }) => {
  return (
    <div className='bg-[#181818] rounded p-4 w-[200px] snap-start'>
      <div className='w-[168px] h-[168px] rounded bg-[#2a2a2a] mb-3 flex items-center justify-center mx-auto'>
        {album?.coverUrl ? (
          <img 
            src={getImageUrl(album.coverUrl)} 
            alt={album.title || `Album ${index + 1}`} 
            className="w-full h-full object-cover rounded"
            onError={(e) => {
              e.target.style.display = 'none'
              e.target.nextSibling.style.display = 'flex'
            }}
          />
        ) : null}
        <div className="hidden w-full h-full items-center justify-center text-gray-400 text-xs">
          💿
        </div>
      </div>
      <p className='font-semibold text-sm text-center'>{album?.title || `Album ${index + 1}`}</p>
    </div>
  )
}

export default AlbumProfile