import React, { useCallback, useEffect, useState } from 'react'
import Header from '../components/Header'
import Sidebar from '../components/Sidebar'
import Player from '../components/Player'
import { useAuth } from '../contexts/AuthContext'
import { useUserRelations } from '../contexts/UserRelationsContext'
import toast from 'react-hot-toast'

const FollowedArtistCard = ({ artist, onToggleFollow, isPending }) => {
  const handleToggle = (event) => {
    event.preventDefault()
    event.stopPropagation()
    onToggleFollow(artist)
  }

  return (
    <div className='bg-[#121212] rounded-2xl p-5 flex flex-col items-center text-center border border-white/5 hover:border-white/30 transition-colors'>
      <div className='w-32 h-32 rounded-full overflow-hidden mb-4 bg-[#1f1f1f] flex items-center justify-center'>
        {artist?.image ? (
          <img
            src={artist.image}
            alt={artist.artistName || artist.name}
            className='w-full h-full object-cover'
            crossOrigin='anonymous'
          />
        ) : (
          <span className='text-3xl text-white/40'>👤</span>
        )}
      </div>
      <h3 className='font-semibold text-base mb-1 truncate w-full'>
        {artist?.artistName || artist?.name || 'Unknown Artist'}
      </h3>
      <p className='text-xs text-white/60 mb-4'>Artist</p>
      <button
        onClick={handleToggle}
        disabled={isPending}
        className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-colors ${
          isPending
            ? 'bg-white/20 text-white/70 cursor-not-allowed'
            : 'bg-white text-black hover:bg-gray-200'
        }`}
      >
        Unfollow
      </button>
    </div>
  )
}

const FollowedArtists = () => {
  const { isAuthenticated } = useAuth()
  const { followedArtists, relationsLoading, fetchFollowedArtists, unfollowArtist } = useUserRelations()
  const [pendingId, setPendingId] = useState(null)

  useEffect(() => {
    if (isAuthenticated) {
      fetchFollowedArtists()
    }
  }, [fetchFollowedArtists, isAuthenticated])

  const handleUnfollow = useCallback(async (artist) => {
    if (!artist?.artistId && !artist?.id) return
    try {
      setPendingId(artist.artistId ?? artist.id)
      await unfollowArtist(artist)
      toast.success(`Unfollowed ${artist.artistName || artist.name}`)
    } catch (error) {
      console.error('Failed to unfollow artist:', error)
      toast.error('Could not unfollow artist')
    } finally {
      setPendingId(null)
    }
  }, [unfollowArtist])

  return (
    <div className='h-screen bg-black text-white'>
      <Header />
      <div className='h-[88%] flex px-2 pb-1.5 pt-1'>
        <Sidebar />
        <div className='flex-1 overflow-y-auto custom-scrollbar'>
          <div className='px-6 py-6 space-y-8'>
            <section className='rounded-3xl bg-gradient-to-br from-[#10B981] via-[#059669] to-[#047857] p-8 flex flex-col md:flex-row gap-6'>
              <div className='flex-1'>
                <p className='uppercase text-xs tracking-[0.45em] text-white/70 mb-2'>Community</p>
                <h1 className='text-4xl md:text-5xl font-extrabold mb-4'>Followed Artists</h1>
                <p className='text-white/80 max-w-2xl'>
                  Keep up with the artists you love. Their new releases and updates will surface throughout Musify.
                </p>
              </div>
              <div className='self-end md:self-center text-right'>
                <p className='text-sm text-white/70'>Artists followed</p>
                <p className='text-4xl font-black leading-none'>{followedArtists.length}</p>
              </div>
            </section>

            {!isAuthenticated ? (
              <div className='bg-[#121212] border border-white/10 rounded-2xl p-10 text-center space-y-4'>
                <p className='text-lg font-semibold'>Log in to manage followed artists</p>
                <p className='text-sm text-white/70 max-w-2xl mx-auto'>
                  Sign in to follow artists and curate your personalized feed.
                </p>
              </div>
            ) : relationsLoading ? (
              <div className='flex items-center justify-center py-12'>
                <div className='text-center'>
                  <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4'></div>
                  <p className='text-white/80'>Loading followed artists...</p>
                </div>
              </div>
            ) : followedArtists.length === 0 ? (
              <div className='bg-[#121212] border border-white/10 rounded-2xl p-10 text-center space-y-4'>
                <p className='text-lg font-semibold'>You are not following anyone yet</p>
                <p className='text-sm text-white/70 max-w-2xl mx-auto'>
                  Discover artists on the home page or search to start following them.
                </p>
              </div>
            ) : (
              <section className='space-y-4'>
                <div className='flex items-center justify-between'>
                  <h2 className='text-2xl font-bold'>All followed artists</h2>
                  <button
                    onClick={fetchFollowedArtists}
                    className='text-sm text-white/70 hover:text-white border border-white/20 px-3 py-1.5 rounded-full transition-colors'
                  >
                    Refresh
                  </button>
                </div>
                <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
                  {followedArtists.map((artist) => (
                    <FollowedArtistCard
                      key={artist.artistId ?? artist.id}
                      artist={artist}
                      onToggleFollow={handleUnfollow}
                      isPending={pendingId === (artist.artistId ?? artist.id)}
                    />
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

export default FollowedArtists









