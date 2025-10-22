import React from 'react'
import { assets } from '../../assets/assets'

const ScrollableRow = ({ 
  id, 
  title, 
  children, 
  className = '', 
  buttonPosition = '75%',
  showTitle = true 
}) => {
  const scrollRow = (delta) => {
    const el = document.getElementById(id)
    if (el) {
      el.scrollBy({ left: delta, behavior: 'smooth' })
    }
  }

  return (
    <>
      {showTitle && title && (
        <div className='px-6 pt-8 pb-4 flex items-center justify-between'>
          <h3 className='text-xl font-bold'>{title}</h3>
        </div>
      )}
      <div className={`px-6 pb-2 relative group ${className}`}>
        <button 
          className='flex absolute left-6 top-[75%] -translate-y-1/2 -translate-x-1/2 w-9 h-9 rounded-full bg-white/15 hover:bg-white/25 border border-white/20 backdrop-blur-sm items-center justify-center z-20 shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 focus:opacity-100'
          onClick={() => scrollRow(-300)}
        >
          <img className='w-4 h-4' src={assets.arrow_left} alt='Left' />
        </button>
        <div id={id} className='flex gap-4 overflow-x-auto snap-x snap-mandatory no-scrollbar'>
          {children}
        </div>
        <button 
          className='flex absolute right-6 top-[75%] -translate-y-1/2 translate-x-1/2 w-9 h-9 rounded-full bg-white/15 hover:bg-white/25 border border-white/20 backdrop-blur-sm items-center justify-center z-20 shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 focus:opacity-100'
          onClick={() => scrollRow(300)}
        >
          <img className='w-4 h-4' src={assets.arrow_right} alt='Right' />
        </button>
      </div>
    </>
  )
}

export default ScrollableRow
