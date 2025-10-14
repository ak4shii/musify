import React from 'react'
import { assets } from '../assets/assets'

const Sidebar = () => {
  return (
    <div className='w-[300px] h-[94.75%] flex-col gap-0 text-white hidden lg:flex sticky overflow-hidden'>
      <div className='bg-[#121212] rounded mt-2 flex-1 flex flex-col'>
        <div className='flex items-center justify-between px-6 py-4'>
          <div className='flex items-center gap-3'>
            <img className='w-6 h-6' src={assets.stack_icon} alt='Your Library' />
            <p className='font-semibold'>Your Library</p>
          </div>
          <img className='w-5 h-5 opacity-80' src={assets.plus_icon} alt='Add' />
        </div>

        <div className='px-4 pb-24 flex flex-col gap-3 overflow-y-auto'>
          <div className='bg-[#1f1f1f] rounded p-4'>
            <p className='text-sm font-semibold mb-1'>Create your first playlist</p>
            <p className='text-xs text-[#b3b3b3] mb-3'>It's easy, we'll help you</p>
            <div className='inline-block bg-white text-black text-sm font-semibold px-3 py-1.5 rounded-full hover:bg-gray-200'>
              Create Playlist
            </div>
          </div>
          <div className='bg-[#1f1f1f] rounded p-4'>
            <p className='text-sm font-semibold mb-1'>Let's find some postcasts to follow</p>
            <p className='text-xs text-[#b3b3b3] mb-3'>We'll keep you updated on new episodes</p>
            <div className='inline-block bg-white text-black text-sm font-semibold px-3 py-1.5 rounded-full hover:bg-gray-200'>
              Browse Podcasts
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Sidebar