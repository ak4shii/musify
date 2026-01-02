import React, { useState } from 'react'
import { assets } from '../assets/assets'
import { usePlayer } from '../contexts/PlayerContext'
import { useAuth } from '../contexts/AuthContext'
import { getImageUrl } from '../helpers/apiClient'

const Player = () => {
  const { isAuthenticated } = useAuth()
  const { currentTrack, isPlaying, togglePlayPause, currentTime, duration, seekTo, volume, changeVolume, audioSrc, toggleShuffle, isShuffle, toggleRepeat, repeatMode, playPrevious, playNext, toggleMute, queue, playTrack } = usePlayer();
  const [showQueue, setShowQueue] = useState(false);
  const fmt = (s) => {
    if (!s || Number.isNaN(s)) return '-:--';
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60).toString().padStart(2, '0');
    return `${m}:${sec}`;
  };
  const progressPct = duration ? Math.min(100, Math.max(0, (currentTime / duration) * 100)) : 0;
  const trackImagePath = currentTrack?.coverUrl || currentTrack?.cover_url || currentTrack?.imagePath || currentTrack?.image_path || currentTrack?.image;
  const trackImageUrl = trackImagePath ? getImageUrl(trackImagePath) : null;
  const upcoming = Array.isArray(queue) ? queue : [];
  
  if (!isAuthenticated) {
    return (
      <div className='fixed bottom-0 left-0 right-0 h-[72px] bg-[#181818] border-t border-white/10 px-4 flex items-center justify-between z-50 opacity-50 pointer-events-none'>
        <div className='flex items-center gap-3 min-w-[200px]'>
          <div className='w-12 h-12 bg-[#2a2a2a] rounded flex items-center justify-center'>
            <span className='text-xs text-[#b3b3b3]'>🎵</span>
          </div>
          <div>
            <p className='text-sm font-semibold text-[#b3b3b3]'></p>
            <p className='text-xs text-[#b3b3b3]'></p>
          </div>
        </div>
        <div className='flex flex-col items-center gap-2 w-[40%]'>
          <div className='flex items-center gap-5'>
            <button disabled className='w-4 h-4 flex items-center justify-center opacity-40 cursor-not-allowed'>
              <img className='w-4 h-4 opacity-40' src={assets.shuffle_icon} alt='Shuffle' />
            </button>
            <button disabled className='w-4 h-4 flex items-center justify-center opacity-40 cursor-not-allowed'>
              <img className='w-4 h-4 opacity-40' src={assets.prev_icon} alt='Prev' />
            </button>
            <button disabled className='w-8 h-8 rounded-full flex items-center justify-center bg-white/20 cursor-not-allowed'>
              <img className="w-4 h-4 invert opacity-40" src={assets.play_icon} alt='Play' />
            </button>
            <button disabled className='w-4 h-4 flex items-center justify-center opacity-40 cursor-not-allowed'>
              <img className='w-4 h-4 opacity-40' src={assets.next_icon} alt='Next' />
            </button>
            <button disabled className='w-4 h-4 flex items-center justify-center opacity-40 cursor-not-allowed'>
              <img className='w-4 h-4 opacity-40' src={assets.loop_icon} alt='Loop' />
            </button>
          </div>
          <div className="flex items-center gap-3 w-full">
            <span className="text-[11px] text-[#b3b3b3] opacity-40">-:--</span>
            <div className="flex-1 h-1 bg-white/10 rounded">
              <span className="h-1 bg-white/20 rounded block" style={{ width: '0%' }} />
            </div>
            <span className="text-[11px] text-[#b3b3b3] opacity-40">-:--</span>
          </div>
        </div>
        <div className='flex items-center gap-3 min-w-[200px] justify-end opacity-40'>
          <button disabled className='w-4 h-4 flex items-center justify-center cursor-not-allowed'>
            <img className='w-4 h-4 opacity-40' src={assets.queue_icon} alt='Queue' />
          </button>
          <div className='flex items-center gap-2 w-28'>
            <button disabled className='w-4 h-4 flex items-center justify-center cursor-not-allowed'>
              <img className='w-4 h-4 opacity-40' src={assets.volume_icon} alt='Volume' />
            </button>
            <input type='range' min={0} max={1} step={0.01} value={0} disabled className='w-full accent-white opacity-40' />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className='fixed bottom-0 left-0 right-0 h-[72px] bg-[#181818] border-t border-white/10 px-4 flex items-center justify-between z-50'>
      {showQueue && (
        <div className='absolute bottom-[80px] right-4 w-80 max-h-80 overflow-auto bg-[#1f1f1f] border border-white/10 rounded shadow-lg z-50 p-3 space-y-2'>
          <div className='flex items-center justify-between'>
            <p className='text-xs text-[#b3b3b3] uppercase tracking-wide'>Up Next</p>
            <button className='text-xs text-white/70 hover:text-white' onClick={() => setShowQueue(false)}>Close</button>
          </div>
          {upcoming.length === 0 ? (
            <p className='text-xs text-[#777]'>Queue is empty</p>
          ) : (
            upcoming.slice(0, 12).map((t, idx) => (
              <button
                key={`${t.trackId ?? t.id ?? idx}-${idx}`}
                className='w-full text-left flex items-center gap-2 px-2 py-1 rounded hover:bg-white/5 transition'
                onClick={() => {
                  playTrack(t);
                  setShowQueue(false);
                }}
              >
                <div className='flex-1 min-w-0'>
                  <p className='text-sm text-white truncate'>{t.title || 'Unknown title'}</p>
                  <p className='text-[11px] text-[#b3b3b3] truncate'>{t.primaryArtistName || t.artist || t.artistName || 'Unknown artist'}</p>
                </div>
                <span className='text-[11px] text-[#777]'>{idx + 1}</span>
              </button>
            ))
          )}
        </div>
      )}
      <div className='flex items-center gap-3 min-w-[200px]'>
        {trackImageUrl ? (
          <img src={trackImageUrl} alt={currentTrack?.title || 'Cover'} className='w-12 h-12 rounded object-cover bg-[#2a2a2a]' />
        ) : (
          <div className='w-12 h-12 bg-[#2a2a2a] rounded flex items-center justify-center'>
            <span className='text-xs text-[#b3b3b3]'>🎵</span>
          </div>
        )}
        <div>
          <p className='text-sm font-semibold'>{currentTrack?.title || 'No track selected'}</p>
          <p className='text-xs text-[#b3b3b3]'>{currentTrack?.artist || currentTrack?.artistName || ''}</p>
        </div>
      </div>
      <div className='flex flex-col items-center gap-2 w-[40%]'>
        <div className='flex items-center gap-5'>
          <button onClick={toggleShuffle} className='w-4 h-4 flex items-center justify-center hover:shadow-md transition cursor-pointer group'>
            <img className={`w-4 h-4 transition group-hover:opacity-60 group-hover:brightness-75 ${isShuffle ? '' : ''}`} src={assets.shuffle_icon} alt='Shuffle' />
          </button>
          <button onClick={playPrevious} className='w-4 h-4 flex items-center justify-center hover:shadow-md transition cursor-pointer group'>
            <img className='w-4 h-4 transition group-hover:opacity-60 group-hover:brightness-75' src={assets.prev_icon} alt='Prev' />
          </button>
          <button disabled={!currentTrack || !audioSrc} onClick={togglePlayPause} className={`w-8 h-8 rounded-full flex items-center justify-center hover:shadow-md transition ${currentTrack && audioSrc ? 'bg-white hover:bg-gray-200' : 'bg-white/40 cursor-not-allowed'}`}>
            <img className="w-4 h-4 invert" src={isPlaying ? assets.pause_icon : assets.play_icon} alt={isPlaying ? 'Pause' : 'Play'} />
          </button>
          <button onClick={playNext} className='w-4 h-4 flex items-center justify-center hover:shadow-md transition cursor-pointer group'>
            <img className='w-4 h-4 transition group-hover:opacity-60 group-hover:brightness-75' src={assets.next_icon} alt='Next' />
          </button>
          <button onClick={toggleRepeat} className='w-4 h-4 flex items-center justify-center hover:shadow-md transition cursor-pointer group'>
            <img 
              className='w-4 h-4 transition group-hover:opacity-60 group-hover:brightness-75' 
              src={assets.loop_icon} 
              alt='Loop' 
              title={repeatMode === 'off' ? 'Repeat off' : 'Repeat on'}
              style={repeatMode === 'off' ? { filter: 'brightness(0)' } : {}}
            />
          </button>
        </div>
        <div className="flex items-center gap-3 w-full">
          <span className="text-[11px] text-[#b3b3b3]">{fmt(currentTime)}</span>
          <button className="flex-1 h-1 bg-white/20 rounded relative" onClick={(e) => {
            if (!duration) return;
            const rect = e.currentTarget.getBoundingClientRect();
            const ratio = (e.clientX - rect.left) / rect.width;
            seekTo(ratio * duration);
          }}>
            <span className="h-1 bg-white rounded absolute left-0 top-0" style={{ width: `${progressPct}%` }} />
          </button>
          <span className="text-[11px] text-[#b3b3b3]">{fmt(duration)}</span>
        </div>
      </div>
      <div className='flex items-center gap-3 min-w-[200px] justify-end'>
        <button onClick={() => setShowQueue((p) => !p)} className='w-4 h-4 flex items-center justify-center hover:shadow-md transition cursor-pointer group'>
          <img className='w-4 h-4 transition group-hover:opacity-60 group-hover:brightness-75' src={assets.queue_icon} alt='Queue' />
        </button>
        <div className='flex items-center gap-2 w-28'>
          <button onClick={toggleMute} className='w-4 h-4 flex items-center justify-center hover:shadow-md transition cursor-pointer group'>
            <img className='w-4 h-4 transition group-hover:opacity-60 group-hover:brightness-75' src={assets.volume_icon} alt='Volume' />
          </button>
          <input type='range' min={0} max={1} step={0.01} value={volume} onChange={(e) => changeVolume(parseFloat(e.target.value))} className='w-full accent-white' />
        </div>
      </div>
    </div>
  )
}

export default Player