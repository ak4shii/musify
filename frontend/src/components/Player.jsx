import React from 'react'
import { assets } from '../assets/assets'

const Player = () => {
  return (
    <div className='fixed bottom-0 left-0 right-0 h-[72px] bg-[#181818] border-t border-white/10 px-4 flex items-center justify-between z-50'>
      <div className='flex items-center gap-3 min-w-[200px]'>
        <div className='w-12 h-12 bg-[#2a2a2a] rounded' />
        <div>
          <p className='text-sm font-semibold'>Title</p>
          <p className='text-xs text-[#b3b3b3]'>Artist</p>
        </div>
      </div>
      <div className='flex flex-col items-center gap-2 w-[40%]'>
        <div className='flex items-center gap-5'>
          <img className='w-4 h-4' src={assets.shuffle_icon} alt='Shuffle' />
          <img className='w-4 h-4' src={assets.prev_icon} alt='Prev' />
          <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center hover:shadow-md hover:bg-gray-200 transition">
            <img className="w-4 h-4 invert" src={assets.pause_icon} alt="Pause" />
          </div>
          <img className='w-4 h-4' src={assets.next_icon} alt='Next' />
          <img className='w-4 h-4' src={assets.loop_icon} alt='Loop' />
        </div>
        <div className="flex items-center gap-3 w-full">
          <span className="text-[11px] text-[#b3b3b3]">-:--</span>
          <div className="flex-1 h-1 bg-white/20 rounded relative">
            <div className="h-1 bg-white rounded w-1/3 absolute left-0 top-0" />
          </div>
          <span className="text-[11px] text-[#b3b3b3]">-:--</span>
        </div>
      </div>
      <div className='flex items-center gap-3 min-w-[200px] justify-end'>
        <img className='w-4 h-4' src={assets.mini_player_icon} alt='Mini Player' />
        <img className='w-4 h-4' src={assets.queue_icon} alt='Queue' />
        <img className='w-4 h-4' src={assets.speaker_icon} alt='Device' />
        <div className='flex items-center gap-2 w-28'>
          <img className='w-4 h-4' src={assets.volume_icon} alt='Volume' />
          <div className='h-1 bg-white/20 rounded w-full'>
            <div className='h-1 bg-white rounded w-2/5' />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Player