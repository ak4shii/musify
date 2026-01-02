import React from 'react'
import { Link } from 'react-router-dom'

const AlbumSearchProfile = ({ album }) => {
  const albumId = album?.id || album?.albumId;
  
  if (!albumId) {
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
        <div className="min-w-0">
          <h3 className="font-medium text-white truncate">{album.title}</h3>
          {(() => {
            const artistLabel = album.primaryArtistName 
              || (album.artistNames && album.artistNames.length > 0 ? album.artistNames[0] : null)
              || album.artistName
              || album.artist
              || null;
            const artistId = album?.primaryArtistId;
            const displayText = artistLabel && album.year 
              ? `${artistLabel} • ${album.year}`
              : artistLabel || album.year || 'Unknown';
            
            if (artistId && artistLabel) {
              return (
                <Link 
                  to={`/artists/${artistId}`}
                  onClick={(e) => e.stopPropagation()}
                  className="text-sm text-gray-400 truncate hover:text-white hover:underline underline-offset-1 transition-colors inline-block max-w-full cursor-pointer"
                >
                  {displayText}
                </Link>
              );
            }
            return (
              <p className="text-sm text-gray-400 truncate">
                {displayText}
              </p>
            );
          })()}
        </div>
      </div>
    )
  }
  
  return (
    <Link to={`/albums/${albumId}`} className="flex flex-col gap-3 p-4 hover:bg-white/10 rounded-lg cursor-pointer block">
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
      <div className="min-w-0">
        <h3 className="font-medium text-white truncate">{album.title}</h3>
        {(() => {
          const artistLabel = album.primaryArtistName 
            || (album.artistNames && album.artistNames.length > 0 ? album.artistNames[0] : null)
            || album.artistName
            || album.artist
            || null;
          const artistId = album?.primaryArtistId;
          const displayText = artistLabel && album.year 
            ? `${artistLabel} • ${album.year}`
            : artistLabel || album.year || 'Unknown';
          
          if (artistId && artistLabel) {
            return (
              <Link 
                to={`/artists/${artistId}`}
                onClick={(e) => e.stopPropagation()}
                className="text-sm text-gray-400 truncate hover:text-white hover:underline underline-offset-1 transition-colors inline-block max-w-full"
              >
                {displayText}
              </Link>
            );
          }
          return (
            <p className="text-sm text-gray-400 truncate">
              {displayText}
            </p>
          );
        })()}
      </div>
    </Link>
  )
}

export default AlbumSearchProfile





