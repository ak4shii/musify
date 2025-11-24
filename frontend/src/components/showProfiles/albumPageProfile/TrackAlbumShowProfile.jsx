import React, { useState } from 'react'
import { usePlayer } from '../../../contexts/PlayerContext'
import { useAuth } from '../../../contexts/AuthContext'
import { useUserRelations } from '../../../contexts/UserRelationsContext'
import toast from 'react-hot-toast'

const TrackAlbumShowProfile = ({ track, index, album }) => {
  const { playTrack } = usePlayer()
  const { isAuthenticated } = useAuth()
  const { isTrackLiked, likeTrack, unlikeTrack } = useUserRelations()
  const [pendingLike, setPendingLike] = useState(false)
  const trackId = track?.trackId ?? track?.id
  const liked = isTrackLiked(trackId)

  const formatDuration = (value) => {
    if (value == null) return '-';
    if (typeof value === 'number') {
      const minutes = Math.floor(value / 60);
      const seconds = Math.floor(value % 60).toString().padStart(2, '0');
      return `${minutes}:${seconds}`;
    }
    if (typeof value === 'string') return value;
    return String(value);
  };

  const handlePlayTrack = () => {
    if (!track) return;
    if (!isAuthenticated) {
      toast.error('Please log in to play music');
      return;
    }
    playTrack(track);
  };

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
      console.error('Failed to toggle track like:', error)
      toast.error('Could not update liked songs')
    } finally {
      setPendingLike(false)
    }
  }

  return (
    <div
      onClick={handlePlayTrack}
      className='w-full flex items-center gap-4 px-4 py-3 hover:bg-white/10 transition text-left cursor-pointer group/track'
    >
      <span className='w-6 text-sm text-gray-400'>{index + 1}</span>
      <div className='flex-1'>
        <p className='text-base font-medium'>
          {track?.title || track?.name || `Track ${index + 1}`}
        </p>
        <p className='text-xs text-gray-400'>
          {track?.artist || track?.artistName || album?.artist || album?.artistName || ''}
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
            <path d='M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54z' />
          </svg>
        </button>
        <span className='text-sm text-gray-300'>
          {formatDuration(track?.duration || track?.durationMs / 1000)}
        </span>
      </div>
    </div>
  )
}

export default TrackAlbumShowProfile
