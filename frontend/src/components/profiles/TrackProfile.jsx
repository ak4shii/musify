import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { getImageUrl } from '../../helpers/apiClient'
import { assets } from '../../assets/assets'
import { usePlayer } from '../../contexts/PlayerContext'
import { useAuth } from '../../contexts/AuthContext'
import toast from '../../helpers/singleToast'
import { useUserRelations } from '../../contexts/UserRelationsContext'
import TrackMenu from '../track/TrackMenu'

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
  const artistNames = track?.artistNames || track?.artists;
  const artistLabel = track?.primaryArtistName 
    || (artistNames && artistNames.length ? artistNames.join(', ') : track?.artist)
    || 'Unknown Artist';

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
      toast.error('Could not like songs')
    } finally {
      setPendingLike(false)
    }
  }
  
  return (
    <div className='bg-[#181818] rounded p-4 min-w-[180px] snap-start group/track hover:bg-[#242424] transition-colors duration-200 relative'>
      <div className='w-full aspect-square rounded bg-[#2a2a2a] mb-3 flex items-center justify-center relative overflow-hidden'>
        {imageUrl ? (
          <img 
            src={imageUrl} 
            alt={track.title || `Song ${index + 1}`} 
            className="w-full h-full object-cover rounded"
            crossOrigin="anonymous"
            onError={(e) => {
              e.target.style.display = 'none'
              const fallback = e.target.nextSibling
              if (fallback) {
                fallback.style.display = 'flex'
                fallback.classList.remove('hidden')
              }
            }}
            onLoad={() => {
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
      <div className='absolute top-5 right-4 z-10 opacity-0 group-hover/track:opacity-100 transition-opacity'>
        <TrackMenu track={track} onLike={handleLikeToggle} liked={liked} />
      </div>
      <p className='font-semibold text-sm mb-1 truncate'>{track?.title || `Song ${index + 1}`}</p>
      {track?.primaryArtistId ? (
        <Link 
          to={`/artists/${track.primaryArtistId}`}
          onClick={(e) => e.stopPropagation()}
          className='text-xs text-[#b3b3b3] truncate hover:text-white hover:underline underline-offset-1 transition-colors inline-block max-w-full cursor-pointer'
        >
          {artistLabel}
        </Link>
      ) : (
        <p className='text-xs text-[#b3b3b3] truncate'>
          {artistLabel}
        </p>
      )}
    </div>
  )
}

export default TrackProfile
