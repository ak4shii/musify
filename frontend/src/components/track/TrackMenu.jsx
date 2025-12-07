import React, { useState, useRef, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { useUserRelations } from '../../contexts/UserRelationsContext'
import PlaylistSelectionModal from './PlaylistSelectionModal'
import toast from 'react-hot-toast'

const TrackMenu = ({ track, onLike, liked }) => {
  const { isAuthenticated } = useAuth()
  const { isTrackLiked, likeTrack, unlikeTrack } = useUserRelations()
  const [showMenu, setShowMenu] = useState(false)
  const [showPlaylistModal, setShowPlaylistModal] = useState(false)
  const [pendingLike, setPendingLike] = useState(false)
  const menuRef = useRef(null)
  
  const trackId = track?.trackId ?? track?.id
  const isLiked = liked !== undefined ? liked : isTrackLiked(trackId)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false)
      }
    }

    if (showMenu) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showMenu])

  const handleLikeClick = async (e) => {
    e.stopPropagation()
    setShowMenu(false)
    
    if (!isAuthenticated) {
      toast.error('Please log in to save songs')
      return
    }
    
    if (!trackId || pendingLike) return
    
    if (onLike) {
      onLike(e)
      return
    }
    
    setPendingLike(true)
    try {
      if (isLiked) {
        await unlikeTrack(trackId)
        toast.success('Removed from liked songs')
      } else {
        await likeTrack(track)
        toast.success('Added to liked songs')
      }
    } catch (error) {
      console.error('Failed to toggle liked state:', error)
      toast.error('Could not update liked songs')
    } finally {
      setPendingLike(false)
    }
  }

  const handleAddToPlaylistClick = (e) => {
    e.stopPropagation()
    setShowMenu(false)
    if (!isAuthenticated) {
      toast.error('Please log in to add songs to playlists')
      return
    }
    setShowPlaylistModal(true)
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <>
      <div className='relative' ref={menuRef}>
        <button
          onClick={(e) => {
            e.stopPropagation()
            setShowMenu(!showMenu)
          }}
          className='p-1 rounded-full hover:bg-white/10 transition-colors opacity-0 group-hover/track:opacity-100'
          title='More options'
        >
          <svg className='w-5 h-5' fill='currentColor' viewBox='0 0 24 24'>
            <circle cx='12' cy='6' r='2' />
            <circle cx='12' cy='12' r='2' />
            <circle cx='12' cy='18' r='2' />
          </svg>
        </button>

        {showMenu && (
          <div className='absolute right-0 top-full mt-1 bg-[#282828] rounded-lg shadow-xl py-1 w-[160px] z-50 border border-white/10'>
            <button
              onClick={handleLikeClick}
              className='w-full px-3 py-2 text-left text-xs hover:bg-white/10 transition-colors flex items-center gap-2'
            >
              <svg
                viewBox='0 0 24 24'
                width='16'
                height='16'
                fill={isLiked ? '#1DB954' : 'none'}
                stroke={isLiked ? '#1DB954' : '#ffffff'}
                strokeWidth='1.5'
              >
                <path d='M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z' />
              </svg>
              <span className='text-xs truncate'>{isLiked ? 'Remove from liked' : 'Like song'}</span>
            </button>
            <button
              onClick={handleAddToPlaylistClick}
              className='w-full px-3 py-2 text-left text-xs hover:bg-white/10 transition-colors flex items-center gap-2'
            >
              <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 4v16m8-8H4' />
              </svg>
              <span className='text-xs truncate'>Add to playlist</span>
            </button>
          </div>
        )}
      </div>

      <PlaylistSelectionModal
        isOpen={showPlaylistModal}
        onClose={() => setShowPlaylistModal(false)}
        track={track}
      />
    </>
  )
}

export default TrackMenu

