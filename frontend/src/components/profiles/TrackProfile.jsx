import React, { useState } from 'react'
import { getImageUrl } from '../../helpers/apiClient'
import { assets } from '../../assets/assets'
import { usePlayer } from '../../contexts/PlayerContext'
import { useAuth } from '../../contexts/AuthContext'
import toast from 'react-hot-toast'
import { useUserRelations } from '../../contexts/UserRelationsContext'

const TrackProfile = ({ track, index }) => {
  const { playTrack } = usePlayer();
  const { isAuthenticated } = useAuth();
  const { isTrackLiked, likeTrack, unlikeTrack } = useUserRelations()
  const [pendingLike, setPendingLike] = useState(false)
  const trackId = track?.trackId ?? track?.id
  const liked = isTrackLiked(trackId)
  
  const handlePlay = () => {
    if (!isAuthenticated) {
      toast.error('Please log in to play music')
      return
    }
    playTrack(track)
  }
  const imagePath = track?.coverUrl || track?.cover_url || track?.imagePath || track?.image_path || track?.image;
  const imageUrl = imagePath ? getImageUrl(imagePath) : null;

  const handleLikeToggle = async (event) => {
    event.stopPropagation()
    event.preventDefault()
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
      console.error('Failed to toggle like:', error)
      toast.error('Could not like songs')
    } finally {
      setPendingLike(false)
    }
  }
  
  return (
    <div className='bg-[#181818] rounded p-4 min-w-[180px] snap-start group/track hover:bg-[#242424] transition-colors duration-200'>
      <div className='w-full aspect-square rounded bg-[#2a2a2a] mb-3 flex items-center justify-center relative overflow-hidden'>
        <button
          onClick={handleLikeToggle}
          disabled={pendingLike}
          aria-label={liked ? 'Unlike track' : 'Like track'}
          className={`absolute top-2 right-2 z-10 bg-black/60 rounded-full p-1.5 hover:bg-black/80 transition-colors disabled:opacity-50 ${
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
        {imageUrl ? (
          <img 
            src={imageUrl} 
            alt={track.title || `Song ${index + 1}`} 
            className="w-full h-full object-cover rounded"
            crossOrigin="anonymous"
            onError={(e) => {
              console.error('Failed to load cover image:', imageUrl);
              console.error('Image error details:', e.target.naturalWidth, e.target.naturalHeight, e.target.complete);
              e.target.style.display = 'none'
              const fallback = e.target.nextSibling
              if (fallback) {
                fallback.style.display = 'flex'
                fallback.classList.remove('hidden')
              }
            }}
            onLoad={() => {
              console.log('Successfully loaded cover image:', imageUrl);
            }}
          />
        ) : null}
        <div className={`w-full h-full items-center justify-center text-gray-400 text-xs ${imageUrl ? 'hidden' : 'flex'}`}>
          🎵
        </div>
        <div className='absolute inset-0 flex items-center justify-center opacity-0 group-hover/track:opacity-100 transition-opacity duration-200'>
          <button onClick={handlePlay} className='w-8 h-8 rounded-full bg-black/70 flex items-center justify-center hover:invert'>
            <img
              src={assets.play_icon}
              alt='Play'
              className='w-4 h-4 filter transition'
            />
          </button>
        </div>
      </div>
      <p className='font-semibold text-sm mb-1'>{track?.title || `Song ${index + 1}`}</p>
      <p className='text-xs text-[#b3b3b3]'>
        {track?.album || 'Unknown Album'}
      </p>
    </div>
  )
}

export default TrackProfile
