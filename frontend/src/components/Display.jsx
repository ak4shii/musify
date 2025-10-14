import React from 'react'
import { assets } from '../assets/assets'

const Display = () => {
  const scrollRow = (id, delta) => {
    const el = document.getElementById(id)
    if (el) {
      el.scrollBy({ left: delta, behavior: 'smooth' })
    }
  }

  return (
    <div className='w-[1500px] h-[94.75%] flex-col gap-0 text-white hidden lg:flex sticky overflow-hidden'>
      <div className='flex-1 overflow-y-auto custom-scrollbar'>
        {/* Trending songs */}
        <div className='px-6 pt-6 pb-4 flex items-center justify-between'>
          <h3 className='text-xl font-bold'>Trending songs</h3>
        </div>
        <div className='px-6 pb-2 relative group'>
          <button className='flex absolute left-6 top-[75%] -translate-y-1/2 -translate-x-1/2 w-9 h-9 rounded-full bg-white/15 hover:bg-white/25 border border-white/20 backdrop-blur-sm items-center justify-center z-20 shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 focus:opacity-100'
            onClick={() => scrollRow('row-trending', -300)}>
            <img className='w-4 h-4' src={assets.arrow_left} alt='Left' />
          </button>
          <div id='row-trending' className='flex gap-4 overflow-x-auto snap-x snap-mandatory no-scrollbar'>
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className='bg-[#181818] rounded p-4 min-w-[180px] snap-start'>
                <div className='w-full aspect-square rounded bg-[#2a2a2a] mb-3' />
                <p className='font-semibold text-sm mb-1'>Song {i + 1}</p>
                <p className='text-xs text-[#b3b3b3]'>Artist</p>
              </div>
            ))}
          </div>
          <button className='flex absolute right-6 top-[75%] -translate-y-1/2 translate-x-1/2 w-9 h-9 rounded-full bg-white/15 hover:bg-white/25 border border-white/20 backdrop-blur-sm items-center justify-center z-20 shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 focus:opacity-100'
            onClick={() => scrollRow('row-trending', 300)}>
            <img className='w-4 h-4' src={assets.arrow_right} alt='Right' />
          </button>
        </div>

        {/* Popular Artists */}
        <div className='px-6 pt-8 pb-4 flex items-center justify-between'>
          <h3 className='text-xl font-bold'>Popular Artists</h3>
        </div>
        <div className='px-6 pb-2 relative group'>
          <button className='flex absolute left-6 top-[75%] -translate-y-1/2 -translate-x-1/2 w-9 h-9 rounded-full bg-white/15 hover:bg-white/25 border border-white/20 backdrop-blur-sm items-center justify-center z-20 shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 focus:opacity-100'
            onClick={() => scrollRow('row-artists', -300)}>
            <img className='w-4 h-4' src={assets.arrow_left} alt='Left' />
          </button>
          <div id='row-artists' className='flex gap-6 overflow-x-auto snap-x snap-mandatory no-scrollbar'>
            {Array.from({ length: 16 }).map((_, i) => (
              <div key={i} className='flex flex-col items-center text-center min-w-[110px] snap-start'>
                <div className='w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-[#2a2a2a] mb-3' />
                <p className='text-sm font-semibold'>Artist {i + 1}</p>
              </div>
            ))}
          </div>
          <button className='flex absolute right-6 top-[75%] -translate-y-1/2 translate-x-1/2 w-9 h-9 rounded-full bg-white/15 hover:bg-white/25 border border-white/20 backdrop-blur-sm items-center justify-center z-20 shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 focus:opacity-100'
            onClick={() => scrollRow('row-artists', 300)}>
            <img className='w-4 h-4' src={assets.arrow_right} alt='Right' />
          </button>
        </div>

        {/* Popular Albums & Singles */}
        <div className='px-6 pt-8 pb-4 flex items-center justify-between'>
          <h3 className='text-xl font-bold'>Popular Albums & Singles</h3>
        </div>
        <div className='px-6 pb-2 relative group'>
          <button className='flex absolute left-6 top-[75%] -translate-y-1/2 -translate-x-1/2 w-9 h-9 rounded-full bg-white/15 hover:bg-white/25 border border-white/20 backdrop-blur-sm items-center justify-center z-20 shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 focus:opacity-100'
            onClick={() => scrollRow('row-albums', -300)}>
            <img className='w-4 h-4' src={assets.arrow_left} alt='Left' />
          </button>
          <div id='row-albums' className='flex gap-4 overflow-x-auto snap-x snap-mandatory no-scrollbar'>
            {Array.from({ length: 14 }).map((_, i) => (
              <div key={i} className='bg-[#181818] rounded p-4 min-w-[180px] snap-start'>
                <div className='w-full aspect-square rounded bg-[#2a2a2a] mb-3' />
                <p className='font-semibold text-sm mb-1'>Album {i + 1}</p>
                <p className='text-xs text-[#b3b3b3]'>Artist</p>
              </div>
            ))}
          </div>
          <button className='flex absolute right-6 top-[75%] -translate-y-1/2 translate-x-1/2 w-9 h-9 rounded-full bg-white/15 hover:bg-white/25 border border-white/20 backdrop-blur-sm items-center justify-center z-20 shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 focus:opacity-100'
            onClick={() => scrollRow('row-albums', 300)}>
            <img className='w-4 h-4' src={assets.arrow_right} alt='Right' />
          </button>
        </div>

        {/* Feature Charts */}
        <div className='px-6 pt-8 pb-4 flex items-center justify-between'>
          <h3 className='text-xl font-bold'>Feature Charts</h3>
        </div>
        <div className='px-6 pb-12 relative group'>
          <button className='flex absolute left-6 top-[50%] -translate-y-1/2 -translate-x-1/2 w-9 h-9 rounded-full bg-white/15 hover:bg-white/25 border border-white/20 backdrop-blur-sm items-center justify-center z-20 shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 focus:opacity-100'
            onClick={() => scrollRow('row-charts', -300)}>
            <img className='w-4 h-4' src={assets.arrow_left} alt='Left' />
          </button>
          <div id='row-charts' className='flex gap-4 overflow-x-auto snap-x snap-mandatory no-scrollbar'>
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className='bg-[#181818] rounded p-4 min-w-[280px] snap-start'>
                <div className='w-full aspect-[3/1] rounded bg-[#2a2a2a] mb-3' />
                <p className='font-semibold text-sm mb-1'>Top 50 - Region {i + 1}</p>
                <p className='text-xs text-[#b3b3b3]'>Updated weekly</p>
              </div>
            ))}
          </div>
          <button className='flex absolute right-6 top-[50%] -translate-y-1/2 translate-x-1/2 w-9 h-9 rounded-full bg-white/15 hover:bg-white/25 border border-white/20 backdrop-blur-sm items-center justify-center z-20 shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 focus:opacity-100'
            onClick={() => scrollRow('row-charts', 300)}>
            <img className='w-4 h-4' src={assets.arrow_right} alt='Right' />
          </button>
        </div>
      </div>
    </div>
  )
}

export default Display