import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { usePlayer } from '../../../contexts/PlayerContext'
import { useAuth } from '../../../contexts/AuthContext'
import { assets } from '../../../assets/assets'
import toast from '../../../helpers/singleToast'
import { useUserRelations } from '../../../contexts/UserRelationsContext'
import TrackMenu from '../../track/TrackMenu'
import { getImageUrl } from '../../../helpers/apiClient'

const TrackArtistShowProfile = ({ track, additionalActions }) => {
  const { playTrack } = usePlayer()
  const { isAuthenticated } = useAuth()
  const { isTrackLiked, likeTrack, unlikeTrack } = useUserRelations()
  const [pendingLike, setPendingLike] = useState(false)
  const trackId = track?.trackId ?? track?.id
  const liked = isTrackLiked(trackId)

  const formatDuration = (duration) => {
    if (!duration) return '-'
    
    if (typeof duration === 'number') {
      const minutes = Math.floor(duration / 60)
      const seconds = Math.floor(duration % 60).toString().padStart(2, '0')
      return `${minutes}:${seconds}`
    }
    
    const parts = String(duration).split(':')
    if (parts.length === 3) {
      const [hours, minutes, seconds] = parts.map(Number)
      const totalMinutes = hours * 60 + minutes
      return `${totalMinutes}:${seconds.toString().padStart(2, '0')}`
    } else if (parts.length === 2) {
      return duration
    }
    return duration
  }

  const handleClick = () => {
    if (!isAuthenticated) {
      toast.error('Please log in to play music')
      return
    }
    if (track.filePath || track.coverUrl || track.trackId || track.id) {
      playTrack(track)
    }
  }

  const handleLikeToggle = async (event) => {
    event.stopPropagation()
    if (!isAuthenticated) {
      toast.error('Please log in to save songs')
      return
    }
    if (!trackId || pendingLike) return
    setPendingLike(true)
    try {
      if (liked) {
        await unlikeTrack(trackId)
        toast.success('Removed from liked songs')
      } else {
        await likeTrack(track)
        toast.success('Added to liked songs')
      }
    } catch (error) {
      toast.error('Could not update liked songs')
    } finally {
      setPendingLike(false)
    }
  }

  return (
    <div 
      className="flex items-center gap-3 p-2 hover:bg-white/10 rounded-lg cursor-pointer transition-colors group/track"
      onClick={handleClick}
    >
      <div className="relative w-14 h-14 rounded overflow-hidden bg-[#2a2a2a] flex items-center justify-center flex-shrink-0">
        {(() => {
          const imagePath = track?.coverUrl || track?.cover_url || track?.imagePath || track?.image_path || track?.image;
          const imageUrl = imagePath ? (imagePath.startsWith('http') ? imagePath : getImageUrl(imagePath)) : null;
          return imageUrl ? (
            <img 
              src={imageUrl} 
              alt={track.title || 'Track cover'} 
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
          ) : null;
        })()}
        <div className="hidden w-full h-full items-center justify-center text-gray-400 text-sm">
          🎵
        </div>
        <div className='absolute inset-0 flex items-center justify-center opacity-0 group-hover/track:opacity-100 transition-opacity duration-200'>
          <button 
            onClick={(e) => {
              e.stopPropagation()
              handleClick()
            }} 
            className='w-6 h-6 rounded-full bg-black/70 flex items-center justify-center hover:invert'
          >
            <img
              src={assets.play_icon}
              alt='Play'
              className='w-3 h-3 filter transition'
            />
          </button>
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-medium text-white text-sm truncate">{track.title || 'Unknown Track'}</h3>
        <p className="text-xs text-gray-400 truncate">
          {(() => {
            const artistLabel = track.primaryArtistName 
              || track.artistName
              || track.artist
              || (track.artistNames && track.artistNames.length > 0 ? track.artistNames[0] : null)
              || (track.artists && track.artists.length > 0 ? (typeof track.artists[0] === 'string' ? track.artists[0] : track.artists[0].name || track.artists[0].artistName) : null)
              || null;
            const albumLabel = track.album || track.albumTitle || null;
            const artistId = track?.primaryArtistId;
            
            if (artistLabel && albumLabel) {
              return (
                <>
                  {artistId ? (
                    <Link 
                      to={`/artists/${artistId}`}
                      onClick={(e) => e.stopPropagation()}
                      className="hover:text-white hover:underline underline-offset-1 transition-colors cursor-pointer"
                    >
                      {artistLabel}
                    </Link>
                  ) : (
                    <span>{artistLabel}</span>
                  )}
                  <span> • {albumLabel}</span>
                </>
              );
            }
            if (artistLabel) {
              return artistId ? (
                <Link 
                  to={`/artists/${artistId}`}
                  onClick={(e) => e.stopPropagation()}
                  className="hover:text-white hover:underline underline-offset-1 transition-colors"
                >
                  {artistLabel}
                </Link>
              ) : (
                <span>{artistLabel}</span>
              );
            }
            return albumLabel || 'Unknown';
          })()}
        </p>
      </div>
      <div className='flex items-center gap-2'>
        <TrackMenu track={track} onLike={handleLikeToggle} liked={liked} />
        {additionalActions}
        <span className="text-xs text-gray-400 flex-shrink-0">{formatDuration(track.duration)}</span>
      </div>
    </div>
  )
}

export default TrackArtistShowProfile

