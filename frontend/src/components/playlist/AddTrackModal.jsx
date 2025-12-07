import React from 'react'

const AddTrackModal = ({ isOpen, onClose, tracks, searchQuery, setSearchQuery, onAddTrack }) => {
  if (!isOpen) return null

  const filteredTracks = tracks.filter(track => {
    if (!searchQuery) return true
    const query = searchQuery.toLowerCase()
    const title = (track.title || track.trackName || '').toLowerCase()
    const artist = (track.artistName || track.artist || '').toLowerCase()
    return title.includes(query) || artist.includes(query)
  })

  return (
    <div className='fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4' onClick={onClose}>
      <div className='bg-[#181818] rounded-2xl p-6 max-w-2xl w-full max-h-[80vh] flex flex-col' onClick={(e) => e.stopPropagation()}>
        <h2 className='text-2xl font-bold mb-4'>Add Tracks to Playlist</h2>
        <div className='mb-4'>
          <input
            type='text'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className='w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 focus:outline-none focus:border-white/40'
            placeholder='Search tracks...'
          />
        </div>
        <div className='flex-1 overflow-y-auto custom-scrollbar space-y-2 mb-4'>
          {filteredTracks.length > 0 ? (
            filteredTracks.map((track) => {
              const trackId = track.trackId || track.id
              return (
                <div
                  key={trackId}
                  className='flex items-center justify-between p-3 rounded-lg hover:bg-white/5 transition-colors'
                >
                  <div className='flex-1 min-w-0'>
                    <p className='font-medium text-sm truncate'>{track.title || track.trackName || 'Unknown Track'}</p>
                    <p className='text-xs text-white/60 truncate'>{track.artistName || track.artist || 'Unknown Artist'}</p>
                  </div>
                  <button
                    onClick={() => onAddTrack(trackId)}
                    className='px-4 py-2 rounded-full bg-white text-black font-semibold hover:bg-gray-200 transition-colors text-sm'
                  >
                    Add
                  </button>
                </div>
              )
            })
          ) : (
            <p className='text-white/60 text-sm text-center py-4'>
              {searchQuery ? 'No tracks found' : 'No tracks available to add'}
            </p>
          )}
        </div>
        <button
          onClick={onClose}
          className='w-full px-4 py-2 rounded-full border border-white/30 hover:bg-white/10 transition-colors'
        >
          Close
        </button>
      </div>
    </div>
  )
}

export default AddTrackModal




