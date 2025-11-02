import React from 'react'

const AlbumSearchProfile = ({ album }) => {
  return (
    <div className="flex flex-col gap-3 p-4 hover:bg-white/10 rounded-lg cursor-pointer">
      <div className="relative w-24 h-24 rounded overflow-hidden bg-[#2a2a2a] flex items-center justify-center">
        {album.image ? (
          <img 
            src={album.image} 
            alt={album.title} 
            className="w-full h-full object-cover rounded" 
            crossOrigin="anonymous"
            onError={(e) => {
              e.target.style.display = 'none'
              const fallback = e.target.nextSibling
              if (fallback) {
                fallback.style.display = 'flex'
              }
            }}
          />
        ) : null}
        <div className="hidden w-full h-full items-center justify-center text-gray-400 text-2xl">
          💿
        </div>
      </div>
      <div>
        <h3 className="font-medium text-white">{album.title}</h3>
        <p className="text-sm text-gray-400">
          {album.artist && album.year 
            ? `${album.artist} • ${album.year}`
            : album.artist || album.year || 'Unknown'}
        </p>
      </div>
    </div>
  )
}

export default AlbumSearchProfile



