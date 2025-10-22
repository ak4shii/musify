import React from 'react'
import ScrollableRow from './profiles/ScrollableRow'
import TrackProfile from './profiles/TrackProfile'
import ArtistProfile from './profiles/ArtistProfile'
import AlbumProfile from './profiles/AlbumProfile'
import FeatureChart from './profiles/FeatureChart'

const Display = ({ songs, artists, albums, loading, error }) => {
  if (loading) {
    return (
      <div className='w-[1500px] h-[94.75%] flex-col gap-0 text-white hidden lg:flex sticky overflow-hidden'>
        <div className='flex-1 overflow-y-auto custom-scrollbar flex items-center justify-center'>
          <div className='text-center'>
            <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4'></div>
            <p className='text-lg'>Loading music data...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className='w-[1500px] h-[94.75%] flex-col gap-0 text-white hidden lg:flex sticky overflow-hidden'>
        <div className='flex-1 overflow-y-auto custom-scrollbar flex items-center justify-center'>
          <div className='text-center'>
            <p className='text-lg text-red-400 mb-2'>Error: {error}</p>
            <p className='text-sm text-gray-400'>Please check if the backend server is running</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className='w-[1500px] h-[94.75%] flex-col gap-0 text-white hidden lg:flex sticky overflow-hidden'>
      <div className='flex-1 overflow-y-auto custom-scrollbar'>
        <div className='px-6 pt-6 pb-4 flex items-center justify-between'>
          <h3 className='text-xl font-bold'>Trending songs</h3>
        </div>
        <ScrollableRow id='row-trending' title='' showTitle={false}>
          {songs.length > 0 ? songs.slice(0, 12).map((song, i) => (
            <TrackProfile key={song.id || i} track={song} index={i} />
          )) : (
            <div className='text-center text-gray-400 py-8'>
              <p>No songs available</p>
            </div>
          )}
        </ScrollableRow>
        <ScrollableRow id='row-artists' title='Popular Artists'>
          {artists.length > 0 ? artists.slice(0, 16).map((artist, i) => (
            <ArtistProfile key={artist.id || i} artist={artist} index={i} />
          )) : (
            <div className='text-center text-gray-400 py-8'>
              <p>No artists available</p>
            </div>
          )}
        </ScrollableRow>
        <ScrollableRow id='row-albums' title='Popular Albums & Singles'>
          {albums.length > 0 ? albums.slice(0, 14).map((album, i) => (
            <AlbumProfile key={album.id || i} album={album} index={i} />
          )) : (
            <div className='text-center text-gray-400 py-8'>
              <p>No albums available</p>
            </div>
          )}
        </ScrollableRow>
        <ScrollableRow id='row-charts' title='Feature Charts' className='pb-12'>
          {songs.length > 0 ? songs.slice(0, 10).map((song, i) => (
            <FeatureChart key={song.id || i} track={song} index={i} />
          )) : (
            <div className='text-center text-gray-400 py-8'>
              <p>No charts available</p>
            </div>
          )}
        </ScrollableRow>
      </div>
    </div>
  )
}

export default Display