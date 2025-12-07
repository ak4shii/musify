import React from 'react'
import TrackArtistShowProfile from '../showProfiles/artistPageProfile/TrackArtistShowProfile'

const PlaylistTrackItem = ({ track, onRemove }) => {
  const removeButton = (
    <button
      onClick={(e) => {
        e.stopPropagation()
        onRemove(track.trackId || track.id)
      }}
      className='opacity-0 group-hover/track:opacity-100 transition-opacity p-2 hover:bg-white/10 rounded-full'
      title='Remove from playlist'
    >
      <svg className='w-5 h-5 text-white/70 hover:text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
      </svg>
    </button>
  )

  return <TrackArtistShowProfile track={track} additionalActions={removeButton} />
}

export default PlaylistTrackItem

