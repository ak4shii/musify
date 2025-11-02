import React from 'react'

const ScrollableRow = ({ 
  id, 
  title, 
  children, 
  className = '', 
  showTitle = true 
}) => {
  return (
    <>
      {showTitle && title && (
        <div className='px-6 pt-8 pb-4 flex items-center justify-between'>
          <h3 className='text-xl font-bold'>{title}</h3>
        </div>
      )}
      <div className={`px-6 pb-2 relative group ${className}`}>
        <div id={id} className={`scrollable-row-hover flex ${id === 'row-artists' || id === 'row-search-artists' ? 'gap-1' : 'gap-4'} overflow-x-auto snap-x snap-mandatory`}>
          {children}
        </div>
      </div>
    </>
  )
}

export default ScrollableRow
