import React from 'react'
import { getImageUrl } from '../../helpers/apiClient'

const FeatureChart = ({ track, index }) => {
  const imagePath = track?.coverUrl || track?.cover_url || track?.imagePath || track?.image_path || track?.image;
  const imageUrl = imagePath ? getImageUrl(imagePath) : null;
  
  return (
    <div className='bg-[#181818] rounded p-4 min-w-[280px] snap-start'>
      <div className='w-full aspect-[3/1] rounded bg-[#2a2a2a] mb-3 flex items-center justify-center'>
        {imageUrl ? (
          <img 
            src={imageUrl} 
            alt={track.title || `Chart ${index + 1}`} 
            className="w-full h-full object-cover rounded"
            crossOrigin="anonymous"
            onError={(e) => {
              e.target.style.display = 'none'
              e.target.nextSibling.style.display = 'flex'
            }}
          />
        ) : null}
        <div className="hidden w-full h-full items-center justify-center text-gray-400 text-xs">
          📊
        </div>
      </div>
      <p className='font-semibold text-sm mb-1'>{track?.title || `Chart ${index + 1}`}</p>
      <p className='text-xs text-[#b3b3b3]'>
        {track?.genre || 'Updated weekly'}
      </p>
    </div>
  )
}

export default FeatureChart

