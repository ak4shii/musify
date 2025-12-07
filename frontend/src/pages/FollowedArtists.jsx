import React, { useEffect } from 'react'
import Header from '../components/Header'
import Sidebar from '../components/Sidebar'
import Player from '../components/Player'
import { useAuth } from '../contexts/AuthContext'
import { useUserRelations } from '../contexts/UserRelationsContext'
import ArtistProfile from '../components/profiles/ArtistProfile'

const FollowedArtists = () => {
  const { isAuthenticated } = useAuth()
  const { followedArtists, relationsLoading, fetchFollowedArtists } = useUserRelations()

  useEffect(() => {
    if (isAuthenticated) {
      fetchFollowedArtists()
    }
  }, [fetchFollowedArtists, isAuthenticated])

  return (
    <div className='h-screen bg-black text-white'>
      <Header />
      <div className='h-[88%] flex px-2 pb-1.5 pt-1'>
        <Sidebar />
        <div className='flex-1 overflow-y-auto custom-scrollbar'>
          <div className='px-6 py-6 space-y-8'>
            <section className='rounded-3xl bg-gradient-to-br from-[#10B981] via-[#059669] to-[#047857] p-8'>
              <p className='uppercase text-xs tracking-[0.45em] text-white/70 mb-2'>Community</p>
              <h1 className='text-4xl md:text-5xl font-extrabold mb-4'>Followed Artists</h1>
              <p className='text-white/80 max-w-2xl'>
                Keep up with the artists you love. Their new releases and updates will surface <span className='whitespace-nowrap'>throughout Musify.</span>
              </p>
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
                  <h2 className='text-2xl font-bold'>All Followed Artists</h2>
                  <button
                    onClick={fetchFollowedArtists}
                    className='text-sm text-white/70 hover:text-white border border-white/20 px-3 py-1.5 rounded-full transition-colors'
                  >
                    Refresh
                  </button>
                </div>
                <div className='flex flex-wrap gap-4'>
                  {followedArtists.map((artist, index) => (
                    <ArtistProfile
                      key={artist.artistId ?? artist.id}
                      artist={artist}
                      index={index}
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