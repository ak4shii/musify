import React from 'react'

const ArtistSearchProfile = ({ artist }) => {
  return (
    <div className="flex flex-col items-center gap-1 p-0 rounded-lg cursor-pointer">
      <div className="relative w-32 h-32 rounded-full overflow-hidden bg-[#2a2a2a] flex items-center justify-center">
        {artist.image ? (
          <img 
            src={artist.image} 
            alt={artist.name} 
            className="w-full h-full object-cover rounded-full transition-transform duration-300 hover:scale-110" 
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
          👤
        </div>
      </div>
      <div className="text-center">
        <h3 className="font-medium text-white">{artist.name}</h3>
        {artist.followers && (
          <p className="text-sm text-gray-400">{artist.followers} followers</p>
        )}
      </div>
    </div>
  )
}

export default ArtistSearchProfile
