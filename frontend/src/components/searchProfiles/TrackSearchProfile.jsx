import React, { useState } from 'react'
import { usePlayer } from '../../contexts/PlayerContext'
import { useAuth } from '../../contexts/AuthContext'
import { assets } from '../../assets/assets'
import toast from 'react-hot-toast'
import { useUserRelations } from '../../contexts/UserRelationsContext'

const TrackSearchProfile = ({ track }) => {
  const { playTrack } = usePlayer()
  const { isAuthenticated } = useAuth()
  const { isTrackLiked, likeTrack, unlikeTrack } = useUserRelations()
  const [pendingLike, setPendingLike] = useState(false)
  const trackId = track?.trackId ?? track?.id
  const liked = isTrackLiked(trackId)

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
      console.error('Failed to toggle search track like:', error)
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
        <p className="text-sm text-gray-400 truncate">
          {track.artist && track.album 
            ? `${track.artist} • ${track.album}`
            : track.artist || track.album || 'Unknown'}
        </p>
      </div>
      <div className='flex items-center gap-3'>
        <button
          onClick={handleLikeToggle}
          disabled={pendingLike}
          aria-label={liked ? 'Unlike track' : 'Like track'}
          className={`p-1 rounded-full hover:bg-white/10 transition-colors disabled:opacity-50 ${
            liked ? 'opacity-100' : 'opacity-0 group-hover/track:opacity-100'
          }`}
        >
          <svg
            viewBox='0 0 24 24'
            width='18'
            height='18'
            fill={liked ? '#1DB954' : 'none'}
            stroke={liked ? '#1DB954' : '#ffffff'}
            strokeWidth='1.5'
          >
            <path d='M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z' />
          </svg>
        </button>
        <span className="text-sm text-gray-400 flex-shrink-0">{formatDuration(track.duration)}</span>
      </div>
    </div>
  )
}

export default TrackSearchProfile
