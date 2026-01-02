import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { usePlayer } from '../../contexts/PlayerContext'
import { useAuth } from '../../contexts/AuthContext'
import { assets } from '../../assets/assets'
import toast from '../../helpers/singleToast'
import { useUserRelations } from '../../contexts/UserRelationsContext'
import TrackMenu from '../track/TrackMenu'

const TrackSearchProfile = ({ track }) => {
  const { playTrack } = usePlayer()
  const { isAuthenticated } = useAuth()
  const { isTrackLiked, likeTrack, unlikeTrack } = useUserRelations()
  const [pendingLike, setPendingLike] = useState(false)
  const trackId = track?.trackId ?? track?.id
  const liked = isTrackLiked(trackId)
  const artistNames = track?.artistNames || track?.artists
  const artistLabel = track?.primaryArtistName 
    || track?.artistName
    || track?.artist
    || (artistNames && artistNames.length ? artistNames.join(', ') : null)
    || 'Unknown Artist'

  const formatDuration = (duration) => {
    if (!duration) return '-'
    
    const parts = duration.split(':')
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
    if (track.filePath || track.coverUrl || track.trackId) {
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
      className="flex items-center gap-4 p-4 hover:bg-white/10 rounded-lg cursor-pointer transition-colors group/track"
      onClick={handleClick}
    >
      <div className="relative w-20 h-20 rounded overflow-hidden bg-[#2a2a2a] flex items-center justify-center flex-shrink-0">
        {track.image ? (
          <img 
            src={track.image} 
            alt={track.title} 
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
        <div className="hidden w-full h-full items-center justify-center text-gray-400 text-base">
          🎵
        </div>
        <div className='absolute inset-0 flex items-center justify-center opacity-0 group-hover/track:opacity-100 transition-opacity duration-200'>
          <button 
            onClick={(e) => {
              e.stopPropagation()
              handleClick()
            }} 
            className='w-8 h-8 rounded-full bg-black/70 flex items-center justify-center hover:invert'
          >
            <img
              src={assets.play_icon}
              alt='Play'
              className='w-4 h-4 filter transition'
            />
          </button>
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-medium text-white text-base truncate">{track.title}</h3>
        {track?.primaryArtistId ? (
          <Link 
            to={`/artists/${track.primaryArtistId}`}
            onClick={(e) => e.stopPropagation()}
            className="text-sm text-gray-400 truncate hover:text-white hover:underline underline-offset-1 transition-colors inline-block max-w-full cursor-pointer"
          >
            {artistLabel}
          </Link>
        ) : (
          <p className="text-sm text-gray-400 truncate">
            {artistLabel}
          </p>
        )}
      </div>
      <div className='flex items-center gap-8'>
        <TrackMenu track={track} onLike={handleLikeToggle} liked={liked} />
        <span className="text-sm text-gray-400 flex-shrink-0">{formatDuration(track.duration)}</span>
      </div>
    </div>
  )
}

export default TrackSearchProfile
