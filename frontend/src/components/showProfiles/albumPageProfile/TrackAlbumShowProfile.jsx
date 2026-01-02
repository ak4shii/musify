import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { usePlayer } from '../../../contexts/PlayerContext'
import { useAuth } from '../../../contexts/AuthContext'
import { useUserRelations } from '../../../contexts/UserRelationsContext'
import toast from '../../../helpers/singleToast'
import TrackMenu from '../../track/TrackMenu'

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
      <span className='w-6 text-sm text-gray-400 flex-shrink-0'>{index + 1}</span>
      <div className='flex-1 min-w-0'>
        <p className='text-base font-medium truncate'>
          {track?.title || track?.name || `Track ${index + 1}`}
        </p>
        <p className='text-xs text-gray-400 truncate'>
          {(() => {
            const artistLabel = track?.primaryArtistName 
              || track?.artistName
              || track?.artist
              || (track?.artistNames && track.artistNames.length > 0 ? track.artistNames[0] : null)
              || album?.primaryArtistName
              || album?.artistName
              || album?.artist
              || (album?.artistNames && album.artistNames.length > 0 ? album.artistNames[0] : null)
              || '';
            const artistId = track?.primaryArtistId || album?.primaryArtistId;
            
            if (artistId && artistLabel) {
              return (
                <Link 
                  to={`/artists/${artistId}`}
                  onClick={(e) => e.stopPropagation()}
                  className="hover:text-white hover:underline underline-offset-1 transition-colors cursor-pointer"
                >
                  {artistLabel}
                </Link>
              );
            }
            return <span>{artistLabel}</span>;
          })()}
        </p>
      </div>
      <div className='flex items-center gap-8'>
        <TrackMenu track={track} onLike={handleLikeToggle} liked={liked} />
        <span className='text-sm text-gray-300'>
          {formatDuration(track?.duration || track?.durationMs / 1000)}
        </span>
      </div>
    </div>
  )
}

export default TrackAlbumShowProfile
