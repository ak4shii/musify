import React, { useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import Header from '../components/Header'
import Sidebar from '../components/Sidebar'
import Player from '../components/Player'
import TrackArtistShowProfile from '../components/showProfiles/artistPageProfile/TrackArtistShowProfile'
import { useAuth } from '../contexts/AuthContext'
import { useUserRelations } from '../contexts/UserRelationsContext'

const computeTotalDuration = (tracks) => {
  const seconds = tracks.reduce((acc, track) => {
    if (typeof track?.duration === 'number') return acc + track.duration
    if (typeof track?.duration === 'string') {
      const parts = track.duration.split(':').map(Number)
      if (parts.length === 3) return acc + (parts[0] * 3600 + parts[1] * 60 + parts[2])
      if (parts.length === 2) return acc + (parts[0] * 60 + parts[1])
    }
    return acc
  }, 0)

  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  if (hours > 0) return `${hours} hr ${minutes} min`
  if (minutes > 0) return `${minutes} min`
  return '—'
}

const LikedSongs = () => {
  const { isAuthenticated } = useAuth()
  const { likedTracks, relationsLoading, fetchLikedTracks } = useUserRelations()

  useEffect(() => {
    if (isAuthenticated) {
      fetchLikedTracks()
    }
  }, [fetchLikedTracks, isAuthenticated])

  const showEmptyState = !relationsLoading && likedTracks.length === 0
  const totalDurationLabel = useMemo(() => computeTotalDuration(likedTracks), [likedTracks])

  return (
    <div className='h-screen bg-black text-white'>
      <Header />
      <div className='h-[88%] flex px-2 pb-1.5 pt-1'>
        <Sidebar />
        <div className='flex-1 overflow-y-auto custom-scrollbar'>
          <div className='px-6 py-6 space-y-10'>
            <section className='flex flex-col md:flex-row md:items-end gap-6'>
              <div className='w-40 h-40 md:w-52 md:h-52 rounded-lg bg-gradient-to-br from-[#8B5CF6] to-[#3B82F6] flex items-center justify-center shadow-2xl'>
                <svg viewBox='0 0 24 24' className='w-12 h-12 text-white' fill='currentColor'>
                  <path d='M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z' />
                </svg>
              </div>
              <div className='flex-1'>
                <p className='text-xs uppercase tracking-[0.3em] text-gray-300 mb-2'>Collection</p>
                <h1 className='text-4xl md:text-6xl font-extrabold mb-4'>Liked Songs</h1>
                <div className='flex flex-wrap items-center gap-4 text-sm text-gray-300'>
                  <span>{likedTracks.length} {likedTracks.length === 1 ? 'song' : 'songs'}</span>
                  <span>•</span>
                  <span>{totalDurationLabel}</span>
                </div>
              </div>
            </section>

            {!isAuthenticated ? (
              <div className='bg-[#121212] border border-white/10 rounded-2xl p-10 text-center space-y-4'>
                <p className='text-lg font-semibold'>Log in to save and view liked songs</p>
                <p className='text-sm text-white/70 max-w-2xl mx-auto'>
                  Your liked songs are tied to your account. Sign in or create an account to start saving music you love.
                </p>
                <div className='flex items-center justify-center gap-4'>
                  <Link to='/login' className='px-6 py-2 rounded-full bg-white text-black font-semibold hover:bg-gray-200 transition-colors'>
                    Log in
                  </Link>
                  <Link to='/register' className='px-6 py-2 rounded-full border border-white font-semibold hover:bg-white hover:text-black transition-colors'>
                    Sign up
                  </Link>
                </div>
              </div>
            ) : relationsLoading ? (
              <div className='flex items-center justify-center py-12'>
                <div className='text-center'>
                  <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4'></div>
                  <p className='text-white/80'>Fetching your liked songs...</p>
                </div>
              </div>
            ) : showEmptyState ? (
              <div className='bg-[#121212] border border-white/10 rounded-2xl p-10 text-center space-y-4'>
                <p className='text-lg font-semibold'>You have no liked songs yet</p>
                <p className='text-sm text-white/70 max-w-2xl mx-auto'>
                  Tap the heart icon next to any song to save it here for easy access.
                </p>
                <Link to='/' className='inline-block px-6 py-2 rounded-full bg-white text-black font-semibold hover:bg-gray-200 transition-colors'>
                  Explore music
                </Link>
              </div>
            ) : (
              <section className='space-y-3'>
                <div className='flex items-center justify-between'>
                  <h2 className='text-2xl font-bold'>All songs</h2>
                  <button
                    onClick={fetchLikedTracks}
                    className='text-sm text-white/70 hover:text-white border border-white/20 px-3 py-1.5 rounded-full transition-colors'
                  >
                    Refresh
                  </button>
                </div>
                <div className='space-y-1'>
                  {likedTracks.map((track) => (
                    <TrackArtistShowProfile key={track.trackId ?? track.id ?? track.title} track={track} />
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>
      </div>
      <Player />
    </div>
  )
}

export default LikedSongs


