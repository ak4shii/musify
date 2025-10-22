import React from 'react'
import { getImageUrl } from '../../helpers/apiClient'

const FeatureChart = ({ track, index }) => {
  return (
    <div className='bg-[#181818] rounded p-4 min-w-[280px] snap-start'>
      <div className='w-full aspect-[3/1] rounded bg-[#2a2a2a] mb-3 flex items-center justify-center'>
        {track?.coverUrl ? (
          <img 
            src={getImageUrl(track.coverUrl)} 
            alt={track.title || `Chart ${index + 1}`} 
            className="w-full h-full object-cover rounded"
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
      <p className='text-xs text-[#b3b3b3]'>{track?.genre || 'Updated weekly'}</p>
    </div>
  )
}

export default FeatureChart

