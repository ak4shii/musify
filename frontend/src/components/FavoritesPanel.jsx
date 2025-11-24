import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useUserRelations } from '../contexts/UserRelationsContext'

const FavoritesPanel = () => {
  const { isAuthenticated, user } = useAuth()
  const { likedTracks, relationsLoading, fetchLikedTracks } = useUserRelations()
  const navigate = useNavigate()

  useEffect(() => {
    if (!isAuthenticated) {
      return
    }

    fetchLikedTracks()
  }, [fetchLikedTracks, isAuthenticated, user])

  const handleNavigate = () => {
    if (!isAuthenticated) return
    navigate('/liked')
  }

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      handleNavigate()
    }
  }

  if (!isAuthenticated || relationsLoading) {
    return null
  }

  return (
    <div
      className='bg-[#1f1f1f] rounded p-2 hover:bg-[#232323] transition-colors cursor-pointer'
      onClick={handleNavigate}
      onKeyDown={handleKeyDown}
      role='button'
      tabIndex={0}
    >
      <div className='flex items-center gap-2'>
        <div className='w-10 h-10 bg-gradient-to-b from-[#8B5CF6] to-[#06B6D4] rounded flex items-center justify-center flex-shrink-0'>
          <svg 
            className='w-3 h-3' 
            fill='white' 
            viewBox='0 0 24 24' 
            xmlns='http://www.w3.org/2000/svg'
          >
            <path d='M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z'/>
          </svg>
        </div>
        <div className='flex-1 min-w-0'>
          <p className='text-xs font-semibold text-white truncate'>Liked Songs</p>
          <p className='text-[10px] text-[#b3b3b3] truncate'>
            {likedTracks.length} {likedTracks.length === 1 ? 'song' : 'songs'}
          </p>
        </div>
      </div>
    </div>
  )
}

export default FavoritesPanel


